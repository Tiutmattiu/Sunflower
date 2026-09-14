import assert from 'node:assert/strict';
import fs from 'node:fs';

const spoken=fs.readFileSync(new URL('../src/SpokenLine.jsx',import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../src/AppCore.jsx',import.meta.url),'utf8');

assert(!/setTimeout\s*\(/.test(spoken),'ordinary spoken lines must not auto-advance on a timer');
assert(!/setTimeout\s*\([^)]*setShown/.test(app),'comic panels must not auto-advance on a timer');
assert(/onClick=\{advance\}/.test(spoken),'spoken lines should advance explicitly on player input');
assert(/Read next line|Finish reading/.test(spoken),'spoken line control needs predictable accessible progression copy');

console.log('PASS: dialogue and comics advance only on explicit player input');
