import {ECONOMIC_GOODS} from './economicContent.js';

const ROUTE_NEEDS=Object.freeze({
 short:Object.freeze(['Packing Paper','Reusable Crate','Hardtack Tin']),
 medium:Object.freeze(['Lime','Reusable Crate','Brake Cable','Packing Paper']),
 outer:Object.freeze(['Reusable Crate','Rope Offcut','Brake Cable','Hardtack Tin']),
});

function emit(w,type,data={}){w.evidence??=[];const row={id:`ev${++w.nextEvent}`,day:w.day,type,...data};w.evidence.push(row);w.activityLog?.push(row);return row;}
function reservedCash(w,id){return (w.market?.reservations||[]).filter(r=>r.actorId===id&&r.kind==='cash').reduce((n,r)=>n+(r.amount||0),0);}
function freeCash(w,id){return Math.max(0,(w.actors?.[id]?.cash||0)-reservedCash(w,id));}
function freeUnit(w,actorId,kind){const reserved=new Set((w.market?.reservations||[]).filter(r=>r.kind==='unit').map(r=>r.unitId));return w.actors?.[actorId]?.inventory?.find(u=>u.kind===kind&&!u.pledgedTo&&!reserved.has(u.unitId));}

export function initializeAspenCommissions(w){
 w.aspenCommissions??={offers:[],playerReliability:0,playerDefaults:0,nextNaturalDay:Math.max(1,(w.day||0)+2)};
 w.aspenCommissions.offers??=[];
 return w.aspenCommissions;
}

function chosenRoute(w){return w.aspenRoute?.selectedRoute||w.aspenRoute?.activeRoute||'short';}
function pickNeed(w,routeId){
 const pool=ROUTE_NEEDS[routeId]||ROUTE_NEEDS.short;
 const fulfilled=new Set(initializeAspenCommissions(w).offers.filter(o=>o.status==='fulfilled').map(o=>o.good));
 const fresh=pool.filter(kind=>!fulfilled.has(kind));
 const candidates=fresh.length?fresh:pool;
 return candidates[((w.seed||0)+(w.day||0)+w.aspenCommissions.offers.length)%candidates.length];
}

export function refreshAspenCommission(w,{force=false,ignoreCadence=false}={}){
 const state=initializeAspenCommissions(w);
 const open=state.offers.find(o=>o.status==='open');if(open)return open;
 if(w.aspenRoute?.status==='away')return null;
 if(!force&&!ignoreCadence&&w.day<state.nextNaturalDay)return null;
 const routeId=chosenRoute(w),good=pickNeed(w,routeId),definition=ECONOMIC_GOODS[good];
 if(!definition)return null;
 const referenceValue=Math.max(1,Number(definition.value)||1);
 const urgency=routeId==='outer'?2:1;
 const reward=referenceValue+urgency;
 if(freeCash(w,'aspen')<reward+4)return null;
 const offer={id:`aspen-commission-${++w.nextEvent}`,day:w.day,routeId,good,quantity:1,referenceValue,reward,dueDay:w.day+(routeId==='outer'?3:2),status:'open',accepted:false,fulfilledDay:null};
 state.offers.push(offer);state.nextNaturalDay=w.day+3;
 emit(w,'aspen_sourcing_commission_posted',{commissionId:offer.id,routeId,good,reward,dueDay:offer.dueDay});
 return offer;
}

export function fulfillAspenCommission(w,offerId,actorId='player'){
 const state=initializeAspenCommissions(w),offer=state.offers.find(o=>o.id===offerId);
 if(!offer||offer.status!=='open')return {ok:false,reason:'commission is not open'};
 if(w.day>offer.dueDay){offer.status='expired';return {ok:false,reason:'commission deadline passed'};}
 const unit=freeUnit(w,actorId,offer.good);if(!unit)return {ok:false,reason:`need one uncommitted ${offer.good}`};
 if(freeCash(w,'aspen')<offer.reward)return {ok:false,reason:'Aspen cannot fund the promised sourcing price now'};
 const actor=w.actors[actorId],index=actor.inventory.indexOf(unit);actor.inventory.splice(index,1);unit.owner='aspen';w.actors.aspen.inventory.push(unit);
 w.actors.aspen.cash-=offer.reward;actor.cash+=offer.reward;
 offer.status='fulfilled';offer.fulfilledDay=w.day;offer.unitId=unit.unitId;offer.supplierId=actorId;
 if(actorId==='player')state.playerReliability+=1;
 w.privateTransactions??=[];w.privateTransactions.push({day:w.day,kind:'aspen_sourcing_commission',from:'aspen',to:actorId,amount:offer.reward,item:offer.good,unitId:unit.unitId,commissionId:offer.id});
 emit(w,'aspen_sourcing_commission_fulfilled',{commissionId:offer.id,actorId,good:offer.good,reward:offer.reward,unitId:unit.unitId});
 return {ok:true,reward:offer.reward,unitId:unit.unitId};
}

export function advanceAspenCommissions(w){
 const state=initializeAspenCommissions(w);
 for(const offer of state.offers.filter(o=>o.status==='open'&&o.dueDay<w.day)){
  offer.status='expired';
  // A posted request is not a promise. The player incurs no default unless a
  // later explicit acceptance/forward-contract mechanic made it binding.
  emit(w,'aspen_sourcing_commission_expired',{commissionId:offer.id,good:offer.good});
 }
 if(w.aspenRoute?.status!=='away')refreshAspenCommission(w);
 return w;
}

export function openAspenCommissions(w){return initializeAspenCommissions(w).offers.filter(o=>o.status==='open'&&o.dueDay>=w.day);}
export {ROUTE_NEEDS as ASPEN_ROUTE_LOCAL_NEEDS};
