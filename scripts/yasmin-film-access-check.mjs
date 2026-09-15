import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import * as access from '../src/yasminAccess.js';
import {recordSourceDiscovery} from '../src/npcEconomy.js';

let w=createHarbourWorld(121,{attentionPerDay:99});
access.initializeYasminAccess(w);

// Wong's dried tentacle is funny and informative, but it is not a magic counterfeit credential.
const fake=access.issueWongFakeTentacle(w);
assert.equal(fake.ok,true);
assert(fake.credentialId);
assert.equal(w.yasminAccess.credentials.find(c=>c.id===fake.credentialId).kind,'Dried Octopus Tentacle');
const rejected=access.presentYasminCredential(w,fake.credentialId);
assert.equal(rejected.ok,false);
assert.equal(rejected.reason,'not_an_invitation');
assert.equal(w.yasminAccess.fakeTokenChecked,true);
assert.equal(w.yasminAccess.invited,false,'fake access must not accidentally unlock the auction');

// Dima is not an omniscient quest marker; the player must actually know him before he brokers the need.
let brief=access.requestDimaFilmBrief(w,{role:'outsider'});
assert.equal(brief.ok,false);
w.actors.player.contacts.push('dima');
brief=access.requestDimaFilmBrief(w,{role:'outsider'});
assert.equal(brief.ok,true,brief.reason);
assert.equal(w.yasminAccess.whaleOilNeedKnown,true);
assert.match(brief.need,/Sperm Whale Oil/);

// Physical route: title, cash, broker fee and courier fee are all real.
w.actors.player.inventory.push({unitId:'whale-oil-test',kind:'Sperm Whale Oil',owner:'player',age:0,costBasis:11,source:'route_outer_import',opened:false,remaining:1});
const playerBefore=w.actors.player.cash,dimaBefore=w.actors.dima.cash,wongBefore=w.actors.wong.cash,yasminBefore=w.actors.yasmin.cash;
const arranged=access.arrangeWhaleOilDelivery(w,{sellerId:'player'});
assert.equal(arranged.ok,true,arranged.reason);
assert.equal(w.actors.player.inventory.some(u=>u.unitId==='whale-oil-test'),false);
const titled=w.actors.yasmin.inventory.find(u=>u.unitId==='whale-oil-test');
assert(titled&&titled.owner==='yasmin','Yasmin pays for and takes title to the actual oil unit');
assert.equal(titled.custodianId,'wong','Wong handles the physical private delivery');
assert.equal(w.actors.player.cash,playerBefore+arranged.salePrice);
assert.equal(w.actors.dima.cash,dimaBefore+arranged.brokerFee);
assert.equal(w.actors.wong.cash,wongBefore+arranged.courierFee);
assert.equal(w.actors.yasmin.cash,yasminBefore-arranged.salePrice-arranged.brokerFee-arranged.courierFee);
assert.equal(w.yasminAccess.invited,false,'payment alone does not teleport an invitation before delivery');

w.day=arranged.dueDay;access.advanceYasminAccess(w);
assert.equal(w.yasminAccess.whaleOilDelivered,true);
assert.equal(titled.custodianId,'yasmin');
const silver=w.yasminAccess.credentials.find(c=>c.kind==='Silver Octopus Tentacle Guest Token'&&c.ownerId==='player');
assert(silver,'successful contribution earns the real serialled event credential');
assert.equal(silver.material,'925 silver');
assert.equal(w.yasminAccess.invited,true);

// Invitation and ability to settle are separate. The player may qualify with liquidity or eligible collateral.
w.actors.player.cash=2;
let capacity=access.proveSettlementCapacity(w);
assert.equal(capacity.ok,false,'silver token does not mean the player can make an unfunded auction bid');
w.actors.player.inventory.push({unitId:'collateral-case',kind:'Art Deco Silver Cigarette Case',owner:'player',age:0,costBasis:18,source:'owned',opened:false,remaining:1});
capacity=access.proveSettlementCapacity(w);
assert.equal(capacity.ok,true,capacity.reason);
assert.equal(capacity.basis,'collateral');
assert.equal(access.canEnterFilmAuction(w),true);
assert.equal(w.playerGame.routes.yasmin.privateAccess,true,'qualified access is exposed to the existing Yasmin route state');

// Resilient information route: if the player only finds the source, Yasmin can source through Aspen instead of route-death.
let leadWorld=createHarbourWorld(122,{attentionPerDay:99});access.initializeYasminAccess(leadWorld);leadWorld.actors.player.contacts.push('dima');access.requestDimaFilmBrief(leadWorld,{role:'outsider'});
recordSourceDiscovery(leadWorld,'outer',['Sperm Whale Oil'],{returned:false,establishAfter:3});
const lead=access.shareWhaleOilSourceLead(leadWorld,{mode:'sell'});
assert.equal(lead.ok,true,lead.reason);
assert(leadWorld.yasminAccess.playerContribution==='source_lead');
assert(leadWorld.npcEconomy.sourceOrders.some(o=>o.actorId==='yasmin'&&o.good==='Sperm Whale Oil'),'Yasmin can use a real Aspen sourcing order after receiving the lead');

console.log('PASS: Yasmin film-night access distinguishes fake token, useful information, real delivery, invitation and settlement capacity');