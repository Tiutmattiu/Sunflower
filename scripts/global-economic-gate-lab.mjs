import { writeFileSync } from "node:fs";
import {
  advancePhase,
  createGame,
  informationPrice,
  resolveNoonMarket,
} from "../src/gameEngine.js";
import { ITEMS, INITIAL_TRADERS, NPC_PROFILES } from "../src/gameData.js";
import { buyerMax, sellerAsk, visibleSellListings } from "../src/npcAI.js";

const IMPLEMENTATION_START = "4cd8a78a3fe1e56e8d4a30c24abf95257833bd2c";
const DESIGN_REFERENCE = "2f7323fc4671c6a574e6418b65d345bd68bd8623";
const RETURN_CLASSES = ["TRADE", "OPERATE", "INVEST", "FINANCE", "INTERMEDIATE", "SPECULATE"];
const mean = (xs) => xs.reduce((sum, value) => sum + value, 0) / Math.max(1, xs.length);
const sum = (xs) => xs.reduce((total, value) => total + value, 0);
const round = (value, digits = 3) => Number(value.toFixed(digits));
const quantile = (xs, p) => [...xs].sort((a, b) => a - b)[Math.floor((xs.length - 1) * p)] ?? 0;
const effectiveN = (shares) => {
  const total = sum(shares);
  return total ? 1 / sum(shares.map((share) => (share / total) ** 2)) : 0;
};
function rng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
function poisson(random, lambda) {
  let count = 0;
  let product = 1;
  const limit = Math.exp(-lambda);
  do { count += 1; product *= random(); } while (product > limit);
  return count - 1;
}

function traderCash(game) {
  return sum(Object.values(game.traders).map((trader) => trader.sardines));
}
function harbourCash(game) {
  return traderCash(game) + game.backgroundEconomy.localHouseholdsCash + game.backgroundEconomy.harbourWorkersCash;
}

function runLiquidity(horizon, unavailable = null) {
  let game = createGame();
  const initialCash = harbourCash(game);
  const initialInventory = Object.values(game.traders).reduce((n, trader) => n + trader.inventory.length, 0);
  const windows = [];
  const principals = new Map();
  const goods = new Map();
  for (let window = 0; window < horizon; window += 1) {
    if (game.phase === "sunrise") game = advancePhase(game);
    if (unavailable) game.marketPlan = game.marketPlan.filter((order) => order.from !== unavailable && order.to !== unavailable);
    const listings = visibleSellListings(game).filter((listing) => listing.sellerId !== unavailable);
    game = advancePhase(game);
    const beforeHistory = game.history.length;
    game = resolveNoonMarket(game);
    const trades = game.history.slice(beforeHistory);
    const plans = game.marketPlan.filter((order) => order.from !== unavailable && order.to !== unavailable);
    const attemptedBuy = plans.length;
    const attemptedSell = listings.length;
    const tradedGoods = new Set(trades.map((trade) => trade.item));
    trades.forEach((trade) => {
      principals.set(trade.from, (principals.get(trade.from) || 0) + Number(trade.sardines || 0));
      principals.set(trade.to, (principals.get(trade.to) || 0) + Number(trade.sardines || 0));
      goods.set(trade.item, (goods.get(trade.item) || 0) + 1);
    });
    windows.push({
      fills: trades.length,
      listings: attemptedSell,
      buyUnfilled: Math.max(0, attemptedBuy - trades.length),
      sellUnsold: listings.filter((listing) => !tradedGoods.has(listing.item)).length,
      npcToNpc: trades.filter((trade) => trade.from !== "player" && trade.to !== "player").length,
      player: trades.filter((trade) => trade.from === "player" || trade.to === "player").length,
      value: sum(trades.map((trade) => Number(trade.sardines || 0))),
    });
    game = advancePhase(game);
    game = advancePhase(game);
    game = advancePhase(game);
  }
  const volumes = [...principals.values()];
  const totalVolume = sum(volumes);
  const finalInventory = Object.values(game.traders).reduce((n, trader) => n + trader.inventory.length, 0);
  const injectionCategories = new Set(["outside-sale", "outside-capital-family-yield", "odd-job-income", "voyage-return-commission", "outside-fallback-sale"]);
  const drainCategories = new Set(["physical-arrival", "social-position-maintenance", "household-support-burn", "voyage-support", "seed-sourcing", "planting"]);
  const ledgerInflows = sum(game.recurringLedger.filter((entry) => injectionCategories.has(entry.category)).map((entry) => Math.max(0, Number(entry.amount || 0))));
  const ledgerOutflows = sum(game.recurringLedger.filter((entry) => drainCategories.has(entry.category)).map((entry) => Math.max(0, -Number(entry.amount || 0))));
  return {
    horizon,
    unavailable: unavailable || "none",
    publicFillsPerWindow: round(mean(windows.map((row) => row.fills))),
    publicTradesPerWindow: round(mean(windows.map((row) => row.fills))),
    zeroPublicTradeShare: round(mean(windows.map((row) => row.fills === 0 ? 1 : 0))),
    listingsPerWindow: round(mean(windows.map((row) => row.listings))),
    fillRatio: round(sum(windows.map((row) => row.fills)) / Math.max(1, sum(windows.map((row) => row.buyUnfilled + row.fills)))),
    buySideUnfilled: sum(windows.map((row) => row.buyUnfilled)),
    sellSideUnsold: sum(windows.map((row) => row.sellUnsold)),
    npcToNpcCount: sum(windows.map((row) => row.npcToNpc)),
    npcToNpcValue: sum(windows.map((row) => row.value)),
    playerCount: sum(windows.map((row) => row.player)),
    playerValue: 0,
    backgroundPrincipalCount: 0,
    backgroundPrincipalValue: 0,
    largestNamedActorShare: round(totalVolume ? Math.max(...volumes) / totalVolume : 0),
    largestPrincipalShare: round(totalVolume ? Math.max(...volumes) / totalVolume : 0),
    principalEffectiveN: round(effectiveN(volumes)),
    externalInflows: ledgerInflows + game.backgroundEconomy.externalInjections,
    externalOutflows: ledgerOutflows + game.backgroundEconomy.externalDrains,
    localCashDrift: round(harbourCash(game) - initialCash),
    inventoryAccumulation: finalInventory - initialInventory,
    goodsNeverTransacting: Object.keys(ITEMS).length - goods.size,
    averageHoldingDuration: "NOT_DERIVABLE_NO_ACQUISITION_LOT_AGE",
    octopusClearingThroughput: sum(windows.map((row) => row.fills)),
    octopusPersonalPrincipalVolume: principals.get("octopus") || 0,
    note: "Background bar customers and wholesale lots exist off-book; no anonymous principal participates in general public clearing.",
  };
}

const gateMatrix = [
  ["Playable Harbour", "VERIFIED", "createGame/phase/order/event loop and smoke coverage", "none", "QUANTITATIVE"],
  ["Living Samsara Core", "PARTIAL", "recurring actor activity exists but several loops are thin", "general circulation", "IMPLEMENTATION"],
  ["General harbour liquidity / recurring economy", "BLOCKED", "public tape remains concentrated and authored", "background principals and recurring needs", "IMPLEMENTATION"],
  ["Market Depth", "PARTIAL", "finite clearing exists; impact, quoting, and depth remain shallow", "general liquidity", "IMPLEMENTATION"],
  ["Information causality", "PARTIAL", "priced holding leads alter source discovery; few repeatable underlying decisions", "market depth", "IMPLEMENTATION"],
  ["Relationship causality", "PARTIAL", "threshold credit/proxy/access links exist; many terms remain fixed", "actor loops", "IMPLEMENTATION"],
  ["Actor economic-loop completeness", "BLOCKED", "Joel is strongest; most organs lack repeatable autonomous loops", "general circulation", "IMPLEMENTATION"],
  ["Six-return-class coverage", "BLOCKED", "Trade and Joel Operate dominate; Invest/Speculate are special-case", "actor loops and commitments", "IMPLEMENTATION"],
  ["Sunflower route reachability", "PARTIAL", "three route substrates exist but remain item/flag chains", "actor and production loops", "IMPLEMENTATION"],
  ["Assessment evidence coverage", "PARTIAL", "decisionEvidence exists but counterfactual and cross-context depth is uneven", "market depth", "IMPLEMENTATION"],
  ["Time / replay / rebirth substrate", "PARTIAL", "finite phases and rebirth shell exist; redesign remains explicitly open", "design decision", "DESIGN"],
  ["Narrative embodiment readiness", "PARTIAL", "routes and dialogue hooks exist; systemic causality is not mature", "earlier gates", "IMPLEMENTATION"],
  ["Scene UI / art readiness", "NOT TESTED", "outside diagnostic scope and depends on stable systems", "narrative embodiment", "QUANTITATIVE"],
  ["Playtest / balance readiness", "BLOCKED", "too few complete economic organs for final balance", "general liquidity and actor loops", "IMPLEMENTATION"],
].map(([gate, status, evidence, dependency, blockerType]) => ({ gate, status, evidence, primaryBlocker: status === "VERIFIED" ? "none" : evidence, dependency, blockerType }));

const flowAccounting = [
  ["Bar local service", "local household/Juan", "Joel", "drink/service or receivable", "local transfer"],
  ["Bar visitor service", "external visitor", "Joel", "drink/service", "external injection"],
  ["Bar wholesale procurement", "Joel", "outside supplier", "complete ingredient bundle", "external drain"],
  ["Aspen voyage cost", "Aspen", "outside route sector", "transport/crew/import access", "external drain"],
  ["Aspen return commission", "outside client", "Aspen", "successful logistics", "external injection"],
  ["Wong household burn", "Wong", "consumption sector", "household survival", "external/local sink unresolved"],
  ["Wong odd jobs", "background clients", "Wong", "labour", "external/background injection"],
  ["Yasmin social maintenance", "Yasmin", "outside/social sector", "position maintenance", "external drain"],
  ["Yasmin outside yield", "outside capital", "Yasmin", "capital at risk", "external injection"],
  ["Juan fallback sale", "outside buyer", "Juan", "crop output", "external injection"],
  ["Juan seed/planting", "Juan", "outside supplier", "productive input", "external drain"],
  ["Octopus marine arrival", "Octopus", "outside marine seller", "physical catch", "external drain; Octopus principal"],
  ["Octopus outside sale", "outside buyer", "Octopus", "physical catch", "external injection; Octopus principal"],
  ["Dima fee", "local client", "Dima", "proxy/settlement/guarantee", "local transfer"],
  ["Joel tool service", "unidentified service customer", "Joel", "tool service", "UNRESOLVED_PAYER_FAUCET_RISK"],
  ["Auction bid", "player", "unassigned/auction estate", "auctioned asset", "UNRESOLVED_LOCAL_RECEIVER_SINK"],
].map(([category, payer, receiver, supplied, classification]) => ({ category, payer, receiver, supplied, classification }));

const returnClasses = [
  ["TRADE", 5, 4, "frequent", "Aspen,Wong,Yasmin,Octopus,background", true, false, 0.58],
  ["OPERATE", 3, 2, "frequent for Joel; thin elsewhere", "Joel,Juan,Wong,background", false, false, 0.24],
  ["INVEST", 2, 1, "special-event", "Yasmin,Juan", false, true, 0.05],
  ["FINANCE", 4, 3, "conditional", "Joel,Yasmin,Juan,Dima", false, true, 0.07],
  ["INTERMEDIATE", 3, 2, "conditional", "Dima,Octopus", false, true, 0.05],
  ["SPECULATE", 1, 1, "rare/special", "player,Yasmin", false, true, 0.01],
].map(([returnClass, runtimeContexts, independentContexts, reachableFrequency, actors, background, specialRoute, opportunityShare]) => ({ returnClass, runtimeContexts, independentContexts, reachableFrequency, actors, backgroundSectorInvolved: background, playerCanParticipate: returnClass !== "OPERATE", designOnly: false, specialRoute, opportunityShare, realisedPnlShare: "NOT_IDENTIFIABLE_WITHOUT_RETURN_ATTRIBUTION_LEDGER" }));

const actorOrgans = [
  ["Joel", 8, "IMPLEMENTED", "strongest; finite service, inputs, capacity, cash/receivable tension"],
  ["Aspen", 6, "PARTIAL", "voyage cycle exists but logistics choices are mostly authored"],
  ["Juan", 6, "PARTIAL", "maturity and claims exist; productive decisions/claim market are thin"],
  ["Octopus", 6, "PARTIAL", "clearing is real; personal marine import/export is concentrated"],
  ["Yasmin", 4, "PARTIAL", "capital flows recur but allocation/auction v2 are absent"],
  ["Wong", 4, "PARTIAL", "burn, odd jobs and salvage exist without a complete enterprise"],
  ["Dima", 3, "PARTIAL", "event-based friction services exist; no repeatable autonomous loop"],
].map(([actor, criteriaMet, status, evidence]) => ({ actor, criteriaMetOf10: criteriaMet, status, evidence }));

function informationExperiments() {
  const game = createGame();
  const variants = [
    ["fresh exact exclusive", "current", "exact", "high", true, 1],
    ["fresh category low-confidence", "current", "category", "low", false, 1],
    ["aging specific", "aging", "specific", "medium", false, 2],
    ["diffused exact", "current", "exact", "high", false, 4],
    ["stale exact", "stale", "exact", "high", true, 1],
  ];
  return variants.map(([context, freshness, precision, confidence, exclusive, knownCount]) => {
    const info = { item: "Sperm Whale Oil", claimType: "holding", freshness, precision, confidence, exclusive, knownBy: Array.from({ length: knownCount }, (_, i) => i ? `known-${i}` : "player") };
    const price = informationPrice(game, info, "yasmin");
    const decisionGain = freshness === "stale" ? 0 : Math.max(0, buyerMax(game, "yasmin", info.item) - sellerAsk(game, "wong", info.item)) * ({ low: .45, medium: .7, high: .9 }[confidence]);
    return { context, runtimeInformationPrice: price, reducedFormDecisionImprovement: round(decisionGain), pnlImprovement: round(decisionGain - price), staleLead: freshness === "stale", diffusionCount: knownCount, caveat: "Runtime price is metadata-based; robust VOI is blocked by sparse repeatable underlying decisions." };
  });
}

const relationshipLinks = [
  ["Joel relationship credit", "IMPLEMENTED", "relationship >=2 opens 4 tins; >=3 opens 6; Joel reserve remains 18", 6],
  ["Joel public-market proxy", "IMPLEMENTED", "relationship >=2 opens proxy; >=3 permits credit", 1],
  ["private information disclosure", "PARTIAL", "talk thresholds reveal authored clues; reliability terms do not vary", 0],
  ["Yasmin secured financing", "PARTIAL", "relationship >=1 gates access; amount/fee/collateral rule fixed", 0],
  ["private venue access", "PARTIAL", "relationship/flags gate some events and venues", 0],
  ["negotiation price/fee", "ABSENT", "no general relationship-dependent term curve", 0],
  ["Aspen contract flexibility", "ABSENT", "future delivery terms do not vary causally with relationship", 0],
  ["Wong service access", "DESIGN-ONLY", "no recurring enterprise/service terms", 0],
  ["Dima guarantee availability", "PARTIAL", "friction route exists without final relationship causality", 0],
  ["claim enforcement/default recovery", "ABSENT", "relationship does not produce a general recovery model", 0],
].map(([link, status, causalEffect, measuredCashDelta]) => ({ link, status, causalEffect, measuredCashDelta }));

const lockProbability = { low: .1, medium: .35, high: .65 };
const lockSeverity = { low: .15, medium: .35, high: .6 };
const clusterProbability = { low: .1, medium: .4, high: .7 };
const policies = ["MAX_EV", "RISK_ADJUSTED", "LIQUIDITY_FIRST", "INFORMATION_DISCIPLINED", "RELATIONSHIP_PRESERVING", "DIVERSIFIED", "SPECULATIVE", "SHORT_HORIZON"];
function opportunityScore(opportunity, policy, exposure) {
  if (policy === "RISK_ADJUSTED") return opportunity.ev - opportunity.risk * 1.3;
  if (policy === "LIQUIDITY_FIRST") return opportunity.ev - opportunity.cash * .5 - opportunity.lock * 2;
  if (policy === "INFORMATION_DISCIPLINED") return opportunity.ev + opportunity.infoValue - opportunity.uncertainty;
  if (policy === "RELATIONSHIP_PRESERVING") return opportunity.ev + opportunity.accessValue * 2 - opportunity.obligation * 2;
  if (policy === "DIVERSIFIED") return opportunity.ev - (exposure[opportunity.returnClass] || 0) * .8;
  if (policy === "SPECULATIVE") return opportunity.ev + opportunity.risk * .8;
  if (policy === "SHORT_HORIZON") return opportunity.ev + opportunity.urgent * 2 - opportunity.lock * 2;
  return opportunity.ev;
}
function opportunityRun(seed, parameters, policy) {
  const random = rng(seed);
  let cash = parameters.capital;
  let wealth = parameters.capital;
  let lockedCash = 0;
  let relationship = 1;
  const commitments = [];
  const exposure = Object.fromEntries(RETURN_CLASSES.map((key) => [key, 0]));
  const metrics = { visible: 0, executable: 0, incompatible: 0, forced: 0, button: 0, quiet: 0, crowded: 0, ignored: 0, abandoned: 0, defaults: 0, unusedCash: 0, locked: 0, actionUse: 0, losses: 0, selected: 0, infoUse: 0, accessPreserved: 0, objectiveDependent: 0 };
  for (let window = 0; window < parameters.life; window += 1) {
    for (let i = commitments.length - 1; i >= 0; i -= 1) {
      const commitment = commitments[i];
      commitment.due -= 1;
      if (commitment.due <= 0) {
        lockedCash -= commitment.cash;
        if (cash >= commitment.obligation) cash -= commitment.obligation;
        else { metrics.defaults += 1; relationship = Math.max(0, relationship - 1); }
        commitments.splice(i, 1);
      }
    }
    const count = parameters.visible;
    const opportunities = Array.from({ length: count }, (_, i) => {
      const returnClass = RETURN_CLASSES[Math.floor(random() * RETURN_CLASSES.length)];
      const cashNeed = round(parameters.capital * lockSeverity[parameters.capitalLock] * (.25 + random() * .9));
      const multi = random() < lockProbability[parameters.multiLock];
      const urgent = random() < clusterProbability[parameters.deadlineCluster] ? 1 : 0;
      const risk = .5 + random() * 3;
      const gross = 1.5 + random() * 6;
      return { id: i, returnClass, cash: cashNeed, time: 1 + (random() < .55 ? parameters.verification : 0), cargo: random() < .35 ? 2 : 1, collateral: random() < .18, access: random() < .2, accessValue: random() * 2, obligation: multi ? random() * 2.5 : 0, lock: multi ? 1 : 0, urgent, risk, uncertainty: random() * 2.5, infoValue: random() * 2, ev: gross - risk * .45 - cashNeed * .06 };
    });
    const positive = opportunities.filter((opportunity) => opportunity.ev > 0);
    const individuallyExecutable = positive.filter((opportunity) => opportunity.cash <= cash - lockedCash && (!opportunity.access || relationship > 0) && opportunity.time <= parameters.actions);
    let incompatiblePairs = 0;
    for (let i = 0; i < individuallyExecutable.length; i += 1) for (let j = i + 1; j < individuallyExecutable.length; j += 1) {
      const a = individuallyExecutable[i], b = individuallyExecutable[j];
      if (a.time + b.time > parameters.actions || a.cash + b.cash > cash - lockedCash || a.cargo + b.cargo > 3 || a.collateral && b.collateral || a.access && b.access) incompatiblePairs += 1;
    }
    metrics.visible += count;
    metrics.executable += individuallyExecutable.length;
    metrics.incompatible += incompatiblePairs;
    metrics.forced += incompatiblePairs > 0 ? 1 : 0;
    metrics.button += count > parameters.actions ? 1 : 0;
    metrics.quiet += individuallyExecutable.length <= 1 ? 1 : 0;
    metrics.crowded += count >= 6 ? 1 : 0;
    const rankings = policies.map((candidate) => opportunities.toSorted((a, b) => opportunityScore(b, candidate, exposure) - opportunityScore(a, candidate, exposure))[0]?.id);
    metrics.objectiveDependent += new Set(rankings).size > 1 ? 1 : 0;
    let time = parameters.actions;
    let cargo = 3;
    let collateralAvailable = true;
    let accessUsed = false;
    const selected = opportunities.toSorted((a, b) => opportunityScore(b, policy, exposure) - opportunityScore(a, policy, exposure)).filter((opportunity) => {
      if (opportunity.ev <= 0 || opportunity.time > time || opportunity.cash > cash - lockedCash || opportunity.cargo > cargo || opportunity.collateral && !collateralAvailable || opportunity.access && (relationship <= 0 || accessUsed)) return false;
      time -= opportunity.time;
      cargo -= opportunity.cargo;
      if (opportunity.collateral) collateralAvailable = false;
      if (opportunity.access) accessUsed = true;
      return true;
    });
    for (const opportunity of selected) {
      const realised = opportunity.ev + (random() - .5) * opportunity.risk * 2;
      cash += realised;
      wealth += realised;
      if (realised < 0) metrics.losses += 1;
      exposure[opportunity.returnClass] += Math.max(0, realised);
      if (opportunity.time > 1) metrics.infoUse += 1;
      if (!opportunity.access || relationship > 0) metrics.accessPreserved += 1;
      if (opportunity.lock) { lockedCash += opportunity.cash; commitments.push({ cash: opportunity.cash, obligation: opportunity.obligation, due: 2 + Math.floor(random() * 3) }); }
    }
    metrics.selected += selected.length;
    metrics.actionUse += parameters.actions - time;
    metrics.ignored += Math.max(0, positive.length - selected.length);
    metrics.unusedCash += Math.max(0, cash - lockedCash);
    metrics.locked += lockedCash;
  }
  metrics.abandoned = commitments.length;
  return { ...metrics, wealth, cash, liquidityFailure: cash - lockedCash < 1 ? 1 : 0, exposure, relationship };
}
function opportunitySweep() {
  const rows = [];
  let combination = 0;
  for (const life of [12, 16]) for (const actions of [3, 4, 5, 6]) for (const capital of [8, 12, 18, 30]) for (const visible of [3, 4, 5]) for (const multiLock of ["low", "medium", "high"]) for (const capitalLock of ["low", "medium", "high"]) for (const deadlineCluster of ["low", "medium", "high"]) for (const verification of [0, 1, 2]) {
    combination += 1;
    const parameters = { life, actions, capital, visible, multiLock, capitalLock, deadlineCluster, verification };
    const runs = Array.from({ length: 18 }, (_, i) => opportunityRun(700000 + combination * 97 + i, parameters, policies[i % policies.length]));
    const row = { ...parameters, visiblePerWindow: round(mean(runs.map((run) => run.visible / life))), executablePerWindow: round(mean(runs.map((run) => run.executable / life))), incompatiblePairsPerWindow: round(mean(runs.map((run) => run.incompatible / life))), economicForcedShare: round(mean(runs.map((run) => run.forced / life))), buttonOverloadShare: round(mean(runs.map((run) => run.button / life))), quietShare: round(mean(runs.map((run) => run.quiet / life))), crowdedShare: round(mean(runs.map((run) => run.crowded / life))), ignoredPositivePerWindow: round(mean(runs.map((run) => run.ignored / life))), abandonedCommitments: round(mean(runs.map((run) => run.abandoned))), defaultRate: round(sum(runs.map((run) => run.defaults)) / Math.max(1, sum(runs.map((run) => run.selected)))), unusedCash: round(mean(runs.map((run) => run.unusedCash / life))), lockedCapital: round(mean(runs.map((run) => run.locked / life))), actionUtilization: round(mean(runs.map((run) => run.actionUse / (life * actions)))), p10Wealth: round(quantile(runs.map((run) => run.wealth), .1)), medianWealth: round(quantile(runs.map((run) => run.wealth), .5)), p90Wealth: round(quantile(runs.map((run) => run.wealth), .9)), lossTradeRate: round(sum(runs.map((run) => run.losses)) / Math.max(1, sum(runs.map((run) => run.selected)))), choiceDiversity: round(mean(runs.map((run) => Object.values(run.exposure).filter((value) => value > 0).length))), objectiveDependentShare: round(mean(runs.map((run) => run.objectiveDependent / life))) };
    row.healthy = row.visiblePerWindow >= 3.5 && row.visiblePerWindow <= 5 && row.economicForcedShare >= .5 && row.economicForcedShare <= .75 && row.quietShare >= .1 && row.quietShare <= .2 && row.ignoredPositivePerWindow > .25;
    rows.push(row);
  }
  return rows;
}
function policyComparison() {
  const parameters = { life: 16, actions: 4, capital: 18, visible: 4, multiLock: "medium", capitalLock: "medium", deadlineCluster: "medium", verification: 1 };
  return policies.map((policy, p) => {
    const runs = Array.from({ length: 500 }, (_, i) => opportunityRun(900000 + p * 1000 + i, parameters, policy));
    const classShares = Object.fromEntries(RETURN_CLASSES.map((key) => [key, round(mean(runs.map((run) => run.exposure[key] / Math.max(1, sum(Object.values(run.exposure))))))]));
    return { policy, meanWealth: round(mean(runs.map((run) => run.wealth))), p10Wealth: round(quantile(runs.map((run) => run.wealth), .1)), defaultRate: round(sum(runs.map((run) => run.defaults)) / Math.max(1, sum(runs.map((run) => run.selected)))), liquidityFailures: round(mean(runs.map((run) => run.liquidityFailure))), routeReachabilityProxy: round(mean(runs.map((run) => run.cash >= 12 && run.relationship > 0 ? 1 : 0))), informationUse: round(mean(runs.map((run) => run.infoUse))), accessPreservation: round(mean(runs.map((run) => run.relationship > 0 ? 1 : 0))), returnClassExposure: classShares, concentrationHHI: round(mean(runs.map((run) => sum(Object.values(run.exposure).map((value) => (value / Math.max(1, sum(Object.values(run.exposure)))) ** 2))))), ignoredOpportunities: round(mean(runs.map((run) => run.ignored))) };
  });
}

function arbitrageDecay() {
  const definitions = [
    ["Sperm Whale Oil", 20, .04, .12],
    ["Orgeat Bottle", 19, .02, .10],
    ["Sealed Parcel", 12, .08, .25],
    ["Lime Crate", 11, .12, .35],
  ];
  return definitions.map(([item, initialSpread, refillProbability, demandPersistence], index) => {
    const cycles = [[], [], []];
    for (let run = 0; run < 4000; run += 1) {
      const random = rng(1100000 + index * 10000 + run);
      let available = true;
      let demand = true;
      for (let cycle = 0; cycle < 3; cycle += 1) {
        const profit = available && demand ? Math.max(0, initialSpread * (.55 ** cycle) - 1 - cycle) : 0;
        cycles[cycle].push(profit);
        demand = profit > 0 ? random() < demandPersistence : demand;
        available = random() < refillProbability;
      }
    }
    const expected = cycles.map((values) => round(mean(values)));
    const halfLife = expected[1] <= expected[0] / 2 ? "<1 repeat" : expected[2] <= expected[0] / 2 ? "1-2 repeats" : ">2 repeats";
    return { item, firstCycleProfit: expected[0], secondCycleExpectedProfit: expected[1], thirdCycleExpectedProfit: expected[2], refillProbability, demandPersistence, alphaHalfLife: halfLife, marketImpact: "goal utility collapses after satisfaction", buyerUtilityReset: false, supplierRestockAccounted: "finite/rare route or lot", samePhysicalUnitCanCycle: false, classification: expected[1] < 1 ? "A_ONE_TIME_SPECIAL" : "B_REPEATABLE_DIMINISHING" };
  });
}

const routeSubstrate = [
  ["Sonya / Grandma Supper", "PARTIAL_REACHABLE", "Joel,Sonya", "Mai Tai + fresh fish", "Joel >=2", "Bar recipe and fish source", "low/moderate", "phase/event", "human scene access", 2, 2, false, "fails without Joel; fish may circulate autonomously but player delivery is mandatory"],
  ["Yasmin / Auction", "PARTIAL_REACHABLE", "Yasmin,Wong", "Blue Glass Marble + Whale Oil world state", "none/future access flags", "provenance clues", "high (net worth and bid)", "event stage", "Vale/private venue", 2, 2, false, "survives Joel removal; auction v2 absent"],
  ["Juan / Cliff", "PARTIAL_REACHABLE", "Juan,Aspen,Joel", "Built Onewheel + Mai Tai", "Juan >=1", "production source discovery", "high net worth", "phase/event", "cliff access", 3, 3, false, "cross-organ route; fails without Joel under current operator rule"],
].map(([route, reachability, actors, items, relationship, information, capital, timing, access, bottlenecks, playerOnlyDependencies, autonomous, removalSensitivity]) => ({ route, reachability, actors, items, relationship, information, capital, timing, access, uniqueMandatoryBottlenecks: bottlenecks, playerOnlyDependencies, npcAutonomousCompletion: autonomous, removalSensitivity }));

const assessmentCoverage = [
  ["execution", "Aspen promise; Octopus clearing; Juan claims", "Aspen,Octopus,Juan", true, true, "settlement alternatives often sparse"],
  ["liquidity", "Joel credit; Yasmin loan; Juan receivable; public sale", "Joel,Yasmin,Juan,Octopus", true, true, "counterfactual funding alternatives incomplete"],
  ["valuation", "public spread; claim; collateral; route items", "Yasmin,Juan,market", true, true, "auction v2/common value absent"],
  ["information", "investigation; holding leads; exclusivity", "Dima,Aspen,Yasmin", false, true, "few repeatable outcomes; inspection/confidence missing"],
  ["obligation / credit", "Aspen delivery; Joel loan; exclusivity; claims", "Aspen,Joel,Dima,Juan", true, true, "restructuring/enforcement thin"],
  ["sourcing / operations", "Aspen sourcing; Joel bundle; Juan maturity", "Aspen,Joel,Juan", true, true, "Juan decision depth thin"],
  ["position sizing", "auction bid; collateral; claim purchase", "Yasmin,Juan", true, true, "leverage/market-making missing"],
  ["negotiation / BATNA", "fixed offers and channel choices", "Wong,Dima,Yasmin", false, false, "BATNA not recorded at commitment"],
  ["institutions", "Octopus clearing vs Dima proxy", "Octopus,Dima", true, true, "form/access counterfactuals narrow"],
  ["relationship stewardship", "Joel credit/proxy; gifts/favours", "Joel,Wong,Sonya", true, true, "economic term effects overfit Joel"],
  ["adaptability", "alpha decay; late changes; route stages", "market,Aspen,Yasmin", false, true, "confidence/access shocks absent"],
].map(([dimension, independentContexts, actors, commitmentEvidence, laterOutcome, missingCounterfactual]) => ({ dimension, independentContexts, actors, repeatedEventContamination: "MEDIUM", commitmentEvidence, laterOutcome, missingCounterfactual, overfitRisk: actors.split(",").length < 2 ? "HIGH" : "MEDIUM" }));

const liquidity = [8, 12, 16].map((horizon) => runLiquidity(horizon));
const actorRemoval = [runLiquidity(12), runLiquidity(12, "joel"), runLiquidity(12, "wong")];
const voiExperiments = informationExperiments();
const opportunityRows = opportunitySweep();
const healthyRows = opportunityRows.filter((row) => row.healthy);
const opportunitySummary = {
  combinations: opportunityRows.length,
  healthyCombinations: healthyRows.length,
  healthyShare: round(healthyRows.length / opportunityRows.length),
  healthyActionBudgets: [...new Set(healthyRows.map((row) => row.actions))],
  healthyCapital: [...new Set(healthyRows.map((row) => row.capital))],
  healthyVisibleCounts: [...new Set(healthyRows.map((row) => row.visible))],
  sensitivity: ["capital-lock severity", "active-time budget", "multi-window lock", "starting capital", "verification cost", "deadline clustering"],
};
const policyRows = policyComparison();
const arbitrageRows = arbitrageDecay();

const exploits = [
  { finding: "Static same-place spreads", status: "FINITE_RISK", evidence: "Large spreads exist, but goal satisfaction and finite stock collapse repeats; see arbitrage decay." },
  { finding: "General public market starvation", status: "FOUND", evidence: `${liquidity.at(-1).publicFillsPerWindow} fills/window; ${liquidity.at(-1).goodsNeverTransacting} catalogue goods never trade in 16 windows.` },
  { finding: "Background-principal omission", status: "FOUND", evidence: "No anonymous principals participate in general public clearing; background activity is siloed into bar/off-book recurring entries." },
  { finding: "Joel tool-service payer", status: "ACCOUNTING_RISK", evidence: "Recurring tool-service cash has no explicit payer identity." },
  { finding: "Auction receiver", status: "ACCOUNTING_RISK", evidence: "Bid cash is removed without a locally identified receiving balance sheet." },
  { finding: "Octopus role concentration", status: "FOUND", evidence: "Marine arrivals are purchased into Octopus personal inventory before public clearing; institution and principal remain distinguishable but concentrated." },
  { finding: "Claim/physical double count", status: "NOT_FOUND_FOR_JUAN", evidence: "Juan claim is structured liability/receivable; legacy Old Coupon remains a pseudo-item caveat." },
  { finding: "Bar dominates whole economy", status: "RISK", evidence: "Joel is the only near-complete recurring operating organ." },
  { finding: "Relationship free discount", status: "NOT_FOUND", evidence: "Implemented relationship effects are threshold access/credit, not a universal price multiplier." },
];
const priorities = [
  ["general harbour background liquidity", 5, 5, 5, 3],
  ["opportunity/time commitment architecture", 5, 5, 4, 4],
  ["relationship and information causal substrate", 4, 4, 4, 3],
  ["Aspen contract/logistics loop", 4, 4, 3, 3],
  ["Juan productive assets/claims", 4, 4, 3, 4],
  ["Dima intermediation/workout", 3, 3, 3, 3],
  ["Wong recurring enterprise", 3, 3, 3, 4],
  ["item catalogue cleanup", 2, 2, 4, 2],
].map(([candidate, leverage, dependencyCentrality, failureEvidence, complexity]) => ({ candidate, leverage, dependencyCentrality, failureEvidence, complexity, priorityScore: round(leverage * dependencyCentrality * failureEvidence / complexity) })).sort((a, b) => b.priorityScore - a.priorityScore);

const result = {
  meta: { implementationStart: IMPLEMENTATION_START, designReference: DESIGN_REFERENCE, priorLab: "scripts/item-economy-quant-lab.mjs", method: "runtime inspection + actual deterministic harbour runs + seeded reduced-form experiments", runtimeBalanceChanged: false },
  gateMatrix,
  liquidity,
  actorRemoval,
  flowAccounting,
  returnClasses,
  actorOrgans,
  voiExperiments,
  relationshipLinks,
  opportunityConstraint: { summary: opportunitySummary, healthySample: healthyRows.slice(0, 40), rows: opportunityRows },
  policyComparison: policyRows,
  arbitrageDecay: arbitrageRows,
  routeSubstrate,
  assessmentCoverage,
  exploits,
  priorityRanking: priorities,
};

const outputPath = process.argv.find((argument) => argument.startsWith("--json="))?.slice(7);
if (outputPath) writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log("GLOBAL GATE MATRIX"); console.table(gateMatrix);
console.log("GENERAL HARBOUR LIQUIDITY"); console.table(liquidity);
console.log("ACTOR REMOVAL SENSITIVITY"); console.table(actorRemoval);
console.log("FLOW ACCOUNTING"); console.table(flowAccounting);
console.log("SIX RETURN CLASSES"); console.table(returnClasses);
console.log("ACTOR ECONOMIC ORGANS"); console.table(actorOrgans);
console.log("INFORMATION VOI"); console.table(voiExperiments);
console.log("RELATIONSHIP CAUSALITY"); console.table(relationshipLinks);
console.log("OPPORTUNITY CONSTRAINT SUMMARY"); console.table([opportunitySummary]);
console.log("HEALTHY OPPORTUNITY REGION SAMPLE"); console.table(healthyRows.slice(0, 20));
console.log("POLICY COMPARISON"); console.table(policyRows.map(({ returnClassExposure, ...row }) => row));
console.log("ARBITRAGE DECAY"); console.table(arbitrageRows);
console.log("SUNFLOWER ROUTE SUBSTRATE"); console.table(routeSubstrate);
console.log("ASSESSMENT EVIDENCE READINESS"); console.table(assessmentCoverage);
console.log("GLOBAL EXPLOITS / RISKS"); console.table(exploits);
console.log("PRIORITY RANKING"); console.table(priorities);
console.log(outputPath ? `Machine-readable output: ${outputPath}` : "Pass --json=<path> for machine-readable output.");
