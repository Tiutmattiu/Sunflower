import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHarbourWorld} from '../src/harbourSpine.js';
import {crowdForWorld} from '../src/harbourTableau.js';

const named=new Set(['aspen','joel','yasmin','wong','juan','dima','sonya']);
const worlds=[createHarbourWorld(41),createHarbourWorld(73)];
worlds[1].day=6;worlds[1].weather='storm';
const crowd=worlds.flatMap(crowdForWorld);
assert(crowd.length>40,'fixture needs a real incidental crowd');
assert(!crowd.some(p=>named.has(p.id)),'ambient crowd reused a named-cast identity');
for(const p of crowd){
  assert(p.complexion,'crowd person missing complexion identity data');
  assert(p.hairStyle,'crowd person missing hair-style identity data');
  assert(p.headwear,'crowd person missing headwear identity data (use none explicitly)');
  assert(p.build,'crowd person missing build identity data');
  assert(p.ageGroup,'crowd person missing normalized age group');
}
const distinct=key=>new Set(crowd.map(p=>p[key]));
assert(distinct('complexion').size>=5,'complexion range is still too narrow');
assert(distinct('hairStyle').size>=5,'hair silhouettes are still too repetitive');
assert(distinct('headwear').size>=4,'headwear variation is not represented');
assert(distinct('build').size>=3,'body-build variation is not represented');
assert(distinct('ageGroup').size>=3,'age variation must include young, adult and elder');

const layer=fs.readFileSync(new URL('../src/HarbourTableauLayer.jsx',import.meta.url),'utf8');
assert(layer.includes('item.complexion'),'renderer must consume complexion data instead of deriving every face only from id');
assert(layer.includes('item.hairStyle'),'renderer must consume hair-style data');
assert(layer.includes('item.headwear'),'renderer must visibly consume headwear data');
assert(layer.includes('pointerEvents="none"'),'ambient people must remain noninteractive and never steal gameplay clicks');
console.log('PASS: incidental crowd has explicit diverse identity dimensions without reusing named cast');
