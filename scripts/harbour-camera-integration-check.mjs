import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/HarbourMap.jsx',import.meta.url),'utf8');
for(const marker of ['HARBOUR_WORLD.width','coverScale(size,HARBOUR_WORLD)','centeredCamera(next,HARBOUR_WORLD,1)','Reset harbour view','WORLD_PLACES','WORLD_PROPS','ExpandedWorldBackdrop']){
  assert(source.includes(marker),`missing expanded camera integration marker: ${marker}`);
}
for(const stale of ['Math.min(size.w/1400,size.h/900)','size.h-85-900','Math.max(55,n.y)']){
  assert(!source.includes(stale),`stale contain/gutter camera math remains: ${stale}`);
}
assert(source.includes("harbour_berth:[930,620,'Berth']"),'exported PLACES should remain in legacy comic coordinates');
console.log('PASS: HarbourMap uses expanded bounded cover camera without breaking legacy PLACES API');
