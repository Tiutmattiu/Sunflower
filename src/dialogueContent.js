// SUNFLOWER — contextual dialogue content pack
// Authored against main @ 4ad195f and the current continuous-map presentation branch.
// Presentation-only: this module must never mutate simulation truth.

const arr = x => Array.isArray(x) ? x : [x];
const loc = (w,id) => w?.actors?.[id]?.location;
const near = (w,a,b) => !w.actors[a]?.removed && !w.actors[b]?.removed && !['away','private'].includes(loc(w,a)) && loc(w,a) && loc(w,a) === loc(w,b);
const route = (w,key) => w?.playerGame?.routes?.[key] || {};
const recentInteraction = (w,id) =>
  [...(w?.relationshipEcology?.interactions || [])].reverse().find(x => x.day===w.day && (x.initiator===id || x.target===id));
export const VOICE_NOTES = {
  aspen:'quantity → time → condition → exception; exact without sounding like a calculator',
  joel:'sensory notice → curiosity → attempt → delayed conclusion; can change subject because he notices an object',
  yasmin:'courtesy → positioning → one precise question → silence or changed access',
  wong:'quantity → immediate cost → interrupted work → bargain; busiest voice, not “cheap merchant” voice',
  juan:'sober: long causal chains and real competence; activated: shorter horizon, repetition, another trial',
  dima:'scope → enforceability → fee → next operational step; mundane brokerage, not movie-gangster cool lines'
};

export const DIALOGUE_BEATS = [
  // ASPEN
  {id:'aspen.berth.weather',speaker:'aspen',locations:['harbour_berth'],priority:40,
   when:w=>w.weather==='storm',
   lines:['She puts a stone on the corner of the manifest.','“The paper is dry. The route is not.”']},
  {id:'aspen.berth.departure',speaker:'aspen',locations:['harbour_berth'],priority:35,
   when:w=>w.aspenRoute?.status==='preparing' && (w.aspenRoute?.deadline??99)-(w.day??0)<=1,
   lines:['She checks the same line twice, then the water.','“If it is not aboard before I leave, it is not aboard.”']},
  {id:'aspen.berth.time',speaker:'aspen',locations:['harbour_berth'],priority:15,
   lines:['She folds the cargo paper along an old crease.','“Three now, or three total?”']},
  {id:'aspen.bar.juan',speaker:'aspen',locations:['joels_bar'],priority:50,
   when:w=>near(w,'aspen','juan'),
   lines:['Aspen presses two fingers to her wrist.','Juan: “Dying?”','“Coffee.”','“Could still be dying.”','“Yes.”']},
  {id:'aspen.bar.deadline',speaker:'aspen',locations:['joels_bar'],priority:35,
   when:w=>(w.aspenRoute?.deadline??99)-(w.day??0)<=1,
   lines:['Her glass is still almost full.','She looks at her watch before answering. “Nine minutes.”']},
  {id:'aspen.bar.quiet',speaker:'aspen',locations:['joels_bar'],priority:10,
   lines:['She has moved the coaster exactly under the wet ring.','“I am not staying late.”']},
  {id:'aspen.parcel.gift',speaker:'aspen',locations:['parcel_counter'],priority:35,
   when:w=>(w.relationshipEcology?.gifts||[]).some(g=>g.ownerId==='aspen'&&g.status==='in_transit'),
   lines:['A small wrapped box sits apart from the cargo.','You point to it.','“Not cargo.”']},
  {id:'aspen.viewing.delivery',speaker:'aspen',locations:['viewing_room'],priority:15,
   lines:['She holds a folded receipt instead of touching the object.','“I brought the paper. I did not appraise the thing.”']},
  {id:'aspen.nursery.measure',speaker:'aspen',locations:['nursery'],priority:15,
   lines:['Aspen measures the gap between two trays.','Juan watches. “They grow.”','“I know.”']},

  // JOEL
  {id:'joel.bar.first',speaker:'joel',locations:['joels_bar'],priority:18,
   when:w=>!(w.actors?.player?.contacts||[]).includes('joel'),
   lines:['Joel puts down a glass.','“I know what’s in it.”','He looks at it again. “That isn’t the same as knowing what it is.”']},
  {id:'joel.bar.orgeat',speaker:'joel',locations:['joels_bar'],priority:45,
   when:w=>route(w,'sonya').stage==='known'&&!route(w,'sonya').orgeatSupplied,
   lines:['He tips an almost-empty bottle toward the light.','“Enough for one, maybe. Two if I lie to myself.”']},
  {id:'joel.bar.invited',speaker:'joel',locations:['joels_bar'],priority:40,
   when:w=>route(w,'sonya').stage==='invited',
   lines:['A spare chair has been pulled against the wall.','Joel follows your glance. “That one is going with us.”']},
  {id:'joel.bar.dima',speaker:'joel',locations:['joels_bar'],priority:38,
   when:w=>near(w,'joel','dima'),
   lines:['Joel closes the tab book.','Dima: “Again?”','Joel leaves his hand on the cover.']},
  {id:'joel.bar.juan.tab',speaker:'joel',locations:['joels_bar'],priority:42,
   when:w=>near(w,'joel','juan')&&(w.claimRights?.tabs||[]).some(t=>t.issuerId==='juan'&&t.state==='open'),
   lines:['Juan looks at the bottle.','Joel looks at the book.','Neither of them says “one more.”']},
  {id:'joel.bar.blue-thread',speaker:'joel',locations:['joels_bar'],priority:12,
   lines:['Joel starts to answer, then looks at your sleeve.','A blue thread is caught there.','“Sorry. What were you saying?”']},
  {id:'joel.berth.object',speaker:'joel',locations:['harbour_berth'],priority:15,
   lines:['Joel turns a small metal tool over in his hand.','“It looked simpler from the other side.”']},
  {id:'joel.nursery',speaker:'joel',locations:['nursery'],priority:12,
   lines:['Joel smells a leaf he was not invited to smell.','Juan: “That one is not aromatic.”','“I know that now.”']},

  // YASMIN
  {id:'yasmin.preview.closed',speaker:'yasmin',locations:['viewing_room'],priority:45,
   when:w=>(w.day??0)>(route(w,'yasmin').previewCloses??99),
   lines:['The folded cloth is gone.','Yasmin: “You missed the preview.”']},
  {id:'yasmin.preview.inspect',speaker:'yasmin',locations:['viewing_room'],priority:35,
   when:w=>route(w,'yasmin').preview&&!route(w,'yasmin').inspected,
   lines:['She turns the bowl half an inch.','“Now you can see the repair.”']},
  {id:'yasmin.preview.provenance',speaker:'yasmin',locations:['viewing_room'],priority:38,
   when:w=>route(w,'yasmin').inspected&&!route(w,'yasmin').provenance,
   lines:['The bowl stays where it is.','Yasmin moves the old label beside it instead.']},
  {id:'yasmin.bar.social',speaker:'yasmin',locations:['joels_bar'],priority:16,
   lines:['Yasmin remembers the bartender’s question from ten minutes ago.','She answers it only after finishing another conversation.']},
  {id:'yasmin.parcel.wong',speaker:'yasmin',locations:['parcel_counter'],priority:36,
   when:w=>near(w,'yasmin','wong'),
   lines:['Wong unwraps one corner.','Yasmin: “Where did it come from?”','Wong ties the corner shut again. “That costs extra.”']},
  {id:'yasmin.berth',speaker:'yasmin',locations:['harbour_berth'],priority:12,
   lines:['She does not step over the wet rope.','Aspen notices and moves the paper to her instead.']},
  {id:'yasmin.backroom',speaker:'yasmin',locations:['back_room'],priority:16,
   lines:['Yasmin reads the name on the envelope before sitting down.','“Who else has seen this?”']},

  // WONG
  {id:'wong.counter.busy',speaker:'wong',locations:['parcel_counter'],priority:15,
   lines:['Wong pulls one string tight with his teeth, one paw on the next parcel.','“Paper first.”']},
  {id:'wong.counter.dima',speaker:'wong',locations:['parcel_counter'],priority:40,
   when:w=>near(w,'wong','dima'),
   lines:['Dima taps the seal once.','Wong does not look up. “Guarantee the contents or guarantee the arrival. Pick one.”']},
  {id:'wong.counter.aspen',speaker:'wong',locations:['parcel_counter'],priority:35,
   when:w=>near(w,'wong','aspen'),
   lines:['Aspen points to a date.','Wong adds another knot.','“The knot is not the schedule.”','“No. It survives the schedule.”']},
  {id:'wong.bar',speaker:'wong',locations:['joels_bar'],priority:12,
   lines:['Wong argues over one tin without raising his voice.','Joel waits until the argument is finished before pouring anything.']},
  {id:'wong.nursery',speaker:'wong',locations:['nursery'],priority:20,
   lines:['Wong nudges a cracked container forward.','Juan: “Useful.”','Wong: “Then pay useful.”']},
  {id:'wong.viewing',speaker:'wong',locations:['viewing_room'],priority:18,
   lines:['Wong keeps his paws clear of the cloth.','“I am only telling you where I found it.”']},

  // JUAN — deliberately location-specific so he does not carry nursery mud into every scene
  {id:'juan.nursery.default',speaker:'juan',locations:['nursery'],priority:15,
   lines:['Juan pinches one leaf, then another.','“This one is thirsty. That one is lying.”']},
  {id:'juan.nursery.claim',speaker:'juan',locations:['nursery'],priority:34,
   when:w=>(w.claims||[]).some(c=>c.issuerId==='juan'&&c.status==='seeking_finance'),
   lines:['A paper is weighted under a terracotta chip.','Juan: “The plants are slow. The bill is not.”']},
  {id:'juan.nursery.aspen',speaker:'juan',locations:['nursery'],priority:40,
   when:w=>near(w,'juan','aspen'),
   lines:['Aspen measures the tray spacing.','Juan: “They move.”','“Not during measurement.”']},
  {id:'juan.bar.default',speaker:'juan',locations:['joels_bar'],priority:15,
   lines:['Juan is holding a glass he has forgotten to drink from.','“I had a reason for coming here.”','He looks at the glass. “That was not it.”']},
  {id:'juan.bar.joel',speaker:'juan',locations:['joels_bar'],priority:38,
   when:w=>near(w,'juan','joel'),
   lines:['Juan: “One more.”','Joel looks at the tab book.','Juan: “That look is becoming expensive.”']},
  {id:'juan.berth',speaker:'juan',locations:['harbour_berth'],priority:18,
   lines:['Juan watches a crate come off the boat.','“Everything arrives with a story about why it is late.”']},
  {id:'juan.viewing',speaker:'juan',locations:['viewing_room'],priority:18,
   lines:['Juan reads the estimate twice.','“The second number is not more true. It is only second.”']},
  {id:'juan.backroom',speaker:'juan',locations:['back_room'],priority:22,
   lines:['Juan pushes a folded claim across the table.','Dima does not unfold it yet. “When do they pay?”']},

  // DIMA
  {id:'dima.backroom.default',speaker:'dima',locations:['back_room'],priority:15,
   lines:['Dima reads the first page and leaves the second folded.','“What exactly do you want me to guarantee?”']},
  {id:'dima.backroom.suspended',speaker:'dima',locations:['back_room'],priority:45,
   when:w=>w.production?.marketStanding?.status==='SUSPENDED',
   lines:['He reads the refusal stamp.','“They will not take your paper. My buyer may. Different price.”']},
  {id:'dima.bar',speaker:'dima',locations:['joels_bar'],priority:14,
   lines:['Dima sits where he can see the door.','He moves his glass once when someone blocks the view.']},
  {id:'dima.bar.joel',speaker:'dima',locations:['joels_bar'],priority:35,
   when:w=>near(w,'dima','joel'),
   lines:['Joel leaves the tab book open.','Dima: “You know closing it does not erase the number.”']},
  {id:'dima.parcel',speaker:'dima',locations:['parcel_counter'],priority:18,
   lines:['Dima checks the seal, not the wrapping.','“If it arrives open, call me before you call them.”']},
  {id:'dima.viewing',speaker:'dima',locations:['viewing_room'],priority:18,
   lines:['Dima reads the back of the label.','Yasmin waits until he puts it down.']},
  {id:'dima.nursery',speaker:'dima',locations:['nursery'],priority:18,
   lines:['Dima looks at the maturity date on the paper, not the plant.','Juan notices. “Same thing, eventually.”']},

  // RECENT-STATE OVERRIDES
  {id:'general.recent.refusal',speaker:'*',priority:32,
   when:(w,id)=>recentInteraction(w,id)?.response==='REFUSE',
   lineBySpeaker:{
     aspen:['“No still means no after lunch.”'],
     joel:['“I heard you.”','He does not make you repeat it.'],
     yasmin:['“We already answered that.”'],
     wong:['Wong keeps tying the parcel.'],
     juan:['“Try a different assumption.”'],
     dima:['“Different terms, or different person.”']
   }}
];

function linesFor(beat,speaker){
  if(beat.lineBySpeaker) return arr(beat.lineBySpeaker[speaker]||[]);
  return arr(beat.lines||[]);
}

const CO_PRESENT = {
 'aspen.nursery.measure':['juan'], 'joel.nursery':['juan'], 'yasmin.berth':['aspen'],
 'wong.bar':['joel'], 'wong.nursery':['juan'], 'juan.backroom':['dima'],
 'dima.viewing':['yasmin'], 'dima.nursery':['juan']
};
export const UNKNOWN_PEOPLE = {
 aspen:'the woman in the flowered blouse', joel:'the young man in the yellow waistcoat',
 yasmin:'the woman in black and gold', juan:'the older man carrying plants',
 wong:'the copper dog', dima:'the fair-haired man'
};
export function visibleNames(world,text){
 return String(text).replace(/\b(Aspen|Joel|Yasmin|Juan|Wong|Dima)\b/g,name=>
  world.actors.player.contacts.includes(name.toLowerCase())?name:UNKNOWN_PEOPLE[name.toLowerCase()]);
}
export function eligibleDialogueBeats(world,speaker){
 const location=loc(world,speaker);
 if(world.actors[speaker]?.removed||['away','private'].includes(location))return [];
 return DIALOGUE_BEATS.filter(b=>b.speaker===speaker||b.speaker==='*')
  .filter(b=>!b.locations||b.locations.includes(location))
  .filter(b=>(CO_PRESENT[b.id]||[]).every(other=>near(world,speaker,other)))
  .filter(b=>!b.when||b.when(world,speaker))
  .filter(b=>linesFor(b,speaker).length)
  .sort((a,b)=>(b.priority||0)-(a.priority||0)||a.id.localeCompare(b.id));
}
export function selectDialogueBeat(world,speaker){
 const actor=world.actors[speaker], memory=world.playerGame.encounters?.[speaker];
 if(!actor||actor.removed||['away','private'].includes(actor.location))return {id:'absent',speaker,lines:['They have gone.']};
 // An actor can discuss their own promise; other actors do not inherit that knowledge.
 const debt=world.claims.find(c=>c.issuerId==='player'&&c.holderId===speaker&&c.status==='open'&&c.dueDay<=world.day+1);
 if(debt)return {id:speaker+'.debt',speaker,lines:[`“You owe me ${debt.face} tins on day ${debt.dueDay+1}. Shall we look at the paper?”`]};
 const eligible=eligibleDialogueBeats(world,speaker);
 const last=memory?.location===actor.location?memory.lastBeat:null;
 const choice=eligible.find(b=>b.id!==last);
 if(!choice&&last)return {id:`${speaker}.${actor.location}.pause`,speaker,lines:[{
  juan:'“Give me a moment. I was halfway through a thought.”',
  joel:'He raises one finger, finishes what he is doing, then turns back to you.',
  aspen:'“Hold that thought.” She looks towards the water.',
  yasmin:'She leaves the silence open. This time she lets you start.',
  wong:'He rests one paw on the parcel and waits for you to go on.',
  dima:'He takes off his purple glasses. “Go on.”'
 }[speaker]||'For a moment, neither of you speaks.']};
 if(!choice)return {id:`${speaker}.${actor.location}.quiet`,speaker,lines:['They acknowledge you, then turn back to what they were doing.']};
 return {...choice,speaker,lines:linesFor(choice,speaker).map(line=>visibleNames(world,line))};
}
export const selectDialogue=(world,speaker)=>{const beat=selectDialogueBeat(world,speaker);return {...beat,text:beat.lines.join('\n')};};
export const reactionText=(world,speaker)=>selectDialogue(world,speaker).text;
