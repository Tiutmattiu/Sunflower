import assert from 'node:assert/strict';
import {createHarbourWorld,advanceHarbourWindow,finishPlayerIntervention,placePublicOrder,assertHarbourInvariants} from '../src/harbourSpine.js';
import {performPlayerAction,visitLocation,visibleActions,settlePlayerDebts} from '../src/playerGame.js';
import {advanceHarbourBeat} from '../src/relationalHarbour.js';
import {selectDialogue} from '../src/dialogueContent.js';
import {recordDiscoveredMisconduct,performProductionAction,advanceProductionGame} from '../src/productionGame.js';
const base=()=>createHarbourWorld();
let w=visitLocation(base(),'nursery');w=performPlayerAction(w,'meet',{actor:'juan'});
assert(visibleActions(w).some(a=>a.id==='juan_plan'));
w=performPlayerAction(w,'juan_plan');w=performPlayerAction(w,'meet',{actor:'juan'});assert.equal(w.playerGame.routes.juan.stage,'planning');
let exhausted=base();exhausted.playerGame.location='joels_bar';exhausted.attention.used=4;
let fail=performPlayerAction(exhausted,'joel_patronage');assert.equal(fail.actors.player.cash,18);assert.equal(fail.attention.used,4);
w=base();w.playerGame.location='viewing_room';w.playerGame.routes.yasmin.preview=true;
w=performPlayerAction(w,'auction_finance');assert.equal(w.claims.at(-1).dueDay,10);assert(Number.isFinite(w.playerGame.commitments.at(-1).dueDay));
let pledged=w.actors.player.inventory.find(u=>u.pledgedTo);let order=placePublicOrder(w,'player','sell',pledged.kind,5);assert.equal(order.market.orders.length,w.market.orders.length);
w=performPlayerAction(w,'repay_finance');assert(!w.actors.player.inventory.some(u=>u.pledgedTo));
w=base();w=performPlayerAction(w,'lime_accept');w=performPlayerAction(w,'lime_refuse');let cash=w.actors.player.cash;w=performPlayerAction(w,'lime_refuse');assert.equal(w.actors.player.cash,cash);
w=base();let bad=placePublicOrder(w,'player','buy','Lime',NaN);assert.equal(bad.market.orders.length,w.market.orders.length);
let before=visitLocation(base(),'nursery'),after=performPlayerAction(before,'meet',{actor:'juan'});after=performPlayerAction(after,'talk_here',{actor:'juan'});
let beat=finishPlayerIntervention(before,after,['juan']);assert.equal(beat.day,before.day);assert.equal(beat.market.tape.length,before.market.tape.length);assert.deepEqual(beat.actors.player.inventory.map(u=>u.unitId),before.actors.player.inventory.map(u=>u.unitId));
const total=x=>Object.values(x.actors).reduce((n,a)=>n+a.cash,0);assert.equal(total(beat),total(after));assert.deepEqual(advanceHarbourBeat(beat,`${beat.day}:${beat.attention.used}`),beat);
assert.equal(finishPlayerIntervention(before,before),before);assert.equal(beat.bar.last,before.bar.last);
for(const a of ['aspen','joel','juan','yasmin','wong','dima']){w=base();w.actors[a].location='joels_bar';const bar=selectDialogue(w,a);w.actors[a].location='nursery';assert.notEqual(selectDialogue(w,a).id,bar.id)}
w=base();w.actors.aspen.location='away';for(let n=0;n<4;n++)w=advanceHarbourBeat(w,`test:${n}`);assert.equal(w.actors.aspen.location,'away');
for(let day=0;day<12;day++){w=advanceHarbourWindow(w);const inv=assertHarbourInvariants(w);assert(inv.physicalConservation);assert(inv.resourceReservation);assert(inv.settlementFloat)}
console.log('PASS: acquaintance, atomic failure, debt dates, pledged stock, repeated return, invalid price, contextual dialogue, bounded idempotent beats, conservation.');

// Looking and failed actions cannot charge time or settle the world.
w=base();const snapshot=structuredClone(w);selectDialogue(w,'juan');assert.deepEqual(w,snapshot);
for(const id of ['aspen','joel','juan','yasmin','wong','dima'])assert(!new RegExp('\\b'+id+'\\b','i').test(selectDialogue(w,id).text));
w.actors.player.contacts.push('juan');w.actors.player.location=w.playerGame.location='nursery';
const first=selectDialogue(w,'juan');w=performPlayerAction(w,'talk_here',{actor:'juan'});assert.notEqual(selectDialogue(w,'juan').id,first.id);
w=base();w.actors.juan.location='joels_bar';w.actors.joel.location='away';assert(!selectDialogue(w,'juan').text.includes('Joel'));
w=base();w.playerGame.location='nursery';w.actors.juan.location='joels_bar';fail=performPlayerAction(w,'invest_nursery');assert.equal(fail.actors.player.cash,w.actors.player.cash);assert.equal(fail.attention.used,0);assert(fail.playerGame.lastBlock);
w=base();w.attention.used=4;w.actors.player.contacts.push('aspen');fail=performPlayerAction(w,'operate_inspection');assert.equal(fail.actors.player.cash,w.actors.player.cash);assert.equal(fail.evidence.length,w.evidence.length);
w=base();w.playerGame.location='nursery';after=performPlayerAction(w,'invest_nursery');assert.equal(after.attention.used,1);beat=finishPlayerIntervention(w,after,['juan']);assert.equal(beat.day,w.day);assert.deepEqual(beat.livingAssets,w.livingAssets);assert.equal(beat.market.tape.length,w.market.tape.length);assert.equal(beat.production.positions[0].status,'open');assert.deepEqual(finishPlayerIntervention(w,beat),beat);
w=base();w.day=3;w.playerGame.location='nursery';w.actors.aspen.location='away';w.actors.wong.busy=w.actors.wong.capacity;w=performPlayerAction(w,'collect_toad',{toadId:'toad-1'});w=performPlayerAction(w,'invite_toad_circle');assert.equal(w.attention.used,1);for(const id of w.production.toadChat.members.filter(id=>id!=='player'))assert.equal(w.actors[id].location,'nursery');assert(!w.production.toadChat.members.includes('aspen'));assert(!w.production.toadChat.members.includes('wong'));
console.log('PASS: authored dialogue guards, repeat memory, absent counterparties, timed material actions, bounded intra-day clearing without daily production, real circle attendance.');

// A matched order settles once during elapsed intervention time.
w=base();w=placePublicOrder(w,'player','buy','Lime',7);before=base();beat=finishPlayerIntervention(before,w,['aspen']);assert.equal(beat.market.tape.length,1);assert.equal(beat.actors.player.cash,11);assert.deepEqual(finishPlayerIntervention(before,beat),beat);
// Duplicate commitments and completed routes cannot be executed again.
w=base();w.day=6;w.playerGame.location='viewing_room';w.playerGame.routes.yasmin.preview=true;w=performPlayerAction(w,'auction_bid',{amount:16});cash=w.actors.player.cash;after=performPlayerAction(w,'auction_bid',{amount:16});assert(after.playerGame.lastBlock);assert.equal(after.playerGame.commitments.length,w.playerGame.commitments.length);assert.equal(after.actors.player.cash,cash);assert(performPlayerAction(w,'auction_walk').playerGame.lastBlock);
w=base();w.playerGame.routes.juan.stage='complete';assert(performPlayerAction(w,'cliff_commit').playerGame.lastBlock);
// Deadline payment releases the pledge and updates the promise together, only once.
w=base();w.playerGame.location='viewing_room';w.playerGame.routes.yasmin.preview=true;w=performPlayerAction(w,'auction_finance');const due=w.claims.at(-1).dueDay+1;settlePlayerDebts(w,due);assert.equal(w.claims.at(-1).status,'settled');assert.equal(w.playerGame.commitments.at(-1).status,'fulfilled');assert(!w.actors.player.inventory.some(u=>u.pledgedTo));after=structuredClone(w);settlePlayerDebts(w,due);assert.deepEqual(w,after);
w=base();w.actors.player.contacts.push('juan');w.actors.player.location=w.playerGame.location='nursery';w.claims=[];for(let n=0;n<2;n++){const line=selectDialogue(w,'juan').text;w=performPlayerAction(w,'talk_here',{actor:'juan'});assert.notEqual(selectDialogue(w,'juan').text,line);}
console.log('PASS: intra-day trade once, duplicate bids and cliff guard, deadline pledge release, isolated repeat dialogue.');

// Penalties cannot spend money already held for a bid; failed private execution is atomic.
w=base();w.playerGame.commitments.push({id:'held-bid',status:'open',lockedCash:16});
recordDiscoveredMisconduct(w,'public_listing','first');recordDiscoveredMisconduct(w,'public_listing','second');
assert.equal(w.actors.player.cash,16);assert.equal(w.production.marketStanding.fines,2);
w=base();w.playerGame.location='back_room';w.production.marketStanding.status='SUSPENDED';w.actors.households.cash=0;
assert.deepEqual(performProductionAction(w,'private_proxy'),w);
console.log('PASS: reserved cash survives penalties; unfunded private buyer takes no fee.');

// A unit promised to the public market cannot also become collateral or an assembly part.
w=base();for(const unit of w.actors.player.inventory)w.market.reservations.push({orderId:`lock-${unit.unitId}`,actorId:'player',kind:'unit',unitId:unit.unitId});
w.playerGame.location=w.actors.player.location='viewing_room';w.playerGame.routes.yasmin.preview=true;w.actors.yasmin.location='viewing_room';
after=performPlayerAction(w,'auction_finance');assert(after.playerGame.lastBlock);assert(!after.claims.some(c=>c.issuerId==='player'));
w=base();w.day=6;w.playerGame.location=w.actors.player.location='parcel_counter';w.playerGame.routes.juan.stage='planning';w.actors.wong.location='parcel_counter';
for(const kind of ['Steel Rim','Chain Quick-Link','Brake Cable','Handlebar Tape'])w.actors.player.inventory.push({unitId:`test-${kind}`,kind,owner:'player',age:0,costBasis:1,source:'test',opened:false,remaining:1});
w.market.reservations.push({orderId:'lock-rim',actorId:'player',kind:'unit',unitId:'test-Steel Rim'});
after=performPlayerAction(w,'assemble_onewheel');assert(after.playerGame.lastBlock);assert(!after.actors.player.inventory.some(u=>u.kind==='Built Onewheel'));assert(after.actors.player.inventory.some(u=>u.unitId==='test-Steel Rim'));
console.log('PASS: market-reserved units cannot be pledged or consumed by assembly.');

// Finance can genuinely default; private execution transfers a real object to a funded buyer.
w=base();w.playerGame.location='nursery';w=performProductionAction(w,'finance_receivable');const factored=w.claims.find(c=>c.id.startsWith('factored-'));assert(factored);w.actors.juan.cash=3;w.actors.crews.cash=5;w.day=factored.dueDay;const financeCash=w.actors.player.cash;advanceProductionGame(w);assert.equal(factored.status,'default');assert.equal(factored.paid,0);assert.equal(w.actors.player.cash,financeCash);
w=base();w.playerGame.location='back_room';w.production.marketStanding.status='SUSPENDED';const item=w.actors.player.inventory[0],playerCount=w.actors.player.inventory.length,householdCount=w.actors.households.inventory.length,totalCash=total(w);after=performProductionAction(w,'private_proxy');assert.equal(after.actors.player.inventory.length,playerCount-1);assert.equal(after.actors.households.inventory.length,householdCount+1);assert(after.actors.households.inventory.some(u=>u.unitId===item.unitId));assert.equal(total(after),totalCash);assert.equal(after.actors.dima.cash,w.actors.dima.cash+3);
w=base();w.playerGame.location='joels_bar';const joelCash=w.actors.joel.cash,wongCash=w.actors.wong.cash;w=performProductionAction(w,'trade_bridge');w=performProductionAction(w,'trade_bridge');assert.equal(w.actors.joel.cash,joelCash-4);assert.equal(w.actors.wong.cash,wongCash+2);assert.equal(w.production.tradeStock.length,0);
console.log('PASS: receivable shortfall can default; private proxy moves a real unit; packing spread closes with Joel.');