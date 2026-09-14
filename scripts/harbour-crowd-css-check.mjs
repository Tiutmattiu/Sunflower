import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/harbourTableau.css',import.meta.url),'utf8');
for(const marker of ['.activity-slump','.tableau-skeleton','.variant-wealthy']) assert(source.includes(marker),`missing crowd css ${marker}`);
console.log('PASS: crowd variant css coverage');
