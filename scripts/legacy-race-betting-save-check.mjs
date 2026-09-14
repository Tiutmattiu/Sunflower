import assert from 'node:assert/strict';
import {createHarbourWorld,finishPlayerIntervention} from '../src/harbourSpine.js';
import {performPlayerAction} from '../src/playerGame.js';
import {learn,PLAYER_KNOWLEDGE as K} from '../src/playerKnowledge.js';

let w=createHarbourWorld(41,{attentionPerDay:99});
w.attention.budget=99;
// Simulate a save written before raceBets/lastBetting existed.
delete w.relationshipEcology.raceBets;
delete w.playerGame.routes.juan.lastBetting;
learn(w,K.juan_route);
w.playerGame.routes.juan.stage='ready';
w.playerGame.routes.juan.built=true;
w.playerGame.location='joels_bar';
w.actors.player.location='joels_bar';
w.actors.joel.location='joels_bar';
w.actors.juan.location='joels_bar';
w.actors.aspen.location='joels_bar';
w.actors.wong.location='joels_bar';
w.actors.player.inventory.push({unitId:'legacy-wheel',kind:'Built Onewheel',owner:'player',age:0,costBasis:0,source:'legacy_fixture',opened:false,remaining:1});

const raced=performPlayerAction(w,'race_juan');
assert(!raced.playerGame.lastBlock,raced.playerGame.lastBlock);
let next;
assert.doesNotThrow(()=>{next=finishPlayerIntervention(w,raced,['joel','juan','aspen','wong']);},'legacy save crashed when the first race attempted to append raceBets');
assert(Array.isArray(next.relationshipEcology.raceBets),'legacy ecology must be upgraded lazily to include raceBets');
assert(next.playerGame.routes.juan.lastBetting,'legacy save must receive the same settled race scene as a fresh save');
console.log('PASS: pre-betting saves migrate safely at the race settlement boundary');
