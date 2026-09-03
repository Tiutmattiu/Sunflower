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

function ownersOf(game, item, excludedId) {
  // Legacy route protection: the Blue Glass Marble stays with Dock Dog unless the player takes it.
  if (item === "Blue Glass Marble") return [];
  return Object.values(game.traders)
    .filter((trader) => trader.id !== excludedId && trader.id !== "player" && trader.inventory.includes(item));
}

export function planNPCMarket(game) {
  const plans = [];

  Object.keys(NPC_PROFILES).forEach((buyerId) => {
    const buyer = game.traders[buyerId];
    if (!buyer) return;

    const candidates = [];
    (NPC_PROFILES[buyerId].goals || []).forEach((goal) => {
      if (buyer.inventory.includes(goal.item)) return;
      ownersOf(game, goal.item, buyerId).forEach((seller) => {
        const ask = sellerAsk(game, seller.id, goal.item);
        const max = buyerMax(game, buyerId, goal.item);
        const surplus = max - ask;
        if (ask <= buyer.sardines && surplus >= 0) {
          candidates.push({
            from: buyerId,
            to: seller.id,
            wantItem: goal.item,
            sardines: ask,
            score: surplus + privateUtility(game, buyerId, goal.item),
            reason: goal.reason,
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
