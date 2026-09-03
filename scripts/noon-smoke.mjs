// Run directly with Node; no runner, browser automation dependency, or CI.
import assert from "node:assert/strict";
import { advancePhase, createGame, knownItemsForTrader, resolveNoonMarket, resetOrders } from "../src/gameEngine.js";
import { planNPCMarket, sellerAsk, visibleMarketBoard, visibleSellListings } from "../src/npcAI.js";

const order = (from, to, wantItem, sardines, offerItem = null) => ({ from, to, wantItem, sardines, offerItem });
function noon() {
  const game = advancePhase(advancePhase(createGame()));
  game.marketPlan = [];
  return game;
}
function compete(playerCash, npcCash, day = 1) {
  const game = noon();
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
  assert.deepEqual(result.marketPlan, game.marketPlan, "committed plans must not reroll");
  assert.equal(Object.values(result.traders).reduce((sum, trader) => sum + trader.sardines, 0), cash);
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
for (const day of [1, 2, 3]) {
  const game = compete(10, 10, day);
  game.marketPlan.push(order("bar", "fishmonger", "Fresh Mackerel", 10));
  const reversed = structuredClone(game);
  reversed.marketPlan.reverse();
  assert.deepEqual(clear(game).marketOutcome, clear(reversed).marketOutcome);
}

let game = compete(10, 99);
assert.equal(winner(game), "player", "unfunded high bidder cannot block a funded bid");
game = compete(9, 9);
assert.equal(clear(game).marketOutcome.length, 0, "NPCs must also meet the seller ask");
game = compete(10, 12);
game.traders.fishmonger.inventory.push("Fresh Mackerel");
assert.equal(clear(game).marketOutcome.length, 2, "two units can fill two bids");
game = compete(10, 12);
game.traders.fishmonger.inventory = game.traders.fishmonger.inventory.filter((item) => item !== "Fresh Mackerel");
assert.equal(clear(game).marketOutcome.length, 0, "stale holdings fail without movement");

// Same reference value, different seller-side private utility; no leaked numeric score.
game = noon();
game.traders.player.inventory.push("Orgeat Bottle");
game.playerOrders = [order("player", "bar", "Rum Bottle", 0, "Orgeat Bottle")];
game.marketPlan = [order("vale", "bar", "Rum Bottle", 20)];
let result = clear(game);
assert.equal(result.marketOutcome[0].from, "player");
assert(result.flags.orgeatDelivered);
assert(result.traders.bar.inventory.includes("Mai Tai"));
assert(knownItemsForTrader(result, "bar").includes("Orgeat Bottle"), "barter payment ownership belongs on the tape");
result.traders.mechanic.inventory = result.traders.mechanic.inventory.filter((item) => item !== "Sperm Whale Oil");
result.traders.player.inventory.push("Sperm Whale Oil");
result.phase = "noon";
result.marketResolved = false;
result.playerOrders = [order("player", "bar", "Demerara Syrup", 0, "Sperm Whale Oil")];
result.marketPlan = [];
result = clear(result);
assert(planNPCMarket(result).some((plan) => plan.from === "vale" && plan.to === "bar" && plan.wantItem === "Sperm Whale Oil"));

for (const [item, cash, fills] of [["Hardtack Tin", 0, 1], ["Tiny Torque Wrench", 0, 0], ["Tiny Torque Wrench", 7, 1]]) {
  game = noon();
  game.information.push({ claimType: "holding", subjectId: "mechanic", item });
  game.playerOrders = [order("player", "mechanic", item, cash, "Bad Tangerine")];
  result = clear(game);
  assert.equal(result.marketOutcome.length, fills, "deception changes belief, not the price floor");
  assert.equal(result.flags.cheated, Boolean(fills));
}

for (const invalid of [-1, NaN, Infinity, "not money"]) {
  game = noon();
  game.playerOrders = [order("player", "dog", "Glasses Wipe", invalid, "Fish Bones")];
  assert.equal(clear(game).marketOutcome.length, 0, "invalid money cannot settle even with good barter");
}
game = noon();
game.playerOrders = [order("player", "mechanic", "Sperm Whale Oil", 18)];
assert.equal(clear(game).marketOutcome.length, 0, "unknown hidden holdings are not player targets");
const fresh = createGame();
assert(!knownItemsForTrader(fresh, "mechanic").includes("Sperm Whale Oil"));
assert(!visibleSellListings(fresh).some((listing) => listing.item === "Sperm Whale Oil"));
assert(visibleMarketBoard(fresh).every((bid) => !["to", "reason", "score", "knowledgeBasis"].some((key) => key in bid)));

// Count actual payment copies; do not recycle purchases or same-batch proceeds.
for (const copies of [1, 2]) {
  game = noon();
  game.traders.player.inventory = Array(copies).fill("Fish Bones");
  game.playerOrders = [order("player", "dog", "Glasses Wipe", 0, "Fish Bones"), order("player", "dog", "Pocket Match", 0, "Fish Bones")];
  assert.equal(clear(game).marketOutcome.length, copies);
}
game = noon();
game.traders.player.sardines = 10;
game.playerOrders = [order("player", "dog", "Glasses Wipe", 10), order("player", "dog", "Pocket Match", 10)];
assert.equal(clear(game).marketOutcome.length, 1, "cash cannot fund two winning orders");
game = noon();
game.playerOrders = [order("player", "dog", "Glasses Wipe", 6), order("player", "dog", "Pocket Match", 3, "Glasses Wipe")];
assert.equal(clear(game).marketOutcome.length, 1, "new purchases cannot fund this batch");
game = noon();
game.traders.dog.sardines = 0;
game.playerOrders = [order("player", "dog", "Glasses Wipe", 12)];
game.marketPlan = [order("dog", "fishmonger", "Fresh Mackerel", 10)];
assert.equal(clear(game).marketOutcome.length, 1, "same-batch receipts cannot fund a bid");

for (const proxy of [false, true]) {
  game = compete(12, 10);
  game.playerState.form = "animal";
  game.playerState.legalIdentity.status = "unrecognized";
  if (proxy) game.playerState.proxyAccess.push({ venueId: "formalMarket", via: "bar", expiresDay: game.day });
  assert.equal(winner(game), proxy ? "player" : "dog");
}

game = createGame();
const dailyTrades = [];
for (let step = 0; !game.ended && step < 100; step += 1) {
  assert.equal(game.pendingEvents.length, 0);
  if (game.phase === "noon" && !game.marketResolved) {
    game = clear(game);
    dailyTrades.push(game.marketOutcome.length);
  } else game = advancePhase(game);
}
assert(game.ended && game.day === 14);
assert.equal(game.style.name, "The Bystander");
assert.deepEqual(game.playerOrders, resetOrders());
assert.equal(sellerAsk(createGame(), "fishmonger", "Fresh Mackerel"), 10);
console.log(`Noon smoke passed. No-action trades/day: ${dailyTrades.join(", ")}.`);
