import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ACTION_COPY} from '../src/presentationCopy.js';
import {TARGET_ACTIONS} from '../src/harbourPresentation.js';

const app=fs.readFileSync(new URL('../src/AppCore.jsx',import.meta.url),'utf8');
assert(ACTION_COPY.juan_field_trip,'player copy must exist for the earned field trip');
assert(TARGET_ACTIONS.juan?.includes('juan_field_trip'),'Juan UI must expose the field-trip action');
assert(app.includes("juan_field_trip"),'AppCore must render the field-trip completion');
assert(!/a\.id==='race_juan'\?\(raceWon\?'Sunflower'/.test(app),'race comic must not visually mint the sunflower');
assert(/routes\.juan\.stage===['\"]won['\"]/.test(app),'UI must recognize the post-race won stage');
console.log('PASS: visible race win leads to Juan field trip before sunflower');
