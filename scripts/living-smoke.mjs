// Targeted design regression smoke. No test framework / CI required.
import assert from "node:assert/strict";
import {
  acceptFutureDelivery,
  acceptInboundOffer,
  advancePhase,
  buildEvents,
  buildInboundOffers,
  createGame,
  fulfillFutureDelivery,
  giveItem,
  informationPrice,
  performFreeAction,
  playerVisibleKnowledge,
  publiclyKnownPlayerItems,
  repayObligation,
  requestRelationshipLoan,
  requestSecuredLoan,
  requestMarketProxy,
  resolveEvent,
  resolveDuePrivateMatter,
  resolveNoonMarket,
  shareInformationAsFavor,
  sellInformation,
  sellInformationExclusive,
} from "../src/gameEngine.js";
import { sellerAsk } from "../src/npcAI.js";
import { readFileSync } from "node:fs";

function enterMorning(game = createGame()) {
  return advancePhase(game);
}

// The world notices the player: Dog can see the Fish Bones the outsider is visibly carrying.
let game = enterMorning();
assert(publiclyKnownPlayerItems(game).includes("Fish Bones"));
const dogOffer = game.inboundOffers.find((offer) => offer.kind === "buy-item" && offer.buyerId === "dog" && offer.item === "Fish Bones");
assert(dogOffer, "Day 1 should contain a causally justified inbound offer from Dog for visible Fish Bones");
const beforeCash = game.traders.player.sardines;
game = acceptInboundOffer(game, dogOffer.id);
assert.equal(game.inboundOffers.find((offer) => offer.id === dogOffer.id).status, "accepted");
assert(game.marketPlan.some((order) => order.from === "dog" && order.to === "player" && order.wantItem === "Fish Bones"));
game = giveItem(game, "bar", "Chia Seeds");
assert(game.marketPlan.some((order) => order.inboundOfferId === dogOffer.id), "later Morning replanning must preserve an accepted inbound commitment");
game = advancePhase(game);
game = resolveNoonMarket(game);
assert(game.traders.dog.inventory.includes("Fish Bones"));
assert(!game.traders.player.inventory.includes("Fish Bones"));
assert(game.traders.player.sardines > beforeCash);

// Information is worth more when precise/exclusive and decays as it spreads.
game = enterMorning();
game.information.push({
  id: "manual-lead",
  claimType: "holding",
  subjectId: "mechanic",
  item: "Sperm Whale Oil",
  text: "Sailor has Sperm Whale Oil below deck.",
  source: "personal investigation",
  precision: "exact",
  confidence: "high",
  observedDay: 1,
  freshness: "current",
  exclusive: true,
  sellable: true,
  soldTo: [],
  sharedWith: [],
  knownBy: ["player"],
  diffusionCount: 0,
  personallyVerified: true,
});
const lead = game.information.find((info) => info.id === "manual-lead");
const exclusivePrice = informationPrice(game, lead, "vale");
lead.knownBy.push("dog", "bar");
lead.diffusionCount = 2;
lead.exclusive = false;
const spreadPrice = informationPrice(game, lead, "vale");
assert(exclusivePrice > spreadPrice, "information should lose resale value as it diffuses");

// Giving information as a favour converts information into relationship capital instead of cash.
lead.knownBy = ["player"];
lead.diffusionCount = 0;
lead.exclusive = true;
const valeRelationship = game.relationships.vale;
game = shareInformationAsFavor(game, lead.id, "vale");
assert.equal(game.relationships.vale, valeRelationship + 1);
const relationshipNote = game.learningNotes.find((note) => note.id === "relationship-capital");
assert(relationshipNote.occurrences[0].evidenceIds.every((id) => game.decisionEvidence.some((entry) => entry.id === id)));

// A physical gift is also a non-market allocation path.
game = enterMorning();
const dogRelationship = game.relationships.dog;
game = giveItem(game, "dog", "Chia Seeds");
assert(game.relationships.dog > dogRelationship);
assert(!game.traders.player.inventory.includes("Chia Seeds"));
assert(game.traders.dog.inventory.includes("Chia Seeds"));
game = giveItem(game, "dog", "Fish Bones");
assert.equal(game.learningNotes.filter((note) => note.id === "gift-economy").length, 1);
assert.equal(game.learningNotes.find((note) => note.id === "gift-economy").occurrences.length, 2);

// Onewheel production now uses actual bicycle parts; Lime remains provisioning, not a magic repair ingredient.
game = enterMorning();
game.traders.mechanic.inventory = game.traders.mechanic.inventory.filter((item) => !["Built Onewheel", "Steel Rim", "Handlebar Tape"].includes(item));
game.traders.mechanic.inventory.push("Chain Quick-Link", "Brake Cable", "Tiny Torque Wrench", "Handlebar Tape");
game.traders.player.inventory.push("Steel Rim");
game = giveItem(game, "mechanic", "Steel Rim");
assert(game.traders.mechanic.inventory.includes("Built Onewheel"), "complete bicycle parts should produce a working onewheel");
assert(!game.traders.mechanic.inventory.includes("Steel Rim"));
assert(game.traders.mechanic.inventory.includes("Tiny Torque Wrench"), "durable tool should not be consumed as a part");

// Broad inbound generation remains bounded rather than becoming another dashboard flood.
game = enterMorning();
assert(buildInboundOffers(game, "morning").length <= 2);

// World production is caused by holdings, not player quest credit.
game = enterMorning();
game = advancePhase(game);
game.marketPlan = [
  { from: "bar", to: "fishmonger", wantItem: "Orgeat Bottle", sardines: sellerAsk(game, "fishmonger", "Orgeat Bottle") },
  { from: "vale", to: "mechanic", wantItem: "Sperm Whale Oil", sardines: sellerAsk(game, "mechanic", "Sperm Whale Oil") },
  { from: "mechanic", to: "fishmonger", wantItem: "Steel Rim", sardines: sellerAsk(game, "fishmonger", "Steel Rim") },
];
game.traders.mechanic.inventory.push("Handlebar Tape");
game = resolveNoonMarket(game);
assert(game.traders.bar.inventory.includes("Mai Tai"), "NPC-delivered Orgeat should complete the real Bar recipe");
assert(!["Rum Bottle", "Lime Crate", "Orange Curaçao", "Orgeat Bottle"].some((item) => game.traders.bar.inventory.includes(item)), "Mai Tai production must consume its ingredient copies");
assert(game.traders.mechanic.inventory.includes("Built Onewheel"), "NPC-delivered parts should complete the mechanical recipe");
assert.equal(game.worldThreads.valeScreening.stage, "outcome");
assert.equal(game.stats.tradeCount, 0, "NPC world consequences must not become player statistics");
assert(game.decisionEvidence.some((entry) => entry.type === "world-consequence" && entry.thread === "barRecipe"));
assert(game.decisionEvidence.some((entry) => entry.type === "public-market-trade" && entry.channel === "public"));
game = advancePhase(game);
game = advancePhase(game);
game = advancePhase(game);
assert.equal(game.worldThreads.valeScreening.stage, "aftermath");
assert(!game.traders.vale.inventory.includes("Sperm Whale Oil"), "the screening must consume its obsolete fuel");
game.traders.player.inventory.push("Blue Glass Marble");
game.traders.player.sardines = 80;
assert(buildEvents(game).some((event) => event.id === "auction"), "missing the oil trade must not close the later Capital route");

// Information can be resold through an established bilateral network without global broadcast.
game = createGame();
game.phase = "sunset";
game.information.push({
  id: "resale-lead", claimType: "holding", subjectId: "bar", item: "Lime Crate", text: "Bar has fresh limes.",
  source: "private trade", precision: "exact", confidence: "high", observedDay: 1, freshness: "current", exclusive: false,
  sellable: true, soldTo: ["vale"], sharedWith: [], knownBy: ["player", "vale"], diffusionCount: 1, personallyVerified: false,
});
game = advancePhase(game);
assert(game.informationTrades.some((trade) => trade.from === "vale" && trade.to === "mechanic"));
assert(game.decisionEvidence.some((entry) => entry.type === "information-resold" && entry.channel === "private"));
assert(game.npcMemory.mechanic.knownHoldings["Lime Crate"]);
assert(!game.information[0].knownBy.includes("dog"), "private resale must not globally broadcast the lead");

// Credit preserves a form, repayment repairs trust, and default damages it.
game = createGame();
game.phase = "sunset";
game.relationships.bar = 2;
game.traders.player.sardines = 0;
game.traders.player.inventory = [];
game = advancePhase(game);
const mealDebt = game.obligations.find((obligation) => obligation.kind === "meal-credit");
assert(mealDebt && game.playerState.form === "human");
game = advancePhase(game);
game.traders.player.sardines = 1;
const beforeRepayRelationship = game.relationships.bar;
game = repayObligation(game, mealDebt.id);
assert.equal(game.obligations.find((obligation) => obligation.id === mealDebt.id).status, "settled");
assert.equal(game.relationships.bar, beforeRepayRelationship + 1);
assert.equal(game.learningNotes.find((note) => note.id === "credit").occurrences.length, 2, "credit creation and repayment should share one concept card");

game = createGame();
game.phase = "sunset";
game.relationships.bar = 2;
game.traders.player.sardines = 0;
game.traders.player.inventory = [];
game = advancePhase(game);
const defaultDebt = game.obligations.find((obligation) => obligation.kind === "meal-credit");
game.day = defaultDebt.dueDay;
game.phase = "sunset";
game.traders.player.inventory = ["Chia Seeds"];
const beforeDefaultRelationship = game.relationships.bar;
game = advancePhase(game);
assert.equal(game.obligations.find((obligation) => obligation.id === defaultDebt.id).status, "overdue");
assert.equal(game.relationships.bar, beforeDefaultRelationship - 1);

game = enterMorning();
game.playerState.form = "animal";
game.playerState.legalIdentity.status = "unrecognized";
game.relationships.bar = 2;
game = requestMarketProxy(game, "bar");
assert(game.playerState.proxyAccess.some((access) => access.venueId === "formalMarket"));

// Same-name perishables age once per day per physical copy.
game = createGame();
game.phase = "sunset";
game.traders.vale.inventory.push("Bruised Mint", "Bruised Mint");
game = advancePhase(game);
assert.equal(game.traders.vale.inventory.filter((item) => item === "Bruised Mint").length, 2);
game.phase = "sunset";
game = advancePhase(game);
assert.equal(game.traders.vale.inventory.filter((item) => item === "Bruised Mint").length, 0);

// A perishable copy keeps its age when ownership changes.
game = enterMorning();
game.perishTimer["bar:Bruised Mint"] = [1];
game.playerOrders[0] = { to: "bar", wantItem: "Bruised Mint", offerItem: "", sardines: sellerAsk(game, "bar", "Bruised Mint") };
game = advancePhase(game);
const commitment = game.decisionEvidence.find((entry) => entry.type === "market-order-committed");
assert.equal(commitment.channel, "public");
assert(Array.isArray(commitment.openingInventory));
game = resolveNoonMarket(game);
assert.deepEqual(game.perishTimer["player:Bruised Mint"], [1]);
const marketResult = game.decisionEvidence.find((entry) => entry.type === "market-order-outcome" && entry.outcome === "filled");
assert.equal(marketResult.channel, "public");

// Every route shares the same non-ending reveal; route inputs are actually used.
game = createGame();
game.traders.player.inventory.push("Mai Tai", "Fresh Mackerel");
game.pendingEvents = [{ id: "grandma" }];
game = resolveEvent(game, "grandma", "Go");
assert(game.traders.player.inventory.includes("Sunflower"));
assert(!game.traders.player.inventory.includes("Mai Tai") && !game.traders.player.inventory.includes("Fresh Mackerel"));
assert.equal(game.objective, "Go home");
assert.equal(game.ended, false);

// Life end is a factual recap state, not an obsolete counter-based archetype.
game = createGame();
game.day = game.maxDays;
game.phase = "sunset";
game = advancePhase(game);
assert.equal(game.ended, true);
assert.equal(game.style, null);

// Normal player UI has an opening, a reopenable grammar note, and no raw engine log.
const appSource = readFileSync(new URL("../src/AppCore.jsx", import.meta.url), "utf8");
const mainSource = readFileSync(new URL("../src/main.jsx", import.meta.url), "utf8");
assert(!appSource.includes("game.log"), "normal UI must not render raw engine logs");
assert(appSource.includes("HOW THIS WORKS") && mainSource.includes("You want a sunflower."));
game = createGame();
game.log.unshift("PRIVATE ENGINE FACT");
assert(!JSON.stringify(playerVisibleKnowledge(game)).includes("PRIVATE ENGINE FACT"));

// Talk gains at most once per target/day and exhausted authored stages do not farm relationship.
game = enterMorning();
game = performFreeAction(game, "talk", "dog");
game = performFreeAction(game, "talk", "dog");
assert.equal(game.relationships.dog, 1);
for (let day = 2; day <= 4; day += 1) {
  game.day = day; game.phase = "morning"; game.actionsRemaining = 1;
  game = performFreeAction(game, "talk", "dog");
}
assert.equal(game.relationships.dog, 2, "Dog has only three authored stages and Day 1 already consumed two of them");

// Promise Lime without owning it, source the exact physical good, deliver, and earn the idempotent badge.
game = enterMorning();
game = performFreeAction(game, "talk", "mechanic");
game = performFreeAction(game, "talk", "mechanic");
game = advancePhase(game); game = resolveNoonMarket(game); game = advancePhase(game);
game = acceptFutureDelivery(game);
const future = game.obligations.find((entry) => entry.kind === "future-delivery");
assert(future && !future.ownedAtCommitment);
game = advancePhase(game); game = advancePhase(game); game = advancePhase(game);
game.playerOrders[0] = { to: "bar", wantItem: "Lime Crate", offerItem: "", sardines: sellerAsk(game, "bar", "Lime Crate") };
game = advancePhase(game); game = resolveNoonMarket(game); game = advancePhase(game);
assert(game.traders.player.inventory.includes("Lime Crate"));
game = fulfillFutureDelivery(game, future.id);
assert.equal(game.obligations.find((entry) => entry.id === future.id).status, "settled");
assert.equal(game.badges.filter((badge) => badge.id === "sold-before-owned").length, 1);

// Future default returns the reserve and creates restitution without ending the game.
game = enterMorning();
game.information.push(
  { id: "lime-source", claimType: "holding", subjectId: "bar", item: "Lime Crate", precision: "exact", confidence: "high", freshness: "current", observedDay: 1, knownBy: ["player"] },
  { id: "lime-need", claimType: "need", subjectId: "mechanic", item: "Lime Crate", precision: "exact", confidence: "high", freshness: "current", observedDay: 1, knownBy: ["player"] },
);
game = acceptFutureDelivery(game);
const failedFuture = game.obligations.find((entry) => entry.kind === "future-delivery");
game.day = failedFuture.dueDay; game.phase = "sunset"; game.actionsRemaining = 0;
game = resolveDuePrivateMatter(game, failedFuture.id, "default");
assert.equal(game.obligations.find((entry) => entry.id === failedFuture.id).status, "defaulted");
assert(game.obligations.some((entry) => entry.kind === "restitution" && entry.amount === 5));
assert.equal(game.ended, false);

// Bar allows one relationship-backed exposure at a time.
game = enterMorning(); game.relationships.bar = 2;
game = requestRelationshipLoan(game);
assert.equal(game.traders.player.sardines, 22);
const once = game.obligations.length;
game.actionsRemaining = 1;
game = requestRelationshipLoan(game);
assert.equal(game.obligations.length, once);

// Vale holds the exact collateral outside inventory, returns it on repayment, or keeps it with no residual debt.
game = enterMorning(); game.relationships.vale = 1; game.traders.player.inventory.push("Brass Compass");
game = requestSecuredLoan(game, "Brass Compass");
let secured = game.obligations.find((entry) => entry.kind === "secured-loan");
assert(!game.traders.player.inventory.includes("Brass Compass"));
game.traders.player.sardines = secured.amount; game.actionsRemaining = 1;
game = repayObligation(game, secured.id);
assert(game.traders.player.inventory.includes("Brass Compass"));
game = enterMorning(); game.relationships.vale = 1; game.traders.player.inventory.push("Brass Compass");
game = requestSecuredLoan(game, "Brass Compass"); secured = game.obligations.find((entry) => entry.kind === "secured-loan");
game.day = secured.dueDay; game.phase = "sunset"; game = resolveDuePrivateMatter(game, secured.id, "seize");
assert(game.traders.vale.inventory.includes("Brass Compass"));
assert.equal(game.obligations.find((entry) => entry.id === secured.id).status, "seized");

// Exclusivity rewards compliant causal use; breach has no instant penalty but causal public use can expose it.
function exclusiveLead(id, item) {
  return { id, claimType: "holding", subjectId: "mechanic", item, text: `Sailor has ${item}.`, source: "personal investigation", precision: "exact", confidence: "high", observedDay: 1, freshness: "current", exclusive: true, sellable: true, soldTo: [], sharedWith: [], knownBy: ["player"], diffusionCount: 0, personallyVerified: true };
}
game = enterMorning(); game.information.push(exclusiveLead("exclusive-oil", "Sperm Whale Oil"));
game = sellInformationExclusive(game, "exclusive-oil", "vale");
game = advancePhase(game); game = resolveNoonMarket(game); game = advancePhase(game); game = advancePhase(game); game = advancePhase(game); game = advancePhase(game); game = advancePhase(game); game = resolveNoonMarket(game);
assert(game.badges.some((badge) => badge.id === "exclusive"));

game = enterMorning(); game.traders.mechanic.inventory.push("Sealed Parcel"); game.information.push(exclusiveLead("exclusive-parcel", "Sealed Parcel"));
game = sellInformationExclusive(game, "exclusive-parcel", "clown");
game = advancePhase(game); game = resolveNoonMarket(game); game = advancePhase(game);
const beforeDetection = game.relationships.clown;
game = sellInformation(game, "exclusive-parcel", "vale");
assert.equal(game.relationships.clown, beforeDetection, "breach alone must not punish instantly");
game.traders.mechanic.inventory = game.traders.mechanic.inventory.filter((item) => item !== "Sperm Whale Oil");
game = advancePhase(game); game = advancePhase(game); game = advancePhase(game); game = advancePhase(game); game = resolveNoonMarket(game);
assert.equal(game.relationships.clown, beforeDetection - 2);

// Raw evidence records action context and deliberately unused phase time.
game = enterMorning();
game = performFreeAction(game, "investigate", "vale");
const investigation = game.decisionEvidence.find((entry) => entry.type === "investigate");
assert.equal(investigation.actionsBefore, 2); assert.equal(investigation.actionsAfter, 1); assert.equal(investigation.relationshipBefore, investigation.relationshipAfter);
game = advancePhase(game);
assert(game.decisionEvidence.some((entry) => entry.type === "phase-ended-with-unused-actions" && entry.phase === "morning" && entry.unusedActions === 1));

console.log("Living systems smoke passed.");
