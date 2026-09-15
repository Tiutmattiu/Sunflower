import { ECONOMIC_GOODS } from './economicContent.js';
import { recordSourceDiscovery, sourceState } from './npcEconomy.js';
import { PROPAGULE_CATALOG, PROPAGULE_KINDS, propaguleEconomicMeta } from './seedEconomy.js';

const ROUTE_SOURCE_CONFIG=Object.freeze({
 short:Object.freeze({goods:['Hardtack Tin','Packing Paper'],leadDays:1,maxOrder:2,sourceCost:2,batchSize:4}),
 medium:Object.freeze({goods:['Lime','Rum','Presta Inner Tube'],leadDays:2,maxOrder:2,sourceCost:4,batchSize:5}),
 outer:Object.freeze({goods:['Brass Compass','Gelatin Silver Print, 20 × 25 cm'],leadDays:3,maxOrder:2,sourceCost:7,batchSize:6}),
});

const ordinaryGoods=Object.entries(ECONOMIC_GOODS)
 .filter(([name,good])=>good.category==='physical_good'&&good.mode!=='SPECIAL_STORY'&&name!=='Built Onewheel')
 .map(([name])=>name);
export const ASPEN_UNLOCKABLE_GOODS=Object.freeze([...ordinaryGoods,...PROPAGULE_KINDS]);

const ROUTE_DISCOVERY_FAMILIES=Object.freeze({
 short:Object.freeze(['provisions','packing','container','repair','marine_food','service_input','mixer','fruit','produce','herb']),
 medium:Object.freeze(['provisions','packing','container','repair','fruit','produce','herb','aromatic','botanical','tea','spice','seed','spirit','wine','syrup','modifier','bicycle_part','tool']),
 outer:Object.freeze(['durable','provenance_asset','collectible','collateral','decorative_art','fashion','natural_history','spice','spirit','wine','tool','bicycle_part']),
});
const ROUTE_DISCOVERY_MODES=Object.freeze({
 short:Object.freeze(['PUBLIC_MARKET','BACKEND_WHOLESALE']),
 medium:Object.freeze(['ROUTE_IMPORT','BACKEND_WHOLESALE','PUBLIC_MARKET']),
 outer:Object.freeze(['COLLECTIBLE','PRIVATE_TRADE','ROUTE_IMPORT']),
});
const UNLOCKABLE_SET=new Set(ASPEN_UNLOCKABLE_GOODS);

function metaFor(good){return ECONOMIC_GOODS[good]||propaguleEconomicMeta(good);}

export function eligibleRoutesForGood(good){
 const propagule=PROPAGULE_CATALOG[good];
 if(propagule)return [propagule.route];
 const row=ECONOMIC_GOODS[good];if(!row)return [];
 if(Number.isFinite(row.shelfLife)){
  if(row.shelfLife<=3)return ['short'];
  if(row.shelfLife<=5)return ['short','medium'];
  if(row.shelfLife<=8)return ['medium'];
 }
 if(['COLLECTIBLE','PRIVATE_TRADE'].includes(row.mode)||['provenance_asset','collectible','collateral','decorative_art','fashion','natural_history','durable'].includes(row.family))return ['outer'];
 if(row.mode==='ROUTE_IMPORT')return ['medium','outer'];
 if(['packing','container','repair','provisions','service_input','mixer','marine_food'].includes(row.family))return ['short','medium'];
 if(['fruit','produce','herb','aromatic','botanical','tea','spice','seed','spirit','wine','syrup','modifier','bicycle_part','tool'].includes(row.family))return ['medium','outer'];
 return ['medium','outer'];
}

function ensureState(w){
 w.npcEconomy??={};
 w.npcEconomy.routeSourceReturns??=[];
 w.npcEconomy.sourceOrders??=[];
 w.npcEconomy.aspenCatalog??={unlocked:[],batches:[],completedDay:null};
 w.npcEconomy.aspenCatalog.unlocked??=[];
 w.npcEconomy.aspenCatalog.batches??=[];
 return w.npcEconomy;
}

function reservedCash(w,id){
 return (w.market?.reservations||[]).filter(r=>r.actorId===id&&r.kind==='cash').reduce((n,r)=>n+(r.amount||0),0);
}
function freeCash(w,id){return Math.max(0,(w.actors[id]?.cash||0)-reservedCash(w,id));}
function tx(w,kind,from,to,amount,purpose){w.privateTransactions??=[];w.privateTransactions.push({day:w.day,kind,from,to,amount,purpose});}
function emit(w,type,data={}){w.evidence??=[];const row={id:`ev${++w.nextEvent}`,day:w.day,type,...data};w.evidence.push(row);return row;}

function routeFromReturn(row){
 if(row?.actorId!=='aspen'||row?.class!=='OPERATE')return null;
 const match=String(row.context||'').match(/^(.+)_logistics_margin$/);
 return match?.[1]&&ROUTE_SOURCE_CONFIG[match[1]]?match[1]:null;
}

function discoveryOrder(routeId,remaining){
 const config=ROUTE_SOURCE_CONFIG[routeId],families=new Set(ROUTE_DISCOVERY_FAMILIES[routeId]||[]),modes=ROUTE_DISCOVERY_MODES[routeId]||[];
 const modeRank=new Map(modes.map((mode,index)=>[mode,index]));
 const configured=new Map((config?.goods||[]).map((good,index)=>[good,index]));
 return [...remaining].filter(good=>eligibleRoutesForGood(good).includes(routeId)).sort((a,b)=>{
  const ca=configured.has(a)?configured.get(a):-1,cb=configured.has(b)?configured.get(b):-1;
  if(ca>=0||cb>=0){if(ca>=0&&cb>=0)return ca-cb;return ca>=0?-1:1;}
  const pa=PROPAGULE_CATALOG[a]?.route===routeId?0:1,pb=PROPAGULE_CATALOG[b]?.route===routeId?0:1;if(pa!==pb)return pa-pb;
  const ga=metaFor(a),gb=metaFor(b);
  const fa=families.has(ga?.family)?0:1,fb=families.has(gb?.family)?0:1;if(fa!==fb)return fa-fb;
  const ma=modeRank.has(ga?.mode)?modeRank.get(ga.mode):99,mb=modeRank.has(gb?.mode)?modeRank.get(gb.mode):99;if(ma!==mb)return ma-mb;
  const va=Number.isFinite(ga?.value)?ga.value:999,vb=Number.isFinite(gb?.value)?gb.value:999;if(va!==vb)return routeId==='outer'?vb-va:va-vb;
  return a.localeCompare(b);
 });
}

function unlockAspenBatch(w,routeId){
 const state=ensureState(w),catalog=state.aspenCatalog,unlocked=new Set(catalog.unlocked);
 const remaining=ASPEN_UNLOCKABLE_GOODS.filter(good=>!unlocked.has(good));
 if(!remaining.length){catalog.completedDay??=w.day;return [];}
 const config=ROUTE_SOURCE_CONFIG[routeId],ordered=discoveryOrder(routeId,remaining),batch=ordered.slice(0,config?.batchSize||4);
 if(!batch.length)return [];
 for(const good of batch){catalog.unlocked.push(good);recordSourceDiscovery(w,routeId,[good],{returned:false,establishAfter:3});}
 const row={id:`aspen-batch-${++w.nextEvent}`,day:w.day,routeId,goods:[...batch],number:catalog.batches.length+1};
 catalog.batches.push(row);
 if(catalog.unlocked.length>=ASPEN_UNLOCKABLE_GOODS.length)catalog.completedDay=w.day;
 emit(w,'aspen_catalog_batch_unlocked',{routeId,goods:[...batch],batchNumber:row.number,remaining:Math.max(0,ASPEN_UNLOCKABLE_GOODS.length-catalog.unlocked.length)});
 return batch;
}

function materializeReturnedPropagules(w,routeId,batch){
 const carried=[];
 for(const kind of batch.filter(kind=>PROPAGULE_CATALOG[kind]?.route===routeId)){
  const meta=PROPAGULE_CATALOG[kind];
  const unit={unitId:`u${++w.nextUnit}`,kind,owner:'aspen',age:0,costBasis:meta.value,source:`route_${routeId}_propagule`,opened:false,remaining:1};
  w.actors.aspen.inventory.push(unit);carried.push(kind);
  recordSourceDiscovery(w,routeId,[kind],{returned:true,establishAfter:3});
  emit(w,'aspen_propagule_returned',{routeId,kind,unitId:unit.unitId,propaguleType:meta.propaguleType,species:meta.species});
 }
 return carried;
}

function arrivedGoodsForRoute(w,routeId){
 if(!ROUTE_SOURCE_CONFIG[routeId])return [];
 const planned=new Set((w.aspenRoute?.activeRoute===routeId?w.aspenRoute?.activeCargo:[])||[]);
 const physical=new Set((w.actors?.aspen?.inventory||[]).filter(u=>u.source===`route_${routeId}_import`&&UNLOCKABLE_SET.has(u.kind)).map(u=>u.kind));
 const candidates=planned.size?[...planned]:[...physical];
 return [...new Set(candidates.filter(good=>UNLOCKABLE_SET.has(good)&&physical.has(good)))];
}

function processRouteReturns(w){
 const state=ensureState(w),seen=new Set(state.routeSourceReturns.map(r=>r.token));
 for(const row of w.returnLedger||[]){
  const routeId=routeFromReturn(row);if(!routeId)continue;
  const token=`${row.day}:${routeId}`;if(seen.has(token))continue;
  const unlocked=unlockAspenBatch(w,routeId),propagules=materializeReturnedPropagules(w,routeId,unlocked),goods=arrivedGoodsForRoute(w,routeId);
  if(goods.length)recordSourceDiscovery(w,routeId,goods,{returned:true,establishAfter:3});
  state.routeSourceReturns.push({token,day:row.day,routeId,goods:[...goods],propagules:[...propagules],unlocked:[...unlocked]});seen.add(token);
 }
}

function settleSourceOrders(w){
 const state=ensureState(w);
 for(const order of state.sourceOrders.filter(o=>o.status==='pending'&&o.dueDay<=w.day)){
  const actor=w.actors?.[order.actorId];if(!actor){order.status='failed';order.failureReason='recipient missing';continue;}
  const good=metaFor(order.good),sourceLabel=order.orderKind==='located_import'?'located_route_source':'established_route_source';
  for(let i=0;i<order.quantity;i++)actor.inventory.push({
   unitId:`u${++w.nextUnit}`,kind:order.good,owner:order.actorId,age:0,costBasis:order.unitCost,source:sourceLabel,opened:false,remaining:good?.servings||1,
  });
  order.status='arrived';order.arrivedDay=w.day;
  if(order.orderKind==='located_import')recordSourceDiscovery(w,order.routeId,[order.good],{returned:true,establishAfter:3});
  emit(w,order.orderKind==='located_import'?'located_source_arrival':'established_source_arrival',{good:order.good,actorId:order.actorId,quantity:order.quantity,orderId:order.id,routeId:order.routeId});
 }
}

export function advanceRouteSources(w){ensureState(w);processRouteReturns(w);settleSourceOrders(w);return w;}

export function requestLocatedImport(w,good,actorId,{quantity=1}={}){
 const state=ensureState(w),source=sourceState(w,good);
 if(!UNLOCKABLE_SET.has(good))return {ok:false,reason:'good is not part of Aspen source progression'};
 if(!['SOURCE_LOCATED','LOCALLY_AVAILABLE'].includes(source.status))return {ok:false,reason:source.status==='ESTABLISHED'?'source is established; use replenishment terms':'source has not been located'};
 const routeId=source.routes.find(id=>ROUTE_SOURCE_CONFIG[id]),config=routeId&&ROUTE_SOURCE_CONFIG[routeId],actor=w.actors?.[actorId];
 if(!config)return {ok:false,reason:'no route terms for located source'};
 if(!actor)return {ok:false,reason:'recipient missing'};
 const bounded=Math.max(1,Math.min(1,Math.floor(Number(quantity)||1)));
 const reference=Math.max(1,Number(metaFor(good)?.value)||config.sourceCost);
 const unitSourceCost=Math.min(config.sourceCost+5,Math.max(config.sourceCost,Math.ceil(reference*.45)));
 const sourceCost=bounded*unitSourceCost,serviceFee=actorId==='aspen'?0:Math.max(1,Math.ceil(sourceCost*.2)),totalCost=sourceCost+serviceFee;
 if(freeCash(w,actorId)<totalCost)return {ok:false,reason:'insufficient free cash for located source'};
 actor.cash-=totalCost;
 if(serviceFee){w.actors.aspen.cash+=serviceFee;tx(w,'aspen_sourcing_fee',actorId,'aspen',serviceFee,`${routeId}:${good}`);}
 w.externalFlows??=[];
 w.externalFlows.push({day:w.day,direction:'out',sector:'located_route_sources',actorId,reason:`located_source_${routeId}_${good.toLowerCase().replace(/[^a-z0-9]+/g,'_')}`,amount:sourceCost,returnClass:'TRADE'});
 const dueDay=w.day+config.leadDays+1;
 const order={id:`source-order-${++w.nextEvent}`,orderKind:'located_import',good,actorId,routeId,quantity:bounded,unitCost:totalCost/bounded,sourceCost,serviceFee,totalCost,createdDay:w.day,dueDay,status:'pending'};
 state.sourceOrders.push(order);
 emit(w,'located_source_ordered',{good,actorId,routeId,quantity:bounded,sourceCost,serviceFee,totalCost,dueDay,orderId:order.id});
 return {ok:true,orderId:order.id,quantity:bounded,dueDay,cost:totalCost,sourceCost,serviceFee};
}

export function requestEstablishedReplenishment(w,good,actorId,{quantity=1}={}){
 const state=ensureState(w),source=sourceState(w,good);
 if(source.status!=='ESTABLISHED')return {ok:false,reason:'source is not established'};
 const routeId=source.routes.find(id=>ROUTE_SOURCE_CONFIG[id]),config=routeId&&ROUTE_SOURCE_CONFIG[routeId];
 if(!config)return {ok:false,reason:'no replenishment terms for this source'};
 const actor=w.actors?.[actorId];if(!actor)return {ok:false,reason:'recipient missing'};
 const bounded=Math.max(1,Math.min(config.maxOrder,Math.floor(Number(quantity)||1))),totalCost=bounded*config.sourceCost;
 if(freeCash(w,actorId)<totalCost)return {ok:false,reason:'insufficient free cash for source order'};
 actor.cash-=totalCost;
 w.externalFlows??=[];
 w.externalFlows.push({day:w.day,direction:'out',sector:'established_route_sources',actorId,reason:`established_source_${routeId}_${good.toLowerCase().replace(/[^a-z0-9]+/g,'_')}`,amount:totalCost,returnClass:'TRADE'});
 const order={id:`source-order-${++w.nextEvent}`,orderKind:'established_replenishment',good,actorId,routeId,quantity:bounded,unitCost:config.sourceCost,totalCost,createdDay:w.day,dueDay:w.day+config.leadDays,status:'pending'};
 state.sourceOrders.push(order);
 emit(w,'established_source_ordered',{good,actorId,quantity:bounded,cost:totalCost,dueDay:order.dueDay,orderId:order.id});
 return {ok:true,orderId:order.id,quantity:bounded,dueDay:order.dueDay,cost:totalCost};
}

export { ROUTE_SOURCE_CONFIG };