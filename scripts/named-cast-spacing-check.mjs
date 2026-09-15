import assert from 'node:assert/strict';
import {namedActorPoint} from '../src/harbourTableau.js';
const ids=['aspen','joel','wong','juan','yasmin','dima'];
const w={actors:Object.fromEntries(ids.map(id=>[id,{location:'joels_bar'}]))};
const points=ids.map(id=>namedActorPoint(w,id));
for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)assert(Math.abs(points[i].x-points[j].x)>=64,`${ids[i]} and ${ids[j]} overlap their visible heads`);
console.log('PASS: co-present named characters have separate reachable silhouettes');
