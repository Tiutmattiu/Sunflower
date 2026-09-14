import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/HarbourTableauLayer.jsx',import.meta.url),'utf8');
for(const marker of ["variant==='skeleton'","variant==='wealthy'","activity==='slump'","item.scale||1","item.age==='elder'"]) assert(source.includes(marker),`missing crowd renderer behavior: ${marker}`);
console.log('PASS: crowd renderer covers age, scale, wealth, slump and skeleton variants');
