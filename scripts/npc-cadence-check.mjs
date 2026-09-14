import assert from 'node:assert/strict';
import {createHarbourWorld,finishPlayerIntervention} from '../src/harbourSpine.js';
import {visitLocation} from '../src/playerGame.js';

let w=createHarbourWorld(41,{attentionPerDay:8});
assert.equal(w.relationshipEcology.interactions.length,0);

// A player's first short intervention advances only one eighth of the waking-day
// clock. NPCs must not interpret every player action as an instruction to take a
// new relational turn. Their own schedule decides when an intra-day activity is due.
const afterWalk=visitLocation(w,'workbench');
assert.equal(afterWalk.attention.used,1);
const afterBeat=finishPlayerIntervention(w,afterWalk);
assert.equal(
  afterBeat.relationshipEcology.interactions.length,
  0,
  'NPC relational activity fired on the first player click instead of waiting for an NPC cadence window'
);

// As the shared clock advances, at least one independently scheduled NPC activity
// should eventually become due; intra-day life is not disabled or deferred entirely
// to Next Day.
let current=afterBeat;
for(const location of ['harbour_berth','public_clearing','workbench','harbour_berth']){
  const moved=visitLocation(current,location);
  current=finishPlayerIntervention(current,moved);
}
assert(
  current.relationshipEcology.interactions.length>0,
  'independent NPC cadence never fired during the waking day'
);
assert(
  current.relationshipEcology.interactions.length<current.attention.used,
  'NPC relationship turns still scale one-for-one with player interventions'
);

console.log('PASS: NPCs use independent intra-day cadence rather than one move per player click');
