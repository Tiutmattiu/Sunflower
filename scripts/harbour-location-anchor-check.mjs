import assert from 'node:assert/strict';
import {DISTRICT_LANDMARKS,DISTRICT_LOCATION_POINTS,DISTRICT_PROP_POINTS} from '../src/harbourDistrict.js';

const locations=['harbour_berth','joels_bar','parcel_counter','nursery','viewing_room','back_room','sonyas_kitchen','cliff_path','public_clearing','old_hall'];
for(const id of locations){
  assert(DISTRICT_LANDMARKS.some(x=>x.locationId===id),`missing visible landmark for ${id}`);
  const p=DISTRICT_LOCATION_POINTS[id];
  assert(p,`missing district anchor for ${id}`);
  assert(Number.isFinite(p.x)&&Number.isFinite(p.y),`invalid district anchor for ${id}`);
  assert(p.x>=40&&p.x<=1960&&p.y>=60&&p.y<=1080,`anchor outside authored world for ${id}`);
}
const requiredProps=['crate','cargo','bottle','glass','packing','parcel','parts','plants','paper','bowl','photo','envelope','table','path','orders'];
for(const id of requiredProps){
  const p=DISTRICT_PROP_POINTS[id];
  assert(p,`missing district prop point for ${id}`);
  assert(Number.isFinite(p.x)&&Number.isFinite(p.y),`invalid district prop point ${id}`);
}
assert(DISTRICT_LOCATION_POINTS.parcel_counter.x>1450,'Wong should live in the new Wong services strip');
assert(DISTRICT_LOCATION_POINTS.viewing_room.y<360,'gallery/viewing room should remain an upper-street place');
assert(DISTRICT_LOCATION_POINTS.nursery.x<700,'nursery should remain in the craft/growing quarter');
console.log('PASS: every gameplay location and active prop has a unified district anchor');
