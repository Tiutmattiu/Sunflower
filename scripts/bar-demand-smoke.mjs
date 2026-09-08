import assert from "node:assert/strict";
import { buildEvents, createGame, resolveNoonMarket } from "../src/gameEngine.js";
import { ACTIVE_REAL_MENU, ACTIVE_SUPPORT, BAR_INGREDIENTS, buildDrinkPropositions, createBarState, produceDrink, settleBarService, syncBarInventory } from "../src/barEconomy.js";

let game = createGame();
assert(game.bar.servings && buildDrinkPropositions(game).length >= 2, "new-game board is initialized from authoritative stock");
const spicy = buildDrinkPropositions(game, { base: "non_alcoholic", style: "spicy", extra: "spicy" });
assert(spicy.some((drink) => drink.ingredients.includes("Sichuan Pepper")), "real-menu stock causally changes propositions");
game.traders.joel.inventory = game.traders.joel.inventory.filter((item) => item !== "Sichuan Pepper"); game.bar.countedUnits["Sichuan Pepper"] = 0;
assert(!buildDrinkPropositions(game, { base: "non_alcoholic", style: "spicy", extra: "spicy" }).some((drink) => drink.ingredients.includes("Sichuan Pepper")));

game = createGame(); game.bar.demandOverride = []; const cash = game.traders.joel.sardines; settleBarService(game); assert.equal(game.traders.joel.sardines, cash, "no customer means no revenue");
game = createGame(); game.bar.demandOverride = [{ source: "background_local", style: "fruity", extra: "fruity", base: "non_alcoholic", budget: 10 }];
const harbourCash = Object.values(game.traders).reduce((n,t)=>n+t.sardines,0) + game.backgroundEconomy.localHouseholdsCash + game.backgroundEconomy.harbourWorkersCash;
settleBarService(game); assert.equal(Object.values(game.traders).reduce((n,t)=>n+t.sardines,0) + game.backgroundEconomy.localHouseholdsCash + game.backgroundEconomy.harbourWorkersCash, harbourCash, "local sale conserves all harbour cash");
game = createGame(); game.bar.demandOverride = [{ source: "external_visitor", style: "fruity", extra: "fruity", base: "alcoholic", budget: 20 }]; const injection = game.backgroundEconomy.externalInjections; settleBarService(game); assert.equal(game.backgroundEconomy.externalInjections - injection, game.bar.serviceWindows.at(-1).externalRevenue);

game = createGame(); game.bar.demandOverride = [{ source: "background_local", style: "fruity", extra: "fruity", base: "non_alcoholic", budget: 0 }]; const before = {...game.bar.servings}; settleBarService(game); assert.equal(game.bar.serviceWindows.at(-1).unservedByReason.customer_budget_reject, 1); assert.deepEqual(game.bar.servings, before, "payment rejection happens before consumption");
game = createGame(); game.bar.demandOverride = [{ source: "juan", style: "fruity", extra: "spicy", base: "alcoholic", budget: 20, tab: true }]; game.claims.find(c=>c.id==="juan-joel-tab").faceAmount=16; const face=16; const stock={...game.bar.servings}; settleBarService(game); assert.equal(game.claims.find(c=>c.id==="juan-joel-tab").faceAmount,face); assert.deepEqual(game.bar.servings,stock); assert.equal(game.bar.serviceWindows.at(-1).unservedByReason.credit_limit_reject,1);

game = createGame(); produceDrink(game, "Cucumber Highball"); game.day=3; game.bar.demandOverride=[]; settleBarService(game); const waste=game.bar.serviceWindows.at(-1); assert(waste.organicScrap > waste.scrapProcessed); assert.equal(waste.scrapProcessed,waste.processingCapacity); assert(waste.recoveryValue < waste.spoilage*.25,"bounded processing is not an automatic rebate");
game = createGame(); delete game.traders.joel; game.bar.demandOverride=[{source:"background_local",base:"non_alcoholic",style:"dry",budget:9}]; settleBarService(game); assert.equal(game.bar.serviceWindows.at(-1).unservedByReason.bar_closed,1);
game.marketPlan=[{from:"aspen",to:"octopus",wantItem:"Fresh Mackerel",offerItem:null,sardines:20}]; game.phase="noon"; game.marketResolved=false; game.lockedPlayerOrders=[]; game=resolveNoonMarket(game); assert(game.history.length,"harbour trades while Bar is closed");
game.traders.player.sardines=70; game.traders.player.inventory.push("Blue Glass Marble"); game.worldThreads.valeScreening.stage="aftermath"; assert(buildEvents(game).some(event=>event.id==="auction"),"Yasmin Auction remains reachable without Joel");
const families=new Set(ACTIVE_REAL_MENU.map(name=>BAR_INGREDIENTS[name].family)); assert(ACTIVE_REAL_MENU.length===10&&ACTIVE_SUPPORT.length===6); ["fruit","savoury_produce","herb","spice"].forEach(f=>assert(families.has(f)));
console.log("Bar demand ecology smoke passed.");
