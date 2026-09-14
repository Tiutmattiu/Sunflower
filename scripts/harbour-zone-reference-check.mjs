import assert from 'node:assert/strict';
import {TABLEAU_ZONES,crowdForWorld} from '../src/harbourTableau.js';
const zones=new Set(TABLEAU_ZONES.map(x=>x.id));
for(const world of [{day:0,weather:'fair'},{day:0,weather:'storm'},{day:5,weather:'fair'}]){
  for(const item of crowdForWorld(world)) assert(zones.has(item.zoneId),`unknown crowd zone ${item.zoneId} for ${item.id}`);
}
console.log('PASS: all generated crowd references valid tableau zones');
