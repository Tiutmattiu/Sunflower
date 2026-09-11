// SUNFLOWER — cheap world-life content pack
// Presentation-only ambient detail. No rewards, no hidden state mutation.

export const LOCATION_AMBIENCE = {
  harbour_berth:[
    {id:'berth.gull.rope',kind:'ambient',object:'gull',text:'A gull is pulling at a wet length of rope.'},
    {id:'berth.blue.crate',kind:'ambient',object:'crate',text:'A blue crate has been turned upside down to dry.'},
    {id:'berth.bootprint',kind:'trace',object:'mark',text:'One wet bootprint stops at the edge of the boards.'},
    {id:'berth.empty.hook',kind:'ambient',object:'hook',text:'An empty hook knocks softly against the post.'},
    {id:'berth.orange.ticket',kind:'colour-rhyme',object:'paper',colour:'orange',text:'An orange ticket is pinned under a stone.'}
  ],
  joels_bar:[
    {id:'bar.wet.ring',kind:'trace',object:'glass',text:'A wet ring remains where somebody was sitting.'},
    {id:'bar.borrowed.chair',kind:'ambient',object:'chair',text:'One chair clearly belongs to a different room.'},
    {id:'bar.blue.thread',kind:'ambient',object:'thread',colour:'cobalt',text:'A blue thread is caught on the counter edge.'},
    {id:'bar.closed.tab',kind:'trace',object:'book',text:'The tab book is closed with a spoon inside it.'},
    {id:'bar.citrus.peel',kind:'ambient',object:'peel',text:'A strip of citrus peel has dried into a spiral.'}
  ],
  parcel_counter:[
    {id:'parcel.string.teeth',kind:'ambient',object:'string',text:'A piece of string has been cut with teeth.'},
    {id:'parcel.three.labels',kind:'ambient',object:'label',text:'Three old labels have been pasted over each other.'},
    {id:'parcel.bent.box',kind:'ambient',object:'box',text:'A box has been repaired with two different kinds of tape.'},
    {id:'parcel.green.tag',kind:'colour-rhyme',object:'tag',colour:'green',text:'A green luggage tag hangs from the wrong parcel.'},
    {id:'parcel.empty.cage',kind:'ambient',object:'cage',text:'An empty carrier is wedged under the shelf.'}
  ],
  nursery:[
    {id:'nursery.mismatched.pots',kind:'ambient',object:'pots',text:'No two pots in this row are the same size.'},
    {id:'nursery.dead.leaf',kind:'trace',object:'leaf',text:'A dead leaf has been placed carefully beside a healthy one.'},
    {id:'nursery.violet.string',kind:'colour-rhyme',object:'string',colour:'violet',text:'Violet string marks three pots and nothing else.'},
    {id:'nursery.bottle',kind:'ambient',object:'bottle',text:'A water bottle has measurements written on both sides.'},
    {id:'nursery.toad.false',kind:'ambient',object:'stone',text:'A stone looks briefly like a toad until you get closer.'}
  ],
  viewing_room:[
    {id:'gallery.folded.cloth',kind:'ambient',object:'cloth',text:'One object sits on cloth folded exactly twice.'},
    {id:'gallery.empty.hook',kind:'trace',object:'hook',text:'A hook on the wall has no object under it.'},
    {id:'gallery.white.glove',kind:'colour-rhyme',object:'glove',colour:'white',text:'A single white glove rests beside the catalogue.'},
    {id:'gallery.pencil.mark',kind:'trace',object:'paper',text:'A price has been erased hard enough to roughen the paper.'},
    {id:'gallery.water.glass',kind:'ambient',object:'glass',text:'A glass of water is untouched beside the viewing chair.'}
  ],
  back_room:[
    {id:'backroom.second.chair',kind:'ambient',object:'chair',text:'The second chair is never pushed fully under the table.'},
    {id:'backroom.crossed.name',kind:'trace',object:'paper',text:'One name has been crossed out in pencil, not ink.'},
    {id:'backroom.green.envelope',kind:'colour-rhyme',object:'envelope',colour:'green',text:'A green envelope is kept separate from the others.'},
    {id:'backroom.clean.ashtray',kind:'ambient',object:'tray',text:'The ashtray is clean enough to look unused.'},
    {id:'backroom.door.chain',kind:'ambient',object:'chain',text:'The door chain is repaired with a different metal link.'}
  ],
  sonyas_kitchen:[
    {id:'kitchen.borrowed.chairs',kind:'ambient',object:'chair',text:'The chairs do not match.'},
    {id:'kitchen.fish.plate',kind:'ambient',object:'plate',text:'A shallow plate has been set aside from the others.'},
    {id:'kitchen.yellow.towel',kind:'colour-rhyme',object:'cloth',colour:'sunflower',text:'A yellow towel hangs from the oven handle.'},
    {id:'kitchen.extra.fork',kind:'trace',object:'fork',text:'There is one more fork than there are places set.'}
  ],
  cliff_path:[
    {id:'cliff.loose.stone',kind:'ambient',object:'stone',text:'A loose stone has rolled farther than the others.'},
    {id:'cliff.rust.marker',kind:'colour-rhyme',object:'marker',colour:'orange',text:'A rust-orange marker is almost hidden by grass.'},
    {id:'cliff.old.wheel.mark',kind:'trace',object:'mark',text:'A narrow wheel mark ends before the steepest section.'},
    {id:'cliff.gull',kind:'ambient',object:'gull',text:'A gull is standing where the path gets narrow.'}
  ],
  public_clearing:[
    {id:'exchange.orange.ticket',kind:'colour-rhyme',object:'paper',colour:'orange',text:'An orange queue ticket matches an orange ledger tab.'},
    {id:'exchange.return.tray',kind:'trace',object:'tray',text:'One tray is marked for things that did not trade.'},
    {id:'exchange.string',kind:'ambient',object:'string',text:'A short piece of string keeps the public papers from lifting.'},
    {id:'exchange.smudged.stamp',kind:'ambient',object:'stamp',text:'One stamp has been pressed so often its edge is dark.'}
  ]
};

export const MAP_MICRO_SCENES = [
  {id:'micro.joel.wong.glass',requires:[['joel','joels_bar'],['wong','joels_bar']],
   lines:['Wong nudges a chipped glass forward.','Joel shakes his head.','Wong sets it down with the unchipped ones anyway.']},
  {id:'micro.aspen.joel.berth',requires:[['aspen','harbour_berth'],['joel','harbour_berth']],
   lines:['Joel points at something on the manifest.','Aspen turns the page upside down for him.','He was holding it upside down.']},
  {id:'micro.juan.wong.nursery',requires:[['juan','nursery'],['wong','nursery']],
   lines:['Juan wants the cracked pot.','Wong wants to sell the crack separately.']},
  {id:'micro.yasmin.dima.gallery',requires:[['yasmin','viewing_room'],['dima','viewing_room']],
   lines:['Dima reads the back of the label.','Yasmin watches him read it.','Neither comments on the object itself.']},
  {id:'micro.aspen.wong.parcel',requires:[['aspen','parcel_counter'],['wong','parcel_counter']],
   lines:['Aspen writes a date on the parcel.','Wong writes a different date beside it.','They look at each other.']},
  {id:'micro.juan.joel.bar',requires:[['juan','joels_bar'],['joel','joels_bar']],
   lines:['Juan asks for water.','Joel gives him water.','Juan looks faintly disappointed.']},
  {id:'micro.dima.wong.parcel',requires:[['dima','parcel_counter'],['wong','parcel_counter']],
   lines:['Wong points to the seal.','Dima points to the address.','They continue disagreeing without raising their voices.']}
];

export const AUDIO_CUES = {
  harbour_berth:['water','rope','gull','wood'],
  joels_bar:['glass','paper','chair','murmur'],
  parcel_counter:['paper','string','drawer','box'],
  nursery:['water_drop','leaf','glass_bottle'],
  viewing_room:['cloth','paper','small_bell'],
  back_room:['paper','door_chain','chair'],
  sonyas_kitchen:['plate','chair','knife_board'],
  cliff_path:['wind','gull','loose_stone'],
  public_clearing:['paper','stamp','coin','tray']
};

export const ambienceFor=location=>LOCATION_AMBIENCE[location]||[];

export function availableMicroScenes(world){
  return MAP_MICRO_SCENES.filter(scene =>
    scene.requires.every(([id,place]) => !world?.actors?.[id]?.removed && world?.actors?.[id]?.location === place)
  );
}
