import assert from 'node:assert/strict';
import fs from 'node:fs';
const app=fs.readFileSync(new URL('../src/AppCore.jsx',import.meta.url),'utf8');
assert(!app.includes('/art/harbour-working.png'),'Comic still enlarges the historical 1400×900 raster background');
assert(app.includes('HarbourDistrictBase'),'Comic should reuse the current authored vector district world');
assert(/<Comic scene=\{comic\} world=\{world\}/.test(app),'Comic must receive the live world so weather/district state stay current');
console.log('PASS: comics use the current layered/vector harbour rather than the historical raster');
