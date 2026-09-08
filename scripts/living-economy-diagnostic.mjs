import fs from "node:fs";
import {
  advanceHarbourWindow,
  assertHarbourInvariants,
  availableCash,
  contentGraph,
  createHarbourWorld,
  economicTerms,
  meetContact,
  phoneContact,
  placePublicOrder,
} from "../src/harbourSpine.js";
import {
  CLAIM_TYPES,
  LEGACY_REJECTED,
  LIVING_ASSET_FAMILIES,
  NIGHT_MENU_MASTER,
  SERVICE_TYPES,
} from "../src/economicContent.js";
import { contentTransitionCapabilities, dayActivity, executableContentAudit } from "../src/livingSystems.js";

const outputArg = process.argv.find((value) => value.startsWith("--json="));
const namedIds = ["joel", "aspen", "wong", "juan", "yasmin", "dima"];

function inventoryValue(world) {
  return Object.values(world.actors).reduce(
    (sum, actor) => sum + actor.inventory.reduce((subtotal, unit) => subtotal + unit.costBasis, 0),
    0,
  );
}

function livingValue(world) {
  return world.livingAssets.reduce((sum, asset) => {
    const definition = LIVING_ASSET_FAMILIES[asset.species];
    return sum + definition.inputCost + asset.maturity / definition.maturityDays * 5 * asset.health;
  }, 0);
}

function simulate(days, config = {}, suppressed = []) {
  let world = createHarbourWorld(41, config);
  const initialCash = Object.values(world.actors).reduce((sum, actor) => sum + actor.cash, 0);
  const daily = [];
  for (let index = 0; index < days; index++) {
    for (const actorId of suppressed) world.actors[actorId].capacity = 0;
    world = advanceHarbourWindow(world);
    const invariants = assertHarbourInvariants(world);
    if (!Object.values(invariants).slice(0, 5).every(Boolean)) {
      throw new Error(`Invariant failure day ${world.day}: ${JSON.stringify(invariants)}`);
    }
    daily.push({
      day: world.day,
      ...dayActivity(world, world.day),
      fills: world.market.tape.filter((row) => row.day === world.day).length,
      privateTransactions: world.privateTransactions.filter((row) => row.day === world.day).length,
      actions: Object.fromEntries(namedIds.map((id) => [id, world.actors[id].actions.length])),
    });
  }
  return { world, daily, initialCash };
}

function summarize(days, config = {}, suppressed = []) {
  const { world, daily, initialCash } = simulate(days, config, suppressed);
  const publicFills = world.market.tape.length;
  const backgroundFills = world.market.tape.filter(
    (row) => world.actors[row.buyerId]?.background || world.actors[row.sellerId]?.background,
  ).length;
  const claims = world.claims.filter((row) => row.status === "open");
  const activityVolume = world.returnLedger.length + publicFills + world.privateTransactions.length;
  const externalIn = world.externalFlows.filter((row) => row.direction === "in").reduce((sum, row) => sum + row.amount, 0);
  const externalOut = world.externalFlows.filter((row) => row.direction === "out").reduce((sum, row) => sum + row.amount, 0);
  const localCash = Object.values(world.actors).reduce((sum, actor) => sum + actor.cash, 0);
  return {
    days,
    publicFills,
    fillsPerDay: publicFills / days,
    publicZeroDays: daily.filter((row) => !row.publicMarket).length,
    privateActiveDays: daily.filter((row) => row.privateTransaction).length,
    operationsActiveDays: daily.filter((row) => row.operations).length,
    productionActiveDays: daily.filter((row) => row.production).length,
    financeActiveDays: daily.filter((row) => row.finance).length,
    intermediationActiveDays: daily.filter((row) => row.intermediation).length,
    anyEconomicActivityDays: daily.filter((row) => row.anyEconomicActivity).length,
    anyWorldStateChangeDays: daily.filter((row) => row.anyWorldStateChange).length,
    trueQuietDays: daily.filter((row) => !row.anyEconomicActivity).length,
    backgroundFillShare: publicFills ? backgroundFills / publicFills : 0,
    uniquePublicGoods: new Set(world.market.tape.map((row) => row.item)).size,
    privateTransactions: world.privateTransactions.length,
    privateValue: world.privateTransactions.reduce((sum, row) => sum + (row.amount || 0), 0),
    joelServices: world.stats.barCustomers,
    joelFailures: world.stats.barFailures,
    wongServices: world.stats.wongJobs + world.parcelJobs.filter((row) => row.custodianId === "wong").length,
    aspenDepartures: world.stats.aspenDepartures,
    aspenReturns: world.stats.aspenReturns,
    juanHarvests: world.stats.juanHarvests,
    yasminLoans: world.stats.yasminLoans,
    dimaServices: world.stats.dimaServices + world.parcelJobs.filter((row) => row.guarantorId === "dima").length,
    scrapGenerated: world.materials.scrapGenerated,
    scrapProcessed: world.materials.scrapProcessed,
    scrapExited: world.materials.scrapExited,
    compostRecoveredValue: world.materials.inputValueRecovered,
    compostProcessingCost: world.materials.processingCost,
    publicFacts: world.publicFacts.length,
    notices: world.evidence.filter((row) => row.type === "fact_noticed").length,
    changedDecisions: world.stats.infoChangedDecisions,
    externalIn,
    externalOut,
    localCash,
    unidentifiedCashDrift: localCash - (initialCash + externalIn - externalOut),
    inventoryValue: inventoryValue(world),
    livingValue: livingValue(world),
    openClaimFace: claims.reduce((sum, row) => sum + row.face, 0),
    cashPerActivity: activityVolume ? Object.values(world.actors).reduce((sum, actor) => sum + actor.cash, 0) / activityVolume : 0,
    returnClasses: Object.fromEntries(
      ["TRADE", "OPERATE", "INVEST", "FINANCE", "INTERMEDIATE", "SPECULATE"].map((name) => [
        name,
        world.returnLedger.filter((row) => row.class === name).length,
      ]),
    ),
    invariants: assertHarbourInvariants(world),
    world,
  };
}

const horizonRows = [30, 60, 100].map((days) => summarize(days));
const schedulerRows = ["equal", "heterogeneous", "variable"].map((scheduler) => {
  const row = summarize(60, { scheduler });
  return {
    scheduler,
    fillsPerDay: row.fillsPerDay,
    anyEconomicActivityDays: row.anyEconomicActivityDays,
    aspenDepartures: row.aspenDepartures,
    joelServices: row.joelServices,
    actorActionRates: Object.fromEntries(
      namedIds.map((id) => [id, row.world.actors[id].actions.length]),
    ),
  };
});

const removalRows = [
  ...namedIds.map((id) => ({ kind: id, ...summarize(30, {}, [id]) })),
  { kind: "octopus_clearing", ...summarize(30, { clearingAvailable: false }) },
  { kind: "background_marine_supply", ...summarize(30, { backgroundSupplyScale: 0 }) },
  { kind: "background_household_demand", ...summarize(30, { backgroundDemandScale: 0 }) },
].map(({ world, ...row }) => row);

const baselineWorld = horizonRows.at(-1).world;
const menuAudit = executableContentAudit(baselineWorld);
const goodsAudit = contentGraph().map((definition) => {
  const sourceEvents = baselineWorld.evidence.filter(
    (row) => row.item === definition.id && ["background_production", "spoilage"].includes(row.type),
  );
  const publicUses = baselineWorld.market.tape.filter((row) => row.item === definition.id);
  const inventoryUses = Object.values(baselineWorld.actors).flatMap((actor) => actor.inventory).filter((unit) => unit.kind === definition.id);
  return {
    id: definition.id,
    mode: definition.mode,
    defined: true,
    sourceMetadata: definition.sources,
    sourceExecutable: contentTransitionCapabilities(definition.id).sourceExecutable,
    sinkMetadata: definition.sinks,
    sinkExecutable: contentTransitionCapabilities(definition.id).sinkExecutable,
    actuallyUsed: publicUses.length + sourceEvents.length > 0,
    usageCount: publicUses.length + sourceEvents.length,
  };
});

let playerBuy = createHarbourWorld();
playerBuy = placePublicOrder(playerBuy, "player", "buy", "Packing Paper", 3);
playerBuy = advanceHarbourWindow(playerBuy);
let playerSell = createHarbourWorld();
playerSell = placePublicOrder(playerSell, "households", "buy", "Fresh Mackerel", 7);
playerSell = placePublicOrder(playerSell, "player", "sell", "Fresh Mackerel", 5);
playerSell = advanceHarbourWindow(playerSell);
let phoneAllowed = meetContact(createHarbourWorld(), "aspen");
phoneAllowed = phoneContact(phoneAllowed, "aspen");
const phoneBlocked = phoneContact(createHarbourWorld(), "aspen");

const informed = simulate(5).world;
const uninformed = simulate(5, { publishNews: false }).world;
const reliableWorld = createHarbourWorld();
const reliableTerms = economicTerms(reliableWorld, "joel");
reliableWorld.actors.joel.reliability = { payment: 1, delivery: 1, representation: 1 };
const unreliableTerms = economicTerms(reliableWorld, "joel");

const material = baselineWorld.materials;
const acceptance = {
  documentedMenuMaster: menuAudit.length === NIGHT_MENU_MASTER.length && menuAudit.every((row) => row.sourceExecutable && row.sinkExecutable),
  backendExecutable: menuAudit.some((row) => row.sourceExecutable && row.mode === "BACKEND_WHOLESALE"),
  compostCausal: material.scrapProcessed > 0 && material.inputValueRecovered <= material.scrapProcessed,
  noWasteArbitrage: material.inputValueRecovered < material.processingCost + material.scrapGenerated,
  toadWorldPresence: baselineWorld.toadCircle.occurrences.length > 0 && !baselineWorld.toadCircle.tradable,
  layeredParcels: baselineWorld.parcelJobs.some((row) => row.custodianId === "wong") && baselineWorld.parcelJobs.some((row) => row.guarantorId === "dima") && baselineWorld.parcelJobs.some((row) => row.paymentRoute === "private_settlement"),
  clearingInstitutional: baselineWorld.market.settlementFloat === 0 && !baselineWorld.actors.octopus,
  wholeHarbourPersists: horizonRows.every((row) => row.trueQuietDays / row.days < 0.1),
  playerBuy: playerBuy.market.tape.some((row) => row.buyerId === "player"),
  playerSell: playerSell.market.tape.some((row) => row.sellerId === "player"),
  informationCausal: informed.stats.infoChangedDecisions > uninformed.stats.infoChangedDecisions,
  phoneBoundary: phoneAllowed.messages.length === 1 && phoneBlocked.messages.length === 0,
  reliabilityCausal: reliableTerms.creditLimit > unreliableTerms.creditLimit && reliableTerms.depositRate < unreliableTerms.depositRate && unreliableTerms.inspectionRequired,
  accounting: horizonRows.every((row) => Object.values(row.invariants).slice(0, 5).every(Boolean)),
  cashFlowReconciles: horizonRows.every((row) => Math.abs(row.unidentifiedCashDrift) < 1e-8),
  actorRemoval: removalRows.every((row) => row.anyEconomicActivityDays > 0),
  namedLoops: horizonRows.at(-1).joelServices > 0 && horizonRows.at(-1).aspenReturns > 0 && horizonRows.at(-1).wongServices > 0 && horizonRows.at(-1).juanHarvests > 0 && horizonRows.at(-1).yasminLoans > 0 && horizonRows.at(-1).dimaServices > 0,
};

if (!Object.values(acceptance).every(Boolean)) {
  throw new Error(`Acceptance failure: ${JSON.stringify(acceptance)}`);
}

const content = {
  physicalGoods: contentGraph().length,
  menuFamilies: NIGHT_MENU_MASTER.length,
  provisionalCanonicalEstimate: 114,
  unresolvedFamiliesFromUnenumeratedReference: Math.max(0, 114 - NIGHT_MENU_MASTER.length),
  livingFamilies: Object.keys(LIVING_ASSET_FAMILIES).length,
  claimTypes: Object.keys(CLAIM_TYPES).length,
  serviceTypes: Object.keys(SERVICE_TYPES).length,
  publicGoods: contentGraph().filter((row) => row.mode === "PUBLIC_MARKET").length,
  backendMenuFamilies: NIGHT_MENU_MASTER.filter((row) => row.mode === "BACKEND_WHOLESALE").length,
  legacyRejected: LEGACY_REJECTED,
  executableGoodsSources: goodsAudit.filter((row) => row.sourceExecutable).length,
  executableGoodsSinks: goodsAudit.filter((row) => row.sinkExecutable).length,
  actuallyUsedGoods: goodsAudit.filter((row) => row.actuallyUsed).length,
  executableMenuSources: menuAudit.filter((row) => row.sourceExecutable).length,
  executableMenuSinks: menuAudit.filter((row) => row.sinkExecutable).length,
  actuallyUsedMenuFamilies: menuAudit.filter((row) => row.actuallyUsed).length,
};

const report = {
  content,
  horizons: horizonRows.map(({ world, ...row }) => row),
  schedulers: schedulerRows,
  removals: removalRows,
  material,
  toadCircle: baselineWorld.toadCircle,
  parcelJobs: baselineWorld.parcelJobs,
  informationCounterfactual: {
    informedChanges: informed.stats.infoChangedDecisions,
    uninformedChanges: uninformed.stats.infoChangedDecisions,
    hiddenTruthLeak: Object.values(informed.actors).some((actor) => actor.knowledge.includes("truth-shoal")),
  },
  reliabilityCounterfactual: { reliableTerms, unreliableTerms },
  goodsAudit,
  menuAudit,
  acceptance,
};

if (outputArg) fs.writeFileSync(outputArg.slice("--json=".length), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
