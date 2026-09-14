import assert from 'node:assert/strict';
import {crowdForWorld} from '../src/harbourTableau.js';

const world=(overrides={})=>({
  day:3,weather:'fair',
  playerGame:{routes:{yasmin:{previewOpens:2,previewCloses:5,auctionDay:6}}},
  relationshipEcology:{barEvenings:[]},
  actors:{wong:{busy:0,capacity:5}},
  wongBusiness:{stored:[]},
  market:{orders:[]},
  toadCircle:{occurrences:[]},
  ...overrides,
});
const count=(rows,tag)=>rows.filter(x=>x.tags?.includes(tag)).length;

const base=crowdForWorld(world());
const preview=crowdForWorld(world({day:4}));
assert(count(preview,'auction-preview')>0,'preview days should visibly populate Yasmin gallery');
const auction=crowdForWorld(world({day:6}));
assert(count(auction,'auction-day')>count(preview,'auction-day'),'auction day should create a stronger gallery crowd');

const barBusy=crowdForWorld(world({relationshipEcology:{barEvenings:[{day:3,attendees:['joel','juan','dima','yasmin'],served:['juan','dima','yasmin']}]}}));
assert(count(barBusy,'bar-hotspot')>count(base,'bar-hotspot'),'a real bar evening should increase visible bar density');

const wongBusy=crowdForWorld(world({actors:{wong:{busy:4,capacity:5}},wongBusiness:{stored:[1,2,3]}}));
assert(count(wongBusy,'wong-hotspot')>count(base,'wong-hotspot'),'Wong workload should lengthen the visible service queue');

const marketBusy=crowdForWorld(world({market:{orders:[{status:'open'},{status:'open'},{status:'open'},{status:'open'}]}}));
assert(count(marketBusy,'exchange-hotspot')>count(base,'exchange-hotspot'),'open public orders should populate Octopus Clearing');

const toadDay=crowdForWorld(world({toadCircle:{occurrences:[{day:3,attending:['juan','aspen']}]}}));
assert(count(toadDay,'toad-circle')>0,'a real toad-circle occurrence should be visible near the nursery');
console.log('PASS: harbour crowd hotspots reflect live social/economic state');
