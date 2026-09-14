import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/HarbourTableauLayer.jsx',import.meta.url),'utf8');
for(const marker of ['BARBER','MASSAGE','ICE CREAM','GRASS']) {
  assert(source.includes(marker),`missing visible harbour signal: ${marker}`);
}
console.log('PASS: harbour service and park signals');
