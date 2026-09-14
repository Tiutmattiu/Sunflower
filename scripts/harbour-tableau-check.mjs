import assert from 'node:assert/strict';
import fs from 'node:fs';
import {HARBOUR_WORLD} from '../src/harbourWorld.js';
import {
  TABLEAU_ZONES,
  NAMED_ACTOR_SLOTS,
  crowdForWorld,
  creaturesForWorld,
  namedActorPoint,
  pointInsideWorld,
} from '../src/harbourTableau.js';

assert(TABLEAU_ZONES.length >= 8);
for (const zone of TABLEAU_ZONES) {
  assert(zone.id);
  assert(zone.kind === 'ground' || zone.kind === 'water');
  assert(zone.bounds && zone.bounds.length === 4);
  const [x1,y1,x2,y2]=zone.bounds;
  assert(x1>=0 && y1>=0 && x2<=HARBOUR_WORLD.width && y2<=HARBOUR_WORLD.height, `zone outside world: ${zone.id}`);
}

const world={
  day:2,
  weather:'clear',
  actors:{
    joel:{location:'joels_bar'},juan:{location:'nursery'},aspen:{location:'harbour_berth'},
    wong:{location:'parcel_counter'},yasmin:{location:'viewing_room'},dima:{location:'back_room'},
  },
};

const crowd=crowdForWorld(world);
assert(crowd.length>=50,'crowd should visibly populate the tableau');
for(const activity of ['basketball','chess','shisha','swim'])assert(crowd.some(x=>x.activity===activity),`missing ${activity}`);

for(const person of crowd.filter(x=>x.kind==='person'&&x.activity!=='swim')){
  assert.equal(person.zoneKind,'ground');
  assert(pointInsideWorld(person),`crowd outside world: ${person.id}`);
}
for(const swimmer of crowd.filter(x=>x.activity==='swim')){
  assert.equal(swimmer.zoneKind,'water');
  assert(pointInsideWorld(swimmer),`swimmer outside world: ${swimmer.id}`);
}

const creatures=creaturesForWorld(world);
for(const species of ['seagull','squirrel','tropical-fish'])assert(creatures.some(x=>x.species===species),`missing ${species}`);
for(const creature of creatures)assert(pointInsideWorld(creature),`creature outside world: ${creature.id}`);

for(const id of Object.keys(NAMED_ACTOR_SLOTS)){
  const point=namedActorPoint(world,id);
  assert(point&&Number.isFinite(point.x)&&Number.isFinite(point.y));
  assert(pointInsideWorld(point),`named actor outside world: ${id}`);
}

const rainy=crowdForWorld({...world,weather:'storm'});
assert(rainy.filter(x=>x.zoneId==='sea-shore').length<crowd.filter(x=>x.zoneId==='sea-shore').length);

const tags=new Set(crowd.flatMap(x=>x.tags||[]));
for(const tag of [
  'wong-services','octopus','bar-music','music-festival','pizza-shop','deli','shisha',
  'basketball','chess','faith','vice','exotic-pet','glassblower','snake-charmer','homeless','sea-leisure'
])assert(tags.has(tag),`missing tableau tag: ${tag}`);
assert(!tags.has('octopus-bank'),'obsolete Octopus-bank concept leaked into crowd');
assert(!tags.has('pizza-deli'),'pizza and deli were silently reconflated');

const mapSource=fs.readFileSync(new URL('../src/HarbourMap.jsx',import.meta.url),'utf8');
for(const marker of ['crowdForWorld','creaturesForWorld','namedActorPoint','data-crowd-id','data-creature-id'])assert(mapSource.includes(marker),`HarbourMap renderer missing ${marker}`);

console.log('PASS: harbour tableau zones, crowd, creatures and canonical scene tags');
