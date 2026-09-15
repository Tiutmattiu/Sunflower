import {ECONOMIC_GOODS} from './economicContent.js';
import {sourceState} from './npcEconomy.js';
import {requestLocatedImport} from './routeSources.js';

const WHALE_OIL='Sperm Whale Oil';
const DEPOSIT_REQUIREMENT=8;
const COLLATERAL_HAIRCUT=.6;
const PRIVATE_PREVIEW_DAYS=3;

function emit(w,type,data={}){w.evidence??=[];const row={id:`ev${++w.nextEvent}`,day:w.day,type,...data};w.evidence.push(row);w.activityLog?.push(row);return row;}
function reservedUnits(w,actorId){return new Set((w.market?.reservations||[]).filter(r=>r.actorId===actorId&&r.kind==='unit').map(r=>r.unitId));}
function freeCash(w,id){const reserved=(w.market?.reservations||[]).filter(r=>r.actorId===id&&r.kind==='cash').reduce((n,r)=>n+(r.amount||0),0);return Math.max(0,(w.actors?.[id]?.cash||0)-reserved);}
function credential(w,kind,extra={}){const row={id:`credential-${++w.nextEvent}`,kind,ownerId:'player',issuedDay:w.day,...extra};w.yasminAccess.credentials.push(row);return row;}

export function initializeYasminAccess(w){
 w.yasminAccess??={
  credentials:[],fakeTokenChecked:false,dimaBriefKnown:false,whaleOilNeedKnown:false,whaleOilDelivered:false,
  playerContribution:null,invited:false,capacityApproved:false,capacityBasis:null,deliveries:[],leadOrderId:null,
 };
 w.yasminAccess.credentials??=[];w.yasminAccess.deliveries??=[];
 if(w.playerGame?.routes?.yasmin&&w.playerGame.routes.yasmin.privateAccess===undefined)w.playerGame.routes.yasmin.privateAccess=false;
 return w.yasminAccess;
}

export function issueWongFakeTentacle(w){
 const state=initializeYasminAccess(w);
 const existing=state.credentials.find(c=>c.kind==='Dried Octopus Tentacle'&&c.ownerId==='player');
 if(existing)return {ok:false,reason:'Wong already gave you his version',credentialId:existing.id};
 const row=credential(w,'Dried Octopus Tentacle',{material:'dried food',issuerId:'wong',claimedPurpose:'film_night_invitation',serial:null,valid:false});
 emit(w,'wong_fake_film_token',{credentialId:row.id,issuerId:'wong'});
 return {ok:true,credentialId:row.id};
}

export function presentYasminCredential(w,credentialId){
 const state=initializeYasminAccess(w),row=state.credentials.find(c=>c.id===credentialId&&c.ownerId==='player');
 if(!row)return {ok:false,reason:'credential_not_found'};
 if(row.kind==='Dried Octopus Tentacle'){
  state.fakeTokenChecked=true;row.checkedDay=w.day;row.valid=false;
  emit(w,'yasmin_rejected_dried_tentacle',{credentialId:row.id,reason:'not_an_invitation'});
  return {ok:false,reason:'not_an_invitation',learned:'real invitation is a serialled silver tentacle'};
 }
 if(row.kind==='Silver Octopus Tentacle Guest Token'&&row.valid){state.invited=true;return {ok:true,reason:'valid_invitation'};}
 return {ok:false,reason:'not_an_invitation'};
}

export function requestDimaFilmBrief(w,{role='unknown'}={}){
 const state=initializeYasminAccess(w);
 if(!w.actors?.player?.contacts?.includes('dima'))return {ok:false,reason:'Dima does not know the player well enough to discuss the private request'};
 state.dimaBriefKnown=true;state.whaleOilNeedKnown=true;state.dimaRoleAnswer=role;
 emit(w,'dima_film_restoration_brief',{roleAnswer:role,need:WHALE_OIL,venue:'Old Hall',purpose:'film-night restoration and charity event'});
 return {ok:true,need:WHALE_OIL,purpose:'Old Hall film-night restoration',question:'Can you actually source or settle an outside cargo lot?'};
}

function freeOwnedUnit(w,actorId,kind){const reserved=reservedUnits(w,actorId);return w.actors?.[actorId]?.inventory?.find(u=>u.kind===kind&&!u.pledgedTo&&!reserved.has(u.unitId));}
function grantSilverToken(w,reason){
 const state=initializeYasminAccess(w);
 let row=state.credentials.find(c=>c.kind==='Silver Octopus Tentacle Guest Token'&&c.ownerId==='player'&&c.valid);
 if(!row)row=credential(w,'Silver Octopus Tentacle Guest Token',{material:'925 silver',issuerId:'yasmin',event:'Old Hall Film Night Charity Auction',serial:`OH-${w.day}-${String(w.nextEvent).padStart(4,'0')}`,valid:true,earnedBy:reason});
 state.invited=true;
 emit(w,'yasmin_film_invitation_issued',{credentialId:row.id,serial:row.serial,earnedBy:reason});
 return row;
}

export function arrangeWhaleOilDelivery(w,{sellerId='player'}={}){
 const state=initializeYasminAccess(w);
 if(!state.whaleOilNeedKnown)return {ok:false,reason:'the film-restoration need is not known'};
 const unit=freeOwnedUnit(w,sellerId,WHALE_OIL);if(!unit)return {ok:false,reason:'seller does not own an uncommitted Sperm Whale Oil unit'};
 const salePrice=ECONOMIC_GOODS[WHALE_OIL]?.value||18,brokerFee=2,courierFee=1,total=salePrice+brokerFee+courierFee;
 if(freeCash(w,'yasmin')<total)return {ok:false,reason:'Yasmin cannot fund the purchase and services now'};
 const seller=w.actors[sellerId],idx=seller.inventory.indexOf(unit);seller.inventory.splice(idx,1);unit.owner='yasmin';unit.custodianId='wong';unit.privateDelivery=true;w.actors.yasmin.inventory.push(unit);
 w.actors.yasmin.cash-=total;seller.cash+=salePrice;w.actors.dima.cash+=brokerFee;w.actors.wong.cash+=courierFee;
 const dueDay=w.day+1,delivery={id:`whale-delivery-${++w.nextEvent}`,unitId:unit.unitId,sellerId,createdDay:w.day,dueDay,status:'in_transit',brokerId:'dima',courierId:'wong'};
 state.deliveries.push(delivery);state.playerContribution=sellerId==='player'?'physical_oil':state.playerContribution;
 w.privateTransactions??=[];
 w.privateTransactions.push({day:w.day,kind:'whale_oil_private_purchase',from:'yasmin',to:sellerId,amount:salePrice,item:WHALE_OIL,unitId:unit.unitId});
 w.privateTransactions.push({day:w.day,kind:'whale_oil_broker_fee',from:'yasmin',to:'dima',amount:brokerFee,item:WHALE_OIL,unitId:unit.unitId});
 w.privateTransactions.push({day:w.day,kind:'whale_oil_courier_fee',from:'yasmin',to:'wong',amount:courierFee,item:WHALE_OIL,unitId:unit.unitId});
 emit(w,'whale_oil_private_delivery_arranged',{deliveryId:delivery.id,unitId:unit.unitId,sellerId,salePrice,brokerFee,courierFee,dueDay});
 return {ok:true,deliveryId:delivery.id,salePrice,brokerFee,courierFee,dueDay};
}

export function shareWhaleOilSourceLead(w,{mode='share'}={}){
 const state=initializeYasminAccess(w);
 if(!state.whaleOilNeedKnown)return {ok:false,reason:'the Whale Oil need is not known'};
 const source=sourceState(w,WHALE_OIL);if(!['SOURCE_LOCATED','LOCALLY_AVAILABLE','ESTABLISHED'].includes(source.status))return {ok:false,reason:'player has no actionable Whale Oil source lead'};
 if(state.leadOrderId)return {ok:false,reason:'Yasmin already acted on this lead'};
 const order=source.status==='ESTABLISHED'
  ? null
  : requestLocatedImport(w,WHALE_OIL,'yasmin',{quantity:1});
 if(order&&!order.ok)return order;
 if(source.status==='ESTABLISHED')return {ok:false,reason:'established-source direct order path not yet wired for this event'};
 state.playerContribution='source_lead';state.leadMode=mode;state.leadOrderId=order.orderId;
 if(mode==='sell'&&freeCash(w,'yasmin')>=3){w.actors.yasmin.cash-=3;w.actors.player.cash+=3;w.privateTransactions??=[];w.privateTransactions.push({day:w.day,kind:'whale_oil_source_lead',from:'yasmin',to:'player',amount:3,item:WHALE_OIL});}
 emit(w,'whale_oil_source_lead_shared',{mode,sourceStatus:source.status,orderId:order.orderId,routeId:source.routes?.[0]});
 return {ok:true,orderId:order.orderId,mode};
}

function openEarnedAuctionWindow(w){
 const route=w.playerGame?.routes?.yasmin;if(!route||route.privateAccess)return;
 route.privateAccess=true;
 route.stage='qualified';route.preview=false;route.inspected=false;route.provenance=false;route.bid=null;route.resolved=false;
 route.previewOpens=w.day;
 route.previewCloses=w.day+PRIVATE_PREVIEW_DAYS-1;
 route.auctionDay=route.previewCloses+1;
 emit(w,'yasmin_private_auction_window_opened',{previewOpens:route.previewOpens,previewCloses:route.previewCloses,auctionDay:route.auctionDay});
}

export function proveSettlementCapacity(w){
 const state=initializeYasminAccess(w);
 if(!state.invited)return {ok:false,reason:'no valid film-night invitation'};
 if(freeCash(w,'player')>=DEPOSIT_REQUIREMENT){state.capacityApproved=true;state.capacityBasis='cash';state.capacityValue=freeCash(w,'player');}
 else{
  const reserved=reservedUnits(w,'player');
  const candidates=(w.actors.player.inventory||[]).filter(u=>!u.pledgedTo&&!reserved.has(u.unitId));
  const best=candidates.map(u=>({u,recovery:Math.floor((ECONOMIC_GOODS[u.kind]?.value||0)*COLLATERAL_HAIRCUT)})).sort((a,b)=>b.recovery-a.recovery)[0];
  if(!best||best.recovery<DEPOSIT_REQUIREMENT)return {ok:false,reason:'insufficient liquid cash or eligible collateral for auction settlement'};
  state.capacityApproved=true;state.capacityBasis='collateral';state.capacityValue=best.recovery;state.capacityUnitId=best.u.unitId;
 }
 openEarnedAuctionWindow(w);
 emit(w,'yasmin_settlement_capacity_verified',{basis:state.capacityBasis,value:state.capacityValue,unitId:state.capacityUnitId||null});
 return {ok:true,basis:state.capacityBasis,value:state.capacityValue};
}

export function canEnterFilmAuction(w){const state=initializeYasminAccess(w);return Boolean(state.invited&&state.capacityApproved);}

export function advanceYasminAccess(w){
 const state=initializeYasminAccess(w);
 for(const delivery of state.deliveries.filter(d=>d.status==='in_transit'&&d.dueDay<=w.day)){
  const unit=w.actors.yasmin.inventory.find(u=>u.unitId===delivery.unitId);if(!unit){delivery.status='failed';continue;}
  unit.custodianId='yasmin';delivery.status='delivered';delivery.deliveredDay=w.day;state.whaleOilDelivered=true;
  emit(w,'whale_oil_delivered_to_yasmin',{deliveryId:delivery.id,unitId:delivery.unitId});
  if(delivery.sellerId==='player')grantSilverToken(w,'physical_oil_delivery');
 }
 if(state.playerContribution==='source_lead'&&!state.whaleOilDelivered){
  const oil=w.actors.yasmin.inventory.find(u=>u.kind===WHALE_OIL&&['located_route_source','established_route_source','route_outer_import'].includes(u.source));
  if(oil){state.whaleOilDelivered=true;grantSilverToken(w,'source_lead');emit(w,'yasmin_whale_oil_sourced_from_player_lead',{unitId:oil.unitId,orderId:state.leadOrderId});}
 }
 return w;
}

export const YASMIN_FILM_ACCESS_TERMS=Object.freeze({whaleOil:WHALE_OIL,depositRequirement:DEPOSIT_REQUIREMENT,collateralHaircut:COLLATERAL_HAIRCUT,privatePreviewDays:PRIVATE_PREVIEW_DAYS});
