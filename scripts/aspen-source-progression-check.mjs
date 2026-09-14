import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import {ECONOMIC_GOODS} from '../src/economicContent.js';
import {advanceProductionGame} from '../src/productionGame.js';
import {sourceState} from '../src/npcEconomy.js';
import * as routeSources from '../src/routeSources.js';

const {advanceRouteSources,requestEstablishedReplenishment,ROUTE_SOURCE_CONFIG}=routeSources;
const sourceableGoods=Object.entries(ECONOMIC_GOODS)
 .filter(([name,good])=>good.category==='physical_good'&&good.mode!=='SPECIAL_STORY'&&name!=='Built Onewheel')
 .map(([name])=>name);

let w=createHarbourWorld(71,{attentionPerDay:99});
w.aspenRoute.activeRoute='outer';
w.aspenRoute.activeCargo=['Brass Compass','Gelatin Silver Print, 20 × 25 cm'];

// Merely choosing/holding a route plan cannot unlock the goods.
advanceRouteSources(w);
assert.equal(sourceState(w,'Brass Compass').status,'UNKNOWN');
assert.equal(sourceState(w,'Gelatin Silver Print, 20 × 25 cm').status,'UNKNOWN');
assert.equal(w.npcEconomy.aspenCatalog?.batches?.length||0,0,'planning a voyage is not a catalogue unlock');

function fakeRealReturn(day,routeId='outer'){
 w.day=day;
 w.aspenRoute.activeRoute=routeId;
 w.aspenRoute.activeCargo=[...ROUTE_SOURCE_CONFIG[routeId].goods];
 for(const kind of w.aspenRoute.activeCargo){
  w.actors.aspen.inventory.push({unitId:`test-return-${day}-${kind}`,kind,owner:'aspen',age:0,costBasis:1,source:`route_${routeId}_import`,opened:false,remaining:1});
 }
 w.returnLedger.push({day,class:'OPERATE',actorId:'aspen',amount:10,context:`${routeId}_logistics_margin`});
 advanceRouteSources(w);
}

fakeRealReturn(1);
assert.equal(sourceState(w,'Brass Compass').status,'LOCALLY_AVAILABLE');
assert.equal(sourceState(w,'Brass Compass').successfulReturns,1);
assert.equal(w.npcEconomy.aspenCatalog?.batches?.length,1,'every successful voyage must unlock one source batch');
const firstBatch=w.npcEconomy.aspenCatalog.batches[0];
assert(firstBatch.goods.length>=3,'an Aspen voyage should reveal a useful batch, not a single token SKU');
assert.equal(new Set(firstBatch.goods).size,firstBatch.goods.length,'one voyage cannot unlock the same good twice');
const discoveredNotCarried=firstBatch.goods.find(g=>!w.aspenRoute.activeCargo.includes(g));
assert(discoveredNotCarried,'route reach must reveal at least one source beyond the few units physically carried home');
assert.equal(sourceState(w,discoveredNotCarried).status,'SOURCE_LOCATED','unshipped discoveries locate a source without inventing local stock');
assert.equal(sourceState(w,'Sunflower').status,'UNKNOWN','Aspen voyages cannot bypass the Sunflower acquisition routes');
assert.equal(sourceState(w,'Exceptional Invitation Fish').status,'UNKNOWN','story-specific fish keeps its authored source');
assert.equal(sourceState(w,'Built Onewheel').status,'UNKNOWN','constructed output cannot be unlocked as imported stock');

// A located source must be a real option: pay source cost + Aspen service, wait, receive one physical unit.
assert.equal(typeof routeSources.requestLocatedImport,'function','SOURCE_LOCATED goods need an actionable Aspen sourcing route');
const playerCashBeforeSpot=w.actors.player.cash,aspenCashBeforeSpot=w.actors.aspen.cash;
const spotUnitsBefore=w.actors.player.inventory.filter(u=>u.kind===discoveredNotCarried).length;
let spot=routeSources.requestLocatedImport(w,discoveredNotCarried,'player',{quantity:99});
assert.equal(spot.ok,true,spot.reason);
assert.equal(spot.quantity,1,'an unestablished source remains a small, uncertain channel rather than bulk supply');
assert(w.actors.player.cash<playerCashBeforeSpot,'requester pays real sourcing cost up front');
assert(w.actors.aspen.cash>aspenCashBeforeSpot,'Aspen earns an explicit sourcing service fee');
assert.equal(w.actors.player.inventory.filter(u=>u.kind===discoveredNotCarried).length,spotUnitsBefore,'located stock cannot teleport before lead time');
assert(w.externalFlows.some(f=>f.direction==='out'&&f.actorId==='player'&&f.reason.includes('located_source')),'external source payment must be explained');
assert.equal(routeSources.requestLocatedImport(w,'Sunflower','player').ok,false,'story goods are not import shortcuts');
w.day=spot.dueDay-1;advanceRouteSources(w);
assert.equal(w.actors.player.inventory.filter(u=>u.kind===discoveredNotCarried).length,spotUnitsBefore);
w.day=spot.dueDay;advanceRouteSources(w);
assert.equal(w.actors.player.inventory.filter(u=>u.kind===discoveredNotCarried).length,spotUnitsBefore+1,'successful sourcing job must deliver a physical unit');
const spotUnit=w.actors.player.inventory.find(u=>u.kind===discoveredNotCarried&&u.source==='located_route_source');
assert(spotUnit,'sourced unit retains located-route provenance');
assert.equal(sourceState(w,discoveredNotCarried).status,'LOCALLY_AVAILABLE','successful spot sourcing upgrades source availability');
assert.equal(sourceState(w,discoveredNotCarried).successfulReturns,1);

fakeRealReturn(2);fakeRealReturn(3);
assert.equal(sourceState(w,'Brass Compass').status,'ESTABLISHED','repeated successful physical returns establish configured source');
assert.equal(sourceState(w,'Brass Compass').successfulReturns,3);

// Established replenishment costs real cash, has lead time and is bounded.
const beforeCash=w.actors.aspen.cash,beforeUnits=w.actors.aspen.inventory.filter(u=>u.kind==='Brass Compass').length;
let r=requestEstablishedReplenishment(w,'Brass Compass','aspen',{quantity:99});
assert.equal(r.ok,true,r.reason);
assert(r.quantity<=2,'one order cannot become unlimited stock');
assert(w.actors.aspen.cash<beforeCash,'replenishment pays a real source cost up front');
assert.equal(w.actors.aspen.inventory.filter(u=>u.kind==='Brass Compass').length,beforeUnits,'stock does not appear before lead time');
assert(w.externalFlows.some(f=>f.direction==='out'&&f.actorId==='aspen'&&f.reason.includes('established_source')),'source payment must be an explained external flow');

w.day=r.dueDay-1;advanceRouteSources(w);
assert.equal(w.actors.aspen.inventory.filter(u=>u.kind==='Brass Compass').length,beforeUnits);
w.day=r.dueDay;advanceRouteSources(w);
assert.equal(w.actors.aspen.inventory.filter(u=>u.kind==='Brass Compass').length,beforeUnits+r.quantity,'due replenishment creates only ordered physical units');
const newUnits=w.actors.aspen.inventory.filter(u=>u.kind==='Brass Compass').slice(-r.quantity);
assert(newUnits.every(u=>u.source==='established_route_source'),'replenished goods retain source provenance');

// Repeated successful voyages must eventually reveal every ordinary/tradable physical good.
let catalogueWorld=createHarbourWorld(73,{attentionPerDay:99});
let previousUnlocked=0;
const routeIds=['short','medium','outer'];
for(let day=1;day<=sourceableGoods.length*2&&previousUnlocked<sourceableGoods.length;day++){
 const routeId=routeIds[(day-1)%routeIds.length];
 catalogueWorld.day=day;
 catalogueWorld.aspenRoute.activeRoute=routeId;
 catalogueWorld.aspenRoute.activeCargo=[...ROUTE_SOURCE_CONFIG[routeId].goods];
 for(const kind of catalogueWorld.aspenRoute.activeCargo){
  catalogueWorld.actors.aspen.inventory.push({unitId:`catalogue-${day}-${kind}`,kind,owner:'aspen',age:0,costBasis:1,source:`route_${routeId}_import`,opened:false,remaining:1});
 }
 catalogueWorld.returnLedger.push({day,class:'OPERATE',actorId:'aspen',amount:10,context:`${routeId}_logistics_margin`});
 advanceRouteSources(catalogueWorld);
 const unlocked=catalogueWorld.npcEconomy.aspenCatalog?.unlocked?.length||0;
 if(previousUnlocked<sourceableGoods.length)assert(unlocked>previousUnlocked,'each successful voyage must reveal fresh goods until the sourceable catalogue is complete');
 previousUnlocked=unlocked;
}
const unlockedSet=new Set(catalogueWorld.npcEconomy.aspenCatalog?.unlocked||[]);
assert.equal(unlockedSet.size,sourceableGoods.length,'repeated voyages must eventually unlock the complete ordinary/tradable goods catalogue');
for(const good of sourceableGoods)assert(unlockedSet.has(good),`Aspen progression never unlocked ${good}`);
assert(!unlockedSet.has('Sunflower'));
assert(!unlockedSet.has('Exceptional Invitation Fish'));
assert(!unlockedSet.has('Built Onewheel'));

// The normal daily production boundary must consume a real route-return fact automatically.
let integrated=createHarbourWorld(72,{attentionPerDay:99});
integrated.day=4;
integrated.aspenRoute.activeRoute='medium';
integrated.aspenRoute.activeCargo=['Lime'];
integrated.actors.aspen.inventory.push({unitId:'integration-route-lime',kind:'Lime',owner:'aspen',age:0,costBasis:1,source:'route_medium_import',opened:false,remaining:6});
integrated.returnLedger.push({day:4,class:'OPERATE',actorId:'aspen',amount:8,context:'medium_logistics_margin'});
advanceProductionGame(integrated);
assert.equal(sourceState(integrated,'Lime').status,'LOCALLY_AVAILABLE','real Aspen returns must reach source progression without a manual helper call');
assert.equal(sourceState(integrated,'Lime').successfulReturns,1);
assert.equal(integrated.npcEconomy.aspenCatalog?.batches?.length,1,'normal production boundary must also record Aspen catalogue progress');

console.log('PASS: Aspen voyages unlock actionable source batches and physical returns establish bounded replenishment');
