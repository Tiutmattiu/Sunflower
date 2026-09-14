import assert from 'node:assert/strict';
import {DISTRICT_LANDMARKS,districtStateForWorld,districtOccluders,districtSignals} from '../src/harbourDistrict.js';

const requiredKinds=new Set([
  'sea','shore','berth','wong-services','octopus','bar','shisha','pizza-shop','deli','music-festival',
  'barber','massage','ice-cream','trash','park','grass','basketball','chess','faith-house','night-venue','exotic-pet',
  'glassblower','snake-performer','cliff','gallery','apartment-block','growing-yard','kitchen','old-hall'
]);
for(const landmark of DISTRICT_LANDMARKS)requiredKinds.delete(landmark.kind);
assert.equal(requiredKinds.size,0,`missing district kinds: ${[...requiredKinds].join(', ')}`);
for(const landmark of DISTRICT_LANDMARKS){
  assert(Number.isFinite(landmark.x)&&Number.isFinite(landmark.y),`invalid landmark ${landmark.id}`);
  assert(landmark.x>=0&&landmark.x<=2000&&landmark.y>=0&&landmark.y<=1200,`out of bounds ${landmark.id}`);
}
assert.equal(DISTRICT_LANDMARKS.filter(x=>x.ontologyId==='octopus').length,1,'Octopus must have one landmark');
assert.equal(DISTRICT_LANDMARKS.filter(x=>x.kind==='pizza-shop').length,1,'pizza shop should be distinct');
assert.equal(DISTRICT_LANDMARKS.filter(x=>x.kind==='deli').length,1,'deli should be distinct');

const base={day:2,weather:'fair'};
const storm=districtStateForWorld({...base,weather:'storm'}),fair=districtStateForWorld(base);
assert.notDeepEqual(storm,fair,'storm must visibly change the district state');
assert.equal(districtStateForWorld({day:5,weather:'fair'}).shabbatLike,true);
assert.equal(fair.festivalDay,true,'day 2 fixture should expose the separate festival state');

const occluders=districtOccluders(base);
assert(occluders.length>=4);
for(const item of occluders)assert(Number.isFinite(item.x)&&Number.isFinite(item.y)&&Number.isFinite(item.depthY));
const signals=districtSignals(base);
for(const kind of ['wong-services','shisha','faith-house','octopus','music-festival'])assert(signals.some(x=>x.kind===kind),`missing ${kind} signal`);

console.log('PASS: unified harbour district contract uses canonical institutions');
