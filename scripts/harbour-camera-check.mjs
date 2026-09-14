import assert from 'node:assert/strict';
import {HARBOUR_WORLD, legacyPoint, legacyBounds} from '../src/harbourWorld.js';
import {coverScale, clampCamera, centeredCamera, zoomCamera, focusCamera} from '../src/harbourCamera.js';

assert.equal(HARBOUR_WORLD.width, 2000);
assert.equal(HARBOUR_WORLD.height, 1200);
assert.deepEqual(legacyPoint(0,0), {x:220,y:80});
assert.deepEqual(legacyBounds([0,0,1400,900]), [220,80,1620,980]);

const viewport={w:1000,h:700};
const base=coverScale(viewport,HARBOUR_WORLD);
assert(base*HARBOUR_WORLD.width >= viewport.w);
assert(base*HARBOUR_WORLD.height >= viewport.h);
assert(Math.abs(base-(700/1200)) < 1e-9);

const centered=centeredCamera(viewport,HARBOUR_WORLD,1);
assert.equal(centered.z,1);
assert(centered.x <= 0);
assert(centered.y <= 0);

const tooFar=clampCamera({x:-99999,y:99999,z:1},viewport,HARBOUR_WORLD);
const scaledW=HARBOUR_WORLD.width*base;
const scaledH=HARBOUR_WORLD.height*base;
assert(tooFar.x >= viewport.w-scaledW-1e-9);
assert(tooFar.x <= 1e-9);
assert(tooFar.y >= viewport.h-scaledH-1e-9);
assert(tooFar.y <= 1e-9);

const zoomed=zoomCamera(centered,2,{x:500,y:350},viewport,HARBOUR_WORLD);
assert.equal(zoomed.z,2);
assert(zoomed.x <= 0 && zoomed.y <= 0);
assert(zoomed.x >= viewport.w-HARBOUR_WORLD.width*base*zoomed.z-1e-9);
assert(zoomed.y >= viewport.h-HARBOUR_WORLD.height*base*zoomed.z-1e-9);

const focused=focusCamera({x:1990,y:1190},viewport,HARBOUR_WORLD,2.15);
assert.equal(focused.z,2.15);
assert(focused.x <= 0 && focused.y <= 0);
assert(focused.x >= viewport.w-HARBOUR_WORLD.width*base*focused.z-1e-9);
assert(focused.y >= viewport.h-HARBOUR_WORLD.height*base*focused.z-1e-9);

console.log('PASS: harbour cover camera, bounds, reset, zoom, focus and legacy geometry');
