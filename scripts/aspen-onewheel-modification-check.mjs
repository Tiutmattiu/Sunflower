import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import {performPlayerAction,visibleActions,juanRaceChance} from '../src/playerGame.js';
import {learn,PLAYER_KNOWLEDGE as K} from '../src/playerKnowledge.js';

let w=createHarbourWorld(41,{attentionPerDay:99});
w.attention.budget=99;
learn(w,K.juan_route);learn(w,K.onewheel_plan);
w.playerGame.routes.juan.stage='ready';
w.playerGame.routes.juan.built=true;
w.playerGame.location='harbour_berth';w.actors.player.location='harbour_berth';w.actors.aspen.location='harbour_berth';
w.actors.player.inventory.push({unitId:'test-built-onewheel',kind:'Built Onewheel',owner:'player',age:0,costBasis:0,source:'test_fixture',opened:false,remaining:1});

assert(w.actors.aspen.inventory.some(x=>x.kind==='Tiny Torque Wrench'),'Aspen must physically own the durable adjustment tool');
assert(!visibleActions(w).some(a=>a.id==='aspen_modify_onewheel'),'no generic upgrade action before a contextual favor is earned');

// Existing toad-circle system is the relationship event. Aspen only owes this
// favor if she actually attended, not merely because the event exists in data.
w.production.toadChat={createdDay:w.day,members:['player','juan','aspen'],messages:[]};
assert(visibleActions(w).some(a=>a.id==='aspen_modify_onewheel'),'Aspen attending the toad circle should unlock her specific adjustment favor');
const before=juanRaceChance(w),tool=w.actors.aspen.inventory.find(x=>x.kind==='Tiny Torque Wrench').unitId;
const next=performPlayerAction(w,'aspen_modify_onewheel');
assert(!next.playerGame.lastBlock,next.playerGame.lastBlock);
assert.equal(next.playerGame.routes.juan.upgrades,1);
assert(next.playerGame.routes.juan.toadFavorUsed,'the contextual favor must be consumed once used');
assert(juanRaceChance(next)>before,'the real modification must improve race odds');
assert(juanRaceChance(next)<1,'modification must not guarantee victory');
assert(next.actors.aspen.inventory.some(x=>x.unitId===tool),'durable wrench stays with Aspen rather than being consumed');
assert(!visibleActions(next).some(a=>a.id==='aspen_modify_onewheel'),'one toad favor cannot be farmed into repeated free upgrades');

console.log('PASS: Aspen modification is a contextual, physical, one-use favor path');
