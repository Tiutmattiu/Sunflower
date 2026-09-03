import { ITEMS, NPC_PROFILES, SOCIAL_GRAPH } from "./gameData";

const itemValue = (item) => ITEMS[item]?.value ?? 0;

function goalOptions(goal) {
  return [
    { item: goal.item, utility: goal.utility, likelySources: goal.likelySources || [] },
    ...(goal.substitutes || []).map((substitute) => ({
      item: substitute.item,
      utility: substitute.utility,
      likelySources: substitute.likelySources || goal.likelySources || [],
    })),
  ];
}

function goalMatchFor(npcId, item) {
  for (const goal of NPC_PROFILES[npcId]?.goals || []) {
    const option = goalOptions(goal).find((candidate) => candidate.item === item);
    if (option) return { goal, option };
  }
  return null;
}

function contactBetween(fromId, toId) {
  return SOCIAL_GRAPH[fromId]?.[toId] || { familiarity: 0, trust: 0, channel: null };
}

export function privateUtility(game, npcId, item) {
  const profile = NPC_PROFILES[npcId];
  const match = goalMatchFor(npcId, item);
  if (!profile || !match) return 0;

  let utility = match.option.utility || 0;

  // Owning a substitute does not erase the primary need, but it lowers the pressure to upgrade.
  if (item === match.goal.item) {
    const ownedSubstitute = (match.goal.substitutes || []).find((substitute) =>
      game.traders[npcId]?.inventory.includes(substitute.item)
    );
    if (ownedSubstitute) {
      utility = Math.max(1, utility - Math.ceil((ownedSubstitute.utility || 0) * 0.5));
    }
  }

  if (profile.departureDay && match.goal.urgencyPerDay) {
    const daysLeft = Math.max(0, profile.departureDay - game.day);
    const urgencyWindow = Math.max(0, 5 - daysLeft);
    utility += urgencyWindow * match.goal.urgencyPerDay;
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

function rankedHypotheses(buyerId, likelySources) {
  return [...(likelySources || [])]
    .map((sellerId, index) => ({
      sellerId,
      index,
      contact: contactBetween(buyerId, sellerId),
    }))
    .sort((a, b) =>
      (b.contact.familiarity || 0) - (a.contact.familiarity || 0) ||
      b.contact.trust - a.contact.trust ||
      a.index - b.index
    );
}

function knownSourcesForItem(game, buyerId, item, likelySources) {
  if (item === "Blue Glass Marble") return [];

  const sources = new Map();

  publicSellersOf(item).forEach((sellerId) => {
    if (sellerId !== buyerId && sellerId !== "player") {
      sources.set(sellerId, "public stock");
    }
  });

  const tapeOwner = latestPublicOwner(game, item);
  if (tapeOwner && tapeOwner !== buyerId && tapeOwner !== "player") {
    sources.set(tapeOwner, "public tape");
  }

  const boughtLead = game.npcMemory?.[buyerId]?.knownHoldings?.[item];
  if (boughtLead?.holderId && boughtLead.holderId !== buyerId && boughtLead.holderId !== "player") {
    sources.set(boughtLead.holderId, boughtLead.source || "bought information");
  }

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

function primaryGoalCovered(buyer, goal) {
  return buyer.inventory.includes(goal.item);
}

export function planNPCMarket(game) {
  const plans = [];

  Object.keys(NPC_PROFILES).forEach((buyerId) => {
    const buyer = game.traders[buyerId];
    if (!buyer) return;

    const candidates = [];
    (NPC_PROFILES[buyerId].goals || []).forEach((goal) => {
      if (primaryGoalCovered(buyer, goal)) return;

      goalOptions(goal).forEach((option) => {
        if (buyer.inventory.includes(option.item)) return;

        knownSourcesForItem(game, buyerId, option.item, option.likelySources).forEach(({ sellerId, basis }) => {
          const seller = game.traders[sellerId];
          if (!seller) return;

          const ask = sellerAsk(game, sellerId, option.item);
          const max = buyerMax(game, buyerId, option.item);
          const surplus = max - ask;
          if (ask <= buyer.sardines && surplus >= 0) {
            candidates.push({
              from: buyerId,
              to: sellerId,
              wantItem: option.item,
              sardines: ask,
              score: surplus + privateUtility(game, buyerId, option.item),
              reason: goal.reason,
              knowledgeBasis: basis,
            });
          }
        });
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
