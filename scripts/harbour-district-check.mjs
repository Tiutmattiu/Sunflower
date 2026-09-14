import assert from 'node:assert/strict';
import {
  DISTRICT_LANDMARKS,
  districtStateForWorld,
  districtOccluders,
  districtSignals,
} from '../src/harbourDistrict.js';

const requiredKinds = new Set([
  'sea','shore','berth','wong-services','octopus-bank','bar-live-music','shisha','pizza-deli',
  'barber','massage','ice-cream','trash','park','grass','basketball','chess','faith-house','night-venue','exotic-pet',
  'glassblower','snake-performer','cliff'
]);
for (const landmark of DISTRICT_LANDMARKS) requiredKinds.delete(landmark.kind);
assert.equal(requiredKinds.size, 0, `missing district kinds: ${[...requiredKinds].join(', ')}`);
for (const landmark of DISTRICT_LANDMARKS) {
  assert(Number.isFinite(landmark.x) && Number.isFinite(landmark.y), `invalid landmark ${landmark.id}`);
  assert(landmark.x >= 0 && landmark.x <= 2000 && landmark.y >= 0 && landmark.y <= 1200, `out of bounds ${landmark.id}`);
}

const base = {day:2, weather:'fair'};
const storm = districtStateForWorld({...base, weather:'storm'});
const fair = districtStateForWorld(base);
assert.notDeepEqual(storm, fair, 'storm must visibly change the district state');
const shabbat = districtStateForWorld({day:5, weather:'fair'});
assert.equal(shabbat.shabbatLike, true);

const occluders = districtOccluders(base);
assert(occluders.length >= 4);
for (const item of occluders) {
  assert(Number.isFinite(item.x) && Number.isFinite(item.y) && Number.isFinite(item.depthY));
}
const signals = districtSignals(base);
assert(signals.some(x=>x.kind==='wong-services'));
assert(signals.some(x=>x.kind==='shisha'));
assert(signals.some(x=>x.kind==='faith-house'));

console.log('PASS: unified harbour district contract');
