import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import {performPlayerAction,resolvePlayerDay} from '../src/playerGame.js';

function prepare(day){
 const w=createHarbourWorld(161,{attentionPerDay:99});
 w.playerGame.knowledge.push('onewheel_plan');
 w.playerGame.location='harbour_berth';
 w.actors.player.location='harbour_berth';
 w.day=day;
 return w;
}

let early=prepare(3);
resolvePlayerDay(early);
assert.equal(early.actors.wharf_suppliers.inventory.some(u=>u.kind==='Steel Rim'&&u.source==='onewheel_cargo_arrival'),false,'Steel Rim cannot exist before its authored arrival day');

let w=prepare(4);
resolvePlayerDay(w);
const rims=w.actors.wharf_suppliers.inventory.filter(u=>u.kind==='Steel Rim'&&u.source==='onewheel_cargo_arrival');
assert.equal(rims.length,1,'Steel Rim must physically land with the wharf supplier before the player can buy it');
const rim=rims[0];
assert.equal(rim.owner,'wharf_suppliers');
assert(w.evidence.some(e=>e.type==='onewheel_part_landed'&&e.unitId===rim.unitId&&e.item==='Steel Rim'),'part arrival needs an auditable world event');

const nextUnitBefore=w.nextUnit,playerCash=w.actors.player.cash,sellerCash=w.actors.wharf_suppliers.cash;
w=performPlayerAction(w,'buy_part',{kind:'Steel Rim',price:5,seller:'wharf_suppliers'});
const bought=w.actors.player.inventory.find(u=>u.unitId===rim.unitId);
assert(bought,'player must receive the landed physical rim');
assert.equal(bought.owner,'player');
assert.equal(w.actors.wharf_suppliers.inventory.some(u=>u.unitId===rim.unitId),false);
assert.equal(w.nextUnit,nextUnitBefore,'buying an arrived part cannot mint a replacement unit');
assert.equal(w.actors.player.cash,playerCash-5);
assert.equal(w.actors.wharf_suppliers.cash,sellerCash+5);

const unitCount=w.actors.player.inventory.filter(u=>u.kind==='Steel Rim').length;
w=performPlayerAction(w,'buy_part',{kind:'Steel Rim',price:5,seller:'wharf_suppliers'});
assert.equal(w.actors.player.inventory.filter(u=>u.kind==='Steel Rim').length,unitCount,'repeat purchase cannot mint another rim after finite stock is gone');
assert(w.playerGame.lastBlock,'repeat purchase must be explicitly blocked instead of creating replacement stock');

let reserved=prepare(4);
resolvePlayerDay(reserved);
const reservedRim=reserved.actors.wharf_suppliers.inventory.find(u=>u.kind==='Steel Rim');
reserved.market.reservations.push({orderId:'test-reservation',actorId:'wharf_suppliers',kind:'unit',unitId:reservedRim.unitId});
const reservedNext=reserved.nextUnit;
reserved=performPlayerAction(reserved,'buy_part',{kind:'Steel Rim',price:5,seller:'wharf_suppliers'});
assert.equal(reserved.actors.player.inventory.some(u=>u.unitId===reservedRim.unitId),false,'reserved physical stock cannot be sold out from under its commitment');
assert.equal(reserved.nextUnit,reservedNext,'reservation conflict cannot be solved by minting replacement stock');

console.log('PASS: Onewheel parts land as finite cargo and purchases transfer exact uncommitted units');
