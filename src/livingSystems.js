import { ECONOMIC_GOODS, NIGHT_MENU_MASTER } from "./economicContent.js";

const RETURN_CLASSES = new Set(["TRADE", "OPERATE", "INVEST", "FINANCE", "INTERMEDIATE", "SPECULATE"]);

function event(world, type, data = {}) {
  const row = { id: `ev${++world.nextEvent}`, day: world.day, type, ...data };
  world.evidence.push(row);
  world.activityLog.push(row);
  return row;
}

function returnEvent(world, returnClass, actorId, amount, context) {
  if (!RETURN_CLASSES.has(returnClass)) throw new Error(`Unknown return class ${returnClass}`);
  world.returnLedger.push({ day: world.day, class: returnClass, actorId, amount, context });
}

function external(world, direction, sector, actorId, reason, amount, returnClass) {
  world.externalFlows.push({ day: world.day, direction, sector, actorId, reason, amount, returnClass });
}

function use(world, family, transition, quantity = 1) {
  const row = world.contentUsage[family] ||= { sourced: 0, sunk: 0, sourceTransitions: {}, sinkTransitions: {} };
  const source = transition.includes("source") || transition.includes("import") || transition.includes("wholesale") || transition.includes("harvest");
  if (source) {
    row.sourced += quantity;
    row.sourceTransitions[transition] = (row.sourceTransitions[transition] || 0) + quantity;
  } else {
    row.sunk += quantity;
    row.sinkTransitions[transition] = (row.sinkTransitions[transition] || 0) + quantity;
  }
}

export function contentTransitionCapabilities(family) {
  const good = ECONOMIC_GOODS[family];
  const menuEntry = NIGHT_MENU_MASTER.find((entry) => entry.family === family);
  if (!good && !menuEntry) return { sourceExecutable: false, sinkExecutable: false };
  return {
    sourceExecutable: Boolean(good?.sources?.length || menuEntry?.sourceTransition),
    sinkExecutable: Boolean(good?.sinks?.length || menuEntry?.sinkTransition),
  };
}

// Generic content transitions are deliberately narrow: they enforce an authored
// source/sink edge and update the same usage ledger as autonomous systems. They
// allow later content to plug in without one bespoke function per ingredient.
export function sourceContent(world, family, { source, recipientId = "joel", quantity = 1, unitCost = 0 } = {}) {
  const good = ECONOMIC_GOODS[family];
  const menuEntry = NIGHT_MENU_MASTER.find((entry) => entry.family === family);
  const allowed = good?.sources?.includes(source) || (menuEntry && source === "wholesale");
  if (!allowed || quantity < 1 || !world.actors[recipientId]) return false;
  if (unitCost > 0 && world.actors[recipientId].cash < unitCost * quantity) return false;
  world.actors[recipientId].cash -= unitCost * quantity;
  if (menuEntry && (!good || good.mode === "BACKEND_WHOLESALE")) {
    world.bar.backendStock[family] = (world.bar.backendStock[family] || 0) + quantity;
  } else {
    for (let index = 0; index < quantity; index++) {
      world.actors[recipientId].inventory.push({
        unitId: `u${++world.nextUnit}`,
        kind: family,
        owner: recipientId,
        age: 0,
        costBasis: good?.value || unitCost,
        source,
        opened: false,
        remaining: good?.servings || 1,
      });
    }
  }
  use(world, family, `${source}_source`, quantity);
  if (unitCost > 0) external(world, "out", source, recipientId, `source_${family}`, unitCost * quantity, "TRADE");
  event(world, "content_sourced", { family, source, recipientId, quantity });
  return true;
}

export function sinkContent(world, family, { sink, ownerId = "joel", quantity = 1 } = {}) {
  const good = ECONOMIC_GOODS[family];
  const menuEntry = NIGHT_MENU_MASTER.find((entry) => entry.family === family);
  const allowed = good?.sinks?.includes(sink) || (menuEntry && sink === "joel_bar");
  if (!allowed || quantity < 1 || !world.actors[ownerId]) return false;
  if ((world.bar.backendStock[family] || 0) >= quantity) {
    world.bar.backendStock[family] -= quantity;
  } else {
    const units = world.actors[ownerId].inventory.filter((unit) => unit.kind === family).slice(0, quantity);
    if (units.length < quantity) return false;
    const ids = new Set(units.map((unit) => unit.unitId));
    world.actors[ownerId].inventory = world.actors[ownerId].inventory.filter((unit) => !ids.has(unit.unitId));
  }
  use(world, family, `${sink}_sink`, quantity);
  event(world, "content_sunk", { family, sink, ownerId, quantity });
  return true;
}

export function initializeLivingSystems(world) {
  world.activityLog = [];
  world.privateTransactions = [];
  world.contentUsage = {};
  world.materials = {
    organicScrap: [],
    compostBatches: [],
    scrapGenerated: 0,
    scrapProcessed: 0,
    scrapExited: 0,
    inputValueRecovered: 0,
    processingCost: 0,
  };
  world.parcelJobs = [];
  world.toadCircle = {
    kind: "social_world_presence",
    members: ["juan", "aspen", "wong"],
    location: "juan_nursery",
    nextGatheringDay: 9,
    occurrences: [],
    tradable: false,
    ownedBy: null,
  };
  world.bar.masterFamilies = NIGHT_MENU_MASTER.map((entry) => entry.family);
  world.bar.backendStock = {};
  world.bar.wholesaleLotsRemaining = 16;
  world.bar.activeFamilies = ["Rum", "Lime", "Pineapple", "Mint", "Soda", "Ice", "Orgeat", "Orange Curaçao"];
  world.backgroundState = {
    householdWorkCapacity: 24,
    crewVoyagesRemaining: 16,
    boatTripsRemaining: 20,
    wharfImportLotsRemaining: 20,
  };
  world.claimRights = {
    tabs: [],
    deliveryContracts: [],
    guarantees: [],
    exclusivity: [],
  };
  return world;
}

export function recordSpoilage(world, unit, ownerId) {
  if (!ECONOMIC_GOODS[unit.kind]?.shelfLife) return;
  const scrap = {
    id: `scrap-${unit.unitId}`,
    sourceUnitId: unit.unitId,
    custodianId: ownerId === "joel" ? "wong" : ownerId,
    originalOwnerId: ownerId,
    costBasis: unit.costBasis,
    createdDay: world.day,
    status: "unprocessed",
  };
  world.materials.organicScrap.push(scrap);
  world.materials.scrapGenerated++;
  use(world, unit.kind, "spoilage_sink");
  event(world, "organic_scrap_created", { scrapId: scrap.id, item: unit.kind, ownerId, custodianId: scrap.custodianId });
}

function processCompost(world) {
  const capacity = 2;
  const candidates = world.materials.organicScrap.filter((row) => row.status === "unprocessed").slice(0, capacity);
  for (const scrap of candidates) {
    const juan = world.actors.juan;
    world.materials.processingCost += 1;
    scrap.status = "processed";
    const value = Math.min(1, scrap.costBasis * 0.15);
    world.materials.compostBatches.push({ id: `compost-${scrap.id}`, createdDay: world.day, remainingUses: 1, inputValue: value });
    world.materials.scrapProcessed++;
    world.materials.inputValueRecovered += value;
    returnEvent(world, "OPERATE", "juan", 0, "compost_processing_effort");
    event(world, "compost_processed", { scrapId: scrap.id, inputValue: value });
  }
  for (const scrap of world.materials.organicScrap) {
    if (scrap.status === "unprocessed" && world.day - scrap.createdDay > 4) {
      scrap.status = "exited";
      world.materials.scrapExited++;
      event(world, "organic_scrap_exited", { scrapId: scrap.id });
    }
  }
}

export function consumeCompostInput(world) {
  const batch = world.materials.compostBatches.find((row) => row.remainingUses > 0);
  if (!batch) return 0;
  batch.remainingUses--;
  event(world, "compost_used_for_cultivation", { batchId: batch.id, substitutedInputValue: batch.inputValue });
  return batch.inputValue;
}

function rotateWholesale(world) {
  if (world.day % 4 || world.bar.wholesaleLotsRemaining <= 0) return;
  const eligible = NIGHT_MENU_MASTER.filter((entry) => entry.mode === "BACKEND_WHOLESALE");
  const start = (Math.floor(world.day / 4) * 5) % eligible.length;
  const families = Array.from({ length: 5 }, (_, index) => eligible[(start + index) % eligible.length].family);
  const cost = 8;
  const reserved = world.market.reservations
    .filter((row) => row.actorId === "joel" && row.kind === "cash")
    .reduce((sum, row) => sum + row.amount, 0);
  if (world.actors.joel.cash - reserved < cost) return;
  world.actors.joel.cash -= cost;
  world.bar.wholesaleLotsRemaining--;
  for (const family of families) {
    world.bar.backendStock[family] = (world.bar.backendStock[family] || 0) + 4;
    use(world, family, "bounded_wholesale_source", 4);
  }
  // A wholesale service lot also carries a complete operational support bundle;
  // it is serving stock, not a duplicate publicly resaleable bottle/crate.
  world.bar.servings.Rum = (world.bar.servings.Rum || 0) + 8;
  world.bar.servings.Lime = (world.bar.servings.Lime || 0) + 6;
  world.bar.servings.Ice = (world.bar.servings.Ice || 0) + 10;
  for (const family of ["Rum", "Lime", "Ice"]) use(world, family, "bounded_wholesale_source", 1);
  world.bar.activeFamilies = [...new Set([...world.bar.activeFamilies.slice(-7), ...families])];
  external(world, "out", "culinary_wholesalers", "joel", "finite_menu_wholesale_lot", cost, "OPERATE");
  event(world, "bar_wholesale_lot_acquired", { families, cost });
}

function consumeAdaptiveBarIngredient(world) {
  const family = world.bar.activeFamilies.find((name) => (world.bar.backendStock[name] || 0) > 0 && !["Rum", "Lime", "Ice"].includes(name));
  if (!family) return;
  world.bar.backendStock[family]--;
  use(world, family, "bar_service_consumption");
  event(world, "menu_family_consumed", { family });
}

function createParcelJob(world) {
  if (world.day % 5 !== 1) return;
  const ordinal = Math.floor((world.day - 1) / 5);
  const guaranteed = ordinal % 2 === 1;
  const privateRoute = ordinal % 3 === 2;
  const fee = guaranteed ? 5 : 3;
  const preferredSender = ordinal % 2 ? "crews" : "households";
  const senderId = [preferredSender, preferredSender === "crews" ? "households" : "crews"]
    .find((id) => world.actors[id].cash >= fee);
  if (!senderId) return;
  const sender = world.actors[senderId];
  const reservedCash = world.market.reservations
    .filter((row) => row.actorId === senderId && row.kind === "cash")
    .reduce((sum, row) => sum + row.amount, 0);
  if (sender.cash - reservedCash < fee) return;
  if ((!privateRoute && world.actors.wong.capacity <= 0) || ((guaranteed || privateRoute) && world.actors.dima.capacity <= 0)) return;
  const job = {
    id: `parcel-job-${world.day}`,
    senderId,
    recipientId: privateRoute ? "aspen" : "wharf_suppliers",
    custodianId: privateRoute ? null : "wong",
    guarantorId: guaranteed ? "dima" : null,
    paymentRoute: privateRoute ? "private_settlement" : "cash",
    privacy: privateRoute,
    createdDay: world.day,
    deadline: world.day + 3,
    status: "in_custody",
    custodyFee: privateRoute ? 0 : 3,
    guaranteeFee: privateRoute ? fee : guaranteed ? 2 : 0,
  };
  sender.cash -= fee;
  if (job.custodianId) world.actors.wong.cash += job.custodyFee;
  if (job.guarantorId || privateRoute) world.actors.dima.cash += job.guaranteeFee;
  world.parcelJobs.push(job);
  world.stats.wongJobs += job.custodianId ? 1 : 0;
  world.stats.dimaServices += job.guarantorId || privateRoute ? 1 : 0;
  if (job.guarantorId) {
    world.claimRights.guarantees.push({
      id: `guarantee-${job.id}`,
      issuerId: "dima",
      holderId: senderId,
      underlyingId: job.id,
      face: job.custodyFee,
      maturity: job.deadline,
      state: "active",
    });
  }
  world.privateTransactions.push({ day: world.day, kind: "parcel_commitment", amount: fee, ...job });
  if (job.custodianId) returnEvent(world, "OPERATE", "wong", job.custodyFee, "parcel_custody");
  if (job.guarantorId || privateRoute) returnEvent(world, "INTERMEDIATE", "dima", job.guaranteeFee, privateRoute ? "private_settlement" : "parcel_guarantee");
  event(world, "parcel_job_committed", { jobId: job.id, custodianId: job.custodianId, guarantorId: job.guarantorId, privateRoute });
}

function settleParcelJobs(world) {
  for (const job of world.parcelJobs.filter((row) => row.status === "in_custody" && row.deadline <= world.day)) {
    job.status = "delivered";
    const guarantee = world.claimRights.guarantees.find((row) => row.underlyingId === job.id);
    if (guarantee) guarantee.state = "released";
    world.privateTransactions.push({ day: world.day, kind: "parcel_delivery", amount: 0, jobId: job.id, senderId: job.senderId, recipientId: job.recipientId });
    event(world, "parcel_delivered", { jobId: job.id });
  }
}

function consumeBackgroundGoods(world) {
  const cycles = [
    ["households", ["Fresh Mackerel", "Tomato", "Basil", "Soda"], 3],
    ["crews", ["Salted Cod", "Lime", "Hardtack Tin", "Ice"], 4],
  ];
  for (const [actorId, families, cadence] of cycles) {
    if (world.day % cadence) continue;
    const actor = world.actors[actorId];
    const index = actor.inventory.findIndex((unit) => families.includes(unit.kind));
    if (index < 0) continue;
    const [consumed] = actor.inventory.splice(index, 1);
    use(world, consumed.kind, "background_consumption");
    event(world, "background_consumption", { actorId, item: consumed.kind, unitId: consumed.unitId });
  }
}

function runToadCircle(world) {
  if (world.day !== world.toadCircle.nextGatheringDay) return;
  const attending = world.toadCircle.members.filter((id) => !world.actors[id].removed && world.actors[id].capacity > 0 && world.actors[id].location !== "away");
  world.toadCircle.occurrences.push({ day: world.day, attending, location: world.toadCircle.location });
  world.toadCircle.nextGatheringDay += 18;
  for (const id of attending) world.actors[id].location = world.toadCircle.location;
  event(world, "toad_circle_gathering", { attending, location: world.toadCircle.location, economicCommodity: false });
}

export function advanceLivingSystems(world) {
  consumeBackgroundGoods(world);
  rotateWholesale(world);
  if (world.bar.last?.served > 0) consumeAdaptiveBarIngredient(world);
  processCompost(world);
  createParcelJob(world);
  settleParcelJobs(world);
  runToadCircle(world);
}

export function executableContentAudit(world) {
  return NIGHT_MENU_MASTER.map((entry) => {
    const usage = world.contentUsage[entry.family] || { sourced: 0, sunk: 0, sourceTransitions: {}, sinkTransitions: {} };
    return {
      family: entry.family,
      mode: entry.mode,
      definition: true,
      sourceMetadata: entry.sourceTransition,
      sourceExecutable: contentTransitionCapabilities(entry.family).sourceExecutable,
      sinkMetadata: entry.sinkTransition,
      sinkExecutable: contentTransitionCapabilities(entry.family).sinkExecutable,
      actuallyUsed: usage.sourced + usage.sunk > 0,
      usage,
    };
  });
}

export function dayActivity(world, day) {
  const publicMarket = world.market.tape.some((row) => row.day === day);
  const privateTransaction = world.privateTransactions.some((row) => row.day === day);
  const returns = world.returnLedger.filter((row) => row.day === day);
  const evidence = world.evidence.filter((row) => row.day === day);
  const operations = returns.some((row) => row.class === "OPERATE");
  const production = evidence.some((row) => ["background_production", "compost_processed", "menu_family_consumed"].includes(row.type));
  const finance = returns.some((row) => row.class === "FINANCE");
  const intermediation = returns.some((row) => row.class === "INTERMEDIATE");
  return {
    publicMarket,
    privateTransaction,
    operations,
    production,
    finance,
    intermediation,
    anyEconomicActivity: publicMarket || privateTransaction || operations || production || finance || intermediation,
    anyWorldStateChange: evidence.length > 0 || returns.length > 0,
  };
}
