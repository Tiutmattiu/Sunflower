import { ITEMS, NPC_PROFILES } from "./gameData";

const itemValue = (item) => ITEMS[item]?.value ?? 0;

function goalFor(npcId, item) {
  return (NPC_PROFILES[npcId]?.goals || []).find((goal) => goal.item === item) || null;
}

export function privateUtility(game, npcId, item) {
  const profile = NPC_PROFILES[npcId];
  const goal = goalFor(npcId, item);
  if (!profile || !goal) return 0;

  let utility = goal.utility || 0;
  if (profile.departureDay && goal.urgencyPerDay) {
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
  return Math.max(1, itemValue(item) + profile.markup + heat + holdPremium + liquidityDiscount);
}

export function buyerMax(game, buyerId, item) {
  const base = itemValue(item);
  const utility = privateUtility(game, buyerId, item);
  const observedDemand = game.npcMemory?.[buyerId]?.observedDemand?.[item] || 0;
  return Math.max(0, Math.floor(base + utility + Math.min(2, observedDemand)));
}

function latestPublicOwner(game, item) {
  const trades = game.history.filter((trade) => trade.item === item);
  if (!trades.length) return null;
  return trades[trades.length - 1].from;
}

function publicSellersOf(item) {
  return Object.entries(NPC_PROFILES)
    .filter(([, profile]) => (profile.publicStock || []).includes(item))
    .map(([id]) => id);
}

function searchDepth(profile, day) {
  const tempo = Math.max(1, profile.informationTempo || 3);
  return Math.floor(day / tempo);
}

function knownSourcesForGoal(game, buyerId, goal) {
  if (goal.item === "Blue Glass Marble") return [];

  const sources = new Map();

  // Public-facing stock is common knowledge. It may still be stale by clearing time.
  publicSellersOf(goal.item).forEach((sellerId) => {
    if (sellerId !== buyerId && sellerId !== "player") {
      sources.set(sellerId, "public stock");
    }
  });

  // Public trades reveal a recent owner. Consumption or private transfers may later make this stale.
  const tapeOwner = latestPublicOwner(game, goal.item);
  if (tapeOwner && tapeOwner !== buyerId && tapeOwner !== "player") {
    sources.set(tapeOwner, "public tape");
  }

  // Hidden inventory requires active search. Better information traders search plausible sources faster.
  const profile = NPC_PROFILES[buyerId];
  const depth = searchDepth(profile, game.day);
  const hypotheses = (goal.likelySources || []).slice(0, depth);
  hypotheses.forEach((sellerId) => {
    if (sellerId === buyerId || sellerId === "player") return;
    const seller = game.traders[sellerId];
    if (seller?.inventory.includes(goal.item)) {
      sources.set(sellerId, "active search");
    }
  });

  return [...sources.entries()].map(([sellerId, basis]) => ({ sellerId, basis }));
}

export function planNPCMarket(game) {
  const plans = [];

  Object.keys(NPC_PROFILES).forEach((buyerId) => {
    const buyer = game.traders[buyerId];
    if (!buyer) return;

    const candidates = [];
    (NPC_PROFILES[buyerId].goals || []).forEach((goal) => {
      if (buyer.inventory.includes(goal.item)) return;

      knownSourcesForGoal(game, buyerId, goal).forEach(({ sellerId, basis }) => {
        const seller = game.traders[sellerId];
        if (!seller) return;

        const ask = sellerAsk(game, sellerId, goal.item);
        const max = buyerMax(game, buyerId, goal.item);
        const surplus = max - ask;
        if (ask <= buyer.sardines && surplus >= 0) {
          candidates.push({
            from: buyerId,
            to: sellerId,
            wantItem: goal.item,
            sardines: ask,
            score: surplus + privateUtility(game, buyerId, goal.item),
            reason: goal.reason,
            knowledgeBasis: basis,
          });
        }
      });
    });

    candidates.sort((a, b) => b.score - a.score || a.wantItem.localeCompare(b.wantItem));
    if (candidates[0]) plans.push(candidates[0]);
  });

  return plans.sort((a, b) => b.score - a.score || a.from.localeCompare(b.from));
}

export function visibleMarketBoard(game) {
  return game.marketPlan.map((plan) => ({
    ...plan,
    publicText: `${game.traders[plan.from].name} is prepared to pay ${plan.sardines}🥫 for ${plan.wantItem}.`,
  }));
}
