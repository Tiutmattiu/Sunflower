import assert from 'node:assert/strict';
import fs from 'node:fs';
import {raceBettingLines} from '../src/racePresentation.js';

const scene={
  day:3,
  raceNumber:1,
  raceChance:.32,
  present:['joel','juan','aspen','wong','yasmin'],
  opinions:[
    {actorId:'aspen',side:'player',estimate:.54},
    {actorId:'wong',side:'juan',estimate:.24},
    {actorId:'yasmin',side:'juan',estimate:.36},
  ],
  bets:[{playerBacker:'aspen',juanBacker:'wong',stake:1,winnerSide:'player',winnerId:'aspen',loserId:'wong',settled:true}],
  outcome:'player',
};
const names={aspen:'Aspen',wong:'Wong',yasmin:'Yasmin',joel:'Joel',juan:'Juan',dima:'Dima'};
const lines=raceBettingLines(scene,id=>names[id]||id);
assert(lines.some(x=>x.includes('Aspen')&&x.includes('Wong')&&x.includes('1 tin')),'copy must render the actual matched bet and stake');
assert(lines.some(x=>x.includes('Aspen')&&x.includes('collect')),'copy must render the actual settlement winner');
assert(!lines.some(x=>x.includes('Dima')),'presentation invented an absent bettor');

const app=fs.readFileSync(new URL('../src/AppCore.jsx',import.meta.url),'utf8');
assert(app.includes("from './racePresentation.js'"),'AppCore must use the ledger-backed race presentation helper');
assert(app.includes('advanced.playerGame.routes.juan.lastBetting'),'race comic must read betting state after intervention settlement');
assert(app.includes('raceBettingLines('),'race comic must render the actual betting ledger');
console.log('PASS: race betting presentation is ledger-backed and cannot invent absent bettors');
