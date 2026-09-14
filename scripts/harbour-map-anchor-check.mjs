import assert from 'node:assert/strict';
import fs from 'node:fs';
const map=fs.readFileSync(new URL('../src/HarbourMap.jsx',import.meta.url),'utf8');
for(const marker of ['DISTRICT_LOCATION_POINTS','DISTRICT_PROP_POINTS']) assert(map.includes(marker),`map missing district anchor source ${marker}`);
assert(!map.includes('WORLD_PLACES=Object.fromEntries'),'map should not derive gameplay-map anchors from legacy illustration coordinates');
assert(map.includes('export const PLACES'),'legacy comic coordinates must remain exported');
const layer=fs.readFileSync(new URL('../src/HarbourDistrictLayer.jsx',import.meta.url),'utf8');
for(const marker of ['district-gallery','district-kitchen','district-nursery','district-old-hall','district-public-exchange','district-side-room']) assert(layer.includes(marker),`district renderer missing ${marker}`);
console.log('PASS: map uses unified location anchors and renders every gameplay place');
