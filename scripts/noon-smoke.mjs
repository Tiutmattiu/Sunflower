// Direct Node smoke checks only. No test runner / browser automation dependency / CI.
import assert from "node:assert/strict";
import {
  advancePhase,
  createGame,
  knownItemsForTrader,
  performFreeAction,
  resolveNoonMarket,
  resetOrders,
} from "../src/gameEngine.js";
import { planNPCMarket, sellerAsk, visibleMarketBoard, visibleSellListings } from "../src/npcAI.js";

const order = (from, to, wantItem, sardines, offerItem = null) => ({ from, to, wantItem, sardines, offerItem });

function morning() {
  return advancePhase(createGame());
}

function noonWithoutPlans() {
  const game = morning();
  game.marketPlan = [];
  return advancePhase(game);
}

function manualNoon() {
  const game = noonWithoutPlans();
  game.lockedPlayerOrders = [];
  return game;
}

function compete(playerCash, npcCash, day = 1) {
  const game = manualNoon();
  game.day = day;
  game.playerOrders = [order("player", "fishmonger", "Fresh Mackerel", playerCash)];
  game.marketPlan = [order("dog", "fishmonger", "Fresh Mackerel", npcCash)];
  return game;
}

function clear(game) {
  const before = structuredClone(game);
  const cash = Object.values(game.traders).reduce((sum, trader) => sum + trader.sardines, 0);
  const result = resolveNoonMarket(game);
  assert.deepEqual(game, before, "clearing must not mutate its input");
  assert.deepEqual(result.marketPlan, game.marketPlan, "committed NPC plans must not reroll at settlement");
  assert.equal(Object.values(result.traders).reduce((sum, trader) => sum + trader.sardines, 0), cash, "Noon itself must conserve sardine tins");
  assert(Object.values(result.traders).every((trader) => Number.isFinite(trader.sardines) && trader.sardines >= 0));
  assert.equal(result.history.length - game.history.length, result.marketOutcome.length);
  assert.deepEqual(resolveNoonMarket(result), result, "clearing twice must do nothing");
  for (const trade of result.history.slice(game.history.length)) {
    assert(!("paymentValue" in trade) && !("knowledgeBasis" in trade) && !("score" in trade));
  }
  return result;
}

const winner = (game) => clear(game).marketOutcome[0]?.from;
assert.equal(winner(compete(10, 12)), "dog", "player must lose to a better NPC bid");
assert.equal(winner(compete(12, 10)), "player", "player can outbid the NPC");
assert.equal(winner(compete(10, 10, 1)), "dog");
assert.equal(winner(compete(10, 10, 2)), "player", "equal bids rotate across days");

// First-day bounded rationality: the harbour must not solve its private needs before the player sees one tape.
let game = createGame();
const dayOnePlans = planNPCMarket(game);
assert(dayOnePlans.length <= 2, `Day 1 should be quiet enough to read; got ${dayOnePlans.length} NPC orders`);
assert(dayOnePlans.some((plan) => plan.from === "dog" && plan.wantItem === "Fresh Mackerel"));
assert(dayOnePlans.some((plan) => plan.from === "bar" && plan.wantItem === "Ice Block"));
assert(!dayOnePlans.some((plan) => plan.wantItem === "Sperm Whale Oil"), "Vale must not magically locate hidden whale oil on Day 1");
assert(!dayOnePlans.some((plan) => plan.wantItem === "Orgeat Bottle"), "Bar must not magically locate hidden Orgeat on Day 1");
assert(!knownItemsForTrader(game, "mechanic").includes("Sperm Whale Oil"));
assert(!visibleSellListings(game).some((listing) => listing.item === "Sperm Whale Oil"));
assert(visibleMarketBoard(game).every((bid) => !["to", "reason", "score", "knowledgeBasis"].some((key) => key in bid)));

// Talk and investigation are genuinely different verbs.
game = morning();
let talked = performFreeAction(game, "talk", "bar");
assert.equal(talked.relationships.bar, 1);
assert.equal(talked.lastInteraction.action, "talk");
assert(talked.lastInteraction.text && !talked.lastInteraction.text.includes("+1"));
assert(!talked.log[0].includes("relationship contact +1"));
let investigated = performFreeAction(game, "investigate", "bar");
assert.equal(investigated.relationships.bar, 0, "investigation must not silently build friendship");
assert.equal(investigated.lastInteraction.action, "investigate");
assert(investigated.lastInteraction.text.includes("Mai Tai"));
assert(!investigated.lastInteraction.text.toLowerCase().includes("orgeat"), "first bartending clue must preserve expertise advantage");

// Morning writes orders; advancing to Noon locks a snapshot. Editing the draft afterward cannot rewrite history.
game = morning();
game.marketPlan = [];
game.playerOrders[0] = order("player", "fishmonger", "Fresh Mackerel", 10);
game = advancePhase(game);
assert.equal(game.phase, "noon");
assert.equal(game.lockedPlayerOrders.length, 1);
assert.equal(game.lockedPlayerOrders[0].sardines, 10);
game.playerOrders[0].sardines = 18;
let result = clear(game);
assert.equal(result.marketOutcome.find((trade) => trade.from === "player")?.sardines, 10, "settlement must use the locked order, not a later draft mutation");

// Better bid / tie / duplicate inventory / funding conservation.
for (const day of [1, 2, 3]) {
  game = compete(10, 10, day);
  game.marketPlan.push(order("bar", "fishmonger", "Fresh Mackerel", 10));
  const reversed = structuredClone(game);
  reversed.marketPlan.reverse();
  assert.deepEqual(clear(game).marketOutcome, clear(reversed).marketOutcome);
}
game = compete(10, 99);
assert.equal(winner(game), "player", "unfunded high bidder cannot block a funded bid");
game = compete(9, 9);
assert.equal(clear(game).marketOutcome.length, 0, "NPCs must also meet seller asks");
game = compete(10, 12);
game.traders.fishmonger.inventory.push("Fresh Mackerel");
assert.equal(clear(game).marketOutcome.length, 2, "two physical units can fill two bids");

game = manualNoon();
game.traders.player.inventory.push("Orgeat Bottle");
game.playerOrders = [order("player", "bar", "Rum Bottle", 0, "Orgeat Bottle")];
game.marketPlan = [order("vale", "bar", "Rum Bottle", 20)];
result = clear(game);
assert.equal(result.marketOutcome[0].from, "player");
assert(result.flags.orgeatDelivered);
assert(result.traders.bar.inventory.includes("Mai Tai"));
assert(knownItemsForTrader(result, "bar").includes("Orgeat Bottle"), "barter ownership belongs on the public tape");

for (const [item, cash, fills] of [["Hardtack Tin", 0, 1], ["Tiny Torque Wrench", 0, 0], ["Tiny Torque Wrench", 7, 1]]) {
  game = manualNoon();
  game.information.push({ claimType: "holding", subjectId: "mechanic", item, observedDay: game.day, freshness: "current", sellable: false, soldTo: [] });
  game.playerOrders = [order("player", "mechanic", item, cash, "Bad Tangerine")];
  result = clear(game);
  assert.equal(result.marketOutcome.length, fills, "deception changes belief, not conservation or price floor");
  assert.equal(result.flags.cheated, Boolean(fills));
}

for (const invalid of [-1, NaN, Infinity, "not money"]) {
  game = manualNoon();
  game.playerOrders = [order("player", "dog", "Glasses Wipe", invalid, "Fish Bones")];
  assert.equal(clear(game).marketOutcome.length, 0, "invalid money cannot settle even with barter");
}

for (const copies of [1, 2]) {
  game = manualNoon();
  game.traders.player.inventory = Array(copies).fill("Fish Bones");
  game.playerOrders = [order("player", "dog", "Glasses Wipe", 0, "Fish Bones"), order("player", "dog", "Pocket Match", 0, "Fish Bones")];
  assert.equal(clear(game).marketOutcome.length, copies);
}
game = manualNoon();
game.traders.player.sardines = 10;
game.playerOrders = [order("player", "dog", "Glasses Wipe", 10), order("player", "dog", "Pocket Match", 10)];
assert.equal(clear(game).marketOutcome.length, 1, "one opening cash pool cannot fund two winning orders");
game = manualNoon();
game.playerOrders = [order("player", "dog", "Glasses Wipe", 6), order("player", "dog", "Pocket Match", 3, "Glasses Wipe")];
assert.equal(clear(game).marketOutcome.length, 1, "newly purchased goods cannot fund the same batch");

// Belief is not truth. Public tape can produce a rational but stale NPC order that fails at settlement.
game = createGame();
game.day = 2;
game.history.push({ id: "old-oil", day: 1, phase: "noon", source: "public", from: "dog", to: "mechanic", item: "Sperm Whale Oil", paymentItem: null, sardines: 20 });
game.traders.dog.inventory = game.traders.dog.inventory.filter((item) => item !== "Sperm Whale Oil");
const stalePlan = planNPCMarket(game).find((plan) => plan.from === "vale" && plan.to === "dog" && plan.wantItem === "Sperm Whale Oil");
assert(stalePlan, "Vale should be able to act on a stale but public ownership belief");
game.phase = "noon";
game.marketResolved = false;
game.marketPlan = [stalePlan];
game.lockedPlayerOrders = [];
result = clear(game);
assert.equal(result.marketOutcome.length, 0, "clearing must discover that stale believed stock is gone");

for (const proxy of [false, true]) {
  game = compete(12, 10);
  game.playerState.form = "animal";
  game.playerState.legalIdentity.status = "unrecognized";
  if (proxy) game.playerState.proxyAccess.push({ venueId: "formalMarket", via: "bar", expiresDay: game.day });
  assert.equal(winner(game), proxy ? "player" : "dog");
}

// Long idle run: business activity may exchange with outside customers, but nobody may print goods for free or go negative.
game = createGame();
const dailyTrades = [];
for (let step = 0; !game.ended && step < 120; step += 1) {
  assert.equal(game.pendingEvents.length, 0);
  if (game.phase === "noon" && !game.marketResolved) {
    game = clear(game);
    dailyTrades.push(game.marketOutcome.length);
  } else {
    game = advancePhase(game);
  }
  assert(Object.values(game.traders).every((trader) => trader.sardines >= 0 && Number.isFinite(trader.sardines)));
}
assert(game.ended && game.day === 14);
assert.equal(game.style.name, "The Bystander");
assert.deepEqual(game.playerOrders, resetOrders());
assert.equal(sellerAsk(createGame(), "fishmonger", "Fresh Mackerel"), 10);

console.log(`Living-day smoke passed. Day 1 NPC orders: ${dayOnePlans.length}. No-action public trades/day: ${dailyTrades.join(", ")}.`);
console.log("Final NPC cash:", Object.fromEntries(Object.entries(game.traders).filter(([id]) => id !== "player").map(([id, trader]) => [id, trader.sardines])));
