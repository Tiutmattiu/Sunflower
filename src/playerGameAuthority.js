import * as legacy from './playerGameLegacy.js';
import {ECONOMIC_GOODS as GOODS} from './economicContent.js';
import {canEnterFilmAuction} from './yasminAccess.js';

const YASMIN_AUCTION_ACTIONS=new Set([
 'auction_preview','auction_inspect','auction_provenance','auction_finance','auction_bid','auction_walk',
]);
const ACCESS_BLOCK='Private auction access requires Yasmin’s invitation and verified settlement capacity.';
const INVITATION_FISH='Exceptional Invitation Fish';
const INVITATION_FISH_PRICE=10;
const ONEWHEEL_CARGO=Object.freeze({
 'Chain Quick-Link':Object.freeze({arrivalDay:2,price:2}),
 'Brake Cable':Object.freeze({arrivalDay:3,price:2}),
 'Steel Rim':Object.freeze({arrivalDay:4,price:5}),
 'Handlebar Tape':Object.freeze({arrivalDay:5,price:2}),
 'Presta Inner Tube':Object.freeze({arrivalDay:5,price:GOODS['Presta Inner Tube']?.value||8}),
});

function blockedCopy(current,message=ACCESS_BLOCK){
 const w=structuredClone(current);
 w.playerGame.lastBlock=message;
 return w;
}

function reservedUnitIds(w,actorId){
 return new Set((w.market?.reservations||[]).filter(r=>r.actorId===actorId&&r.kind==='unit').map(r=>r.unitId));
}

function playerAvailableCash(w){
 const reserved=(w.market?.reservations||[])
  .filter(r=>r.actorId==='player'&&r.kind==='cash')
  .reduce((n,r)=>n+(r.amount||0),0);
 const committed=(w.playerGame?.commitments||[])
  .filter(c=>c.status==='open')
  .reduce((n,c)=>n+(c.lockedCash||0),0);
 return (w.actors?.player?.cash||0)-reserved-committed;
}

function availableSellerUnit(w,sellerId,kind){
 const seller=w.actors?.[sellerId];if(!seller)return null;
 const reserved=reservedUnitIds(w,sellerId);
 return seller.inventory.find(u=>u.kind===kind&&!u.pledgedTo&&!reserved.has(u.unitId))||null;
}

function availableInvitationFish(w){
 const route=w.playerGame?.routes?.sonya;
 if(!route)return null;
 const fish=availableSellerUnit(w,'small_boats',INVITATION_FISH);
 return fish?.invitationSupperDay===route.supperDay?fish:null;
}

function emitWorld(w,type,data={}){
 const row={id:`ev${++w.nextEvent}`,day:w.day,type,...data};
 w.evidence??=[];w.evidence.push(row);
 w.activityLog?.push(row);
 return row;
}

function notePlayer(w,type,summary,data={}){
 const row={
  id:`player-${++w.nextEvent}`,day:w.day,type,summary,
  source:'local_observation',location:w.playerGame.location,confidence:1,freshness:'current',
  people:data.people||[],goods:data.goods||[],claims:[],situation:data.situation||null,process:data.process||{},style:data.style||{},weight:data.weight||1,returnClass:data.returnClass||null,
  context:{cash:w.actors.player.cash,reserved:(w.market?.reservations||[]).filter(r=>r.actorId==='player'),commitments:(w.playerGame?.commitments||[]).filter(c=>c.status==='open'),...(data.context||{})},
 };
 w.evidence.push(row);w.playerGame.notebook??=[];w.playerGame.notebook.push(row.id);
 return row;
}

function landInvitationFish(w){
 const route=w.playerGame?.routes?.sonya,boats=w.actors?.small_boats;
 if(!route||!boats||route.stage!=='invited'||!Number.isFinite(route.supperDay)||route.rareFishUnitId)return null;
 if(w.day!==route.supperDay-1)return null;
 const existing=boats.inventory.find(u=>u.kind===INVITATION_FISH&&u.invitationSupperDay===route.supperDay);
 if(existing)return existing;
 const alreadyLanded=(w.evidence||[]).some(e=>e.type==='invitation_fish_landed'&&e.supperDay===route.supperDay);
 if(alreadyLanded)return null;
 const unit={
  unitId:`u${++w.nextUnit}`,kind:INVITATION_FISH,owner:'small_boats',age:0,
  costBasis:GOODS[INVITATION_FISH]?.value||INVITATION_FISH_PRICE,
  source:'small_boat_invitation_catch',opened:false,remaining:GOODS[INVITATION_FISH]?.servings||1,
  freshUntil:route.supperDay,invitationSupperDay:route.supperDay,
 };
 boats.inventory.push(unit);
 emitWorld(w,'invitation_fish_landed',{unitId:unit.unitId,item:INVITATION_FISH,actorId:'small_boats',supperDay:route.supperDay,freshUntil:unit.freshUntil});
 return unit;
}

function landOnewheelCargo(w){
 const supplier=w.actors?.wharf_suppliers;if(!supplier)return;
 for(const [kind,terms] of Object.entries(ONEWHEEL_CARGO)){
  if(w.day!==terms.arrivalDay)continue;
  const alreadyRecorded=(w.evidence||[]).some(e=>e.type==='onewheel_part_landed'&&e.item===kind&&e.arrivalDay===terms.arrivalDay);
  if(alreadyRecorded)continue;
  const existing=supplier.inventory.find(u=>u.kind===kind);
  if(existing){
   emitWorld(w,'onewheel_part_landed',{unitId:existing.unitId,item:kind,actorId:'wharf_suppliers',arrivalDay:terms.arrivalDay,existingStock:true});
   continue;
  }
  const unit={
   unitId:`u${++w.nextUnit}`,kind,owner:'wharf_suppliers',age:0,costBasis:terms.price,
   source:'onewheel_cargo_arrival',opened:false,remaining:GOODS[kind]?.servings||1,
   cargoArrivalDay:terms.arrivalDay,
  };
  supplier.inventory.push(unit);
  emitWorld(w,'onewheel_part_landed',{unitId:unit.unitId,item:kind,actorId:'wharf_suppliers',arrivalDay:terms.arrivalDay,existingStock:false});
 }
}

function buyInvitationFish(current){
 const w=structuredClone(current),route=w.playerGame?.routes?.sonya;
 w.playerGame.lastBlock=null;
 if(!route||route.stage!=='invited'||!Number.isFinite(route.supperDay))return blockedCopy(current,'There is no dated supper catch to collect.');
 if(route.rareFishUnitId)return blockedCopy(current,'You have already collected the supper catch.');
 if(w.playerGame.location!=='harbour_berth'||w.day<route.supperDay-1||w.day>route.supperDay)return blockedCopy(current,'The invitation catch is only available at the berth around the dated supper.');
 const fish=availableInvitationFish(w);
 if(!fish)return blockedCopy(current,'The exceptional catch has not landed with the small boats.');
 if((w.attention?.used||0)>=(w.attention?.budget||0))return blockedCopy(current,'Not enough attention remains for this intervention.');
 if(playerAvailableCash(w)<INVITATION_FISH_PRICE)return blockedCopy(current,`Not enough available cash: ${INVITATION_FISH_PRICE}🥫 required.`);
 const boats=w.actors.small_boats,index=boats.inventory.findIndex(u=>u.unitId===fish.unitId);
 if(index<0)return blockedCopy(current,'The exceptional catch is no longer with the small boats.');
 w.attention.used+=1;
 w.actors.player.cash-=INVITATION_FISH_PRICE;boats.cash+=INVITATION_FISH_PRICE;
 const [unit]=boats.inventory.splice(index,1);unit.owner='player';w.actors.player.inventory.push(unit);
 route.rareFishUnitId=unit.unitId;
 notePlayer(w,'invitation_fish_sourced','Bought the difficult invitation catch from the small boats while it was genuinely fresh.',{
  people:['small_boats'],goods:[INVITATION_FISH],weight:3,returnClass:'TRADE',process:{execution:.8,commitments:.6},
 });
 return w;
}

function buyOnewheelPart(current,payload={}){
 const w=structuredClone(current),kind=String(payload.kind||''),terms=ONEWHEEL_CARGO[kind];
 w.playerGame.lastBlock=null;
 if(!w.playerGame?.knowledge?.includes('onewheel_plan'))return blockedCopy(current,'You have not worked out which parts fit this build.');
 if(!terms)return blockedCopy(current,'That is not an authored component for Aspen’s one-wheel build.');
 if(w.playerGame.location!=='harbour_berth')return blockedCopy(current,'Cargo purchase requires presence at the berth.');
 if(w.day<terms.arrivalDay)return blockedCopy(current,`${kind} has not arrived; current notice expects day ${terms.arrivalDay}.`);
 if(w.actors.player.inventory.some(u=>u.kind===kind))return blockedCopy(current,`${kind} is already in your owned inventory.`);
 const unit=availableSellerUnit(w,'wharf_suppliers',kind);
 if(!unit)return blockedCopy(current,`${kind} is not available as uncommitted physical stock at the berth.`);
 if((w.attention?.used||0)>=(w.attention?.budget||0))return blockedCopy(current,'Not enough attention remains for this intervention.');
 if(playerAvailableCash(w)<terms.price)return blockedCopy(current,`Not enough available cash: ${terms.price}🥫 required.`);
 const supplier=w.actors.wharf_suppliers,index=supplier.inventory.findIndex(u=>u.unitId===unit.unitId);
 if(index<0)return blockedCopy(current,`${kind} is no longer with the berth supplier.`);
 w.attention.used+=1;w.actors.player.cash-=terms.price;supplier.cash+=terms.price;
 const [moved]=supplier.inventory.splice(index,1);moved.owner='player';moved.costBasis=terms.price;w.actors.player.inventory.push(moved);
 notePlayer(w,'onewheel_part_bought',`Bought the landed ${kind} from the berth supplier for ${terms.price}🥫.`,{
  people:['wharf_suppliers'],goods:[kind],returnClass:'TRADE',process:{valuation:.2,execution:.7,liquidityCredit:.2},context:{unitId:moved.unitId,arrivalDay:terms.arrivalDay,price:terms.price},
 });
 return w;
}

export function visibleActions(w){
 let rows=legacy.visibleActions(w);
 if(!canEnterFilmAuction(w))rows=rows.filter(row=>!YASMIN_AUCTION_ACTIONS.has(row.id));
 const fish=availableInvitationFish(w);
 rows=rows.map(row=>row.id==='source_invitation_fish'&&!fish
  ? {...row,disabled:true,reason:'The exceptional catch has not landed with the small boats.'}
  : row);
 rows=rows.map(row=>{
  if(row.id!=='buy_part')return row;
  const kind=row.payload?.kind,terms=ONEWHEEL_CARGO[kind];
  if(!terms||w.day<terms.arrivalDay)return row;
  const unit=availableSellerUnit(w,'wharf_suppliers',kind);
  return unit?row:{...row,disabled:true,reason:`${kind} is not available as uncommitted physical stock.`};
 });
 return rows;
}

export function performPlayerAction(current,id,payload={}){
 if(YASMIN_AUCTION_ACTIONS.has(id)&&!canEnterFilmAuction(current))return blockedCopy(current);
 if(id==='source_invitation_fish')return buyInvitationFish(current);
 if(id==='buy_part')return buyOnewheelPart(current,payload);
 return legacy.performPlayerAction(current,id,payload);
}

export function resolvePlayerDay(w){
 landOnewheelCargo(w);
 landInvitationFish(w);
 if(!canEnterFilmAuction(w)){
  const commitment=w.playerGame?.commitments?.find(c=>c.id==='auction-bid'&&c.status==='open');
  if(commitment){
   commitment.status='released';
   const route=w.playerGame.routes?.yasmin;
   if(route){route.bid=null;if(route.stage==='bid')route.stage='unseen';}
  }
 }
 return legacy.resolvePlayerDay(w);
}
