// Targeted design regression smoke. No test framework / CI required.
import assert from "node:assert/strict";
import {
  acceptInboundOffer,
  advancePhase,
  buildEvents,
  buildInboundOffers,
  createGame,
  giveItem,
  informationPrice,
  publiclyKnownPlayerItems,
  repayObligation,
  requestMarketProxy,
  resolveEvent,
  resolveNoonMarket,
  shareInformationAsFavor,
} from "../src/gameEngine.js";
import { sellerAsk } from "../src/npcAI.js";

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
assert(game.learningNotes.some((note) => note.id === "relationship-capital"));

// A physical gift is also a non-market allocation path.
game = enterMorning();
const dogRelationship = game.relationships.dog;
game = giveItem(game, "dog", "Chia Seeds");
assert(game.relationships.dog > dogRelationship);
assert(!game.traders.player.inventory.includes("Chia Seeds"));
assert(game.traders.dog.inventory.includes("Chia Seeds"));
assert(game.learningNotes.some((note) => note.id === "gift-economy"));

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

console.log("Living systems smoke passed.");
