import {
  AFTERNOON_ACTIONS,
  DIMA_BROKER_FEE,
  DIMA_PROXY_FEE,
  INFO_BASE_PRICE,
  INITIAL_TRADERS,
  ITEMS,
  MAX_DAYS,
  MORNING_ACTIONS,
  NPC_PROFILES,
  PLAYER_CONTEXT,
  PRODUCTION_RECIPES,
  PROXY_FEE,
  RECURRING_ECONOMY,
  SOCIAL_GRAPH,
  SUSTENANCE_PER_DAY,
  VENUES,
} from "./gameData.js";
import { buyerMax, planNPCMarket, privateUtility, sellerAsk } from "./npcAI.js";

const clone = (value) => JSON.parse(JSON.stringify(value));
export const valueOf = (item) => (item && Number.isFinite(ITEMS[item]?.value) ? ITEMS[item].value : 0);
export const labelShort = (item) => item ? `${ITEMS[item]?.icon || "📦"} ${item}` : "nothing";
export const netWorth = (trader) => trader.sardines + trader.inventory.reduce((sum, item) => sum + valueOf(item), 0);
export const unique = (arr) => [...new Set(arr)];
const PLAYER_VISIBLE_AT_START = ["Fish Bones"];

function removeOne(inventory, item) {
  const index = inventory.indexOf(item);
  if (index < 0) return [...inventory];
  return [...inventory.slice(0, index), ...inventory.slice(index + 1)];
}

function takePerishableAge(game, trader, item) {
  if (!ITEMS[item]?.shelfLife) return null;
  const key = `${trader.id}:${item}`;
  const count = trader.inventory.filter((held) => held === item).length;
  const stored = game.perishTimer[key];
  const ages = Array.isArray(stored) ? [...stored] : Array(count).fill(Number(stored || 0));
  while (ages.length < count) ages.push(0);
  const age = ages.shift() ?? 0;
  if (ages.length) game.perishTimer[key] = ages;
  else delete game.perishTimer[key];
  return age;
}

function addPerishableAge(game, trader, item, age) {
  if (!ITEMS[item]?.shelfLife) return;
  const key = `${trader.id}:${item}`;
  const count = trader.inventory.filter((held) => held === item).length;
  const stored = game.perishTimer[key];
  const ages = Array.isArray(stored) ? [...stored] : Array(count).fill(Number(stored || 0));
  while (ages.length < count) ages.push(0);
  ages.push(Number(age || 0));
  game.perishTimer[key] = ages;
}

const emptyOrder = () => ({ to: "", wantItem: "", offerItem: "", sardines: 0 });
export const resetOrders = () => [emptyOrder(), emptyOrder(), emptyOrder()];

function emptyMemory() {
  return Object.fromEntries(Object.keys(NPC_PROFILES).map((id) => [id, {
    observedDemand: {},
    observations: [],
    knownHoldings: {},
  }]));
}

function zeroMap() {
  return Object.fromEntries(Object.keys(NPC_PROFILES).map((id) => [id, 0]));
}

function profileWantsItem(profile, item) {
  if ((profile?.goals || []).some((goal) => goal.item === item)) return true;
  const type = ITEMS[item]?.type || "";
  return (profile?.interests || []).some((interest) => interest?.typeIncludes && type.includes(interest.typeIncludes));
}

function freshnessFor(day, observedDay) {
  const age = Math.max(0, Number(day) - Number(observedDay || day));
  if (age <= 1) return "current";
  if (age === 2) return "aging";
  return "stale";
}

function informationKey(info) {
  return [info.claimType, info.subjectId || "", info.item || "", info.text || ""].join("|");
}

function addInformation(game, payload) {
  const candidate = {
    id: `info-${game.information.length + 1}`,
    claimType: payload.claimType || "observation",
    subjectId: payload.subjectId || null,
    item: payload.item || null,
    claimId: payload.claimId || null,
    text: payload.text,
    source: payload.source || "unknown",
    precision: payload.precision || "context",
    confidence: payload.confidence || "medium",
    observedDay: game.day,
    freshness: "current",
    exclusive: payload.exclusive ?? false,
    sellable: payload.sellable ?? false,
    soldTo: [],
    sharedWith: [],
    knownBy: ["player"],
    diffusionCount: 0,
    resaleCount: 0,
    resaleState: payload.sellable ? "exclusive" : "not-for-sale",
    personallyVerified: payload.personallyVerified ?? payload.source === "personal investigation",
  };

  const key = informationKey(candidate);
  const existing = game.information.find((info) => informationKey(info) === key);
  if (existing) {
    existing.observedDay = game.day;
    existing.freshness = "current";
    existing.confidence = candidate.confidence;
    existing.precision = candidate.precision;
    existing.sellable = candidate.sellable;
    existing.personallyVerified ||= candidate.personallyVerified;
    return existing;
  }

  game.information.push(candidate);
  return candidate;
}

function refreshInformation(game) {
  game.information.forEach((info) => {
    info.freshness = freshnessFor(game.day, info.observedDay);
    if (info.freshness === "stale") info.resaleState = "expired";
    else if ((info.knownBy || []).length > 1) info.resaleState = "circulating";
  });
}

function createObligation(game, payload) {
  const lifeId = payload.debtorLifeId || game.playerState.legalIdentity.lifeId;
  const obligation = {
    ...payload,
    id: `obligation-${game.obligations.length + 1}`,
    kind: payload.kind,
    debtorId: payload.debtorId || "player",
    debtorLifeId: lifeId,
    creditorId: payload.creditorId,
    amount: Number(payload.amount || 0),
    createdDay: game.day,
    dueDay: payload.dueDay ?? game.day + 2,
    status: "open",
    note: payload.note || "",
  };
  game.obligations.push(obligation);
  recordEvidence(game, "obligation-created", { obligationId: obligation.id, creditorId: obligation.creditorId, amount: obligation.amount, dueDay: obligation.dueDay, reason: obligation.kind });
  return obligation;
}

function createBadge(game, payload) {
  if (game.badges.some((badge) => badge.id === payload.id)) return;
  game.badges.push({ ...payload, day: game.day, evidenceIds: unique(payload.evidenceIds || []) });
}

function teachCredit(game, obligation, evidence, whatHappened) {
  addLearningNote(game, "credit", "Credit creates an obligation", "Credit moves resources through time, but it leaves a claim that must later be repaid or defaulted.", {
    evidenceIds: [evidence?.id], whatHappened,
  });
}

export function currentObligations(game) {
  const lifeId = game.playerState.legalIdentity.lifeId;
  return game.obligations.filter((obligation) =>
    obligation.debtorLifeId === lifeId && ["open", "overdue"].includes(obligation.status)
  );
}

export function createGame() {
  const game = {
    day: 1,
    maxDays: MAX_DAYS,
    phase: "sunrise",
    actionsRemaining: 0,
    objective: "Get a sunflower",
    traders: clone(INITIAL_TRADERS),
    playerState: {
      life: 1,
      form: PLAYER_CONTEXT.startingForm,
      legalIdentity: { status: PLAYER_CONTEXT.startingLegalIdentity, lifeId: "life-1" },
      proxyAccess: [],
      lastMeal: null,
    },
    estates: [],
    claims: [
      { id: "juan-sterling-tab", debtorId: "juan", currentHolderId: "sterling", creditorId: "sterling", faceAmount: 7, dueDay: 4, status: "open", tag: "unsecured", secured: false, transferAsk: 5, linkedProductiveAsset: null, transferHistory: [], evidenceIds: [], extensionCount: 0, knownByPlayer: false },
      { id: "juan-dima-roll", debtorId: "juan", currentHolderId: "dima", creditorId: "dima", faceAmount: 9, dueDay: 5, status: "open", tag: "informal", secured: false, transferAsk: 7, linkedProductiveAsset: "juan-crop-cycle", transferHistory: [], evidenceIds: [], extensionCount: 0, knownByPlayer: false },
    ],
    crops: [],
    recurringDemands: [],
    recurringLedger: [],
    clearingBatches: [],
    settlementFloat: 0,
    sunMomentHistory: [{ day: 1, moment: "sunrise", state: "natural_pause", contextualOpportunityIds: [], action: "pause", effect: "The day begins after a brief natural pause.", evidenceIds: [], immediateConsequence: "Morning has not opened yet." }],
    sunMoment: { moment: "sunrise", state: "natural_pause", eligible: false, opportunityIds: [], lateEditAvailable: false, lateEditUsed: false },
    obligations: [],
    badges: [],
    selected: "player",
    playerOrders: resetOrders(),
    lockedPlayerOrders: [],
    marketPlan: [],
    marketResolved: false,
    marketOutcome: [],
    rejected: [],
    history: [],
    information: [],
    informationTrades: [],
    inboundOffers: [],
    learningNotes: [],
    giftHistory: [],
    decisionEvidence: [],
    systemMarkers: { aspenNextDepartureDay: RECURRING_ECONOMY.aspen.firstDepartureDay, sterlingServiceCycles: 0 },
    worldThreads: {
      barRecipe: { stage: "signal", keyItem: "Orgeat Bottle" },
      valeScreening: { stage: "signal", keyItem: "Sperm Whale Oil" },
      onewheel: { stage: "signal", keyItem: "Steel Rim" },
    },
    intel: {},
    investigationCounts: zeroMap(),
    talkCounts: zeroMap(),
    talkGainDays: {},
    relationships: zeroMap(),
    lastInteraction: null,
    npcMemory: emptyMemory(),
    heat: {},
    perishTimer: {},
    pendingEvents: [],
    ended: false,
    winner: false,
    finalText: "",
    style: null,
    flags: {
      sunflowerAcquired: false,
      cheated: false,
      raced: false,
      sailorDeparted: false,
    },
    stats: {
      exactDeliveries: 0,
      profitableFlips: 0,
      overpays: 0,
      totalProfit: 0,
      tradeCount: 0,
      cheats: 0,
      informationSales: 0,
      creditUsed: 0,
      defaults: 0,
      proxyUses: 0,
      lives: 1,
      gifts: 0,
      informationFavours: 0,
      inboundTrades: 0,
    },
    log: [
      "Day 1. The sunflower is not for sale.",
      "At noon, the public market opens once.",
      "Morning and afternoon are for information, relationships and positioning.",
    ],
  };
  replanNPCMarket(game);
  return game;
}

export function canAccessVenue(game, venueId) {
  const venue = VENUES[venueId];
  if (!venue) return false;
  const activeProxy = game.playerState.proxyAccess.some((access) =>
    access.venueId === venueId && access.expiresDay >= game.day
  );
  if (activeProxy) return true;
  if (!venue.allowedForms.includes(game.playerState.form)) return false;
  if (!venue.requiresLegalIdentity) return true;
  return game.playerState.legalIdentity.status === "recognized";
}

function latestPublicOwners(game) {
  const owners = {};
  game.history.forEach((trade) => {
    owners[trade.item] = trade.from;
    if (trade.paymentItem) owners[trade.paymentItem] = trade.to;
  });
  return owners;
}

export function playerVisibleKnowledge(game) {
  return {
    information: game.information.map((info) => ({ id: info.id, text: info.text, source: info.personallyVerified ? "personally verified" : info.source })),
    publicTape: game.history.map((trade) => ({ id: trade.id, day: trade.day, from: trade.from, to: trade.to, item: trade.item, sardines: trade.sardines, source: "public tape" })),
    currentResult: game.lastInteraction ? { ...game.lastInteraction, source: "your action" } : null,
  };
}

export function publiclyKnownPlayerItems(game) {
  const current = game.traders.player.inventory;
  const known = new Set(PLAYER_VISIBLE_AT_START.filter((item) => current.includes(item)));
  Object.entries(latestPublicOwners(game)).forEach(([item, ownerId]) => {
    if (ownerId === "player" && current.includes(item)) known.add(item);
  });
  return [...known];
}

export function knownItemsForTrader(game, traderId) {
  const trader = game.traders[traderId];
  if (!trader) return [];
  if (traderId === "player") return [...trader.inventory];
  if (traderId === "aspen" && game.flags.sailorDeparted) return [];

  const known = [];
  (NPC_PROFILES[traderId]?.publicStock || []).forEach((item) => {
    if (trader.inventory.includes(item)) known.push(item);
  });
  if (traderId === "sterling" && trader.inventory.includes("Mai Tai")) known.push("Mai Tai");
  if (traderId === "aspen" && trader.inventory.includes("Built Onewheel")) known.push("Built Onewheel");

  const publicOwners = latestPublicOwners(game);
  Object.entries(publicOwners).forEach(([item, ownerId]) => {
    if (ownerId === traderId) known.push(item);
  });

  game.information
    .filter((info) =>
      info.claimType === "holding" && info.subjectId === traderId && info.item &&
      freshnessFor(game.day, info.observedDay) !== "stale"
    )
    .forEach((info) => known.push(info.item));

  return unique(known);
}

export function informationBuyers(game, info) {
  if (!info?.sellable || info.claimType !== "holding" || !info.item || freshnessFor(game.day, info.observedDay) === "stale") return [];
  return Object.entries(NPC_PROFILES)
    .filter(([buyerId, profile]) => {
      if (buyerId === "aspen" && game.flags.sailorDeparted) return false;
      if (buyerId === info.subjectId || (info.knownBy || ["player", ...(info.soldTo || [])]).includes(buyerId)) return false;
      if (game.traders[buyerId]?.inventory.includes(info.item)) return false;
      return profileWantsItem(profile, info.item);
    })
    .map(([buyerId]) => buyerId);
}

const precisionBonus = (precision) => ({ context: 0, category: 0, specific: 1, exact: 2 })[precision] ?? 0;
const confidenceBonus = (confidence) => ({ low: -1, medium: 0, high: 1 })[confidence] ?? 0;

export function informationPrice(game, info, buyerId = null) {
  if (!info || info.freshness === "stale") return 0;
  const knownBy = new Set(info.knownBy || ["player", ...(info.soldTo || [])]);
  const buyerPremium = buyerId && (NPC_PROFILES[buyerId]?.goals || []).some((goal) => goal.item === info.item) ? 1 : 0;
  return Math.max(1,
    INFO_BASE_PRICE + precisionBonus(info.precision) + confidenceBonus(info.confidence) +
    (knownBy.size === 1 && info.exclusive ? 1 : 0) + buyerPremium -
    Math.min(2, Math.max(0, knownBy.size - 1)) - (info.freshness === "aging" ? 1 : 0));
}

function transferInformation(game, info, buyerId, { cash = true, favour = false } = {}) {
  const buyer = game.traders[buyerId];
  const player = game.traders.player;
  const price = cash ? informationPrice(game, info, buyerId) : 0;
  if (!buyer || !player || (cash && (price <= 0 || buyer.sardines < price))) return false;

  info.soldTo ||= [];
  info.sharedWith ||= [];
  info.knownBy ||= ["player", ...info.soldTo];
  if (cash) {
    buyer.sardines -= price;
    player.sardines += price;
    if (!info.soldTo.includes(buyerId)) info.soldTo.push(buyerId);
    game.stats.informationSales += 1;
  }
  if (favour) {
    if (!info.sharedWith.includes(buyerId)) info.sharedWith.push(buyerId);
    game.relationships[buyerId] += 1;
    game.stats.informationFavours += 1;
  }
  if (!info.knownBy.includes(buyerId)) info.knownBy.push(buyerId);
  info.diffusionCount = Math.max(0, info.knownBy.length - 1);
  info.exclusive = info.knownBy.length === 1;
  info.resaleState = favour ? "shared" : "circulating";
  game.npcMemory[buyerId].knownHoldings[info.item] = {
    holderId: info.subjectId,
    learnedDay: game.day,
    source: favour ? "shared by player as a favour" : `bought from player (${info.confidence} confidence)`,
    infoId: info.id,
  };
  return cash ? price : true;
}

function addLearningNote(game, id, title, text, occurrence) {
  const note = game.learningNotes.find((entry) => entry.id === id);
  const nextOccurrence = { day: game.day, phase: game.phase, evidenceIds: [...new Set(occurrence.evidenceIds.filter(Boolean))], whatHappened: occurrence.whatHappened };
  if (note) {
    note.occurrences ||= [];
    note.occurrences.push(nextOccurrence);
  } else {
    game.learningNotes.push({ id, title, text, day: game.day, occurrences: [nextOccurrence] });
  }
}

function recordEvidence(game, type, detail = {}) {
  const entry = { id: `decision-${game.decisionEvidence.length + 1}`, day: game.day, phase: game.phase, type, ...detail };
  game.decisionEvidence.push(entry);
  return entry;
}

function recordRecurring(game, actorId, category, amount = 0, detail = {}) {
  const entry = { id: `recurring-${game.recurringLedger.length + 1}`, day: game.day, actorId, category, amount, ...detail };
  game.recurringLedger.push(entry);
  recordEvidence(game, "recurring-economy", { ledgerId: entry.id, actorId, category, amount, ...detail });
  return entry;
}

function addDemand(game, actorId, item, reason) {
  const id = `${actorId}-${item}`;
  const existing = game.recurringDemands.find((entry) => entry.id === id);
  const demand = { id, actorId, item, reason, createdDay: game.day, expiresDay: game.day + 2 };
  if (existing) Object.assign(existing, demand);
  else game.recurringDemands.push(demand);
  recordRecurring(game, actorId, "demand-created", 0, { item, reason });
}

function clearDemand(game, actorId, item) {
  if (game.traders[actorId]?.inventory.includes(item)) game.recurringDemands = game.recurringDemands.filter((entry) => entry.actorId !== actorId || entry.item !== item);
}

export function buyJuanClaim(current, claimId) {
  const game = clone(current);
  const claim = game.claims.find((entry) => entry.id === claimId && entry.status === "open" && entry.knownByPlayer && entry.currentHolderId !== "player");
  if (!claim || !["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0) return game;
  const sellerId = claim.currentHolderId;
  const fee = sellerId === "dima" ? 0 : DIMA_BROKER_FEE;
  const total = claim.transferAsk + fee;
  if (game.traders.player.sardines < total) return game;
  game.traders.player.sardines -= total;
  game.traders[sellerId].sardines += claim.transferAsk;
  if (fee) game.traders.dima.sardines += fee;
  game.actionsRemaining -= 1;
  const evidence = recordEvidence(game, "claim-transferred", { claimId, oldHolder: sellerId, newHolder: "player", faceAmount: claim.faceAmount, transferPrice: claim.transferAsk, fee, brokerId: "dima" });
  claim.transferHistory.push({ day: game.day, oldHolder: sellerId, newHolder: "player", faceAmount: claim.faceAmount, transferPrice: claim.transferAsk, fee, evidenceId: evidence.id });
  claim.currentHolderId = "player";
  claim.creditorId = "player";
  claim.currentHolderLifeId = game.playerState.legalIdentity.lifeId;
  claim.evidenceIds.push(evidence.id);
  if (fee) recordRecurring(game, "dima", "brokerage-fee", fee, { claimId });
  game.lastInteraction = { action: "claim-transfer", targetId: sellerId, text: `You pay ${claim.transferAsk}🥫 for Juan's ${claim.faceAmount}🥫 claim${fee ? ` and ${fee}🥫 to Dima for brokerage` : ""}.` };
  return game;
}

export function acceptJuanBuyback(current, claimId) {
  const game = clone(current);
  const claim = game.claims.find((entry) => entry.id === claimId && entry.status === "open" && entry.currentHolderId === "player" && entry.dueDay > game.day);
  if (!claim || !["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0) return game;
  const price = Math.ceil(claim.faceAmount * .7);
  if (game.traders.juan.sardines < price) return game;
  game.traders.juan.sardines -= price;
  game.traders.player.sardines += price;
  game.actionsRemaining -= 1;
  claim.status = "bought-back";
  claim.settledDay = game.day;
  const evidence = recordEvidence(game, "claim-buyback", { claimId, faceAmount: claim.faceAmount, price });
  claim.evidenceIds.push(evidence.id);
  recordRecurring(game, "juan", "claim-buyback", -price, { claimId, faceAmount: claim.faceAmount });
  game.lastInteraction = { action: "claim-buyback", targetId: "juan", text: `Juan buys back the ${claim.faceAmount}🥫 claim for ${price}🥫 before it falls due.` };
  return game;
}

export function resolveJuanClaim(current, claimId, action) {
  const game = clone(current);
  const claim = game.claims.find((entry) => entry.id === claimId && entry.status === "open" && entry.currentHolderId === "player" && entry.dueDay <= game.day);
  if (!claim || game.phase !== "sunset") return game;
  if (action === "extend" && claim.extensionCount < 1) {
    claim.faceAmount += 2;
    claim.dueDay += 2;
    claim.extensionCount += 1;
    const evidence = recordEvidence(game, "claim-extended", { claimId, newFaceAmount: claim.faceAmount, newDueDay: claim.dueDay, extensionCount: claim.extensionCount });
    claim.evidenceIds.push(evidence.id);
    return game;
  }
  const available = game.traders.juan.sardines;
  let liquidationProceeds = 0;
  let destroyedFutureValue = 0;
  if (action === "liquidate" && claim.linkedProductiveAsset) {
    const crop = game.crops.find((entry) => entry.status === "growing") || null;
    const reference = crop ? Math.round(valueOf("Mature Nursery Plant") * Math.min(1, Math.max(.25, (game.day - crop.plantedDay) / RECURRING_ECONOMY.juan.maturityDays))) : 0;
    liquidationProceeds = Math.floor(reference * .6);
    destroyedFutureValue = Math.max(0, valueOf("Mature Nursery Plant") - liquidationProceeds);
    if (crop) crop.status = "liquidated";
  }
  const recovered = Math.min(claim.faceAmount, available + liquidationProceeds);
  game.traders.juan.sardines = Math.max(0, available - Math.max(0, recovered - liquidationProceeds));
  game.traders.player.sardines += recovered;
  claim.status = recovered === claim.faceAmount ? "collected" : "impaired";
  claim.settledDay = game.day;
  claim.recovery = recovered;
  claim.impairment = claim.faceAmount - recovered;
  const evidence = recordEvidence(game, action === "liquidate" ? "claim-forced-liquidation" : "claim-collected", { claimId, faceAmount: claim.faceAmount, recovered, liquidationProceeds, impairment: claim.impairment, destroyedFutureValue });
  claim.evidenceIds.push(evidence.id);
  recordRecurring(game, "juan", action === "liquidate" ? "forced-liquidation" : "claim-payment", -recovered, { claimId, liquidationProceeds, destroyedFutureValue, impairment: claim.impairment });
  return game;
}

export function economicSnapshot(game) {
  const lifeId = game.playerState.legalIdentity.lifeId;
  const currentClaims = game.claims.filter((claim) => claim.currentHolderId === "player" && claim.currentHolderLifeId === lifeId && claim.status === "open").reduce((sum, claim) => sum + claim.faceAmount, 0);
  const currentLiabilities = currentObligations(game).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const formerEstateCash = game.estates.reduce((sum, estate) => sum + estate.sardines, 0);
  const formerEstateInventoryReference = game.estates.reduce((sum, estate) => sum + estate.inventory.reduce((subtotal, item) => subtotal + valueOf(item), 0), 0);
  const formerEstateClaimsReference = game.estates.reduce((sum, estate) => sum + Number(estate.claimsReference || 0), 0);
  const formerEstateLiabilities = game.estates.reduce((sum, estate) => sum + Number(estate.liabilities || 0), 0);
  const currentBodyCash = game.traders.player.sardines;
  const currentBodyInventoryReference = game.traders.player.inventory.reduce((sum, item) => sum + valueOf(item), 0);
  const currentBodyWealth = currentBodyCash + currentBodyInventoryReference + currentClaims - currentLiabilities;
  const formerEstateWealth = formerEstateCash + formerEstateInventoryReference + formerEstateClaimsReference - formerEstateLiabilities;
  return {
    currentBodyCash, currentBodyInventoryReference, currentBodyClaimsReference: currentClaims, currentBodyLiabilities: currentLiabilities,
    formerEstateCash, formerEstateInventoryReference, formerEstateClaimsReference, formerEstateLiabilities,
    currentBodyWealth, formerEstateWealth, continuityLinkedRecordedWealth: currentBodyWealth + formerEstateWealth,
    legallyAccessibleWealth: currentBodyWealth,
    formTransitionCount: game.decisionEvidence.filter((entry) => entry.type === "form-transition").length,
    formTransitionDays: game.decisionEvidence.filter((entry) => entry.type === "form-transition").map((entry) => entry.day),
  };
}

function activeObligation(game, kind, creditorId = null) {
  return currentObligations(game).find((entry) => entry.kind === kind && (!creditorId || entry.creditorId === creditorId));
}

function breachExclusivity(game, infoId, recipientId) {
  const covenant = currentObligations(game).find((entry) => entry.kind === "information-exclusivity" && entry.infoId === infoId && entry.creditorId !== recipientId);
  if (!covenant || covenant.breached) return;
  covenant.breached = true;
  covenant.breachPartyId = recipientId;
  const evidence = recordEvidence(game, "information-exclusivity-breached", { obligationId: covenant.id, infoId, buyerId: covenant.creditorId, thirdPartyId: recipientId, detected: false });
  covenant.evidenceIds.push(evidence.id);
}

function replanNPCMarket(game) {
  const accepted = game.marketPlan.filter((plan) => plan.inboundOfferId && game.inboundOffers.some((offer) => offer.id === plan.inboundOfferId && offer.status === "accepted"));
  const committedBuyers = new Set(accepted.map((plan) => plan.from));
  game.marketPlan = [...planNPCMarket(game).filter((plan) => !committedBuyers.has(plan.from)), ...accepted];
  game.marketPlan.forEach((plan) => {
    if (plan.from === "sterling" && plan.wantItem === "Orgeat Bottle" && game.worldThreads.barRecipe.stage === "signal") game.worldThreads.barRecipe.stage = "contest";
    if (plan.from === "yasmin" && plan.wantItem === "Sperm Whale Oil" && game.worldThreads.valeScreening.stage === "signal") game.worldThreads.valeScreening.stage = "contest";
    if (plan.from === "aspen" && PRODUCTION_RECIPES.onewheel.inputs.includes(plan.wantItem) && game.worldThreads.onewheel.stage === "signal") game.worldThreads.onewheel.stage = "contest";
    if (!plan.knowledgeBasis || plan.knowledgeBasis === "public stock") return;
    game.npcMemory[plan.from].knownHoldings[plan.wantItem] = {
      holderId: plan.to,
      learnedDay: game.day,
      source: plan.knowledgeBasis,
      infoId: plan.infoId || null,
    };
    const observation = `${plan.wantItem} believed held by ${plan.to}: ${plan.knowledgeBasis}`;
    if (!game.npcMemory[plan.from].observations.includes(observation)) game.npcMemory[plan.from].observations.push(observation);
  });
}

export function sellInformation(current, infoId, buyerId) {
  const game = clone(current);
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || game.ended) return game;
  const info = game.information.find((entry) => entry.id === infoId);
  if (!info || !informationBuyers(game, info).includes(buyerId)) return game;
  breachExclusivity(game, infoId, buyerId);
  const paid = transferInformation(game, info, buyerId, { cash: true });
  if (!paid) return game;
  game.actionsRemaining -= 1;
  const evidence = recordEvidence(game, "information-sold", { infoId, buyerId, price: paid, channel: "private", source: info.source, precision: info.precision, confidence: info.confidence, freshness: info.freshness, audienceSize: info.knownBy.length });
  addLearningNote(game, "information-market", "Information is an asset", "A useful lead can be sold, but its resale value falls as it diffuses.", {
    evidenceIds: [evidence.id],
    whatHappened: `You sold a lead to ${game.traders[buyerId].name} for ${paid}🥫. It is now known by ${info.knownBy.length} market participants.`,
  });
  game.lastInteraction = { action: "sell-information", targetId: buyerId, text: `${game.traders[buyerId].name} pays ${paid}🥫 for your lead: ${info.text}` };
  game.log.unshift(game.lastInteraction.text);
  if (game.phase === "morning") replanNPCMarket(game);
  return game;
}

export function shareInformationAsFavor(current, infoId, buyerId) {
  const game = clone(current);
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || game.ended) return game;
  const info = game.information.find((entry) => entry.id === infoId);
  if (!info || !informationBuyers(game, info).includes(buyerId)) return game;
  breachExclusivity(game, infoId, buyerId);
  if (!transferInformation(game, info, buyerId, { cash: false, favour: true })) return game;
  game.actionsRemaining -= 1;
  const evidence = recordEvidence(game, "information-favour", { infoId, buyerId, channel: "private", source: info.source, precision: info.precision, confidence: info.confidence, freshness: info.freshness, audienceSize: info.knownBy.length });
  addLearningNote(game, "relationship-capital", "Information can become relationship capital", "A saleable lead can be exchanged for familiarity instead of cash.", {
    evidenceIds: [evidence.id],
    whatHappened: `You gave ${game.traders[buyerId].name} a lead without charging. Your relationship improved instead.`,
  });
  game.lastInteraction = { action: "information-favour", targetId: buyerId, text: `You give ${game.traders[buyerId].name} the lead without charging. They remember the favour.` };
  game.log.unshift(game.lastInteraction.text);
  if (game.phase === "morning") replanNPCMarket(game);
  return game;
}

export function sellInformationExclusive(current, infoId, buyerId) {
  const game = clone(current);
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || game.ended) return game;
  const info = game.information.find((entry) => entry.id === infoId);
  if (!info || info.freshness === "stale" || (info.knownBy || []).length !== 1 || currentObligations(game).some((entry) => entry.kind === "information-exclusivity" && entry.infoId === infoId)) return game;
  const normalPrice = informationPrice(game, info, buyerId);
  const buyer = game.traders[buyerId];
  if (!informationBuyers(game, info).includes(buyerId) || buyer.sardines < normalPrice + 2) return game;
  const paid = transferInformation(game, info, buyerId, { cash: true });
  buyer.sardines -= 2;
  game.traders.player.sardines += 2;
  game.actionsRemaining -= 1;
  const evidence = recordEvidence(game, "information-exclusivity-sold", { infoId, buyerId, normalPrice, premium: 2, price: paid + 2, actionsBefore: game.actionsRemaining + 1, actionsAfter: game.actionsRemaining });
  const covenant = createObligation(game, {
    kind: "information-exclusivity", creditorId: buyerId, amount: 0, dueDay: game.day + 1, expiresDay: game.day + 1,
    infoId, premium: 2, buyerUsed: false, breached: false, detected: false, evidenceIds: [evidence.id], note: "Keep this lead between us through the following Noon.",
  });
  addLearningNote(game, "information-exclusivity", "Distribution scarcity", "A buyer may pay for temporary scarcity in who can receive a lead. Breach and detection are separate facts.", {
    evidenceIds: [evidence.id], whatHappened: `${buyer.name} paid ${paid + 2}🥫 for the lead and a temporary promise not to distribute it.`,
  });
  game.lastInteraction = { action: "information-exclusive", targetId: buyerId, text: `${buyer.name} pays ${paid + 2}🥫. You promise to keep this lead between you through Day ${covenant.expiresDay} Noon.` };
  if (game.phase === "morning") replanNPCMarket(game);
  return game;
}

export function futureDeliveryAvailable(game) {
  const sailor = game.traders.aspen;
  const knowsNeed = game.information.some((info) => info.subjectId === "aspen" && info.item === "Lime Crate" && info.claimType === "need" && info.precision === "exact");
  const knowsSource = game.information.some((info) => info.subjectId !== "aspen" && info.item === "Lime Crate" && info.claimType === "holding");
  return ["morning", "afternoon"].includes(game.phase) && game.actionsRemaining > 0 && !game.flags.sailorDeparted &&
    !sailor.inventory.includes("Lime Crate") && !game.traders.player.inventory.includes("Lime Crate") &&
    !activeObligation(game, "future-delivery", "aspen") && knowsNeed && knowsSource &&
    game.day <= RECURRING_ECONOMY.aspen.firstDepartureDay - 2 && sailor.sardines - 13 >= 6;
}

export function acceptFutureDelivery(current) {
  const game = clone(current);
  if (!futureDeliveryAvailable(game)) return game;
  const player = game.traders.player;
  const sailor = game.traders.aspen;
  const actionsBefore = game.actionsRemaining;
  const openingCash = game.traders.player.sardines;
  sailor.sardines -= 13;
  player.sardines += 4;
  game.actionsRemaining -= 1;
  const evidence = recordEvidence(game, "future-delivery-bound", { counterpartyId: "aspen", item: "Lime Crate", deposit: 4, reservedBalance: 9, dueDay: Math.min(game.day + 2, RECURRING_ECONOMY.aspen.firstDepartureDay - 1), ownedAtCommitment: false, openingCash, actionsBefore, actionsAfter: game.actionsRemaining });
  createObligation(game, {
    kind: "future-delivery", creditorId: "aspen", amount: 0, item: "Lime Crate", deposit: 4, reservedBalance: 9,
    dueDay: evidence.dueDay, ownedAtCommitment: false, commitmentEvidenceId: evidence.id, note: "A promise for lime.",
  });
  addLearningNote(game, "future-delivery", "Future delivery / sourcing risk", "A delivery promise can be bound before the seller owns the underlying good.", {
    evidenceIds: [evidence.id], whatHappened: `Aspen paid 4🥫 now and reserved 9🥫 for one Lime Crate due on Day ${evidence.dueDay}.`,
  });
  game.lastInteraction = { action: "future-delivery", targetId: "aspen", text: `Aspen pays 4🥫 now and reserves 9🥫 for one Lime Crate due Day ${evidence.dueDay}.` };
  return game;
}

export function fulfillFutureDelivery(current, obligationId) {
  const game = clone(current);
  const obligation = currentObligations(game).find((entry) => entry.id === obligationId && entry.kind === "future-delivery");
  if (!obligation || !["morning", "afternoon", "sunset"].includes(game.phase) || (game.phase !== "sunset" && game.actionsRemaining <= 0) || !game.traders.player.inventory.includes(obligation.item)) return game;
  const actionsBefore = game.actionsRemaining;
  const openingCash = game.traders.player.sardines;
  const age = takePerishableAge(game, game.traders.player, obligation.item);
  game.traders.player.inventory = removeOne(game.traders.player.inventory, obligation.item);
  addPerishableAge(game, game.traders.aspen, obligation.item, age);
  game.traders.aspen.inventory.push(obligation.item);
  game.traders.player.sardines += obligation.reservedBalance;
  obligation.status = "settled";
  obligation.settledDay = game.day;
  game.relationships.aspen += 1;
  if (game.phase !== "sunset") game.actionsRemaining -= 1;
  const evidence = recordEvidence(game, "future-delivery-fulfilled", { obligationId, item: obligation.item, balance: obligation.reservedBalance, onTime: game.day <= obligation.dueDay, openingCash, actionsBefore, actionsAfter: game.actionsRemaining });
  if (!obligation.ownedAtCommitment && game.day <= obligation.dueDay) createBadge(game, { id: "sold-before-owned", title: "SOLD IT BEFORE YOU HAD IT", summary: "Promised Lime, sourced it later, and delivered on time.", evidenceIds: [obligation.commitmentEvidenceId, evidence.id] });
  game.lastInteraction = { action: "future-delivery-fulfilled", targetId: "aspen", text: `You deliver the exact Lime Crate. The reserved ${obligation.reservedBalance}🥫 is released.` };
  return game;
}

export function requestRelationshipLoan(current) {
  const game = clone(current);
  const relationship = game.relationships.sterling || 0;
  const amount = relationship >= 3 ? 6 : 4;
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || relationship < 2 || activeObligation(game, "relationship-loan", "sterling") || game.traders.sterling.sardines - amount < 18) return game;
  const openingCash = game.traders.player.sardines;
  const actionsBefore = game.actionsRemaining;
  const nearTermObligations = currentObligations(game).filter((entry) => entry.dueDay <= game.day + 2).map((entry) => entry.id);
  game.traders.sterling.sardines -= amount;
  game.traders.player.sardines += amount;
  game.actionsRemaining -= 1;
  const evidence = recordEvidence(game, "relationship-loan-opened", { counterpartyId: "sterling", amount, dueDay: game.day + 2, openingCash, nearTermObligations, actionsBefore, actionsAfter: game.actionsRemaining });
  const obligation = createObligation(game, { kind: "relationship-loan", creditorId: "sterling", amount, dueDay: game.day + 2, openingEvidenceId: evidence.id, note: "A few tins for a few days." });
  teachCredit(game, obligation, evidence, `Sterling advanced ${amount}🥫 without interest, due Day ${obligation.dueDay}.`);
  game.stats.creditUsed += 1;
  game.lastInteraction = { action: "relationship-loan", targetId: "sterling", text: `Sterling lends you ${amount}🥫 until Day ${obligation.dueDay}.` };
  return game;
}

export function securedCollateralItems(game) {
  return unique(game.traders.player.inventory).filter((item) => {
    const type = ITEMS[item]?.type || "";
    return Number(ITEMS[item]?.value || 0) > 0 && !ITEMS[item]?.shelfLife && (type.includes("Collateral") || type.includes("Durable") || type.includes("Prestige")) &&
      !["Sunflower", "Blue Glass Marble", "Built Onewheel", "Mai Tai"].includes(item);
  });
}

export function requestSecuredLoan(current, item) {
  const game = clone(current);
  const reference = valueOf(item);
  const principal = Math.max(1, Math.floor(reference * .6));
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || game.playerState.legalIdentity.status !== "recognized" ||
    (game.relationships.yasmin || 0) < 1 || activeObligation(game, "secured-loan", "yasmin") || !securedCollateralItems(game).includes(item) || game.traders.yasmin.sardines - principal < 16) return game;
  const actionsBefore = game.actionsRemaining;
  const openingCash = game.traders.player.sardines;
  const collateralAge = takePerishableAge(game, game.traders.player, item);
  game.traders.player.inventory = removeOne(game.traders.player.inventory, item);
  game.traders.yasmin.sardines -= principal;
  game.traders.player.sardines += principal;
  game.actionsRemaining -= 1;
  const evidence = recordEvidence(game, "secured-loan-opened", { counterpartyId: "yasmin", item, referenceValue: reference, principal, repayment: principal + 1, haircut: reference - principal, openingCash, actionsBefore, actionsAfter: game.actionsRemaining });
  const obligation = createObligation(game, { kind: "secured-loan", creditorId: "yasmin", amount: principal + 1, principal, collateral: item, collateralAge, dueDay: game.day + 2, openingEvidenceId: evidence.id, note: `Against the ${item}.` });
  addLearningNote(game, "collateral-haircut", "Collateral haircut", "A lender advances less than an asset's reference value because liquidation and price risk remain.", {
    evidenceIds: [evidence.id], whatHappened: `Yasmin held your ${item} and advanced ${principal}🥫 against its ${reference}🥫 reference value.`,
  });
  game.lastInteraction = { action: "secured-loan", targetId: "yasmin", text: `Yasmin takes the ${item} into custody and advances ${principal}🥫. Repayment is ${principal + 1}🥫 on Day ${obligation.dueDay}.` };
  return game;
}

function exactGoalUtility(buyerId, item) {
  return Number((NPC_PROFILES[buyerId]?.goals || []).find((goal) => goal.item === item)?.utility || 0);
}

function interestUtility(buyerId, item) {
  const type = ITEMS[item]?.type || "";
  return (NPC_PROFILES[buyerId]?.interests || []).reduce((best, interest) =>
    interest?.typeIncludes && type.includes(interest.typeIncludes) ? Math.max(best, Number(interest.utility || 0)) : best, 0);
}

function inboundItemOffer(game, buyerId, item) {
  const buyer = game.traders[buyerId];
  if (!buyer || buyer.inventory.includes(item) || (buyerId === "aspen" && game.flags.sailorDeparted)) return null;
  const goalUtility = exactGoalUtility(buyerId, item);
  const tasteUtility = interestUtility(buyerId, item);
  const utility = Math.max(goalUtility, tasteUtility);
  if (utility <= 0) return null;

  const openingCash = Number(INITIAL_TRADERS[buyerId]?.sardines || buyer.sardines || 0);
  const spendable = Math.max(0, buyer.sardines - Math.ceil(openingCash * (goalUtility > 0 ? 0.18 : 0.32)));
  const floor = sellerAsk(game, "player", item);
  const ceiling = buyerMax(game, buyerId, item);
  if (ceiling < floor || spendable < floor) return null;
  const target = goalUtility > 0
    ? valueOf(item) + Math.max(1, Math.ceil(goalUtility * 0.45))
    : valueOf(item) + Math.min(2, Math.ceil(tasteUtility * 0.2));
  const price = Math.min(spendable, ceiling, Math.max(floor, target + Math.min(1, game.relationships[buyerId] || 0)));
  if (price < floor) return null;
  return {
    id: `inbound-${game.day}-morning-${buyerId}-${item}`,
    day: game.day, phase: "morning", kind: "buy-item", buyerId, item, price,
    priority: goalUtility > 0 ? 100 + goalUtility : 40 + tasteUtility,
    status: "pending",
    reason: goalUtility > 0 ? "exact current need" : "recognisable market interest",
  };
}

function inboundInformationOffer(game, buyerId, info) {
  const price = informationPrice(game, info, buyerId);
  if (price <= 0 || game.traders[buyerId].sardines < price) return null;
  return {
    id: `inbound-${game.day}-${game.phase}-${buyerId}-info-${info.id}`,
    day: game.day, phase: game.phase, kind: "buy-information", buyerId, infoId: info.id, price,
    priority: 80 + precisionBonus(info.precision) * 4 + confidenceBonus(info.confidence),
    status: "pending", reason: "the lead is relevant to this trader",
  };
}

export function buildInboundOffers(current, phase = current.phase) {
  if (!["morning", "afternoon"].includes(phase) || current.ended) return [];
  const candidates = [];
  if (phase === "morning") publiclyKnownPlayerItems(current).forEach((item) => {
    Object.keys(NPC_PROFILES).forEach((buyerId) => {
      const offer = inboundItemOffer(current, buyerId, item);
      if (offer) candidates.push(offer);
    });
  });
  current.information.forEach((info) => informationBuyers(current, info).forEach((buyerId) => {
    const offer = inboundInformationOffer(current, buyerId, info);
    if (offer) candidates.push(offer);
  }));

  const existing = new Set(current.inboundOffers.filter((offer) => offer.day === current.day).map((offer) => offer.id));
  const picked = [];
  const buyers = new Set();
  candidates.filter((offer) => !existing.has(offer.id))
    .sort((a, b) => b.priority - a.priority || a.buyerId.localeCompare(b.buyerId) || a.id.localeCompare(b.id))
    .forEach((offer) => {
      if (picked.length < 2 && !buyers.has(offer.buyerId)) {
        buyers.add(offer.buyerId);
        picked.push(offer);
      }
    });
  return picked;
}

function refreshInboundOffers(game, phase = game.phase) {
  game.inboundOffers.forEach((offer) => {
    if (offer.status === "pending" && (offer.day < game.day || offer.phase !== phase)) offer.status = "expired";
  });
  const additions = buildInboundOffers(game, phase);
  game.inboundOffers.push(...additions);
  if (additions.length) game.log.unshift(`${additions.length} trader${additions.length === 1 ? "" : "s"} approached you directly.`);
}

export function acceptInboundOffer(current, offerId) {
  const game = clone(current);
  const offer = game.inboundOffers.find((entry) => entry.id === offerId && entry.status === "pending");
  if (!offer || offer.day !== game.day || offer.phase !== game.phase) return game;
  if (offer.kind === "buy-item") {
    if (game.phase !== "morning" || !game.traders.player.inventory.includes(offer.item) ||
      game.inboundOffers.some((entry) => entry.id !== offer.id && entry.status === "accepted" && entry.kind === "buy-item" && entry.item === offer.item)) return game;
    game.marketPlan.push({
      from: offer.buyerId, to: "player", wantItem: offer.item, offerItem: null, sardines: offer.price,
      reason: "Accepted inbound bid to the player.", knowledgeBasis: "publicly known player holding", inboundOfferId: offer.id,
    });
    offer.status = "accepted";
    recordEvidence(game, "inbound-bid-accepted", { offerId: offer.id, buyerId: offer.buyerId, item: offer.item, price: offer.price, channel: "public" });
    game.lastInteraction = { action: "inbound-offer", targetId: offer.buyerId, text: `You accept ${game.traders[offer.buyerId].name}'s ${offer.price}🥫 bid for ${offer.item}. It will settle at Noon if you still own the item.` };
    game.log.unshift(game.lastInteraction.text);
    return game;
  }
  if (offer.kind === "buy-information" && game.actionsRemaining > 0) {
    const info = game.information.find((entry) => entry.id === offer.infoId);
    const paid = info && transferInformation(game, info, offer.buyerId, { cash: true });
    if (!paid) return game;
    offer.status = "accepted";
    game.actionsRemaining -= 1;
    const evidence = recordEvidence(game, "inbound-information-accepted", { offerId: offer.id, buyerId: offer.buyerId, infoId: info.id, price: paid, channel: "private", source: info.source, confidence: info.confidence, freshness: info.freshness });
    addLearningNote(game, "information-market", "Information is an asset", "A useful lead can be sold, but its resale value falls as it diffuses.", {
      evidenceIds: [evidence.id],
      whatHappened: `${game.traders[offer.buyerId].name} bought your lead for ${paid}🥫. It is no longer exclusive.`,
    });
    game.lastInteraction = { action: "inbound-information", targetId: offer.buyerId, text: `${game.traders[offer.buyerId].name} pays ${paid}🥫 for your lead. It is no longer exclusive.` };
    game.log.unshift(game.lastInteraction.text);
    if (game.phase === "morning") replanNPCMarket(game);
  }
  return game;
}

export function declineInboundOffer(current, offerId) {
  const game = clone(current);
  const offer = game.inboundOffers.find((entry) => entry.id === offerId && entry.status === "pending");
  if (offer) {
    offer.status = "declined";
    recordEvidence(game, "inbound-offer-declined", { offerId: offer.id, buyerId: offer.buyerId, kind: offer.kind, item: offer.item || null });
    game.lastInteraction = { action: "decline-inbound", targetId: offer.buyerId, text: `You decline ${game.traders[offer.buyerId].name}'s approach.` };
  }
  return game;
}

export function requestMarketProxy(current, targetId = "sterling") {
  const game = clone(current);
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || game.ended) return game;
  if (game.playerState.form !== "animal" || canAccessVenue(game, "formalMarket")) return game;

  const target = game.traders[targetId];
  const relationship = game.relationships[targetId] || 0;
  if (!target || !["sterling", "dima"].includes(targetId) || (targetId === "sterling" && relationship < 2)) return game;

  const player = game.traders.player;
  const fee = targetId === "dima" ? DIMA_PROXY_FEE : PROXY_FEE;
  const usedCredit = player.sardines < fee;
  if (player.sardines >= fee) {
    player.sardines -= fee;
    target.sardines += fee;
    if (targetId === "dima") recordRecurring(game, "dima", "proxy-fee", fee, { venueId: "formalMarket" });
    game.lastInteraction = { action: "proxy", targetId, text: `${target.name} agrees to settle today's formal-market orders for ${fee}🥫.` };
  } else if (targetId === "sterling" && relationship >= 3) {
    const obligation = createObligation(game, {
      kind: "proxy-fee",
      creditorId: targetId,
      amount: fee,
      dueDay: game.day + 2,
      note: "Formal-market proxy fee.",
    });
    teachCredit(game, obligation, game.decisionEvidence.at(-1), `${target.name} advanced a ${fee}🥫 proxy fee, due Day ${obligation.dueDay}.`);
    game.stats.creditUsed += 1;
    game.lastInteraction = { action: "proxy", targetId, text: `${target.name} agrees to proxy today's market on credit.` };
  } else {
    game.lastInteraction = { action: "proxy", targetId, text: `${target.name} will proxy, but not on credit yet.` };
    return game;
  }

  game.playerState.proxyAccess.push({ venueId: "formalMarket", via: targetId, expiresDay: game.day });
  game.stats.proxyUses += 1;
  game.actionsRemaining -= 1;
  recordEvidence(game, "proxy-access", { via: targetId, fee, onCredit: usedCredit });
  game.log.unshift(game.lastInteraction.text);
  return game;
}

export function repayObligation(current, obligationId) {
  const game = clone(current);
  const sunsetSecured = game.phase === "sunset" && currentObligations(game).some((entry) => entry.id === obligationId && entry.kind === "secured-loan" && entry.dueDay <= game.day);
  if ((!sunsetSecured && (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0)) || game.ended) return game;

  const obligation = currentObligations(game).find((entry) => entry.id === obligationId);
  if (!obligation || ["future-delivery", "information-exclusivity"].includes(obligation.kind)) return game;
  const player = game.traders.player;
  if (player.sardines < obligation.amount) return game;
  const openingCash = player.sardines;
  const actionsBefore = game.actionsRemaining;

  player.sardines -= obligation.amount;
  const creditor = game.traders[obligation.creditorId];
  if (creditor) creditor.sardines += obligation.amount;
  if (obligation.kind === "secured-loan" && obligation.collateral) {
    addPerishableAge(game, player, obligation.collateral, obligation.collateralAge);
    player.inventory.push(obligation.collateral);
  }
  obligation.status = "settled";
  obligation.settledDay = game.day;
  if (!sunsetSecured) game.actionsRemaining -= 1;
  const evidence = recordEvidence(game, obligation.kind === "secured-loan" ? "secured-loan-repaid" : "credit-repaid", { obligationId, creditorId: obligation.creditorId, amount: obligation.amount, collateral: obligation.collateral || null, timing: game.day <= obligation.dueDay ? "on-time" : "late", openingCash, actionsBefore, actionsAfter: game.actionsRemaining });
  if (obligation.kind !== "secured-loan") {
    teachCredit(game, obligation, evidence, `You repaid ${obligation.amount}🥫 to ${creditor?.name || obligation.creditorId} ${game.day <= obligation.dueDay ? "on time" : "late"}.`);
    if (game.relationships[obligation.creditorId] !== undefined) game.relationships[obligation.creditorId] += 1;
  }
  game.lastInteraction = { action: "repay", targetId: obligation.creditorId, text: `You settle ${obligation.amount}🥫 owed to ${creditor?.name || obligation.creditorId}.` };
  game.log.unshift(game.lastInteraction.text);
  return game;
}

function recordTrade(game, trade, source) {
  const entry = {
    id: `${game.day}-${game.history.length + 1}`,
    day: game.day,
    phase: "noon",
    source,
    channel: "public",
    from: trade.from,
    to: trade.to,
    item: trade.wantItem,
    paymentItem: trade.offerItem || null,
    sardines: Number(trade.sardines || 0),
    infoId: trade.infoId || null,
  };
  game.history.push(entry);
  if (source === "npc-plan") recordEvidence(game, "public-market-trade", { tradeId: entry.id, from: entry.from, to: entry.to, item: entry.item, paymentItem: entry.paymentItem, sardines: entry.sardines, channel: "public" });

  Object.keys(game.npcMemory).forEach((npcId) => {
    if (npcId === trade.from || npcId === trade.to) return;
    const memory = game.npcMemory[npcId];
    memory.observedDemand[trade.wantItem] = (memory.observedDemand[trade.wantItem] || 0) + 1;
  });
  return entry;
}

function produceIfReady(game, recipeId) {
  const recipe = PRODUCTION_RECIPES[recipeId];
  const producer = game.traders[recipe.producerId];
  if (producer.inventory.includes(recipe.output) || !recipe.inputs.every((item) => producer.inventory.includes(item)) ||
      !recipe.durableTools.every((item) => recipeId !== "onewheel" || producer.inventory.includes(item))) return false;
  recipe.inputs.forEach((item) => {
    takePerishableAge(game, producer, item);
    producer.inventory = removeOne(producer.inventory, item);
  });
  producer.inventory.push(recipe.output);
  recordEvidence(game, "world-consequence", { thread: recipeId === "maiTai" ? "barRecipe" : "onewheel", consequence: "production", producerId: recipe.producerId, inputs: [...recipe.inputs], output: recipe.output });
  if (recipeId === "maiTai") {
    game.worldThreads.barRecipe.stage = "aftermath";
    game.log.unshift("Sterling has the complete recipe and makes a proper Mai Tai for the Bar's stock.");
  } else {
    game.worldThreads.onewheel.stage = "aftermath";
    game.log.unshift("Aspen consumes the four bicycle parts and uses the torque wrench to assemble a working onewheel.");
  }
  return true;
}

function applyWorldReceivedItem(game, receiverId, item) {
  if (!item || !game.traders[receiverId]) return;
  if (receiverId === "sterling" && item === "Orgeat Bottle") game.worldThreads.barRecipe.stage = "outcome";
  if (receiverId === "yasmin" && item === "Sperm Whale Oil") game.worldThreads.valeScreening.stage = "outcome";
}

function applyTradeConsequences(game, trade) {
  if (trade.from === "player") {
    const profit = valueOf(trade.wantItem) - valueOf(trade.offerItem) - Number(trade.sardines || 0);
    game.stats.totalProfit += profit;
    game.stats.tradeCount += 1;
    if (profit >= 2) game.stats.profitableFlips += 1;
    if (profit <= -3) game.stats.overpays += 1;
  }
  if (trade.to === "player") game.stats.inboundTrades += 1;

  const isCheat = trade.from === "player" && trade.to === "aspen" && trade.offerItem === "Bad Tangerine" && trade.claim !== "truthful" && !trade.inspectionAllowed;
  if (isCheat) {
    game.flags.cheated = true;
    game.stats.cheats += 1;
    game.relationships.aspen = Math.min(game.relationships.aspen, -2);
    game.log.unshift("A Bad Tangerine passed as citrus. Aspen will remember this.");
    recordEvidence(game, "deception", { claim: trade.claim || "ambiguous", item: trade.offerItem, counterpartyId: trade.to, inspectionAllowed: trade.inspectionAllowed, outcome: "filled" });
  }
  applyWorldReceivedItem(game, trade.from, trade.wantItem);
  applyWorldReceivedItem(game, trade.to, trade.offerItem);
  produceIfReady(game, "maiTai");
  produceIfReady(game, "onewheel");
}

export function giveItem(current, targetId, item) {
  const game = clone(current);
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || game.ended ||
      !game.traders[targetId] || targetId === "player" || !game.traders.player.inventory.includes(item)) return game;
  game.traders.player.inventory = removeOne(game.traders.player.inventory, item);
  const perishAge = takePerishableAge(game, current.traders.player, item);
  addPerishableAge(game, game.traders[targetId], item, perishAge);
  game.traders[targetId].inventory.push(item);
  const relationshipGain = privateUtility(game, targetId, item) >= 8 ? 2 : 1;
  game.relationships[targetId] += relationshipGain;
  game.actionsRemaining -= 1;
  game.stats.gifts += 1;
  game.giftHistory.push({ day: game.day, targetId, item, relationshipGain });
  const evidence = recordEvidence(game, "item-gift", { targetId, item, channel: "private", referenceValue: valueOf(item), recipientUtility: privateUtility(game, targetId, item) });
  applyWorldReceivedItem(game, targetId, item);
  produceIfReady(game, "maiTai");
  produceIfReady(game, "onewheel");
  addLearningNote(game, "gift-economy", "A good can become relationship capital", "A physical good can strengthen access or trust instead of becoming cash.", {
    evidenceIds: [evidence.id],
    whatHappened: `You gave ${item} to ${game.traders[targetId].name}. They accepted it as a gift and your relationship improved.`,
  });
  game.lastInteraction = { action: "gift", targetId, text: `You give ${item} to ${game.traders[targetId].name}. They accept it as a gift, not a market settlement.` };
  game.log.unshift(game.lastInteraction.text);
  if (game.phase === "morning") replanNPCMarket(game);
  return game;
}

export function duePrivateMatters(game) {
  return [
    ...currentObligations(game).filter((entry) => ["future-delivery", "secured-loan"].includes(entry.kind) && entry.dueDay <= game.day),
    ...game.claims.filter((entry) => entry.status === "open" && entry.currentHolderId === "player" && entry.currentHolderLifeId === game.playerState.legalIdentity.lifeId && entry.dueDay <= game.day),
  ];
}

export function resolveDuePrivateMatter(current, obligationId, action) {
  const obligation = duePrivateMatters(current).find((entry) => entry.id === obligationId);
  if (!obligation || current.phase !== "sunset") return clone(current);
  if (current.claims.some((entry) => entry.id === obligationId)) return resolveJuanClaim(current, obligationId, action);
  if (obligation.kind === "future-delivery" && action === "deliver") return fulfillFutureDelivery(current, obligationId);
  if (obligation.kind === "secured-loan" && action === "repay") {
    return repayObligation(current, obligationId);
  }

  const game = clone(current);
  const live = game.obligations.find((entry) => entry.id === obligationId);
  if (live.kind === "future-delivery" && action === "default") {
    game.traders.aspen.sardines += live.reservedBalance;
    live.status = "defaulted";
    live.settledDay = game.day;
    game.relationships.aspen -= 2;
    game.stats.defaults += 1;
    const evidence = recordEvidence(game, "future-delivery-defaulted", { obligationId, item: live.item, reservedReturned: live.reservedBalance, openingCash: game.traders.player.sardines });
    const restitution = createObligation(game, { kind: "restitution", creditorId: "aspen", amount: 5, dueDay: game.day + 2, note: "Restitution after the missed Lime promise." });
    teachCredit(game, restitution, evidence, `The reserved ${live.reservedBalance}🥫 returned to Aspen and you now owe 5🥫 restitution.`);
    game.lastInteraction = { action: "future-delivery-defaulted", targetId: "aspen", text: "You do not deliver. The reserved balance returns to Aspen; 5🥫 restitution is now due." };
  } else if (live.kind === "secured-loan" && action === "seize") {
    game.traders.yasmin.inventory.push(live.collateral);
    addPerishableAge(game, game.traders.yasmin, live.collateral, live.collateralAge);
    live.status = "seized";
    live.settledDay = game.day;
    recordEvidence(game, "secured-collateral-seized", { obligationId, collateral: live.collateral, residualDebt: 0 });
    game.lastInteraction = { action: "secured-collateral-seized", targetId: "yasmin", text: `Yasmin keeps the ${live.collateral}. The claim is closed with no residual debt.` };
  }
  return game;
}

function publicPostedAsk(game, sellerId, item) {
  const produced = (sellerId === "sterling" && item === "Mai Tai") || (sellerId === "aspen" && item === "Built Onewheel");
  const isPublic = ((NPC_PROFILES[sellerId]?.publicStock || []).includes(item) || produced) && game.traders[sellerId]?.inventory.includes(item);
  return isPublic ? sellerAsk(game, sellerId, item) : null;
}

function clearingPlayerOrders(game) {
  if (game.lockedPlayerOrders?.length) return game.lockedPlayerOrders;
  // Compatibility for direct engine smoke calls that construct a Noon state manually.
  return game.playerOrders.filter((order) => order.to && order.wantItem);
}

function clearCommittedOrders(game) {
  const orders = [
    ...clearingPlayerOrders(game).map((order) => ({ ...order, from: "player" })),
    ...game.marketPlan,
  ];
  const groups = new Map();
  const available = clone(game.traders);
  const perishableAges = new Map();

  const reject = (order, reasonCode, reason, metadata = {}) => {
    if (order.from !== "player") return;
    game.rejected.push({
      ...order,
      sardines: Number.isFinite(order.sardines) ? order.sardines : null,
      reasonCode,
      reason,
      ...metadata,
    });
  };

  orders.forEach((order) => {
    const trade = {
      orderId: order.orderId || null,
      from: order.from,
      to: order.to,
      wantItem: order.wantItem,
      offerItem: order.offerItem || null,
      sardines: Number(order.sardines ?? 0),
      claim: order.claim || null,
      inspectionAllowed: Boolean(order.inspectionAllowed),
      infoId: order.infoId || null,
    };
    const buyer = game.traders[trade.from];
    const seller = game.traders[trade.to];
    const postedAsk = publicPostedAsk(game, trade.to, trade.wantItem);

    if (!buyer || !seller || trade.from === trade.to || !ITEMS[trade.wantItem] ||
        (trade.offerItem && !ITEMS[trade.offerItem]) || order.sardines == null ||
        !Number.isFinite(trade.sardines) || trade.sardines < 0) {
      reject(trade, "invalid", "This order was not valid.", { postedAsk });
      return;
    }
    if (trade.from === "player" && !canAccessVenue(game, "formalMarket")) {
      reject(trade, "no-access", "Your current legal form cannot settle directly in the formal market without a proxy.", { postedAsk });
      return;
    }
    if (trade.from === "player" && !knownItemsForTrader(game, trade.to).includes(trade.wantItem)) {
      reject(trade, "unknown-holding", "You did not have a current enough holding to target this seller with this order.", { postedAsk });
      return;
    }
    if (!seller.inventory.includes(trade.wantItem)) {
      reject(trade, "stale-stock", "The seller no longer had the item when Noon opened.", { postedAsk });
      return;
    }
    if (buyer.sardines < trade.sardines || (trade.offerItem && !buyer.inventory.includes(trade.offerItem))) {
      reject(trade, "unfunded", "You did not own the opening cash or barter item written into this order.", { postedAsk });
      return;
    }

    const isCheat = trade.to === "aspen" && trade.offerItem === "Bad Tangerine" && trade.claim !== "truthful";
    const utility = trade.offerItem ? privateUtility(game, trade.to, trade.offerItem) : 0;
    const mistakenCitrusUtility = isCheat && !trade.inspectionAllowed ? privateUtility(game, trade.to, "Lime Crate") : 0;
    const paymentValue = valueOf(trade.offerItem) + utility + mistakenCitrusUtility + trade.sardines;
    const ask = sellerAsk(game, trade.to, trade.wantItem);
    if (paymentValue < ask) {
      reject(trade, "below-ask", "The seller valued your payment package below the minimum they would accept.", { postedAsk });
      return;
    }

    const key = `${trade.to}:${trade.wantItem}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ trade, paymentValue, postedAsk });
  });

  [...groups.keys()].sort().forEach((key) => {
    const candidates = groups.get(key);
    const tieRanks = new Map();
    unique(candidates.map(({ paymentValue }) => paymentValue)).forEach((value) => {
      const bidders = unique(candidates.filter((candidate) => candidate.paymentValue === value).map(({ trade }) => trade.from)).sort((a, b) => (a === "player") - (b === "player") || a.localeCompare(b));
      bidders.forEach((id, index) => tieRanks.set(`${value}:${id}`, (index - (game.day - 1) % bidders.length + bidders.length) % bidders.length));
    });
    candidates.sort((a, b) => b.paymentValue - a.paymentValue ||
      tieRanks.get(`${a.paymentValue}:${a.trade.from}`) - tieRanks.get(`${b.paymentValue}:${b.trade.from}`));

    const acceptedForLot = [];
    candidates.forEach(({ trade, postedAsk }) => {
      const buyer = available[trade.from];
      const seller = available[trade.to];
      if (buyer.sardines < trade.sardines || (trade.offerItem && !buyer.inventory.includes(trade.offerItem))) {
        reject(trade, "resource-used", "Another filled order already consumed opening resources this order needed.", { postedAsk });
        return;
      }
      if (!seller.inventory.includes(trade.wantItem)) {
        const winner = acceptedForLot[0] || null;
        reject(trade, "outbid", "Another eligible committed offer won the available stock.", {
          postedAsk,
          winnerId: winner?.from || null,
          winnerSardines: winner?.sardines ?? null,
          winnerPaymentItem: winner?.offerItem || null,
        });
        return;
      }
      buyer.sardines -= trade.sardines;
      const ages = { wanted: takePerishableAge(game, seller, trade.wantItem), payment: null };
      if (trade.offerItem) ages.payment = takePerishableAge(game, buyer, trade.offerItem);
      if (trade.offerItem) buyer.inventory = removeOne(buyer.inventory, trade.offerItem);
      seller.inventory = removeOne(seller.inventory, trade.wantItem);
      game.marketOutcome.push(trade);
      perishableAges.set(trade, ages);
      acceptedForLot.push(trade);
    });
  });

  game.traders = available;
  game.marketOutcome.forEach((trade) => {
    const ages = perishableAges.get(trade);
    game.traders[trade.to].sardines += trade.sardines;
    if (trade.offerItem) {
      addPerishableAge(game, game.traders[trade.to], trade.offerItem, ages?.payment);
      game.traders[trade.to].inventory.push(trade.offerItem);
    }
    addPerishableAge(game, game.traders[trade.from], trade.wantItem, ages?.wanted);
    game.traders[trade.from].inventory.push(trade.wantItem);
  });
  game.marketOutcome.forEach((trade) => {
    recordTrade(game, trade, trade.from === "player" ? "player-order" : "npc-plan");
    applyTradeConsequences(game, trade);
  });
}

function applyExperienceFirstLearning(game) {
  game.rejected.forEach((order) => {
    const evidenceIds = game.decisionEvidence.filter((entry) => entry.orderId === order.orderId).map((entry) => entry.id);
    const seller = game.traders[order.to]?.name || order.to;
    if (order.reasonCode === "outbid") addLearningNote(game, "competition", "Competition / execution risk", "An order is a commitment, not a fill. Meeting an ask does not guarantee scarce stock.", {
      evidenceIds,
      whatHappened: `Your order for ${order.wantItem} did not fill. ${game.traders[order.winnerId]?.name || "Another committed buyer"} offered more seller-valued consideration to ${seller}.`,
    });
    else if (order.reasonCode === "stale-stock") addLearningNote(game, "stale-information", "Stale information", "A fact can be true when learned and useless by the time settlement arrives.", {
      evidenceIds,
      whatHappened: `Your order for ${order.wantItem} did not fill because ${seller} no longer held it when Noon opened.`,
    });
    else if (order.reasonCode === "resource-used") addLearningNote(game, "opening-liquidity", "Opening-resource constraint", "Noon settles only from opening resources, so one fill can make another commitment impossible.", {
      evidenceIds,
      whatHappened: `Your order for ${order.wantItem} could not settle because another filled order had already used cash or barter committed at opening.`,
    });
    else if (order.reasonCode === "below-ask") addLearningNote(game, "reservation-price", "Reservation price", "A posted ask is a seller's public minimum, not a universal value for every payment package.", {
      evidenceIds,
      whatHappened: `${seller} declined your payment package for ${order.wantItem} because they valued it below their minimum.`,
    });
    else addLearningNote(game, "commitment-settlement", "Commitment is not settlement", "Submitting or accepting an order does not transfer anything until the market can settle it.", {
      evidenceIds,
      whatHappened: `Your order for ${order.wantItem} did not settle: ${order.reason}`,
    });
  });
  game.marketOutcome.filter((trade) => trade.from === "player" && trade.offerItem).forEach((trade) => {
    const evidence = game.decisionEvidence.find((entry) => entry.type === "market-order-outcome" && entry.orderId === trade.orderId);
    addLearningNote(game, "private-value", "Private utility / barter value", "A barter item can matter more to one counterparty than its public reference price suggests.", {
      evidenceIds: [evidence?.id],
      whatHappened: `${game.traders[trade.to].name} accepted ${trade.offerItem}${trade.sardines ? ` plus ${trade.sardines}🥫` : ""} for ${trade.wantItem}.`,
    });
  });
}

function recordMarketOutcomes(game) {
  game.marketOutcome.filter((trade) => trade.from === "player").forEach((trade) => {
    recordEvidence(game, "market-order-outcome", {
      orderId: trade.orderId,
      outcome: "filled",
      wantItem: trade.wantItem,
      cashPaid: trade.sardines,
      barterItem: trade.offerItem,
      channel: "public",
      referencePnL: valueOf(trade.wantItem) - valueOf(trade.offerItem) - trade.sardines,
    });
  });
  game.rejected.forEach((order) => recordEvidence(game, "market-order-outcome", {
    orderId: order.orderId || null,
    outcome: "rejected",
    reasonCode: order.reasonCode,
    wantItem: order.wantItem,
    cashOffered: order.sardines,
    barterItem: order.offerItem,
    channel: "public",
    postedAsk: order.postedAsk,
    winnerId: order.winnerId || null,
    winnerSardines: order.winnerSardines ?? null,
    winnerPaymentItem: order.winnerPaymentItem || null,
  }));
}

function markInboundSettlement(game) {
  game.inboundOffers.forEach((offer) => {
    if (offer.status !== "accepted" || offer.kind !== "buy-item") return;
    offer.status = game.marketOutcome.some((trade) => trade.from === offer.buyerId && trade.to === "player" && trade.wantItem === offer.item && trade.sardines === offer.price)
      ? "filled" : "failed";
  });
}

function updateHeatFromHistory(game) {
  const todays = game.history.filter((trade) => trade.day === game.day);
  const bought = new Set(todays.map((trade) => trade.item));
  const next = { ...game.heat };
  bought.forEach((item) => { next[item] = Math.min(5, (next[item] || 0) + 1); });
  Object.keys(next).forEach((item) => {
    if (!bought.has(item)) next[item] = Math.max(0, next[item] - 1);
  });
  game.heat = next;
}

function settleInformationCovenants(game) {
  currentObligations(game).filter((entry) => entry.kind === "information-exclusivity").forEach((covenant) => {
    const causalTrades = game.history.filter((trade) => trade.day === game.day && trade.infoId === covenant.infoId);
    if (causalTrades.some((trade) => trade.from === covenant.creditorId)) covenant.buyerUsed = true;
    if (covenant.breached && causalTrades.some((trade) => trade.from === covenant.breachPartyId)) {
      covenant.detected = true;
      game.relationships[covenant.creditorId] -= 2;
      const evidence = recordEvidence(game, "information-exclusivity-detected", { obligationId: covenant.id, infoId: covenant.infoId, buyerId: covenant.creditorId, thirdPartyId: covenant.breachPartyId });
      covenant.evidenceIds.push(evidence.id);
    }
    if (game.day < covenant.expiresDay) return;
    covenant.status = covenant.breached ? (covenant.detected ? "breached-detected" : "breached-undetected") : "fulfilled";
    covenant.settledDay = game.day;
    if (!covenant.breached && covenant.buyerUsed) createBadge(game, { id: "exclusive", title: "EXCLUSIVE", summary: "Sold a scarce lead and kept the distribution promise while the buyer used it.", evidenceIds: covenant.evidenceIds });
  });
}

export function resolveNoonMarket(current) {
  const game = clone(current);
  if (game.phase !== "noon" || game.marketResolved || game.ended) return game;

  if (!game.sunMomentHistory.some((entry) => entry.day === game.day && entry.moment === "noon")) {
    recordSunMoment(game, "noon", "natural_pause", game.sunMoment?.opportunityIds || [], "continue", "Octopus Clearing opens after the natural pause.");
  }

  game.marketOutcome = [];
  game.rejected = [];
  const batch = {
    id: `octopus-clearing-${game.day}-${game.clearingBatches.length + 1}`,
    day: game.day,
    settledBy: "octopus",
    openingCommittedResources: {
      traders: Object.fromEntries(Object.entries(game.traders).map(([id, trader]) => [id, { cash: trader.sardines, inventory: [...trader.inventory] }])),
      playerOrders: clone(clearingPlayerOrders(game)),
      npcOrders: clone(game.marketPlan),
    },
    settledTransfers: [], cashTotal: 0, goodsTotal: 0, settlementFloatPeak: 0, settlementFloat: 0, reconciled: false,
  };
  clearCommittedOrders(game);
  batch.settledTransfers = clone(game.marketOutcome);
  batch.cashTotal = game.marketOutcome.reduce((sum, trade) => sum + Number(trade.sardines || 0), 0);
  batch.goodsTotal = game.marketOutcome.length + game.marketOutcome.filter((trade) => trade.offerItem).length;
  game.settlementFloat = batch.cashTotal;
  batch.settlementFloatPeak = game.settlementFloat;
  game.settlementFloat = 0;
  batch.settlementFloat = 0;
  batch.reconciled = true;
  game.clearingBatches.push(batch);
  recordMarketOutcomes(game);
  applyExperienceFirstLearning(game);
  markInboundSettlement(game);
  updateHeatFromHistory(game);
  settleInformationCovenants(game);
  game.marketResolved = true;
  game.playerOrders = resetOrders();
  game.log.unshift(`Octopus Clearing ${batch.id} settled ${game.marketOutcome.length} trade(s); client float reconciled to 0🥫.`);
  game.pendingEvents = buildEvents(game);
  return game;
}

function applyPerishables(game) {
  const timer = { ...game.perishTimer };
  Object.values(game.traders).forEach((trader) => {
    const nextInventory = [];
    const counts = Object.fromEntries(unique(trader.inventory).map((item) => [item, trader.inventory.filter((held) => held === item).length]));
    Object.entries(counts).forEach(([item, count]) => {
      const shelfLife = ITEMS[item]?.shelfLife;
      const timerKey = `${trader.id}:${item}`;
      if (!shelfLife) {
        nextInventory.push(...Array(count).fill(item));
        delete timer[timerKey];
        return;
      }
      const previous = Array.isArray(timer[timerKey]) ? timer[timerKey] : Array(count).fill(Number(timer[timerKey] || 0));
      const ages = [...previous.slice(0, count), ...Array(Math.max(0, count - previous.length)).fill(0)].map((age) => age + 1);
      const surviving = ages.filter((age) => age < shelfLife);
      const spoiled = count - surviving.length;
      nextInventory.push(...Array(surviving.length).fill(item));
      if (spoiled && ITEMS[item]?.foodUnits && trader.id === "player") nextInventory.push(...Array(spoiled).fill("Spoiled Fish"));
      if (spoiled) game.log.unshift(`${trader.name}'s ${spoiled > 1 ? `${spoiled} × ` : ""}${labelShort(item)} spoiled before tomorrow.`);
      if (spoiled) {
        const evidence = recordEvidence(game, "world-consequence", { consequence: "perished", traderId: trader.id, item, copies: spoiled });
        if (trader.id === "player") addLearningNote(game, "perishability", "Perishability", "Inventory can lose all saleability simply because time passes.", {
          evidenceIds: [evidence.id],
          whatHappened: `${spoiled > 1 ? `${spoiled} copies of ` : "Your "}${item} spoiled before the next day.`,
        });
      }
      if (surviving.length) timer[timerKey] = surviving;
      else delete timer[timerKey];
    });
    trader.inventory = nextInventory;
  });
  game.perishTimer = timer;
}

function settleYasminScreening(game) {
  if (game.worldThreads.valeScreening.stage === "aftermath" || !game.traders.yasmin.inventory.includes("Sperm Whale Oil")) return;
  game.traders.yasmin.inventory = removeOne(game.traders.yasmin.inventory, "Sperm Whale Oil");
  game.worldThreads.valeScreening.stage = "aftermath";
  recordEvidence(game, "world-consequence", { thread: "valeScreening", consequence: "consumption", actorId: "yasmin", item: "Sperm Whale Oil" });
  game.log.unshift("Yasmin burns the whale oil in obsolete projection equipment and completes the private screening.");
}

function settleInformationResale(game) {
  const candidates = [];
  game.information.forEach((info) => {
    if (!info.sellable || info.freshness === "stale") return;
    (info.knownBy || []).filter((sellerId) => sellerId !== "player").forEach((sellerId) => {
      informationBuyers(game, info).forEach((buyerId) => {
        const contact = SOCIAL_GRAPH[sellerId]?.[buyerId];
        const price = informationPrice(game, info, buyerId);
        if ((contact?.familiarity || 0) >= 2 && game.traders[buyerId].sardines >= price + 4) {
          candidates.push({ info, sellerId, buyerId, price, familiarity: contact.familiarity });
        }
      });
    });
  });
  const deal = candidates.sort((a, b) => b.familiarity - a.familiarity || a.info.id.localeCompare(b.info.id) || a.sellerId.localeCompare(b.sellerId))[0];
  if (!deal) return;
  game.traders[deal.buyerId].sardines -= deal.price;
  game.traders[deal.sellerId].sardines += deal.price;
  deal.info.knownBy.push(deal.buyerId);
  deal.info.soldTo.push(deal.buyerId);
  deal.info.diffusionCount = deal.info.knownBy.length - 1;
  deal.info.exclusive = false;
  deal.info.resaleCount = Number(deal.info.resaleCount || 0) + 1;
  deal.info.resaleState = "resold";
  game.npcMemory[deal.buyerId].knownHoldings[deal.info.item] = {
    holderId: deal.info.subjectId, learnedDay: game.day,
    source: `bought through ${SOCIAL_GRAPH[deal.sellerId][deal.buyerId].channel}`,
    infoId: deal.info.id,
  };
  game.informationTrades.push({ day: game.day, infoId: deal.info.id, from: deal.sellerId, to: deal.buyerId, price: deal.price });
  recordEvidence(game, "information-resold", { infoId: deal.info.id, sellerId: deal.sellerId, buyerId: deal.buyerId, price: deal.price, channel: "private", audienceSize: deal.info.knownBy.length });
}

function settleRecurringActivity(game) {
  const wong = game.traders.wong;
  const wongConfig = RECURRING_ECONOMY.wong;
  const householdPaid = Math.min(wongConfig.householdBurnPerSunset, wong.sardines);
  wong.sardines -= householdPaid;
  recordRecurring(game, "wong", "household-support-burn", -householdPaid, { shortfall: wongConfig.householdBurnPerSunset - householdPaid });
  if (game.day % wongConfig.rescueFoodDemandEveryDays === 0) {
    const meal = wong.inventory.find((item) => ITEMS[item]?.foodUnits);
    if (meal) {
      takePerishableAge(game, wong, meal);
      wong.inventory = removeOne(wong.inventory, meal);
      recordRecurring(game, "wong", "rescue-food-burn", -valueOf(meal), { item: meal });
    } else addDemand(game, "wong", "Fresh Mackerel", "Food is needed for Wong's household and rescue work.");
  }

  const sterling = game.traders.sterling;
  const sterlingConfig = RECURRING_ECONOMY.sterling;
  const hadIce = sterling.inventory.includes("Ice Block");
  const serviceRevenue = hadIce ? sterlingConfig.serviceRevenueWithIce : sterlingConfig.serviceRevenueBase;
  if (hadIce) {
    takePerishableAge(game, sterling, "Ice Block");
    sterling.inventory = removeOne(sterling.inventory, "Ice Block");
    recordRecurring(game, "sterling", "business-input", -valueOf("Ice Block"), { item: "Ice Block" });
  }
  sterling.sardines += serviceRevenue;
  game.systemMarkers.sterlingServiceCycles += 1;
  recordRecurring(game, "sterling", "outside-service-revenue", serviceRevenue, { inputUsed: hadIce ? "Ice Block" : null, cycle: game.systemMarkers.sterlingServiceCycles });
  if (game.systemMarkers.sterlingServiceCycles % sterlingConfig.serviceInputEveryCycles === 0) {
    const inputIndex = game.systemMarkers.sterlingServiceCycles / sterlingConfig.serviceInputEveryCycles - 1;
    const item = sterlingConfig.serviceInputRotation[inputIndex % sterlingConfig.serviceInputRotation.length];
    if (sterling.inventory.includes(item)) {
      takePerishableAge(game, sterling, item);
      sterling.inventory = removeOne(sterling.inventory, item);
      recordRecurring(game, "sterling", "business-input", -valueOf(item), { item });
    } else addDemand(game, "sterling", item, `Sterling needs ${item} for the next Bar service cycle.`);
  }
  const lastSubsidy = Number(game.systemMarkers.sterlingLastSubsidyDay || -Infinity);
  if (sterling.sardines < sterlingConfig.familySubsidyThreshold && game.day - lastSubsidy >= sterlingConfig.familySubsidyCooldownDays) {
    sterling.sardines += sterlingConfig.familySubsidy;
    game.systemMarkers.sterlingLastSubsidyDay = game.day;
    recordRecurring(game, "sterling", "family-subsidy", sterlingConfig.familySubsidy);
  }

  const aspen = game.traders.aspen;
  const aspenConfig = RECURRING_ECONOMY.aspen;
  if (game.day % aspenConfig.personalCostEveryDays === 0) {
    const paid = Math.min(aspenConfig.personalCost, aspen.sardines);
    aspen.sardines -= paid;
    recordRecurring(game, "aspen", "outside-support-personal-cost", -paid);
  }
  if (!game.flags.sailorDeparted && game.day + 1 >= game.systemMarkers.aspenNextDepartureDay) addDemand(game, "aspen", "Lime Crate", "Aspen has a clear provisioning pressure before departure.");
  if (!game.flags.sailorDeparted && game.day >= game.systemMarkers.aspenNextDepartureDay) {
    const routeNumber = Number(game.systemMarkers.aspenRouteCount || 0);
    const cargo = aspenConfig.cargoRotation[routeNumber % aspenConfig.cargoRotation.length];
    const cargoCost = Math.floor(valueOf(cargo) * aspenConfig.cargoCostRate);
    const totalCost = cargoCost + aspenConfig.maintenanceCost;
    if (aspen.sardines >= totalCost) {
      aspen.sardines -= totalCost;
      game.flags.sailorDeparted = true;
      game.systemMarkers.aspenRoute = { cargo, cargoCost, maintenanceCost: aspenConfig.maintenanceCost, departedDay: game.day, returnDay: game.day + aspenConfig.routeDurationDays };
      game.systemMarkers.aspenRouteCount = routeNumber + 1;
      recordRecurring(game, "aspen", "voyage-departure", -totalCost, { cargo, cargoCost, maintenanceCost: aspenConfig.maintenanceCost, returnDay: game.systemMarkers.aspenRoute.returnDay });
    } else {
      game.systemMarkers.aspenNextDepartureDay = game.day + 1;
      recordRecurring(game, "aspen", "voyage-delay", 0, { required: totalCost, cash: aspen.sardines });
    }
  }

  const yasmin = game.traders.yasmin;
  const yasminConfig = RECURRING_ECONOMY.yasmin;
  if (game.day % yasminConfig.maintenanceEveryDays === 0) {
    const functioning = yasmin.sardines >= yasminConfig.socialMaintenanceCost;
    const paid = functioning ? yasminConfig.socialMaintenanceCost : Math.min(yasmin.sardines, yasminConfig.socialMaintenanceCost);
    yasmin.sardines -= paid;
    recordRecurring(game, "yasmin", "social-position-maintenance", -paid, { functioning });
    if (functioning) {
      yasmin.sardines += yasminConfig.outsideYield;
      recordRecurring(game, "yasmin", "outside-capital-family-yield", yasminConfig.outsideYield);
    }
  }
  if (game.day % yasminConfig.acquisitionPressureEveryDays === 0) {
    const item = yasminConfig.acquisitionRotation[(game.day / yasminConfig.acquisitionPressureEveryDays - 1) % yasminConfig.acquisitionRotation.length];
    if (!yasmin.inventory.includes(item)) addDemand(game, "yasmin", item, "Yasmin has a provenance/prestige acquisition pressure.");
  }

  const juan = game.traders.juan;
  const juanConfig = RECURRING_ECONOMY.juan;
  game.crops.filter((crop) => crop.status === "growing" && crop.maturityDay <= game.day).forEach((crop) => {
    crop.status = "mature";
    crop.maturedDay = game.day;
    juan.inventory.push("Mature Nursery Plant");
    recordRecurring(game, "juan", "crop-maturity", valueOf("Mature Nursery Plant"), { cropId: crop.id, item: "Mature Nursery Plant" });
  });
  const fallbackCrop = game.crops.find((crop) => crop.status === "mature" && game.day - crop.maturedDay >= juanConfig.fallbackAfterDays);
  if (fallbackCrop && juan.inventory.includes("Mature Nursery Plant")) {
    juan.inventory = removeOne(juan.inventory, "Mature Nursery Plant");
    juan.sardines += juanConfig.fallbackSale;
    fallbackCrop.status = "sold-outside";
    recordRecurring(game, "juan", "outside-fallback-sale", juanConfig.fallbackSale, { cropId: fallbackCrop.id, item: "Mature Nursery Plant" });
  }
  if (!game.crops.some((crop) => crop.status === "growing") && juan.inventory.includes("Nursery Seed Packet") && juan.sardines >= juanConfig.plantingInputCost) {
    juan.inventory = removeOne(juan.inventory, "Nursery Seed Packet");
    juan.sardines -= juanConfig.plantingInputCost;
    const crop = { id: `juan-crop-${game.crops.length + 1}`, plantedDay: game.day, maturityDay: game.day + juanConfig.maturityDays, status: "growing", linkedAssetId: "juan-crop-cycle" };
    game.crops.push(crop);
    recordRecurring(game, "juan", "planting", -juanConfig.plantingInputCost, { cropId: crop.id, maturityDay: crop.maturityDay, seedConsumed: true });
  }

  const octopus = game.traders.octopus;
  const octopusConfig = RECURRING_ECONOMY.octopus;
  const outsideItem = octopusConfig.outsideSaleAny.find((item) => octopus.inventory.includes(item));
  if (outsideItem) {
    const proceeds = Math.max(1, Math.round(valueOf(outsideItem) * octopusConfig.outsideSaleRate));
    takePerishableAge(game, octopus, outsideItem);
    octopus.inventory = removeOne(octopus.inventory, outsideItem);
    octopus.sardines += proceeds;
    recordRecurring(game, "octopus", "outside-sale", proceeds, { item: outsideItem });
  }
}

function settleRecurringArrivals(game) {
  const wong = game.traders.wong;
  const wongConfig = RECURRING_ECONOMY.wong;
  if (game.day % wongConfig.oddJobIncomeEveryDays === 0) {
    wong.sardines += wongConfig.oddJobIncome;
    recordRecurring(game, "wong", "odd-job-income", wongConfig.oddJobIncome);
  }
  if (game.day % wongConfig.salvageEveryDays === 0) {
    const item = wongConfig.salvageRotation[(game.day / wongConfig.salvageEveryDays - 1) % wongConfig.salvageRotation.length];
    wong.inventory.push(item);
    recordRecurring(game, "wong", "labour-produced-salvage", valueOf(item), { item });
  }

  const route = game.systemMarkers.aspenRoute;
  if (game.flags.sailorDeparted && route && route.returnDay <= game.day) {
    game.traders.aspen.inventory.push(route.cargo);
    game.traders.aspen.sardines += RECURRING_ECONOMY.aspen.outsideCommission;
    game.flags.sailorDeparted = false;
    game.systemMarkers.aspenNextDepartureDay = game.day + RECURRING_ECONOMY.aspen.localIntervalDays;
    recordRecurring(game, "aspen", "voyage-return", RECURRING_ECONOMY.aspen.outsideCommission, { cargo: route.cargo, departedDay: route.departedDay, nextDepartureDay: game.systemMarkers.aspenNextDepartureDay });
    game.systemMarkers.aspenRoute = null;
  }

  const juan = game.traders.juan;
  const juanConfig = RECURRING_ECONOMY.juan;
  if (!juan.inventory.includes("Nursery Seed Packet") && game.day % juanConfig.seedSourceEveryDays === 0 && juan.sardines >= juanConfig.seedSourceCost) {
    juan.sardines -= juanConfig.seedSourceCost;
    juan.inventory.push("Nursery Seed Packet");
    recordRecurring(game, "juan", "seed-sourcing", -juanConfig.seedSourceCost, { item: "Nursery Seed Packet" });
  }

  const octopus = game.traders.octopus;
  const octopusConfig = RECURRING_ECONOMY.octopus;
  const item = octopusConfig.arrivals[(game.day - 1) % octopusConfig.arrivals.length];
  if (!octopus.inventory.includes(item)) {
    const cost = Math.max(1, Math.round(valueOf(item) * octopusConfig.arrivalCostRate));
    if (octopus.sardines >= cost) {
      octopus.sardines -= cost;
      octopus.inventory.push(item);
      recordRecurring(game, "octopus", "physical-arrival", -cost, { item, cost });
    } else recordRecurring(game, "octopus", "arrival-unfunded", 0, { item, cost, cash: octopus.sardines });
  }
  game.recurringDemands = game.recurringDemands.filter((entry) => entry.expiresDay >= game.day);
  game.recurringDemands.forEach((entry) => clearDemand(game, entry.actorId, entry.item));
}

function applyBarToolRevenue(game, settledDay) {
  if (game.systemMarkers.barToolBonusDay === settledDay) return;
  const tools = PRODUCTION_RECIPES.maiTai.productivityTools.filter((item) => game.traders.sterling.inventory.includes(item)).length;
  if (!tools) return;
  game.traders.sterling.sardines += tools;
  game.systemMarkers.barToolBonusDay = settledDay;
  recordRecurring(game, "sterling", "tool-service-revenue", tools);
  game.log.unshift(`The Bar's upgraded professional tools add ${tools}🥫 of service value tonight.`);
}

function chooseMealCreditSource(game) {
  return ["sterling", "wong"]
    .filter((id) => (game.relationships[id] || 0) >= 2 && (game.traders[id]?.sardines || 0) >= SUSTENANCE_PER_DAY)
    .sort((a, b) => (game.relationships[b] || 0) - (game.relationships[a] || 0) || a.localeCompare(b))[0] || null;
}

function transformPlayerToAnimal(game) {
  const player = game.traders.player;
  const oldLifeId = game.playerState.legalIdentity.lifeId;
  game.estates.push({
    lifeId: oldLifeId,
    endedDay: game.day,
    sardines: player.sardines,
    inventory: [...player.inventory],
    claimsReference: game.claims.filter((claim) => claim.currentHolderId === "player" && claim.currentHolderLifeId === oldLifeId && claim.status === "open").reduce((sum, claim) => sum + claim.faceAmount, 0),
    liabilities: currentObligations(game).reduce((sum, obligation) => sum + Number(obligation.amount || 0), 0),
    note: "Former legal identity. The current animal form cannot directly claim this estate.",
  });
  game.obligations.forEach((obligation) => {
    if (obligation.debtorLifeId !== oldLifeId || !["open", "overdue"].includes(obligation.status)) return;
    if (obligation.kind === "secured-loan") {
      game.traders.yasmin.inventory.push(obligation.collateral);
      addPerishableAge(game, game.traders.yasmin, obligation.collateral, obligation.collateralAge);
      obligation.status = "seized";
    } else if (obligation.kind === "information-exclusivity") obligation.status = "ended";
    else obligation.status = "estate";
  });
  player.sardines = 0;
  player.inventory = [];
  game.playerState.life += 1;
  game.stats.lives = game.playerState.life;
  game.playerState.form = "animal";
  game.playerState.legalIdentity = { status: "unrecognized", lifeId: `life-${game.playerState.life}`, formerLifeId: oldLifeId };
  game.playerState.proxyAccess = [];
  const evidence = recordEvidence(game, "form-transition", { from: "human", to: "animal", cause: "unfunded-sustenance", formerLifeId: oldLifeId });
  addLearningNote(game, "legal-personhood", "Memory continuity ≠ legal-person continuity", "Memory can continue even when institutions no longer recognise the same ownership claims.", {
    evidenceIds: [evidence.id],
    whatHappened: `You kept your memories after changing form, but your former estate remained attached to ${oldLifeId}.`,
  });
  game.log.unshift("You wake in an animal form. Your old assets still exist, but the law no longer recognises you as their owner.");
}

function settleSustenance(game) {
  const player = game.traders.player;
  const edible = player.inventory
    .filter((item) => (ITEMS[item]?.foodUnits || 0) >= SUSTENANCE_PER_DAY)
    .sort((a, b) => valueOf(a) - valueOf(b) || a.localeCompare(b));

  if (edible.length) {
    const meal = edible[0];
    takePerishableAge(game, player, meal);
    player.inventory = removeOne(player.inventory, meal);
    game.playerState.lastMeal = { day: game.day, source: "inventory", item: meal };
    recordEvidence(game, "sustenance", { source: "inventory", item: meal, referenceCost: valueOf(meal) });
    game.log.unshift(`You eat ${labelShort(meal)} before sleep.`);
    return;
  }
  if (player.sardines >= SUSTENANCE_PER_DAY) {
    player.sardines -= SUSTENANCE_PER_DAY;
    game.playerState.lastMeal = { day: game.day, source: "sardine-tin", amount: SUSTENANCE_PER_DAY };
    recordEvidence(game, "sustenance", { source: "cash", amount: SUSTENANCE_PER_DAY });
    game.log.unshift(`You open ${SUSTENANCE_PER_DAY}🥫 instead of keeping it as money.`);
    return;
  }

  const creditorId = chooseMealCreditSource(game);
  if (creditorId) {
    const creditor = game.traders[creditorId];
    creditor.sardines -= SUSTENANCE_PER_DAY;
    const obligation = createObligation(game, {
      kind: "meal-credit",
      creditorId,
      amount: SUSTENANCE_PER_DAY,
      dueDay: game.day + 2,
      note: "Food advanced at sunset.",
    });
    teachCredit(game, obligation, game.decisionEvidence.at(-1), `${creditor.name} advanced ${SUSTENANCE_PER_DAY}🥫 for food, due Day ${obligation.dueDay}.`);
    game.stats.creditUsed += 1;
    game.playerState.lastMeal = { day: game.day, source: "credit", creditorId };
    recordEvidence(game, "sustenance", { source: "credit", creditorId, amount: SUSTENANCE_PER_DAY });
    game.log.unshift(`${creditor.name} feeds you on credit. You now owe ${SUSTENANCE_PER_DAY}🥫.`);
    return;
  }
  transformPlayerToAnimal(game);
}

function markOverdueObligations(game) {
  const currentLife = game.playerState.legalIdentity.lifeId;
  game.obligations.forEach((obligation) => {
    if (obligation.debtorLifeId !== currentLife || obligation.status !== "open" || obligation.dueDay > game.day) return;
    obligation.status = "overdue";
    game.stats.defaults += 1;
    if (game.relationships[obligation.creditorId] !== undefined) game.relationships[obligation.creditorId] -= 1;
    const creditor = game.traders[obligation.creditorId];
    const evidence = recordEvidence(game, "credit-default", { obligationId: obligation.id, creditorId: obligation.creditorId, amount: obligation.amount, daysLate: game.day - obligation.dueDay });
    addLearningNote(game, "credit", "Credit creates an obligation", "Credit moves resources through time, but it leaves a claim that must later be repaid or defaulted.", {
      evidenceIds: [evidence.id],
      whatHappened: `${obligation.amount}🥫 owed to ${creditor?.name || obligation.creditorId} became overdue and the relationship worsened.`,
    });
    game.log.unshift(`${obligation.amount}🥫 owed to ${creditor?.name || obligation.creditorId} is now overdue.`);
  });
}

function snapshotPlayerOrders(game) {
  const orders = game.playerOrders
    .filter((order) => order.to && order.wantItem)
    .map((order, index) => ({
      ...clone(order),
      orderId: `player-order-${game.day}-${index + 1}`,
      offerItem: order.offerItem || "",
      sardines: Number(order.sardines || 0),
      postedAsk: publicPostedAsk(game, order.to, order.wantItem),
      lockedDay: game.day,
    }));
  const totalCash = orders.reduce((sum, order) => sum + order.sardines, 0);
  orders.forEach((order) => recordEvidence(game, "market-order-committed", {
    orderId: order.orderId,
    sellerId: order.to,
    wantItem: order.wantItem,
    cashOffered: order.sardines,
    barterItem: order.offerItem || null,
    postedAsk: order.postedAsk,
    metPublicAsk: Number.isFinite(order.postedAsk) ? order.sardines >= order.postedAsk : null,
    openingCash: game.traders.player.sardines,
    totalCashCommitted: totalCash,
    cashCommitmentRatio: game.traders.player.sardines ? totalCash / game.traders.player.sardines : null,
    channel: "public",
    openingInventory: [...game.traders.player.inventory],
    barterCopiesOwned: order.offerItem ? game.traders.player.inventory.filter((item) => item === order.offerItem).length : 0,
    knownHolding: knownItemsForTrader(game, order.to).includes(order.wantItem),
    knownInformation: game.information
      .filter((info) => info.subjectId === order.to && (!info.item || info.item === order.wantItem))
      .map((info) => ({ id: info.id, claimType: info.claimType, item: info.item, source: info.source, precision: info.precision, confidence: info.confidence, freshness: info.freshness, personallyVerified: info.personallyVerified })),
  }));
  return orders;
}

function recordSunMoment(game, moment, state, contextualOpportunityIds = [], action = "pause", effect = "", evidenceIds = [], immediateConsequence = null) {
  const entry = { day: game.day, moment, state, contextualOpportunityIds, action, effect, evidenceIds, immediateConsequence };
  game.sunMomentHistory.push(entry);
  return entry;
}

function noonResistanceOpportunity(game) {
  const informationEvidence = game.decisionEvidence.filter((entry) => entry.day === game.day && entry.phase === "morning" && entry.informationId && ["talk", "investigate"].includes(entry.type));
  const opening = game.noonOpeningPlayer || { cash: game.traders.player.sardines, inventory: game.traders.player.inventory };
  const fundable = game.lockedPlayerOrders.filter((order) => order.to && order.wantItem && order.sardines <= opening.cash && (!order.offerItem || opening.inventory.includes(order.offerItem)) && knownItemsForTrader(game, order.to).includes(order.wantItem));
  if (!fundable.length || !informationEvidence.length) return [];
  return [...fundable.map((order) => order.orderId), ...informationEvidence.map((entry) => entry.id)];
}

export function resistSunMoment(current) {
  const game = clone(current);
  if (game.phase !== "noon" || game.marketResolved || !game.sunMoment?.eligible || game.sunMoment.lateEditUsed || game.sunMoment.lateEditAvailable) return game;
  const evidence = recordEvidence(game, "sun-moment-resisted", { moment: "noon", opportunityIds: game.sunMoment.opportunityIds });
  recordSunMoment(game, "noon", "resisted", game.sunMoment.opportunityIds, "keep_working", "One late player order edit is available before the already-committed clearing batch.", [evidence.id], "NPC intentions remain committed and Octopus Clearing has not run.");
  game.sunMoment.state = "resisted";
  game.sunMoment.lateEditAvailable = true;
  return game;
}

export function applyLateOrderEdit(current, index, order) {
  const game = clone(current);
  const opening = game.noonOpeningPlayer;
  if (game.phase !== "noon" || game.marketResolved || !game.sunMoment?.lateEditAvailable || game.sunMoment.lateEditUsed || !opening || !game.lockedPlayerOrders[index]) return game;
  const edited = { ...clone(order), orderId: game.lockedPlayerOrders[index].orderId, offerItem: order.offerItem || "", sardines: Number(order.sardines || 0), lockedDay: game.day, lateEdit: true };
  const valid = game.traders[edited.to] && edited.to !== "player" && ITEMS[edited.wantItem] && Number.isFinite(edited.sardines) && edited.sardines >= 0 && edited.sardines <= opening.cash && (!edited.offerItem || opening.inventory.includes(edited.offerItem)) && knownItemsForTrader(game, edited.to).includes(edited.wantItem) && canAccessVenue(game, "formalMarket");
  if (!valid) return game;
  game.lockedPlayerOrders[index] = edited;
  game.sunMoment.lateEditAvailable = false;
  game.sunMoment.lateEditUsed = true;
  const evidence = recordEvidence(game, "sun-moment-late-order-edit", { moment: "noon", orderId: edited.orderId, sellerId: edited.to, wantItem: edited.wantItem, cashOffered: edited.sardines, barterItem: edited.offerItem || null, openingCash: opening.cash, openingInventory: [...opening.inventory] });
  const history = [...game.sunMomentHistory].reverse().find((entry) => entry.day === game.day && entry.moment === "noon" && entry.state === "resisted");
  if (history) {
    history.evidenceIds.push(evidence.id);
    history.immediateConsequence = `Late order ${edited.orderId} was edited once; the clearing batch still uses opening resources.`;
  }
  game.lastInteraction = { action: "late-order-edit", targetId: edited.to, text: `You make one late edit to ${edited.orderId}. Octopus Clearing remains a single committed batch.` };
  return game;
}

export function advancePhase(current) {
  const game = clone(current);
  if (game.ended || game.pendingEvents.length) return game;

  if (game.phase === "sunrise") {
    game.phase = "morning";
    game.actionsRemaining = MORNING_ACTIONS;
    game.lastInteraction = null;
    refreshInboundOffers(game, "morning");
    return game;
  }
  if (game.phase === "morning") {
    if (game.actionsRemaining > 0) recordEvidence(game, "phase-ended-with-unused-actions", { phase: "morning", unusedActions: game.actionsRemaining, cash: game.traders.player.sardines, openObligationCount: currentObligations(game).length });
    game.lockedPlayerOrders = snapshotPlayerOrders(game);
    game.noonOpeningPlayer = { cash: game.traders.player.sardines, inventory: [...game.traders.player.inventory] };
    game.phase = "noon";
    game.actionsRemaining = 0;
    game.lastInteraction = null;
    const opportunityIds = noonResistanceOpportunity(game);
    game.sunMoment = { moment: "noon", state: opportunityIds.length ? "contextual_opportunity" : "natural_pause", eligible: opportunityIds.length > 0, opportunityIds, lateEditAvailable: false, lateEditUsed: false };
    if (!opportunityIds.length) recordSunMoment(game, "noon", "natural_pause", [], "pause", "Octopus Clearing opens after the natural pause.");
    return game;
  }
  if (game.phase === "noon") {
    if (!game.marketResolved) return game;
    game.phase = "afternoon";
    game.actionsRemaining = AFTERNOON_ACTIONS;
    game.lastInteraction = null;
    refreshInboundOffers(game, "afternoon");
    return game;
  }
  if (game.phase === "afternoon") {
    if (game.actionsRemaining > 0) recordEvidence(game, "phase-ended-with-unused-actions", { phase: "afternoon", unusedActions: game.actionsRemaining, cash: game.traders.player.sardines, openObligationCount: currentObligations(game).length });
    game.phase = "sunset";
    game.actionsRemaining = 0;
    game.lastInteraction = null;
    game.sunMoment = { moment: "sunset", state: "natural_pause", eligible: false, opportunityIds: [], lateEditAvailable: false, lateEditUsed: false };
    recordSunMoment(game, "sunset", "natural_pause", [], "pause", "The harbour pauses before sunset settlement.");
    return game;
  }
  if (game.phase === "sunset") {
    if (duePrivateMatters(game).length) return game;
    settleSustenance(game);
    markOverdueObligations(game);
    settleYasminScreening(game);
    settleInformationResale(game);
    settleRecurringActivity(game);
    applyPerishables(game);
    settleRecurringArrivals(game);
    produceIfReady(game, "maiTai");
    produceIfReady(game, "onewheel");
    applyBarToolRevenue(game, game.day);
    if (game.day >= game.maxDays) {
      game.ended = true;
      game.winner = false;
      game.finalText = game.flags.sunflowerAcquired
        ? "You found the sunflower. It did not take you home. The prototype life window closes here, but the problem did not."
        : "The prototype's current life window closes here. The final life / rebirth pacing is not locked yet.";
      return game;
    }

    game.day += 1;
    game.phase = "sunrise";
    game.marketResolved = false;
    game.marketOutcome = [];
    game.rejected = [];
    game.lockedPlayerOrders = [];
    game.pendingEvents = [];
    game.actionsRemaining = 0;
    game.lastInteraction = null;
    game.noonOpeningPlayer = null;
    game.sunMoment = { moment: "sunrise", state: "natural_pause", eligible: false, opportunityIds: [], lateEditAvailable: false, lateEditUsed: false };
    recordSunMoment(game, "sunrise", "natural_pause", [], "pause", "The day begins after a brief natural pause.");
    game.playerState.proxyAccess = game.playerState.proxyAccess.filter((access) => access.expiresDay >= game.day);
    game.inboundOffers.forEach((offer) => { if (offer.status === "pending") offer.status = "expired"; });
    refreshInformation(game);
    replanNPCMarket(game);
    game.log.unshift(`Day ${game.day}. New positions form before the noon market.`);
    return game;
  }
  return game;
}

function hiddenItemScore(item, targetId) {
  const outsideDemand = Object.entries(NPC_PROFILES).reduce((sum, [buyerId, profile]) => {
    if (buyerId === targetId) return sum;
    return sum + (profileWantsItem(profile, item) ? 10 : 0);
  }, 0);
  return outsideDemand + valueOf(item);
}

function revealHolding(game, targetId) {
  const target = game.traders[targetId];
  const alreadyKnown = knownItemsForTrader(game, targetId);
  const hidden = target.inventory
    .filter((item) => !alreadyKnown.includes(item))
    .sort((a, b) => hiddenItemScore(b, targetId) - hiddenItemScore(a, targetId));
  const item = hidden[0];
  if (!item) return null;
  return addInformation(game, {
    claimType: "holding",
    subjectId: targetId,
    item,
    text: `${target.name} has ${labelShort(item)}.`,
    source: "personal investigation",
    precision: "exact",
    confidence: "high",
    exclusive: true,
    sellable: true,
  });
}

function revealInvestigationStage(game, targetId) {
  const stages = NPC_PROFILES[targetId]?.investigationStages || [];
  const index = game.investigationCounts[targetId] || 0;
  const stage = stages[index];
  if (!stage) return null;
  game.investigationCounts[targetId] = index + 1;
  return addInformation(game, {
    claimType: stage.claimType || "observation",
    subjectId: targetId,
    item: stage.item || null,
    claimId: stage.claimId || null,
    text: stage.text,
    source: "personal investigation",
    precision: stage.precision || "context",
    confidence: stage.confidence || "medium",
    exclusive: stage.exclusive ?? false,
    sellable: stage.sellable ?? false,
  });
}

function talkTo(game, targetId) {
  const target = game.traders[targetId];
  const profile = NPC_PROFILES[targetId];
  const count = game.talkCounts[targetId] || 0;
  const stages = profile?.talkStages || [];
  const hasNewStage = count < stages.length;
  const stage = stages[Math.min(count, Math.max(0, stages.length - 1))] || { text: `${target.name} spends a little time with you.` };
  game.talkCounts[targetId] = count + 1;
  const gainKey = `${game.day}:${targetId}`;
  const relationshipGain = hasNewStage && !game.talkGainDays[gainKey] ? 1 : 0;
  game.relationships[targetId] = (game.relationships[targetId] || 0) + relationshipGain;
  if (relationshipGain) game.talkGainDays[gainKey] = true;

  let note = null;
  if (stage.info) {
    note = addInformation(game, {
      ...stage.info,
      subjectId: stage.info.subjectId || targetId,
      source: "conversation",
      sellable: stage.info.sellable ?? false,
    });
  }

  const relationship = game.relationships[targetId];
  if (relationship >= 2 && !game.intel[`${targetId}:style`]) {
    game.intel[`${targetId}:style`] = profile.style;
    addInformation(game, {
      claimType: "style",
      subjectId: targetId,
      text: `After dealing with ${target.name} more than once, their market style is becoming legible: ${profile.style.toLowerCase()}.`,
      source: "relationship",
      precision: "context",
      confidence: "medium",
      sellable: false,
    });
  }

  game.lastInteraction = {
    action: "talk",
    targetId,
    text: stage.text,
    note: note?.text || null,
    relationship,
    relationshipGain,
    informationId: note?.id || null,
  };
  game.log.unshift(`Conversation with ${target.name}: ${stage.text}`);
}

function investigate(game, targetId) {
  const target = game.traders[targetId];
  let info = revealInvestigationStage(game, targetId);
  if (!info) {
    game.investigationCounts[targetId] = (game.investigationCounts[targetId] || 0) + 1;
    info = revealHolding(game, targetId);
  }
  if (!info) {
    const clue = NPC_PROFILES[targetId].clue;
    game.intel[`${targetId}:clue`] = clue;
    info = addInformation(game, {
      claimType: "pressure",
      subjectId: targetId,
      text: clue,
      source: "personal investigation",
      precision: "context",
      confidence: "medium",
      sellable: false,
    });
  }
  if (info.claimId) {
    const claim = game.claims.find((entry) => entry.id === info.claimId);
    if (claim && !claim.knownByPlayer) {
      claim.knownByPlayer = true;
      const evidence = recordEvidence(game, "claim-discovered", { claimId: claim.id, debtorId: claim.debtorId, holderId: claim.currentHolderId, faceAmount: claim.faceAmount, dueDay: claim.dueDay });
      claim.evidenceIds.push(evidence.id);
    }
  }

  game.lastInteraction = {
    action: "investigate",
    targetId,
    text: info.text,
    note: `${info.precision} precision · ${info.confidence} confidence`,
    informationId: info.id,
  };
  game.log.unshift(`Investigation of ${target.name}: ${info.text}`);
}

export function performFreeAction(current, action, targetId) {
  const game = clone(current);
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || game.ended) return game;
  const target = game.traders[targetId];
  if (!target || targetId === "player") return game;
  if (targetId === "aspen" && game.flags.sailorDeparted) {
    game.lastInteraction = { action, targetId, text: "The ship has left. There is nobody at the berth to answer or trade." };
    return game;
  }

  const actionsBefore = game.actionsRemaining;
  const openingCash = game.traders.player.sardines;
  const relationshipBefore = game.relationships[targetId] || 0;
  if (action === "talk") talkTo(game, targetId);
  else if (action === "investigate") investigate(game, targetId);
  else return game;

  game.actionsRemaining -= 1;
  const observed = game.information.find((info) => info.id === game.lastInteraction?.informationId);
  recordEvidence(game, action, {
    targetId,
    informationId: observed?.id || null,
    claimType: observed?.claimType || null,
    item: observed?.item || null,
    source: observed?.source || null,
    precision: observed?.precision || null,
    confidence: observed?.confidence || null,
    freshness: observed?.freshness || null,
    actionsBefore,
    actionsAfter: game.actionsRemaining,
    openingCash,
    relationshipBefore,
    relationshipAfter: game.relationships[targetId],
    knownInfoIds: game.information.filter((info) => info.subjectId === targetId).map((info) => info.id),
  });
  return game;
}

export function buildEvents(game) {
  if (game.ended) return [];
  const player = game.traders.player;
  const events = [];
  const soupFish = ["Fresh Mackerel", "Salted Cod", "Smoked Eel", "Sea Urchin Basket"];
  const alreadyHasFlower = player.inventory.includes("Sunflower") || game.flags.sunflowerAcquired;
  const auctionReserve = game.flags.cheated ? 68 : 52;

  if (
    !alreadyHasFlower && canAccessVenue(game, "bar") && !game.flags.cheated &&
    game.worldThreads.barRecipe.stage === "aftermath" && player.inventory.includes("Mai Tai") &&
    player.inventory.some((item) => soupFish.includes(item)) && (game.relationships.sterling || 0) >= 2
  ) {
    events.push({
      id: "grandma",
      title: "After closing",
      text: "Sterling asks if you want to bring the fish and Mai Tai downstairs after the bar closes. This feels like an invitation, not a transaction.",
      actions: ["Go", "Not tonight"],
    });
  }

  if (
    !alreadyHasFlower && canAccessVenue(game, "valeGallery") && game.worldThreads.valeScreening.stage === "aftermath" &&
    player.inventory.includes("Blue Glass Marble") && netWorth(player) >= (game.flags.cheated ? 90 : 70) &&
    player.sardines >= auctionReserve
  ) {
    events.push({
      id: "auction",
      title: "A private auction invitation",
      text: "Yasmin sends a card. One of the lots is a living sunflower.",
      actions: ["Attend", "Ignore"],
    });
  }

  if (
    !alreadyHasFlower && !game.flags.raced &&
    player.inventory.includes("Built Onewheel") &&
    player.inventory.includes("Mai Tai") && (game.relationships.juan || 0) >= 1
  ) {
    events.push({
      id: "cliff",
      title: "The cliff wager",
      text: "Juan proposes one race at sunset. By now you have enough reason to suspect the cliff matters to him for more than the wager.",
      actions: ["Race", "Decline"],
    });
  }

  return events;
}

function removePendingEvent(game, id) {
  game.pendingEvents = game.pendingEvents.filter((event) => event.id !== id);
}

function acquireSunflower(game, sourceText) {
  const player = game.traders.player;
  if (!player.inventory.includes("Sunflower")) player.inventory.push("Sunflower");
  game.flags.sunflowerAcquired = true;
  recordEvidence(game, "sunflower-acquired", { source: sourceText });
  game.objective = "Go home";
  game.pendingEvents = [];
  game.log.unshift("Objective updated: Go home.");
  game.log.unshift("Nothing happens.");
  game.log.unshift(sourceText);
}

export function resolveEvent(current, id, action, bidAmount = null) {
  const game = clone(current);
  const player = game.traders.player;
  if (!game.pendingEvents.some((event) => event.id === id)) return game;

  if (id === "grandma" && action === "Go") {
    const meal = ["Fresh Mackerel", "Salted Cod", "Smoked Eel", "Sea Urchin Basket"].find((item) => player.inventory.includes(item));
    takePerishableAge(game, player, "Mai Tai");
    takePerishableAge(game, player, meal);
    player.inventory = removeOne(removeOne(player.inventory, "Mai Tai"), meal);
    recordEvidence(game, "special-situation", { route: "grandma", choice: "Go", stake: ["Mai Tai", meal], channel: "private", outcome: "sunflower" });
    acquireSunflower(game, "After closing, a meal ends with a sunflower changing hands without a market price.");
    return game;
  }
  if (id === "auction" && action === "Attend") {
    const reserve = game.flags.cheated ? 68 : 52;
    const amount = Number(bidAmount);
    if (!Number.isFinite(amount) || amount < reserve || amount > player.sardines) {
      recordEvidence(game, "special-situation", { route: "auction", choice: "Attend", bid: amount, reserve, openingCash: player.sardines, channel: "private", outcome: "no-fill" });
      game.log.unshift(`Yasmin's published reserve was ${reserve}🥫. Your bid did not clear.`);
      removePendingEvent(game, id);
      return game;
    }
    player.sardines -= amount;
    recordEvidence(game, "special-situation", { route: "auction", choice: "Attend", bid: amount, reserve, openingCash: player.sardines + amount, channel: "private", outcome: "sunflower" });
    acquireSunflower(game, `Yasmin settles the sunflower lot at ${amount}🥫.`);
    return game;
  }
  if (id === "cliff" && action === "Race") {
    game.flags.raced = true;
    const preRaceWorth = netWorth(player);
    takePerishableAge(game, player, "Mai Tai");
    takePerishableAge(game, player, "Built Onewheel");
    player.inventory = removeOne(removeOne(player.inventory, "Mai Tai"), "Built Onewheel");
    if (preRaceWorth >= 60) {
      recordEvidence(game, "special-situation", { route: "cliff", choice: "Race", preRaceWorth, stake: ["Mai Tai", "Built Onewheel"], channel: "private", outcome: "sunflower" });
      acquireSunflower(game, "You cross the cliff route with Juan. What you find is, unmistakably, a sunflower.");
    } else {
      recordEvidence(game, "special-situation", { route: "cliff", choice: "Race", preRaceWorth, stake: ["Mai Tai", "Built Onewheel"], channel: "private", outcome: "lost" });
      game.log.unshift("The cliff wager fails. You had enough to enter the special situation, not enough margin for the current crude prototype odds model.");
      removePendingEvent(game, id);
    }
    return game;
  }

  recordEvidence(game, "special-situation", { route: id, choice: action, channel: "private", outcome: "declined" });
  removePendingEvent(game, id);
  return game;
}
