import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/HarbourTableauLayer.jsx',import.meta.url),'utf8');
for(const marker of ['WONG','OCTOPUS BANK','SHISHA','PIZZA']) {
  assert(source.includes(marker),`missing visible harbour signal: ${marker}`);
}
console.log('PASS: harbour scene signals');
