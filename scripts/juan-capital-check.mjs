import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import {
  JUAN_CROP_PROFILES,
  applyJuanCropEconomicsDay,
  earlySellLivingAsset,
  assignFutureOutput,
  settleFutureOutputAssignment,
} from '../src/npcEconomy.js';

const profiles=Object.values(JUAN_CROP_PROFILES);
assert(profiles.length>=4,'Juan needs several crop families');
assert(new Set(profiles.map(p=>p.maturityDays)).size>=3,'crop maturities must differ');
assert(new Set(profiles.map(p=>p.weatherSensitivity)).size>=3,'weather risk must differ');
assert(new Set(profiles.map(p=>p.baseYield)).size>=2,'yield profiles must differ');
assert(new Set(profiles.map(p=>p.earlySaleFraction)).size>=2,'distressed recovery must differ');

// Same storm, different biological exposure.
let w=createHarbourWorld(51,{attentionPerDay:99});
w.weather='storm';
const lime=w.livingAssets.find(a=>a.species==='lime_tree');
const mint=w.livingAssets.find(a=>a.species==='mint');
lime.health=1;mint.health=1;
applyJuanCropEconomicsDay(w,{chargeInputs:false,applyFailureRoll:false});
assert(lime.health!==mint.health,'species-specific storm sensitivity must affect asset health differently');

// Distressed early sale: cash now, asset ownership leaves Juan, later upside leaves too.
w=createHarbourWorld(52,{attentionPerDay:99});
const plant=w.livingAssets.find(a=>a.species==='tomato');
const buyer=w.actors.households;
const juanCash=w.actors.juan.cash,buyerCash=buyer.cash;
let r=earlySellLivingAsset(w,plant.id,'households');
assert.equal(r.ok,true,r.reason);
assert.equal(plant.ownerId,'households');
assert(w.actors.juan.cash>juanCash&&buyer.cash<buyerCash,'early sale must move real cash now');
assert(r.price<JUAN_CROP_PROFILES.tomato.matureValue,'distress sale sacrifices mature value');

// Future-output assignment: current cash changes, plant stays Juan's, buyer gets only a bounded later share.
w=createHarbourWorld(53,{attentionPerDay:99});
const mintAsset=w.livingAssets.find(a=>a.species==='mint');
const dimaBefore=w.actors.dima.cash,juanBefore=w.actors.juan.cash;
r=assignFutureOutput(w,mintAsset.id,'dima',{cashNow:3,share:.5});
assert.equal(r.ok,true,r.reason);
assert.equal(mintAsset.ownerId,'juan','selling future output does not sell the productive asset');
assert.equal(w.actors.juan.cash,juanBefore+3);
assert.equal(w.actors.dima.cash,dimaBefore-3);
const assignment=w.npcEconomy.futureOutputAssignments.find(a=>a.id===r.assignmentId);
assert.equal(assignment.share,.5);

// Realised harvest share is settled from Juan to buyer; no second payment can be taken for same harvest.
w.actors.juan.cash=20;
const dimaCash=w.actors.dima.cash;
let settled=settleFutureOutputAssignment(w,assignment.id,10);
assert.equal(settled.ok,true,settled.reason);
assert.equal(settled.amount,5);
assert.equal(w.actors.dima.cash,dimaCash+5);
assert.equal(w.actors.juan.cash,15);
assert.equal(settleFutureOutputAssignment(w,assignment.id,10).ok,false,'one assigned harvest cannot settle twice');

console.log('PASS: Juan crops differ in biological economics and liquidity structures preserve ownership/risk distinctions');
