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
  // Wong is the physical courier/custodian. Dima may arrange private payment or
  // counterparty trust, but does not magically replace the parcel business.
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

export function observeReportablePlayerConduct(w){
 const state=initializeSocialRisk(w);
 const known=new Set(state.wong.observations.map(o=>o.evidenceId));
 for(const misconduct of w.production?.misconduct||[]){
  if(!misconduct.discovered||known.has(misconduct.evidenceId))continue;
  const evidence=(w.evidence||[]).find(e=>e.id===misconduct.evidenceId);
  // Publicly discovered misconduct is knowable to Wong. Private misconduct only
  // becomes knowable when a later system explicitly records Wong as witness/custodian.
  const publicKnowable=Boolean(evidence?.public||['public_misstatement_discovered','institutional_warning'].includes(evidence?.type));
  const wongWitness=Boolean(evidence?.people?.includes?.('wong')||evidence?.witnesses?.includes?.('wong'));
  if(!publicKnowable&&!wongWitness)continue;
  const observation={day:w.day,evidenceId:misconduct.evidenceId,kind:misconduct.kind,source:publicKnowable?'public_record':'witnessed',reportable:true,reported:false};
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
 initializeSocialRisk(w);reconcilePrivateGiftRoutes(w);observeReportablePlayerConduct(w);processWongRetaliation(w);return w;
}
