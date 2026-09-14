import {HARBOUR_WORLD, legacyBounds} from './harbourWorld.js';
import {DISTRICT_LOCATION_POINTS,districtStateForWorld} from './harbourDistrict.js';

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
const LOCATION_SLOTS=Object.freeze(Object.fromEntries(Object.entries(DISTRICT_LOCATION_POINTS).map(([id,p])=>[id,{...p,zoneId:({harbour_berth:'berth-cargo',joels_bar:'social-strip',parcel_counter:'wong-strip',nursery:'craft-oddity',viewing_room:'gallery-rise',back_room:'faith-vice',sonyas_kitchen:'kitchen-rise',cliff_path:'cliff-edge',public_clearing:'park-civic',old_hall:'park-civic'})[id]}])));

export const NAMED_ACTOR_SLOTS=Object.freeze({aspen:{dx:-26,dy:0},joel:{dx:-34,dy:0},wong:{dx:40,dy:4},juan:{dx:-12,dy:0},yasmin:{dx:30,dy:0},dima:{dx:18,dy:2}});

const BASE_CROWD=Object.freeze([
  {id:'shore-swimmer-a',zoneId:'sea-water',activity:'swim',tags:['sea-leisure','youth'],age:'young',dryOnly:true},
  {id:'shore-swimmer-b',zoneId:'sea-water',activity:'swim',tags:['sea-leisure'],dryOnly:true},
  {id:'shore-swimmer-c',zoneId:'sea-water',activity:'swim',tags:['sea-leisure'],dryOnly:true},
  {id:'shore-sunbather-a',zoneId:'sea-shore',activity:'sunbathe',tags:['sea-leisure'],dryOnly:true},
  {id:'shore-sunbather-b',zoneId:'sea-shore',activity:'sunbathe',tags:['sea-leisure'],dryOnly:true},
  {id:'shore-couple-a',zoneId:'sea-shore',activity:'talk',tags:['sea-leisure','date'],dryOnly:true},
  {id:'shore-couple-b',zoneId:'sea-shore',activity:'talk',tags:['sea-leisure','date'],dryOnly:true},
  {id:'shore-fisher',zoneId:'sea-shore',activity:'idle',tags:['sea-leisure','elder'],age:'elder',stormZoneId:'social-strip'},
  {id:'shore-sea-watcher',zoneId:'cliff-edge',activity:'idle',tags:['sea-leisure'],stormZoneId:'social-strip'},
  {id:'berth-loader-a',zoneId:'berth-cargo',activity:'carry',tags:['labour','working-class'],body:'wide'},
  {id:'berth-loader-b',zoneId:'berth-cargo',activity:'work',tags:['labour','working-class']},
  {id:'berth-loader-c',zoneId:'berth-cargo',activity:'carry',tags:['labour','working-class']},
  {id:'berth-counter',zoneId:'berth-cargo',activity:'inspect',tags:['labour']},
  {id:'berth-buyer',zoneId:'berth-cargo',activity:'inspect',tags:['labour']},
  {id:'berth-crew-rest',zoneId:'berth-cargo',activity:'idle',tags:['labour','elder'],age:'elder'},
  {id:'berth-hawker',zoneId:'berth-cargo',activity:'pace',tags:['labour','street-trade']},
  {id:'wong-parcel-customer',zoneId:'wong-strip',activity:'queue',tags:['wong-services'],commercial:true},
  {id:'wong-parcel-customer-b',zoneId:'wong-strip',activity:'queue',tags:['wong-services'],commercial:true},
  {id:'wong-laundry-waiter',zoneId:'wong-strip',activity:'idle',tags:['wong-services','family'],commercial:true},
  {id:'wong-luggage-customer',zoneId:'wong-strip',activity:'queue',tags:['wong-services'],commercial:true},
  {id:'wong-atm-lingerer',zoneId:'wong-strip',activity:'machine',tags:['wong-services','octopus-bank'],commercial:true},
  {id:'octopus-bank-queue',zoneId:'wong-strip',activity:'queue',tags:['octopus-bank'],commercial:true},
  {id:'octopus-bank-queue-b',zoneId:'wong-strip',activity:'queue',tags:['octopus-bank','wealth'],variant:'wealthy',commercial:true},
  {id:'ice-cream-customer',zoneId:'wong-strip',activity:'eat',tags:['ice-cream','youth'],age:'young',commercial:true,dryOnly:true},
  {id:'ice-cream-customer-b',zoneId:'wong-strip',activity:'eat',tags:['ice-cream','family'],commercial:true,dryOnly:true},
  {id:'bar-regular-a',zoneId:'social-strip',activity:'talk',tags:['bar-life']},
  {id:'bar-regular-b',zoneId:'social-strip',activity:'talk',tags:['bar-life']},
  {id:'bar-music-listener',zoneId:'social-strip',activity:'music',tags:['live-music']},
  {id:'bar-musician',zoneId:'social-strip',activity:'music',tags:['live-music']},
  {id:'bar-musician-b',zoneId:'social-strip',activity:'music',tags:['live-music'],musicOnly:true},
  {id:'shisha-regular-a',zoneId:'social-strip',activity:'shisha',tags:['shisha','elder'],age:'elder'},
  {id:'shisha-regular-b',zoneId:'social-strip',activity:'shisha',tags:['shisha']},
  {id:'shisha-regular-c',zoneId:'social-strip',activity:'shisha',tags:['shisha'],body:'wide'},
  {id:'shisha-watcher',zoneId:'social-strip',activity:'idle',tags:['shisha']},
  {id:'pizza-counter-customer',zoneId:'social-strip',activity:'eat',tags:['pizza-deli'],commercial:true},
  {id:'pizza-counter-customer-b',zoneId:'social-strip',activity:'eat',tags:['pizza-deli','date'],commercial:true},
  {id:'deli-worker',zoneId:'social-strip',activity:'work',tags:['pizza-deli','working-class'],commercial:true},
  {id:'deli-elder',zoneId:'social-strip',activity:'eat',tags:['pizza-deli','elder'],age:'elder',commercial:true},
  {id:'social-date-a',zoneId:'social-strip',activity:'talk',tags:['date']},
  {id:'social-date-b',zoneId:'social-strip',activity:'talk',tags:['date']},
  {id:'basketball-player-a',zoneId:'park-civic',activity:'basketball',tags:['basketball','youth','park-life'],age:'young',dryOnly:true,stormZoneId:'social-strip'},
  {id:'basketball-player-b',zoneId:'park-civic',activity:'basketball',tags:['basketball','youth','park-life'],age:'young',dryOnly:true,stormZoneId:'social-strip'},
  {id:'basketball-player-c',zoneId:'park-civic',activity:'basketball',tags:['basketball','youth','park-life'],age:'young',dryOnly:true,stormZoneId:'social-strip'},
  {id:'basketball-watcher',zoneId:'park-civic',activity:'idle',tags:['basketball','park-life'],dryOnly:true,stormZoneId:'social-strip'},
  {id:'chess-player-a',zoneId:'park-civic',activity:'chess',tags:['chess','elder','park-life'],age:'elder',stormZoneId:'social-strip'},
  {id:'chess-player-b',zoneId:'park-civic',activity:'chess',tags:['chess','elder','park-life'],age:'elder',stormZoneId:'social-strip'},
  {id:'chess-watcher',zoneId:'park-civic',activity:'chess',tags:['chess','elder','park-life'],age:'elder',stormZoneId:'social-strip'},
  {id:'chess-watcher-b',zoneId:'park-civic',activity:'idle',tags:['chess','park-life'],stormZoneId:'social-strip'},
  {id:'park-reader',zoneId:'park-civic',activity:'idle',tags:['park-life'],dryOnly:true,stormZoneId:'wong-strip'},
  {id:'park-lounger',zoneId:'park-civic',activity:'idle',tags:['park-life'],dryOnly:true,stormZoneId:'social-strip'},
  {id:'park-family-a',zoneId:'park-civic',activity:'walk',tags:['park-life','family'],dryOnly:true,stormZoneId:'wong-strip'},
  {id:'park-family-b',zoneId:'park-civic',activity:'walk',tags:['park-life','family'],dryOnly:true,stormZoneId:'wong-strip'},
  {id:'faith-walker-a',zoneId:'faith-vice',activity:'walk',tags:['faith','elder'],age:'elder'},
  {id:'faith-walker-b',zoneId:'faith-vice',activity:'walk',tags:['faith']},
  {id:'faith-family-a',zoneId:'faith-vice',activity:'walk',tags:['faith','family'],shabbatOnly:true},
  {id:'faith-family-b',zoneId:'faith-vice',activity:'walk',tags:['faith','family'],shabbatOnly:true},
  {id:'faith-elder-extra',zoneId:'faith-vice',activity:'walk',tags:['faith','elder'],age:'elder',shabbatOnly:true},
  {id:'faith-neighbour-extra',zoneId:'faith-vice',activity:'walk',tags:['faith'],shabbatOnly:true},
  {id:'vice-door-watcher',zoneId:'faith-vice',activity:'idle',tags:['vice']},
  {id:'street-hustler',zoneId:'faith-vice',activity:'pace',tags:['vice','crime']},
  {id:'street-hustler-b',zoneId:'faith-vice',activity:'talk',tags:['vice','crime']},
  {id:'atm-shadow',zoneId:'faith-vice',activity:'idle',tags:['vice','crime']},
  {id:'hard-luck-street',zoneId:'faith-vice',activity:'rummage',tags:['poverty','homeless'],fateCycle:true},
  {id:'wealthy-patron',zoneId:'faith-vice',activity:'walk',tags:['wealth'],variant:'wealthy'},
  {id:'pet-shop-browser',zoneId:'craft-oddity',activity:'inspect',tags:['exotic-pet']},
  {id:'pet-shop-browser-b',zoneId:'craft-oddity',activity:'inspect',tags:['exotic-pet','youth'],age:'young'},
  {id:'glassblower',zoneId:'craft-oddity',activity:'glassblow',tags:['glassblower','working-class']},
  {id:'glassblower-watcher',zoneId:'craft-oddity',activity:'idle',tags:['glassblower']},
  {id:'glassblower-watcher-b',zoneId:'craft-oddity',activity:'idle',tags:['glassblower']},
  {id:'snake-charmer',zoneId:'craft-oddity',activity:'perform',tags:['snake-charmer','street-trade']},
  {id:'snake-charmer-watcher',zoneId:'craft-oddity',activity:'idle',tags:['snake-charmer']},
  {id:'snake-charmer-watcher-b',zoneId:'craft-oddity',activity:'idle',tags:['snake-charmer']},
  {id:'craft-runner',zoneId:'craft-oddity',activity:'walk',tags:['youth','working-class'],age:'young'},
  {id:'cliff-smoker',zoneId:'cliff-edge',activity:'idle',tags:['vice']},
  {id:'cliff-couple-a',zoneId:'cliff-edge',activity:'talk',tags:['sea-leisure','date']},
  {id:'cliff-couple-b',zoneId:'cliff-edge',activity:'talk',tags:['sea-leisure','date']},
  {id:'cliff-old-watcher',zoneId:'cliff-edge',activity:'idle',tags:['elder','sea-leisure'],age:'elder'},
]);

const CREATURES=Object.freeze([
  {id:'gull-berth',species:'seagull',zoneId:'berth-cargo',activity:'gull'},
  {id:'gull-shore',species:'seagull',zoneId:'sea-shore',activity:'gull'},
  {id:'gull-wong',species:'seagull',zoneId:'wong-strip',activity:'gull'},
  {id:'squirrel-park-a',species:'squirrel',zoneId:'park-civic',activity:'squirrel'},
  {id:'squirrel-park-b',species:'squirrel',zoneId:'park-civic',activity:'squirrel'},
  {id:'squirrel-park-c',species:'squirrel',zoneId:'park-civic',activity:'squirrel'},
  {id:'reef-fish-a',species:'tropical-fish',zoneId:'sea-water',activity:'fish'},
  {id:'reef-fish-b',species:'tropical-fish',zoneId:'sea-water',activity:'fish'},
  {id:'reef-fish-c',species:'tropical-fish',zoneId:'sea-water',activity:'fish'},
  {id:'reef-fish-d',species:'tropical-fish',zoneId:'sea-water',activity:'fish'},
]);

function hash(text=''){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function pointIn(zone,id,day=0){const[x1,y1,x2,y2]=zone.bounds,hx=hash(`${id}:x:${day}`)/0xffffffff,hy=hash(`${id}:y:${day}`)/0xffffffff;return{x:Math.round(x1+(x2-x1)*(.12+hx*.76)),y:Math.round(y1+(y2-y1)*(.12+hy*.76))}}
function variantShift(item,day=0){const phase=(hash(`${item.id}:phase`)+day)%5;return{dx:(phase-2)*3,dy:((phase*3)%5-2)*2}}
function fateFor(day){return ['rummage','slump','skeleton','absent'][day%4]}
function activeItem(item,state){if(state.storm&&item.dryOnly&&!item.stormZoneId)return false;if(item.shabbatOnly&&!state.shabbatLike)return false;if(item.musicOnly&&!state.musicNight)return false;if(state.commercialQuiet&&item.commercial&&hash(item.id)%2===0)return false;if(item.fateCycle&&fateFor(state.day)==='absent')return false;return true}

export function crowdForWorld(world={}){
  const state=districtStateForWorld(world),day=state.day;
  return BASE_CROWD.filter(item=>activeItem(item,state)).map(item=>{
    const stormSheltered=Boolean(state.storm&&item.stormZoneId),zoneId=stormSheltered?item.stormZoneId:item.zoneId;
    const zone=ZONES[zoneId]||ZONES['social-strip'],p=pointIn(zone,item.id,day),shift=variantShift(item,day),faithBoost=state.shabbatLike&&item.tags?.includes('faith');
    const fate=item.fateCycle?fateFor(day):null,ageScale=item.age==='young'?.86:item.age==='elder'?.95:1,scale=Math.max(.78,Math.min(1.15,ageScale+((hash(`${item.id}:scale`)%9)-4)*.015));
    return{...item,activity:fate==='rummage'?'rummage':fate==='slump'?'slump':fate==='skeleton'?'idle':item.activity,variant:fate||item.variant||null,kind:'person',zoneId,zoneKind:zone.kind,x:p.x+shift.dx,y:p.y+shift.dy,emphasis:faithBoost?'busy':'normal',duration:6+(hash(item.id)%7),scale,stormSheltered};
  });
}

export function creaturesForWorld(world={}){const state=districtStateForWorld(world),day=state.day;return CREATURES.filter(item=>!(state.storm&&item.species==='squirrel')).map(item=>{const zone=ZONES[item.zoneId],p=pointIn(zone,item.id,day+11);return{...item,kind:'creature',zoneKind:zone.kind,x:p.x,y:p.y,duration:5+(hash(item.id)%8)}})}
export function namedActorPoint(world={},actorId){const location=world.actors?.[actorId]?.location,base=LOCATION_SLOTS[location]||LOCATION_SLOTS.harbour_berth,offset=NAMED_ACTOR_SLOTS[actorId]||{dx:0,dy:0};return{x:base.x+offset.dx,y:base.y+offset.dy,zoneId:base.zoneId}}
export function pointInsideWorld({x,y}){return x>=0&&y>=0&&x<=HARBOUR_WORLD.width&&y<=HARBOUR_WORLD.height}
