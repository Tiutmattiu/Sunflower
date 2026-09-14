import assert from 'node:assert/strict';
import {crowdForWorld} from '../src/harbourTableau.js';

const world={day:2,weather:'clear',actors:{}};
const tags=new Set(crowdForWorld(world).flatMap(item=>item.tags||[]));
for(const tag of ['barber','massage','ice-cream','green-space','faith-house','night-venue']) {
  assert(tags.has(tag),`missing neighbourhood signal: ${tag}`);
}
console.log('PASS: harbour neighbourhood service and public-life coverage');
