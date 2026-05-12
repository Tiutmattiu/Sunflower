import React, { useState } from "react";
import "./index.css";

const SARDINE = "🥫";

const ITEMS = {
  "Blue Glass Marble": { value: 3, icon: "🔵", type: "Blue" },
  "Dead Pigeon": { value: 3, icon: "🐦", type: "Catalyst" },
  "Collar Tag": { value: 3, icon: "🏷️", type: "Access" },
  "Chewed Rope Toy": { value: 1, icon: "🧸", type: "Liquid" },

  "Fresh Mackerel": { value: 4, icon: "🐟", type: "Soup Fish", perishable: true },
  "Orgeat Bottle": { value: 7, icon: "🥛", type: "Ingredient" },
  "Steel Rim": { value: 5, icon: "⭕", type: "Machine Part" },
  "Rusty Harpoon": { value: 6, icon: "🗡️", type: "Weapon" },

  "Sperm Whale Oil": { value: 6, icon: "🛢️", type: "Fuel" },
  "Salted Cod": { value: 4, icon: "🐡", type: "Soup Fish", perishable: true },
  "Hardtack Tin": { value: 2, icon: "🍞", type: "Liquid" },
  "Brass Compass": { value: 5, icon: "🧭", type: "High Value" },

  "Valentino Still": { value: 5, icon: "🎞️", type: "Prestige" },
  "Hand Mirror": { value: 3, icon: "🪞", type: "Prestige" },
  "Velvet Sleeve": { value: 2, icon: "🧤", type: "Liquid" },
  "Auction Sunflower": { value: 16, icon: "🌻", type: "Auction Goal" },
  "Auction Onewheel": { value: 8, icon: "🛞", type: "Vehicle" },

  "Lollipop": { value: 1, icon: "🍭", type: "Liquid" },
  "Glitter Tape": { value: 2, icon: "✨", type: "Liquid" },
  "Tool Roll": { value: 3, icon: "🧰", type: "Tool" },
  "Lucky Sticker": { value: 1, icon: "⭐", type: "Liquid" },

  "Rum Bottle": { value: 4, icon: "🍾", type: "Drink" },
  "Bruised Mint": { value: 1, icon: "🌿", type: "Liquid" },
  "Cracked Shaker": { value: 2, icon: "🥤", type: "Liquid" },
  "Lime Crate": { value: 4, icon: "🍋", type: "Citrus" },
  "Mai Tai": { value: 8, icon: "🍹", type: "Drink / Goal" },

  "Bad Tangerine": { value: 1, icon: "🍊", type: "Toxic" },
  "Tin Spoon": { value: 1, icon: "🥄", type: "Liquid" },
  "Old Coupon": { value: 2, icon: "🎟️", type: "Liquid" },
  "Pocket Match": { value: 1, icon: "🔥", type: "Liquid" },

  "Fish Bones": { value: 2, icon: "🦴", type: "Junk" },
  "Built Onewheel": { value: 8, icon: "🛞", type: "Vehicle" },
  "Spoiled Fish": { value: 1, icon: "🐟", type: "Waste" },
  Sunflower: { value: 99, icon: "🌻", type: "Goal" },
};

const INITIAL_TRADERS = {
  dog: {
    id: "dog", name: "Dock Dog", icon: "🐕", role: "Dock scavenger",
    need: "Fish Bones", exactWant: "Fish Bones", sardines: 3,
    inventory: ["Blue Glass Marble", "Dead Pigeon", "Collar Tag", "Chewed Rope Toy"],
  },
  fishmonger: {
    id: "fishmonger", name: "Fishmonger", icon: "🐠", role: "Commodity broker",
    need: "Dead Pigeon", exactWant: "Dead Pigeon", sardines: 3,
    inventory: ["Fresh Mackerel", "Orgeat Bottle", "Steel Rim", "Rusty Harpoon"],
  },
  mechanic: {
    id: "mechanic", name: "Ship Mechanic", icon: "⚙️", role: "Ship mechanic",
    need: "Lime Crate", exactWant: "Lime Crate", sardines: 3,
    inventory: ["Sperm Whale Oil", "Salted Cod", "Hardtack Tin", "Brass Compass"],
  },
  vale: {
    id: "vale", name: "Mirelle Vale", icon: "🎬", role: "Auction host",
    need: "Sperm Whale Oil", exactWant: "Sperm Whale Oil", sardines: 5,
    inventory: ["Valentino Still", "Hand Mirror", "Velvet Sleeve"],
  },
  clown: {
    id: "clown", name: "Onewheel Clown", icon: "🤡", role: "Shortcut racer",
    need: "Mai Tai", exactWant: "Mai Tai", sardines: 4,
    inventory: ["Lollipop", "Glitter Tape", "Tool Roll", "Lucky Sticker"],
  },
  bar: {
    id: "bar", name: "Bar Apprentice", icon: "🍸", role: "Cocktail apprentice",
    need: "Orgeat Bottle", exactWant: "Orgeat Bottle", sardines: 4,
    inventory: ["Rum Bottle", "Bruised Mint", "Cracked Shaker", "Lime Crate"],
  },
  player: {
    id: "player", name: "You", icon: "🧍", role: "Market trader",
    need: "Sunflower", exactWant: "Sunflower", sardines: 6,
    inventory: ["Fish Bones", "Bad Tangerine", "Tin Spoon", "Old Coupon"],
  },
};

const SOUP_FISH = ["Fresh Mackerel", "Salted Cod"];

// NPC preferences (weighted categories for more sensible market behavior)
const NPC_PREFERENCES = {
  dog: ["Junk", "Catalyst", "Access"],
  fishmonger: ["Soup Fish", "Catalyst", "Weapon", "High Value"],
  mechanic: ["Citrus", "Machine Part", "Tool", "High Value"],
  vale: ["Fuel", "Prestige", "Blue", "High Value"],
  clown: ["Drink / Goal", "Vehicle", "Liquid"],
  bar: ["Ingredient", "Drink", "Citrus"],
};

/* ---------- utilities ---------- */
const unique = (arr) => [...new Set(arr)];
const clone = (x) => JSON.parse(JSON.stringify(x));
const valueOf = (item) => (item ? ITEMS[item]?.value || 0 : 0);
const label = (item) =>
  item ? `${ITEMS[item]?.icon || "📦"} ${item} · ${ITEMS[item]?.value ?? 0}` : "nothing";
const labelShort = (item) =>
  item ? `${ITEMS[item]?.icon || "📦"} ${item}` : "nothing";
const netWorth = (t) =>
  t.sardines + t.inventory.reduce((s, i) => s + valueOf(i), 0);

const reservePrice = (target, item, heat, flags) => {
  let price = valueOf(item);
  if (item === target.exactWant && !(target.id === "mechanic" && flags.cheated)) price += 2;
  price += heat[item] || 0;
  return price;
};

const canAfford = (actor, offerItem, sardines) =>
  actor.sardines >= sardines && (!offerItem || actor.inventory.includes(offerItem));

function buildGame() {
  return {
    round: 1, maxRounds: 14,
    traders: clone(INITIAL_TRADERS),
    selected: "player",
    offers: [
      { to: "", wantItem: "", offerItem: "", sardines: 0 },
      { to: "", wantItem: "", offerItem: "", sardines: 0 },
      { to: "", wantItem: "", offerItem: "", sardines: 0 },
    ],
    npcIntent: [],
    outcome: [], rejected: [], pendingEvents: [],
    ended: false, winner: false, finalText: "", style: null,
    flags: {
      orgeatDelivered: false, oilDeliveredToVale: false,
      limeDeliveredToMechanic: false, steelDeliveredToMechanic: false,
      toolDeliveredToMechanic: false, oneWheelBuilt: false,
      cheated: false, raced: false,
    },
    stats: {
      exactDeliveries: 0, profitableFlips: 0,
      overpays: 0, totalProfit: 0, tradeCount: 0,
    },
    heat: {},
    perishTimer: {},
    log: [
      "The sunflower is not for sale.",
      "Routes: Grandma Supper, Vale Auction, Cliff Race.",
      "Blue Glass Marble only from Dock Dog; NPCs don't trade it.",
    ],
  };
}

/* ---------- NPC AI ---------- */
function generateNPCOffers(game) {
  const npcs = Object.values(game.traders).filter((t) => t.id !== "player");
  const offers = [];
  npcs.forEach((npc) => {
    const targets = npcs
      .filter((t) => t.id !== npc.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 1 + Math.floor(Math.random() * 2));
    targets.forEach((target) => {
      if (!target.inventory.length) return;
      const prefs = NPC_PREFERENCES[npc.id] || [];
      const preferred = target.inventory.filter((i) => prefs.includes(ITEMS[i]?.type));
      const pool = preferred.length ? preferred : target.inventory;
      // Exclude Blue Glass Marble from NPC wants
      const wantItem = pool.filter((i) => i !== "Blue Glass Marble")[0] || pool[0];
      if (!wantItem) return;
      const useItem = Math.random() < 0.7 && npc.inventory.length > 0;
      const offerItem = useItem
        ? npc.inventory.filter((i) => i !== "Blue Glass Marble")[
            Math.floor(Math.random() * npc.inventory.filter((i) => i !== "Blue Glass Marble").length)
          ]
        : null;
      const sardines = useItem ? 0 : Math.floor(Math.random() * 3) + 1;
      if (!offerItem && sardines <= 0) return;
      if (offerItem === wantItem) return;
      if (!canAfford(npc, offerItem, sardines)) return;
      offers.push({ from: npc.id, to: target.id, wantItem, offerItem, sardines });
    });
  });
  return offers;
}

function applyNPCTrades(game, npcOffers) {
  const g = clone(game);
  const usedPayment = new Set();
  npcOffers.forEach((o) => {
    const from = g.traders[o.from];
    const to = g.traders[o.to];
    if (!to.inventory.includes(o.wantItem)) return;
    if (!canAfford(from, o.offerItem, o.sardines)) return;
    if (o.offerItem && usedPayment.has(o.offerItem)) return;
    // Block any movement of Blue Glass Marble
    if (o.offerItem === "Blue Glass Marble" || o.wantItem === "Blue Glass Marble") return;
    const price = valueOf(o.wantItem) + (g.heat[o.wantItem] || 0);
    const paid = valueOf(o.offerItem) + o.sardines;
    if (paid < price) return;
    if (o.offerItem) {
      from.inventory = from.inventory.filter((x) => x !== o.offerItem);
      to.inventory.push(o.offerItem);
      usedPayment.add(o.offerItem);
    }
    if (o.sardines > 0) {
      from.sardines -= o.sardines;
      to.sardines += o.sardines;
    }
    to.inventory = to.inventory.filter((x) => x !== o.wantItem);
    from.inventory.push(o.wantItem);
  });
  return g;
}

/* ---------- Player trade resolution ---------- */
function applySpecialRules(game, accepted) {
  const g = clone(game);
  accepted.forEach((t) => {
    if (t.from !== "player") return;
    const target = g.traders[t.to];
    const profit = valueOf(t.wantItem) - valueOf(t.offerItem) - Number(t.sardines || 0);
    g.stats.totalProfit += profit;
    if (profit >= 2) g.stats.profitableFlips += 1;
    if (profit <= -3) g.stats.overpays += 1;
    g.stats.tradeCount += 1;

    // Cheat detection (Bad Tangerine -> Mechanic claiming Lime Crate)
    if (t.to === "mechanic" && t.offerItem === "Bad Tangerine" && target.exactWant === "Lime Crate") {
      g.flags.cheated = true;
      g.log.unshift("Bad Tangerine passed as Lime Crate — word spreads. Reputation ruined.");
      g.stats.exactDeliveries += 1; // still counts as successful delivery (fraud)
      return;
    }

    if (t.offerItem === target.exactWant) {
      g.stats.exactDeliveries += 1;
    }

    if (t.to === "bar" && t.offerItem === "Orgeat Bottle") {
      g.flags.orgeatDelivered = true;
      if (!g.traders.bar.inventory.includes("Mai Tai")) {
        g.traders.bar.inventory.push("Mai Tai");
        g.log.unshift("Bar Apprentice added Mai Tai.");
      }
    }
    if (t.to === "vale" && t.offerItem === "Sperm Whale Oil") {
      g.flags.oilDeliveredToVale = true;
      if (!g.traders.vale.inventory.includes("Auction Sunflower"))
        g.traders.vale.inventory.push("Auction Sunflower");
      if (!g.traders.vale.inventory.includes("Auction Onewheel"))
        g.traders.vale.inventory.push("Auction Onewheel");
      g.log.unshift("Vale opened auction lots.");
    }
    if (t.to === "mechanic" && !g.flags.cheated) {
      if (t.offerItem === "Lime Crate") {
        g.flags.limeDeliveredToMechanic = true;
        g.log.unshift("Ship Mechanic received citrus for crew health.");
      }
      if (t.offerItem === "Steel Rim") g.flags.steelDeliveredToMechanic = true;
      if (t.offerItem === "Tool Roll") g.flags.toolDeliveredToMechanic = true;
      if (
        g.flags.limeDeliveredToMechanic &&
        g.flags.steelDeliveredToMechanic &&
        g.flags.toolDeliveredToMechanic &&
        !g.flags.oneWheelBuilt
      ) {
        g.flags.oneWheelBuilt = true;
        // Remove materials used
        const mech = g.traders.mechanic;
        mech.inventory = mech.inventory.filter(
          (x) => x !== "Steel Rim" && x !== "Tool Roll"
        );
        mech.inventory.push("Built Onewheel");
        g.log.unshift("Ship Mechanic used Steel Rim & Tool Roll to build Built Onewheel.");
      }
    }
  });
  return g;
}

function resolvePlayerOffers(game) {
  let g = clone(game);
  const accepted = [];
  const rejected = [];
  const usedPayment = new Set();
  const valid = g.offers
    .filter((o) => o.to && o.wantItem)
    .map((o) => ({
      from: "player", to: o.to, wantItem: o.wantItem,
      offerItem: o.offerItem || null, sardines: Number(o.sardines || 0),
    }));

  for (const offer of valid) {
    const player = g.traders.player;
    const target = g.traders[offer.to];
    if (!target.inventory.includes(offer.wantItem)) {
      rejected.push({ ...offer, reason: "Target no longer has that item." }); continue;
    }
    if (!canAfford(player, offer.offerItem, offer.sardines)) {
      rejected.push({ ...offer, reason: "You cannot pay that offer." }); continue;
    }
    if (offer.offerItem && usedPayment.has(offer.offerItem)) {
      rejected.push({ ...offer, reason: "Payment item already used." }); continue;
    }

    const isCheat = offer.to === "mechanic" && offer.offerItem === "Bad Tangerine" && target.exactWant === "Lime Crate";
    let exact = offer.offerItem === target.exactWant;
    if (isCheat) exact = true;
    else if (g.flags.cheated && offer.to === "mechanic") exact = false;

    const price = reservePrice(target, offer.wantItem, g.heat, g.flags);
    const paid = valueOf(offer.offerItem) + offer.sardines;
    if (!exact && paid < price) {
      rejected.push({
        ...offer,
        reason: `${target.name} wants at least value ${price} for ${labelShort(offer.wantItem)}.`,
      });
      continue;
    }

    if (offer.offerItem) {
      player.inventory = player.inventory.filter((x) => x !== offer.offerItem);
      target.inventory.push(offer.offerItem);
      usedPayment.add(offer.offerItem);
    }
    if (offer.sardines > 0) {
      player.sardines -= offer.sardines;
      target.sardines += offer.sardines;
    }
    target.inventory = target.inventory.filter((x) => x !== offer.wantItem);
    player.inventory.push(offer.wantItem);
    accepted.push({ ...offer, exact, profit: valueOf(offer.wantItem) - valueOf(offer.offerItem) - offer.sardines });
  }
  g.outcome = accepted;
  g.rejected = rejected;
  g = applySpecialRules(g, accepted);
  return g;
}

/* ---------- Heat & Perish ---------- */
function updateHeat(game, npcOffers) {
  const nextHeat = { ...game.heat };
  const wanted = npcOffers.map((o) => o.wantItem);
  const uniqueWanted = [...new Set(wanted)];
  uniqueWanted.forEach((item) => {
    nextHeat[item] = Math.min(5, (nextHeat[item] || 0) + 1);
  });
  Object.keys(nextHeat).forEach((item) => {
    if (!uniqueWanted.includes(item)) nextHeat[item] = Math.max(0, nextHeat[item] - 1);
  });
  return nextHeat;
}

function applyPerish(game) {
  const g = clone(game);
  const p = g.traders.player;
  const timer = { ...g.perishTimer };
  // Remove timers for items no longer in inventory
  Object.keys(timer).forEach((item) => {
    if (!p.inventory.includes(item)) delete timer[item];
  });
  // Spoil first (>=2 full rounds held), then increment
  p.inventory = p.inventory.filter((item) => {
    if (ITEMS[item]?.perishable && timer[item] >= 2) {
      if (!p.inventory.includes("Spoiled Fish")) p.inventory.push("Spoiled Fish");
      g.log.unshift(`${labelShort(item)} spoiled.`);
      delete timer[item];
      return false;
    }
    return true;
  });
  // Increment timer for remaining perishables
  p.inventory.forEach((item) => {
    if (ITEMS[item]?.perishable) {
      timer[item] = (timer[item] || 0) + 1;
    }
  });
  g.perishTimer = timer;
  return g;
}

/* ---------- Events ---------- */
function buildEvents(game) {
  if (game.ended) return [];
  const p = game.traders.player;
  const events = [];
  // Grandma
  if (
    !game.flags.cheated &&
    game.flags.orgeatDelivered &&
    p.inventory.includes("Mai Tai") &&
    p.inventory.some((x) => SOUP_FISH.includes(x) && x !== "Spoiled Fish")
  ) {
    events.push({
      id: "grandma", title: "Grandma Supper",
      text: "Bar Apprentice: “Bring the fish and the Mai Tai. Grandmother will love it.”",
      actions: ["Go to Grandma Supper", "Stay"],
    });
  }
  // Auction
  const auctionNW = game.flags.cheated ? 22 : 18;
  if (
    game.flags.oilDeliveredToVale &&
    netWorth(p) >= auctionNW &&
    p.inventory.includes("Blue Glass Marble")
  ) {
    events.push({
      id: "auction", title: "Vale Auction",
      text: `Vale: “Auction open. Minimum bid for sunflower: ${game.flags.cheated ? 20 : 16} sardines.”`,
      actions: ["Enter Auction", "Stay"],
    });
  }
  // Cliff Race
  if (
    !game.flags.raced &&
    (p.inventory.includes("Built Onewheel") || p.inventory.includes("Auction Onewheel")) &&
    p.inventory.includes("Mai Tai") &&
    (p.sardines >= 6 || p.inventory.some((x) => valueOf(x) >= 6))
  ) {
    events.push({
      id: "cliff", title: "Cliff Race",
      text: "Clown: “Race me to the cliff. Winner sees the sunflower field.” (One attempt only)",
      actions: ["Race", "Decline"],
    });
  }
  // For now, only show the first available event each round to avoid choice overload
  return events.slice(0, 1);
}

function classify(game) {
  const s = game.stats;
  const scores = {
    "The Clean Knife": s.exactDeliveries * 4 - s.overpays,
    "The Spread Reader": s.profitableFlips * 5 + Math.max(0, s.totalProfit),
    "The Whale": s.overpays * 4,
    "The Bagholder": game.traders.player.inventory.includes("Bad Tangerine") ? 5 : 0,
    "The Defector": game.flags.cheated && s.totalProfit > 0 ? 10 : 0,
    "The Market Maker": s.tradeCount >= 6 ? 5 : 0,
  };
  const name = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const desc = {
    "The Clean Knife": "Precision deliveries, minimal waste.",
    "The Spread Reader": "Profited from asset conversion.",
    "The Whale": "Paid heavily to force outcomes.",
    "The Bagholder": "Held toxic assets too long.",
    "The Defector": "Cheated and survived the market's fury.",
    "The Market Maker": "High trade volume, liquidity provider.",
  };
  return { name, description: desc[name] || "Unknown" };
}

function processRound(next) {
  const npcOffers = generateNPCOffers(next);
  next.npcIntent = npcOffers.slice(0, 3);
  next = resolvePlayerOffers(next);
  next = applyNPCTrades(next, npcOffers);
  next.heat = updateHeat(next, npcOffers);
  next = applyPerish(next);
  next.pendingEvents = buildEvents(next);
  if (!next.pendingEvents.length) {
    next.round += 1;
    if (next.round > next.maxRounds) {
      next.ended = true; next.winner = false;
      next.finalText = "The market closes. The sunflower remains out of reach.";
      next.style = classify(next);
    }
  }
  next.log.unshift(`Round ${next.round} resolved.`);
  return next;
}

/* ---------- Components ---------- */
function Avatar({ trader, selected, onClick }) {
  return (
    <button className={`avatar ${selected ? "selected" : ""}`} onClick={onClick}>
      <div className="avatar-icon">{trader.icon}</div>
      <div className="avatar-name">{trader.name}</div>
      <div className="avatar-money">{SARDINE} {trader.sardines}</div>
    </button>
  );
}

function TraderDetail({ trader }) {
  return (
    <div className="card detail-card">
      <div className="detail-head">
        <div className="big-icon">{trader.icon}</div>
        <div>
          <h2>{trader.name}</h2>
          <div className="muted">Role: {trader.role}</div>
          <div className="muted">Need: {trader.need}</div>
          <div className="muted">Sardines: {SARDINE} {trader.sardines}</div>
        </div>
      </div>
      <div className="section-title">Inventory</div>
      <div className="chips">
        {trader.inventory.length
          ? trader.inventory.map((item) => (
              <span className="chip" key={`${trader.id}-${item}`}>{label(item)}</span>
            ))
          : <span className="muted">No items</span>}
      </div>
    </div>
  );
}

function OfferRow({ index, offer, setOffer, traders, usedItems, playerInventory }) {
  const target = traders[offer.to];
  return (
    <div className="offer-row">
      <select value={offer.to} onChange={(e) => setOffer(index, { to: e.target.value, wantItem: "", offerItem: "", sardines: 0 })}>
        <option value="">Target</option>
        {Object.values(traders).filter((t) => t.id !== "player").map((t) => (
          <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
        ))}
      </select>
      <select value={offer.wantItem} onChange={(e) => setOffer(index, { ...offer, wantItem: e.target.value })}>
        <option value="">Want item</option>
        {target?.inventory.map((item) => <option key={item} value={item}>{label(item)}</option>)}
      </select>
      <select value={offer.offerItem} onChange={(e) => setOffer(index, { ...offer, offerItem: e.target.value })}>
        <option value="">Offer no item</option>
        {playerInventory.filter((i) => !usedItems.includes(i) || i === offer.offerItem).map((i) => (
          <option key={i} value={i}>{label(i)}</option>
        ))}
      </select>
      <input type="number" min="0" value={offer.sardines}
        onChange={(e) => setOffer(index, { ...offer, sardines: Math.max(0, Number(e.target.value || 0)) })} />
    </div>
  );
}

function RouteBoard({ game }) {
  const p = game.traders.player;
  const cheated = game.flags.cheated;
  return (
    <div className="card">
      <div className="section-title">Route Board</div>
      <div className="route">
        <strong>Grandma Supper</strong>
        <div>{game.flags.orgeatDelivered ? "✓" : "□"} Orgeat delivered</div>
        <div>{p.inventory.includes("Mai Tai") ? "✓" : "□"} Mai Tai held</div>
        <div>{
          p.inventory.some((x) => SOUP_FISH.includes(x) && x !== "Spoiled Fish") ? "✓" : "□"
        } Soup fish held</div>
        {cheated && <div className="muted">❌ Closed (cheat)</div>}
      </div>
      <div className="route">
        <strong>Vale Auction</strong>
        <div>{game.flags.oilDeliveredToVale ? "✓" : "□"} Oil delivered</div>
        <div>{netWorth(p) >= (cheated ? 22 : 18) ? "✓" : "□"} Net Worth ≥ {cheated ? 22 : 18}</div>
        <div>{p.inventory.includes("Blue Glass Marble") ? "✓" : "□"} Blue Glass Marble held</div>
        <div className="small">Min bid: {cheated ? 20 : 16} 🥫</div>
      </div>
      <div className="route">
        <strong>Cliff Race</strong>
        <div>{(p.inventory.includes("Built Onewheel") || p.inventory.includes("Auction Onewheel")) ? "✓" : "□"} Onewheel held</div>
        <div>{p.inventory.includes("Mai Tai") ? "✓" : "□"} Mai Tai held</div>
        <div>{p.sardines >= 6 || p.inventory.some((x) => valueOf(x) >= 6) ? "✓" : "□"} Stake available</div>
        <div>{game.flags.raced ? "❌ Already raced" : "✓ Available"}</div>
      </div>
      <div className="route">
        <strong>Ship Mechanic Production</strong>
        <div>{game.flags.limeDeliveredToMechanic ? "✓" : "□"} Lime Crate delivered</div>
        <div>{game.flags.steelDeliveredToMechanic ? "✓" : "□"} Steel Rim delivered</div>
        <div>{game.flags.toolDeliveredToMechanic ? "✓" : "□"} Tool Roll delivered</div>
        <div>{game.flags.oneWheelBuilt ? "✓" : "□"} Onewheel built</div>
        {cheated && <div className="muted">❌ Mechanic refuses (cheat)</div>}
      </div>
    </div>
  );
}

function EventPanel({ game, onChoose }) {
  if (!game.pendingEvents.length) return null;
  return (
    <div className="event-box">
      <h2>Route available</h2>
      {game.pendingEvents.map((ev) => (
        <div className="event-card" key={ev.id}>
          <h3>{ev.title}</h3>
          <p>{ev.text}</p>
          <div className="event-actions">
            {ev.actions.map((a) => (
              <button className="btn gold" key={a} onClick={() => onChoose(ev.id, a)}>{a}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Main App ---------- */
export default function App() {
  const [game, setGame] = useState(() => {
    let g = buildGame();
    g.npcIntent = generateNPCOffers(g).slice(0, 3);
    return g;
  });

  const traders = game.traders;
  const player = traders.player;
  const selectedTrader = traders[game.selected] || player;
  const usedItems = game.offers.map((o) => o.offerItem).filter(Boolean);
  const plannedSardines = game.offers.reduce((s, o) => s + Number(o.sardines || 0), 0);

  function updateOffer(i, next) {
    const copy = [...game.offers];
    copy[i] = next;
    setGame({ ...game, offers: copy });
  }

  function restart() {
    let g = buildGame();
    g.npcIntent = generateNPCOffers(g).slice(0, 3);
    setGame(g);
  }

  function submitRound(pass = false) {
    if (game.ended || game.pendingEvents.length) return;
    if (!pass && plannedSardines > player.sardines) return alert("Too many sardines planned.");
    const chosen = game.offers.map((o) => o.offerItem).filter(Boolean);
    if (!pass && chosen.length !== unique(chosen).length) return alert("Cannot offer same item twice.");
    let next = clone(game);
    if (pass) next.offers = next.offers.map(() => ({ to: "", wantItem: "", offerItem: "", sardines: 0 }));
    next = processRound(next);
    next.offers = next.offers.map(() => ({ to: "", wantItem: "", offerItem: "", sardines: 0 }));
    setGame(next);
  }

  function chooseEvent(id, action) {
    let next = clone(game);
    const p = next.traders.player;

    if (id === "grandma" && action === "Go to Grandma Supper") {
      next.ended = true; next.winner = true;
      p.inventory.push("Sunflower");
      next.finalText = "You go after close with the fish and the Mai Tai. The grandmother gives you a sunflower from her vase.";
    }
    if (id === "auction" && action === "Enter Auction") {
      const reserve = next.flags.cheated ? 20 : 16;
      if (p.sardines < reserve) {
        alert(`You need at least ${reserve} sardines to bid.`);
        return;
      }
      const bid = prompt(`Auction reserve: ${reserve} sardines. How much do you bid? (You have ${p.sardines})`);
      const amount = Number(bid);
      if (!bid || amount < reserve || amount > p.sardines) {
        alert("Invalid bid. Auction lost.");
        if (p.sardines >= 10) {
          p.sardines -= 10;
          if (!p.inventory.includes("Auction Onewheel")) p.inventory.push("Auction Onewheel");
          next.log.unshift("Lost auction, bought Auction Onewheel for 10 sardines.");
        } else {
          next.log.unshift("Lost auction and couldn't afford the onewheel.");
        }
        next.pendingEvents = [];
        next.round += 1;
        setGame(next);
        return;
      }
      p.sardines -= amount;
      p.inventory.push("Sunflower");
      next.ended = true; next.winner = true;
      next.finalText = "Vale awards you the sunflower at auction.";
    }
    if (id === "cliff" && action === "Race") {
      next.flags.raced = true;
      p.inventory = p.inventory.filter((x) => x !== "Mai Tai");
      p.inventory = p.inventory.filter((x) => x !== "Built Onewheel" && x !== "Auction Onewheel");
      const won = Math.random() < (netWorth(p) >= 14 ? 0.75 : 0.55);
      if (won) {
        p.inventory.push("Sunflower");
        next.ended = true; next.winner = true;
        next.finalText = "You beat the clown through the cliff path. Sunflowers everywhere.";
      } else {
        if (p.sardines >= 6) p.sardines -= 6;
        else {
          const stake = p.inventory.find((x) => valueOf(x) >= 6);
          if (stake) p.inventory = p.inventory.filter((x) => x !== stake);
        }
        next.log.unshift("Lost the race. Mai Tai and onewheel gone.");
        next.pendingEvents = [];
        next.round += 1;
        setGame(next);
        return;
      }
    }
    if (!next.ended && (action === "Stay" || action === "Decline")) {
      next.pendingEvents = []; next.round += 1;
    }
    if (next.ended) next.style = classify(next);
    setGame(next);
  }

  return (
    <div className="app-shell">
      <div className="container">
        <header className="hero">
          <div>
            <h1>🌻 Sunflower Market</h1>
            <p>Click an avatar, read the whispers, then make up to 3 offers. You are the needle that moves this market.</p>
          </div>
          <div className="hero-actions">
            <button className="btn ghost" onClick={restart}>New Game</button>
            {!game.ended && !game.pendingEvents.length && (
              <>
                <button className="btn ghost" onClick={() => submitRound(true)}>Pass</button>
                <button className="btn gold" onClick={() => submitRound(false)}>Resolve</button>
              </>
            )}
          </div>
        </header>

        <div className="top-bar">
          <span className="pill">Round {game.round}/{game.maxRounds}</span>
          <span className="pill">{SARDINE} {player.sardines}</span>
          <span className="pill">Net Worth: {netWorth(player)}</span>
          {game.flags.cheated && <span className="pill bad">⚠ CHEAT</span>}
        </div>

        {game.ended && (
          <div className={`end-box ${game.winner ? "win-box" : "lose-box"}`}>
            <h2>{game.winner ? "🌻 You got the sunflower." : "Market closed."}</h2>
            <p>{game.finalText}</p>
            {game.style && (
              <div className="style-box">
                <h3>{game.style.name}</h3>
                <p>{game.style.description}</p>
              </div>
            )}
          </div>
        )}

        <EventPanel game={game} onChoose={chooseEvent} />

        <section className="main-layout">
          <div className="left-col">
            <div className="avatar-row">
              {Object.values(traders).map((t) => (
                <Avatar key={t.id} trader={t} selected={game.selected === t.id}
                  onClick={() => setGame({ ...game, selected: t.id })} />
              ))}
            </div>
            <TraderDetail trader={selectedTrader} />

            {!game.ended && !game.pendingEvents.length && (
              <>
                <div className="card">
                  <div className="section-title">Market whispers (first 3 NPCs)</div>
                  <div className="stack">
                    {game.npcIntent.length ? game.npcIntent.map((o, i) => (
                      <div className="mini-card" key={i}>
                        {traders[o.from]?.icon} {traders[o.from]?.name} wants {labelShort(o.wantItem)}
                        {o.offerItem ? ` for ${labelShort(o.offerItem)}` : ""}{o.sardines > 0 ? ` +${o.sardines}🥫` : ""}
                      </div>
                    )) : <div className="muted">No open calls yet.</div>}
                  </div>
                </div>
                <div className="card">
                  <div className="section-title">Your offers</div>
                  <div className="stack">
                    {game.offers.map((offer, i) => (
                      <OfferRow key={i} index={i} offer={offer} setOffer={updateOffer}
                        traders={traders} usedItems={usedItems.filter((_, idx) => idx !== i)}
                        playerInventory={player.inventory} />
                    ))}
                  </div>
                  <div className="small muted">Planned sardines: {SARDINE} {plannedSardines} / {player.sardines}</div>
                </div>
              </>
            )}

            <div className="card">
              <div className="section-title">Round outcome</div>
              <div className="stack">
                {game.outcome.length ? game.outcome.map((o, i) => (
                  <div className="mini-card" key={i}>
                    {traders[o.from].icon} {traders[o.from].name} took {labelShort(o.wantItem)} from{" "}
                    {traders[o.to].icon} {traders[o.to].name}
                  </div>
                )) : <div className="muted">No round resolved yet.</div>}
              </div>
            </div>
            <div className="card">
              <div className="section-title">Failed bids</div>
              <div className="stack">
                {game.rejected.length ? game.rejected.map((r, i) => (
                  <div className="mini-card" key={i}>
                    Wanted {labelShort(r.wantItem)} from {traders[r.to]?.name}
                    <div className="muted small">{r.reason}</div>
                  </div>
                )) : <div className="muted">No failed bids yet.</div>}
              </div>
            </div>
          </div>

          <div className="right-col">
            <RouteBoard game={game} />
            <div className="card">
              <div className="section-title">Market Diagnosis</div>
              <div className="diagnosis">
                <div>Exact deliveries: {game.stats.exactDeliveries}</div>
                <div>Profitable flips: {game.stats.profitableFlips}</div>
                <div>Overpays: {game.stats.overpays}</div>
                <div>Trades made: {game.stats.tradeCount}</div>
                <div>Net hidden profit: {game.stats.totalProfit}</div>
              </div>
            </div>
            <div className="card">
              <div className="section-title">Market Heat</div>
              <div className="stack">
                {Object.entries(game.heat).map(([item, h]) => (
                  <div key={item} className="mini-card">{labelShort(item)} · Heat {h}</div>
                ))}
                {!Object.keys(game.heat).length && <div className="muted">No heat yet.</div>}
              </div>
            </div>
            <div className="card log-card">
              <div className="section-title">Log</div>
              <div className="log-stack">
                {game.log.map((line, i) => <div className="log-line" key={i}>{line}</div>)}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
