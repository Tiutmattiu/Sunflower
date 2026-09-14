// Pure presentation model for the 2000x1200 unified harbour quarter.
// No function in this module mutates gameplay state.

export const DISTRICT_LANDMARKS = Object.freeze([
  {id:'open-sea',kind:'sea',x:1500,y:980,w:920,h:390},
  {id:'south-shore',kind:'shore',x:380,y:875,w:560,h:170},
  {id:'working-berth',kind:'berth',x:1180,y:690,w:520,h:260,locationId:'harbour_berth'},
  {id:'wong-empire',kind:'wong-services',x:1625,y:410,w:410,h:300,label:'WONG SERVICES',locationId:'parcel_counter'},
  {id:'octopus-bank',kind:'octopus-bank',x:1285,y:500,w:220,h:150,label:'OCTOPUS BANK'},
  {id:'joels-bar',kind:'bar-live-music',x:805,y:480,w:430,h:280,label:"JOEL'S BAR",locationId:'joels_bar'},
  {id:'shisha-courtyard',kind:'shisha',x:585,y:545,w:300,h:220,label:'SHISHA • TEA'},
  {id:'pizza-deli',kind:'pizza-deli',x:1080,y:385,w:250,h:175,label:'PIZZA • DELI'},
  {id:'barber',kind:'barber',x:1430,y:245,w:180,h:150,label:'BARBER'},
  {id:'massage',kind:'massage',x:1630,y:230,w:190,h:155,label:'MASSAGE'},
  {id:'wong-ice-cream',kind:'ice-cream',x:1700,y:590,w:180,h:110,label:'ICE CREAM'},
  {id:'street-trash',kind:'trash',x:1840,y:575,w:70,h:90},
  {id:'park',kind:'park',x:690,y:830,w:470,h:270,label:'PARK'},
  {id:'park-grass',kind:'grass',x:690,y:850,w:430,h:230},
  {id:'basketball-court',kind:'basketball',x:810,y:830,w:260,h:150,label:'COURT'},
  {id:'chess-tables',kind:'chess',x:550,y:770,w:190,h:120,label:'CHESS'},
  {id:'synagogue',kind:'faith-house',x:1700,y:155,w:250,h:210,label:'SYNAGOGUE'},
  {id:'peep-show',kind:'night-venue',x:1880,y:420,w:150,h:170,label:'PEEP SHOW'},
  {id:'pet-shop',kind:'exotic-pet',x:315,y:390,w:230,h:190,label:'ODD PETS'},
  {id:'glass-shop',kind:'glassblower',x:430,y:520,w:220,h:185,label:'GLASS'},
  {id:'snake-pitch',kind:'snake-performer',x:270,y:660,w:190,h:150,label:'SNAKE SHOW'},
  {id:'cliff',kind:'cliff',x:120,y:355,w:300,h:700,label:'OUTER PATH',locationId:'cliff_path'},

  // Existing gameplay institutions are part of the neighbourhood, not invisible menu destinations.
  {id:'nursery-garden',kind:'growing-yard',x:560,y:650,w:260,h:180,label:'GROWING YARD',locationId:'nursery'},
  {id:'gallery',kind:'gallery',x:1050,y:220,w:290,h:195,label:'VIEWING • AUCTION',locationId:'viewing_room'},
  {id:'dima-apartments',kind:'apartment-block',x:1840,y:565,w:220,h:245,label:'ROOMS',locationId:'back_room'},
  {id:'sonya-kitchen',kind:'kitchen',x:605,y:335,w:245,h:170,label:'KITCHEN',locationId:'sonyas_kitchen'},
  {id:'public-exchange',kind:'public-clearing',x:1090,y:720,w:280,h:155,label:'OCTOPUS CLEARING',locationId:'public_clearing'},
  {id:'old-hall',kind:'old-hall',x:430,y:735,w:250,h:165,label:'OLD HALL • FILMS',locationId:'old_hall'},
]);

export const DISTRICT_LOCATION_POINTS=Object.freeze({
  harbour_berth:{x:1190,y:735},
  joels_bar:{x:805,y:575},
  parcel_counter:{x:1605,y:575},
  nursery:{x:560,y:735},
  viewing_room:{x:1050,y:335},
  back_room:{x:1840,y:685},
  sonyas_kitchen:{x:605,y:425},
  cliff_path:{x:170,y:720},
  public_clearing:{x:1090,y:790},
  old_hall:{x:430,y:825},
});

export const DISTRICT_PROP_POINTS=Object.freeze({
  crate:{x:1160,y:700},cargo:{x:1230,y:685},
  bottle:{x:760,y:520},glass:{x:850,y:520},packing:{x:705,y:545},
  parcel:{x:1545,y:520},parts:{x:1640,y:520},
  plants:{x:520,y:700},paper:{x:605,y:700},
  bowl:{x:1010,y:300},photo:{x:1110,y:300},
  envelope:{x:1840,y:635},table:{x:605,y:390},
  path:{x:145,y:700},orders:{x:1090,y:745},
});

const SIGNALS = Object.freeze([
  {id:'wong-sign',kind:'wong-services',x:1640,y:335,label:'PARCEL • LAUNDRY • STORAGE • ₿'},
  {id:'octopus-sign',kind:'octopus-bank',x:1280,y:445,label:'OCTOPUS BANK'},
  {id:'bar-sign',kind:'bar-live-music',x:810,y:360,label:"JOEL'S • LIVE"},
  {id:'shisha-sign',kind:'shisha',x:590,y:458,label:'SHISHA • TEA'},
  {id:'pizza-sign',kind:'pizza-deli',x:1080,y:305,label:'PIZZA • DELI'},
  {id:'barber-sign',kind:'barber',x:1430,y:170,label:'BARBER'},
  {id:'massage-sign',kind:'massage',x:1630,y:160,label:'MASSAGE'},
  {id:'faith-sign',kind:'faith-house',x:1700,y:92,label:'SYNAGOGUE'},
  {id:'vice-sign',kind:'night-venue',x:1880,y:335,label:'PEEP SHOW'},
  {id:'pet-sign',kind:'exotic-pet',x:315,y:300,label:'ODD PETS'},
  {id:'glass-sign',kind:'glassblower',x:430,y:430,label:'GLASS'},
  {id:'gallery-sign',kind:'gallery',x:1050,y:140,label:'VIEWING • AUCTION'},
  {id:'cinema-sign',kind:'old-hall',x:430,y:665,label:'OLD HALL • FILMS'},
  {id:'apartments-sign',kind:'apartment-block',x:1840,y:505,label:'ROOMS • RENT'},
  {id:'nursery-sign',kind:'growing-yard',x:560,y:585,label:'GROWING YARD'},
  {id:'exchange-sign',kind:'public-clearing',x:1090,y:655,label:'OCTOPUS CLEARING'},
]);

const OCCLUDERS = Object.freeze([
  {id:'joel-counter',kind:'bar-counter',x:810,y:545,depthY:565,w:250,h:64},
  {id:'wong-counter',kind:'wong-counter',x:1615,y:505,depthY:530,w:250,h:66},
  {id:'shisha-screen',kind:'shisha-screen',x:600,y:610,depthY:635,w:250,h:56},
  {id:'dock-rail',kind:'dock-rail',x:1210,y:745,depthY:770,w:430,h:38},
  {id:'park-fence',kind:'park-fence',x:760,y:920,depthY:935,w:390,h:34},
  {id:'pet-awning',kind:'pet-awning',x:315,y:450,depthY:468,w:200,h:40},
  {id:'nursery-fence',kind:'nursery-fence',x:560,y:746,depthY:755,w:230,h:32},
  {id:'gallery-rope',kind:'gallery-rope',x:1050,y:350,depthY:360,w:220,h:24},
]);

function dayNumber(world={}) {
  return Number.isFinite(world.day) ? world.day : 0;
}

export function districtStateForWorld(world={}) {
  const day = dayNumber(world);
  const storm = world.weather === 'storm';
  const shabbatLike = day % 7 === 5;
  return Object.freeze({
    day,
    storm,
    shabbatLike,
    hotBeach: !storm && day % 3 === 1,
    cargoRush: day % 3 === 0,
    musicNight: !storm && day % 4 === 2,
    cinemaNight: !storm && day % 3 === 0,
    commercialQuiet: shabbatLike,
    seaEnergy: storm ? 'rough' : (day % 2 ? 'bright' : 'calm'),
  });
}

export function districtSignals(world={}) {
  const state = districtStateForWorld(world);
  return SIGNALS.map(signal => ({
    ...signal,
    muted: state.commercialQuiet && ['wong-services','pizza-deli','barber','massage'].includes(signal.kind),
    emphasized: (state.musicNight && signal.kind === 'bar-live-music') || (state.shabbatLike && signal.kind === 'faith-house') || (state.cinemaNight && signal.kind === 'old-hall'),
  }));
}

export function districtOccluders(world={}) {
  const state = districtStateForWorld(world);
  return OCCLUDERS.map(item => ({...item, weathered: state.storm}));
}
