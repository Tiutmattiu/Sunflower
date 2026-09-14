import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DISTRICT_LANDMARKS} from '../src/harbourDistrict.js';
import {crowdForWorld} from '../src/harbourTableau.js';
import {WORLD_ONTOLOGY,canonicalPlaceForRuntime} from '../src/worldOntology.js';

const mapSource=fs.readFileSync(new URL('../src/HarbourDistrictLayer.jsx',import.meta.url),'utf8');
const presentation=fs.readFileSync(new URL('../src/presentationCopy.js',import.meta.url),'utf8');

// Octopus is one institution: clearing + payment + local market data.
const octopusLike=DISTRICT_LANDMARKS.filter(x=>x.ontologyId==='octopus'||x.kind==='octopus-bank'||x.kind==='public-clearing'||/octopus/i.test(x.label||''));
assert.equal(octopusLike.length,1,`Octopus must be one institution, found ${octopusLike.map(x=>x.id).join(', ')}`);
assert.equal(octopusLike[0].locationId,'public_clearing');
assert.equal(octopusLike[0].ontologyId,'octopus');
assert.equal(canonicalPlaceForRuntime('public_clearing'),'octopus');
assert.deepEqual(WORLD_ONTOLOGY.octopus.functions,['clearing','payment','local-market-data','public-orders','settlement-records']);
for(const [name,source] of [['district renderer',mapSource],['presentation copy',presentation]])assert(!/Octopus Bank|OCTOPUS BANK/.test(source),`${name} must not present a second Octopus bank`);
assert(!/public_clearing:\s*['"]Exchange['"]/.test(presentation),'player-facing location label must identify Octopus rather than a generic second Exchange');

// Creator listed these as distinct street businesses/events; do not silently merge them.
assert(DISTRICT_LANDMARKS.some(x=>x.ontologyId==='pizza-shop'),'missing distinct pizza shop');
assert(DISTRICT_LANDMARKS.some(x=>x.ontologyId==='deli'),'missing distinct deli');
assert(!DISTRICT_LANDMARKS.some(x=>x.kind==='pizza-deli'),'pizza and deli must not be silently collapsed into one landmark');
assert(DISTRICT_LANDMARKS.some(x=>x.ontologyId==='music-festival'),'missing street/live music festival distinct from Joel’s Bar');
assert(DISTRICT_LANDMARKS.some(x=>x.locationId==='joels_bar'),'Joel’s Bar must remain its own place');

for(const [locationId,expected] of [['viewing_room','yasmin-gallery'],['back_room','dima-apartments'],['parcel_counter','wong-services'],['nursery','juan-nursery'],['old_hall','old-hall']]){
  const rows=DISTRICT_LANDMARKS.filter(x=>x.locationId===locationId);
  assert.equal(rows.length,1,`${locationId} should map to one visible institution, found ${rows.map(x=>x.id).join(', ')}`);
  assert.equal(rows[0].ontologyId,expected,`${locationId} should map to ${expected}`);
  assert.equal(canonicalPlaceForRuntime(locationId),expected,`ontology registry disagrees for ${locationId}`);
}

const crowd=crowdForWorld({day:2,weather:'fair',actors:{wong:{busy:0}},market:{orders:[]},relationshipEcology:{barEvenings:[]},wongBusiness:{stored:[]}});
const ids=crowd.map(x=>x.id),tags=new Set(crowd.flatMap(x=>x.tags||[]));
assert(!ids.some(id=>id.includes('octopus-bank')),'obsolete Octopus-bank crowd remains');
assert(!tags.has('octopus-bank'),'obsolete Octopus-bank crowd tag remains');
assert(!tags.has('pizza-deli'),'pizza/deli crowd conflation remains');
assert(tags.has('octopus'),'single Octopus institution should have visible crowd');
assert(tags.has('pizza-shop')&&tags.has('deli'),'pizza and deli should have separate crowd identities');
assert(tags.has('music-festival'),'festival day should visibly differ from ordinary Bar music');

console.log('PASS: world ontology keeps single institutions single and distinct places distinct');
