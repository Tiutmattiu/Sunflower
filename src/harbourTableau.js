// Presentation-only scene composition for the crowded harbour tableau.
// This module is deliberately pure: it never mutates route, economy, inventory, or actor state.

export const TABLEAU_ZONES = Object.freeze([
  {id:'sea-water', kind:'water', bounds:[720,730,1050,820]},
  {id:'sea-shore', kind:'ground', bounds:[80,600,320,690]},
  {id:'berth-cargo', kind:'ground', bounds:[760,460,1020,600]},
  {id:'wong-strip', kind:'ground', bounds:[1000,300,1250,500]},
  {id:'social-strip', kind:'ground', bounds:[430,300,760,520]},
  {id:'park-civic', kind:'ground', bounds:[420,600,670,730]},
  {id:'faith-vice', kind:'ground', bounds:[1100,150,1320,360]},
  {id:'craft-oddity', kind:'ground', bounds:[160,330,430,520]},
  {id:'cliff-edge', kind:'ground', bounds:[60,520,260,690]},
  {id:'gallery-rise', kind:'ground', bounds:[650,100,930,340]},
  {id:'kitchen-rise', kind:'ground', bounds:[250,90,470,300]},
]);

const ZONES = Object.fromEntries(TABLEAU_ZONES.map(zone => [zone.id, zone]));

const LOCATION_SLOTS = Object.freeze({
  harbour_berth:{x:960,y:540,zoneId:'berth-cargo'},
  joels_bar:{x:600,y:515,zoneId:'social-strip'},
  parcel_counter:{x:1080,y:540,zoneId:'wong-strip'},
  nursery:{x:210,y:490,zoneId:'craft-oddity'},
  viewing_room:{x:850,y:350,zoneId:'gallery-rise'},
  back_room:{x:1220,y:355,zoneId:'faith-vice'},
  sonyas_kitchen:{x:340,y:300,zoneId:'kitchen-rise'},
  cliff_path:{x:145,y:690,zoneId:'cliff-edge'},
  public_clearing:{x:710,y:630,zoneId:'park-civic'},
  old_hall:{x:470,y:700,zoneId:'park-civic'},
});

export const NAMED_ACTOR_SLOTS = Object.freeze({
  aspen:{dx:-26,dy:0},
  joel:{dx:-34,dy:0},
  wong:{dx:40,dy:4},
  juan:{dx:-12,dy:0},
  yasmin:{dx:30,dy:0},
  dima:{dx:18,dy:2},
});

const BASE_CROWD = Object.freeze([
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

const CREATURES = Object.freeze([
  {id:'gull-berth',species:'seagull',zoneId:'berth-cargo',activity:'gull'},
  {id:'gull-shore',species:'seagull',zoneId:'sea-shore',activity:'gull'},
  {id:'squirrel-park-a',species:'squirrel',zoneId:'park-civic',activity:'squirrel'},
  {id:'squirrel-park-b',species:'squirrel',zoneId:'park-civic',activity:'squirrel'},
  {id:'reef-fish-a',species:'tropical-fish',zoneId:'sea-water',activity:'fish'},
  {id:'reef-fish-b',species:'tropical-fish',zoneId:'sea-water',activity:'fish'},
  {id:'reef-fish-c',species:'tropical-fish',zoneId:'sea-water',activity:'fish'},
]);

function hash(text='') {
  let h = 2166136261;
  for (let i=0;i<text.length;i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pointIn(zone, id, day=0) {
  const [x1,y1,x2,y2] = zone.bounds;
  const hx = hash(`${id}:x:${day}`) / 0xffffffff;
  const hy = hash(`${id}:y:${day}`) / 0xffffffff;
  return {
    x: Math.round(x1 + (x2-x1) * (.12 + hx*.76)),
    y: Math.round(y1 + (y2-y1) * (.12 + hy*.76)),
  };
}

function variantShift(item, day=0) {
  const phase = (hash(`${item.id}:phase`) + day) % 5;
  return {
    dx: (phase-2)*3,
    dy: ((phase*3)%5-2)*2,
  };
}

export function crowdForWorld(world={}) {
  const day = Number.isFinite(world.day) ? world.day : 0;
  const storm = world.weather === 'storm';
  const shabbatLike = day % 7 === 5;
  return BASE_CROWD
    .filter(item => !(storm && item.dryOnly))
    .map(item => {
      const zone = ZONES[item.zoneId];
      const p = pointIn(zone,item.id,day);
      const shift = variantShift(item,day);
      const faithBoost = shabbatLike && item.tags?.includes('faith');
      return {
        ...item,
        kind:'person',
        zoneKind:zone.kind,
        x:p.x+shift.dx,
        y:p.y+shift.dy,
        emphasis:faithBoost ? 'busy' : 'normal',
        duration:6 + (hash(item.id)%7),
      };
    });
}

export function creaturesForWorld(world={}) {
  const day = Number.isFinite(world.day) ? world.day : 0;
  const storm = world.weather === 'storm';
  return CREATURES
    .filter(item => !(storm && item.species === 'squirrel'))
    .map(item => {
      const zone = ZONES[item.zoneId];
      const p = pointIn(zone,item.id,day+11);
      return {
        ...item,
        kind:'creature',
        zoneKind:zone.kind,
        x:p.x,
        y:p.y,
        duration:5 + (hash(item.id)%8),
      };
    });
}

export function namedActorPoint(world={}, actorId) {
  const location = world.actors?.[actorId]?.location;
  const base = LOCATION_SLOTS[location] || LOCATION_SLOTS.harbour_berth;
  const offset = NAMED_ACTOR_SLOTS[actorId] || {dx:0,dy:0};
  return {x:base.x+offset.dx,y:base.y+offset.dy,zoneId:base.zoneId};
}
