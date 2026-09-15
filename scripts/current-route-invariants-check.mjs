import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import {performPlayerAction,juanRaceChance,juanRaceRoll,resolvePlayerDay} from '../src/playerGame.js';
import {PLAYER_KNOWLEDGE as K} from '../src/playerKnowledge.js';

const snapshot=w=>JSON.stringify({cash:w.actors.player.cash,inventory:w.actors.player.inventory,attention:w.attention,evidence:w.evidence,commitments:w.playerGame.commitments});
const setLoc=(w,l)=>{w.playerGame.location=l;w.actors.player.location=l;return w};

let w=createHarbourWorld(41,{attentionPerDay:99,publishNews:false});
w.attention.budget=99;w.actors.player.cash=100;
const supplierBottle=w.actors.wharf_suppliers.inventory.find(x=>x.kind==='Orgeat');
assert(supplierBottle,'fresh world should place the one route Orgeat bottle with a real supplier');
assert(!w.actors.joel.inventory.some(x=>x.kind==='Orgeat'),'Joel must truly begin without Orgeat');
assert.equal(Object.values(w.actors).flatMap(a=>a.inventory).filter(x=>x.kind==='Orgeat').length,1,'starter Orgeat must not be duplicated');

setLoc(w,'harbour_berth');
let before=snapshot(w),blocked=performPlayerAction(w,'buy_part',{kind:'Chain Quick-Link',price:2});
assert(blocked.playerGame.lastBlock,'direct parts purchase before Aspen assessment must be blocked');
assert.equal(snapshot(blocked),before,'blocked hidden-route action must be atomic');

w.playerGame.knowledge.push(K.mai_tai_ingredient);
const bought=performPlayerAction(w,'source_orgeat');
assert(!bought.playerGame.lastBlock);
const playerBottle=bought.actors.player.inventory.find(x=>x.kind==='Orgeat');
assert.equal(playerBottle.unitId,supplierBottle.unitId,'Orgeat purchase must move the existing physical unit');
assert.equal(Object.values(bought.actors).flatMap(a=>a.inventory).filter(x=>x.unitId===supplierBottle.unitId).length,1,'the moved bottle must still exist exactly once');

// Prepare the one-wheel build without using the happy-path test helper. Cargo
// must cross its real day boundaries before a physical part can be purchased.
w=bought;w.playerGame.knowledge.push(K.juan_route,K.onewheel_plan);w.actors.aspen.location='harbour_berth';
for(let d=1;d<=6;d++){w.day=d;resolvePlayerDay(w);}
for(const [kind,price] of [['Steel Rim',5],['Chain Quick-Link',2],['Brake Cable',2],['Handlebar Tape',2]]){
 const n=performPlayerAction(w,'buy_part',{kind,price});assert(!n.playerGame.lastBlock,`${kind} setup failed: ${n.playerGame.lastBlock}`);w=n;
}
w.playerGame.lime={...w.playerGame.lime,stage:'complete',inspected:true,representation:'ambiguous'};
before=snapshot(w);blocked=performPlayerAction(w,'assemble_onewheel');
assert(blocked.playerGame.lastBlock,'ambiguous lime handling must not unlock Aspen assembly');
assert.equal(snapshot(blocked),before,'failed relational assembly gate must not consume parts');

w.playerGame.lime.representation='disclose';
const rim=w.actors.player.inventory.find(x=>x.kind==='Steel Rim');
w.market.reservations.push({orderId:'test-reserve',actorId:'player',kind:'unit',unitId:rim.unitId});
before=snapshot(w);blocked=performPlayerAction(w,'assemble_onewheel');
assert(blocked.playerGame.lastBlock,'reserved build part must not be reusable for assembly');
assert.equal(snapshot(blocked),before,'reserved-part failure must be atomic');
w.market.reservations=w.market.reservations.filter(x=>x.orderId!=='test-reserve');
w=performPlayerAction(w,'assemble_onewheel');assert(!w.playerGame.lastBlock);

// A person listed in an earlier bar event but no longer physically there must not inflate the wager bill.
setLoc(w,'joels_bar');w.actors.joel.location='joels_bar';w.actors.juan.location='joels_bar';w.actors.yasmin.location='viewing_room';
w.relationshipEcology.barEvenings=[{day:w.day,attendees:['joel','juan','yasmin'],served:['juan','yasmin']}];
for(let seed=1;seed<1000;seed++){w.seed=seed;if(juanRaceRoll(w)>juanRaceChance(w))break}
const cashBefore=w.actors.player.cash;
w=performPlayerAction(w,'race_juan');assert(!w.playerGame.lastBlock);assert(!w.playerGame.sunflower.owned,'fixture should lose');
const loss=w.evidence.findLast?.(x=>x.type==='juan_race_lost')||[...w.evidence].reverse().find(x=>x.type==='juan_race_lost');
assert(loss,'race loss evidence missing');
assert.equal(loss.context.drinksCost,6,'only Joel and Juan are physically present; departed Yasmin must not count');
assert.equal(cashBefore-w.actors.player.cash,6,'the actual two-person bar scene should cost two drinks');

before=snapshot(w);blocked=performPlayerAction(w,'race_juan');
assert(blocked.playerGame.lastBlock,'same-day race must not be a free reroll');
assert.equal(snapshot(blocked),before,'blocked same-day reroll must be atomic');

console.log('PASS: current route preserves physical units, reservations, honest gates and actual race co-presence');
