import assert from 'node:assert/strict';
import {createHarbourWorld,advanceHarbourWindow} from '../src/harbourSpine.js';
import {ECONOMIC_GOODS} from '../src/economicContent.js';
import {advanceRouteSources,ROUTE_SOURCE_CONFIG} from '../src/routeSources.js';
import * as seeds from '../src/seedEconomy.js';

assert(Object.keys(seeds.PROPAGULE_CATALOG||{}).length>=8,'Juan/Aspen economy needs multiple real seed/cutting kinds, not one generic seed packet');
const entries=Object.entries(seeds.PROPAGULE_CATALOG||{});
assert(entries.some(([,x])=>x.propaguleType==='seed'&&x.route==='outer'),'long routes should be able to carry dry seed packets');
assert(entries.some(([,x])=>['cutting','division'].includes(x.propaguleType)&&x.route==='medium'),'living cuttings/divisions should use nearer routes than dry seeds');

function fakeReturn(w,day,routeId){
 w.day=day;w.aspenRoute.activeRoute=routeId;w.aspenRoute.activeCargo=[...ROUTE_SOURCE_CONFIG[routeId].goods];
 for(const kind of w.aspenRoute.activeCargo)w.actors.aspen.inventory.push({unitId:`route-${day}-${kind}`,kind,owner:'aspen',age:0,costBasis:1,source:`route_${routeId}_import`,opened:false,remaining:1});
 w.returnLedger.push({day,class:'OPERATE',actorId:'aspen',amount:8,context:`${routeId}_logistics_margin`});
 advanceRouteSources(w);
}

let w=createHarbourWorld(91,{attentionPerDay:99});
fakeReturn(w,1,'short');
let batch=w.npcEconomy.aspenCatalog.batches.at(-1);
assert(batch.goods.every(kind=>!seeds.PROPAGULE_CATALOG[kind]),'short fresh route must not discover long-distance seed stock');
assert(batch.goods.some(kind=>Number.isFinite(ECONOMIC_GOODS[kind]?.shelfLife)),'short route should expose genuinely time-sensitive/fresh goods');

fakeReturn(w,2,'outer');
batch=w.npcEconomy.aspenCatalog.batches.at(-1);
const outerSeed=batch.goods.find(kind=>seeds.PROPAGULE_CATALOG[kind]?.propaguleType==='seed');
assert(outerSeed,'outer voyage should unlock at least one dry seed packet in its batch');
const seedUnit=w.actors.aspen.inventory.find(u=>u.kind===outerSeed&&u.source==='route_outer_propagule');
assert(seedUnit,'a returned propagule is physical cargo, not just a notebook unlock');

fakeReturn(w,3,'medium');
batch=w.npcEconomy.aspenCatalog.batches.at(-1);
assert(batch.goods.some(kind=>['cutting','division'].includes(seeds.PROPAGULE_CATALOG[kind]?.propaguleType)),'medium voyage should unlock a living cutting/division');

const seedUnitId=seedUnit.unitId;
const inventoryBefore=w.actors.aspen.inventory.length;
const planted=seeds.plantPropagule(w,seedUnitId,{ownerId:'aspen',growerId:'juan'});
assert.equal(planted.ok,true,planted.reason);
assert.equal(w.actors.aspen.inventory.some(u=>u.unitId===seedUnitId),false,'planting consumes the physical propagule unit');
assert.equal(w.actors.aspen.inventory.length,inventoryBefore-1,'planting cannot duplicate seed inventory');
const asset=w.livingAssets.find(a=>a.id===planted.assetId);
assert(asset,'planting creates a stateful living asset');
assert.equal(asset.ownerId,'juan');
assert.equal(asset.originPropaguleUnitId,seedUnitId);
assert(asset.maturity<0,'newly planted seed/cutting must spend real germination/rooting time before normal crop maturity');

const crop=seeds.PROPAGULE_CATALOG[outerSeed];
asset.maturity=crop.maturityDays-1;
const outputBefore=w.actors.juan.inventory.filter(u=>u.kind===crop.output).length;
w=advanceHarbourWindow(w);
assert(w.actors.juan.inventory.filter(u=>u.kind===crop.output).length>outputBefore,'seed-grown living asset must eventually create its authored crop output');
assert(!Object.values(w.actors).some(a=>a.inventory?.some(u=>u.unitId===seedUnitId)),'consumed propagule must never reappear after harvest');

console.log('PASS: route distance controls propagules; physical seeds/cuttings are consumed into living crops');