import assert from 'node:assert/strict';
import {TABLEAU_ZONES,crowdForWorld} from '../src/harbourTableau.js';

const zones=new Map(TABLEAU_ZONES.map(x=>[x.id,x]));
const rows=crowdForWorld({day:3,weather:'fair'});
const movers=rows.filter(x=>['walk','pace','carry'].includes(x.activity));
assert(movers.length>=8,'expected a meaningful set of autonomous walkers');
for(const item of movers){
  assert(item.motion&&Number.isFinite(item.motion.dx)&&Number.isFinite(item.motion.dy),`missing motion for ${item.id}`);
  assert(Math.abs(item.motion.dx)>=8,`motion too small to read for ${item.id}`);
  const [x1,y1,x2,y2]=zones.get(item.zoneId).bounds;
  assert(item.x-Math.abs(item.motion.dx)>=x1,`left motion escapes ${item.zoneId}: ${item.id}`);
  assert(item.x+Math.abs(item.motion.dx)<=x2,`right motion escapes ${item.zoneId}: ${item.id}`);
  assert(item.y-Math.abs(item.motion.dy)>=y1,`upper motion escapes ${item.zoneId}: ${item.id}`);
  assert(item.y+Math.abs(item.motion.dy)<=y2,`lower motion escapes ${item.zoneId}: ${item.id}`);
}
const seated=rows.filter(x=>['chess','shisha','eat'].includes(x.activity));
assert(seated.every(x=>!x.motion||Math.abs(x.motion.dx)<=3),'seated crowd should not wander across the tableau');
console.log('PASS: background crowd motion stays bounded inside authored zones');
