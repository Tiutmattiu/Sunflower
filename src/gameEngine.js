import {
  AFTERNOON_ACTIONS,
  INFO_BASE_PRICE,
  INITIAL_TRADERS,
  ITEMS,
  MAX_DAYS,
  MORNING_ACTIONS,
  NPC_PROFILES,
  PLAYER_CONTEXT,
  PRODUCTION_RECIPES,
  PROXY_FEE,
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
    systemMarkers: {},
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
  if (traderId === "mechanic" && game.flags.sailorDeparted) return [];

  const known = [];
  (NPC_PROFILES[traderId]?.publicStock || []).forEach((item) => {
    if (trader.inventory.includes(item)) known.push(item);
  });
  if (traderId === "bar" && trader.inventory.includes("Mai Tai")) known.push("Mai Tai");
  if (traderId === "mechanic" && trader.inventory.includes("Built Onewheel")) known.push("Built Onewheel");

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
      if (buyerId === "mechanic" && game.flags.sailorDeparted) return false;
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
    if (plan.from === "bar" && plan.wantItem === "Orgeat Bottle" && game.worldThreads.barRecipe.stage === "signal") game.worldThreads.barRecipe.stage = "contest";
    if (plan.from === "vale" && plan.wantItem === "Sperm Whale Oil" && game.worldThreads.valeScreening.stage === "signal") game.worldThreads.valeScreening.stage = "contest";
    if (plan.from === "mechanic" && PRODUCTION_RECIPES.onewheel.inputs.includes(plan.wantItem) && game.worldThreads.onewheel.stage === "signal") game.worldThreads.onewheel.stage = "contest";
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
  const sailor = game.traders.mechanic;
  const knowsNeed = game.information.some((info) => info.subjectId === "mechanic" && info.item === "Lime Crate" && info.claimType === "need" && info.precision === "exact");
  const knowsSource = game.information.some((info) => info.subjectId !== "mechanic" && info.item === "Lime Crate" && info.claimType === "holding");
  return ["morning", "afternoon"].includes(game.phase) && game.actionsRemaining > 0 && !game.flags.sailorDeparted &&
    !sailor.inventory.includes("Lime Crate") && !game.traders.player.inventory.includes("Lime Crate") &&
    !activeObligation(game, "future-delivery", "mechanic") && knowsNeed && knowsSource &&
    game.day <= NPC_PROFILES.mechanic.departureDay - 2 && sailor.sardines - 13 >= 6;
}

export function acceptFutureDelivery(current) {
  const game = clone(current);
  if (!futureDeliveryAvailable(game)) return game;
  const player = game.traders.player;
  const sailor = game.traders.mechanic;
  const actionsBefore = game.actionsRemaining;
  const openingCash = game.traders.player.sardines;
  sailor.sardines -= 13;
  player.sardines += 4;
  game.actionsRemaining -= 1;
  const evidence = recordEvidence(game, "future-delivery-bound", { counterpartyId: "mechanic", item: "Lime Crate", deposit: 4, reservedBalance: 9, dueDay: Math.min(game.day + 2, NPC_PROFILES.mechanic.departureDay - 1), ownedAtCommitment: false, openingCash, actionsBefore, actionsAfter: game.actionsRemaining });
  createObligation(game, {
    kind: "future-delivery", creditorId: "mechanic", amount: 0, item: "Lime Crate", deposit: 4, reservedBalance: 9,
    dueDay: evidence.dueDay, ownedAtCommitment: false, commitmentEvidenceId: evidence.id, note: "A promise for lime.",
  });
  addLearningNote(game, "future-delivery", "Future delivery / sourcing risk", "A delivery promise can be bound before the seller owns the underlying good.", {
    evidenceIds: [evidence.id], whatHappened: `The Sailor paid 4🥫 now and reserved 9🥫 for one Lime Crate due on Day ${evidence.dueDay}.`,
  });
  game.lastInteraction = { action: "future-delivery", targetId: "mechanic", text: `The Sailor pays 4🥫 now and reserves 9🥫 for one Lime Crate due Day ${evidence.dueDay}.` };
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
  addPerishableAge(game, game.traders.mechanic, obligation.item, age);
  game.traders.mechanic.inventory.push(obligation.item);
  game.traders.player.sardines += obligation.reservedBalance;
  obligation.status = "settled";
  obligation.settledDay = game.day;
  game.relationships.mechanic += 1;
  if (game.phase !== "sunset") game.actionsRemaining -= 1;
  const evidence = recordEvidence(game, "future-delivery-fulfilled", { obligationId, item: obligation.item, balance: obligation.reservedBalance, onTime: game.day <= obligation.dueDay, openingCash, actionsBefore, actionsAfter: game.actionsRemaining });
  if (!obligation.ownedAtCommitment && game.day <= obligation.dueDay) createBadge(game, { id: "sold-before-owned", title: "SOLD IT BEFORE YOU HAD IT", summary: "Promised Lime, sourced it later, and delivered on time.", evidenceIds: [obligation.commitmentEvidenceId, evidence.id] });
  game.lastInteraction = { action: "future-delivery-fulfilled", targetId: "mechanic", text: `You deliver the exact Lime Crate. The reserved ${obligation.reservedBalance}🥫 is released.` };
  return game;
}

export function requestRelationshipLoan(current) {
  const game = clone(current);
  const relationship = game.relationships.bar || 0;
  const amount = relationship >= 3 ? 6 : 4;
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || relationship < 2 || activeObligation(game, "relationship-loan", "bar") || game.traders.bar.sardines - amount < 18) return game;
  const openingCash = game.traders.player.sardines;
  const actionsBefore = game.actionsRemaining;
  const nearTermObligations = currentObligations(game).filter((entry) => entry.dueDay <= game.day + 2).map((entry) => entry.id);
  game.traders.bar.sardines -= amount;
  game.traders.player.sardines += amount;
  game.actionsRemaining -= 1;
  const evidence = recordEvidence(game, "relationship-loan-opened", { counterpartyId: "bar", amount, dueDay: game.day + 2, openingCash, nearTermObligations, actionsBefore, actionsAfter: game.actionsRemaining });
  const obligation = createObligation(game, { kind: "relationship-loan", creditorId: "bar", amount, dueDay: game.day + 2, openingEvidenceId: evidence.id, note: "A few tins for a few days." });
  teachCredit(game, obligation, evidence, `The Apprentice advanced ${amount}🥫 without interest, due Day ${obligation.dueDay}.`);
  game.stats.creditUsed += 1;
  game.lastInteraction = { action: "relationship-loan", targetId: "bar", text: `The Apprentice lends you ${amount}🥫 until Day ${obligation.dueDay}.` };
  return game;
}

export function securedCollateralItems(game) {
  return unique(game.traders.player.inventory).filter((item) => {
    const type = ITEMS[item]?.type || "";
    return Number(ITEMS[item]?.value || 0) > 0 && !ITEMS[item]?.shelfLife && (type.includes("Collateral") || type.includes("Durable")) &&
      !["Sunflower", "Blue Glass Marble", "Built Onewheel", "Mai Tai"].includes(item);
  });
}

export function requestSecuredLoan(current, item) {
  const game = clone(current);
  const reference = valueOf(item);
  const principal = Math.max(1, Math.floor(reference * .6));
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || game.playerState.legalIdentity.status !== "recognized" ||
    (game.relationships.vale || 0) < 1 || activeObligation(game, "secured-loan", "vale") || !securedCollateralItems(game).includes(item) || game.traders.vale.sardines - principal < 16) return game;
  const actionsBefore = game.actionsRemaining;
  const openingCash = game.traders.player.sardines;
  const collateralAge = takePerishableAge(game, game.traders.player, item);
  game.traders.player.inventory = removeOne(game.traders.player.inventory, item);
  game.traders.vale.sardines -= principal;
  game.traders.player.sardines += principal;
  game.actionsRemaining -= 1;
  const evidence = recordEvidence(game, "secured-loan-opened", { counterpartyId: "vale", item, referenceValue: reference, principal, repayment: principal + 1, haircut: reference - principal, openingCash, actionsBefore, actionsAfter: game.actionsRemaining });
  const obligation = createObligation(game, { kind: "secured-loan", creditorId: "vale", amount: principal + 1, principal, collateral: item, collateralAge, dueDay: game.day + 2, openingEvidenceId: evidence.id, note: `Against the ${item}.` });
  addLearningNote(game, "collateral-haircut", "Collateral haircut", "A lender advances less than an asset's reference value because liquidation and price risk remain.", {
    evidenceIds: [evidence.id], whatHappened: `Vale held your ${item} and advanced ${principal}🥫 against its ${reference}🥫 reference value.`,
  });
  game.lastInteraction = { action: "secured-loan", targetId: "vale", text: `Vale takes the ${item} into custody and advances ${principal}🥫. Repayment is ${principal + 1}🥫 on Day ${obligation.dueDay}.` };
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
  if (!buyer || buyer.inventory.includes(item) || (buyerId === "mechanic" && game.flags.sailorDeparted)) return null;
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

export function requestMarketProxy(current, targetId = "bar") {
  const game = clone(current);
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || game.ended) return game;
  if (game.playerState.form !== "animal" || canAccessVenue(game, "formalMarket")) return game;

  const target = game.traders[targetId];
  const relationship = game.relationships[targetId] || 0;
  if (!target || target.form !== "human" || targetId !== "bar" || relationship < 2) return game;

  const player = game.traders.player;
  const usedCredit = player.sardines < PROXY_FEE;
  if (player.sardines >= PROXY_FEE) {
    player.sardines -= PROXY_FEE;
    target.sardines += PROXY_FEE;
    game.lastInteraction = { action: "proxy", targetId, text: `${target.name} agrees to settle today's formal-market orders for ${PROXY_FEE}🥫.` };
  } else if (relationship >= 3) {
    const obligation = createObligation(game, {
      kind: "proxy-fee",
      creditorId: targetId,
      amount: PROXY_FEE,
      dueDay: game.day + 2,
      note: "Formal-market proxy fee.",
    });
    teachCredit(game, obligation, game.decisionEvidence.at(-1), `${target.name} advanced a ${PROXY_FEE}🥫 proxy fee, due Day ${obligation.dueDay}.`);
    game.stats.creditUsed += 1;
    game.lastInteraction = { action: "proxy", targetId, text: `${target.name} agrees to proxy today's market on credit.` };
  } else {
    game.lastInteraction = { action: "proxy", targetId, text: `${target.name} will proxy, but not on credit yet.` };
    return game;
  }

  game.playerState.proxyAccess.push({ venueId: "formalMarket", via: targetId, expiresDay: game.day });
  game.stats.proxyUses += 1;
  game.actionsRemaining -= 1;
  recordEvidence(game, "proxy-access", { via: targetId, fee: PROXY_FEE, onCredit: usedCredit });
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
    game.log.unshift("The Apprentice has the complete recipe and makes a proper Mai Tai for the Bar's stock.");
  } else {
    game.worldThreads.onewheel.stage = "aftermath";
    game.log.unshift("The Sailor consumes the four bicycle parts and uses the torque wrench to assemble a working onewheel.");
  }
  return true;
}

function applyWorldReceivedItem(game, receiverId, item) {
  if (!item || !game.traders[receiverId]) return;
  if (receiverId === "bar" && item === "Orgeat Bottle") game.worldThreads.barRecipe.stage = "outcome";
  if (receiverId === "vale" && item === "Sperm Whale Oil") game.worldThreads.valeScreening.stage = "outcome";
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

  const isCheat = trade.from === "player" && trade.to === "mechanic" && trade.offerItem === "Bad Tangerine" && trade.claim !== "truthful" && !trade.inspectionAllowed;
  if (isCheat) {
    game.flags.cheated = true;
    game.stats.cheats += 1;
    game.relationships.mechanic = Math.min(game.relationships.mechanic, -2);
    game.log.unshift("A Bad Tangerine passed as citrus. The Sailor will remember this.");
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
  return currentObligations(game).filter((entry) => ["future-delivery", "secured-loan"].includes(entry.kind) && entry.dueDay <= game.day);
}

export function resolveDuePrivateMatter(current, obligationId, action) {
  const obligation = duePrivateMatters(current).find((entry) => entry.id === obligationId);
  if (!obligation || current.phase !== "sunset") return clone(current);
  if (obligation.kind === "future-delivery" && action === "deliver") return fulfillFutureDelivery(current, obligationId);
  if (obligation.kind === "secured-loan" && action === "repay") {
    return repayObligation(current, obligationId);
  }

  const game = clone(current);
  const live = game.obligations.find((entry) => entry.id === obligationId);
  if (live.kind === "future-delivery" && action === "default") {
    game.traders.mechanic.sardines += live.reservedBalance;
    live.status = "defaulted";
    live.settledDay = game.day;
    game.relationships.mechanic -= 2;
    game.stats.defaults += 1;
    const evidence = recordEvidence(game, "future-delivery-defaulted", { obligationId, item: live.item, reservedReturned: live.reservedBalance, openingCash: game.traders.player.sardines });
    const restitution = createObligation(game, { kind: "restitution", creditorId: "mechanic", amount: 5, dueDay: game.day + 2, note: "Restitution after the missed Lime promise." });
    teachCredit(game, restitution, evidence, `The reserved ${live.reservedBalance}🥫 returned to the Sailor and you now owe 5🥫 restitution.`);
    game.lastInteraction = { action: "future-delivery-defaulted", targetId: "mechanic", text: "You do not deliver. The reserved balance returns to the Sailor; 5🥫 restitution is now due." };
  } else if (live.kind === "secured-loan" && action === "seize") {
    game.traders.vale.inventory.push(live.collateral);
    addPerishableAge(game, game.traders.vale, live.collateral, live.collateralAge);
    live.status = "seized";
    live.settledDay = game.day;
    recordEvidence(game, "secured-collateral-seized", { obligationId, collateral: live.collateral, residualDebt: 0 });
    game.lastInteraction = { action: "secured-collateral-seized", targetId: "vale", text: `Vale keeps the ${live.collateral}. The claim is closed with no residual debt.` };
  }
  return game;
}

function publicPostedAsk(game, sellerId, item) {
  const produced = (sellerId === "bar" && item === "Mai Tai") || (sellerId === "mechanic" && item === "Built Onewheel");
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

    const isCheat = trade.to === "mechanic" && trade.offerItem === "Bad Tangerine" && trade.claim !== "truthful";
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
      const bidders = unique(candidates.filter((candidate) => candidate.paymentValue === value).map(({ trade }) => trade.from)).sort();
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

  game.marketOutcome = [];
  game.rejected = [];
  clearCommittedOrders(game);
  recordMarketOutcomes(game);
  applyExperienceFirstLearning(game);
  markInboundSettlement(game);
  updateHeatFromHistory(game);
  settleInformationCovenants(game);
  game.marketResolved = true;
  game.playerOrders = resetOrders();
  game.log.unshift(`Day ${game.day} noon market settled: ${game.marketOutcome.length} trade(s).`);
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

function settleValeScreening(game) {
  if (game.worldThreads.valeScreening.stage === "aftermath" || !game.traders.vale.inventory.includes("Sperm Whale Oil")) return;
  game.traders.vale.inventory = removeOne(game.traders.vale.inventory, "Sperm Whale Oil");
  game.worldThreads.valeScreening.stage = "aftermath";
  recordEvidence(game, "world-consequence", { thread: "valeScreening", consequence: "consumption", actorId: "vale", item: "Sperm Whale Oil" });
  game.log.unshift("Vale burns the whale oil in obsolete projection equipment and completes the private screening.");
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

function consumeConfiguredInputs(game) {
  Object.entries(NPC_PROFILES).forEach(([traderId, profile]) => {
    const business = profile.business;
    const trader = game.traders[traderId];
    if (!business || !trader) return;

    if (traderId === "bar") {
      const hadIce = trader.inventory.includes("Ice Block");
      const revenue = hadIce ? business.serviceRevenueWithIce : business.serviceRevenueBase;
      if (Number(revenue) > 0) {
        trader.sardines += Number(revenue);
        recordEvidence(game, "world-consequence", { consequence: "outside-revenue", actorId: traderId, amount: Number(revenue), inputUsed: hadIce ? "Ice Block" : null });
        game.log.unshift(`The Bar closes service with ${revenue}🥫 of outside-customer revenue${hadIce ? " after a full cold-drink service" : " despite running short of ice"}.`);
      }
    }

    if (business.consumeAny?.length) {
      const item = business.consumeAny.find((candidate) => trader.inventory.includes(candidate));
      if (item) {
        takePerishableAge(game, trader, item);
        trader.inventory = removeOne(trader.inventory, item);
        recordEvidence(game, "world-consequence", { consequence: "business-consumption", actorId: traderId, item });
        game.log.unshift(`${trader.name}'s ${labelShort(item)} ${business.consumeText || "is used up by sunset"}.`);
      }
    }

    (business.consume || []).forEach((item) => {
      if (!trader.inventory.includes(item)) return;
      takePerishableAge(game, trader, item);
      trader.inventory = removeOne(trader.inventory, item);
      recordEvidence(game, "world-consequence", { consequence: "business-consumption", actorId: traderId, item });
      game.log.unshift(`${trader.name} uses ${labelShort(item)} during today's business.`);
    });

    if (business.outsideSaleAny?.length && game.day % Number(business.outsideSaleInterval || 1) === 0) {
      const item = business.outsideSaleAny.find((candidate) => trader.inventory.includes(candidate));
      if (item) {
        const proceeds = Math.max(1, Math.round(valueOf(item) * Number(business.outsideSaleRate || 0.75)));
        takePerishableAge(game, trader, item);
        trader.inventory = removeOne(trader.inventory, item);
        trader.sardines += proceeds;
        recordEvidence(game, "world-consequence", { consequence: "outside-sale", actorId: traderId, item, proceeds });
        game.log.unshift(`${trader.name} sells ${labelShort(item)} to ${business.outsideBuyer || "ordinary outside customers"} for ${proceeds}🥫 after the public market closes.`);
      }
    }
  });
}

function settleBusinessArrivals(game) {
  Object.entries(NPC_PROFILES).forEach(([traderId, profile]) => {
    const business = profile.business;
    const trader = game.traders[traderId];
    if (!business?.arrivals?.length || !trader) return;
    if (business.stopsAtDeparture && game.day >= (profile.departureDay || Infinity)) return;

    const item = business.arrivals[(game.day - 1) % business.arrivals.length];
    if (trader.inventory.includes(item)) return;

    const rate = Number(business.arrivalCostRate || 0);
    const cost = rate > 0 ? Math.max(1, Math.round(valueOf(item) * rate)) : 0;
    if (trader.sardines < cost) {
      recordEvidence(game, "world-consequence", { consequence: "arrival-unfunded", actorId: traderId, item, cost, cash: trader.sardines });
      game.log.unshift(`${trader.name} cannot fund the next ${labelShort(item)} arrival tonight.`);
      return;
    }
    trader.sardines -= cost;
    trader.inventory.push(item);
    recordEvidence(game, "world-consequence", { consequence: "business-arrival", actorId: traderId, item, cost });
    const verb = traderId === "dog" ? "scavenges" : traderId === "fishmonger" ? "sources" : "unloads";
    game.log.unshift(`${trader.name} ${verb} ${labelShort(item)} for tomorrow${cost ? ` at a ${cost}🥫 sourcing cost` : ""}.`);
  });

  if (game.day === NPC_PROFILES.mechanic.departureDay) {
    game.flags.sailorDeparted = true;
    game.log.unshift("The Sailor's departure window has arrived. Local cargo will stop refreshing after today.");
  }
}

function settleBusinesses(game) {
  consumeConfiguredInputs(game);
  settleValeScreening(game);
  settleInformationResale(game);
  settleBusinessArrivals(game);
}

function applyBarToolRevenue(game, settledDay) {
  if (game.systemMarkers.barToolBonusDay === settledDay) return;
  const tools = PRODUCTION_RECIPES.maiTai.productivityTools.filter((item) => game.traders.bar.inventory.includes(item)).length;
  if (!tools) return;
  game.traders.bar.sardines += tools;
  game.systemMarkers.barToolBonusDay = settledDay;
  game.log.unshift(`The Bar's upgraded professional tools add ${tools}🥫 of service value tonight.`);
}

function chooseMealCreditSource(game) {
  return ["bar", "dog"]
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
    note: "Former legal identity. The current animal form cannot directly claim this estate.",
  });
  game.obligations.forEach((obligation) => {
    if (obligation.debtorLifeId !== oldLifeId || !["open", "overdue"].includes(obligation.status)) return;
    if (obligation.kind === "secured-loan") {
      game.traders.vale.inventory.push(obligation.collateral);
      addPerishableAge(game, game.traders.vale, obligation.collateral, obligation.collateralAge);
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
    game.phase = "noon";
    game.actionsRemaining = 0;
    game.lastInteraction = null;
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
    return game;
  }
  if (game.phase === "sunset") {
    if (duePrivateMatters(game).length) return game;
    settleSustenance(game);
    markOverdueObligations(game);
    applyPerishables(game);
    settleBusinesses(game);
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
  if (targetId === "mechanic" && game.flags.sailorDeparted) {
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
  const soupFish = ["Fresh Mackerel", "Salted Cod", "Smoked Eel", "Two Octopus Tentacles"];
  const alreadyHasFlower = player.inventory.includes("Sunflower") || game.flags.sunflowerAcquired;
  const auctionReserve = game.flags.cheated ? 68 : 52;

  if (
    !alreadyHasFlower && canAccessVenue(game, "bar") && !game.flags.cheated &&
    game.worldThreads.barRecipe.stage === "aftermath" && player.inventory.includes("Mai Tai") &&
    player.inventory.some((item) => soupFish.includes(item)) && (game.relationships.bar || 0) >= 2
  ) {
    events.push({
      id: "grandma",
      title: "After closing",
      text: "The Apprentice asks if you want to bring the fish and Mai Tai downstairs after the bar closes. This feels like an invitation, not a transaction.",
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
      text: "Vale sends a card. One of the lots is a living sunflower.",
      actions: ["Attend", "Ignore"],
    });
  }

  if (
    !alreadyHasFlower && !game.flags.raced &&
    player.inventory.includes("Built Onewheel") &&
    player.inventory.includes("Mai Tai") && (game.relationships.clown || 0) >= 1
  ) {
    events.push({
      id: "cliff",
      title: "The cliff wager",
      text: "Clown proposes one race at sunset. By now you have enough reason to suspect the cliff matters to him for more than the wager.",
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
    const meal = ["Fresh Mackerel", "Salted Cod", "Smoked Eel", "Two Octopus Tentacles"].find((item) => player.inventory.includes(item));
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
      game.log.unshift(`Vale's published reserve was ${reserve}🥫. Your bid did not clear.`);
      removePendingEvent(game, id);
      return game;
    }
    player.sardines -= amount;
    recordEvidence(game, "special-situation", { route: "auction", choice: "Attend", bid: amount, reserve, openingCash: player.sardines + amount, channel: "private", outcome: "sunflower" });
    acquireSunflower(game, `Vale settles the sunflower lot at ${amount}🥫.`);
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
      acquireSunflower(game, "You cross the cliff route with Clown. What you find is, unmistakably, a sunflower.");
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
