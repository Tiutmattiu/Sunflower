import {ECONOMIC_GOODS,LIVING_ASSET_FAMILIES} from './economicContent.js';

function outputFor(asset){return LIVING_ASSET_FAMILIES[asset.species]?.outputs?.[0]||null;}
function emit(w,type,data={}){const row={id:`ev${++w.nextEvent}`,day:w.day,type,...data};w.evidence??=[];w.evidence.push(row);return row;}
function unitOrdinal(unit){const match=String(unit.unitId||'').match(/^u(\d+)$/);return match?Number(match[1]):-1;}

// Transitional reconciliation: harbourSpine's legacy Juan job still owns the
// maturity/harvest trigger, but crop health and cultivation costs now belong to
// JUAN_CROP_PROFILES. A monotonically advancing day is the authority boundary;
// shared-world social activity may change Juan's busy count after the old job ran,
// so busy is deliberately not used as proof here.
function undoLegacyJuanCropEconomics(w){
 if(w.day<=0)return;
 const last=w.npcEconomy?.cropAuthorityLastDay;
 if(last!=null&&last!==w.day-1)return;
 const stress=w.weather==='storm'?.08:.02;
 for(const asset of (w.livingAssets||[]).filter(a=>a.ownerId==='juan'))asset.health=Math.min(1,(asset.health??1)+stress);
 const legacyFlows=(w.externalFlows||[]).filter(f=>f.day===w.day&&f.actorId==='juan'&&f.sector==='growing_inputs'&&f.reason==='plant_inputs');
 const refund=legacyFlows.reduce((sum,f)=>sum+(Number(f.amount)||0),0);
 if(refund){w.actors.juan.cash+=refund;w.actors.juan.costs=Math.max(0,(w.actors.juan.costs||0)-refund);w.externalFlows=w.externalFlows.filter(f=>!legacyFlows.includes(f));}
 const compostEvents=(w.evidence||[]).filter(e=>e.day===w.day&&e.type==='compost_used_for_cultivation');
 for(const event of compostEvents){const batch=w.materials?.compostBatches?.find(b=>b.id===event.batchId);if(batch)batch.remainingUses=(batch.remainingUses||0)+1;}
 if(compostEvents.length){const ids=new Set(compostEvents.map(e=>e.id));w.evidence=w.evidence.filter(e=>!ids.has(e.id));if(w.activityLog)w.activityLog=w.activityLog.filter(e=>!ids.has(e.id));}
}

function cancelTransferredReservations(w,unitIds){
 const moved=new Set(unitIds);
 for(const order of w.market?.orders||[]){
  if(order.status!=='open'||order.actorId!=='juan'||order.side!=='sell'||!order.unitIds?.some(id=>moved.has(id)))continue;
  const removed=order.unitIds.filter(id=>moved.has(id)).length;
  order.unitIds=order.unitIds.filter(id=>!moved.has(id));
  order.quantity=Math.max(0,order.quantity-removed);
  if(order.quantity===0)order.status='cancelled';
 }
 if(w.market?.reservations)w.market.reservations=w.market.reservations.filter(r=>!moved.has(r.unitId));
}

function allocateFutureOutput(w,asset,kind,quantity){
 const assignment=w.npcEconomy?.futureOutputAssignments?.find(a=>a.assetId===asset.id&&a.status==='open');
 if(!assignment)return 0;
 const buyer=w.actors?.[assignment.buyerId];if(!buyer)return 0;
 const assignedQuantity=Math.min(quantity,Math.max(1,Math.floor(quantity*assignment.share)));
 const reserved=new Set((w.market?.reservations||[]).filter(r=>r.kind==='unit').map(r=>r.unitId));
 const harvestUnits=w.actors.juan.inventory
  .filter(u=>u.kind===kind&&u.source==='living_asset_yield')
  .sort((a,b)=>unitOrdinal(a)-unitOrdinal(b))
  .slice(-quantity);
 const selected=[...harvestUnits.filter(u=>!reserved.has(u.unitId)),...harvestUnits.filter(u=>reserved.has(u.unitId))].slice(0,assignedQuantity);
 if(selected.length!==assignedQuantity)return 0;
 cancelTransferredReservations(w,selected.map(u=>u.unitId));
 const selectedIds=new Set(selected.map(u=>u.unitId));
 w.actors.juan.inventory=w.actors.juan.inventory.filter(u=>!selectedIds.has(u.unitId));
 for(const unit of selected){unit.owner=assignment.buyerId;buyer.inventory.push(unit);}
 assignment.lastSettlementDay=w.day;assignment.remainingHarvests=Math.max(0,(assignment.remainingHarvests||1)-1);assignment.status=assignment.remainingHarvests<=0?'settled':'open';assignment.settledUnits=(assignment.settledUnits||0)+selected.length;
 w.privateTransactions??=[];w.privateTransactions.push({day:w.day,kind:'future_output_physical_share',from:'juan',to:assignment.buyerId,amount:0,assetId:asset.id,assignmentId:assignment.id,item:kind,quantity:selected.length});
 emit(w,'future_output_physical_share',{assignmentId:assignment.id,assetId:asset.id,buyerId:assignment.buyerId,item:kind,quantity:selected.length});
 return selected.length;
}

export function reconcileJuanHarvestEconomics(w,profiles){
 undoLegacyJuanCropEconomics(w);
 w.npcEconomy??={};w.npcEconomy.cropAuthorityLastDay=w.day;
 const harvestRows=(w.returnLedger||[]).filter(row=>row.day===w.day&&row.actorId==='juan'&&row.context==='crop_yield'&&!row.profileReconciled);
 if(!harvestRows.length)return w;
 const harvested=(w.livingAssets||[]).filter(asset=>
  asset.ownerId==='juan'&&
  asset.maturity===0&&
  profiles?.[asset.species]&&
  asset.lastProfileHarvestDay!==w.day
 );
 let remainingRows=[...harvestRows];
 for(const asset of harvested){
  const profile=profiles[asset.species],kind=outputFor(asset),good=kind&&ECONOMIC_GOODS[kind];
  if(!kind||!good)continue;
  let rowIndex=remainingRows.findIndex(row=>Number(row.amount)===Number(good.value));
  if(rowIndex<0)rowIndex=remainingRows.length?0:-1;
  if(rowIndex<0)break;
  const [row]=remainingRows.splice(rowIndex,1);
  const quantity=Math.max(1,Math.floor(profile.baseYield||1));
  for(let i=1;i<quantity;i++)w.actors.juan.inventory.push({
   unitId:`u${++w.nextUnit}`,
   kind,
   owner:'juan',
   age:good.shelfLife?1:0,
   costBasis:good.value||0,
   source:'living_asset_yield',
   opened:false,
   remaining:good.servings||1,
  });
  asset.lastProfileHarvestDay=w.day;
  row.profileReconciled=true;row.assetId=asset.id;row.species=asset.species;row.quantity=quantity;row.unitValue=good.value||0;row.amount=(good.value||0)*quantity;
  row.assignedQuantity=allocateFutureOutput(w,asset,kind,quantity);
  emit(w,'juan_profile_harvest',{assetId:asset.id,species:asset.species,item:kind,quantity,grossValue:row.amount,assignedQuantity:row.assignedQuantity});
 }
 return w;
}
