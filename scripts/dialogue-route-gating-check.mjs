import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import {selectDialogue,UNKNOWN_PEOPLE} from '../src/dialogueContent.js';

const forbidden=/Orgeat|almond|sunflower|cliff|one[- ]?wheel|race|steel rim|brake cable|chain/i;
const w=createHarbourWorld(41,{publishNews:false});
w.actors.player.contacts.push('joel','juan','aspen');

w.actors.joel.location='joels_bar';
w.playerGame.location='joels_bar';
assert(!forbidden.test(selectDialogue(w,'joel').text),'fresh Joel dialogue must not reveal Mai Tai answer or Juan route');

w.playerGame.knowledge.push('mai_tai_problem');
assert(!/Orgeat|almond/i.test(selectDialogue(w,'joel').text),'knowing only that the drink is wrong must not reveal Orgeat');
w.playerGame.knowledge.push('mai_tai_ingredient');
assert(/Orgeat|almond/i.test(selectDialogue(w,'joel').text),'earned ingredient knowledge may be reflected in Joel dialogue');

w.actors.juan.location='nursery';
w.playerGame.location='nursery';
w.playerGame.knowledge=[];
assert(!forbidden.test(selectDialogue(w,'juan').text),'first ordinary Juan dialogue must not reveal the route');

w.actors.juan.location='joels_bar';
w.playerGame.location='joels_bar';
w.playerGame.knowledge=['juan_bar_drink'];
assert(!/sunflower|cliff|one[- ]?wheel|race|steel rim|brake cable|chain/i.test(selectDialogue(w,'juan').text),'Juan before the player explains the goal must not reveal the wager or build');

w.actors.aspen.location='harbour_berth';
w.playerGame.location='harbour_berth';
w.playerGame.knowledge=['juan_route'];
assert(!/steel rim|brake cable|chain quick/i.test(selectDialogue(w,'aspen').text),'Aspen before assessment must not reveal the parts list');
w.playerGame.knowledge.push('onewheel_plan');
assert(/rim|cable|link/i.test(selectDialogue(w,'aspen').text),'Aspen may discuss parts after the assessment is earned');

assert(/whippet/i.test(UNKNOWN_PEOPLE.wong),'unknown Wong description should match current whippet canon');
console.log('PASS: dialogue vocabulary follows player knowledge and current character canon');
