import {
  AFTERNOON_ACTIONS,
  INITIAL_TRADERS,
  ITEMS,
  MAX_DAYS,
  MORNING_ACTIONS,
  NPC_PROFILES,
  PLAYER_CONTEXT,
  VENUES,
} from "./gameData";
import { planNPCMarket, sellerAsk } from "./npcAI";

const clone = (value) => JSON.parse(JSON.stringify(value));
export const valueOf = (item) => (item ? ITEMS[item]?.value || 0 : 0);
export const labelShort = (item) => item ? `${ITEMS[item]?.icon || "📦"} ${item}` : "nothing";
export const netWorth = (trader) => trader.sardines + trader.inventory.reduce((sum, item) => sum + valueOf(item), 0);
export const unique = (arr) => [...new Set(arr)];

const emptyOrder = () => ({ to: "", wantItem: "", offerItem: "", sardines: 0 });
export const resetOrders = () => [emptyOrder(), emptyOrder(), emptyOrder()];

function emptyMemory() {
  return Object.fromEntries(
    Object.keys(NPC_PROFILES).map((id) => [id, {
      observedDemand: {},
      observations: [],
      knownHoldings: {},
    }])
  );
}

function relationshipMap() {
  return Object.fromEntries(Object.keys(NPC_PROFILES).map((id) => [id, 0]));
}

function informationKey(info) {
  return [info.claimType, info.subjectId || "", info.item || "", info.text || ""].join("|");
}

function addInformation(game, payload) {
  const candidate = {
    id: `info-${game.information.length + 1}`,
    claimType: payload.claimType,
    subjectId: payload.subjectId || null,
    item: payload.item || null,
    text: payload.text,
    source: payload.source || "unknown",
    confidence: payload.confidence || "medium",
    observedDay: game.day,
    freshness: payload.freshness || "current",
    exclusive: payload.exclusive ?? false,
    sellable: payload.sellable ?? false,
    soldTo: [],
  };

  const key = informationKey(candidate);
  const existing = game.information.find((info) => informationKey(info) === key);
  if (existing) {
    existing.observedDay = game.day;
    existing.freshness = candidate.freshness;
    existing.confidence = candidate.confidence;
    return existing;
  }

  game.information.push(candidate);
  return candidate;
}

export function createGame() {
  const game = {
    day: 1,
    maxDays: MAX_DAYS,
    phase: "sunrise",
    actionsRemaining: 0,
    traders: clone(INITIAL_TRADERS),
    playerState: {
      life: 1,
      form: PLAYER_CONTEXT.startingForm,
      legalIdentity: {
        status: PLAYER_CONTEXT.startingLegalIdentity,
        lifeId: "life-1",
      },
      proxyAccess: [],
    },
    selected: "player",
    playerOrders: resetOrders(),
    marketPlan: [],
    marketResolved: false,
    marketOutcome: [],
    rejected: [],
    history: [],
    information: [],
    intel: {}, // compatibility layer while UI migrates to information objects
    relationships: relationshipMap(),
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
  if (game.playerState.proxyAccess.includes(venueId)) return true;

  const formAllowed = venue.allowedForms.includes(game.playerState.form);
  if (!formAllowed) return false;
  if (!venue.requiresLegalIdentity) return true;
  return game.playerState.legalIdentity.status === "recognized";
}

function latestPublicOwners(game) {
  const owners = {};
  game.history.forEach((trade) => {
    owners[trade.item] = trade.from;
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
    .filter((info) => info.claimType === "holding" && info.subjectId === traderId && info.item)
    .forEach((info) => known.push(info.item));

  return unique(known);
}

export function informationBuyers(game, info) {
  if (!info?.sellable || info.claimType !== "holding" || !info.item) return [];
  return Object.entries(NPC_PROFILES)
    .filter(([buyerId, profile]) => {
      if (buyerId === info.subjectId) return false;
      if (info.soldTo.includes(buyerId)) return false;
      if (game.traders[buyerId]?.inventory.includes(info.item)) return false;
      return (profile.goals || []).some((goal) => goal.item === info.item);
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
  const price = 1; // First-pass information price; negotiation comes later.
  if (!buyer || buyer.sardines < price) return game;

  buyer.sardines -= price;
  player.sardines += price;
  info.soldTo.push(buyerId);
  info.exclusive = false;
  game.stats.informationSales += 1;
  game.actionsRemaining -= 1;

  game.npcMemory[buyerId].knownHoldings[info.item] = {
    holderId: info.subjectId,
    learnedDay: game.day,
    source: `bought from player (${info.confidence} confidence)`,
  };

  game.log.unshift(`${buyer.name} pays 1🥫 for your lead: ${info.text}`);

  // Morning information can change the buyer's actual noon positioning. The plan remains deterministic;
  // it changes because the information set changed, not because Resolve rerolled it.
  if (game.phase === "morning") game.marketPlan = planNPCMarket(game);
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
    game.log.unshift("The Apprentice can now make a Mai Tai.");
  }

  if (trade.to === "vale" && trade.offerItem === "Sperm Whale Oil") {
    game.flags.oilDeliveredToVale = true;
    if (!game.traders.vale.inventory.includes("Auction Sunflower")) game.traders.vale.inventory.push("Auction Sunflower");
    if (!game.traders.vale.inventory.includes("Auction Onewheel")) game.traders.vale.inventory.push("Auction Onewheel");
    game.log.unshift("Vale quietly adds two lots to an upcoming auction.");
  }

  if (trade.to === "mechanic" && !game.flags.cheated) {
    if (trade.offerItem === "Lime Crate") game.flags.limeDeliveredToMechanic = true;
    if (trade.offerItem === "Steel Rim") game.flags.steelDeliveredToMechanic = true;
    if (trade.offerItem === "Tool Roll") game.flags.toolDeliveredToMechanic = true;
    if (
      game.flags.limeDeliveredToMechanic &&
      game.flags.steelDeliveredToMechanic &&
      game.flags.toolDeliveredToMechanic &&
      !game.flags.oneWheelBuilt
    ) {
      game.flags.oneWheelBuilt = true;
      const sailor = game.traders.mechanic;
      sailor.inventory = sailor.inventory.filter((item) => item !== "Steel Rim" && item !== "Tool Roll");
      sailor.inventory.push("Built Onewheel");
      game.log.unshift("The Sailor has enough parts to assemble a working onewheel.");
    }
  }
}

function executePlayerOrders(game) {
  const accepted = [];
  const rejected = [];
  const usedPaymentItems = new Set();

  game.playerOrders.filter((order) => order.to && order.wantItem).forEach((order) => {
    const player = game.traders.player;
    const target = game.traders[order.to];
    const normalized = {
      from: "player",
      to: order.to,
      wantItem: order.wantItem,
      offerItem: order.offerItem || null,
      sardines: Number(order.sardines || 0),
    };

    if (!target || !target.inventory.includes(normalized.wantItem)) {
      rejected.push({ ...normalized, reason: "The item was not available when the noon market cleared." });
      return;
    }
    if (normalized.offerItem && !player.inventory.includes(normalized.offerItem)) {
      rejected.push({ ...normalized, reason: "You no longer own the payment item." });
      return;
    }
    if (normalized.offerItem && usedPaymentItems.has(normalized.offerItem)) {
      rejected.push({ ...normalized, reason: "You tried to spend the same item twice." });
      return;
    }
    if (player.sardines < normalized.sardines) {
      rejected.push({ ...normalized, reason: "You do not have enough sardines at clearing." });
      return;
    }

    const isCheat = normalized.to === "mechanic" && normalized.offerItem === "Bad Tangerine";
    const paymentValue = valueOf(normalized.offerItem) + normalized.sardines;
    const ask = sellerAsk(game, target.id, normalized.wantItem);
    const exactDelivery = NPC_PROFILES[target.id]?.goals?.some((goal) => goal.item === normalized.offerItem);

    if (!isCheat && !exactDelivery && paymentValue < ask) {
      rejected.push({ ...normalized, reason: `${target.name} would not clear below an estimated ${ask}🥫 of value.` });
      return;
    }

    if (normalized.offerItem) {
      player.inventory = player.inventory.filter((item) => item !== normalized.offerItem);
      target.inventory.push(normalized.offerItem);
      usedPaymentItems.add(normalized.offerItem);
    }
    if (normalized.sardines > 0) {
      player.sardines -= normalized.sardines;
      target.sardines += normalized.sardines;
    }
    target.inventory = target.inventory.filter((item) => item !== normalized.wantItem);
    player.inventory.push(normalized.wantItem);
    accepted.push(normalized);
    recordTrade(game, normalized, "player-order");
    applySpecialRules(game, normalized);
  });

  game.marketOutcome = accepted;
  game.rejected = rejected;
}

function rejectPlayerOrdersForAccess(game) {
  game.rejected = game.playerOrders
    .filter((order) => order.to && order.wantItem)
    .map((order) => ({
      from: "player",
      to: order.to,
      wantItem: order.wantItem,
      offerItem: order.offerItem || null,
      sardines: Number(order.sardines || 0),
      reason: "Your current form / legal identity cannot settle directly in the formal market without a proxy.",
    }));
}

function executeCommittedNPCPlan(game) {
  game.marketPlan.forEach((plan) => {
    const buyer = game.traders[plan.from];
    const seller = game.traders[plan.to];
    if (!buyer || !seller) return;
    if (!seller.inventory.includes(plan.wantItem)) return;
    if (buyer.sardines < plan.sardines) return;

    buyer.sardines -= plan.sardines;
    seller.sardines += plan.sardines;
    seller.inventory = seller.inventory.filter((item) => item !== plan.wantItem);
    buyer.inventory.push(plan.wantItem);
    recordTrade(game, plan, "npc-plan");
    game.marketOutcome.push(plan);
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
  if (canAccessVenue(game, "formalMarket")) executePlayerOrders(game);
  else rejectPlayerOrdersForAccess(game);
  executeCommittedNPCPlan(game);
  updateHeatFromHistory(game);
  game.marketResolved = true;
  game.playerOrders = resetOrders();
  game.log.unshift(`Day ${game.day} noon market cleared: ${game.marketOutcome.length} trade(s).`);
  game.pendingEvents = buildEvents(game);
  return game;
}

function applyPerishables(game) {
  const timer = { ...game.perishTimer };
  const player = game.traders.player;
  Object.keys(timer).forEach((item) => {
    if (!player.inventory.includes(item)) delete timer[item];
  });

  const nextInventory = [];
  player.inventory.forEach((item) => {
    if (!ITEMS[item]?.perishable) {
      nextInventory.push(item);
      return;
    }
    const age = (timer[item] || 0) + 1;
    if (age >= 3) {
      if (!nextInventory.includes("Spoiled Fish")) nextInventory.push("Spoiled Fish");
      game.log.unshift(`${labelShort(item)} spoiled at sunset.`);
      delete timer[item];
    } else {
      timer[item] = age;
      nextInventory.push(item);
    }
  });
  player.inventory = nextInventory;
  game.perishTimer = timer;
}

function settleBusinesses(game) {
  const dog = game.traders.dog;
  const fishmonger = game.traders.fishmonger;

  if (dog.inventory.includes("Fresh Mackerel")) {
    dog.inventory = dog.inventory.filter((item) => item !== "Fresh Mackerel");
    game.log.unshift("Dock Dog's fresh fish disappears into the cat colony by sunset.");
  }

  if (!fishmonger.inventory.includes("Fresh Mackerel")) {
    fishmonger.inventory.push("Fresh Mackerel");
    game.log.unshift("Fishmonger lands one fresh market lot for tomorrow.");
  }
  if (!dog.inventory.includes("Dead Pigeon")) {
    dog.inventory.push("Dead Pigeon");
    game.log.unshift("Dock Dog scavenges another deeply questionable piece of inventory.");
  }

  const sailorProfile = NPC_PROFILES.mechanic;
  if (game.day === sailorProfile.departureDay) {
    game.log.unshift("The Sailor's departure window has arrived. Future versions will make this a hard availability event.");
  }
}

export function advancePhase(current) {
  const game = clone(current);
  if (game.ended || game.pendingEvents.length) return game;

  if (game.phase === "sunrise") {
    game.phase = "morning";
    game.actionsRemaining = MORNING_ACTIONS;
    return game;
  }
  if (game.phase === "morning") {
    game.phase = "noon";
    game.actionsRemaining = 0;
    return game;
  }
  if (game.phase === "noon") {
    if (!game.marketResolved) return game;
    game.phase = "afternoon";
    game.actionsRemaining = AFTERNOON_ACTIONS;
    return game;
  }
  if (game.phase === "afternoon") {
    game.phase = "sunset";
    game.actionsRemaining = 0;
    return game;
  }
  if (game.phase === "sunset") {
    applyPerishables(game);
    settleBusinesses(game);
    if (game.day >= game.maxDays) {
      game.ended = true;
      game.winner = false;
      game.finalText = "The prototype's current life window closes here. The final life / rebirth pacing is not locked yet.";
      game.style = classify(game);
      return game;
    }
    game.day += 1;
    game.phase = "sunrise";
    game.marketResolved = false;
    game.marketOutcome = [];
    game.rejected = [];
    game.pendingEvents = [];
    game.actionsRemaining = 0;
    game.marketPlan = planNPCMarket(game);
    game.log.unshift(`Day ${game.day}. New positions form before the noon market.`);
    return game;
  }
  return game;
}

function hiddenItemScore(item, targetId) {
  const outsideDemand = Object.entries(NPC_PROFILES).reduce((sum, [buyerId, profile]) => {
    if (buyerId === targetId) return sum;
    return sum + ((profile.goals || []).some((goal) => goal.item === item) ? 10 : 0);
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
    confidence: "high",
    freshness: "current",
    exclusive: true,
    sellable: true,
  });
}

export function performFreeAction(current, action, targetId) {
  const game = clone(current);
  if (!["morning", "afternoon"].includes(game.phase) || game.actionsRemaining <= 0 || game.ended) return game;
  const target = game.traders[targetId];
  if (!target || targetId === "player") return game;

  if (action === "talk") {
    game.relationships[targetId] = (game.relationships[targetId] || 0) + 1;
    const relationship = game.relationships[targetId];
    game.log.unshift(`${target.name}: relationship contact +1. Current familiarity ${relationship}.`);
    if (relationship >= 2 && !game.intel[`${targetId}:style`]) {
      game.intel[`${targetId}:style`] = NPC_PROFILES[targetId].style;
      addInformation(game, {
        claimType: "style",
        subjectId: targetId,
        text: `${target.name} trades like a ${NPC_PROFILES[targetId].style.toLowerCase()}.`,
        source: "relationship",
        confidence: "medium",
        sellable: false,
      });
    }
  }

  if (action === "investigate") {
    const holding = revealHolding(game, targetId);
    if (holding) {
      game.log.unshift(`You investigate ${target.name} and confirm a holding: ${labelShort(holding.item)}.`);
    } else {
      const profile = NPC_PROFILES[targetId];
      const primary = profile.goals?.[0];
      const clue = primary ? `${profile.clue} Current pressure: ${primary.reason}` : profile.clue;
      game.intel[`${targetId}:clue`] = clue;
      addInformation(game, {
        claimType: "pressure",
        subjectId: targetId,
        text: clue,
        source: "personal investigation",
        confidence: "medium",
        sellable: false,
      });
      game.log.unshift(`You spend time investigating ${target.name}. Their pressure becomes more legible.`);
    }
  }

  game.actionsRemaining -= 1;
  return game;
}

export function buildEvents(game) {
  if (game.ended) return [];
  const player = game.traders.player;
  const events = [];
  const soupFish = ["Fresh Mackerel", "Salted Cod"];

  if (
    canAccessVenue(game, "bar") &&
    !game.flags.cheated &&
    game.flags.orgeatDelivered &&
    player.inventory.includes("Mai Tai") &&
    player.inventory.some((item) => soupFish.includes(item))
  ) {
    events.push({
      id: "grandma",
      title: "After closing",
      text: "The Apprentice asks if you want to bring the fish and Mai Tai downstairs after the bar closes.",
      actions: ["Go", "Not tonight"],
    });
  }

  if (
    canAccessVenue(game, "valeGallery") &&
    game.flags.oilDeliveredToVale &&
    player.inventory.includes("Blue Glass Marble") &&
    netWorth(player) >= (game.flags.cheated ? 22 : 18)
  ) {
    events.push({
      id: "auction",
      title: "A private auction invitation",
      text: "Vale sends a card. One of the lots is a living sunflower.",
      actions: ["Attend", "Ignore"],
    });
  }

  if (
    !game.flags.raced &&
    (player.inventory.includes("Built Onewheel") || player.inventory.includes("Auction Onewheel")) &&
    player.inventory.includes("Mai Tai")
  ) {
    events.push({
      id: "cliff",
      title: "The cliff wager",
      text: "Clown proposes one race at sunset. The wager is not explained very well.",
      actions: ["Race", "Decline"],
    });
  }

  return events.slice(0, 1);
}

export function resolveEvent(current, id, action, bidAmount = null) {
  const game = clone(current);
  const player = game.traders.player;

  if (id === "grandma" && action === "Go") {
    player.inventory.push("Sunflower");
    game.ended = true;
    game.winner = true;
    game.finalText = "After closing, a meal ends with a sunflower changing hands without a market price.";
  } else if (id === "auction" && action === "Attend") {
    const reserve = game.flags.cheated ? 20 : 16;
    const amount = Number(bidAmount);
    if (!Number.isFinite(amount) || amount < reserve || amount > player.sardines) {
      game.log.unshift(`Vale's reserve was ${reserve}🥫. Your bid did not clear.`);
      game.pendingEvents = [];
      return game;
    }
    player.sardines -= amount;
    player.inventory.push("Sunflower");
    game.ended = true;
    game.winner = true;
    game.finalText = `Vale settles the sunflower lot at ${amount}🥫.`;
  } else if (id === "cliff" && action === "Race") {
    game.flags.raced = true;
    const preRaceWorth = netWorth(player);
    player.inventory = player.inventory.filter((item) => item !== "Mai Tai" && item !== "Built Onewheel" && item !== "Auction Onewheel");
    const won = preRaceWorth >= 14;
    if (won) {
      player.inventory.push("Sunflower");
      game.ended = true;
      game.winner = true;
      game.finalText = "You cross the cliff route with Clown. For now, the prototype calls what you find a sunflower.";
    } else {
      game.log.unshift("The cliff wager fails. The uncertainty model is deliberately simple in this milestone.");
      game.pendingEvents = [];
      return game;
    }
  } else {
    game.pendingEvents = [];
    return game;
  }

  game.pendingEvents = [];
  game.style = classify(game);
  return game;
}

export function classify(game) {
  const stats = game.stats;
  const scores = {
    "The Clean Knife": stats.tradeCount + Math.max(0, -stats.overpays),
    "The Spread Reader": stats.profitableFlips * 4 + Math.max(0, stats.totalProfit),
    "The Whale": stats.overpays * 4,
    "The Defector": game.flags.cheated ? 8 : 0,
    "The Information Broker": stats.informationSales * 4,
    "The Patient Observer": game.information.length * 2,
  };
  const [name] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const descriptions = {
    "The Clean Knife": "You kept execution relatively disciplined.",
    "The Spread Reader": "You repeatedly found value in conversion and price differences.",
    "The Whale": "You forced outcomes by paying heavily.",
    "The Defector": "You used misrepresentation as a market tool.",
    "The Information Broker": "You turned private knowledge into a tradable asset.",
    "The Patient Observer": "You spent meaningful time learning the people around the market.",
  };
  return { name, description: descriptions[name] };
}
