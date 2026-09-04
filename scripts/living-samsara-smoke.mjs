import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  acceptFutureDelivery, advancePhase, applyLateOrderEdit, buyJuanClaim, createGame, economicSnapshot,
  fulfillFutureDelivery, performFreeAction, playerVisibleKnowledge, requestMarketProxy, resistSunMoment,
  resolveDuePrivateMatter, resolveNoonMarket, sellInformationExclusive,
} from "../src/gameEngine.js";
import { INITIAL_TRADERS, ITEMS } from "../src/gameData.js";
import { sellerAsk } from "../src/npcAI.js";

const ACTORS = ["wong", "aspen", "yasmin", "juan", "sterling", "dima", "octopus", "player"];
const OLD_IDS = ["dog", "mechanic", "vale", "clown", "bar", "fishmonger"];
const morning = (game = createGame()) => advancePhase(game);

function closeDay(game) {
  if (game.phase === "sunrise") game = advancePhase(game);
  if (game.phase === "morning") game = advancePhase(game);
  if (game.phase === "noon" && !game.marketResolved) game = resolveNoonMarket(game);
  if (game.phase === "noon") game = advancePhase(game);
  if (game.phase === "afternoon") game = advancePhase(game);
  for (const matter of [...(game.claims || []), ...(game.obligations || [])].filter((entry) => entry.status === "open" && entry.currentHolderId === "player" && entry.dueDay <= game.day)) game = resolveDuePrivateMatter(game, matter.id, matter.extensionCount < 1 ? "extend" : "collect");
  if (game.phase === "sunset") game = advancePhase(game);
  return game;
}

assert.deepEqual(Object.keys(INITIAL_TRADERS).sort(), [...ACTORS].sort());
assert(OLD_IDS.every((id) => !Object.hasOwn(INITIAL_TRADERS, id)));
assert.equal(INITIAL_TRADERS.dima.form, "animal");
assert.equal(INITIAL_TRADERS.dima.sardines, 18);
assert.equal(INITIAL_TRADERS.juan.sardines, 8);
assert.equal(INITIAL_TRADERS.juan.inventory.filter((item) => item === "Nursery Seed Packet").length, 2);
assert(!Object.hasOwn(ITEMS, "Two Octopus Tentacles"));
assert.deepEqual(ITEMS["Sea Urchin Basket"], { value: 9, icon: "🦔", type: "Food / Seafood / Harbour Good", foodUnits: 1, shelfLife: 2 });

const appSource = readFileSync(new URL("../src/AppCore.jsx", import.meta.url), "utf8");
assert(!appSource.includes('className="intel-note"'));
assert(appSource.includes("Saved to Notebook.") && appSource.includes("Source:") && appSource.includes("More actions"));

let game = morning();
game.marketPlan = [];
game.playerOrders = [
  { to: "wong", wantItem: "Glasses Wipe", offerItem: "", sardines: sellerAsk(game, "wong", "Glasses Wipe") },
  { to: "wong", wantItem: "Pocket Match", offerItem: "Glasses Wipe", sardines: 0 },
];
game = advancePhase(game);
game = resolveNoonMarket(game);
assert.equal(game.marketOutcome.length, 1, "same-batch recycling must remain impossible");
assert.equal(game.settlementFloat, 0);
assert.equal(game.clearingBatches.length, 1);
assert.equal(game.clearingBatches[0].settledBy, "octopus");
assert(game.clearingBatches[0].reconciled && game.clearingBatches[0].settlementFloat === 0);
assert.deepEqual(resolveNoonMarket(game), game, "Noon settles exactly once");

game = createGame();
game.phase = "sunset";
game.traders.sterling.inventory.push("Ice Block");
game.perishTimer["sterling:Ice Block"] = [0];
game = advancePhase(game);
assert(game.recurringLedger.some((entry) => entry.actorId === "sterling" && entry.category === "outside-service-revenue" && entry.inputUsed === "Ice Block" && entry.amount === 5));
assert(!game.decisionEvidence.some((entry) => entry.traderId === "sterling" && entry.item === "Ice Block" && entry.consequence === "perished"));

game = createGame();
game.maxDays = 42;
while (!game.ended) game = closeDay(game);
const recurring = (actor, category) => game.recurringLedger.filter((entry) => entry.actorId === actor && entry.category === category);
assert(recurring("aspen", "voyage-departure").length >= 2 && recurring("aspen", "voyage-return").length >= 2);
assert(recurring("wong", "household-support-burn").length === 42 && recurring("wong", "labour-produced-salvage").length >= 20 && recurring("wong", "odd-job-income").length >= 20);
assert(recurring("sterling", "outside-service-revenue").length === 42 && recurring("sterling", "business-input").length > 0);
assert(recurring("yasmin", "social-position-maintenance").length >= 10 && recurring("yasmin", "outside-capital-family-yield").length > 0);
assert(recurring("juan", "planting").length >= 2 && recurring("juan", "crop-maturity").length >= 2 && game.traders.juan.inventory.every((item) => item !== "Nursery Seed Packet" || ITEMS[item].foodUnits !== 1));
assert(recurring("octopus", "physical-arrival").length > 0 && recurring("octopus", "outside-sale").length > 0);
assert(game.clearingBatches.every((batch) => batch.settledBy === "octopus" && batch.reconciled && batch.settlementFloat === 0));
assert(game.claims.every((claim) => !claim.knownByPlayer), "Yasmin and other NPCs must not gain omniscient claim knowledge");

game = createGame();
game.systemMarkers.sterlingServiceCycles = 2;
game.traders.sterling.inventory = game.traders.sterling.inventory.filter((item) => item !== "Rum Bottle");
game.traders.sterling.sardines = 0;
game.phase = "sunset";
game = advancePhase(game);
assert(game.recurringDemands.some((entry) => entry.actorId === "sterling" && entry.item === "Rum Bottle"));
assert(game.recurringLedger.some((entry) => entry.actorId === "sterling" && entry.category === "family-subsidy" && entry.amount === 6));

game = morning();
game.playerState.form = "animal";
game.playerState.legalIdentity.status = "unrecognized";
const dimaCash = game.traders.dima.sardines;
game = requestMarketProxy(game, "dima");
assert.equal(game.traders.player.sardines, 15);
assert.equal(game.traders.dima.sardines, dimaCash + 3);
assert(game.playerState.proxyAccess.some((entry) => entry.via === "dima"));

game = morning();
game.claims.find((claim) => claim.id === "juan-dima-roll").knownByPlayer = true;
game = buyJuanClaim(game, "juan-dima-roll");
assert.equal(game.claims.find((claim) => claim.id === "juan-dima-roll").currentHolderId, "player");
assert.equal(game.decisionEvidence.find((entry) => entry.type === "claim-transferred").fee, 0, "Dima must not double-charge while selling his own claim");
assert(!game.recurringLedger.some((entry) => entry.actorId === "dima" && entry.category === "brokerage-fee"));

game = morning();
game.claims.find((claim) => claim.id === "juan-sterling-tab").knownByPlayer = true;
const brokerStart = game.traders.dima.sardines;
game = buyJuanClaim(game, "juan-sterling-tab");
assert.equal(game.traders.dima.sardines, brokerStart + 1);
const claim = game.claims.find((entry) => entry.id === "juan-sterling-tab");
assert.deepEqual(Object.keys(claim).filter((key) => ["id", "debtorId", "currentHolderId", "creditorId", "faceAmount", "dueDay", "status", "tag", "linkedProductiveAsset", "transferHistory", "evidenceIds", "extensionCount"].includes(key)).sort(), ["creditorId", "currentHolderId", "debtorId", "dueDay", "evidenceIds", "extensionCount", "faceAmount", "id", "linkedProductiveAsset", "status", "tag", "transferHistory"]);

game.day = claim.dueDay;
game.phase = "sunset";
game.traders.juan.sardines = claim.faceAmount;
game = resolveDuePrivateMatter(game, claim.id, "collect");
assert.equal(game.claims.find((entry) => entry.id === claim.id).status, "collected");

game = createGame();
let extended = game.claims.find((entry) => entry.id === "juan-dima-roll");
extended.knownByPlayer = true; extended.currentHolderId = "player"; extended.creditorId = "player"; extended.currentHolderLifeId = "life-1";
game.day = extended.dueDay; game.phase = "sunset";
game = resolveDuePrivateMatter(game, extended.id, "extend");
extended = game.claims.find((entry) => entry.id === extended.id);
assert.equal(extended.faceAmount, 11); assert.equal(extended.dueDay, 7); assert.equal(extended.extensionCount, 1);
game.day = extended.dueDay; game.phase = "sunset"; game.traders.juan.sardines = 0; game.crops.push({ id: "crop-liquidation", plantedDay: 5, maturityDay: 9, status: "growing", linkedAssetId: "juan-crop-cycle" });
game = resolveDuePrivateMatter(game, extended.id, "liquidate");
extended = game.claims.find((entry) => entry.id === extended.id);
assert.equal(extended.status, "impaired");
assert(game.decisionEvidence.some((entry) => entry.type === "claim-forced-liquidation" && entry.destroyedFutureValue > 0));

game = morning();
game = performFreeAction(game, "investigate", "octopus");
game = advancePhase(game);
assert.equal(game.sunMoment.eligible, false, "resistance must be absent without a pending public order");

game = morning();
game = performFreeAction(game, "investigate", "octopus");
game.playerOrders[0] = { to: "octopus", wantItem: "Fresh Mackerel", offerItem: "", sardines: sellerAsk(game, "octopus", "Fresh Mackerel") };
const committedNPCIntent = structuredClone(game.marketPlan);
game = advancePhase(game);
assert(game.sunMoment.eligible);
game = resistSunMoment(game);
game = applyLateOrderEdit(game, 0, { ...game.lockedPlayerOrders[0], sardines: game.lockedPlayerOrders[0].sardines + 1 });
assert(game.sunMoment.lateEditUsed && !game.sunMoment.lateEditAvailable);
assert.deepEqual(game.marketPlan, committedNPCIntent, "resistance must not reroll NPC commitments");
assert(!JSON.stringify(playerVisibleKnowledge(game)).includes("marketPlan"), "hidden NPC intent must remain hidden");
game = resolveNoonMarket(game);
assert.equal(game.sunMomentHistory.filter((entry) => entry.day === 1 && entry.moment === "noon" && entry.state === "resisted").length, 1);
assert.equal(game.decisionEvidence.filter((entry) => entry.type === "sun-moment-late-order-edit").length, 1);

game = createGame();
game.claims[0].knownByPlayer = true; game.claims[0].currentHolderId = "player"; game.claims[0].creditorId = "player"; game.claims[0].currentHolderLifeId = "life-1";
game.traders.player.sardines = 0; game.traders.player.inventory = []; game.phase = "sunset";
game = advancePhase(game);
const estate = economicSnapshot(game);
assert.equal(estate.formTransitionCount, 1);
assert.equal(estate.formerEstateClaimsReference, 7);
assert.equal(estate.currentBodyClaimsReference, 0);
assert.equal(estate.legallyAccessibleWealth, estate.currentBodyWealth);

game = morning();
game.information.push(
  { id: "lime-source", claimType: "holding", subjectId: "sterling", item: "Lime Crate", text: "Sterling has Lime.", source: "personal investigation", precision: "exact", confidence: "high", freshness: "current", observedDay: 1, knownBy: ["player"], sellable: false },
  { id: "lime-need", claimType: "need", subjectId: "aspen", item: "Lime Crate", text: "Aspen needs Lime.", source: "conversation", precision: "exact", confidence: "high", freshness: "current", observedDay: 1, knownBy: ["player"], sellable: false },
);
game = acceptFutureDelivery(game);
const future = game.obligations.find((entry) => entry.kind === "future-delivery");
game.traders.player.inventory.push("Lime Crate"); game.phase = "afternoon"; game.actionsRemaining = 1;
game = fulfillFutureDelivery(game, future.id);
assert(game.badges.some((badge) => badge.id === "sold-before-owned"));

game = morning();
game.information.push({ id: "exclusive-oil", claimType: "holding", subjectId: "aspen", item: "Sperm Whale Oil", text: "Aspen has oil.", source: "personal investigation", precision: "exact", confidence: "high", freshness: "current", observedDay: 1, exclusive: true, sellable: true, soldTo: [], sharedWith: [], knownBy: ["player"], diffusionCount: 0, personallyVerified: true });
game = sellInformationExclusive(game, "exclusive-oil", "yasmin");
game.marketPlan = [{ from: "yasmin", to: "aspen", wantItem: "Sperm Whale Oil", offerItem: null, sardines: sellerAsk(game, "aspen", "Sperm Whale Oil"), infoId: "exclusive-oil" }];
game = advancePhase(game); game = resolveNoonMarket(game); game = advancePhase(game); game = advancePhase(game); game = advancePhase(game); game = advancePhase(game); game = advancePhase(game); game = resolveNoonMarket(game);
assert(game.badges.some((badge) => badge.id === "exclusive"));

console.log("Living Samsara semantic smoke passed: canonical cast, Octopus Clearing, recurring loops, Dima, claims, Sun Moment, estate accounting, and existing badges.");
