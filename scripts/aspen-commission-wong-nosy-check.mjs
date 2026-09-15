import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import * as commissions from '../src/aspenCommissions.js';
import * as risk from '../src/socialRiskEconomy.js';

let w=createHarbourWorld(111,{attentionPerDay:99});
commissions.initializeAspenCommissions(w);risk.initializeSocialRisk(w);
w.aspenRoute.status='preparing';w.aspenRoute.selectedRoute='medium';w.actors.aspen.cash=30;

const offer=commissions.refreshAspenCommission(w,{force:true});
assert(offer,'Aspen should sometimes have a real local procurement need before departure');
assert.equal(offer.status,'open');
assert(offer.good&&offer.reward>0&&offer.dueDay>w.day);
assert(offer.reward>=offer.referenceValue,'deadline procurement may pay a bounded certainty premium');
assert.equal(w.actors.player.cash,18,'posting a request cannot pay the player before delivery');

// Fulfilment requires a physical owned unit; the item moves, Aspen pays, and reliability changes.
const missing=commissions.fulfillAspenCommission(w,offer.id,'player');
assert.equal(missing.ok,false,'cannot satisfy Aspen with an item the player does not own');
const unit={unitId:'commission-unit',kind:offer.good,owner:'player',age:0,costBasis:Math.max(1,offer.referenceValue-1),source:'test_source',opened:false,remaining:1};
w.actors.player.inventory.push(unit);
const playerBefore=w.actors.player.cash,aspenBefore=w.actors.aspen.cash;
const filled=commissions.fulfillAspenCommission(w,offer.id,'player');
assert.equal(filled.ok,true,filled.reason);
assert.equal(offer.status,'fulfilled');
assert.equal(unit.owner,'aspen');
assert(w.actors.aspen.inventory.some(u=>u.unitId===unit.unitId));
assert.equal(w.actors.player.inventory.some(u=>u.unitId===unit.unitId),false);
assert.equal(w.actors.player.cash,playerBefore+offer.reward);
assert.equal(w.actors.aspen.cash,aspenBefore-offer.reward);
assert(w.aspenCommissions.playerReliability>0,'doing useful procurement work should matter to Aspen later');

// Open request can expire without magically punishing the player: accepting nothing created no promise.
const second=commissions.refreshAspenCommission(w,{force:true,ignoreCadence:true});
assert(second&&second.id!==offer.id);
w.day=second.dueDay+1;commissions.advanceAspenCommissions(w);
assert.equal(second.status,'expired');
assert.equal(w.aspenCommissions.playerDefaults,0,'ignoring an unaccepted sourcing request is not a default');

// Wong is nosy, not omniscient: public large trades create hearsay; private unrelated deals do not.
const publicTrade={day:w.day,buyerId:'player',sellerId:'yasmin',item:'Art Deco Silver Cigarette Case',price:18,quantity:1};
w.market.tape.push(publicTrade);
risk.advanceSocialRiskEconomy(w);
const signal=w.socialRisk.wong.observations.find(o=>o.kind==='large_public_trade');
assert(signal,'Wong should hear about a visible large public transaction');
assert.equal(signal.source,'public_tape');
assert.equal(signal.reportable,false,'being rich or trading visibly is not criminal evidence');
assert(risk.wongLiquidityPitchEligible(w),'a visible liquidity event can later motivate Wong to pitch an alternative asset');

const count=w.socialRisk.wong.observations.length;
w.privateTransactions.push({day:w.day,kind:'private_settlement',from:'player',to:'yasmin',amount:30,purpose:'unrelated private deal'});
risk.advanceSocialRiskEconomy(w);
assert.equal(w.socialRisk.wong.observations.length,count,'Wong cannot hear a private deal merely because the engine knows it');

console.log('PASS: Aspen offers bounded real procurement work and Wong hears visible markets without omniscience');