import assert from 'node:assert/strict';
import {createHarbourWorld,advanceHarbourWindow} from '../src/harbourSpine.js';
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

// The normal daily world tick must use the crop profile's real base yield, not a fixed one-unit harvest.
w=createHarbourWorld(54,{attentionPerDay:99});
const harvestMint=w.livingAssets.find(a=>a.species==='mint');
harvestMint.maturity=JUAN_CROP_PROFILES.mint.maturityDays-1;
const mintBefore=w.actors.juan.inventory.filter(u=>u.kind==='Mint').length;
w=advanceHarbourWindow(w);
const mintAfter=w.actors.juan.inventory.filter(u=>u.kind==='Mint').length;
assert.equal(mintAfter-mintBefore,JUAN_CROP_PROFILES.mint.baseYield,'real Juan harvest must materialise the configured biological yield');

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

// A real future-output contract must also perform on the actual harvest without inventing cash proceeds.
w=createHarbourWorld(55,{attentionPerDay:99});
const assignedMint=w.livingAssets.find(a=>a.species==='mint');
assignedMint.maturity=JUAN_CROP_PROFILES.mint.maturityDays-1;
r=assignFutureOutput(w,assignedMint.id,'dima',{cashNow:3,share:.5});
assert.equal(r.ok,true,r.reason);
const physicalAssignment=w.npcEconomy.futureOutputAssignments.find(a=>a.id===r.assignmentId);
const dimaMintBefore=w.actors.dima.inventory.filter(u=>u.kind==='Mint').length;
const juanMintBefore=w.actors.juan.inventory.filter(u=>u.kind==='Mint').length;
const dimaCashBeforeDay=w.actors.dima.cash;
w=advanceHarbourWindow(w);
const dimaMintAfter=w.actors.dima.inventory.filter(u=>u.kind==='Mint').length;
const juanMintAfter=w.actors.juan.inventory.filter(u=>u.kind==='Mint').length;
const settledPhysical=w.npcEconomy.futureOutputAssignments.find(a=>a.id===physicalAssignment.id);
assert.equal(settledPhysical.status,'settled','actual harvest must close the one-harvest output assignment');
assert.equal(dimaMintAfter-dimaMintBefore,1,'half of a two-unit mint harvest should become Dima-owned physical output');
assert.equal(juanMintAfter-juanMintBefore,JUAN_CROP_PROFILES.mint.baseYield-1,'Juan retains the unassigned physical harvest share');
assert(w.actors.dima.inventory.filter(u=>u.kind==='Mint').every(u=>u.owner==='dima'));
assert.equal(w.privateTransactions.filter(t=>t.day===w.day&&t.kind==='future_output_share'&&t.to==='dima').length,0,'physical harvest performance must not create a second cash settlement');
const explainedDimaOutflow=w.privateTransactions.filter(t=>t.day===w.day&&t.from==='dima'&&Number(t.amount)>0).reduce((sum,t)=>sum+t.amount,0);
assert.equal(dimaCashBeforeDay-w.actors.dima.cash,explainedDimaOutflow,'Dima cash changes during harvest day must come from recorded independent activity');
assert(w.privateTransactions.some(t=>t.day===w.day&&t.kind==='named_bar_service'&&t.from==='dima'&&t.amount===3),'seed 55 confirms the independent 3-tin movement is Dima drinking at Joel’s Bar');

console.log('PASS: Juan crops differ in biological economics and liquidity structures preserve ownership/risk distinctions');
