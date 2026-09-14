import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import {
  createSecuredClaim,
  settleSecuredClaims,
  sourceState,
  recordSourceDiscovery,
} from '../src/npcEconomy.js';

let w=createHarbourWorld(41,{attentionPerDay:99});
assert(w.npcEconomy,'fresh world must initialise named-NPC economy state');
assert(w.sourceBook,'fresh world must initialise causal source state');

const collateral=w.actors.player.inventory.find(u=>u.kind==='Fresh Mackerel');
assert(collateral,'fixture needs one physical collateral unit');
const playerCash=w.actors.player.cash,yasminCash=w.actors.yasmin.cash;
let result=createSecuredClaim(w,{borrowerId:'player',lenderId:'yasmin',collateralUnitId:collateral.unitId,principal:5,face:6,dueDay:w.day+2,purpose:'test_secured'});
assert.equal(result.ok,true,result.reason);
assert.equal(w.actors.player.cash,playerCash+5);
assert.equal(w.actors.yasmin.cash,yasminCash-5);
assert.equal(collateral.pledgedTo,'yasmin');
assert.equal(w.claims.find(c=>c.id===result.claimId)?.status,'open');

const duplicate=createSecuredClaim(w,{borrowerId:'player',lenderId:'dima',collateralUnitId:collateral.unitId,principal:2,face:3,dueDay:w.day+1,purpose:'double_pledge'});
assert.equal(duplicate.ok,false,'same physical unit must not be pledged twice');

w.actors.player.cash+=6;
const claim=w.claims.find(c=>c.id===result.claimId);
claim.dueDay=w.day;
settleSecuredClaims(w);
assert.equal(claim.status,'settled');
assert.equal(collateral.pledgedTo,null,'repayment releases collateral');
assert.equal(collateral.owner,'player');

const second=w.actors.player.inventory.find(u=>u.kind==='Lime');
const dimaBefore=w.actors.dima.inventory.length;
result=createSecuredClaim(w,{borrowerId:'player',lenderId:'dima',collateralUnitId:second.unitId,principal:3,face:99,dueDay:w.day,purpose:'test_default'});
assert.equal(result.ok,true,result.reason);
w.actors.player.cash=0;
settleSecuredClaims(w);
const defaulted=w.claims.find(c=>c.id===result.claimId);
assert.equal(defaulted.status,'default');
assert.equal(second.owner,'dima','default transfers the pledged unit to lender');
assert.equal(w.actors.dima.inventory.length,dimaBefore+1,'default transfers exactly one unit');
assert(!w.actors.player.inventory.some(u=>u.unitId===second.unitId),'borrower no longer owns defaulted collateral');

assert.equal(sourceState(w,'Mezcal').status,'UNKNOWN');
recordSourceDiscovery(w,'outer',['Mezcal'],{returned:false});
assert.equal(sourceState(w,'Mezcal').status,'SOURCE_LOCATED');
recordSourceDiscovery(w,'outer',['Mezcal'],{returned:true});
assert.equal(sourceState(w,'Mezcal').status,'LOCALLY_AVAILABLE');
assert.equal(sourceState(w,'Mezcal').successfulReturns,1);

console.log('PASS: shared claims, collateral and source progression conserve ownership and state');
