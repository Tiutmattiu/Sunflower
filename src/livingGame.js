import * as base from "./gameEngine.js";
import { INFO_BASE_PRICE, INITIAL_TRADERS, ITEMS, NPC_PROFILES } from "./gameData.js";
import { buyerMax, planNPCMarket, privateUtility, sellerAsk } from "./npcAI.js";

export * from "./gameEngine.js";

const clone = (value) => JSON.parse(JSON.stringify(value));
const PLAYER_VISIBLE_AT_START = ["Fish Bones"];
const ADVANCED_BAR_TOOLS = ["Hawthorne Strainer", "30/45 Jigger", "Fine Mesh Strainer"];
const ONEWHEEL_CONSUMED_PARTS = ["Steel Rim", "Chain Quick-Link", "Brake Cable", "Handlebar Tape"];
const ONEWHEEL_TOOL = "Tiny Torque Wrench";

function removeOne(inventory, item) {
  const index = inventory.indexOf(item);
  if (index < 0) return [...inventory];
  return [...inventory.slice(0, index), ...inventory.slice(index + 1)];
}

function ensureState(game) {
  if (!Array.isArray(game.inboundOffers)) game.inboundOffers = [];
  if (!Array.isArray(game.learningNotes)) game.learningNotes = [];
  if (!Array.isArray(game.giftHistory)) game.giftHistory = [];
  if (!game.systemMarkers || typeof game.systemMarkers !== "object") game.systemMarkers = {};
  if (!game.stats) game.stats = {};
  if (!Number.isFinite(game.stats.gifts)) game.stats.gifts = 0;
  if (!Number.isFinite(game.stats.informationFavours)) game.stats.informationFavours = 0;
  if (!Number.isFinite(game.stats.inboundTrades)) game.stats.inboundTrades = 0;
  (game.information || []).forEach((info) => {
    if (!Array.isArray(info.soldTo)) info.soldTo = [];
    if (!Array.isArray(info.knownBy)) info.knownBy = ["player", ...info.soldTo];
    if (!Number.isFinite(info.diffusionCount)) info.diffusionCount = Math.max(0, info.knownBy.length - 1);
    if (info.personallyVerified == null) info.personallyVerified = info.source === "personal investigation";
    if (!Array.isArray(info.sharedWith)) info.sharedWith = [];
  });
  return game;
}

function latestPublicOwners(game) {
  const owners = {};
  (game.history || []).forEach((trade) => {
    owners[trade.item] = trade.from;
    if (trade.paymentItem) owners[trade.paymentItem] = trade.to;
  });
  return owners;
}

export function publiclyKnownPlayerItems(game) {
  const current = game.traders?.player?.inventory || [];
  const known = new Set(PLAYER_VISIBLE_AT_START.filter((item) => current.includes(item)));
  Object.entries(latestPublicOwners(game)).forEach(([item, ownerId]) => {
    if (ownerId === "player" && current.includes(item)) known.add(item);
  });
  return [...known];
}

function precisionBonus(precision) {
  return ({ context: 0, category: 0, specific: 1, exact: 2 })[precision] ?? 0;
}

function confidenceBonus(confidence) {
  return ({ low: -1, medium: 0, high: 1 })[confidence] ?? 0;
}

export function informationPrice(game, info, buyerId = null) {
  if (!info || info.freshness === "stale") return 0;
  const knownBy = new Set(info.knownBy || ["player", ...(info.soldTo || [])]);
  const spreadPenalty = Math.min(2, Math.max(0, knownBy.size - 1));
  const freshnessPenalty = info.freshness === "aging" ? 1 : 0;
  const exclusiveBonus = knownBy.size === 1 && info.exclusive ? 1 : 0;
  const buyerPremium = buyerId && (NPC_PROFILES[buyerId]?.goals || []).some((goal) => goal.item === info.item) ? 1 : 0;
  return Math.max(1, INFO_BASE_PRICE + precisionBonus(info.precision) + confidenceBonus(info.confidence) + exclusiveBonus + buyerPremium - spreadPenalty - freshnessPenalty);
}

function currentInfoBuyers(game, info) {
  return base.informationBuyers(game, info).filter((buyerId) => !(info.knownBy || []).includes(buyerId));
}

function exactGoalUtility(buyerId, item) {
  return Number((NPC_PROFILES[buyerId]?.goals || []).find((goal) => goal.item === item)?.utility || 0);
}

function interestUtility(buyerId, item) {
  const type = ITEMS[item]?.type || "";
  return (NPC_PROFILES[buyerId]?.interests || []).reduce((best, interest) => {
    if (!interest?.typeIncludes || !type.includes(interest.typeIncludes)) return best;
    return Math.max(best, Number(interest.utility || 0));
  }, 0);
}

function inboundItemOffer(game, buyerId, item) {
  const buyer = game.traders[buyerId];
  if (!buyer || buyer.inventory.includes(item)) return null;
  const goalUtility = exactGoalUtility(buyerId, item);
  const tasteUtility = interestUtility(buyerId, item);
  const utility = Math.max(goalUtility, tasteUtility);
  if (utility <= 0) return null;

  const openingCash = Number(INITIAL_TRADERS[buyerId]?.sardines || buyer.sardines || 0);
  const reserve = Math.ceil(openingCash * (goalUtility > 0 ? 0.18 : 0.32));
  const spendable = Math.max(0, buyer.sardines - reserve);
  const floor = sellerAsk(game, "player", item);
  const ceiling = buyerMax(game, buyerId, item);
  if (ceiling < floor || spendable < floor) return null;

  const relationship = game.relationships?.[buyerId] || 0;
  const target = goalUtility > 0
    ? (ITEMS[item]?.value || 0) + Math.max(1, Math.ceil(goalUtility * 0.45))
    : (ITEMS[item]?.value || 0) + Math.min(2, Math.ceil(tasteUtility * 0.2));
  const price = Math.min(spendable, ceiling, Math.max(floor, target + Math.min(1, relationship)));
  if (price < floor) return null;

  return {
    id: `inbound-${game.day}-morning-${buyerId}-${item}`,
    day: game.day,
    phase: "morning",
    kind: "buy-item",
    buyerId,
    item,
    price,
    priority: goalUtility > 0 ? 100 + goalUtility : 40 + tasteUtility,
    status: "pending",
    reason: goalUtility > 0 ? "exact current need" : "recognisable market interest",
    text: `${buyer.name} comes to you first: ${price}🥫 for ${item}.`,
  };
}

function inboundInformationOffer(game, buyerId, info) {
  const price = informationPrice(game, info, buyerId);
  if (price <= 0 || (game.traders[buyerId]?.sardines || 0) < price) return null;
  return {
    id: `inbound-${game.day}-${game.phase}-${buyerId}-info-${info.id}`,
    day: game.day,
    phase: game.phase,
    kind: "buy-information",
    buyerId,
    infoId: info.id,
    price,
    priority: 80 + precisionBonus(info.precision) * 4 + confidenceBonus(info.confidence),
    status: "pending",
    reason: "the lead is relevant to this trader",
    text: `${game.traders[buyerId].name} asks what you would take for one of your leads. Offer: ${price}🥫.`,
  };
}

export function buildInboundOffers(current, phase = current.phase) {
  const game = ensureState(clone(current));
  if (!["morning", "afternoon"].includes(phase) || game.ended) return [];
  const candidates = [];

  if (phase === "morning") {
    publiclyKnownPlayerItems(game).forEach((item) => {
      Object.keys(NPC_PROFILES).forEach((buyerId) => {
        const offer = inboundItemOffer(game, buyerId, item);
        if (offer) candidates.push(offer);
      });
    });
  }

  (game.information || []).forEach((info) => {
    currentInfoBuyers(game, info).forEach((buyerId) => {
      const offer = inboundInformationOffer(game, buyerId, info);
      if (offer) candidates.push(offer);
    });
  });

  const existingToday = new Set((game.inboundOffers || []).filter((offer) => offer.day === game.day).map((offer) => offer.id));
  const picked = [];
  const usedBuyers = new Set();
  candidates
    .filter((offer) => !existingToday.has(offer.id))
    .sort((a, b) => b.priority - a.priority || a.buyerId.localeCompare(b.buyerId) || a.id.localeCompare(b.id))
    .forEach((offer) => {
      if (picked.length >= 2 || usedBuyers.has(offer.buyerId)) return;
      usedBuyers.add(offer.buyerId);
      picked.push(offer);
    });
  return picked;
}

export function refreshInboundOffers(current, phase = current.phase) {
  const game = ensureState(clone(current));
  game.inboundOffers.forEach((offer) => {
    if (offer.status === "pending" && (offer.day < game.day || (offer.day === game.day && offer.phase !== phase))) offer.status = "expired";
  });
  const additions = buildInboundOffers(game, phase);
  game.inboundOffers.push(...additions);
  if (additions.length) game.log.unshift(`${additions.length} trader${additions.length === 1 ? "" : "s"} approached you directly.`);
  return game;
}

function transferInformation(game, info, buyerId, { cash = true, favour = false } = {}) {
  const buyer = game.traders[buyerId];
  const player = game.traders.player;
  if (!buyer || !player) return false;
  const price = cash ? informationPrice(game, info, buyerId) : 0;
  if (cash && (price <= 0 || buyer.sardines < price)) return false;

  if (cash) {
    buyer.sardines -= price;
    player.sardines += price;
    if (!info.soldTo.includes(buyerId)) info.soldTo.push(buyerId);
    game.stats.informationSales = (game.stats.informationSales || 0) + 1;
  }
  if (favour) {
    if (!info.sharedWith.includes(buyerId)) info.sharedWith.push(buyerId);
    game.relationships[buyerId] = (game.relationships[buyerId] || 0) + 1;
    game.stats.informationFavours += 1;
  }

  if (!info.knownBy.includes(buyerId)) info.knownBy.push(buyerId);
  info.diffusionCount = Math.max(0, info.knownBy.length - 1);
  info.exclusive = info.knownBy.length <= 1;
  game.npcMemory[buyerId].knownHoldings[info.item] = {
    holderId: info.subjectId,
    learnedDay: game.day,
    source: favour ? "shared by player as a favour" : `bought from player (${info.confidence} confidence)`,
  };
  return cash ? price : true;
}

export function acceptInboundOffer(current, offerId) {
  const game = ensureState(clone(current));
  const offer = game.inboundOffers.find((entry) => entry.id === offerId && entry.status === "pending");
  if (!offer || offer.day !== game.day || offer.phase !== game.phase) return game;

  if (offer.kind === "buy-item") {
    if (game.phase !== "morning" || !game.traders.player.inventory.includes(offer.item)) return game;
    const alreadyPromised = game.inboundOffers.some((entry) => entry.status === "accepted" && entry.kind === "buy-item" && entry.item === offer.item && entry.id !== offer.id);
    if (alreadyPromised) return game;
    game.marketPlan.push({
      from: offer.buyerId,
      to: "player",
      wantItem: offer.item,
      offerItem: null,
      sardines: offer.price,
      reason: "Accepted inbound bid to the player.",
      knowledgeBasis: "publicly known player holding",
      inboundOfferId: offer.id,
    });
    offer.status = "accepted";
    game.lastInteraction = { action: "inbound-offer", targetId: offer.buyerId, text: `You accept ${game.traders[offer.buyerId].name}'s ${offer.price}🥫 bid for ${offer.item}. It will settle at Noon if you still own the item.` };
    game.log.unshift(game.lastInteraction.text);
    return game;
  }

  if (offer.kind === "buy-information") {
    if (game.actionsRemaining <= 0) return game;
    const info = game.information.find((entry) => entry.id === offer.infoId);
    if (!info) return game;
    const paid = transferInformation(game, info, offer.buyerId, { cash: true });
    if (!paid) return game;
    offer.status = "accepted";
    game.actionsRemaining -= 1;
    addLearningNote(game, "information-market", "Information is an asset", "You converted a private lead into cash. Its resale value will fall as more people learn it.");
    game.lastInteraction = { action: "inbound-information", targetId: offer.buyerId, text: `${game.traders[offer.buyerId].name} pays ${paid}🥫 for your lead. It is no longer exclusive.` };
    game.log.unshift(game.lastInteraction.text);
  }
  return game;
}

export function declineInboundOffer(current, offerId) {
  const game = ensureState(clone(current));
  const offer = game.inboundOffers.find((entry) => entry.id === offerId && entry.status === "pending");
  if (!offer) return game;
  offer.status = "declined";
  game.lastInteraction = { action: "decline-inbound", targetId: offer.buyerId, text: `You decline ${game.traders[offer.buyerId]?.name || "the trader"}'s approach.` };
  return game;
}

export function shareInformationAsFavor(current, infoId, buyerId) {
  const game = ensureState(clone(current));
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || game.ended) return game;
  const info = game.information.find((entry) => entry.id === infoId);
  if (!info || info.freshness === "stale" || (info.knownBy || []).includes(buyerId)) return game;
  if (!currentInfoBuyers(game, info).includes(buyerId)) return game;
  if (!transferInformation(game, info, buyerId, { cash: false, favour: true })) return game;
  game.actionsRemaining -= 1;
  addLearningNote(game, "relationship-capital", "Information can become relationship capital", "You gave away something saleable and received familiarity instead of cash.");
  game.lastInteraction = { action: "information-favour", targetId: buyerId, text: `You give ${game.traders[buyerId].name} the lead without charging. They remember the favour.` };
  game.log.unshift(game.lastInteraction.text);
  return game;
}

function maybeProduceMaiTai(game) {
  const bar = game.traders.bar;
  const inputs = ["Rum Bottle", "Lime Crate", "Orange Curaçao", "Orgeat Bottle"];
  if (!inputs.every((ingredient) => bar.inventory.includes(ingredient)) || bar.inventory.includes("Mai Tai")) return;
  bar.inventory.push("Mai Tai");
  game.flags.orgeatDelivered = true;
  game.log.unshift("The Apprentice finally has everything needed to make a proper Mai Tai. One joins the Bar's available stock.");
}

function maybeBuildOnewheel(game) {
  const sailor = game.traders.mechanic;
  const ready = ONEWHEEL_CONSUMED_PARTS.every((part) => sailor.inventory.includes(part)) && sailor.inventory.includes(ONEWHEEL_TOOL);
  if (!ready || sailor.inventory.includes("Built Onewheel")) return;
  ONEWHEEL_CONSUMED_PARTS.forEach((part) => { sailor.inventory = removeOne(sailor.inventory, part); });
  sailor.inventory.push("Built Onewheel");
  game.flags.oneWheelBuilt = true;
  game.log.unshift("The Sailor uses the gathered bicycle parts and a torque wrench to assemble a working onewheel.");
}

function applyWorldReceivedItem(game, receiverId, item) {
  if (!item || !game.traders[receiverId]) return;
  if (receiverId === "bar" && item === "Orgeat Bottle") game.flags.orgeatDelivered = true;
  if (receiverId === "vale" && item === "Sperm Whale Oil") {
    game.flags.oilDeliveredToVale = true;
    game.traders.vale.inventory = game.traders.vale.inventory.filter((held) => held !== "Auction Onewheel");
  }
  if (receiverId === "mechanic" && item === "Lime Crate") game.flags.limeDeliveredToMechanic = true;
  maybeProduceMaiTai(game);
  maybeBuildOnewheel(game);
}

function applyWorldProduction(game) {
  maybeProduceMaiTai(game);
  maybeBuildOnewheel(game);
}

export function giveItem(current, targetId, item) {
  const game = ensureState(clone(current));
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || game.ended) return game;
  if (!game.traders[targetId] || targetId === "player" || !game.traders.player.inventory.includes(item)) return game;

  game.traders.player.inventory = removeOne(game.traders.player.inventory, item);
  game.traders[targetId].inventory.push(item);
  const utility = privateUtility(game, targetId, item);
  const relationshipGain = utility >= 8 ? 2 : 1;
  game.relationships[targetId] = (game.relationships[targetId] || 0) + relationshipGain;
  game.actionsRemaining -= 1;
  game.stats.gifts += 1;
  game.giftHistory.push({ day: game.day, targetId, item, relationshipGain });
  applyWorldReceivedItem(game, targetId, item);
  addLearningNote(game, "gift-economy", "A good does not have to become cash", "You converted an object into relationship capital instead of selling it.");
  game.lastInteraction = { action: "gift", targetId, text: `You give ${item} to ${game.traders[targetId].name}. They accept it as a gift, not a market settlement.` };
  game.log.unshift(game.lastInteraction.text);
  if (game.phase === "morning") game.marketPlan = planNPCMarket(game);
  return game;
}

function addLearningNote(game, id, title, text) {
  if (game.learningNotes.some((note) => note.id === id)) return;
  game.learningNotes.push({ id, title, text, day: game.day });
}

function applyExperienceFirstLearning(game) {
  (game.rejected || []).forEach((order) => {
    if (order.reasonCode === "outbid") addLearningNote(game, "competition", "A valid bid can still lose", "Meeting the ask only gets you into competition. Scarce stock goes to the stronger seller-valued offer.");
    if (order.reasonCode === "stale-stock") addLearningNote(game, "stale-information", "Information has a half-life", "A fact can be true when learned and useless by the time you trade on it.");
    if (order.reasonCode === "resource-used") addLearningNote(game, "opening-liquidity", "One sardine cannot fund two promises", "Noon uses only opening resources. Winning one order can make another impossible.");
    if (order.reasonCode === "below-ask") addLearningNote(game, "reservation-price", "An ask is not a valuation oracle", "A posted ask is the seller's current public minimum, not the object's universal value.");
  });

  (game.marketOutcome || []).filter((trade) => trade.from === "player" && trade.offerItem).forEach(() => {
    addLearningNote(game, "private-value", "Reference price is not private value", "A barter item can matter more to one counterparty than its public reference price suggests.");
  });
}

function applyWorldConsequencesFromNewTrades(game, previousHistoryLength) {
  (game.history || []).slice(previousHistoryLength).forEach((trade) => {
    applyWorldReceivedItem(game, trade.from, trade.item);
    if (trade.paymentItem) applyWorldReceivedItem(game, trade.to, trade.paymentItem);
    if (trade.to === "player") game.stats.inboundTrades += 1;
  });
  game.flags.steelDeliveredToMechanic = false;
  game.flags.toolDeliveredToMechanic = false;
  game.pendingEvents = base.buildEvents(game).filter((event) => {
    if (event.id !== "cliff") return true;
    return game.traders.player.inventory.includes("Built Onewheel");
  });
}

function applyBarToolRevenue(game, settledDay) {
  if (game.systemMarkers.barToolBonusDay === settledDay) return;
  const bar = game.traders.bar;
  const upgrades = ADVANCED_BAR_TOOLS.filter((tool) => bar.inventory.includes(tool)).length;
  if (!upgrades) return;
  bar.sardines += upgrades;
  game.systemMarkers.barToolBonusDay = settledDay;
  game.log.unshift(`The Bar's upgraded professional tools add ${upgrades}🥫 of service value tonight.`);
}

function markInboundSettlement(game) {
  (game.inboundOffers || []).forEach((offer) => {
    if (offer.status !== "accepted" || offer.kind !== "buy-item") return;
    const filled = (game.marketOutcome || []).some((trade) =>
      trade.from === offer.buyerId && trade.to === "player" && trade.wantItem === offer.item && Number(trade.sardines) === Number(offer.price)
    );
    offer.status = filled ? "filled" : "failed";
  });
}

function learnFromSunset(before, game) {
  const beforeObligations = base.currentObligations(before).length;
  const afterObligations = base.currentObligations(game).length;
  if (afterObligations > beforeObligations) addLearningNote(game, "credit", "A relationship can become liquidity", "Someone carried you through a shortfall. The favour survives as an obligation.");
  if (before.playerState.form !== game.playerState.form) addLearningNote(game, "legal-personhood", "Memory is not legal identity", "You remember the former life, but the market institutions do not automatically recognise its ownership claims.");

  const beforePerishables = (before.traders.player.inventory || []).filter((item) => ITEMS[item]?.shelfLife);
  const afterInventory = game.traders.player.inventory || [];
  if (beforePerishables.some((item) => !afterInventory.includes(item))) addLearningNote(game, "perishability", "Inventory can decay while you wait", "A good can lose all saleability simply because time passed.");
}

export function createGame() {
  return ensureState(base.createGame());
}

export function knownItemsForTrader(game, traderId) {
  const known = base.knownItemsForTrader(game, traderId);
  if (traderId === "bar" && game.traders.bar.inventory.includes("Mai Tai")) known.push("Mai Tai");
  if (traderId === "mechanic" && game.traders.mechanic.inventory.includes("Built Onewheel")) known.push("Built Onewheel");
  return [...new Set(known)];
}

export function advancePhase(current) {
  const before = ensureState(clone(current));
  const oldDay = before.day;
  const oldPhase = before.phase;
  let game = ensureState(base.advancePhase(before));

  if (oldPhase === "sunrise" && game.phase === "morning") game = refreshInboundOffers(game, "morning");
  if (oldPhase === "noon" && before.marketResolved && game.phase === "afternoon") game = refreshInboundOffers(game, "afternoon");
  if (oldPhase === "sunset") {
    applyWorldProduction(game);
    applyBarToolRevenue(game, oldDay);
    learnFromSunset(before, game);
    if (game.day !== oldDay) game.inboundOffers = game.inboundOffers.map((offer) => offer.status === "pending" ? { ...offer, status: "expired" } : offer);
  }
  return game;
}

export function resolveNoonMarket(current) {
  const before = ensureState(clone(current));
  before.flags.steelDeliveredToMechanic = false;
  before.flags.toolDeliveredToMechanic = false;
  const historyLength = before.history.length;
  const game = ensureState(base.resolveNoonMarket(before));
  applyWorldConsequencesFromNewTrades(game, historyLength);
  applyExperienceFirstLearning(game);
  markInboundSettlement(game);
  return game;
}

export function sellInformation(current, infoId, buyerId) {
  const game = ensureState(clone(current));
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || game.ended) return game;
  const info = game.information.find((entry) => entry.id === infoId);
  if (!info || !currentInfoBuyers(game, info).includes(buyerId)) return game;
  const paid = transferInformation(game, info, buyerId, { cash: true });
  if (!paid) return game;
  game.actionsRemaining -= 1;
  addLearningNote(game, "information-market", "Information is an asset", "You converted a private lead into cash. Its resale value will fall as more people learn it.");
  game.lastInteraction = { action: "sell-information", targetId: buyerId, text: `${game.traders[buyerId].name} pays ${paid}🥫 for your lead: ${info.text}` };
  game.log.unshift(game.lastInteraction.text);
  if (game.phase === "morning") game.marketPlan = planNPCMarket(game);
  return game;
}
