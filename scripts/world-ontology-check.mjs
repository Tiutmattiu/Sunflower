import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DISTRICT_LANDMARKS} from '../src/harbourDistrict.js';

const mapSource=fs.readFileSync(new URL('../src/HarbourDistrictLayer.jsx', import.meta.url),'utf8');
const presentation=fs.readFileSync(new URL('../src/presentationCopy.js', import.meta.url),'utf8');
const playerGame=fs.readFileSync(new URL('../src/playerGame.js', import.meta.url),'utf8');

// Octopus is one institution: clearing + payment + local market data.
const octopusLike=DISTRICT_LANDMARKS.filter(x=>
  x.ontologyId==='octopus' ||
  x.kind==='octopus-bank' ||
  x.kind==='public-clearing' ||
  /octopus/i.test(x.label||'')
);
assert.equal(octopusLike.length,1,`Octopus must be one institution, found ${octopusLike.map(x=>x.id).join(', ')}`);
assert.equal(octopusLike[0].locationId,'public_clearing','the one Octopus institution must own the legacy public_clearing runtime location');
assert.equal(octopusLike[0].ontologyId,'octopus','Octopus landmark must use the canonical ontology id');

for(const [name,source] of [['district renderer',mapSource],['presentation copy',presentation],['player game',playerGame]]){
  assert(!/Octopus Bank|OCTOPUS BANK/.test(source),`${name} must not present a second Octopus bank`);
}
assert(!/name:\s*['"]Octopus Clearing['"]/.test(playerGame),'player-facing location must be Octopus, not a second Clearing institution');
assert(!/public_clearing:\s*['"]Exchange['"]/.test(presentation),'player-facing location label must identify Octopus rather than a separate generic Exchange');

// Creator listed these as distinct street businesses/events; do not silently merge them.
assert(DISTRICT_LANDMARKS.some(x=>x.ontologyId==='pizza-shop'),'missing distinct pizza shop');
assert(DISTRICT_LANDMARKS.some(x=>x.ontologyId==='deli'),'missing distinct deli');
assert(!DISTRICT_LANDMARKS.some(x=>x.kind==='pizza-deli'),'pizza and deli must not be silently collapsed into one landmark');
assert(DISTRICT_LANDMARKS.some(x=>x.ontologyId==='music-festival'),'missing street/live music festival distinct from Joel’s Bar');
assert(DISTRICT_LANDMARKS.some(x=>x.locationId==='joels_bar'),'Joel’s Bar must remain its own place');

// Existing runtime aliases intentionally remain one visible place each.
for(const [locationId,expected] of [['viewing_room','yasmin-gallery'],['back_room','dima-apartments'],['parcel_counter','wong-services'],['nursery','juan-nursery'],['old_hall','old-hall']]){
  const rows=DISTRICT_LANDMARKS.filter(x=>x.locationId===locationId);
  assert.equal(rows.length,1,`${locationId} should map to one visible institution, found ${rows.map(x=>x.id).join(', ')}`);
  assert.equal(rows[0].ontologyId,expected,`${locationId} should map to ${expected}`);
}

console.log('PASS: world ontology keeps single institutions single and distinct places distinct');
