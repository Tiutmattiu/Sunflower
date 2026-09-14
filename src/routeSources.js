import { ECONOMIC_GOODS } from './economicContent.js';
import { recordSourceDiscovery, sourceState } from './npcEconomy.js';

const ROUTE_SOURCE_CONFIG=Object.freeze({
 short:Object.freeze({goods:['Hardtack Tin','Packing Paper'],leadDays:1,maxOrder:2,sourceCost:2}),
 medium:Object.freeze({goods:['Lime','Rum','Presta Inner Tube'],leadDays:2,maxOrder:2,sourceCost:4}),
 outer:Object.freeze({goods:['Brass Compass','Gelatin Silver Print, 20 × 25 cm'],leadDays:3,maxOrder:2,sourceCost:7}),
});

function ensureState(w){
 w.npcEconomy??={};
 w.npcEconomy.routeSourceReturns??=[];
 w.npcEconomy.sourceOrders??=[];
 return w.npcEconomy;
}

function reservedCash(w,id){
 return (w.market?.reservations||[]).filter(r=>r.actorId===id&&r.kind==='cash').reduce((n,r)=>n+(r.amount||0),0);
}

function freeCash(w,id){return Math.max(0,(w.actors[id]?.cash||0)-reservedCash(w,id));}

function routeFromReturn(row){
 if(row?.actorId!=='aspen'||row?.class!=='OPERATE')return null;
 const match=String(row.context||'').match(/^(.+)_logistics_margin$/);
 return match?.[1]&&ROUTE_SOURCE_CONFIG[match[1]]?match[1]:null;
}

function arrivedGoodsForRoute(w,routeId){
 const config=ROUTE_SOURCE_CONFIG[routeId];
 if(!config)return [];
 const planned=new Set((w.aspenRoute?.activeRoute===routeId?w.aspenRoute?.activeCargo:[])||[]);
 const physical=new Set((w.actors?.aspen?.inventory||[]).filter(u=>u.source===`route_${routeId}_import`).map(u=>u.kind));
 return config.goods.filter(good=>physical.has(good)&&(planned.size===0||planned.has(good)));
}

function processRouteReturns(w){
 const state=ensureState(w);
 const seen=new Set(state.routeSourceReturns.map(r=>r.token));
 for(const row of w.returnLedger||[]){
  const routeId=routeFromReturn(row);if(!routeId)continue;
  const token=`${row.day}:${routeId}`;if(seen.has(token))continue;
  const goods=arrivedGoodsForRoute(w,routeId);
  if(!goods.length)continue;
  recordSourceDiscovery(w,routeId,goods,{returned:true,establishAfter:3});
  state.routeSourceReturns.push({token,day:row.day,routeId,goods:[...goods]});seen.add(token);
 }
}

function settleSourceOrders(w){
 const state=ensureState(w);
 for(const order of state.sourceOrders.filter(o=>o.status==='pending'&&o.dueDay<=w.day)){
  const actor=w.actors?.[order.actorId];if(!actor){order.status='failed';order.failureReason='recipient missing';continue;}
  const good=ECONOMIC_GOODS[order.good];
  for(let i=0;i<order.quantity;i++)actor.inventory.push({
   unitId:`u${++w.nextUnit}`,
   kind:order.good,
   owner:order.actorId,
   age:0,
   costBasis:order.unitCost,
   source:'established_route_source',
   opened:false,
   remaining:good?.servings||1,
  });
  order.status='arrived';order.arrivedDay=w.day;
  w.evidence??=[];
  w.evidence.push({id:`ev${++w.nextEvent}`,day:w.day,type:'established_source_arrival',good:order.good,actorId:order.actorId,quantity:order.quantity,orderId:order.id});
 }
}

export function advanceRouteSources(w){
 ensureState(w);processRouteReturns(w);settleSourceOrders(w);return w;
}

export function requestEstablishedReplenishment(w,good,actorId,{quantity=1}={}){
 const state=ensureState(w),source=sourceState(w,good);
 if(source.status!=='ESTABLISHED')return {ok:false,reason:'source is not established'};
 const routeId=source.routes.find(id=>ROUTE_SOURCE_CONFIG[id]?.goods.includes(good));
 const config=routeId&&ROUTE_SOURCE_CONFIG[routeId];
 if(!config)return {ok:false,reason:'no replenishment terms for this source'};
 const actor=w.actors?.[actorId];if(!actor)return {ok:false,reason:'recipient missing'};
 const bounded=Math.max(1,Math.min(config.maxOrder,Math.floor(Number(quantity)||1)));
 const totalCost=bounded*config.sourceCost;
 if(freeCash(w,actorId)<totalCost)return {ok:false,reason:'insufficient free cash for source order'};
 actor.cash-=totalCost;
 w.externalFlows??=[];
 w.externalFlows.push({day:w.day,direction:'out',sector:'established_route_sources',actorId,reason:`established_source_${routeId}_${good.toLowerCase().replace(/[^a-z0-9]+/g,'_')}`,amount:totalCost,returnClass:'TRADE'});
 const order={id:`source-order-${++w.nextEvent}`,good,actorId,routeId,quantity:bounded,unitCost:config.sourceCost,totalCost,createdDay:w.day,dueDay:w.day+config.leadDays,status:'pending'};
 state.sourceOrders.push(order);
 w.evidence??=[];
 w.evidence.push({id:`ev${++w.nextEvent}`,day:w.day,type:'established_source_ordered',good,actorId,quantity:bounded,cost:totalCost,dueDay:order.dueDay,orderId:order.id});
 return {ok:true,orderId:order.id,quantity:bounded,dueDay:order.dueDay,cost:totalCost};
}

export { ROUTE_SOURCE_CONFIG };
