import assert from 'node:assert/strict';
import fs from 'node:fs';

const app=fs.readFileSync(new URL('../src/AppCore.jsx',import.meta.url),'utf8');
const presentation=fs.readFileSync(new URL('../src/harbourPresentation.js',import.meta.url),'utf8');
const copy=fs.readFileSync(new URL('../src/presentationCopy.js',import.meta.url),'utf8');

for(const [name,source] of [['AppCore',app],['harbourPresentation',presentation],['presentationCopy',copy]]){
  assert(!source.includes('juan_plan'),`${name} still exposes the retired direct Juan plan action`);
  assert(!source.includes('cliff_commit'),`${name} still exposes the retired direct cliff completion action`);
  assert(!/Ask Juan about the cliff|parcel bench|Wong.{0,80}assembl|handling bench.{0,80}assembl/is.test(source),`${name} still describes the retired Wong/cliff shortcut`);
}

assert(presentation.includes('mai_tai_taste'),'presentation must expose the tasting step');
assert(presentation.includes('juan_explain_goal'),'presentation must expose the player-led Juan conversation');
assert(presentation.includes('aspen_onewheel_plan'),'presentation must expose Aspen assessment');
assert(presentation.includes('race_juan'),'presentation must expose the race');
assert(/Nothing here is a quest marker/.test(presentation),'unknown bottle reaction should remain non-spoilery');
assert(/Mixed repair hardware/.test(presentation),'unknown parts reaction should remain non-spoilery');

console.log('PASS: current route presentation contains no retired Juan shortcut or prop-level answer leak');
