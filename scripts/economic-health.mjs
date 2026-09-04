import {
  acceptFutureDelivery, acceptInboundOffer, advancePhase, createGame, duePrivateMatters,
  fulfillFutureDelivery, futureDeliveryAvailable, informationBuyers, performFreeAction,
  requestRelationshipLoan, requestSecuredLoan, resolveDuePrivateMatter, resolveNoonMarket,
  securedCollateralItems, sellInformation, valueOf,
} from "../src/gameEngine.js";
import { visibleMarketBoard, visibleSellListings } from "../src/npcAI.js";
import { PRODUCTION_RECIPES } from "../src/gameData.js";

const POLICIES = ["NO_ACTION", "CASH_CONSERVATIVE", "PUBLIC_VALUE_TRADER", "ACTIVE_TRADER", "INFORMATION_FIRST", "RELATIONSHIP_FIRST", "CREDIT_OPPORTUNIST", "HIGH_RISK"];
const HORIZONS = [14, 42, 100];
const actors = ["player", "dog", "fishmonger", "mechanic", "vale", "clown", "bar"];
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const hhi = (xs) => { const total = sum(xs); return total ? sum(xs.map((x) => (x / total) ** 2)) : 0; };
const wealth = (trader) => trader.sardines + sum(trader.inventory.map(valueOf));

function writeOrder(game, policy) {
  const affordable = visibleSellListings(game).filter((row) => row.ask <= game.traders.player.sardines);
  const rows = policy === "PUBLIC_VALUE_TRADER" ? affordable.filter((row) => row.ask <= row.reference) : affordable;
  rows.sort((a, b) => policy === "HIGH_RISK" ? b.reference - a.reference : policy === "ACTIVE_TRADER" ? a.ask - b.ask : (b.reference - b.ask) - (a.reference - a.ask));
  if (rows[0]) game.playerOrders[0] = { to: rows[0].sellerId, wantItem: rows[0].item, offerItem: "", sardines: rows[0].ask };
}

function useInformation(game) {
  const sale = game.information.map((info) => ({ info, buyers: informationBuyers(game, info) })).find((entry) => entry.buyers.length);
  return sale ? sellInformation(game, sale.info.id, sale.buyers[0]) : game;
}

function act(game, policy, phase) {
  const target = ["dog", "fishmonger", "mechanic", "vale", "clown", "bar"][(game.day - 1) % 6];
  if (phase === "morning") {
    const bid = game.inboundOffers.find((offer) => offer.day === game.day && offer.phase === phase && offer.status === "pending" && offer.kind === "buy-item");
    if (bid && policy !== "NO_ACTION") game = acceptInboundOffer(game, bid.id);
    if (["PUBLIC_VALUE_TRADER", "ACTIVE_TRADER", "HIGH_RISK"].includes(policy)) writeOrder(game, policy);
  }
  if (policy === "NO_ACTION") return game;
  if (policy === "CASH_CONSERVATIVE") return game.actionsRemaining ? performFreeAction(game, "investigate", target) : game;
  if (policy === "INFORMATION_FIRST") {
    game = useInformation(game);
    if (game.actionsRemaining) game = performFreeAction(game, "investigate", target);
    return game.actionsRemaining ? useInformation(game) : game;
  }
  if (policy === "RELATIONSHIP_FIRST") return game.actionsRemaining ? performFreeAction(game, "talk", game.day % 2 ? "bar" : "mechanic") : game;
  if (policy === "CREDIT_OPPORTUNIST") {
    if (futureDeliveryAvailable(game)) return acceptFutureDelivery(game);
    const future = duePrivateMatters(game).find((entry) => entry.kind === "future-delivery");
    if (future && game.traders.player.inventory.includes("Lime Crate")) return fulfillFutureDelivery(game, future.id);
    if ((game.relationships.bar || 0) >= 2 && !game.obligations.some((entry) => entry.kind === "relationship-loan" && entry.status === "open")) return requestRelationshipLoan(game);
    const collateral = securedCollateralItems(game)[0];
    if (collateral && (game.relationships.vale || 0) >= 1) return requestSecuredLoan(game, collateral);
    return game.actionsRemaining ? performFreeAction(game, "talk", game.day % 2 ? "bar" : "mechanic") : game;
  }
  return game.actionsRemaining ? performFreeAction(game, policy === "HIGH_RISK" ? "talk" : "investigate", policy === "HIGH_RISK" ? "clown" : target) : game;
}

function recoveryChannels(game) {
  const board = visibleMarketBoard(game);
  const channels = new Set();
  if (game.traders.player.inventory.some((item) => board.some((bid) => bid.wantItem === item))) channels.add("sell-visible-good");
  if (game.inboundOffers.some((offer) => offer.status === "pending" && offer.kind === "buy-item")) channels.add("inbound-bid");
  if ((game.relationships.bar || 0) >= 2 && game.traders.bar.sardines >= 22) channels.add("relationship-credit");
  if ((game.relationships.vale || 0) >= 1 && securedCollateralItems(game).length) channels.add("secured-borrowing");
  if (game.information.some((info) => informationBuyers(game, info).length)) channels.add("sell-information");
  if (game.playerState.form === "animal" && (game.relationships.bar || 0) >= 2) channels.add("proxy-access");
  return channels.size;
}

function run(policy, horizon) {
  let game = createGame();
  game.maxDays = horizon;
  const daily = [];
  while (!game.ended) {
    game = advancePhase(game);
    const day = game.day;
    const evidenceStart = game.decisionEvidence.length;
    const listings = visibleSellListings(game).length;
    const plans = game.marketPlan.length;
    const planActors = new Set(game.marketPlan.map((plan) => plan.from));
    game = act(game, policy, "morning");
    game = advancePhase(game);
    game = resolveNoonMarket(game);
    const trades = game.history.filter((trade) => trade.day === day);
    game = advancePhase(game);
    game = act(game, policy, "afternoon");
    game = advancePhase(game);
    for (const matter of duePrivateMatters(game)) {
      const action = matter.kind === "future-delivery" ? (game.traders.player.inventory.includes(matter.item) ? "deliver" : "default") : (game.traders.player.sardines >= matter.amount ? "repay" : "seize");
      game = resolveDuePrivateMatter(game, matter.id, action);
    }
    const lowCashChannels = game.traders.player.sardines <= 3 ? recoveryChannels(game) : null;
    game = advancePhase(game);
    const evidence = game.decisionEvidence.slice(evidenceStart);
    const cash = actors.map((id) => game.traders[id].sardines);
    const referenceWealth = actors.map((id) => wealth(game.traders[id]));
    daily.push({
      day, plans, listings, trades: trades.length, playerTrades: trades.filter((trade) => trade.from === "player" || trade.to === "player").length,
      cashStock: sum(cash), inventoryValue: sum(actors.map((id) => sum(game.traders[id].inventory.map(valueOf)))), cashHHI: hhi(cash), wealthHHI: hhi(referenceWealth),
      lowCashChannels, planActors: [...planActors], perish: evidence.filter((entry) => entry.consequence === "perished").length, production: evidence.filter((entry) => entry.consequence === "production").length,
      openObligations: game.obligations.filter((entry) => entry.status === "open").length, overdueOrDefaulted: game.obligations.filter((entry) => ["overdue", "defaulted"].includes(entry.status)).length,
      securedExposures: game.obligations.filter((entry) => entry.kind === "secured-loan" && entry.status === "open").length, publicStockBreadth: new Set(visibleSellListings(game).map((row) => row.item)).size,
      actorInventoryValue: Object.fromEntries(actors.map((id) => [id, sum(game.traders[id].inventory.map(valueOf))])), staleInformation: game.information.filter((info) => info.freshness === "stale").length,
      actionsUsed: evidence.filter((entry) => ["talk", "investigate", "information-sold", "future-delivery-bound", "relationship-loan-opened", "secured-loan-opened"].includes(entry.type)).length,
      talkActions: evidence.filter((entry) => entry.type === "talk").length, investigateActions: evidence.filter((entry) => entry.type === "investigate").length,
      unusedActions: sum(evidence.filter((entry) => entry.type === "phase-ended-with-unused-actions").map((entry) => entry.unusedActions)),
    });
  }
  const allTrades = game.history;
  const dead = daily.map((row) => row.trades === 0);
  let streak = 0, maxDead = 0;
  dead.forEach((value) => { streak = value ? streak + 1 : 0; maxDead = Math.max(maxDead, streak); });
  const actorRows = actors.map((id) => {
    const buys = allTrades.filter((trade) => trade.from === id);
    const sells = allTrades.filter((trade) => trade.to === id);
    return { id, cash: game.traders[id].sardines, wealth: wealth(game.traders[id]), buys: buys.length, sells: sells.length, participation: buys.length + sells.length, salesShare: allTrades.length ? sells.length / allTrades.length : 0, volumeShare: sum(allTrades.map((trade) => trade.sardines)) ? sum([...buys, ...sells].map((trade) => trade.sardines)) / sum(allTrades.map((trade) => trade.sardines)) : 0, arrivalUnfundedDays: new Set(game.decisionEvidence.filter((entry) => entry.consequence === "arrival-unfunded" && entry.actorId === id).map((entry) => entry.day)).size, noFeasiblePlanDays: daily.filter((row) => id !== "player" && !row.planActors.includes(id)).length };
  });
  const finalCash = actors.map((id) => game.traders[id].sardines);
  const finalWealth = actors.map((id) => wealth(game.traders[id]));
  const warnings = [];
  if (daily.slice(0, 10).some((_, i) => i >= 2 && daily.slice(i - 2, i + 1).every((row) => !row.trades))) warnings.push("more than 2 consecutive dead-market days in first 10");
  if (Math.max(...finalCash) / sum(finalCash) > .4) warnings.push("largest cash share exceeds 40%");
  if (hhi(finalCash) > .25) warnings.push("cash HHI exceeds 0.25");
  if (daily.length >= 7 && Math.abs(daily.at(-1).cashStock - daily.at(-7).cashStock) / daily.at(-7).cashStock > .3) warnings.push("7-day cash-stock drift exceeds 30%");
  if (daily.some((row) => row.lowCashChannels !== null && row.lowCashChannels < 2)) warnings.push("low-cash player had fewer than 2 visible recovery paths");
  actorRows.filter((row) => row.salesShare > .5 && horizon >= 42).forEach((row) => warnings.push(`${row.id} supplied over 50% of public sales`));
  actorRows.filter((row) => row.id !== "player" && row.noFeasiblePlanDays > horizon * .7).forEach((row) => warnings.push(`${row.id} had no feasible market plan for most of the horizon`));
  if (game.decisionEvidence.some((entry) => entry.consequence === "perished" && entry.item === "Ice Block")) warnings.push("Ice Block perish timing observed; inspect against Bar use order");
  if (game.decisionEvidence.some((entry) => entry.consequence === "business-arrival" && entry.item === "Ice Block") && !game.decisionEvidence.some((entry) => entry.consequence === "outside-revenue" && entry.inputUsed === "Ice Block")) warnings.push("configured Ice arrivals never improved Bar service revenue");
  if (game.decisionEvidence.some((entry) => entry.thread === "barRecipe" && entry.consequence === "production") && sum(PRODUCTION_RECIPES.maiTai.inputs.map(valueOf)) > valueOf(PRODUCTION_RECIPES.maiTai.output)) warnings.push("Mai Tai production reduced reference inventory value");
  if (policy === "NO_ACTION" && horizon === 14 && game.playerState.form === "human") warnings.push("player survived 14 days without taking actions");
  if (daily.at(-1).cashStock > daily[0].cashStock && daily.at(-1).inventoryValue < daily[0].inventoryValue) warnings.push("cash stock rose while physical reference inventory fell");
  if (horizon >= 42 && sum(daily.slice(-14).map((row) => row.trades)) < sum(daily.slice(0, 14).map((row) => row.trades)) * .5) warnings.push("public market activity weakened materially late in the run");
  const evidence = game.decisionEvidence;
  return { policy, horizon, game, daily, actorRows, trades: allTrades.length, publicListings: sum(daily.map((row) => row.listings)), playerFills: sum(daily.map((row) => row.playerTrades)), npcPlans: sum(daily.map((row) => row.plans)), uniqueCounterparties: new Set(allTrades.flatMap((trade) => [trade.from, trade.to])).size, uniqueGoods: new Set(allTrades.map((trade) => trade.item)).size, deadDays: dead.filter(Boolean).length, maxDead, cashDrift: daily.at(-1).cashStock - daily[0].cashStock, cashHHI: hhi(finalCash), wealthHHI: hhi(finalWealth), dominantCash: actorRows.toSorted((a, b) => b.cash - a.cash)[0].id, dominantSales: actorRows.toSorted((a, b) => b.sells - a.sells)[0].id, defaults: game.stats.defaults, recoveryFailures: daily.filter((row) => row.lowCashChannels !== null && row.lowCashChannels < 2).length,
    credit: { open: game.obligations.filter((entry) => entry.status === "open").length, overdueOrDefaulted: game.obligations.filter((entry) => ["overdue", "defaulted"].includes(entry.status)).length, secured: game.obligations.filter((entry) => entry.kind === "secured-loan").length, seized: evidence.filter((entry) => entry.type === "secured-collateral-seized").length, relationshipLoans: game.obligations.filter((entry) => entry.kind === "relationship-loan").length, futureContracts: game.obligations.filter((entry) => entry.kind === "future-delivery").length, futureSuccesses: evidence.filter((entry) => entry.type === "future-delivery-fulfilled").length, exclusivity: game.obligations.filter((entry) => entry.kind === "information-exclusivity").length, detectedBreaches: evidence.filter((entry) => entry.type === "information-exclusivity-detected").length, undetectedBreaches: game.obligations.filter((entry) => entry.status === "breached-undetected").length },
    physical: { perishEvents: evidence.filter((entry) => entry.consequence === "perished").length, productionEvents: evidence.filter((entry) => entry.consequence === "production").length, outsideEntries: evidence.filter((entry) => entry.consequence === "business-arrival").length, outsideExits: evidence.filter((entry) => ["outside-sale", "business-consumption"].includes(entry.consequence)).length, inertGoods: [...new Set(actors.flatMap((id) => game.traders[id].inventory))].filter((item) => !allTrades.some((trade) => trade.item === item || trade.paymentItem === item)).length },
    information: { acquired: evidence.filter((entry) => ["talk", "investigate"].includes(entry.type) && entry.informationId).length, soldOrShared: evidence.filter((entry) => ["information-sold", "information-favour", "information-exclusivity-sold"].includes(entry.type)).length, diffusion: sum(game.information.map((info) => info.diffusionCount || 0)), stale: game.information.filter((info) => info.freshness === "stale").length, causalPublicDecisions: allTrades.filter((trade) => trade.infoId).length },
    time: { used: sum(daily.map((row) => row.actionsUsed)), unused: sum(daily.map((row) => row.unusedActions)), talk: sum(daily.map((row) => row.talkActions)), investigate: sum(daily.map((row) => row.investigateActions)) }, warnings };
}

const runs = HORIZONS.flatMap((horizon) => POLICIES.map((policy) => run(policy, horizon)));
console.log("\nECONOMIC HEALTH — RAW ENGINE TRACES");
console.table(runs.map((r) => ({ policy: r.policy, days: r.horizon, playerCash: r.game.traders.player.sardines, playerWealth: wealth(r.game.traders.player), trades: r.trades, deadDays: r.deadDays, maxDead: r.maxDead, cashDrift: r.cashDrift, cashHHI: r.cashHHI.toFixed(3), wealthHHI: r.wealthHHI.toFixed(3), cashLeader: r.dominantCash, salesLeader: r.dominantSales, defaults: r.defaults, recoveryFailures: r.recoveryFailures, warnings: r.warnings.length })));
console.log("\nAGGREGATE ACTOR TABLE — 24 STANDARD RUNS");
console.table(actors.map((id) => {
  const rows = runs.map((run) => run.actorRows.find((row) => row.id === id));
  return { actor: id, meanEndingCash: (sum(rows.map((row) => row.cash)) / rows.length).toFixed(1), meanEndingWealth: (sum(rows.map((row) => row.wealth)) / rows.length).toFixed(1), publicBuys: sum(rows.map((row) => row.buys)), publicSells: sum(rows.map((row) => row.sells)), participation: sum(rows.map((row) => row.participation)), meanSalesShare: (sum(rows.map((row) => row.salesShare)) / rows.length).toFixed(3) };
}));
console.log("\nDIAGNOSTIC WARNINGS");
runs.filter((run) => run.warnings.length).forEach((run) => console.log(`${run.policy} ${run.horizon}d: ${run.warnings.join("; ")}`));
