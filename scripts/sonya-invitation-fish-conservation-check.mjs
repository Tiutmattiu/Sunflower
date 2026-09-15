import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import {performPlayerAction,resolvePlayerDay} from '../src/playerGame.js';

let w=createHarbourWorld(151,{attentionPerDay:99});
const route=w.playerGame.routes.sonya;
route.stage='invited';
route.invitationDay=0;
route.supperDay=3;
w.day=2;
w.playerGame.location='harbour_berth';
w.actors.player.location='harbour_berth';

const playerBefore=w.actors.player.inventory.filter(u=>u.kind==='Exceptional Invitation Fish').length;
assert.equal(playerBefore,0);
resolvePlayerDay(w);
const catches=w.actors.small_boats.inventory.filter(u=>u.kind==='Exceptional Invitation Fish');
assert.equal(catches.length,1,'the supper catch must physically arrive with small boats on the eve of supper');
const catchUnit=catches[0];
assert.equal(catchUnit.owner,'small_boats');
assert.equal(catchUnit.source,'small_boat_invitation_catch');
assert.equal(catchUnit.freshUntil,route.supperDay,'the bounded catch should remain fresh through the dated supper');
assert(w.evidence.some(e=>e.type==='invitation_fish_landed'&&e.unitId===catchUnit.unitId),'the source arrival needs an auditable world event');

const nextUnitBeforePurchase=w.nextUnit;
const playerCash=w.actors.player.cash;
const boatCash=w.actors.small_boats.cash;
w=performPlayerAction(w,'source_invitation_fish');
const bought=w.actors.player.inventory.find(u=>u.kind==='Exceptional Invitation Fish');
assert(bought,'player should own the landed catch after purchase');
assert.equal(bought.unitId,catchUnit.unitId,'purchase must transfer the seller’s exact physical unit');
assert.equal(bought.owner,'player');
assert.equal(w.actors.small_boats.inventory.some(u=>u.unitId===catchUnit.unitId),false);
assert.equal(w.nextUnit,nextUnitBeforePurchase,'buying an already-landed catch cannot mint another unit');
assert.equal(w.actors.player.cash,playerCash-10);
assert.equal(w.actors.small_boats.cash,boatCash+10);
assert.equal(w.playerGame.routes.sonya.rareFishUnitId,catchUnit.unitId);

resolvePlayerDay(w);
assert.equal(w.actors.small_boats.inventory.filter(u=>u.kind==='Exceptional Invitation Fish').length,0,'the source cannot respawn a second invitation catch after sale');

console.log('PASS: Sonya invitation fish lands as finite small-boat inventory and purchase transfers the same unit');
