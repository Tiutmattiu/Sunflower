import {ECONOMIC_GOODS} from './economicContent.js';
import {createSecuredClaim,JUAN_CROP_PROFILES} from './npcEconomy.js';

function reservedCash(w,id){return (w.market?.reservations||[]).filter(r=>r.actorId===id&&r.kind==='cash').reduce((n,r)=>n+(r.amount||0),0);}
function freeCash(w,id){return Math.max(0,(w.actors[id]?.cash||0)-reservedCash(w,id));}
function reservedUnits(w){return new Set((w.market?.reservations||[]).filter(r=>r.kind==='unit').map(r=>r.unitId));}
function unitOwner(w,unitId){for(const actor of Object.values(w.actors||{})){const unit=actor.inventory?.find(u=>u.unitId===unitId);if(unit)return {actor,unit};}return null;}
function livingAsset(w,assetId){return (w.livingAssets||[]).find(a=>a.id===assetId)||null;}
function tx(w,kind,from,to,amount,purpose){w.privateTransactions??=[];w.privateTransactions.push({day:w.day,kind,from,to,amount,purpose});}
function emit(w,type,data={}){const row={id:`ev${++w.nextEvent}`,day:w.day,type,...data};w.evidence??=[];w.evidence.push(row);return row;}
function ensureBook(w){w.npcEconomy??={};w.npcEconomy.guarantees??=[];w.npcEconomy.claimTrades??=[];w.npcEconomy.workouts??=[];return w.npcEconomy;}

export function yasminSecuredAdvance(w,borrowerId,collateralId,{requestedPrincipal=Infinity,advanceRate=.6,term=5}={}){
 ensureBook(w);
 const found=unitOwner(w,collateralId);
 const plant=livingAsset(w,collateralId);
 let recoveryValue,appraisedKind,claimTerms;
 if(found&&found.actor.id===borrowerId){
  const value=ECONOMIC_GOODS[found.unit.kind]?.value;
  if(!Number.isFinite(value)||value<=0)return {ok:false,reason:'collateral has no appraised recovery value'};
  recoveryValue=Math.max(1,Math.floor(value*.85));appraisedKind=found.unit.kind;claimTerms={collateralUnitId:collateralId};
 }else if(plant&&plant.ownerId===borrowerId){
  const profile=JUAN_CROP_PROFILES[plant.species];
  if(!profile)return {ok:false,reason:'collateral has no appraised recovery value'};
  const biologicalValue=profile.matureValue*Math.max(.4,Number(plant.health??1));
  recoveryValue=Math.max(1,Math.floor(biologicalValue*.65));appraisedKind=plant.species;claimTerms={collateralAssetId:collateralId};
 }else return {ok:false,reason:'borrower does not own collateral'};
 const cap=Math.max(1,Math.floor(recoveryValue*advanceRate));
 const principal=Math.min(Number.isFinite(requestedPrincipal)?requestedPrincipal:cap,cap);
 if(principal<1)return {ok:false,reason:'haircut leaves no advanceable value'};
 const face=principal+Math.max(1,Math.ceil(principal*.2));
 const result=createSecuredClaim(w,{borrowerId,lenderId:'yasmin',...claimTerms,principal,face,dueDay:w.day+term,purpose:'yasmin_secured_advance'});
 if(!result.ok)return result;
 const claim=w.claims.find(c=>c.id===result.claimId);
 claim.recoveryValue=recoveryValue;claim.advanceRate=advanceRate;claim.appraisedKind=appraisedKind;claim.privateCapital=true;
 emit(w,'yasmin_secured_advance',{claimId:claim.id,borrowerId,collateralId,principal,face,recoveryValue,advanceRate});
 return {ok:true,claimId:claim.id,principal,face,recoveryValue};
}

export function sellUnitOutright(w,sellerId,buyerId,unitId,price,{purpose='private_sale'}={}){
 ensureBook(w);
 const found=unitOwner(w,unitId),buyer=w.actors[buyerId];
 if(!found||found.actor.id!==sellerId)return {ok:false,reason:'seller does not own unit'};
 if(!buyer||!Number.isFinite(price)||price<=0)return {ok:false,reason:'invalid sale terms'};
 if(found.unit.pledgedTo||reservedUnits(w).has(unitId))return {ok:false,reason:'unit is committed elsewhere'};
 if(freeCash(w,buyerId)<price)return {ok:false,reason:'buyer lacks free cash'};
 buyer.cash-=price;found.actor.cash+=price;
 const index=found.actor.inventory.findIndex(u=>u.unitId===unitId);const [unit]=found.actor.inventory.splice(index,1);unit.owner=buyerId;buyer.inventory.push(unit);
 tx(w,'outright_private_sale',buyerId,sellerId,price,purpose);emit(w,'outright_private_sale',{sellerId,buyerId,unitId,price,purpose});
 return {ok:true,price};
}

export function dimaBuyClaim(w,claimId,price){
 const book=ensureBook(w),claim=w.claims.find(c=>c.id===claimId);
 if(!claim||claim.status!=='open'||!claim.holderId)return {ok:false,reason:'claim is not transferable'};
 if(claim.holderId==='dima')return {ok:false,reason:'Dima already holds the claim'};
 if(!Number.isFinite(price)||price<=0||price>claim.face)return {ok:false,reason:'invalid claim purchase price'};
 const sellerId=claim.holderId;if(!w.actors[sellerId]||freeCash(w,'dima')<price)return {ok:false,reason:'claim seller or Dima liquidity missing'};
 w.actors.dima.cash-=price;w.actors[sellerId].cash+=price;claim.previousHolderId=sellerId;claim.holderId='dima';claim.purchasePrice=price;claim.purchasedDay=w.day;
 const trade={day:w.day,claimId,from:sellerId,to:'dima',price,face:claim.face};book.claimTrades.push(trade);tx(w,'claim_purchase','dima',sellerId,price,claimId);emit(w,'dima_claim_purchase',trade);
 return {ok:true,claimId,price};
}

export function dimaExtendClaim(w,claimId,{fee=2,extraDays=3}={}){
 const book=ensureBook(w),claim=w.claims.find(c=>c.id===claimId);
 if(!claim||claim.status!=='open'||claim.holderId!=='dima')return {ok:false,reason:'Dima does not hold an open claim'};
 if(!(fee>0&&extraDays>0)||freeCash(w,claim.issuerId)<fee)return {ok:false,reason:'extension fee cannot be paid'};
 w.actors[claim.issuerId].cash-=fee;w.actors.dima.cash+=fee;const oldDue=claim.dueDay;claim.dueDay+=extraDays;claim.extensions=(claim.extensions||0)+1;
 const workout={day:w.day,type:'extension',claimId,fee,oldDue,newDue:claim.dueDay};book.workouts.push(workout);tx(w,'claim_extension_fee',claim.issuerId,'dima',fee,claimId);emit(w,'dima_claim_extended',workout);
 return {ok:true,claimId,newDue:claim.dueDay};
}

export function dimaGuaranteeClaim(w,claimId,{fee=1,coverage=null}={}){
 const book=ensureBook(w),claim=w.claims.find(c=>c.id===claimId);
 if(!claim||claim.status!=='open'||!claim.holderId)return {ok:false,reason:'claim cannot be guaranteed'};
 if(book.guarantees.some(g=>g.claimId===claimId&&g.status==='active'))return {ok:false,reason:'claim is already guaranteed'};
 const covered=Math.min(claim.face,Number.isFinite(coverage)?coverage:claim.face);
 if(!(fee>0&&covered>0)||freeCash(w,claim.issuerId)<fee||freeCash(w,'dima')<covered)return {ok:false,reason:'guarantee fee or capacity unavailable'};
 w.actors[claim.issuerId].cash-=fee;w.actors.dima.cash+=fee;tx(w,'guarantee_fee',claim.issuerId,'dima',fee,claimId);
 const guarantee={id:`dima-guarantee-${++w.nextEvent}`,claimId,issuerId:claim.issuerId,holderId:claim.holderId,guarantorId:'dima',coverage:covered,fee,status:'active',createdDay:w.day,paid:0};book.guarantees.push(guarantee);emit(w,'dima_guarantee_created',{guaranteeId:guarantee.id,claimId,coverage:covered,fee});
 return {ok:true,guaranteeId:guarantee.id};
}

export function settleDimaGuarantees(w){
 const book=ensureBook(w);
 for(const guarantee of book.guarantees.filter(g=>g.status==='active')){
  const claim=w.claims.find(c=>c.id===guarantee.claimId);if(!claim||claim.status!=='default')continue;
  const amount=Math.min(guarantee.coverage,freeCash(w,'dima'));const holder=w.actors[guarantee.holderId];
  if(amount>0&&holder){w.actors.dima.cash-=amount;holder.cash+=amount;tx(w,'guarantee_call','dima',guarantee.holderId,amount,claim.id);}
  guarantee.paid=amount;guarantee.status=amount>=guarantee.coverage?'called':'breached';guarantee.calledDay=w.day;
  if(amount>0){const recourse={id:`recourse-${++w.nextEvent}`,type:'guarantee_recourse',issuerId:guarantee.issuerId,holderId:'dima',face:amount,originalFace:amount,dueDay:w.day+5,status:'open',purpose:`recourse_${claim.id}`,createdDay:w.day};w.claims.push(recourse);guarantee.recourseClaimId=recourse.id;}
  emit(w,'dima_guarantee_called',{guaranteeId:guarantee.id,claimId:claim.id,amount,status:guarantee.status});
 }
 return w;
}
