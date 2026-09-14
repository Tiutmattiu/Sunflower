import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import {performPlayerAction,visibleActions} from '../src/playerGame.js';
import {knows,learn,PLAYER_KNOWLEDGE as K} from '../src/playerKnowledge.js';

const base=()=>createHarbourWorld();
const at=(w,location)=>{w.playerGame.location=w.actors.player.location=location;return w};
const visible=(w,id)=>visibleActions(w).some(a=>a.id===id);
function blocked(w,id,payload={}) {
  const snapshot=structuredClone(w),after=performPlayerAction(w,id,payload);
  assert(after.playerGame.lastBlock,`${id} must be blocked`);
  assert.deepEqual(w,snapshot,'input must stay untouched');
  after.playerGame.lastBlock=snapshot.playerGame.lastBlock;
  assert.deepEqual(after,snapshot,`${id} failure must be atomic`);
}

let w=base();
assert.deepEqual(w.playerGame.knowledge,[]);
assert.equal(knows(w,K.juan_route),false);
at(w,'nursery');
for(let n=0;n<3;n++) {
  assert(!visible(w,'juan_plan'));
  blocked(w,'juan_plan');
  w=performPlayerAction(w,'meet',{actor:'juan'});
  assert.equal(w.playerGame.routes.juan.stage,'met');
  assert.deepEqual(w.playerGame.knowledge,[]);
}

// Old progress and even a completed build cannot stand in for learned facts.
for(const legacy of [false,true]) {
  w=base();
  if(legacy)delete w.playerGame.knowledge;
  Object.assign(w.playerGame.routes.juan,{stage:'planning',built:true,assembledDay:1});
  w.day=6;
  for(const [id,location,payload] of [
    ['juan_plan','nursery',{}],
    ['buy_part','harbour_berth',{kind:'Steel Rim',price:5}],
    ['assemble_onewheel','parcel_counter',{}],
    ['cliff_commit','cliff_path',{}],
  ]) {
    at(w,location);
    assert(!visible(w,id));
    blocked(w,id,payload);
  }
}

// Explicit facts open only the relevant gate, with existing physical terms intact.
w=at(base(),'nursery');
learn(w,K.juan_goal_explained);learn(w,K.juan_goal_explained);
assert.deepEqual(w.playerGame.knowledge,[K.juan_goal_explained]);
assert(visible(w,'juan_plan'));
w=performPlayerAction(w,'juan_plan');
assert.equal(w.playerGame.routes.juan.stage,'planning');
assert.equal(knows(w,K.juan_route),false);
at(w,'harbour_berth');
assert(!visible(w,'buy_part'));
blocked(w,'buy_part',{kind:'Steel Rim',price:5});
learn(w,K.juan_route);
w.day=6;w.attention.budget=20;
assert(visible(w,'buy_part'));
for(const [kind,price] of [['Steel Rim',5],['Chain Quick-Link',2],['Brake Cable',2],['Handlebar Tape',2]]) {
  w=performPlayerAction(w,'buy_part',{kind,price});
  assert.equal(w.playerGame.lastBlock,null);
  assert(w.actors.player.inventory.some(u=>u.kind===kind));
}
at(w,'parcel_counter');
assert(visible(w,'assemble_onewheel'));
const reserved=structuredClone(w),rim=reserved.actors.player.inventory.find(u=>u.kind==='Steel Rim');
reserved.market.reservations.push({actorId:'player',kind:'unit',unitId:rim.unitId});
blocked(reserved,'assemble_onewheel');
const pledged=structuredClone(w);pledged.actors.player.inventory.find(u=>u.kind==='Steel Rim').pledgedTo='yasmin';
blocked(pledged,'assemble_onewheel');
const heldCash=structuredClone(w);heldCash.playerGame.commitments.push({id:'held',status:'open',lockedCash:heldCash.actors.player.cash});
blocked(heldCash,'assemble_onewheel');
w=performPlayerAction(w,'assemble_onewheel');
assert.equal(w.playerGame.lastBlock,null);
assert(w.actors.player.inventory.some(u=>u.kind==='Built Onewheel'));
at(w,'cliff_path');
assert(visible(w,'cliff_commit'));
blocked(w,'cliff_commit'); // Same-day fitting check still applies.
w.day++;w.weather='clear';
w=performPlayerAction(w,'cliff_commit');
assert.equal(w.playerGame.lastBlock,null);
assert.equal(w.playerGame.sunflower.route,'juan');

// This gate does not close unrelated routes or mint facts for them.
w=at(base(),'joels_bar');
assert(visible(w,'joel_hear_supper'));
w=performPlayerAction(w,'joel_hear_supper');
assert.equal(w.playerGame.routes.sonya.stage,'known');
assert.deepEqual(w.playerGame.knowledge,[]);
w=at(base(),'viewing_room');w.day=3;
assert(visible(w,'auction_preview'));
w=performPlayerAction(w,'auction_preview');
assert(w.playerGame.routes.yasmin.preview);
assert.deepEqual(w.playerGame.knowledge,[]);
console.log('PASS: explicit knowledge, early/repeated contact gates, legacy-stage denial, learned action gates, atomic reservation failures, and unrelated routes.');
