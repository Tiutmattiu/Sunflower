import {HARBOUR_WORLD} from './harbourWorld.js';
import {DISTRICT_LOCATION_POINTS,districtStateForWorld} from './harbourDistrict.js';

export const TABLEAU_ZONES=Object.freeze([
  {id:'sea-water',kind:'water',bounds:[1080,840,1960,1160]},
  {id:'sea-shore',kind:'ground',bounds:[70,785,520,920]},
  {id:'berth-cargo',kind:'ground',bounds:[980,620,1450,805]},
  {id:'wong-strip',kind:'ground',bounds:[1460,500,1790,700]},
  {id:'social-strip',kind:'ground',bounds:[520,455,910,650]},
  {id:'pizza-lane',kind:'ground',bounds:[900,430,1070,585]},
  {id:'deli-lane',kind:'ground',bounds:[1080,430,1248,585]},
  {id:'park-civic',kind:'ground',bounds:[500,770,930,980]},
  {id:'festival-square',kind:'ground',bounds:[760,645,1020,760]},
  {id:'faith-vice',kind:'ground',bounds:[1420,210,1960,665]},
  {id:'craft-oddity',kind:'ground',bounds:[180,360,625,700]},
  {id:'cliff-edge',kind:'ground',bounds:[45,430,270,865]},
  {id:'gallery-auction',kind:'ground',bounds:[920,255,1195,390]},
  {id:'kitchen-courtyard',kind:'ground',bounds:[500,350,730,470]},
  {id:'nursery-garden',kind:'ground',bounds:[430,625,680,775]},
  {id:'cinema-street',kind:'ground',bounds:[310,690,600,850]},
  {id:'octopus-floor',kind:'ground',bounds:[1130,610,1405,790]},
  {id:'apartment-street',kind:'ground',bounds:[1720,545,1960,735]},
]);

const ZONES=Object.fromEntries(TABLEAU_ZONES.map(zone=>[zone.id,zone]));
const LOCATION_ZONE={harbour_berth:'berth-cargo',joels_bar:'social-strip',parcel_counter:'wong-strip',nursery:'nursery-garden',viewing_room:'gallery-auction',back_room:'apartment-street',sonyas_kitchen:'kitchen-courtyard',cliff_path:'cliff-edge',public_clearing:'octopus-floor',old_hall:'cinema-street'};
const LOCATION_SLOTS=Object.freeze(Object.fromEntries(Object.entries(DISTRICT_LOCATION_POINTS).map(([id,p])=>[id,{...p,zoneId:LOCATION_ZONE[id]}])));

export const NAMED_ACTOR_SLOTS=Object.freeze({aspen:{dx:-26,dy:0},joel:{dx:-34,dy:0},wong:{dx:40,dy:4},juan:{dx:-12,dy:0},yasmin:{dx:30,dy:0},dima:{dx:18,dy:2}});
const person=(id,zoneId,activity,tags,more={})=>({id,zoneId,activity,tags,...more});

const BASE_CROWD=Object.freeze([
  person('shore-swimmer-a','sea-water','swim',['sea-leisure','youth'],{age:'young',dryOnly:true}),
  person('shore-swimmer-b','sea-water','swim',['sea-leisure'],{dryOnly:true}),
  person('shore-swimmer-c','sea-water','swim',['sea-leisure'],{dryOnly:true}),
  person('shore-sunbather-a','sea-shore','sunbathe',['sea-leisure'],{dryOnly:true}),
  person('shore-sunbather-b','sea-shore','sunbathe',['sea-leisure'],{dryOnly:true}),
  person('shore-couple-a','sea-shore','talk',['sea-leisure','date'],{dryOnly:true}),
  person('shore-couple-b','sea-shore','talk',['sea-leisure','date'],{dryOnly:true}),
  person('shore-fisher','sea-shore','idle',['sea-leisure','elder'],{age:'elder',stormZoneId:'social-strip'}),
  person('shore-sea-watcher','cliff-edge','idle',['sea-leisure'],{stormZoneId:'social-strip'}),

  person('berth-loader-a','berth-cargo','carry',['labour','working-class'],{body:'wide'}),
  person('berth-loader-b','berth-cargo','work',['labour','working-class']),
  person('berth-loader-c','berth-cargo','carry',['labour','working-class']),
  person('berth-counter','berth-cargo','inspect',['labour']),
  person('berth-buyer','berth-cargo','inspect',['labour']),
  person('berth-crew-rest','berth-cargo','idle',['labour','elder'],{age:'elder'}),
  person('berth-hawker','berth-cargo','pace',['labour','street-trade']),

  person('wong-parcel-customer','wong-strip','queue',['wong-services'],{commercial:true}),
  person('wong-parcel-customer-b','wong-strip','queue',['wong-services'],{commercial:true}),
  person('wong-laundry-waiter','wong-strip','idle',['wong-services','family'],{commercial:true}),
  person('wong-luggage-customer','wong-strip','queue',['wong-services'],{commercial:true}),
  person('wong-bitcoin-atm-lingerer','wong-strip','machine',['wong-services','bitcoin-atm'],{commercial:true}),
  person('ice-cream-customer','wong-strip','eat',['ice-cream','youth'],{age:'young',commercial:true,dryOnly:true}),
  person('ice-cream-customer-b','wong-strip','eat',['ice-cream','family'],{commercial:true,dryOnly:true}),

  person('bar-regular-a','social-strip','talk',['bar-life']),
  person('bar-regular-b','social-strip','talk',['bar-life']),
  person('bar-music-listener','social-strip','music',['bar-life','bar-music']),
  person('bar-musician','social-strip','music',['bar-life','bar-music']),
  person('bar-musician-b','social-strip','music',['bar-life','bar-music'],{musicOnly:true}),
  person('shisha-regular-a','social-strip','shisha',['shisha','elder'],{age:'elder'}),
  person('shisha-regular-b','social-strip','shisha',['shisha']),
  person('shisha-regular-c','social-strip','shisha',['shisha'],{body:'wide'}),
  person('shisha-watcher','social-strip','idle',['shisha']),
  person('social-date-a','social-strip','talk',['date']),
  person('social-date-b','social-strip','talk',['date']),

  person('pizza-customer-a','pizza-lane','eat',['pizza-shop'],{commercial:true}),
  person('pizza-customer-b','pizza-lane','eat',['pizza-shop','date'],{commercial:true}),
  person('pizza-runner','pizza-lane','walk',['pizza-shop','working-class'],{commercial:true}),
  person('deli-worker','deli-lane','work',['deli','working-class'],{commercial:true}),
  person('deli-elder','deli-lane','eat',['deli','elder'],{age:'elder',commercial:true}),
  person('deli-customer','deli-lane','queue',['deli'],{commercial:true}),

  person('basketball-player-a','park-civic','basketball',['basketball','youth','park-life'],{age:'young',dryOnly:true,stormZoneId:'social-strip'}),
  person('basketball-player-b','park-civic','basketball',['basketball','youth','park-life'],{age:'young',dryOnly:true,stormZoneId:'social-strip'}),
  person('basketball-player-c','park-civic','basketball',['basketball','youth','park-life'],{age:'young',dryOnly:true,stormZoneId:'social-strip'}),
  person('basketball-watcher','park-civic','idle',['basketball','park-life'],{dryOnly:true,stormZoneId:'social-strip'}),
  person('chess-player-a','park-civic','chess',['chess','elder','park-life'],{age:'elder',stormZoneId:'social-strip'}),
  person('chess-player-b','park-civic','chess',['chess','elder','park-life'],{age:'elder',stormZoneId:'social-strip'}),
  person('chess-watcher','park-civic','chess',['chess','elder','park-life'],{age:'elder',stormZoneId:'social-strip'}),
  person('chess-watcher-b','park-civic','idle',['chess','park-life'],{stormZoneId:'social-strip'}),
  person('park-reader','park-civic','idle',['park-life'],{dryOnly:true,stormZoneId:'wong-strip'}),
  person('park-lounger','park-civic','idle',['park-life'],{dryOnly:true,stormZoneId:'social-strip'}),
  person('park-family-a','park-civic','walk',['park-life','family'],{dryOnly:true,stormZoneId:'wong-strip'}),
  person('park-family-b','park-civic','walk',['park-life','family'],{dryOnly:true,stormZoneId:'wong-strip'}),

  person('festival-musician-a','festival-square','music',['music-festival'],{festivalOnly:true}),
  person('festival-musician-b','festival-square','music',['music-festival'],{festivalOnly:true}),
  person('festival-listener-a','festival-square','talk',['music-festival'],{festivalOnly:true}),
  person('festival-listener-b','festival-square','idle',['music-festival'],{festivalOnly:true}),

  person('faith-walker-a','faith-vice','walk',['faith','elder'],{age:'elder'}),
  person('faith-walker-b','faith-vice','walk',['faith']),
  person('faith-family-a','faith-vice','walk',['faith','family'],{shabbatOnly:true}),
  person('faith-family-b','faith-vice','walk',['faith','family'],{shabbatOnly:true}),
  person('faith-elder-extra','faith-vice','walk',['faith','elder'],{age:'elder',shabbatOnly:true}),
  person('faith-neighbour-extra','faith-vice','walk',['faith'],{shabbatOnly:true}),
  person('vice-door-watcher','faith-vice','idle',['vice']),
  person('street-hustler','faith-vice','pace',['vice','crime']),
  person('street-hustler-b','faith-vice','talk',['vice','crime']),
  person('atm-shadow','faith-vice','idle',['vice','crime']),
  person('hard-luck-street','faith-vice','rummage',['poverty','homeless'],{fateCycle:true}),
  person('wealthy-patron','faith-vice','walk',['wealth'],{variant:'wealthy'}),

  person('pet-shop-browser','craft-oddity','inspect',['exotic-pet']),
  person('pet-shop-browser-b','craft-oddity','inspect',['exotic-pet','youth'],{age:'young'}),
  person('glassblower','craft-oddity','glassblow',['glassblower','working-class']),
  person('glassblower-watcher','craft-oddity','idle',['glassblower']),
  person('glassblower-watcher-b','craft-oddity','idle',['glassblower']),
  person('snake-charmer','craft-oddity','perform',['snake-charmer','street-trade']),
  person('snake-charmer-watcher','craft-oddity','idle',['snake-charmer']),
  person('snake-charmer-watcher-b','craft-oddity','idle',['snake-charmer']),
  person('craft-runner','craft-oddity','walk',['youth','working-class'],{age:'young'}),

  person('cliff-smoker','cliff-edge','idle',['vice']),
  person('cliff-couple-a','cliff-edge','talk',['sea-leisure','date']),
  person('cliff-couple-b','cliff-edge','talk',['sea-leisure','date']),
  person('cliff-old-watcher','cliff-edge','idle',['elder','sea-leisure'],{age:'elder'}),

  person('gallery-caretaker','gallery-auction','work',['gallery-life','working-class']),
  person('cinema-usher','cinema-street','idle',['cinema','working-class']),
  person('cinema-patron-a','cinema-street','talk',['cinema','date']),
  person('apartment-tenant-a','apartment-street','walk',['apartment-life']),
  person('apartment-tenant-b','apartment-street','idle',['apartment-life','elder'],{age:'elder'}),
  person('nursery-neighbour','nursery-garden','inspect',['nursery-life','elder'],{age:'elder'}),
  person('octopus-clerk','octopus-floor','work',['octopus','working-class']),
  person('octopus-payment-customer','octopus-floor','queue',['octopus'],{commercial:true}),
  person('octopus-market-reader','octopus-floor','inspect',['octopus'],{commercial:true}),
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
function activeItem(item,state){if(state.storm&&item.dryOnly&&!item.stormZoneId)return false;if(item.shabbatOnly&&!state.shabbatLike)return false;if(item.musicOnly&&!state.musicNight)return false;if(item.festivalOnly&&!state.festivalDay)return false;if(state.commercialQuiet&&item.commercial&&hash(item.id)%2===0)return false;if(item.fateCycle&&fateFor(state.day)==='absent')return false;return true}
const extra=(id,zoneId,activity,tags,more={})=>person(id,zoneId,activity,tags,more);

function hotspotCrowd(world,state){
  const rows=[];
  const auction=world.playerGame?.routes?.yasmin;
  const preview=auction&&state.day>=auction.previewOpens&&state.day<=auction.previewCloses;
  const auctionDay=auction&&state.day===auction.auctionDay;
  if(preview)for(let i=0;i<3;i++)rows.push(extra(`gallery-preview-${i}`,'gallery-auction',i===0?'inspect':'talk',['gallery-life','auction-preview'],{commercial:true}));
  if(auctionDay)for(let i=0;i<7;i++)rows.push(extra(`gallery-auction-${i}`,'gallery-auction',i<2?'queue':'talk',['gallery-life','auction-day'],{commercial:true}));

  const evening=world.relationshipEcology?.barEvenings?.find(x=>x.day===state.day);
  const barCount=Math.min(6,Math.max(0,(evening?.attendees?.length||0)-1));
  for(let i=0;i<barCount;i++)rows.push(extra(`bar-hotspot-${i}`,'social-strip',i%2?'talk':'eat',['bar-life','bar-hotspot']));

  const wong=world.actors?.wong;
  const wongLoad=Math.min(5,Math.max(0,Math.floor(((wong?.busy||0)+(world.wongBusiness?.stored?.length||0))/2)));
  for(let i=0;i<wongLoad;i++)rows.push(extra(`wong-hotspot-${i}`,'wong-strip',i%2?'queue':'machine',['wong-services','wong-hotspot'],{commercial:true}));

  const openOrders=(world.market?.orders||[]).filter(x=>x.status==='open').length;
  const octopusCount=Math.min(6,Math.ceil(openOrders/2));
  for(let i=0;i<octopusCount;i++)rows.push(extra(`octopus-hotspot-${i}`,'octopus-floor',i%2?'queue':'inspect',['octopus','octopus-hotspot'],{commercial:true}));

  const occurrence=world.toadCircle?.occurrences?.find(x=>x.day===state.day);
  if(occurrence){const n=Math.max(2,Math.min(4,occurrence.attending?.length||2));for(let i=0;i<n;i++)rows.push(extra(`toad-circle-${i}`,'nursery-garden',i%2?'idle':'talk',['nursery-life','toad-circle']))}
  if(state.cargoRush)for(let i=0;i<2;i++)rows.push(extra(`cargo-rush-${i}`,'berth-cargo','carry',['labour','cargo-hotspot','working-class']));
  return rows;
}

function motionFor(item,zone,point,day){
  if(!['walk','pace','carry'].includes(item.activity))return null;
  const[x1,y1,x2,y2]=zone.bounds;
  const roomX=Math.max(0,Math.min(point.x-x1,x2-point.x)-10),roomY=Math.max(0,Math.min(point.y-y1,y2-point.y)-8);
  const wantedX=8+(hash(`${item.id}:motion-x:${day}`)%17),wantedY=hash(`${item.id}:motion-y:${day}`)%7;
  return{dx:Math.max(0,Math.min(wantedX,roomX)),dy:Math.max(0,Math.min(wantedY,roomY))};
}

export function crowdForWorld(world={}){
  const state=districtStateForWorld(world),day=state.day,source=[...BASE_CROWD,...hotspotCrowd(world,state)];
  return source.filter(item=>activeItem(item,state)).map(item=>{
    const stormSheltered=Boolean(state.storm&&item.stormZoneId),zoneId=stormSheltered?item.stormZoneId:item.zoneId;
    const zone=ZONES[zoneId]||ZONES['social-strip'],p=pointIn(zone,item.id,day),shift=variantShift(item,day),faithBoost=state.shabbatLike&&item.tags?.includes('faith');
    const x=p.x+shift.dx,y=p.y+shift.dy,fate=item.fateCycle?fateFor(day):null,ageScale=item.age==='young'?.86:item.age==='elder'?.95:1,scale=Math.max(.78,Math.min(1.15,ageScale+((hash(`${item.id}:scale`)%9)-4)*.015));
    const motion=motionFor(item,zone,{x,y},day);
    return{...item,activity:fate==='rummage'?'rummage':fate==='slump'?'slump':fate==='skeleton'?'idle':item.activity,variant:fate||item.variant||null,kind:'person',zoneId,zoneKind:zone.kind,x,y,emphasis:faithBoost?'busy':'normal',duration:6+(hash(item.id)%7),scale,stormSheltered,motion};
  });
}

export function creaturesForWorld(world={}){const state=districtStateForWorld(world),day=state.day;return CREATURES.filter(item=>!(state.storm&&item.species==='squirrel')).map(item=>{const zone=ZONES[item.zoneId],p=pointIn(zone,item.id,day+11);return{...item,kind:'creature',zoneKind:zone.kind,x:p.x,y:p.y,duration:5+(hash(item.id)%8)}})}
export function namedActorPoint(world={},actorId){const location=world.actors?.[actorId]?.location,base=LOCATION_SLOTS[location]||LOCATION_SLOTS.harbour_berth,offset=NAMED_ACTOR_SLOTS[actorId]||{dx:0,dy:0};return{x:base.x+offset.dx,y:base.y+offset.dy,zoneId:base.zoneId}}
export function pointInsideWorld({x,y}){return x>=0&&y>=0&&x<=HARBOUR_WORLD.width&&y<=HARBOUR_WORLD.height}
