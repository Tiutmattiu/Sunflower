import assert from 'node:assert/strict';
import {createHarbourWorld,sceneSnapshot} from '../src/harbourSpine.js';
import {learn,PLAYER_KNOWLEDGE as K} from '../src/playerKnowledge.js';

let w=createHarbourWorld(41);
let nursery=sceneSnapshot(w,'nursery');
assert(!nursery.objects.includes('onewheel parts'),'fresh nursery scene leaked unearned Onewheel parts');
learn(w,K.onewheel_plan);
nursery=sceneSnapshot(w,'nursery');
assert(nursery.objects.includes('onewheel parts'),'earned build plan should allow the authored repair detail to become meaningful');
console.log('PASS: scene snapshots respect player route knowledge');
