import assert from 'node:assert/strict';
import {advanceHarbourWindow,createHarbourWorld} from '../src/harbourSpine.js';
import {performPlayerAction as act,visitLocation as go} from '../src/playerGame.js';
import {diagnosePlayer,MARKET_SCARS} from '../src/playerDiagnosis.js';
import {requestDimaFilmBrief,arrangeWhaleOilDelivery,advanceYasminAccess,proveSettlementCapacity} from '../src/yasminAccess.js';

const day=w=>advanceHarbourWindow(w);
const to=(w,n)=>{while(w.day<n)w=day(w);return w};

let gap=createHarbourWorld();
gap=go(gap,'joels_bar');gap=act(gap,'trade_bridge');gap=day(gap);gap=go(gap,'joels_bar');gap=act(gap,'intermediate_lead');gap=act(gap,'trade_bridge');

let run=createHarbourWorld();
run=go(run,'joels_bar');run=act(run,'trade_bridge');
for(let i=0;i<3;i++){run=day(run);run=go(run,'public_clearing');run=act(run,'misstate_public_listing')}
run=act(run,'fire_sale');

// TAUGHT YOUR RIVAL must now arise inside the earned Yasmin market, not from
// the retired day-2 calendar shortcut. The fixture uses real access primitives
// and then exercises the old provenance-sharing scar after access is legitimate.
let rival=createHarbourWorld(41,{attentionPerDay:99});
rival=to(rival,4);
if(!rival.actors.player.contacts.includes('dima'))rival.actors.player.contacts.push('dima');
assert.equal(requestDimaFilmBrief(rival,{role:'outsider'}).ok,true);
rival.actors.player.inventory.push({unitId:'scar-whale-oil',kind:'Sperm Whale Oil',owner:'player',age:0,costBasis:11,source:'route_outer_import',opened:false,remaining:1});
const delivery=arrangeWhaleOilDelivery(rival,{sellerId:'player'});
assert.equal(delivery.ok,true,delivery.reason);
rival=to(rival,delivery.dueDay);
advanceYasminAccess(rival);
assert.equal(proveSettlementCapacity(rival).ok,true);
rival.actors.yasmin.location='viewing_room';
rival=go(rival,'viewing_room');
rival.actors.yasmin.location='viewing_room';
rival=act(rival,'auction_preview');
rival=act(rival,'auction_provenance');
rival=act(rival,'share_provenance');
rival=to(rival,rival.playerGame.routes.yasmin.auctionDay);
rival.actors.yasmin.location='viewing_room';
rival=go(rival,'viewing_room');
rival.actors.yasmin.location='viewing_room';
rival=act(rival,'auction_bid',{amount:1});
rival=day(rival);

const runs={gap,run,rival},required=['FIRST THROUGH THE GAP','FIRE SALE','SOLD THE MAP','TAUGHT YOUR RIVAL','RUN ON YOU'],proof={};
for(const name of required){
 for(const [runName,w] of Object.entries(runs)){
  const scar=diagnosePlayer(w).scars.find(s=>s.name===name);
  if(scar)proof[name]={classification:'A',run:runName,evidenceIds:scar.evidenceIds,sequence:scar.types};
 }
 assert(proof[name],`${name} not causally reproduced`);
}
const classification=Object.fromEntries(MARKET_SCARS.map(s=>[s.name,{classification:s.coverage==='A'?'A':'B',reproduced:proof[s.name]||null,causalTypes:s.types}]));
assert(!Object.values(classification).some(x=>['C','D'].includes(x.classification)));
console.log(JSON.stringify({proof,classification},null,2));
