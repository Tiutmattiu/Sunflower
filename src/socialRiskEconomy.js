function emit(w,type,data={}){w.evidence??=[];const row={id:`ev${++w.nextEvent}`,day:w.day,type,...data};w.evidence.push(row);w.activityLog?.push(row);return row;}
function pair(a,b){return [a,b].sort().join(':');}
function relationalPair(w,a,b){return w.relationshipEcology?.relations?.[pair(a,b)]||null;}

export function initializeSocialRisk(w){
 w.socialRisk??={};
 w.socialRisk.wong??={suspicion:0,observations:[],lastReportDay:null};
 w.socialRisk.playerRelations??={};
 if(!Number.isFinite(w.socialRisk.playerRelations.wong))w.socialRisk.playerRelations.wong=0;
 if(!Number.isFinite(w.socialRisk.playerRelations.aspen))w.socialRisk.playerRelations.aspen=0;
 w.socialRisk.aspenFavors??=[];
 w.socialRisk.privacyRequests??=[];
 w.socialRisk.authorityReports??=[];
 w.socialRisk.version=1;
 return w.socialRisk;
}

export function reconcilePrivateGiftRoutes(w){
 initializeSocialRisk(w);
 for(const gift of w.relationshipEcology?.gifts||[]){
  if(!gift.privacy)continue;
  gift.custodianId='wong';
  gift.settlementAgentId??='dima';
  gift.privacyLevel??='discreet';
  if(gift.contentsKnownToWong===undefined)gift.contentsKnownToWong=false;
 }
 return w;
}

export function createAspenPrivacyRequest(w,giftId){
 const state=initializeSocialRisk(w);reconcilePrivateGiftRoutes(w);
 const gift=w.relationshipEcology?.gifts?.find(g=>g.id===giftId);
 if(!gift||gift.status!=='in_transit'||!gift.privacy)return {ok:false,reason:'no private Aspen parcel needs help'};
 if(gift.custodianId!=='wong')return {ok:false,reason:'Wong is not handling this parcel'};
 const existing=state.privacyRequests.find(r=>r.giftId===giftId&&['open','completed'].includes(r.status));
 if(existing)return {ok:false,reason:'privacy request already exists',requestId:existing.id};
 const request={id:`aspen-privacy-${++w.nextEvent}`,giftId,requesterId:'aspen',targetId:'wong',createdDay:w.day,dueDay:Math.min(gift.dueDay??w.day+2,w.day+2),status:'open',methods:['conversation','smoke']};
 state.privacyRequests.push(request);
 emit(w,'aspen_privacy_request',{requestId:request.id,giftId,targetId:'wong',dueDay:request.dueDay});
 return {ok:true,requestId:request.id};
}

function grantAspenFavor(w,sourceId){
 const token={id:`aspen-favor-${++w.nextEvent}`,sourceId,createdDay:w.day,status:'available',usedFor:null,usedDay:null};
 w.socialRisk.aspenFavors.push(token);
 w.socialRisk.playerRelations.aspen+=1;
 const r=relationalPair(w,'aspen','wong');if(r)r.friction+=.05;
 emit(w,'aspen_favor_earned',{favorId:token.id,sourceId});
 return token;
}

export function performAspenPrivacyFavor(w,requestId,{method='conversation'}={}){
 const state=initializeSocialRisk(w),request=state.privacyRequests.find(r=>r.id===requestId),gift=request&&w.relationshipEcology?.gifts?.find(g=>g.id===request.giftId);
 if(!request||request.status!=='open')return {ok:false,reason:'privacy request is not open'};
 if(!gift||gift.status!=='in_transit')return {ok:false,reason:'parcel is no longer in transit'};
 if(w.day>request.dueDay){request.status='expired';return {ok:false,reason:'privacy window has passed'};}
 if(!['conversation','smoke'].includes(method))return {ok:false,reason:'unknown diversion method'};
 const suspicion=method==='smoke'?2:1;
 state.wong.suspicion+=suspicion;
 state.playerRelations.wong-=method==='smoke'?2:1;
 const rw=relationalPair(w,'aspen','wong');if(rw)rw.friction+=method==='smoke'?.35:.15;
 gift.privacyProtected=true;gift.contentsKnownToWong=false;gift.privacyMethod=method;
 request.status='completed';request.completedDay=w.day;request.method=method;
 const favor=grantAspenFavor(w,request.id);
 emit(w,'wong_distracted_from_private_parcel',{requestId:request.id,giftId:gift.id,method,suspicionAdded:suspicion,favorId:favor.id});
 return {ok:true,favorId:favor.id,suspicionAdded:suspicion};
}

export function consumeAspenFavor(w,purpose){
 const state=initializeSocialRisk(w),favor=state.aspenFavors.find(f=>f.status==='available');
 if(!favor)return {ok:false,reason:'no unused Aspen favour'};
 favor.status='used';favor.usedFor=purpose;favor.usedDay=w.day;
 emit(w,'aspen_favor_used',{favorId:favor.id,purpose});
 return {ok:true,favorId:favor.id};
}

export function availableAspenFavors(w){initializeSocialRisk(w);return w.socialRisk.aspenFavors.filter(f=>f.status==='available');}
export function openAspenPrivacyRequests(w){initializeSocialRisk(w);return w.socialRisk.privacyRequests.filter(r=>r.status==='open'&&r.dueDay>=w.day);}

function publicTradeAmount(row){
 const unit=Number(row.price??row.unitPrice??row.cash??row.amount??0);
 const quantity=Math.max(1,Number(row.quantity??1));
 return Math.max(0,unit*quantity);
}
function publicTradeActor(row,id){return [row.buyerId,row.sellerId,row.buyer,row.seller,row.actorId].includes(id);}

export function observeWongVisibleMarket(w,{largeThreshold=12}={}){
 const state=initializeSocialRisk(w),known=new Set(state.wong.observations.map(o=>o.observationKey));
 for(const [index,row] of (w.market?.tape||[]).entries()){
  if(!publicTradeActor(row,'player'))continue;
  const amount=publicTradeAmount(row);if(amount<largeThreshold)continue;
  const key=`public_tape:${row.day??w.day}:${row.id??index}:${amount}`;if(known.has(key))continue;
  const observation={day:w.day,observationKey:key,kind:'large_public_trade',source:'public_tape',amount,item:row.item??row.kind??row.good??null,reportable:false,reported:false};
  state.wong.observations.push(observation);known.add(key);
  emit(w,'wong_heard_large_public_trade',{amount,item:observation.item,source:'public_tape'});
 }
 return state.wong.observations;
}

export function wongLiquidityPitchEligible(w){
 const state=initializeSocialRisk(w);
 return state.wong.observations.some(o=>o.kind==='large_public_trade'&&!o.pitchUsed);
}
export function consumeWongLiquiditySignal(w){
 const state=initializeSocialRisk(w),signal=state.wong.observations.find(o=>o.kind==='large_public_trade'&&!o.pitchUsed);
 if(!signal)return null;signal.pitchUsed=true;signal.pitchUsedDay=w.day;return signal;
}

export function observeReportablePlayerConduct(w){
 const state=initializeSocialRisk(w);
 const known=new Set(state.wong.observations.map(o=>o.evidenceId).filter(Boolean));
 for(const misconduct of w.production?.misconduct||[]){
  if(!misconduct.discovered||known.has(misconduct.evidenceId))continue;
  const evidence=(w.evidence||[]).find(e=>e.id===misconduct.evidenceId);
  const publicKnowable=Boolean(evidence?.public||['public_misstatement_discovered','institutional_warning'].includes(evidence?.type));
  const wongWitness=Boolean(evidence?.people?.includes?.('wong')||evidence?.witnesses?.includes?.('wong'));
  if(!publicKnowable&&!wongWitness)continue;
  const observation={day:w.day,evidenceId:misconduct.evidenceId,observationKey:`misconduct:${misconduct.evidenceId}`,kind:misconduct.kind,source:publicKnowable?'public_record':'witnessed',reportable:true,reported:false};
  state.wong.observations.push(observation);known.add(observation.evidenceId);
  emit(w,'wong_observed_player_misconduct',{...observation});
 }
 return state.wong.observations;
}

export function processWongRetaliation(w,{threshold=4}={}){
 const state=initializeSocialRisk(w);observeReportablePlayerConduct(w);
 if(state.wong.suspicion<threshold)return null;
 const evidence=state.wong.observations.find(o=>o.reportable&&!o.reported);
 if(!evidence)return null;
 if(state.wong.lastReportDay===w.day)return null;
 const report={id:`authority-report-${++w.nextEvent}`,day:w.day,reporterId:'wong',subjectId:'player',evidenceId:evidence.evidenceId,kind:evidence.kind,status:'filed',source:evidence.source};
 state.authorityReports.push(report);evidence.reported=true;state.wong.lastReportDay=w.day;
 emit(w,'authority_report_filed',{reportId:report.id,reporterId:'wong',subjectId:'player',evidenceId:report.evidenceId,kind:report.kind});
 return report;
}

export function advanceSocialRiskEconomy(w){
 const state=initializeSocialRisk(w);reconcilePrivateGiftRoutes(w);
 for(const request of state.privacyRequests.filter(r=>r.status==='open'&&r.dueDay<w.day))request.status='expired';
 for(const gift of w.relationshipEcology?.gifts||[]){
  if(gift.status==='in_transit'&&gift.privacy&&!gift.privacyProtected&&!state.privacyRequests.some(r=>r.giftId===gift.id&&['open','completed'].includes(r.status)))createAspenPrivacyRequest(w,gift.id);
 }
 observeWongVisibleMarket(w);observeReportablePlayerConduct(w);processWongRetaliation(w);return w;
}
