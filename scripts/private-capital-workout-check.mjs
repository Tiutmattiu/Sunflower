import assert from 'node:assert/strict';
import {createHarbourWorld,advanceHarbourWindow} from '../src/harbourSpine.js';
import {settleSecuredClaims} from '../src/npcEconomy.js';
import {
  yasminSecuredAdvance,
  sellUnitOutright,
  dimaBuyClaim,
  dimaExtendClaim,
  dimaGuaranteeClaim,
  settleDimaGuarantees,
} from '../src/privateCapital.js';

// Pledge is not a sale: borrower keeps ownership until default, principal is haircutted.
let w=createHarbourWorld(61,{attentionPerDay:99});
const fish=w.actors.player.inventory.find(u=>u.kind==='Fresh Mackerel');
const playerBefore=w.actors.player.cash,yasminBefore=w.actors.yasmin.cash;
let r=yasminSecuredAdvance(w,'player',fish.unitId,{requestedPrincipal:99,term:2});
assert.equal(r.ok,true,r.reason);
const secured=w.claims.find(c=>c.id===r.claimId);
assert(secured.principal<99,'recovery haircut must cap principal');
assert.equal(fish.owner,'player','pledged collateral remains borrower-owned before default');
assert.equal(fish.pledgedTo,'yasmin');
assert.equal(w.actors.player.cash,playerBefore+secured.principal);
assert.equal(w.actors.yasmin.cash,yasminBefore-secured.principal);

// An outright sale immediately transfers the unit and creates no repayment claim.
const lime=w.actors.player.inventory.find(u=>u.kind==='Lime');
const claimsBefore=w.claims.length;
r=sellUnitOutright(w,'player','yasmin',lime.unitId,4,{purpose:'private_sale_test'});
assert.equal(r.ok,true,r.reason);
assert.equal(lime.owner,'yasmin');
assert(w.actors.yasmin.inventory.some(u=>u.unitId===lime.unitId));
assert(!w.actors.player.inventory.some(u=>u.unitId===lime.unitId));
assert.equal(w.claims.length,claimsBefore,'sale must not create debt');

// Default is the point at which pledged ownership transfers.
w.day=secured.dueDay;w.actors.player.cash=0;
settleSecuredClaims(w);
assert.equal(secured.status,'default');
assert.equal(fish.owner,'yasmin');
assert.equal(fish.pledgedTo,null);

// The same secured-loan ontology must accept Juan's living productive assets.
w=createHarbourWorld(63,{attentionPerDay:99});
const plant=w.livingAssets.find(a=>a.species==='lime_tree');
const juanBeforePlantLoan=w.actors.juan.cash;
r=yasminSecuredAdvance(w,'juan',plant.id,{requestedPrincipal:6,term:2});
assert.equal(r.ok,true,r.reason);
const plantClaim=w.claims.find(c=>c.id===r.claimId);
assert.equal(plant.ownerId,'juan','living collateral stays Juan-owned before default');
assert.equal(plant.pledgedTo,'yasmin');
assert(w.actors.juan.cash>juanBeforePlantLoan,'living collateral must unlock current cash');
assert.equal(plantClaim.collateralAssetId,plant.id);
w.day=plantClaim.dueDay;w.actors.juan.cash=0;
settleSecuredClaims(w);
assert.equal(plantClaim.status,'default');
assert.equal(plant.ownerId,'yasmin','living collateral transfers only after default');
assert.equal(plant.pledgedTo,null);

// The normal day boundary must leave generic secured-claim settlement to the generic authority.
w=createHarbourWorld(64,{attentionPerDay:99});
const boundaryPlant=w.livingAssets.find(a=>a.species==='lime_tree');
r=yasminSecuredAdvance(w,'juan',boundaryPlant.id,{requestedPrincipal:6,term:1});
assert.equal(r.ok,true,r.reason);
const boundaryClaim=w.claims.find(c=>c.id===r.claimId);
w.actors.juan.cash=0;
w=advanceHarbourWindow(w);
const closedBoundaryClaim=w.claims.find(c=>c.id===boundaryClaim.id);
const transferredBoundaryPlant=w.livingAssets.find(a=>a.id===boundaryPlant.id);
assert.equal(closedBoundaryClaim.status,'default','generic secured claim must actually default at its due boundary');
assert.equal(transferredBoundaryPlant.ownerId,'yasmin','day-boundary default must transfer living collateral through secured settlement');
assert.equal(transferredBoundaryPlant.pledgedTo,null,'closed secured claim cannot leave a stale pledge');
assert(w.evidence.some(e=>e.type==='secured_claim_default'&&e.claimId===closedBoundaryClaim.id),'generic secured settlement must own the default event');

// Once collateral has been seized, legacy Dima workout logic must not revive or extend the closed secured debt.
const seizedDueDay=closedBoundaryClaim.dueDay;
w=advanceHarbourWindow(w);
const postSeizureClaim=w.claims.find(c=>c.id===boundaryClaim.id);
assert.equal(postSeizureClaim.dueDay,seizedDueDay,'seized secured debt has no maturity left for a generic extension');
assert(!postSeizureClaim.workout,'Dima cannot charge a workout fee on collateral that has already been seized');

// Dima buys an existing claim: cash moves to old holder, holder changes, face does not duplicate.
w=createHarbourWorld(62,{attentionPerDay:99});
w.claims.push({id:'juan-test-claim',type:'future_output_claim',issuerId:'juan',holderId:'yasmin',face:8,originalFace:8,dueDay:8,status:'open',purpose:'harvest_advance'});
const claim=w.claims.find(c=>c.id==='juan-test-claim');
const oldFace=claim.face,dimaBefore=w.actors.dima.cash,yasminCash=w.actors.yasmin.cash;
r=dimaBuyClaim(w,claim.id,5);
assert.equal(r.ok,true,r.reason);
assert.equal(claim.holderId,'dima');
assert.equal(claim.face,oldFace);
assert.equal(w.actors.dima.cash,dimaBefore-5);
assert.equal(w.actors.yasmin.cash,yasminCash+5);
assert.equal(w.claims.filter(c=>c.id===claim.id).length,1,'claim purchase must not clone the obligation');

// Extension charges Juan a real fee, extends maturity and does not erase face.
const due=claim.dueDay,face=claim.face,juanCash=w.actors.juan.cash,dimaCash=w.actors.dima.cash;
r=dimaExtendClaim(w,claim.id,{fee:2,extraDays:3});
assert.equal(r.ok,true,r.reason);
assert.equal(claim.dueDay,due+3);
assert.equal(claim.face,face);
assert.equal(w.actors.juan.cash,juanCash-2);
assert.equal(w.actors.dima.cash,dimaCash+2);

// Guarantee is contingent: fee now, Dima pays only after an actual default.
w.claims.push({id:'guaranteed-claim',type:'future_output_claim',issuerId:'juan',holderId:'yasmin',face:6,originalFace:6,dueDay:w.day+1,status:'open',purpose:'guarantee_test'});
const guaranteed=w.claims.find(c=>c.id==='guaranteed-claim');
const dimaBeforeGuarantee=w.actors.dima.cash,yasminBeforeGuarantee=w.actors.yasmin.cash;
r=dimaGuaranteeClaim(w,guaranteed.id,{fee:1,coverage:4});
assert.equal(r.ok,true,r.reason);
assert.equal(w.actors.dima.cash,dimaBeforeGuarantee+1,'guarantee fee is paid now');
assert.equal(w.actors.yasmin.cash,yasminBeforeGuarantee,'holder receives no guarantee payout before default');
const exposure=w.npcEconomy.guarantees.find(g=>g.id===r.guaranteeId);
assert.equal(exposure.status,'active');

guaranteed.status='default';
const holderBeforePayout=w.actors.yasmin.cash,dimaBeforePayout=w.actors.dima.cash;
settleDimaGuarantees(w);
assert.equal(exposure.status,'called');
assert.equal(w.actors.yasmin.cash,holderBeforePayout+4);
assert.equal(w.actors.dima.cash,dimaBeforePayout-4);
assert.equal(exposure.paid,4);

console.log('PASS: Yasmin secured lending and Dima workouts preserve ownership, claims and contingent risk');
