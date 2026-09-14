import {ECONOMIC_GOODS,LIVING_ASSET_FAMILIES} from './economicContent.js';

function outputFor(asset){return LIVING_ASSET_FAMILIES[asset.species]?.outputs?.[0]||null;}
function emit(w,type,data={}){const row={id:`ev${++w.nextEvent}`,day:w.day,type,...data};w.evidence??=[];w.evidence.push(row);return row;}

export function reconcileJuanHarvestEconomics(w,profiles){
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
  emit(w,'juan_profile_harvest',{assetId:asset.id,species:asset.species,item:kind,quantity,grossValue:row.amount});
 }
 return w;
}
