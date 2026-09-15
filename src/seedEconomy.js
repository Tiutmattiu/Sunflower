import {LIVING_ASSET_FAMILIES} from './economicContent.js';

// Propagules are physical inventory units. Dry seed packets tolerate the outer
// route; living cuttings/divisions use the nearer medium route. Cultivar names
// create genuinely different inventory without inventing parallel crop systems:
// they resolve into the existing biological asset families once planted.
export const PROPAGULE_CATALOG=Object.freeze({
 'Persian Lime Seed Packet':Object.freeze({species:'lime_tree',output:'Lime',propaguleType:'seed',route:'outer',value:4,germinationDays:3,maturityDays:8}),
 'Key Lime Seed Packet':Object.freeze({species:'lime_tree',output:'Lime',propaguleType:'seed',route:'outer',value:4,germinationDays:4,maturityDays:8}),
 'Sweet Basil Seed Packet':Object.freeze({species:'basil',output:'Basil',propaguleType:'seed',route:'outer',value:2,germinationDays:2,maturityDays:5}),
 'Thai Basil Seed Packet':Object.freeze({species:'basil',output:'Basil',propaguleType:'seed',route:'outer',value:3,germinationDays:2,maturityDays:5}),
 'Standard Tomato Seed Packet':Object.freeze({species:'tomato',output:'Tomato',propaguleType:'seed',route:'outer',value:3,germinationDays:3,maturityDays:6}),
 'Cherry Tomato Seed Packet':Object.freeze({species:'tomato',output:'Tomato',propaguleType:'seed',route:'outer',value:4,germinationDays:3,maturityDays:6}),
 'Spearmint Cutting':Object.freeze({species:'mint',output:'Mint',propaguleType:'cutting',route:'medium',value:3,germinationDays:1,maturityDays:4,shelfLife:3}),
 'Peppermint Cutting':Object.freeze({species:'mint',output:'Mint',propaguleType:'cutting',route:'medium',value:3,germinationDays:1,maturityDays:4,shelfLife:3}),
 'Lemongrass Division':Object.freeze({species:'lemongrass',output:'Lemongrass',propaguleType:'division',route:'medium',value:3,germinationDays:1,maturityDays:6,shelfLife:4}),
 'Lime Cutting':Object.freeze({species:'lime_tree',output:'Lime',propaguleType:'cutting',route:'medium',value:5,germinationDays:2,maturityDays:8,shelfLife:4}),
});

export const PROPAGULE_KINDS=Object.freeze(Object.keys(PROPAGULE_CATALOG));
export const isPropagule=kind=>Boolean(PROPAGULE_CATALOG[kind]);
export function propaguleEconomicMeta(kind){
 const row=PROPAGULE_CATALOG[kind];
 if(!row)return null;
 return {category:'physical_good',family:'seed',mode:'ROUTE_IMPORT',value:row.value,sources:['aspen_import'],sinks:['juan_growing'],shelfLife:row.shelfLife,propagule:true,route:row.route};
}

function ownerOfUnit(w,unitId){
 for(const actor of Object.values(w.actors||{})){
  const index=actor.inventory?.findIndex(u=>u.unitId===unitId)??-1;
  if(index>=0)return {actor,index,unit:actor.inventory[index]};
 }
 return null;
}

export function plantPropagule(w,unitId,{ownerId=null,growerId='juan'}={}){
 const found=ownerOfUnit(w,unitId);
 if(!found)return {ok:false,reason:'propagule unit is not physically present'};
 if(ownerId&&found.actor.id!==ownerId)return {ok:false,reason:'specified owner does not hold propagule'};
 const profile=PROPAGULE_CATALOG[found.unit.kind];
 if(!profile)return {ok:false,reason:'unit is not a plantable propagule'};
 if(!w.actors?.[growerId])return {ok:false,reason:'grower does not exist'};
 if(found.unit.pledgedTo)return {ok:false,reason:'propagule is pledged'};
 const reserved=new Set((w.market?.reservations||[]).filter(r=>r.kind==='unit').map(r=>r.unitId));
 if(reserved.has(unitId))return {ok:false,reason:'propagule is reserved'};
 const family=LIVING_ASSET_FAMILIES[profile.species];
 if(!family)return {ok:false,reason:'propagule has no biological asset family'};
 found.actor.inventory.splice(found.index,1);
 const asset={
  id:`plant-${profile.species}-${++w.nextEvent}`,
  ownerId:growerId,
  species:profile.species,
  cultivar:found.unit.kind,
  stage:family.stages[0],
  health:1,
  maturity:-Math.max(1,profile.germinationDays||1),
  inputDue:1,
  pledgedTo:null,
  originPropaguleUnitId:unitId,
  plantedDay:w.day,
  propaguleType:profile.propaguleType,
 };
 w.livingAssets.push(asset);
 w.privateTransactions??=[];
 w.privateTransactions.push({day:w.day,kind:'propagule_planted',from:found.actor.id,to:growerId,amount:0,item:found.unit.kind,unitId,assetId:asset.id});
 w.evidence??=[];
 w.evidence.push({id:`ev${++w.nextEvent}`,day:w.day,type:'propagule_planted',unitId,assetId:asset.id,item:found.unit.kind,species:profile.species,growerId});
 return {ok:true,assetId:asset.id,species:profile.species,output:profile.output};
}
