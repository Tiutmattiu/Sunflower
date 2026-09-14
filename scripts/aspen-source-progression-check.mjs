import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import {sourceState} from '../src/npcEconomy.js';
import {advanceRouteSources,requestEstablishedReplenishment} from '../src/routeSources.js';

let w=createHarbourWorld(71,{attentionPerDay:99});
w.aspenRoute.activeRoute='outer';
w.aspenRoute.activeCargo=['Brass Compass','Gelatin Silver Print, 20 × 25 cm'];

// Merely choosing/holding a route plan cannot unlock the goods.
advanceRouteSources(w);
assert.equal(sourceState(w,'Brass Compass').status,'UNKNOWN');
assert.equal(sourceState(w,'Gelatin Silver Print, 20 × 25 cm').status,'UNKNOWN');

function fakeRealReturn(day){
 w.day=day;
 for(const kind of w.aspenRoute.activeCargo){
  w.actors.aspen.inventory.push({unitId:`test-return-${day}-${kind}`,kind,owner:'aspen',age:0,costBasis:1,source:'route_outer_import',opened:false,remaining:1});
 }
 w.returnLedger.push({day,class:'OPERATE',actorId:'aspen',amount:10,context:'outer_logistics_margin'});
 advanceRouteSources(w);
}

fakeRealReturn(1);
assert.equal(sourceState(w,'Brass Compass').status,'LOCALLY_AVAILABLE');
assert.equal(sourceState(w,'Brass Compass').successfulReturns,1);
assert.equal(sourceState(w,'Mezcal').status,'UNKNOWN','unrelated route goods stay locked');

fakeRealReturn(2);fakeRealReturn(3);
assert.equal(sourceState(w,'Brass Compass').status,'ESTABLISHED','repeated successful returns establish configured source');
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

console.log('PASS: Aspen route returns causally establish bounded replenishable sources');
