import {
  AFTERNOON_ACTIONS,
  INFO_BASE_PRICE,
  INITIAL_TRADERS,
  ITEMS,
  MAX_DAYS,
  MORNING_ACTIONS,
  NPC_PROFILES,
  PLAYER_CONTEXT,
  PROXY_FEE,
  SUSTENANCE_PER_DAY,
  VENUES,
} from "./gameData.js";
import { planNPCMarket, privateUtility, sellerAsk } from "./npcAI.js";

const clone = (value) => JSON.parse(JSON.stringify(value));
export const valueOf = (item) => (item && Number.isFinite(ITEMS[item]?.value) ? ITEMS[item].value : 0);
export const labelShort = (item) => item ? `${ITEMS[item]?.icon || "📦"} ${item}` : "nothing";
export const netWorth = (trader) => trader.sardines + trader.inventory.reduce((sum, item) => sum + valueOf(item), 0);
export const unique = (arr) => [...new Set(arr)];

function removeOne(inventory, item) {
  const index = inventory.indexOf(item);
  if (index < 0) return [...inventory];
  return [...inventory.slice(0, index), ...inventory.slice(index + 1)];
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
  };

  const key = informationKey(candidate);
  const existing = game.information.find((info) => informationKey(info) === key);
  if (existing) {
    existing.observedDay = game.day;
    existing.freshness = "current";
    existing.confidence = candidate.confidence;
    existing.precision = candidate.precision;
    existing.sellable = candidate.sellable;
    return existing;
  }

  game.information.push(candidate);
  return candidate;
}

function refreshInformation(game) {
  game.information.forEach((info) => {
    info.freshness = freshnessFor(game.day, info.observedDay);
  });
}

function createObligation(game, payload) {
  const lifeId = payload.debtorLifeId || game.playerState.legalIdentity.lifeId;
  const obligation = {
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
  return obligation;
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
    selected: "player",
    playerOrders: resetOrders(),
    lockedPlayerOrders: [],
    marketPlan: [],
    marketResolved: false,
    marketOutcome: [],
    rejected: [],
    history: [],
    information: [],
    intel: {},
    investigationCounts: zeroMap(),
    talkCounts: zeroMap(),
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
      orgeatDelivered: false,
      oilDeliveredToVale: false,
      limeDeliveredToMechanic: false,
      steelDeliveredToMechanic: false,
      toolDeliveredToMechanic: false,
      oneWheelBuilt: false,
      sunflowerAcquired: false,
      cheated: false,
      raced: false,
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
    },
    log: [
      "Day 1. The sunflower is not for sale.",
      "At noon, the public market opens once.",
      "Morning and afternoon are for information, relationships and positioning.",
    ],
  };
  game.marketPlan = planNPCMarket(game);
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

export function knownItemsForTrader(game, traderId) {
  const trader = game.traders[traderId];
  if (!trader) return [];
  if (traderId === "player") return [...trader.inventory];

  const known = [];
  (NPC_PROFILES[traderId]?.publicStock || []).forEach((item) => {
    if (trader.inventory.includes(item)) known.push(item);
  });

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
      if (buyerId === info.subjectId || info.soldTo.includes(buyerId)) return false;
      if (game.traders[buyerId]?.inventory.includes(info.item)) return false;
      return profileWantsItem(profile, info.item);
    })
    .map(([buyerId]) => buyerId);
}

export function sellInformation(current, infoId, buyerId) {
  const game = clone(current);
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || game.ended) return game;

  const info = game.information.find((entry) => entry.id === infoId);
  if (!info || !informationBuyers(game, info).includes(buyerId)) return game;

  const buyer = game.traders[buyerId];
  const player = game.traders.player;
  if (!buyer || buyer.sardines < INFO_BASE_PRICE) return game;

  buyer.sardines -= INFO_BASE_PRICE;
  player.sardines += INFO_BASE_PRICE;
  info.soldTo.push(buyerId);
  info.exclusive = false;
  game.stats.informationSales += 1;
  game.actionsRemaining -= 1;
  game.lastInteraction = {
    action: "sell-information",
    targetId: buyerId,
    text: `${buyer.name} pays ${INFO_BASE_PRICE}🥫 for the lead: ${info.text}`,
  };

  game.npcMemory[buyerId].knownHoldings[info.item] = {
    holderId: info.subjectId,
    learnedDay: game.day,
    source: `bought from player (${info.confidence} confidence)`,
  };

  game.log.unshift(game.lastInteraction.text);
  if (game.phase === "morning") game.marketPlan = planNPCMarket(game);
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
  if (player.sardines >= PROXY_FEE) {
    player.sardines -= PROXY_FEE;
    target.sardines += PROXY_FEE;
    game.lastInteraction = { action: "proxy", targetId, text: `${target.name} agrees to settle today's formal-market orders for ${PROXY_FEE}🥫.` };
  } else if (relationship >= 3) {
    createObligation(game, {
      kind: "proxy-fee",
      creditorId: targetId,
      amount: PROXY_FEE,
      dueDay: game.day + 2,
      note: "Formal-market proxy fee.",
    });
    game.stats.creditUsed += 1;
    game.lastInteraction = { action: "proxy", targetId, text: `${target.name} agrees to proxy today's market on credit.` };
  } else {
    game.lastInteraction = { action: "proxy", targetId, text: `${target.name} will proxy, but not on credit yet.` };
    return game;
  }

  game.playerState.proxyAccess.push({ venueId: "formalMarket", via: targetId, expiresDay: game.day });
  game.stats.proxyUses += 1;
  game.actionsRemaining -= 1;
  game.log.unshift(game.lastInteraction.text);
  return game;
}

export function repayObligation(current, obligationId) {
  const game = clone(current);
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || game.ended) return game;

  const obligation = currentObligations(game).find((entry) => entry.id === obligationId);
  if (!obligation) return game;
  const player = game.traders.player;
  if (player.sardines < obligation.amount) return game;

  player.sardines -= obligation.amount;
  const creditor = game.traders[obligation.creditorId];
  if (creditor) creditor.sardines += obligation.amount;
  obligation.status = "settled";
  obligation.settledDay = game.day;
  game.actionsRemaining -= 1;
  if (game.relationships[obligation.creditorId] !== undefined) game.relationships[obligation.creditorId] += 1;
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
    from: trade.from,
    to: trade.to,
    item: trade.wantItem,
    paymentItem: trade.offerItem || null,
    sardines: Number(trade.sardines || 0),
  };
  game.history.push(entry);

  Object.keys(game.npcMemory).forEach((npcId) => {
    if (npcId === trade.from || npcId === trade.to) return;
    const memory = game.npcMemory[npcId];
    memory.observedDemand[trade.wantItem] = (memory.observedDemand[trade.wantItem] || 0) + 1;
  });
  return entry;
}

function applySpecialRules(game, trade) {
  if (trade.from !== "player") return;
  const profit = valueOf(trade.wantItem) - valueOf(trade.offerItem) - Number(trade.sardines || 0);
  game.stats.totalProfit += profit;
  game.stats.tradeCount += 1;
  if (profit >= 2) game.stats.profitableFlips += 1;
  if (profit <= -3) game.stats.overpays += 1;

  const isCheat = trade.to === "mechanic" && trade.offerItem === "Bad Tangerine";
  if (isCheat) {
    game.flags.cheated = true;
    game.stats.cheats += 1;
    game.log.unshift("A Bad Tangerine passed as citrus. The Sailor will remember this.");
    return;
  }

  if (trade.to === "bar" && trade.offerItem === "Orgeat Bottle") {
    game.flags.orgeatDelivered = true;
    if (!game.traders.bar.inventory.includes("Mai Tai")) game.traders.bar.inventory.push("Mai Tai");
    game.log.unshift("The Apprentice can now make a proper Mai Tai.");
  }

  if (trade.to === "vale" && trade.offerItem === "Sperm Whale Oil") {
    game.flags.oilDeliveredToVale = true;
    if (!game.traders.vale.inventory.includes("Auction Onewheel")) game.traders.vale.inventory.push("Auction Onewheel");
    game.log.unshift("Vale quietly adds an onewheel lot to an upcoming auction.");
  }

  if (trade.to === "mechanic" && !game.flags.cheated) {
    if (trade.offerItem === "Lime Crate") game.flags.limeDeliveredToMechanic = true;
    if (trade.offerItem === "Steel Rim") game.flags.steelDeliveredToMechanic = true;
    if (trade.offerItem === "Tool Roll") game.flags.toolDeliveredToMechanic = true;
    if (
      game.flags.limeDeliveredToMechanic && game.flags.steelDeliveredToMechanic &&
      game.flags.toolDeliveredToMechanic && !game.flags.oneWheelBuilt
    ) {
      game.flags.oneWheelBuilt = true;
      const sailor = game.traders.mechanic;
      sailor.inventory = removeOne(removeOne(sailor.inventory, "Steel Rim"), "Tool Roll");
      sailor.inventory.push("Built Onewheel");
      game.log.unshift("The Sailor has enough parts to assemble a working onewheel.");
    }
  }
}

function publicPostedAsk(game, sellerId, item) {
  const isPublic = (NPC_PROFILES[sellerId]?.publicStock || []).includes(item) && game.traders[sellerId]?.inventory.includes(item);
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
      from: order.from,
      to: order.to,
      wantItem: order.wantItem,
      offerItem: order.offerItem || null,
      sardines: Number(order.sardines ?? 0),
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

    const isCheat = trade.to === "mechanic" && trade.offerItem === "Bad Tangerine";
    const utility = trade.offerItem ? privateUtility(game, trade.to, trade.offerItem) : 0;
    const mistakenCitrusUtility = isCheat ? privateUtility(game, trade.to, "Lime Crate") : 0;
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
      if (trade.offerItem) buyer.inventory = removeOne(buyer.inventory, trade.offerItem);
      seller.inventory = removeOne(seller.inventory, trade.wantItem);
      game.marketOutcome.push(trade);
      acceptedForLot.push(trade);
    });
  });

  game.traders = available;
  game.marketOutcome.forEach((trade) => {
    game.traders[trade.to].sardines += trade.sardines;
    if (trade.offerItem) game.traders[trade.to].inventory.push(trade.offerItem);
    game.traders[trade.from].inventory.push(trade.wantItem);
  });
  game.marketOutcome.forEach((trade) => {
    recordTrade(game, trade, trade.from === "player" ? "player-order" : "npc-plan");
    applySpecialRules(game, trade);
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

export function resolveNoonMarket(current) {
  const game = clone(current);
  if (game.phase !== "noon" || game.marketResolved || game.ended) return game;

  game.marketOutcome = [];
  game.rejected = [];
  clearCommittedOrders(game);
  updateHeatFromHistory(game);
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
    trader.inventory.forEach((item) => {
      const shelfLife = ITEMS[item]?.shelfLife;
      const timerKey = `${trader.id}:${item}`;
      if (!shelfLife) {
        nextInventory.push(item);
        delete timer[timerKey];
        return;
      }
      const age = (timer[timerKey] || 0) + 1;
      if (age >= shelfLife) {
        if (ITEMS[item]?.foodUnits && trader.id === "player" && !nextInventory.includes("Spoiled Fish")) nextInventory.push("Spoiled Fish");
        if (trader.id === "player") game.log.unshift(`${labelShort(item)} did not survive the sunset.`);
        delete timer[timerKey];
      } else {
        timer[timerKey] = age;
        nextInventory.push(item);
      }
    });
    trader.inventory = nextInventory;
  });
  game.perishTimer = timer;
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
        game.log.unshift(`The Bar closes service with ${revenue}🥫 of outside-customer revenue${hadIce ? " after a full cold-drink service" : " despite running short of ice"}.`);
      }
    }

    if (business.consumeAny?.length) {
      const item = business.consumeAny.find((candidate) => trader.inventory.includes(candidate));
      if (item) {
        trader.inventory = removeOne(trader.inventory, item);
        game.log.unshift(`${trader.name}'s ${labelShort(item)} ${business.consumeText || "is used up by sunset"}.`);
      }
    }

    (business.consume || []).forEach((item) => {
      if (!trader.inventory.includes(item)) return;
      trader.inventory = removeOne(trader.inventory, item);
      game.log.unshift(`${trader.name} uses ${labelShort(item)} during today's business.`);
    });

    if (business.outsideSaleAny?.length) {
      const item = business.outsideSaleAny.find((candidate) => trader.inventory.includes(candidate));
      if (item) {
        const proceeds = Math.max(1, Math.round(valueOf(item) * Number(business.outsideSaleRate || 0.75)));
        trader.inventory = removeOne(trader.inventory, item);
        trader.sardines += proceeds;
        game.log.unshift(`${trader.name} sells ${labelShort(item)} to ordinary outside customers for ${proceeds}🥫 after the public market closes.`);
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
      game.log.unshift(`${trader.name} cannot fund the next ${labelShort(item)} arrival tonight.`);
      return;
    }
    trader.sardines -= cost;
    trader.inventory.push(item);
    const verb = traderId === "dog" ? "scavenges" : traderId === "fishmonger" ? "sources" : "unloads";
    game.log.unshift(`${trader.name} ${verb} ${labelShort(item)} for tomorrow${cost ? ` at a ${cost}🥫 sourcing cost` : ""}.`);
  });

  if (game.day === NPC_PROFILES.mechanic.departureDay) {
    game.log.unshift("The Sailor's departure window has arrived. Local cargo will stop refreshing after today.");
  }
}

function settleBusinesses(game) {
  consumeConfiguredInputs(game);
  settleBusinessArrivals(game);
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
    if (obligation.debtorLifeId === oldLifeId && ["open", "overdue"].includes(obligation.status)) obligation.status = "estate";
  });
  player.sardines = 0;
  player.inventory = [];
  game.playerState.life += 1;
  game.stats.lives = game.playerState.life;
  game.playerState.form = "animal";
  game.playerState.legalIdentity = { status: "unrecognized", lifeId: `life-${game.playerState.life}`, formerLifeId: oldLifeId };
  game.playerState.proxyAccess = [];
  game.log.unshift("You wake in an animal form. Your old assets still exist, but the law no longer recognises you as their owner.");
}

function settleSustenance(game) {
  const player = game.traders.player;
  const edible = player.inventory
    .filter((item) => (ITEMS[item]?.foodUnits || 0) >= SUSTENANCE_PER_DAY)
    .sort((a, b) => valueOf(a) - valueOf(b) || a.localeCompare(b));

  if (edible.length) {
    const meal = edible[0];
    player.inventory = removeOne(player.inventory, meal);
    game.playerState.lastMeal = { day: game.day, source: "inventory", item: meal };
    game.log.unshift(`You eat ${labelShort(meal)} before sleep.`);
    return;
  }
  if (player.sardines >= SUSTENANCE_PER_DAY) {
    player.sardines -= SUSTENANCE_PER_DAY;
    game.playerState.lastMeal = { day: game.day, source: "sardine-tin", amount: SUSTENANCE_PER_DAY };
    game.log.unshift(`You open ${SUSTENANCE_PER_DAY}🥫 instead of keeping it as money.`);
    return;
  }

  const creditorId = chooseMealCreditSource(game);
  if (creditorId) {
    const creditor = game.traders[creditorId];
    creditor.sardines -= SUSTENANCE_PER_DAY;
    createObligation(game, {
      kind: "meal-credit",
      creditorId,
      amount: SUSTENANCE_PER_DAY,
      dueDay: game.day + 2,
      note: "Food advanced at sunset.",
    });
    game.stats.creditUsed += 1;
    game.playerState.lastMeal = { day: game.day, source: "credit", creditorId };
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
    game.log.unshift(`${obligation.amount}🥫 owed to ${creditor?.name || obligation.creditorId} is now overdue.`);
  });
}

function snapshotPlayerOrders(game) {
  return game.playerOrders
    .filter((order) => order.to && order.wantItem)
    .map((order) => ({
      ...clone(order),
      offerItem: order.offerItem || "",
      sardines: Number(order.sardines || 0),
      postedAsk: publicPostedAsk(game, order.to, order.wantItem),
      lockedDay: game.day,
    }));
}

export function advancePhase(current) {
  const game = clone(current);
  if (game.ended || game.pendingEvents.length) return game;

  if (game.phase === "sunrise") {
    game.phase = "morning";
    game.actionsRemaining = MORNING_ACTIONS;
    game.lastInteraction = null;
    return game;
  }
  if (game.phase === "morning") {
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
    return game;
  }
  if (game.phase === "afternoon") {
    game.phase = "sunset";
    game.actionsRemaining = 0;
    game.lastInteraction = null;
    return game;
  }
  if (game.phase === "sunset") {
    settleSustenance(game);
    markOverdueObligations(game);
    applyPerishables(game);
    settleBusinesses(game);

    if (game.day >= game.maxDays) {
      game.ended = true;
      game.winner = false;
      game.finalText = game.flags.sunflowerAcquired
        ? "You found the sunflower. It did not take you home. The prototype life window closes here, but the problem did not."
        : "The prototype's current life window closes here. The final life / rebirth pacing is not locked yet.";
      game.style = classify(game);
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
    refreshInformation(game);
    game.marketPlan = planNPCMarket(game);
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
  const stage = stages[Math.min(count, Math.max(0, stages.length - 1))] || { text: `${target.name} spends a little time with you.` };
  game.talkCounts[targetId] = count + 1;
  game.relationships[targetId] = (game.relationships[targetId] || 0) + 1;

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

  if (action === "talk") talkTo(game, targetId);
  else if (action === "investigate") investigate(game, targetId);
  else return game;

  game.actionsRemaining -= 1;
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
    game.flags.orgeatDelivered && player.inventory.includes("Mai Tai") &&
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
    !alreadyHasFlower && canAccessVenue(game, "valeGallery") && game.flags.oilDeliveredToVale &&
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
    (player.inventory.includes("Built Onewheel") || player.inventory.includes("Auction Onewheel")) &&
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
    acquireSunflower(game, "After closing, a meal ends with a sunflower changing hands without a market price.");
    return game;
  }
  if (id === "auction" && action === "Attend") {
    const reserve = game.flags.cheated ? 68 : 52;
    const amount = Number(bidAmount);
    if (!Number.isFinite(amount) || amount < reserve || amount > player.sardines) {
      game.log.unshift(`Vale's published reserve was ${reserve}🥫. Your bid did not clear.`);
      removePendingEvent(game, id);
      return game;
    }
    player.sardines -= amount;
    acquireSunflower(game, `Vale settles the sunflower lot at ${amount}🥫.`);
    return game;
  }
  if (id === "cliff" && action === "Race") {
    game.flags.raced = true;
    const preRaceWorth = netWorth(player);
    const wheelItem = player.inventory.includes("Built Onewheel") ? "Built Onewheel" : "Auction Onewheel";
    player.inventory = removeOne(removeOne(player.inventory, "Mai Tai"), wheelItem);
    if (preRaceWorth >= 60) {
      acquireSunflower(game, "You cross the cliff route with Clown. What you find is, unmistakably, a sunflower.");
    } else {
      game.log.unshift("The cliff wager fails. You had enough to enter the special situation, not enough margin for the current crude prototype odds model.");
      removePendingEvent(game, id);
    }
    return game;
  }

  removePendingEvent(game, id);
  return game;
}

export function classify(game) {
  const stats = game.stats;
  const noMarketFootprint =
    stats.tradeCount === 0 && stats.informationSales === 0 && stats.creditUsed === 0 &&
    stats.defaults === 0 && !game.flags.cheated && game.information.length === 0;
  if (noMarketFootprint) {
    return { name: "The Bystander", description: "You passed through the market without leaving enough of a trading footprint to classify." };
  }

  const scores = {
    "The Clean Knife": stats.tradeCount + Math.max(0, -stats.overpays),
    "The Spread Reader": stats.profitableFlips * 4 + Math.max(0, stats.totalProfit),
    "The Whale": stats.overpays * 4,
    "The Defector": game.flags.cheated ? 8 : 0,
    "The Information Broker": stats.informationSales * 4,
    "The Credit Creature": stats.creditUsed * 3 + stats.defaults,
    "The Patient Observer": game.information.length * 2,
  };
  const [name] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const descriptions = {
    "The Clean Knife": "You kept execution relatively disciplined.",
    "The Spread Reader": "You repeatedly found value in conversion and price differences.",
    "The Whale": "You forced outcomes by paying heavily.",
    "The Defector": "You used misrepresentation as a market tool.",
    "The Information Broker": "You turned private knowledge into a tradable asset.",
    "The Credit Creature": "You repeatedly turned relationships and future promises into present liquidity.",
    "The Patient Observer": "You spent meaningful time learning the people around the market.",
  };
  return { name, description: descriptions[name] };
}
