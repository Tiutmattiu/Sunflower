import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import {visibleActions,performPlayerAction,resolvePlayerDay} from '../src/playerGame.js';
import {
  initializeYasminAccess,
  requestDimaFilmBrief,
  arrangeWhaleOilDelivery,
  advanceYasminAccess,
  proveSettlementCapacity,
  canEnterFilmAuction,
} from '../src/yasminAccess.js';

function putAtViewingRoom(w){
  w.playerGame.location='viewing_room';
  w.actors.player.location='viewing_room';
  w.actors.yasmin.location='viewing_room';
}

let w=createHarbourWorld(141,{attentionPerDay:99});
initializeYasminAccess(w);
w.day=6;
putAtViewingRoom(w);
w.actors.player.contacts.push('yasmin');

const legacyIds=new Set(['auction_preview','auction_inspect','auction_provenance','auction_finance','auction_bid','auction_walk']);
let visible=visibleActions(w).filter(a=>legacyIds.has(a.id));
assert.equal(visible.length,0,'calendar alone must not expose the legacy auction route before private access is earned');

let blocked=performPlayerAction(w,'auction_preview');
assert.equal(blocked.playerGame.routes.yasmin.preview,false,'direct invocation cannot bypass the invitation/capacity gate');
assert.match(blocked.playerGame.lastBlock||'',/invitation|access|settlement/i,'blocked auction action should explain the missing access condition without leaking the sourcing solution');

// A pre-migration save cannot bypass the new access authority by carrying an old pending bid.
let legacy=createHarbourWorld(143,{attentionPerDay:99});
initializeYasminAccess(legacy);
legacy.day=7;
legacy.playerGame.routes.yasmin.preview=true;
legacy.playerGame.routes.yasmin.bid=16;
legacy.playerGame.routes.yasmin.stage='bid';
legacy.playerGame.commitments.push({id:'auction-bid',title:'Hammer-night bid',dueDay:7,status:'open',lockedCash:16,location:'viewing_room'});
const cashBeforeLegacy=legacy.actors.player.cash;
resolvePlayerDay(legacy);
assert.equal(legacy.playerGame.sunflower.owned,false,'legacy pending auction bid cannot award the sunflower without earned private access');
assert.equal(legacy.actors.player.cash,cashBeforeLegacy,'blocked legacy auction settlement cannot take player cash');
assert.notEqual(legacy.playerGame.commitments.find(c=>c.id==='auction-bid')?.status,'fulfilled','legacy unauthorised bid must not settle as fulfilled');

// Earn the real route after the old fixed preview dates have already passed.
w=createHarbourWorld(142,{attentionPerDay:99});
initializeYasminAccess(w);
w.day=8;
w.actors.player.contacts.push('dima');
assert.equal(requestDimaFilmBrief(w,{role:'outsider'}).ok,true);
w.actors.player.inventory.push({unitId:'qualified-whale-oil',kind:'Sperm Whale Oil',owner:'player',age:0,costBasis:11,source:'route_outer_import',opened:false,remaining:1});
const delivery=arrangeWhaleOilDelivery(w,{sellerId:'player'});
assert.equal(delivery.ok,true,delivery.reason);
w.day=delivery.dueDay;
advanceYasminAccess(w);
assert.equal(w.yasminAccess.invited,true,'real delivered contribution should issue the serialled silver invitation');
const approvedDay=w.day;
const capacity=proveSettlementCapacity(w);
assert.equal(capacity.ok,true,capacity.reason);
assert.equal(canEnterFilmAuction(w),true);
assert.equal(w.playerGame.routes.yasmin.privateAccess,true);
assert.equal(w.playerGame.routes.yasmin.preview,false,'pre-access legacy preview state must not be treated as earned private access');
assert.equal(w.playerGame.routes.yasmin.previewOpens,approvedDay,'qualified access opens a fresh preview window from the approval day');
assert(w.playerGame.routes.yasmin.previewCloses>approvedDay,'the fresh private preview must remain open long enough to inspect');
assert(w.playerGame.routes.yasmin.auctionDay>w.playerGame.routes.yasmin.previewCloses,'hammer night follows the earned preview instead of a stale fixed day');

putAtViewingRoom(w);
visible=visibleActions(w);
const preview=visible.find(a=>a.id==='auction_preview');
assert(preview&&!preview.disabled,'late-earned legitimate access must make preview playable immediately');
assert.equal(visible.some(a=>a.id==='auction_bid'),false,'the bid is not exposed before the player actually enters the earned preview');

w=performPlayerAction(w,'auction_preview');
assert.equal(w.playerGame.routes.yasmin.preview,true,'earned private access can start the actual auction investigation route');
assert.equal(w.playerGame.lastBlock,null);

console.log('PASS: Yasmin auction actions require earned invitation + settlement capacity and schedule from access time');
