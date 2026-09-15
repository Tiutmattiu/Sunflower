import assert from 'node:assert/strict';
import {createHarbourWorld} from '../src/harbourSpine.js';
import * as risk from '../src/socialRiskEconomy.js';

let w=createHarbourWorld(101,{attentionPerDay:99});
risk.initializeSocialRisk(w);

// Existing Aspen/Yasmin gift commerce should use the economic organs already designed:
// Yasmin sells the luxury object, Wong handles the private parcel, Dima can broker settlement.
w.relationshipEcology.gifts.push({
 id:'private-gift-test',ownerId:'aspen',recipientId:'offscreen_support',contents:'Silk Twill Scarf, Hand-Rolled Hem',purchaseSellerId:'yasmin',purchasePrice:7,createdDay:w.day,dueDay:w.day+3,status:'in_transit',privacy:true,custodianId:null,settlementAgentId:'dima',identityResolved:false,
});
risk.reconcilePrivateGiftRoutes(w);
const gift=w.relationshipEcology.gifts.find(g=>g.id==='private-gift-test');
assert.equal(gift.custodianId,'wong','private delivery still uses Wong’s real custody/courier business');
assert.equal(gift.settlementAgentId,'dima','Dima may broker the discreet settlement without replacing the courier');
assert.equal(gift.contentsKnownToWong,false,'private custody does not give Wong omniscient contents');

// Aspen may ask the player to keep nosy Wong occupied. This is a bounded favour, not a vending-machine repair fee.
const request=risk.createAspenPrivacyRequest(w,gift.id);
assert.equal(request.ok,true,request.reason);
const beforeSuspicion=w.socialRisk.wong.suspicion;
const beforeRelation=w.socialRisk.playerRelations.wong;
const result=risk.performAspenPrivacyFavor(w,request.requestId,{method:'conversation'});
assert.equal(result.ok,true,result.reason);
assert.equal(w.socialRisk.aspenFavors.filter(f=>f.status==='available').length,1,'helping Aspen creates one contextual favour');
assert(w.socialRisk.wong.suspicion>beforeSuspicion,'distracting a nosy courier has a social cost');
assert(w.socialRisk.playerRelations.wong<beforeRelation,'the privacy favour cannot be free of Wong relationship consequences');
assert.equal(gift.privacyProtected,true);
assert.equal(gift.contentsKnownToWong,false);

// A louder diversion is possible but increases suspicion more than ordinary distraction.
let w2=createHarbourWorld(102,{attentionPerDay:99});risk.initializeSocialRisk(w2);
w2.relationshipEcology.gifts.push({id:'gift-smoke',ownerId:'aspen',recipientId:'offscreen_support',contents:'Beaded Evening Bag',purchaseSellerId:'yasmin',purchasePrice:8,createdDay:0,dueDay:3,status:'in_transit',privacy:true,custodianId:'wong',settlementAgentId:'dima'});
const req2=risk.createAspenPrivacyRequest(w2,'gift-smoke');
const quietStart=w2.socialRisk.wong.suspicion;
risk.performAspenPrivacyFavor(w2,req2.requestId,{method:'smoke'});
assert(w2.socialRisk.wong.suspicion>=quietStart+2,'smoke diversion should be materially more suspicious than ordinary conversation');

// Suspicion alone is not enough for police retaliation. Wong needs reportable evidence he could actually know.
risk.processWongRetaliation(w2);
assert.equal(w2.socialRisk.authorityReports.length,0,'Wong cannot report a crime from vibes alone');

// Publicly discovered misconduct is legitimately knowable; with high suspicion Wong may choose to report it.
w2.production.misconduct.push({day:w2.day,kind:'public_listing_fraud',evidenceId:'public-fraud-proof',discovered:true});
w2.evidence.push({id:'public-fraud-proof',day:w2.day,type:'public_misstatement_discovered',public:true,actorId:'player'});
w2.socialRisk.wong.suspicion=5;
risk.observeReportablePlayerConduct(w2);
risk.processWongRetaliation(w2);
assert.equal(w2.socialRisk.authorityReports.length,1,'high suspicion plus actual knowable misconduct can produce a Wong report');
assert.equal(w2.socialRisk.authorityReports[0].reporterId,'wong');
assert.equal(w2.socialRisk.authorityReports[0].evidenceId,'public-fraud-proof');
assert.equal(w2.socialRisk.authorityReports[0].status,'filed');

// Aspen favour tokens are real and one-use; other systems can consume them without knowing how they were earned.
const token=w.socialRisk.aspenFavors.find(f=>f.status==='available');
assert.equal(risk.consumeAspenFavor(w,'onewheel_adjustment').ok,true);
assert.equal(token.status,'used');
assert.equal(risk.consumeAspenFavor(w,'second_use').ok,false,'one favour cannot be farmed repeatedly');

console.log('PASS: Aspen private luxury delivery uses Wong custody, creates bounded favours, and Wong retaliation requires knowable evidence');