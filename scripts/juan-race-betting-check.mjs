import assert from 'node:assert/strict';
import {createHarbourWorld,finishPlayerIntervention} from '../src/harbourSpine.js';
import {performPlayerAction,juanRaceChance} from '../src/playerGame.js';
import {learn,PLAYER_KNOWLEDGE as K} from '../src/playerKnowledge.js';

const named=['aspen','wong','yasmin','dima'];
const cashTotal=w=>named.reduce((n,id)=>n+w.actors[id].cash,0);

let w=createHarbourWorld(41,{attentionPerDay:99});
w.attention.budget=99;
learn(w,K.juan_route);
w.playerGame.routes.juan.stage='ready';
w.playerGame.routes.juan.built=true;
w.playerGame.location='joels_bar';
w.actors.player.location='joels_bar';
w.actors.joel.location='joels_bar';
w.actors.juan.location='joels_bar';
for(const id of ['aspen','wong','yasmin'])w.actors[id].location='joels_bar';
w.actors.dima.location='back_room'; // explicitly absent: must not bet or speak in the race scene.
w.actors.player.inventory.push({unitId:'test-built-onewheel',kind:'Built Onewheel',owner:'player',age:0,costBasis:0,source:'test_fixture',opened:false,remaining:1});

assert.equal(juanRaceChance(w),.32,'fixture should exercise the difficult first-race expectation');
const beforeCash=cashTotal(w);
const raced=performPlayerAction(w,'race_juan');
assert(!raced.playerGame.lastBlock,raced.playerGame.lastBlock);
const next=finishPlayerIntervention(w,raced,['joel','juan','aspen','wong','yasmin']);
const scene=next.playerGame.routes.juan.lastBetting;
assert(scene,'race must persist an actual betting/reaction scene in state');
assert.equal(scene.day,w.day);
assert.equal(scene.raceChance,.32);
assert(scene.present.includes('aspen')&&scene.present.includes('wong')&&scene.present.includes('yasmin'),'co-present named patrons must be represented in the expectation scene');
assert(!scene.present.includes('dima'),'absent character leaked into race scene');
assert(!scene.opinions.some(x=>x.actorId==='dima'),'absent character formed a betting opinion');
assert(scene.bets.length>0,'opposing expectations should produce at least one real side bet in this fixture');
for(const bet of scene.bets){
  assert(scene.present.includes(bet.playerBacker));
  assert(scene.present.includes(bet.juanBacker));
  assert(Number.isInteger(bet.stake)&&bet.stake>0);
  assert(['player','juan'].includes(bet.winnerSide));
  assert.equal(bet.settled,true);
}
assert.equal(cashTotal(next),beforeCash,'NPC side bets minted or burned cash instead of transferring it');

// Reserved cash is not available for a side bet.
let locked=createHarbourWorld(41,{attentionPerDay:99});
locked.attention.budget=99;learn(locked,K.juan_route);
locked.playerGame.routes.juan.stage='ready';locked.playerGame.routes.juan.built=true;
locked.playerGame.location='joels_bar';locked.actors.player.location='joels_bar';locked.actors.joel.location='joels_bar';locked.actors.juan.location='joels_bar';
locked.actors.aspen.location='joels_bar';locked.actors.wong.location='joels_bar';
locked.actors.yasmin.location='viewing_room';locked.actors.dima.location='back_room';
locked.actors.wong.cash=2;
locked.market.reservations.push({orderId:'test-lock',actorId:'wong',kind:'cash',amount:2});
locked.actors.player.inventory.push({unitId:'test-wheel-2',kind:'Built Onewheel',owner:'player',age:0,costBasis:0,source:'test_fixture',opened:false,remaining:1});
const lockedRace=performPlayerAction(locked,'race_juan');
const lockedNext=finishPlayerIntervention(locked,lockedRace,['joel','juan','aspen','wong']);
assert(!lockedNext.playerGame.routes.juan.lastBetting.bets.some(b=>b.playerBacker==='wong'||b.juanBacker==='wong'),'reserved Wong cash was double-spent into a race bet');
assert.equal(lockedNext.actors.wong.cash,2,'reserved Wong cash moved during race betting');

console.log('PASS: Juan race side bets use actual co-presence, expectations, reservations and conserved cash');
