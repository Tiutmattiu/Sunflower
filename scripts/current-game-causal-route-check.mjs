import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import {performPlayerAction,visibleActions,PLAYER_COUNTERPARTIES,juanRaceChance,juanRaceRoll,resolvePlayerDay} from '../src/playerGame.js';
import {knows,PLAYER_KNOWLEDGE as K} from '../src/playerKnowledge.js';

const setLocation=(w,location)=>{w.playerGame.location=location;w.actors.player.location=location;return w};
const labels=w=>visibleActions(w).map(a=>`${a.id}:${a.label}`).join('\n');
const act=(w,id,payload={})=>{const next=performPlayerAction(w,id,payload);assert(!next.playerGame.lastBlock,`${id} blocked: ${next.playerGame.lastBlock}`);return next};

let w=createHarbourWorld(41,{attentionPerDay:99});
w.attention.budget=99;w.actors.player.cash=100;

// Fresh players may meet Juan but must not get the route vocabulary or shopping list.
setLocation(w,'nursery');
w=act(w,'meet',{actor:'juan'});
assert(!/juan_plan|buy_part|assemble_onewheel|cliff_commit/.test(labels(w)),'fresh Juan meeting leaked old route actions');
setLocation(w,'harbour_berth');
assert(!/Orgeat|almond syrup|source_orgeat/.test(labels(w)),'fresh berth leaked the Mai Tai answer');

// Taste first; Joel only establishes that the drink is wrong.
setLocation(w,'joels_bar');
w=act(w,'meet',{actor:'joel'});
w=act(w,'mai_tai_taste');
assert(knows(w,K.mai_tai_tasted)&&knows(w,K.mai_tai_problem));
setLocation(w,'harbour_berth');
assert(!/Orgeat|almond syrup|source_orgeat/.test(labels(w)),'tasting alone should not reveal the answer');

// A separate clue/inference action earns the ingredient identity.
setLocation(w,'joels_bar');
w=act(w,'mai_tai_check_shelf');
assert(knows(w,K.mai_tai_ingredient));
setLocation(w,'harbour_berth');
assert(/source_orgeat/.test(labels(w)),'identified ingredient should unlock a real source');
w=act(w,'source_orgeat');
assert(w.actors.player.inventory.some(x=>x.kind==='Orgeat'));
setLocation(w,'joels_bar');
w=act(w,'joel_supply_orgeat');
assert(knows(w,K.mai_tai_supplied));

// Joel/Juan gate requires real co-presence.
assert(!visibleActions(w).some(a=>a.id==='joel_serve_juan'),'Juan is absent; social drink must not fire');
w.actors.juan.location='joels_bar';
assert(visibleActions(w).some(a=>a.id==='joel_serve_juan'),'co-present Juan should unlock Joel serving him');
w=act(w,'joel_serve_juan');
assert(knows(w,K.juan_bar_drink));
w=act(w,'juan_explain_goal');
assert(knows(w,K.juan_goal_explained));
w=act(w,'juan_race_offer');
assert(knows(w,K.juan_route));

// Juan gives a race contract, not a parts list. Aspen earns the build-plan reveal.
setLocation(w,'harbour_berth');w.actors.aspen.location='harbour_berth';
assert(!visibleActions(w).some(a=>a.id==='buy_part'),'parts list should remain hidden until Aspen assesses the build');
w=act(w,'aspen_onewheel_plan');
assert(knows(w,K.onewheel_plan));
assert(visibleActions(w).some(a=>a.id==='buy_part'),'earned Aspen assessment should unlock sourcing');
assert.equal(PLAYER_COUNTERPARTIES.assemble_onewheel,'aspen','Wong must not remain the assembler');

// Let authored cargo days actually occur. Parts must already exist in the world
// before purchase; the route test may not teleport straight to day 6 anymore.
for(let d=1;d<=6;d++){w.day=d;resolvePlayerDay(w);}
w.playerGame.lime={...w.playerGame.lime,stage:'complete',representation:'disclose',inspected:true};
for(const [kind,price] of [['Steel Rim',5],['Chain Quick-Link',2],['Brake Cable',2],['Handlebar Tape',2]])w=act(w,'buy_part',{kind,price});
w=act(w,'assemble_onewheel');
assert(w.actors.player.inventory.some(x=>x.kind==='Built Onewheel'));
assert(w.playerGame.routes.juan.built);

// Practice is a real time-consuming preparation path and improves odds without certainty.
const beforeChance=juanRaceChance(w);
w=act(w,'practice_onewheel');
const afterChance=juanRaceChance(w);
assert(beforeChance<.5,'unprepared first-race chance must be difficult');
assert(afterChance>beforeChance,'practice must improve race odds');
assert(afterChance<1,'practice must not guarantee the race');

// Force a deterministic losing seed and require a real drinks consequence.
setLocation(w,'joels_bar');w.actors.juan.location='joels_bar';w.actors.joel.location='joels_bar';
for(let seed=1;seed<500;seed++){w.seed=seed;if(juanRaceRoll(w)>juanRaceChance(w))break}
const cashBefore=w.actors.player.cash,joelBefore=w.actors.joel.cash;
w=act(w,'race_juan');
assert(!w.playerGame.sunflower.owned,'fixture should lose the race');
assert(w.actors.player.cash<cashBefore||w.playerGame.commitments.some(c=>c.id.startsWith('juan-race-drinks-')),'losing must cost drinks now or create a real drinks obligation');
assert(w.actors.joel.cash>joelBefore||w.playerGame.commitments.some(c=>c.id.startsWith('juan-race-drinks-')),'bar must receive payment or a claim on it');
assert(!visibleActions(w).some(a=>a.id==='cliff_commit'),'old direct cliff completion must not return');

console.log('PASS: current Mai Tai -> Juan -> Aspen -> practice/race causal route');
