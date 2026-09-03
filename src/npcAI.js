import { INITIAL_TRADERS, ITEMS, NPC_PROFILES, SOCIAL_GRAPH } from "./gameData.js";

const itemValue = (item) => Number.isFinite(ITEMS[item]?.value) ? ITEMS[item].value : 0;

function goalFor(npcId, item) {
  return (NPC_PROFILES[npcId]?.goals || []).find((goal) => goal.item === item) || null;
}

function interestUtility(profile, item) {
  const type = ITEMS[item]?.type || "";
  return (profile?.interests || []).reduce((best, interest) => {
    if (!interest?.typeIncludes || !type.includes(interest.typeIncludes)) return best;
    return Math.max(best, Number(interest.utility || 0));
  }, 0);
}

function contactBetween(fromId, toId) {
  return SOCIAL_GRAPH[fromId]?.[toId] || { familiarity: 0, trust: 0, channel: null };
}

function workingCapitalReserve(buyerId, profile, goalPriority) {
  const startingCash = Number(INITIAL_TRADERS[buyerId]?.sardines || 0);
  const cashPreference = Math.max(0, Math.min(1, Number(profile?.cashPreference ?? 0.5)));
  const ordinaryReserveRatio = 0.25 + cashPreference * 0.25;
  const reserveRatio = goalPriority ? ordinaryReserveRatio * 0.5 : ordinaryReserveRatio;
  return Math.ceil(startingCash * reserveRatio);
}

export function privateUtility(game, npcId, item) {
  const profile = NPC_PROFILES[npcId];
  if (!profile) return 0;

  const goal = goalFor(npcId, item);
  let utility = goal ? Number(goal.utility || 0) : interestUtility(profile, item);

  if (goal && profile.departureDay && goal.urgencyPerDay) {
    const daysLeft = Math.max(0, profile.departureDay - game.day);
    const urgencyWindow = Math.max(0, 5 - daysLeft);
    utility += urgencyWindow * goal.urgencyPerDay;
  }
  return utility;
}

export function sellerAsk(game, sellerId, item) {
  const profile = NPC_PROFILES[sellerId] || { markup: 0, cashPreference: 0.5 };
  const ownUtility = privateUtility(game, sellerId, item);
  const heat = game.heat[item] || 0;
  const holdPremium = ownUtility > 0 ? Math.ceil(ownUtility * 0.65) : 0;
  const liquidityDiscount = profile.cashPreference > 0.65 ? -1 : 0;
  return Math.max(1, itemValue(item) + Number(profile.markup || 0) + heat + holdPremium + liquidityDiscount);
}

export function buyerMax(game, buyerId, item) {
  const base = itemValue(item);
  const utility = privateUtility(game, buyerId, item);
  const observedDemand = game.npcMemory?.[buyerId]?.observedDemand?.[item] || 0;
  return Math.max(0, Math.floor(base + utility + Math.min(4, observedDemand)));
}

function marketInterestMax(game, buyerId, item, utility) {
  const base = itemValue(item);
  const observedDemand = game.npcMemory?.[buyerId]?.observedDemand?.[item] || 0;

  // Broad taste is not a quest. Day 1 interest-only buying is limited to obvious bargains.
  if (game.day <= 1 && observedDemand <= 0) return Math.max(0, base - 1);
  const tastePremium = Math.min(3, Math.floor(Math.max(0, utility) / 3));
  const tapePremium = Math.min(2, observedDemand);
  return Math.max(0, base + tastePremium + tapePremium);
}

function latestPublicOwner(game, item) {
  const trades = game.history.filter((trade) => trade.item === item || trade.paymentItem === item);
  if (!trades.length) return null;
  const trade = trades[trades.length - 1];
  return trade.paymentItem === item ? trade.to : trade.from;
}

function publicSellersOf(game, item) {
  return Object.entries(NPC_PROFILES)
    .filter(([id, profile]) => (profile.publicStock || []).includes(item) && game.traders[id]?.inventory.includes(item))
    .map(([id]) => id);
}

function searchDepth(profile, day) {
  const tempo = Math.max(1, profile.informationTempo || 3);
  // Day 1 begins with public/tape/pre-existing knowledge. Active hidden-source search starts later.
  return Math.max(0, Math.floor((Math.max(1, day) - 1) / tempo));
}

function rankedHypotheses(buyerId, likelySources) {
  return [...(likelySources || [])]
    .map((sellerId, index) => ({ sellerId, index, contact: contactBetween(buyerId, sellerId) }))
    .sort((a, b) =>
      (b.contact.familiarity || 0) - (a.contact.familiarity || 0) ||
      (b.contact.trust || 0) - (a.contact.trust || 0) ||
      a.index - b.index
    );
}

function knownSourcesForItem(game, buyerId, item, likelySources = []) {
  if (item === "Blue Glass Marble") return [];
  const sources = new Map();

  publicSellersOf(game, item).forEach((sellerId) => {
    if (sellerId !== buyerId && sellerId !== "player") sources.set(sellerId, "public stock");
  });

  const tapeOwner = latestPublicOwner(game, item);
  if (tapeOwner && tapeOwner !== buyerId && tapeOwner !== "player") {
    sources.set(tapeOwner, "public tape");
  }

  const boughtLead = game.npcMemory?.[buyerId]?.knownHoldings?.[item];
  if (
    boughtLead?.holderId && boughtLead.holderId !== buyerId && boughtLead.holderId !== "player" &&
    game.day - Number(boughtLead.learnedDay || game.day) <= 2
  ) {
    sources.set(boughtLead.holderId, boughtLead.source || "bought information");
  }

  // Active search is reserved for explicit needs and only checks a bounded set of plausible contacts.
  const profile = NPC_PROFILES[buyerId];
  const depth = searchDepth(profile, game.day);
  rankedHypotheses(buyerId, likelySources)
    .slice(0, depth)
    .forEach(({ sellerId, contact }) => {
      if (sellerId === buyerId || sellerId === "player") return;
      const seller = game.traders[sellerId];
      if (seller?.inventory.includes(item)) {
        const basis = contact.familiarity >= 2
          ? `searched a known contact via ${contact.channel || "prior relationship"}`
          : "active search";
        sources.set(sellerId, basis);
      }
    });

  return [...sources.entries()].map(([sellerId, basis]) => ({ sellerId, basis }));
}

function pushCandidate(game, candidates, buyerId, item, likelySources, reason, goalPriority = false) {
  const buyer = game.traders[buyerId];
  const profile = NPC_PROFILES[buyerId];
  if (!buyer || !profile || buyer.inventory.includes(item)) return;

  const utility = privateUtility(game, buyerId, item);
  if (utility <= 0) return;

  const reserve = workingCapitalReserve(buyerId, profile, goalPriority);
  const spendableCash = Math.max(0, buyer.sardines - reserve);

  knownSourcesForItem(game, buyerId, item, likelySources).forEach(({ sellerId, basis }) => {
    const seller = game.traders[sellerId];
    if (!seller) return;

    // Crucial belief/truth separation: a tape record or bought lead may now be stale.
    // The NPC is still allowed to commit the order; clearing, not planning, discovers that stock vanished.
    const ask = sellerAsk(game, sellerId, item);
    const max = goalPriority ? buyerMax(game, buyerId, item) : marketInterestMax(game, buyerId, item, utility);
    const surplus = max - ask;
    if (ask <= spendableCash && surplus >= 0) {
      candidates.push({
        from: buyerId,
        to: sellerId,
        wantItem: item,
        sardines: ask,
        score: surplus + utility + (goalPriority ? 12 : 0),
        reason,
        knowledgeBasis: basis,
      });
    }
  });
}

export function planNPCMarket(game) {
  const plans = [];

  Object.keys(NPC_PROFILES).forEach((buyerId) => {
    const buyer = game.traders[buyerId];
    const profile = NPC_PROFILES[buyerId];
    if (!buyer || !profile) return;
    const candidates = [];

    (profile.goals || []).forEach((goal) => {
      pushCandidate(game, candidates, buyerId, goal.item, goal.likelySources || [], goal.reason, true);
    });

    Object.keys(ITEMS).forEach((item) => {
      if (goalFor(buyerId, item)) return;
      if (interestUtility(profile, item) <= 0) return;
      pushCandidate(game, candidates, buyerId, item, [], `Fits ${profile.style.toLowerCase()} market interests.`, false);
    });

    candidates.sort((a, b) => b.score - a.score || a.wantItem.localeCompare(b.wantItem));
    if (candidates[0]) plans.push(candidates[0]);
  });

  return plans.sort((a, b) => b.score - a.score || a.from.localeCompare(b.from));
}

export function visibleMarketBoard(game) {
  return game.marketPlan.map((plan) => ({
    from: plan.from,
    wantItem: plan.wantItem,
    sardines: plan.sardines,
    publicText: `${game.traders[plan.from].name} is prepared to pay ${plan.sardines}🥫 for ${plan.wantItem}.`,
  }));
}

export function visibleSellListings(game) {
  const listings = [];
  Object.entries(NPC_PROFILES).forEach(([sellerId, profile]) => {
    const seller = game.traders[sellerId];
    if (!seller) return;
    (profile.publicStock || []).forEach((item) => {
      if (!seller.inventory.includes(item)) return;
      listings.push({ sellerId, item, ask: sellerAsk(game, sellerId, item), reference: itemValue(item) });
    });
  });

  return listings.sort((a, b) => a.sellerId.localeCompare(b.sellerId) || a.ask - b.ask || a.item.localeCompare(b.item));
}
