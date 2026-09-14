import assert from 'node:assert/strict';
import {crowdForWorld} from '../src/harbourTableau.js';

const normal=crowdForWorld({day:0,weather:'fair'});
assert(normal.length>=50,`expected dense crowd, got ${normal.length}`);
const tags=new Set(normal.flatMap(x=>x.tags||[]));
for(const tag of ['wealth','poverty','elder','youth','date','family','ice-cream','park-life']) assert(tags.has(tag),`missing social story tag ${tag}`);
const fate0=normal.find(x=>x.id==='hard-luck-street');
assert.equal(fate0?.variant,'rummage');
const fate1=crowdForWorld({day:1,weather:'fair'}).find(x=>x.id==='hard-luck-street');
assert.equal(fate1?.variant,'slump');
const fate2=crowdForWorld({day:2,weather:'fair'}).find(x=>x.id==='hard-luck-street');
assert.equal(fate2?.variant,'skeleton');

const storm=crowdForWorld({day:0,weather:'storm'});
assert(storm.length<normal.length,'storm should remove some exposed leisure');
assert(storm.some(x=>x.stormSheltered),'storm should visibly redirect some crowd under cover');
const normalFaith=normal.filter(x=>(x.tags||[]).includes('faith')).length;
const shabbat=crowdForWorld({day:5,weather:'fair'});
assert(shabbat.filter(x=>(x.tags||[]).includes('faith')).length>normalFaith,'Shabbat-like day should strengthen faith flow');
console.log('PASS: crowd density, social storytelling and day/weather response');
