const SOURCE_ORDER=['UNKNOWN','SOURCE_LOCATED','LOCALLY_AVAILABLE','ESTABLISHED'];

function reservedUnitIds(w){return new Set((w.market?.reservations||[]).filter(r=>r.kind==='unit').map(r=>r.unitId));}
function reservedCash(w,id){return (w.market?.reservations||[]).filter(r=>r.actorId===id&&r.kind==='cash').reduce((n,r)=>n+(r.amount||0),0);}
function freeCash(w,id){return Math.max(0,(w.actors[id]?.cash||0)-reservedCash(w,id));}
function unitOwner(w,unitId){for(const actor of Object.values(w.actors||{})){const unit=actor.inventory?.find(u=>u.unitId===unitId);if(unit)return {actor,unit};}return null;}
function emit(w,type,data={}){const row={id:`ev${++w.nextEvent}`,day:w.day,type,...data};w.evidence??=[];w.evidence.push(row);return row;}
function tx(w,kind,from,to,amount,purpose){w.privateTransactions??=[];w.privateTransactions.push({day:w.day,kind,from,to,amount,purpose});}

export function initializeNpcEconomy(w){
 w.npcEconomy??={securedClaims:[],sourceEvents:[],enterpriseEvents:[],version:1};
 w.sourceBook??={};
 return w;
}

export function sourceState(w,good){
 initializeNpcEconomy(w);
 if(!w.sourceBook[good])w.sourceBook[good]={good,status:'UNKNOWN',routes:[],discoveries:0,successfulReturns:0,establishedAt:null};
 return w.sourceBook[good];
}

export function recordSourceDiscovery(w,routeId,goods,{returned=false,establishAfter=3}={}){
 initializeNpcEconomy(w);
 for(const good of goods){
  const state=sourceState(w,good);
  if(!state.routes.includes(routeId))state.routes.push(routeId);
  state.discoveries+=1;
  if(SOURCE_ORDER.indexOf(state.status)<1)state.status='SOURCE_LOCATED';
  if(returned){
   state.successfulReturns+=1;
   if(SOURCE_ORDER.indexOf(state.status)<2)state.status='LOCALLY_AVAILABLE';
   if(state.successfulReturns>=establishAfter){state.status='ESTABLISHED';state.establishedAt??=w.day;}
  }
  const event={day:w.day,routeId,good,returned,status:state.status};
  w.npcEconomy.sourceEvents.push(event);
  emit(w,'source_progress',event);
 }
 return w;
}

export function createSecuredClaim(w,{borrowerId,lenderId,collateralUnitId,principal,face,dueDay,purpose='secured_advance'}){
 initializeNpcEconomy(w);
 const borrower=w.actors[borrowerId],lender=w.actors[lenderId];
 if(!borrower||!lender)return {ok:false,reason:'missing counterparty'};
 if(!Number.isFinite(principal)||principal<=0||!Number.isFinite(face)||face<principal)return {ok:false,reason:'invalid secured terms'};
 if(freeCash(w,lenderId)<principal)return {ok:false,reason:'lender lacks free cash'};
 const found=unitOwner(w,collateralUnitId);
 if(!found||found.actor.id!==borrowerId)return {ok:false,reason:'borrower does not own collateral'};
 if(reservedUnitIds(w).has(collateralUnitId)||found.unit.pledgedTo)return {ok:false,reason:'collateral is already committed'};
 lender.cash-=principal;borrower.cash+=principal;
 found.unit.pledgedTo=lenderId;
 const claim={id:`secured-${++w.nextEvent}`,type:'secured_claim',settlementModel:'secured_unit',issuerId:borrowerId,holderId:lenderId,principal,face,originalFace:face,dueDay,collateralUnitId,status:'open',purpose,createdDay:w.day};
 w.claims.push(claim);w.npcEconomy.securedClaims.push(claim.id);
 tx(w,'secured_advance',lenderId,borrowerId,principal,purpose);
 emit(w,'secured_claim_created',{claimId:claim.id,borrowerId,lenderId,collateralUnitId,principal,face,dueDay,purpose});
 return {ok:true,claimId:claim.id};
}

function releaseCollateral(w,claim){const found=unitOwner(w,claim.collateralUnitId);if(found?.unit?.pledgedTo===claim.holderId)found.unit.pledgedTo=null;}
function seizeCollateral(w,claim){
 const found=unitOwner(w,claim.collateralUnitId);if(!found)return;
 const lender=w.actors[claim.holderId];if(!lender)return;
 const index=found.actor.inventory.findIndex(u=>u.unitId===claim.collateralUnitId);if(index<0)return;
 const [unit]=found.actor.inventory.splice(index,1);unit.owner=claim.holderId;unit.pledgedTo=null;lender.inventory.push(unit);
}

export function settleSecuredClaims(w){
 initializeNpcEconomy(w);
 for(const claim of w.claims.filter(c=>c.settlementModel==='secured_unit'&&c.status==='open'&&c.dueDay<=w.day)){
  const borrower=w.actors[claim.issuerId],lender=w.actors[claim.holderId];if(!borrower||!lender)continue;
  if(freeCash(w,claim.issuerId)>=claim.face){
   borrower.cash-=claim.face;lender.cash+=claim.face;claim.paid=claim.face;claim.status='settled';releaseCollateral(w,claim);
   tx(w,'secured_repayment',claim.issuerId,claim.holderId,claim.face,claim.purpose);
   emit(w,'secured_claim_settled',{claimId:claim.id,amount:claim.face});
  }else{
   claim.paid=0;claim.status='default';seizeCollateral(w,claim);
   emit(w,'secured_claim_default',{claimId:claim.id,collateralUnitId:claim.collateralUnitId});
  }
 }
 return w;
}

export function npcEconomyDay(w){initializeNpcEconomy(w);settleSecuredClaims(w);return w;}
