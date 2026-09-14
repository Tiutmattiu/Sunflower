import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import {performPlayerAction,visibleActions,juanRaceChance,juanRaceRoll} from '../src/playerGame.js';
import {learn,PLAYER_KNOWLEDGE as K} from '../src/playerKnowledge.js';

let w=createHarbourWorld(41,{attentionPerDay:99});
w.attention.budget=99;
w.actors.player.cash=100;
w.playerGame.location='joels_bar';
w.actors.player.location='joels_bar';
w.actors.joel.location='joels_bar';
w.actors.juan.location='joels_bar';
learn(w,K.juan_route);
w.playerGame.routes.juan.stage='ready';
w.playerGame.routes.juan.built=true;
w.actors.player.inventory.push({unitId:'test-built-onewheel',kind:'Built Onewheel',owner:'player',age:0,costBasis:0,source:'test_fixture',opened:false,remaining:1});

// Pick a deterministic winning seed without changing the race model.
for(let seed=1;seed<500;seed++){
  w.seed=seed;
  if(juanRaceRoll(w)<=juanRaceChance(w))break;
}
const raced=performPlayerAction(w,'race_juan');
assert(!raced.playerGame.lastBlock,raced.playerGame.lastBlock);
assert.equal(raced.playerGame.routes.juan.stage,'won','winning should unlock the trip rather than complete the route');
assert.equal(raced.playerGame.sunflower.owned,false,'the race itself must not mint the sunflower');
assert(visibleActions(raced).some(a=>a.id==='juan_field_trip'),'winning should expose the earned follow-Juan action');

const arrived=performPlayerAction(raced,'juan_field_trip');
assert(!arrived.playerGame.lastBlock,arrived.playerGame.lastBlock);
assert.equal(arrived.playerGame.location,'cliff_path');
assert.equal(arrived.actors.player.location,'cliff_path');
assert.equal(arrived.actors.juan.location,'cliff_path');
assert.equal(arrived.playerGame.sunflower.owned,true,'the field trip, not the race roll, grants the sunflower');
assert.equal(arrived.playerGame.sunflower.route,'juan');

console.log('PASS: race win unlocks Juan field trip before sunflower completion');
