import assert from 'node:assert/strict';
import {crowdForWorld} from '../src/harbourTableau.js';
import {districtStateForWorld,districtSignals} from '../src/harbourDistrict.js';

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
const previewWorld=world({day:4});
const preview=crowdForWorld(previewWorld);
assert(count(preview,'auction-preview')>0,'preview days should visibly populate Yasmin gallery');
assert.equal(districtStateForWorld(previewWorld).auctionPreview,true);
assert(districtSignals(previewWorld).some(x=>x.kind==='gallery'&&x.emphasized));
const auctionWorld=world({day:6});
const auction=crowdForWorld(auctionWorld);
assert(count(auction,'auction-day')>count(preview,'auction-day'),'auction day should create a stronger gallery crowd');
assert.equal(districtStateForWorld(auctionWorld).auctionDay,true);

const barWorld=world({relationshipEcology:{barEvenings:[{day:3,attendees:['joel','juan','dima','yasmin'],served:['juan','dima','yasmin']}]}});
const barBusy=crowdForWorld(barWorld);
assert(count(barBusy,'bar-hotspot')>count(base,'bar-hotspot'),'a real bar evening should increase visible bar density');
assert.equal(districtStateForWorld(barWorld).barBusy,true);

const wongWorld=world({actors:{wong:{busy:4,capacity:5}},wongBusiness:{stored:[1,2,3]}});
const wongBusy=crowdForWorld(wongWorld);
assert(count(wongBusy,'wong-hotspot')>count(base,'wong-hotspot'),'Wong workload should lengthen the visible service queue');
assert.equal(districtStateForWorld(wongWorld).wongBusy,true);

const octopusWorld=world({market:{orders:[{status:'open'},{status:'open'},{status:'open'},{status:'open'}]}});
const octopusBusy=crowdForWorld(octopusWorld);
assert(count(octopusBusy,'octopus-hotspot')>count(base,'octopus-hotspot'),'open public orders should populate Octopus');
assert.equal(districtStateForWorld(octopusWorld).octopusBusy,true);
assert(districtSignals(octopusWorld).some(x=>x.kind==='octopus'&&x.emphasized),'the single Octopus signal should strengthen when the clearing is busy');

const toadWorld=world({toadCircle:{occurrences:[{day:3,attending:['juan','aspen']}]}});
const toadDay=crowdForWorld(toadWorld);
assert(count(toadDay,'toad-circle')>0,'a real toad-circle occurrence should be visible near the nursery');
assert.equal(districtStateForWorld(toadWorld).toadGathering,true);

const festival=crowdForWorld(world({day:2}));
assert(count(festival,'music-festival')>=4,'festival day should create a distinct live-music crowd away from the Bar');
console.log('PASS: harbour hotspots reflect live state without duplicating institutions');
