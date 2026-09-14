// Canonical current-world identities used to keep runtime aliases from becoming duplicate places.
// CURRENT_GAME.md wins if older docs conflict with this registry.

export const WORLD_ONTOLOGY=Object.freeze({
  octopus:Object.freeze({
    id:'octopus',
    name:'Octopus',
    kind:'institution',
    runtimeLocation:'public_clearing',
    aliases:['public_clearing','clearing','exchange','Octopus Clearing'],
    functions:['clearing','payment','local-market-data','public-orders','settlement-records'],
  }),
  'yasmin-gallery':Object.freeze({
    id:'yasmin-gallery',name:"Yasmin's gallery",kind:'institution',runtimeLocation:'viewing_room',
    aliases:['viewing_room','Gallery','Viewing Room','Auction'],
    functions:['viewing','provenance','auction','private-capital-access'],
  }),
  'dima-apartments':Object.freeze({
    id:'dima-apartments',name:"Dima's apartment building",kind:'place',runtimeLocation:'back_room',
    aliases:['back_room','Back room','Rooms'],functions:['residential','private-brokerage','private-settlement'],
  }),
  'wong-services':Object.freeze({
    id:'wong-services',name:"Wong's services",kind:'business',runtimeLocation:'parcel_counter',
    aliases:['parcel_counter','Parcel shop',"Wong's counter"],functions:['parcel','storage','laundry','small-services'],
  }),
  'joels-bar':Object.freeze({
    id:'joels-bar',name:"Joel's Bar",kind:'business',runtimeLocation:'joels_bar',
    aliases:['joels_bar','Bar'],functions:['bar','hospitality','social-gathering'],
  }),
  'juan-nursery':Object.freeze({
    id:'juan-nursery',name:"Juan's nursery",kind:'business',runtimeLocation:'nursery',
    aliases:['nursery','Growing yard'],functions:['nursery','growing','biological-productive-assets'],
  }),
  'sonya-kitchen':Object.freeze({
    id:'sonya-kitchen',name:"Sonya's kitchen",kind:'home',runtimeLocation:'sonyas_kitchen',
    aliases:['sonyas_kitchen','Kitchen'],functions:['household','hospitality'],
  }),
  'old-hall':Object.freeze({
    id:'old-hall',name:'Old Hall',kind:'venue',runtimeLocation:'old_hall',
    aliases:['old_hall','Screening hall','Cinema'],functions:['screening','community-venue'],
  }),
  'pizza-shop':Object.freeze({id:'pizza-shop',name:'Pizza shop',kind:'business',runtimeLocation:null,aliases:['pizza'],functions:['food']}),
  deli:Object.freeze({id:'deli',name:'Deli',kind:'business',runtimeLocation:null,aliases:['deli'],functions:['food','takeaway']}),
  'music-festival':Object.freeze({id:'music-festival',name:'Street music festival',kind:'event-space',runtimeLocation:null,aliases:['live music festival'],functions:['music','festival','public-gathering']}),
});

export const canonicalPlaceForRuntime=locationId=>Object.values(WORLD_ONTOLOGY).find(x=>x.runtimeLocation===locationId)?.id||null;
export const ontologyEntry=id=>WORLD_ONTOLOGY[id]||null;
