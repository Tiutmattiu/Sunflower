import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DISTRICT_LANDMARKS} from '../src/harbourDistrict.js';
import {creaturesForWorld} from '../src/harbourTableau.js';

const byLocation = new Map(DISTRICT_LANDMARKS.filter(x=>x.locationId).map(x=>[x.locationId,x]));
const requiredLocations = new Map([
  ['viewing_room','gallery'],
  ['old_hall','old-hall'],
  ['back_room','apartment-block'],
  ['nursery','growing-yard'],
  ['sonyas_kitchen','kitchen'],
  ['public_clearing','public-clearing'],
]);
for (const [location,kind] of requiredLocations) {
  const landmark=byLocation.get(location);
  assert(landmark,`missing visible institution for ${location}`);
  assert.equal(landmark.kind,kind,`${location} should render as ${kind}, got ${landmark.kind}`);
}

const districtSource=await readFile(new URL('../src/HarbourDistrictLayer.jsx',import.meta.url),'utf8');
for (const token of ['yasmin-gallery','auction-podium','old-cinema','cinema-screen','dima-apartments','nursery-garden','sonya-kitchen','public-exchange']) {
  assert(districtSource.includes(token),`district renderer missing ${token}`);
}

const mapSource=await readFile(new URL('../src/HarbourMap.jsx',import.meta.url),'utf8');
assert(!mapSource.includes('/art/harbour-working.png'),'main map must not regress to the legacy raster');
assert(mapSource.includes('production.toads'),'gameplay toads must remain in the map scene graph');

const creatures=creaturesForWorld({day:2,weather:'fair'});
for (const species of ['seagull','tropical-fish','squirrel']) {
  assert(creatures.some(x=>x.species===species),`missing small-life species ${species}`);
}
console.log('PASS: harbour institutions and small-life contract');
