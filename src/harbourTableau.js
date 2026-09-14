import {HARBOUR_WORLD, legacyBounds, legacyPoint} from './harbourWorld.js';

const legacyZone=(id,kind,bounds)=>({id,kind,bounds:legacyBounds(bounds)});
export const TABLEAU_ZONES = Object.freeze([
  {id:'sea-water',kind:'water',bounds:[1100,820,1960,1160]},
  {id:'sea-shore',kind:'ground',bounds:[80,760,500,900]},
  legacyZone('berth-cargo','ground',[760,460,1020,600]),
  {id:'wong-strip',kind:'ground',bounds:[1220,300,1740,610]},
  legacyZone('social-strip','ground',[430,300,760,520]),
  {id:'park-civic',kind:'ground',bounds:[520,720,930,960]},
  {id:'faith-vice',kind:'ground',bounds:[1380,180,1880,560]},
  {id:'craft-oddity',kind:'ground',bounds:[100,300,650,700]},
  {id:'cliff-edge',kind:'ground',bounds:[40,520,420,920]},
  legacyZone('gallery-rise','ground',[650,100,930,340]),
  legacyZone('kitchen-rise','ground',[250,90,470,300]),
]);

const ZONES=Object.fromEntries(TABLEAU_ZONES.map(zone=>[zone.id,zone]));
const slot=(x,y,zoneId)=>({...legacyPoint(x,y),zoneId});
const LOCATION_SLOTS=Object.freeze({
  harbour_berth:slot(960,540,'berth-cargo'),
  joels_bar:slot(600,515,'social-strip'),
  parcel_counter:slot(1080,540,'wong-strip'),
  nursery:slot(210,490,'craft-oddity'),
  viewing_room:slot(850,350,'gallery-rise'),
  back_room:slot(1220,355,'faith-vice'),
  sonyas_kitchen:slot(340,300,'kitchen-rise'),
  cliff_path:slot(145,690,'cliff-edge'),
  public_clearing:slot(710,630,'park-civic'),
  old_hall:slot(470,700,'park-civic'),
});

export const NAMED_ACTOR_SLOTS=Object.freeze({
  aspen:{dx:-26,dy:0},joel:{dx:-34,dy:0},wong:{dx:40,dy:4},juan:{dx:-12,dy:0},yasmin:{dx:30,dy:0},dima:{dx:18,dy:2},
});

const BASE_CROWD=Object.freeze([
  {id:'shore-swimmer-a',zoneId:'sea-water',activity:'swim',tags:['sea-leisure'],dryOnly:true},
  {id:'shore-swimmer-b',zoneId:'sea-water',activity:'swim',tags:['sea-leisure'],dryOnly:true},
  {id:'shore-sunbather-a',zoneId:'sea-shore',activity:'sunbathe',tags:['sea-leisure'],dryOnly:true},
  {id:'shore-sunbather-b',zoneId:'sea-shore',activity:'sunbathe',tags:['sea-leisure'],dryOnly:true},
  {id:'shore-sea-watcher',zoneId:'cliff-edge',activity:'idle',tags:['sea-leisure']},
  {id:'berth-loader-a',zoneId:'berth-cargo',activity:'carry',tags:['labour']},
  {id:'berth-loader-b',zoneId:'berth-cargo',activity:'work',tags:['labour']},
  {id:'berth-buyer',zoneId:'berth-cargo',activity:'inspect',tags:['labour']},
  {id:'wong-parcel-customer',zoneId:'wong-strip',activity:'queue',tags:['wong-services']},
  {id:'wong-laundry-waiter',zoneId:'wong-strip',activity:'idle',tags:['wong-services']},
  {id:'wong-atm-lingerer',zoneId:'wong-strip',activity:'machine',tags:['wong-services','octopus-bank']},
  {id:'octopus-bank-queue',zoneId:'wong-strip',activity:'queue',tags:['octopus-bank']},
  {id:'bar-music-listener',zoneId:'social-strip',activity:'music',tags:['live-music']},
  {id:'bar-musician',zoneId:'social-strip',activity:'music',tags:['live-music']},
  {id:'shisha-regular-a',zoneId:'social-strip',activity:'shisha',tags:['shisha']},
  {id:'shisha-regular-b',zoneId:'social-strip',activity:'shisha',tags:['shisha']},
  {id:'pizza-counter-customer',zoneId:'social-strip',activity:'eat',tags:['pizza-deli']},
  {id:'deli-worker',zoneId:'social-strip',activity:'work',tags:['pizza-deli']},
  {id:'basketball-player-a',zoneId:'park-civic',activity:'basketball',tags:['basketball']},
  {id:'basketball-player-b',zoneId:'park-civic',activity:'basketball',tags:['basketball']},
  {id:'basketball-watcher',zoneId:'park-civic',activity:'idle',tags:['basketball']},
  {id:'chess-player-a',zoneId:'park-civic',activity:'chess',tags:['chess']},
  {id:'chess-player-b',zoneId:'park-civic',activity:'chess',tags:['chess']},
  {id:'chess-watcher',zoneId:'park-civic',activity:'chess',tags:['chess']},
  {id:'faith-walker-a',zoneId:'faith-vice',activity:'walk',tags:['faith']},
  {id:'faith-walker-b',zoneId:'faith-vice',activity:'walk',tags:['faith']},
  {id:'vice-door-watcher',zoneId:'faith-vice',activity:'idle',tags:['vice']},
  {id:'street-hustler',zoneId:'faith-vice',activity:'pace',tags:['vice']},
  {id:'trash-picker',zoneId:'faith-vice',activity:'rummage',tags:['homeless']},
  {id:'pet-shop-browser',zoneId:'craft-oddity',activity:'inspect',tags:['exotic-pet']},
  {id:'glassblower',zoneId:'craft-oddity',activity:'glassblow',tags:['glassblower']},
  {id:'glassblower-watcher',zoneId:'craft-oddity',activity:'idle',tags:['glassblower']},
  {id:'snake-charmer',zoneId:'craft-oddity',activity:'perform',tags:['snake-charmer']},
  {id:'snake-charmer-watcher',zoneId:'craft-oddity',activity:'idle',tags:['snake-charmer']},
  {id:'cliff-smoker',zoneId:'cliff-edge',activity:'idle',tags:['vice']},
  {id:'cliff-couple',zoneId:'cliff-edge',activity:'talk',tags:['sea-leisure']},
]);

const CREATURES=Object.freeze([
  {id:'gull-berth',species:'seagull',zoneId:'berth-cargo',activity:'gull'},
  {id:'gull-shore',species:'seagull',zoneId:'sea-shore',activity:'gull'},
  {id:'squirrel-park-a',species:'squirrel',zoneId:'park-civic',activity:'squirrel'},
  {id:'squirrel-park-b',species:'squirrel',zoneId:'park-civic',activity:'squirrel'},
  {id:'reef-fish-a',species:'tropical-fish',zoneId:'sea-water',activity:'fish'},
  {id:'reef-fish-b',species:'tropical-fish',zoneId:'sea-water',activity:'fish'},
  {id:'reef-fish-c',species:'tropical-fish',zoneId:'sea-water',activity:'fish'},
]);

function hash(text=''){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function pointIn(zone,id,day=0){const[x1,y1,x2,y2]=zone.bounds,hx=hash(`${id}:x:${day}`)/0xffffffff,hy=hash(`${id}:y:${day}`)/0xffffffff;return{x:Math.round(x1+(x2-x1)*(.12+hx*.76)),y:Math.round(y1+(y2-y1)*(.12+hy*.76))}}
function variantShift(item,day=0){const phase=(hash(`${item.id}:phase`)+day)%5;return{dx:(phase-2)*3,dy:((phase*3)%5-2)*2}}

export function crowdForWorld(world={}){
  const day=Number.isFinite(world.day)?world.day:0,storm=world.weather==='storm',shabbatLike=day%7===5;
  return BASE_CROWD.filter(item=>!(storm&&item.dryOnly)).map(item=>{const zone=ZONES[item.zoneId],p=pointIn(zone,item.id,day),shift=variantShift(item,day),faithBoost=shabbatLike&&item.tags?.includes('faith');return{...item,kind:'person',zoneKind:zone.kind,x:p.x+shift.dx,y:p.y+shift.dy,emphasis:faithBoost?'busy':'normal',duration:6+(hash(item.id)%7)}});
}

export function creaturesForWorld(world={}){
  const day=Number.isFinite(world.day)?world.day:0,storm=world.weather==='storm';
  return CREATURES.filter(item=>!(storm&&item.species==='squirrel')).map(item=>{const zone=ZONES[item.zoneId],p=pointIn(zone,item.id,day+11);return{...item,kind:'creature',zoneKind:zone.kind,x:p.x,y:p.y,duration:5+(hash(item.id)%8)}});
}

export function namedActorPoint(world={},actorId){
  const location=world.actors?.[actorId]?.location,base=LOCATION_SLOTS[location]||LOCATION_SLOTS.harbour_berth,offset=NAMED_ACTOR_SLOTS[actorId]||{dx:0,dy:0};
  return{x:base.x+offset.dx,y:base.y+offset.dy,zoneId:base.zoneId};
}

export function pointInsideWorld({x,y}){
  return x>=0&&y>=0&&x<=HARBOUR_WORLD.width&&y<=HARBOUR_WORLD.height;
}
