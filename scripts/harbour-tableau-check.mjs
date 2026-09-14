import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  TABLEAU_ZONES,
  NAMED_ACTOR_SLOTS,
  crowdForWorld,
  creaturesForWorld,
  namedActorPoint,
} from '../src/harbourTableau.js';

assert(TABLEAU_ZONES.length >= 8);
for (const zone of TABLEAU_ZONES) {
  assert(zone.id);
  assert(zone.kind === 'ground' || zone.kind === 'water');
  assert(zone.bounds && zone.bounds.length === 4);
}

const world = {
  day: 2,
  weather: 'clear',
  actors: {
    joel: {location: 'joels_bar'},
    juan: {location: 'nursery'},
    aspen: {location: 'harbour_berth'},
    wong: {location: 'parcel_counter'},
    yasmin: {location: 'viewing_room'},
    dima: {location: 'back_room'},
  },
};

const crowd = crowdForWorld(world);
assert(crowd.length >= 18, 'crowd should visibly populate the tableau');
assert(crowd.some(x => x.activity === 'basketball'));
assert(crowd.some(x => x.activity === 'chess'));
assert(crowd.some(x => x.activity === 'shisha'));
assert(crowd.some(x => x.activity === 'swim'));

for (const person of crowd.filter(x => x.kind === 'person' && x.activity !== 'swim')) {
  assert.equal(person.zoneKind, 'ground');
}
for (const swimmer of crowd.filter(x => x.activity === 'swim')) {
  assert.equal(swimmer.zoneKind, 'water');
}

const creatures = creaturesForWorld(world);
assert(creatures.some(x => x.species === 'seagull'));
assert(creatures.some(x => x.species === 'squirrel'));
assert(creatures.some(x => x.species === 'tropical-fish'));

for (const id of Object.keys(NAMED_ACTOR_SLOTS)) {
  const point = namedActorPoint(world, id);
  assert(point && Number.isFinite(point.x) && Number.isFinite(point.y));
}

const rainy = crowdForWorld({...world, weather:'storm'});
assert(rainy.filter(x => x.zoneId === 'sea-shore').length < crowd.filter(x => x.zoneId === 'sea-shore').length);

const tags = new Set(crowd.flatMap(x => x.tags || []));
for (const tag of [
  'wong-services','octopus-bank','live-music','pizza-deli','shisha',
  'basketball','chess','faith','vice','exotic-pet','glassblower',
  'snake-charmer','homeless','sea-leisure'
]) assert(tags.has(tag), `missing tableau tag: ${tag}`);

const mapSource = fs.readFileSync(new URL('../src/HarbourMap.jsx', import.meta.url), 'utf8');
for (const marker of ['crowdForWorld','creaturesForWorld','namedActorPoint','data-crowd-id','data-creature-id']) {
  assert(mapSource.includes(marker), `HarbourMap renderer missing ${marker}`);
}

console.log('PASS: harbour tableau zones, crowd, creatures, scene tags and renderer integration');
