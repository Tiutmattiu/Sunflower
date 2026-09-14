import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import {investWongAsset,financeWongAsset,runWongBusinessDay,WONG_ASSETS} from '../src/npcEconomy.js';

let w=createHarbourWorld(41,{attentionPerDay:99});
const b=w.wongBusiness;
assert(b,'Wong enterprise state must exist');
assert.equal(b.stage,'counter');
assert.equal(b.landlordId,'dima');
assert.equal(b.rentArrears,0);
assert(WONG_ASSETS.storage_racks?.residualValue>0,'productive asset needs residual value');

// Self-funded expansion consumes Wong's real cash and creates one persistent asset.
w.actors.wong.cash=30;
const wongBefore=w.actors.wong.cash;
let r=investWongAsset(w,'storage_racks');
assert.equal(r.ok,true,r.reason);
assert.equal(w.actors.wong.cash,wongBefore-WONG_ASSETS.storage_racks.cost);
assert.equal(b.fixedAssets.filter(a=>a.assetId==='storage_racks').length,1);
assert(b.serviceCapacity>3,'storage asset must change future operating capacity');
assert.equal(investWongAsset(w,'storage_racks').ok,false,'same fixed asset cannot be duplicated');

// Rent is a real Wong -> Dima cash transfer.
w.day=b.rentDueDay;
w.actors.wong.cash=20;
const dimaCash=w.actors.dima.cash,wongCash=w.actors.wong.cash;
runWongBusinessDay(w,{forceDemand:0});
assert.equal(w.actors.dima.cash,dimaCash+b.rentAmount);
assert.equal(w.actors.wong.cash,wongCash-b.rentAmount-b.dailyCost,'rent and operating cost leave actual Wong cash');
assert(w.privateTransactions.some(t=>t.kind==='shop_rent'&&t.from==='wong'&&t.to==='dima'));

// If he cannot cover rent, Wong does not go silently negative: arrears become an obligation.
w.day=b.rentDueDay;
w.actors.wong.cash=0;
const arrearsBefore=b.rentArrears;
runWongBusinessDay(w,{forceDemand:0});
assert(w.actors.wong.cash>=0);
assert(b.rentArrears>arrearsBefore,'unpaid rent becomes explicit arrears');
assert(w.claims.some(c=>c.type==='rent_arrears'&&c.issuerId==='wong'&&c.holderId==='dima'&&c.status==='open'));

// Dima equipment finance moves cash now and creates real repayment exposure.
let w2=createHarbourWorld(42,{attentionPerDay:99});
w2.actors.wong.cash=1;w2.actors.dima.cash=40;
const dimaBefore=w2.actors.dima.cash,wongBeforeFinance=w2.actors.wong.cash;
r=financeWongAsset(w2,'laundry_machine','dima');
assert.equal(r.ok,true,r.reason);
assert(w2.actors.dima.cash<dimaBefore,'Dima must actually fund equipment');
assert(w2.actors.wong.cash>=wongBeforeFinance,'financing reaches Wong before asset purchase');
assert(w2.wongBusiness.fixedAssets.some(a=>a.assetId==='laundry_machine'));
const financeClaim=w2.claims.find(c=>c.id===r.claimId);
assert(financeClaim&&financeClaim.status==='open'&&financeClaim.holderId==='dima');
assert.equal(financeClaim.type,'productive_asset_finance');

// Higher productive capacity produces bounded service revenue paid by real customer cash.
const householdBefore=w2.actors.households.cash,wongBeforeDay=w2.actors.wong.cash;
w2.day+=1;
runWongBusinessDay(w2,{forceDemand:3,skipRent:true});
assert(w2.actors.wong.cash>wongBeforeDay-w2.wongBusiness.dailyCost,'service work can earn revenue after costs');
assert(w2.actors.households.cash<householdBefore,'service revenue comes from a payer, not minting');
assert(w2.wongBusiness.dailyRevenue>0);

console.log('PASS: Wong enterprise uses productive assets, real rent, bounded service demand and Dima finance');
