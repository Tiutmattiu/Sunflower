import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CHARACTER_PRESENTATION as cast,characterGeometry} from '../src/characterPresentation.js';
const manifest=JSON.parse(fs.readFileSync('public/art/manifest.json','utf8'));
for(const [id,c] of Object.entries(cast)){
 assert(fs.existsSync('public'+c.file),id);
 assert(manifest.assets.some(a=>a.id==='character-'+id&&a.file===c.file),id);
 if(c.file.endsWith('.png')){const png=fs.readFileSync('public'+c.file);assert.equal(png[25],6,'real RGBA required');assert.equal(png.readUInt32BE(16),c.width);assert.equal(png.readUInt32BE(20),c.height);}
 const g=characterGeometry(id);assert(g.renderWidth>0&&g.renderHeight>0&&g.hit);
}
const humans=['joel','juan','aspen','yasmin','dima'].map(id=>cast[id].standingHeight);
assert.equal(cast.joel.standingHeight,Math.max(...humans));assert.equal(cast.juan.standingHeight,Math.min(...humans));
const map=fs.readFileSync('src/HarbourMap.jsx','utf8');assert(!/cast-working|const CAST/.test(map));assert(map.includes('pointerEvents="none" href={c.file}'));
console.log('PASS: independent cast files, intrinsic sizes, real alpha, height order and noninteractive artwork');
