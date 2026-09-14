import { knows, learn, PLAYER_KNOWLEDGE as KNOWLEDGE } from './playerKnowledge.js';
import { selectDialogueBeat } from './dialogueContent.js';
import { ECONOMIC_GOODS as GOODS } from './economicContent.js';
import {
  availableProductionActions,
  collectHiddenToad,
  performProductionAction,
  recordDiscoveredMisconduct,
  useToad,
} from './productionGame.js';

const clone = x => structuredClone(x);
const ROUTES = ['sonya', 'yasmin', 'juan'];
const ONEWHEEL_CORE = ['Steel Rim', 'Chain Quick-Link', 'Brake Cable'];
const ONEWHEEL_FINISH = ['Presta Inner Tube', 'Handlebar Tape'];
const ONEWHEEL_PARTS = [
  ['Steel Rim', 5, 4],
  ['Chain Quick-Link', 2, 2],
  ['Brake Cable', 2, 3],
  ['Handlebar Tape', 2, 5],
];

const ACTION_KNOWLEDGE = {
  source_orgeat: KNOWLEDGE.mai_tai_ingredient,
  joel_supply_orgeat: KNOWLEDGE.mai_tai_ingredient,
  joel_serve_juan: KNOWLEDGE.mai_tai_supplied,
  juan_explain_goal: KNOWLEDGE.juan_bar_drink,
  juan_race_offer: KNOWLEDGE.juan_goal_explained,
  aspen_onewheel_plan: KNOWLEDGE.juan_route,
  buy_part: KNOWLEDGE.onewheel_plan,
  assemble_onewheel: KNOWLEDGE.onewheel_plan,
  practice_onewheel: KNOWLEDGE.juan_route,
  race_juan: KNOWLEDGE.juan_route,
};
const actionKnown = (w, id) => !ACTION_KNOWLEDGE[id] || knows(w, ACTION_KNOWLEDGE[id]);

export const LOCATIONS = {
  workbench: { name: 'Your workbench', description: 'Read, compare and commit without pretending the harbour waits.' },
  harbour_berth: { name: 'Harbour berth', description: 'Aspen, crews, cargo and short deliveries pass through here.' },
  joels_bar: { name: "Joel's Bar", description: 'A social room and a finite operating business.' },
  parcel_counter: { name: "Wong's counter", description: 'Ordinary custody, packing and handoff.' },
  nursery: { name: "Juan's nursery", description: 'Living productive assets, compost and unfinished plans.' },
  viewing_room: { name: "Yasmin's viewing room", description: 'Inspection, provenance and private capital.' },
  back_room: { name: "Dima's back room", description: 'Costly private execution, guarantees, and claim settlement.' },
  sonyas_kitchen: { name: "Sonya's kitchen", description: 'Hospitality is work, but it is not merely a transaction.' },
  cliff_path: { name: 'Cliff path', description: 'A difficult approach above the water.' },
  public_clearing: { name: 'Octopus', description: 'Public bids, asks, payments, local market data and settlement evidence.' },
};

export const PLAYER_COUNTERPARTIES = {
  mai_tai_taste: 'joel',
  mai_tai_check_shelf: 'joel',
  joel_hear_supper: 'joel',
  joel_supply_orgeat: 'joel',
  joel_serve_juan: 'joel',
  joel_patronage: 'joel',
  joel_help: 'joel',
  joel_invitation: 'joel',
  juan_explain_goal: 'juan',
  juan_race_offer: 'juan',
  race_juan: 'juan',
  repay_race_drinks: 'joel',
  aspen_onewheel_plan: 'aspen',
  assemble_onewheel: 'aspen',
  operate_inspection: 'aspen',
  lime_accept: 'aspen',
  lime_deliver: 'aspen',
  lime_refuse: 'aspen',
  invest_nursery: 'juan',
  finance_receivable: 'juan',
  auction_preview: 'yasmin',
  auction_inspect: 'yasmin',
  auction_finance: 'yasmin',
  auction_bid: 'yasmin',
  private_proxy: 'dima',
  speculate_lot: 'yasmin',
  intermediate_lead: 'joel',
};

const processAxes = ['valuation', 'execution', 'commitments', 'liquidityCredit', 'information', 'verificationAdaptation', 'positioningStress', 'marketStructure'];

function note(w, type, summary, data = {}) {
  const id = `player-${++w.nextEvent}`;
  const row = {
    id,
    day: w.day,
    type,
    summary,
    source: data.source || 'local_observation',
    location: data.location || w.playerGame.location,
    confidence: data.confidence ?? 1,
    freshness: 'current',
    people: data.people || [],
    goods: data.goods || [],
    claims: data.claims || [],
    situation: data.situation || null,
    process: data.process || {},
    style: data.style || {},
    returnClass: data.returnClass || null,
    weight: data.weight || 1,
    context: {
      cash: w.actors.player.cash,
      reserved: w.market.reservations.filter(r => r.actorId === 'player'),
      commitments: w.playerGame.commitments.filter(x => x.status === 'open'),
      alternatives: data.alternatives || [],
      ...data.context,
    },
  };
  w.evidence.push(row);
  w.playerGame.notebook.push(id);
  if (data.returnClass) w.playerGame.returnFootprint[data.returnClass] = (w.playerGame.returnFootprint[data.returnClass] || 0) + (data.value || 1);
  return row;
}

function spendAttention(w, n = 1) {
  if (w.attention.used + n > w.attention.budget) {
    w.playerGame.lastBlock = 'Not enough attention remains for this intervention.';
    return false;
  }
  w.attention.used += n;
  return true;
}

function addUnit(w, kind, owner = 'player', source = 'route_trade') {
  const u = {
    unitId: `u${++w.nextUnit}`,
    kind,
    owner,
    age: 0,
    costBasis: GOODS[kind]?.value || 0,
    source,
    opened: false,
    remaining: GOODS[kind]?.servings || 1,
  };
  w.actors[owner].inventory.push(u);
  return u;
}

function playerAvailableCash(w) {
  const locked = w.market.reservations
    .filter(r => r.actorId === 'player' && r.kind === 'cash')
    .reduce((n, r) => n + r.amount, 0)
    + w.playerGame.commitments.filter(c => c.status === 'open').reduce((n, c) => n + (c.lockedCash || 0), 0);
  return w.actors.player.cash - locked;
}

function availableUnits(w, actorId = 'player') {
  const reserved = new Set(w.market.reservations.filter(r => r.actorId === actorId && r.kind === 'unit').map(r => r.unitId));
  return w.actors[actorId].inventory.filter(u => !reserved.has(u.unitId) && !u.pledgedTo);
}

function pay(w, to, amount) {
  const p = w.actors.player;
  if (playerAvailableCash(w) - amount < 0) {
    w.playerGame.lastBlock = `Not enough available cash: ${amount}🥫 required.`;
    return false;
  }
  p.cash -= amount;
  if (w.actors[to]) w.actors[to].cash += amount;
  return true;
}

function buyGood(w, kind, price, seller = 'wharf_suppliers', { allowImport = true } = {}) {
  if (!spendAttention(w) || !pay(w, seller, price)) return false;
  let u = w.actors[seller]?.inventory.find(x => x.kind === kind);
  if (u) {
    w.actors[seller].inventory.splice(w.actors[seller].inventory.indexOf(u), 1);
  } else if (allowImport && w.actors[seller]) {
    u = addUnit(w, kind, seller, 'finite_route_import');
    w.actors[seller].inventory.pop();
  } else {
    w.playerGame.lastBlock = `${kind} is not physically available from this source.`;
    return false;
  }
  u.owner = 'player';
  u.costBasis = price;
  w.actors.player.inventory.push(u);
  note(w, 'private_purchase', `Bought ${kind} from ${seller} for ${price}🥫.`, {
    people: [seller], goods: [kind], returnClass: 'TRADE', value: price,
    process: { valuation: .2, execution: .5, liquidityCredit: .2 },
    style: { publicPrivate: .5, inventoryInformation: -.5 },
  });
  return true;
}

function grantFlower(w, route) {
  w.playerGame.sunflower = { owned: true, route };
  note(w, 'sunflower_received', `Received the Sunflower through the ${route} route.`, {
    situation: 'PYRRHIC_BLOOM', weight: 3,
    process: { commitments: .8, execution: .8 }, people: [route],
  });
}

export function initializePlayerGame(w) {
  w.attention.budget = w.config.attentionPerDay || 4;

  // Reconcile the historical starter inventory with the current Mai Tai route.
  // The existing physical Orgeat unit moves from Joel to the berth supplier; it is
  // not duplicated or minted, and Joel truly begins without the missing ingredient.
  const starterOrgeat = w.actors.joel?.inventory.find(x => x.kind === 'Orgeat');
  if (starterOrgeat && w.actors.wharf_suppliers) {
    w.actors.joel.inventory.splice(w.actors.joel.inventory.indexOf(starterOrgeat), 1);
    starterOrgeat.owner = 'wharf_suppliers';
    starterOrgeat.source = 'route_reconciled_initial';
    w.actors.wharf_suppliers.inventory.push(starterOrgeat);
  }

  w.playerGame = {
    location: 'harbour_berth',
    knowledge: [],
    notebook: [],
    commitments: [],
    missed: [],
    routes: {
      sonya: { stage: 'unseen', joelTrust: 0, orgeatSupplied: false, patronage: 0, helped: false, invitationDay: null, supperDay: null, rareFishUnitId: null },
      yasmin: { stage: 'unseen', preview: false, inspected: false, provenance: false, bid: null, resolved: false, auctionDay: 6, previewOpens: 2, previewCloses: 5 },
      juan: {
        stage: 'unseen',
        planDay: null,
        assembledDay: null,
        built: false,
        practice: 0,
        upgrades: 0,
        races: 0,
        lastRaceDay: null,
        drinkServed: false,
      },
    },
    lime: { stage: 'available', promised: 24, actual: 20, bruised: 3, inspected: false, representation: null },
    sunflower: { owned: false, route: null },
    home: false,
    lastBlock: null,
    startingCash: w.actors.player.cash,
    lowestCash: w.actors.player.cash,
    maxLocked: 0,
    returnFootprint: Object.fromEntries(['TRADE', 'OPERATE', 'INVEST', 'FINANCE', 'INTERMEDIATE', 'SPECULATE'].map(x => [x, 0])),
    interventions: [],
    opportunitiesSeen: 0,
  };
  return w;
}

function present(w, actor) {
  return w.actors[actor]?.location === w.playerGame.location
    || (actor === 'sonya' && ['joels_bar', 'sonyas_kitchen'].includes(w.playerGame.location));
}

export function visitLocation(current, location) {
  const w = clone(current);
  if (!LOCATIONS[location]) return w;
  if (w.playerGame.location === location) return w;
  const mobile = w.actors.player.inventory.some(x => x.kind === 'Built Onewheel');
  if (!mobile && !spendAttention(w)) return w;
  w.playerGame.location = location;
  w.actors.player.location = location;
  w.playerGame.lastBlock = null;
  w.playerGame.interventions.push({ day: w.day, type: 'travel', location });
  note(w, 'location_visited', `Visited ${LOCATIONS[location].name}.`, { location, process: { execution: .3 }, style: { patientAggressive: -.1 } });
  return w;
}

export function meetPerson(current, id) {
  const w = clone(current);
  if (!present(w, id)) {
    w.playerGame.lastBlock = `${id} is not present here.`;
    return w;
  }
  if (!w.actors.player.contacts.includes(id)) w.actors.player.contacts.push(id);
  if (ROUTES.includes(id) && w.playerGame.routes[id].stage === 'unseen') w.playerGame.routes[id].stage = 'met';
  note(w, 'person_met', `Met ${id} in person.`, { people: [id], process: { information: .3 }, style: { publicPrivate: .1 } });
  return w;
}

export function juanRaceChance(w) {
  const r = w.playerGame?.routes?.juan || {};
  const practice = Math.max(0, Math.min(4, r.practice || 0));
  const upgrades = Math.max(0, Math.min(4, r.upgrades || 0));
  return Math.min(.82, .32 + practice * .08 + upgrades * .07);
}

export function juanRaceRoll(w) {
  const races = w.playerGame?.routes?.juan?.races || 0;
  let h = (Number(w.seed || 0) ^ Math.imul((w.day || 0) + 17, 2654435761) ^ Math.imul(races + 1, 2246822519)) >>> 0;
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909) >>> 0;
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function barPeopleForRace(w) {
  const ids = new Set(
    Object.entries(w.actors)
      .filter(([id, a]) => id !== 'player' && !a.background && a.location === 'joels_bar')
      .map(([id]) => id)
  );
  const evening = w.relationshipEcology?.barEvenings?.find(x => x.day === w.day);
  for (const id of evening?.attendees || []) if (id !== 'player') ids.add(id);
  ids.add('joel');
  ids.add('juan');
  return [...ids];
}

function raceDrinksCommitment(w, amount) {
  const id = `juan-race-drinks-${w.day}-${w.playerGame.routes.juan.races}`;
  const c = {
    id,
    title: `Cover Joel's Bar drinks after losing Juan's race`,
    dueDay: w.day + 2,
    status: 'open',
    amountDue: amount,
    creditorId: 'joel',
    location: 'joels_bar',
  };
  w.playerGame.commitments.push(c);
  return c;
}

function applyPlayerAction(current, id, payload = {}) {
  const w = clone(current);
  w.playerGame.lastBlock = null;
  const r = w.playerGame.routes;
  const p = w.actors.player;

  const productionAction = availableProductionActions(w).find(a => a.id === id);
  if (productionAction) {
    if (productionAction.disabled) {
      w.playerGame.lastBlock = productionAction.reason;
      return w;
    }
    return performProductionAction(w, id);
  }
  if (id === 'collect_toad') return collectHiddenToad(w, payload.toadId);
  if (id === 'sell_toad' || id === 'invite_toad_circle') return useToad(w, id === 'sell_toad' ? 'sell' : 'invite', payload.target);
  if (id === 'meet') return meetPerson(w, payload.actor);

  if (id === 'talk_here') {
    const actor = payload.actor;
    if (!w.actors[actor] || !present(w, actor) || !p.contacts.includes(actor)) {
      w.playerGame.lastBlock = 'They are not present for this conversation.';
      return w;
    }
    if (!spendAttention(w)) return w;
    w.playerGame.encounters ??= {};
    const old = w.playerGame.encounters[actor];
    const beat = selectDialogueBeat(w, actor);
    w.playerGame.encounters[actor] = { count: (old?.count || 0) + 1, day: w.day, location: w.playerGame.location, lastBeat: beat.id, lines: beat.lines };
    note(w, 'harbour_conversation', 'Spent a little time talking.', { people: [actor], process: { information: .2 } });
    return w;
  }

  if (id === 'mai_tai_taste') {
    if (w.playerGame.location !== 'joels_bar' || !present(w, 'joel')) {
      w.playerGame.lastBlock = 'Joel has to be at the Bar to hand you the drink.';
      return w;
    }
    if (knows(w, KNOWLEDGE.mai_tai_tasted)) return w;
    if (!spendAttention(w)) return w;
    learn(w, KNOWLEDGE.mai_tai_tasted);
    learn(w, KNOWLEDGE.mai_tai_problem);
    note(w, 'mai_tai_tasted', 'Tasted Joel’s Mai Tai. It is drinkable, but the almond depth and finish are missing.', {
      people: ['joel'], process: { information: .7, verificationAdaptation: .4 }, weight: 2,
    });
    return w;
  }

  if (id === 'mai_tai_check_shelf') {
    if (w.playerGame.location !== 'joels_bar' || !knows(w, KNOWLEDGE.mai_tai_problem)) {
      w.playerGame.lastBlock = 'There is no reason yet to inspect the drink shelf that closely.';
      return w;
    }
    if (knows(w, KNOWLEDGE.mai_tai_ingredient)) return w;
    if (!spendAttention(w)) return w;
    learn(w, KNOWLEDGE.mai_tai_ingredient);
    note(w, 'mai_tai_ingredient_inferred', 'Compared the bottles and Joel’s old drink card; the empty almond-syrup slot identifies Orgeat without Joel assigning a shopping quest.', {
      people: ['joel'], goods: ['Orgeat'], process: { information: 1, verificationAdaptation: .8 }, weight: 2,
    });
    return w;
  }

  if (id === 'joel_hear_supper') {
    if (w.playerGame.location !== 'joels_bar') return w;
    if (!spendAttention(w)) return w;
    r.sonya.stage = 'known';
    r.sonya.joelTrust += 1;
    if (!p.contacts.includes('joel')) p.contacts.push('joel');
    note(w, 'joel_supper_context', 'Joel mentioned Sonya, borrowed chairs, and a family supper. No invitation was offered.', {
      people: ['joel'], process: { information: .7 }, style: { patientAggressive: -.4 },
    });
    return w;
  }

  if (id === 'source_orgeat') {
    if (!knows(w, KNOWLEDGE.mai_tai_ingredient)) {
      w.playerGame.lastBlock = 'You have not identified what the drink is missing.';
      return w;
    }
    if (w.playerGame.location !== 'harbour_berth' || !buyGood(w, 'Orgeat', 6, 'wharf_suppliers', { allowImport: false })) return w;
    return w;
  }

  if (id === 'joel_supply_orgeat') {
    const bottle = p.inventory.find(x => x.kind === 'Orgeat');
    if (!bottle || w.playerGame.location !== 'joels_bar') {
      w.playerGame.lastBlock = 'Bring the real Orgeat bottle to Joel at the Bar.';
      return w;
    }
    if (!spendAttention(w)) return w;
    p.inventory.splice(p.inventory.indexOf(bottle), 1);
    bottle.owner = 'joel';
    w.actors.joel.inventory.push(bottle);
    r.sonya.orgeatSupplied = true;
    r.sonya.joelTrust += 3;
    learn(w, KNOWLEDGE.mai_tai_supplied);
    note(w, 'mai_tai_supply', 'Supplied the missing Orgeat. Joel can now make the version of the Mai Tai he was trying to reach.', {
      people: ['joel'], goods: ['Orgeat'], returnClass: 'TRADE', weight: 2,
      process: { execution: .8, commitments: .6 },
    });
    return w;
  }

  if (id === 'joel_serve_juan') {
    if (!knows(w, KNOWLEDGE.mai_tai_supplied) || w.playerGame.location !== 'joels_bar' || w.actors.joel.location !== 'joels_bar' || w.actors.juan.location !== 'joels_bar') {
      w.playerGame.lastBlock = 'Joel and Juan must actually be together at the Bar after the drink is fixed.';
      return w;
    }
    if (knows(w, KNOWLEDGE.juan_bar_drink)) return w;
    if (!spendAttention(w)) return w;
    r.juan.drinkServed = true;
    r.juan.stage = 'bar_drink';
    learn(w, KNOWLEDGE.juan_bar_drink);
    note(w, 'juan_mai_tai_served', 'Joel served Juan the corrected Mai Tai while both were physically at the Bar.', {
      people: ['joel', 'juan'], goods: ['Orgeat'], process: { information: .5, commitments: .5 }, weight: 3,
    });
    return w;
  }

  if (id === 'juan_explain_goal') {
    if (!knows(w, KNOWLEDGE.juan_bar_drink) || w.playerGame.location !== 'joels_bar' || !present(w, 'juan')) {
      w.playerGame.lastBlock = 'The opening with Juan has not happened here.';
      return w;
    }
    if (knows(w, KNOWLEDGE.juan_goal_explained)) return w;
    if (!spendAttention(w)) return w;
    learn(w, KNOWLEDGE.juan_goal_explained);
    r.juan.stage = 'goal_explained';
    note(w, 'juan_goal_explained', 'You told Juan what you are trying to reach instead of asking him a pre-known route question.', {
      people: ['juan'], process: { information: .8 }, style: { directAmbiguous: -.8 }, weight: 2,
    });
    return w;
  }

  if (id === 'juan_race_offer') {
    if (!knows(w, KNOWLEDGE.juan_goal_explained) || w.playerGame.location !== 'joels_bar' || !present(w, 'juan')) {
      w.playerGame.lastBlock = 'Juan has not heard your goal here.';
      return w;
    }
    if (knows(w, KNOWLEDGE.juan_route)) return w;
    if (!spendAttention(w)) return w;
    learn(w, KNOWLEDGE.juan_route);
    r.juan.stage = 'wager';
    note(w, 'juan_race_wager', 'Juan offered a wager: beat him on one wheel and he will take you to the sunflower field; lose and you cover the Bar’s drinks for that day.', {
      people: ['juan'], situation: 'THE_PROMISE', weight: 3,
      process: { commitments: .8, information: .8, positioningStress: .4 },
    });
    return w;
  }

  if (id === 'aspen_onewheel_plan') {
    if (!knows(w, KNOWLEDGE.juan_route) || w.playerGame.location !== 'harbour_berth' || !present(w, 'aspen')) {
      w.playerGame.lastBlock = 'Aspen needs the actual race problem in front of her at the berth.';
      return w;
    }
    if (knows(w, KNOWLEDGE.onewheel_plan)) return w;
    if (!spendAttention(w)) return w;
    learn(w, KNOWLEDGE.onewheel_plan);
    r.juan.planDay = w.day;
    r.juan.stage = 'planning';
    note(w, 'onewheel_plan_earned', 'Aspen assessed the one-wheel problem and named the minimum compatible parts after hearing what the machine has to do.', {
      people: ['aspen'], goods: ONEWHEEL_CORE, process: { information: .8, execution: .7 }, weight: 2,
    });
    return w;
  }

  if (id === 'buy_part') {
    if (!knows(w, KNOWLEDGE.onewheel_plan)) {
      w.playerGame.lastBlock = 'You have not worked out which parts fit this build.';
      return w;
    }
    if (w.playerGame.location !== 'harbour_berth') {
      w.playerGame.lastBlock = 'Cargo purchase requires presence at the berth.';
      return w;
    }
    const arrivals = { 'Steel Rim': 4, 'Chain Quick-Link': 2, 'Brake Cable': 3, 'Handlebar Tape': 5, 'Presta Inner Tube': 5 };
    if (w.day < (arrivals[payload.kind] || 0)) {
      w.playerGame.lastBlock = `${payload.kind} has not arrived; current notice expects day ${arrivals[payload.kind]}.`;
      return w;
    }
    buyGood(w, payload.kind, payload.price || GOODS[payload.kind]?.value || 4, payload.seller || 'wharf_suppliers');
    return w;
  }

  if (id === 'assemble_onewheel') {
    if (!knows(w, KNOWLEDGE.onewheel_plan) || r.juan.built) return w;
    if (w.playerGame.location !== 'harbour_berth' || !present(w, 'aspen')) {
      w.playerGame.lastBlock = 'Aspen assembles the one-wheel at the berth when she is actually there.';
      return w;
    }
    const honestLimes = w.playerGame.lime.stage === 'complete'
      && w.playerGame.lime.inspected
      && w.playerGame.lime.representation === 'disclose';
    if (!honestLimes) {
      w.playerGame.lastBlock = 'Aspen is not taking this on until the lime shortfall has been dealt with honestly.';
      return w;
    }
    const free = availableUnits(w, 'player');
    const owned = k => free.some(x => x.kind === k);
    const finish = ONEWHEEL_FINISH.find(owned);
    if (!ONEWHEEL_CORE.every(owned) || !finish) {
      w.playerGame.lastBlock = 'Assembly needs the rim, link, cable, and one compatible finishing component that is not reserved or pledged elsewhere.';
      return w;
    }
    if (!spendAttention(w)) return w;
    for (const k of [...ONEWHEEL_CORE, finish]) {
      const x = free.find(u => u.kind === k);
      p.inventory.splice(p.inventory.indexOf(x), 1);
    }
    addUnit(w, 'Built Onewheel');
    r.juan.built = true;
    r.juan.assembledDay = w.day;
    r.juan.stage = 'ready';
    note(w, 'onewheel_built', 'Aspen used the real uncommitted parts to assemble the Onewheel after the honest lime settlement.', {
      people: ['aspen'], goods: ['Built Onewheel'], returnClass: 'OPERATE', value: 1,
      situation: 'THE_PROMISE', weight: 3,
      process: { execution: 1, commitments: .8, liquidityCredit: .3 },
      style: { inventoryInformation: -.8, directAmbiguous: -.5 },
    });
    return w;
  }

  if (id === 'practice_onewheel') {
    if (!r.juan.built || !p.inventory.some(x => x.kind === 'Built Onewheel')) {
      w.playerGame.lastBlock = 'You need the built one-wheel before practice means anything.';
      return w;
    }
    if (!['harbour_berth', 'cliff_path'].includes(w.playerGame.location)) {
      w.playerGame.lastBlock = 'Practice needs open ground rather than a shop interior.';
      return w;
    }
    if (r.juan.practice >= 4) {
      w.playerGame.lastBlock = 'More of the same practice is no longer changing your odds.';
      return w;
    }
    if (!spendAttention(w)) return w;
    r.juan.practice += 1;
    note(w, 'onewheel_practice', `Practised balance and recovery. Race chance is now ${Math.round(juanRaceChance(w) * 100)}%.`, {
      goods: ['Built Onewheel'], weight: 2,
      process: { execution: .8, positioningStress: .4 },
    });
    return w;
  }

  if (id === 'race_juan') {
    if (!r.juan.built || !p.inventory.some(x => x.kind === 'Built Onewheel')) {
      w.playerGame.lastBlock = 'Bring the built one-wheel to the wager.';
      return w;
    }
    if (w.playerGame.location !== 'joels_bar' || w.actors.juan.location !== 'joels_bar' || w.actors.joel.location !== 'joels_bar') {
      w.playerGame.lastBlock = 'The wager only happens from the real Bar scene with Joel and Juan present.';
      return w;
    }
    if (r.juan.lastRaceDay === w.day) {
      w.playerGame.lastBlock = 'Juan is not offering a free reroll on the same day.';
      return w;
    }
    if (!spendAttention(w)) return w;
    const chance = juanRaceChance(w);
    const roll = juanRaceRoll(w);
    r.juan.races += 1;
    r.juan.lastRaceDay = w.day;
    if (roll <= chance) {
      r.juan.stage = 'complete';
      note(w, 'juan_race_won', `Won Juan’s race at a ${Math.round(chance * 100)}% preparation chance.`, {
        people: ['juan'], goods: ['Built Onewheel'], weight: 3,
        process: { execution: 1, positioningStress: .9, commitments: .8 },
      });
      grantFlower(w, 'juan');
      return w;
    }

    const patrons = barPeopleForRace(w);
    const drinksCost = Math.max(6, patrons.length * 3);
    const immediate = Math.min(Math.max(0, playerAvailableCash(w)), drinksCost);
    if (immediate > 0) {
      p.cash -= immediate;
      w.actors.joel.cash += immediate;
    }
    const remainder = drinksCost - immediate;
    let commitment = null;
    if (remainder > 0) commitment = raceDrinksCommitment(w, remainder);
    note(w, 'juan_race_lost', remainder
      ? `Lost Juan’s race. ${immediate}🥫 reached Joel now and ${remainder}🥫 remains owed for the Bar’s drinks.`
      : `Lost Juan’s race and paid ${drinksCost}🥫 for the Bar’s drinks.`, {
      people: patrons, claims: commitment ? [commitment.id] : [], weight: 3,
      process: { execution: -.4, commitments: .7, liquidityCredit: -.7, positioningStress: -.5 },
      context: { raceChance: chance, raceRoll: roll, drinksCost },
    });
    return w;
  }

  if (id === 'repay_race_drinks') {
    const c = w.playerGame.commitments.find(x => x.id.startsWith('juan-race-drinks-') && ['open', 'breached'].includes(x.status));
    if (!c) {
      w.playerGame.lastBlock = 'No race-drinks balance is outstanding.';
      return w;
    }
    if (w.playerGame.location !== 'joels_bar') {
      w.playerGame.lastBlock = 'Settle the Bar tab with Joel at the Bar.';
      return w;
    }
    if (!pay(w, 'joel', c.amountDue)) return w;
    if (!spendAttention(w)) return w;
    c.status = 'fulfilled';
    note(w, 'juan_race_drinks_paid', `Paid the remaining ${c.amountDue}🥫 from Juan’s race wager.`, {
      people: ['joel', 'juan'], claims: [c.id], weight: 2,
      process: { commitments: 1, liquidityCredit: .3 },
    });
    c.amountDue = 0;
    return w;
  }

  // Sonya route remains independent of the Juan route. The corrected Mai Tai can deepen Joel trust,
  // but supper still requires its own invitation, fresh catch and dated commitment.
  if (id === 'joel_patronage') {
    if (w.playerGame.location !== 'joels_bar' || !spendAttention(w) || !pay(w, 'joel', 3)) return w;
    r.sonya.patronage++;
    r.sonya.joelTrust += 2;
    r.sonya.lastPatronageDay = w.day;
    note(w, 'bar_patronage', 'Stayed for a drink and helped Joel through the room rather than treating him as an invitation gate.', {
      people: ['joel'], returnClass: 'OPERATE', process: { commitments: .5, information: .4 },
    });
    return w;
  }

  if (id === 'joel_help') {
    if (w.playerGame.location !== 'joels_bar' || !spendAttention(w)) return w;
    r.sonya.helped = true;
    r.sonya.joelTrust += 2;
    note(w, 'bar_help', 'Helped reset the Bar after a crowded service.', { people: ['joel'], returnClass: 'OPERATE', process: { execution: .7, commitments: .7 } });
    return w;
  }

  if (id === 'joel_invitation') {
    if (!r.sonya.orgeatSupplied || r.sonya.patronage < 1 || !r.sonya.helped || r.sonya.joelTrust < 8) {
      w.playerGame.lastBlock = 'Joel knows the help, the patronage, and whether the Bar trust is actually there.';
      return w;
    }
    r.sonya.stage = 'invited';
    r.sonya.invitationDay = w.day;
    r.sonya.supperDay = w.day + 3;
    w.playerGame.commitments.push({ id: 'grandma-supper', title: "Grandma's supper — bring the exceptional catch fresh", dueDay: r.sonya.supperDay, status: 'open', location: 'sonyas_kitchen' });
    note(w, 'dated_invitation', `Joel offered a dated supper invitation for day ${r.sonya.supperDay}; the household needs an exceptional fresh catch, not routine mackerel.`, { people: ['joel', 'sonya'], situation: 'THE_PROMISE', weight: 3 });
    return w;
  }

  if (id === 'source_invitation_fish') {
    if (r.sonya.rareFishUnitId) {
      w.playerGame.lastBlock = 'You have already collected the supper catch.';
      return w;
    }
    if (r.sonya.stage !== 'invited' || w.playerGame.location !== 'harbour_berth' || w.day < r.sonya.supperDay - 1) {
      w.playerGame.lastBlock = 'The invitation catch reaches the berth only on the eve of supper.';
      return w;
    }
    if (!spendAttention(w) || !pay(w, 'small_boats', 10)) return w;
    const fish = addUnit(w, 'Exceptional Invitation Fish');
    fish.freshUntil = w.day + 1;
    r.sonya.rareFishUnitId = fish.unitId;
    note(w, 'invitation_fish_sourced', 'Bought the difficult invitation catch at the berth while it was genuinely fresh.', { goods: [fish.kind], people: ['small_boats'], weight: 3 });
    return w;
  }

  if (id === 'sonya_attend') {
    const c = w.playerGame.commitments.find(x => x.id === 'grandma-supper');
    const fish = p.inventory.find(x => x.unitId === r.sonya.rareFishUnitId);
    if (!c || c.status !== 'open' || w.day !== c.dueDay || w.playerGame.location !== 'sonyas_kitchen') {
      w.playerGame.lastBlock = `The physical supper is in Sonya’s kitchen on day ${r.sonya.supperDay}.`;
      return w;
    }
    if (!fish || fish.freshUntil < w.day) {
      w.playerGame.lastBlock = 'The household needs the exceptional catch fresh; routine fish is not a substitute.';
      return w;
    }
    if (!spendAttention(w)) return w;
    p.inventory.splice(p.inventory.indexOf(fish), 1);
    c.status = 'fulfilled';
    r.sonya.stage = 'complete';
    w.actors.joel.location = 'sonyas_kitchen';
    note(w, 'supper_attended', 'Kept Joel’s invitation, brought the exceptional catch, and shared the physical supper.', { people: ['joel', 'sonya'], weight: 3, process: { commitments: 1, execution: .8 } });
    grantFlower(w, 'sonya');
    return w;
  }

  // Yasmin auction/finance route retained as-is.
  if (id === 'auction_preview') {
    if (w.day < r.yasmin.previewOpens) { w.playerGame.lastBlock = 'The public auction notice has not opened preview access yet.'; return w; }
    if (w.day > r.yasmin.previewCloses) { w.playerGame.lastBlock = `Preview closed on day ${r.yasmin.previewCloses}; the next sale will be announced.`; return w; }
    if (w.playerGame.location !== 'viewing_room') { w.playerGame.lastBlock = 'Preview requires presence in the viewing room.'; return w; }
    if (!spendAttention(w)) return w;
    r.yasmin.stage = 'preview'; r.yasmin.preview = true;
    if (!p.contacts.includes('yasmin')) p.contacts.push('yasmin');
    note(w, 'auction_preview', 'Entered the private preview; estimates disagree about the conservatory lot.', { people: ['yasmin'], situation: 'HAMMER_NIGHT', process: { information: .7, valuation: .3 }, style: { publicPrivate: .7, inventoryInformation: .5 } });
    return w;
  }

  if (id === 'auction_inspect') {
    if (w.actors.yasmin.location !== 'viewing_room') { w.playerGame.lastBlock = 'Yasmin is away from the viewing room; inspection cannot proceed without her.'; return w; }
    if (w.playerGame.location !== 'viewing_room') { w.playerGame.lastBlock = 'Inspection requires physical presence in the viewing room.'; return w; }
    if (w.day < 3 || w.day > r.yasmin.previewCloses) { w.playerGame.lastBlock = 'Physical inspection is available from day 3 until preview closes.'; return w; }
    if (!r.yasmin.preview) { w.playerGame.lastBlock = 'Preview access is required before physical inspection.'; return w; }
    if (!spendAttention(w)) return w;
    r.yasmin.inspected = true;
    note(w, 'auction_inspection', 'Inspection found repaired glaze and a credible but incomplete estate label.', { people: ['yasmin'], goods: ['Hand-Painted Porcelain Bowl'], situation: 'HAMMER_NIGHT', process: { verificationAdaptation: 1, valuation: .7, information: .6 }, style: { trustVerification: 1 } });
    return w;
  }

  if (id === 'auction_provenance') {
    if (w.day < 4) { w.playerGame.lastBlock = 'The estate photograph has not reached the newspaper archive yet.'; return w; }
    if (!r.yasmin.preview || !spendAttention(w)) return w;
    r.yasmin.provenance = true;
    note(w, 'provenance_compared', 'Compared the estate label with a delayed newspaper photograph.', { people: ['yasmin'], situation: 'HAMMER_NIGHT', process: { information: 1, valuation: .8, verificationAdaptation: .8 }, style: { inventoryInformation: .8, patientAggressive: -.4 } });
    return w;
  }

  if (id === 'auction_finance') {
    if (w.actors.yasmin.location !== 'viewing_room') { w.playerGame.lastBlock = 'Yasmin is not available here for finance terms.'; return w; }
    if (w.playerGame.location !== 'viewing_room' || !r.yasmin.preview) { w.playerGame.lastBlock = 'Finance requires preview access and a meeting in the viewing room.'; return w; }
    if (w.claims.some(c => c.issuerId === 'player' && ['open', 'default'].includes(c.status))) { w.playerGame.lastBlock = 'An existing secured advance is still open.'; return w; }
    const collateral = availableUnits(w, 'player')[0];
    if (!collateral) { w.playerGame.lastBlock = 'No uncommitted physical collateral is available for inspection.'; return w; }
    if (w.actors.yasmin.cash < 8) { w.playerGame.lastBlock = 'There is not enough cash at this counter.'; return w; }
    if (!spendAttention(w)) return w;
    collateral.pledgedTo = 'yasmin';
    p.cash += 8; w.actors.yasmin.cash -= 8;
    const claim = { id: `player-auction-finance-${w.day}`, type: 'secured_claim', issuerId: 'player', holderId: 'yasmin', face: 9, dueDay: r.yasmin.auctionDay + 4, collateralUnitId: collateral.unitId, status: 'open' };
    w.claims.push(claim);
    w.playerGame.commitments.push({ id: claim.id, title: 'Repay Yasmin secured advance', dueDay: claim.dueDay, status: 'open', claimId: claim.id });
    note(w, 'secured_finance_taken', `Borrowed 8🥫 against ${collateral.kind}; 9🥫 is due on day ${claim.dueDay}.`, { people: ['yasmin'], goods: [collateral.kind], claims: [claim.id], returnClass: 'FINANCE', weight: 3, situation: 'CASH_BEFORE_TOMORROW', process: { liquidityCredit: .7, commitments: .5, valuation: .3 }, style: { publicPrivate: .8 } });
    return w;
  }

  if (id === 'repay_finance') {
    const claim = w.claims.find(c => c.issuerId === 'player' && ['open', 'default'].includes(c.status));
    if (!claim) { w.playerGame.lastBlock = 'No player secured advance is open.'; return w; }
    if (!pay(w, 'yasmin', claim.face)) return w;
    claim.status = 'settled';
    const collateral = p.inventory.find(x => x.unitId === claim.collateralUnitId);
    if (collateral) collateral.pledgedTo = null;
    const c = w.playerGame.commitments.find(x => x.claimId === claim.id);
    if (c) c.status = 'fulfilled';
    note(w, 'secured_finance_repaid', `Repaid ${claim.face}🥫 and released collateral.`, { claims: [claim.id], returnClass: 'FINANCE', weight: 3, process: { commitments: 1, liquidityCredit: .8 } });
    return w;
  }

  if (id === 'auction_bid') {
    if (r.yasmin.bid || r.yasmin.resolved) { w.playerGame.lastBlock = 'Your bid is already on the table.'; return w; }
    if (w.actors.yasmin.location !== 'viewing_room') { w.playerGame.lastBlock = 'Hammer night cannot settle without its host present.'; return w; }
    if (w.playerGame.location !== 'viewing_room') { w.playerGame.lastBlock = 'Bidding requires attendance in the viewing room.'; return w; }
    const amount = Number(payload.amount ?? 14);
    if (!Number.isFinite(amount) || amount <= 0) { w.playerGame.lastBlock = 'A bid must be a positive number of tins.'; return w; }
    if (w.day !== r.yasmin.auctionDay) { w.playerGame.lastBlock = `Hammer night is day ${r.yasmin.auctionDay}; bidding requires attendance then.`; return w; }
    if (!r.yasmin.preview) { w.playerGame.lastBlock = 'Private preview access is required to bid.'; return w; }
    const locked = w.market.reservations.filter(x => x.actorId === 'player' && x.kind === 'cash').reduce((s, x) => s + x.amount, 0)
      + w.playerGame.commitments.filter(c => c.status === 'open').reduce((n, c) => n + (c.lockedCash || 0), 0);
    if (!spendAttention(w) || p.cash - locked < amount) { w.playerGame.lastBlock = 'Bid requires attention and unreserved cash.'; return w; }
    r.yasmin.bid = amount; r.yasmin.stage = 'bid';
    w.playerGame.maxLocked = Math.max(w.playerGame.maxLocked, amount);
    w.playerGame.commitments.push({ id: 'auction-bid', title: 'Hammer-night bid', dueDay: w.day + 1, status: 'open', lockedCash: amount, location: 'viewing_room' });
    note(w, 'auction_bid', `Committed ${amount}🥫 against competing estimates.`, { people: ['yasmin'], situation: 'HAMMER_NIGHT', returnClass: 'SPECULATE', value: amount, process: { valuation: r.yasmin.inspected ? .7 : -.4, liquidityCredit: amount <= 14 ? .5 : -.4 }, style: { patientAggressive: .7, concentratedDiversified: .6, publicPrivate: .8 } });
    return w;
  }

  if (id === 'auction_walk') {
    if (r.yasmin.bid) { w.playerGame.lastBlock = 'Your bid is already promised until the sale closes.'; return w; }
    if (w.playerGame.location !== 'viewing_room') { w.playerGame.lastBlock = 'Walking away is a decision made at the viewing room.'; return w; }
    if (!r.yasmin.preview) return w;
    r.yasmin.stage = 'walked'; r.yasmin.auctionDay += 6; r.yasmin.previewOpens = r.yasmin.auctionDay - 4; r.yasmin.previewCloses = r.yasmin.auctionDay - 1;
    note(w, 'auction_walked', 'Walked away after the evidence failed to support the price.', { situation: 'HAMMER_NIGHT', weight: 2, process: { valuation: 1, positioningStress: .8 }, style: { patientAggressive: -.8 } });
    return w;
  }

  // Existing lime-honesty route is the earned relationship condition for Aspen assembly.
  if (id === 'lime_accept') {
    if (w.playerGame.lime.stage !== 'available') { w.playerGame.lastBlock = 'The crate has already been taken.'; return w; }
    if (!spendAttention(w) || !pay(w, 'aspen', 5)) return w;
    w.playerGame.lime.stage = 'held';
    w.playerGame.commitments.push({ id: 'lime-delivery', title: 'Deliver represented lime crate', dueDay: w.day + 2, status: 'open', location: 'harbour_berth' });
    note(w, 'lime_contract', 'Accepted a crate represented as twenty-four ordinary limes.', { people: ['aspen'], goods: ['Lime'], claims: ['delivery'], situation: 'SHORT_CRATE', returnClass: 'INTERMEDIATE', process: { commitments: .5, verificationAdaptation: -.2 }, style: { trustVerification: -.4 } });
    return w;
  }

  if (id === 'lime_inspect') {
    if (w.playerGame.location !== 'harbour_berth') { w.playerGame.lastBlock = 'Physical inspection requires the crate and your presence at the berth.'; return w; }
    if (w.playerGame.lime.stage !== 'held' || !spendAttention(w)) return w;
    w.playerGame.lime.inspected = true;
    note(w, 'lime_inspected', 'Counted twenty limes, three bruised, against a promise of twenty-four.', { people: ['aspen'], goods: ['Lime'], situation: 'SHORT_CRATE', weight: 2, process: { verificationAdaptation: 1, information: .8, execution: .4 }, style: { trustVerification: 1, transparentSecretive: -.3 } });
    return w;
  }

  if (id === 'lime_represent') {
    const l = w.playerGame.lime;
    if (l.stage !== 'held') return w;
    l.representation = payload.mode || 'disclose';
    note(w, 'lime_represented', l.representation === 'disclose' ? 'Disclosed the short count before delivery.' : l.representation === 'ambiguous' ? 'Said only that the crate was “as received”.' : 'Repeated the promised count despite the physical mismatch.', {
      people: ['aspen'], goods: ['Lime'], situation: 'SHORT_CRATE', weight: 2,
      process: { commitments: l.representation === 'disclose' ? .8 : -.7, verificationAdaptation: l.inspected ? .5 : -.4 },
      style: { transparentSecretive: l.representation === 'disclose' ? -1 : 1, directAmbiguous: l.representation === 'ambiguous' ? 1 : -.6 },
    });
    return w;
  }

  if (id === 'lime_refuse') {
    if (w.playerGame.lime.stage !== 'held') { w.playerGame.lastBlock = 'You no longer hold that crate.'; return w; }
    const c = w.playerGame.commitments.find(x => x.id === 'lime-delivery');
    if (c) c.status = 'cancelled';
    w.playerGame.lime.stage = 'refused';
    w.actors.player.cash += 4; w.actors.aspen.cash -= 4;
    note(w, 'lime_refused', 'Refused the shipment after the mismatch; one handling tin remained spent.', { people: ['aspen'], goods: ['Lime'], situation: 'SHORT_CRATE', weight: 2, process: { verificationAdaptation: .9, positioningStress: .7 }, style: { patientAggressive: -.5, trustVerification: .8 } });
    return w;
  }

  if (id === 'lime_deliver') {
    if (w.playerGame.lime.stage !== 'held') { w.playerGame.lastBlock = 'You no longer hold that crate.'; return w; }
    const l = w.playerGame.lime;
    const c = w.playerGame.commitments.find(x => x.id === 'lime-delivery');
    if (w.playerGame.location !== 'harbour_berth' || !l.representation) { w.playerGame.lastBlock = 'Represent the inspected or uninspected shipment, then deliver at the berth.'; return w; }
    if (!spendAttention(w)) return w;
    const honest = l.representation === 'disclose';
    p.cash += honest ? 6 : 8; w.actors.aspen.cash -= honest ? 6 : 8;
    if (c) c.status = 'fulfilled';
    l.stage = 'complete';
    w.actors.player.reliability.representation += honest ? 1 : -1;
    if (honest) note(w, 'lime_partial', 'Aspen accepted a disclosed partial shipment at revised terms.', { people: ['aspen'], goods: ['Lime'], situation: 'SHORT_CRATE', weight: 2 });
    if (l.representation === 'ambiguous') note(w, 'lime_ambiguous', 'The words were literally narrow while the useful quantity stayed concealed.', { people: ['aspen'], goods: ['Lime'], situation: 'SHORT_CRATE', weight: 2 });
    if (l.representation === 'misrepresent') {
      const misconduct = note(w, 'lime_misrepresented', 'Repeated the promised count after verification showed it was false.', { people: ['aspen'], goods: ['Lime'], situation: 'SHORT_CRATE', weight: 3 });
      recordDiscoveredMisconduct(w, 'misrepresentation', misconduct.id);
    }
    note(w, 'lime_settled', honest ? 'Aspen accepted the disclosed shortage at revised terms.' : 'Aspen later discovered the shortage; the extra proceeds damaged representation reliability.', {
      people: ['aspen'], goods: ['Lime'], situation: 'SHORT_CRATE', returnClass: 'TRADE', value: honest ? 1 : 3, weight: 3,
      process: { execution: honest ? .8 : -.6, commitments: honest ? .8 : -.8 },
      style: { transparentSecretive: honest ? -1 : 1, directAmbiguous: l.representation === 'ambiguous' ? 1 : -.4 },
    });
    return w;
  }

  if (id === 'finish_run' || id === 'go_home') {
    if (!w.playerGame.sunflower.owned) { w.playerGame.lastBlock = 'Find the sunflower before ending this story.'; return w; }
    w.playerGame.home = true;
    note(w, 'went_home', `Paused with the Sunflower on day ${w.day}.`, { weight: 3 });
    return w;
  }

  return w;
}

function publicStory(w, id, headline, report, category = 'public_life') {
  if (w.newspaper.some(x => x.id === id)) return;
  const row = { id, day: w.day, headline, report, truthId: null, category, public: true };
  w.newspaper.push(row);
  w.publicFacts.push(row);
  w.actors.player.knowledge.push(id);
}

// Due dates include the whole named day. One settlement owns cash, promise and pledge.
export function settlePlayerDebts(w, time = w.day) {
  for (const claim of w.claims.filter(c => c.issuerId === 'player' && c.status === 'open' && (c.dueAt ?? c.dueDay + 1) <= time)) {
    const p = w.actors.player;
    const holder = w.actors[claim.holderId];
    const locked = w.market.reservations.filter(r => r.actorId === 'player' && r.kind === 'cash').reduce((n, r) => n + r.amount, 0)
      + w.playerGame.commitments.filter(c => c.status === 'open').reduce((n, c) => n + (c.lockedCash || 0), 0);
    const amount = Math.min(claim.face, Math.max(0, p.cash - locked));
    p.cash -= amount; holder.cash += amount; claim.paid = (claim.paid || 0) + amount; claim.face -= amount;
    claim.status = claim.face === 0 ? 'settled' : 'default';
    const promise = w.playerGame.commitments.find(c => c.claimId === claim.id);
    if (promise) promise.status = claim.status === 'settled' ? 'fulfilled' : 'breached';
    if (claim.status === 'settled') {
      const object = p.inventory.find(u => u.unitId === claim.collateralUnitId);
      if (object) object.pledgedTo = null;
    } else if (promise && !w.playerGame.missed.includes(promise.id)) w.playerGame.missed.push(promise.id);
    note(w, claim.status === 'settled' ? 'secured_finance_repaid' : 'commitment_missed', claim.status === 'settled' ? `Paid ${amount} tins and released the promised object.` : `Paid ${amount} tins; ${claim.face} remain unpaid.`, { people: [claim.holderId], claims: [claim.id], weight: 3, process: { commitments: claim.status === 'settled' ? 1 : -1, liquidityCredit: claim.status === 'settled' ? .8 : -.8 } });
  }
  return w;
}

export function resolvePlayerDay(w) {
  if (w.day === 1) publicStory(w, 'news-supper', 'Tables pulled together at Joel’s', 'Sonya was seen carrying borrowed chairs; nobody agrees yet who the supper is for.', 'social');
  if (w.day === 2) publicStory(w, 'news-auction', 'Conservatory sale announced', 'Yasmin will open a private preview before hammer night on day 6.', 'auction');
  if (w.day === 3) publicStory(w, 'news-hardware', 'Mixed cargo at the berth', 'Hardware, packing material and repair stock came off the morning boats. The manifests are more specific than the notice.', 'commercial');
  if (w.day === 4) publicStory(w, 'news-estate-photo', 'An old room in silver', 'An archive photograph shows the conservatory bowl before its glaze repair.', 'social');
  if (w.day === 5) publicStory(w, 'news-tide', 'Toad circle moves uphill', 'The gathering shifted above the wet path. It is not a sale and no invitation is implied.', 'social');

  const r = w.playerGame.routes.yasmin;
  const c = w.playerGame.commitments.find(x => x.id === 'auction-bid' && x.status === 'open');
  if (c && c.dueDay <= w.day) {
    const rival = 12 + (w.seed + w.day) % 5;
    const quality = r.inspected && r.provenance ? 16 : r.inspected ? 13 : 10;
    if (r.bid >= rival) {
      w.actors.player.cash -= r.bid; w.actors.yasmin.cash += r.bid;
      if (r.bid > quality) note(w, 'auction_overpaid', `The winning bid exceeded the evidence-supported value by ${r.bid - quality}🥫.`, { situation: 'HAMMER_NIGHT', weight: 3, process: { valuation: -.9, positioningStress: -.4 } });
      c.status = 'fulfilled'; r.stage = 'complete'; r.resolved = true;
      addUnit(w, 'Hand-Painted Porcelain Bowl', 'player', 'auction');
      note(w, 'auction_won', `Won at ${r.bid}🥫 against a ${rival}🥫 rival bid; evidence-supported value was about ${quality}🥫.`, { people: ['yasmin'], goods: ['Hand-Painted Porcelain Bowl'], situation: 'HAMMER_NIGHT', weight: 3, returnClass: 'INVEST', value: r.bid, process: { valuation: r.bid <= quality ? .9 : -.8, execution: .7, positioningStress: .5 } });
      grantFlower(w, 'yasmin');
    } else {
      c.status = 'released'; r.stage = 'lost'; r.bid = null; r.auctionDay += 6; r.previewOpens = r.auctionDay - 4; r.previewCloses = r.auctionDay - 1; r.resolved = false;
      note(w, 'auction_lost', `Lost to a ${rival}🥫 bid; committed cash was released.`, { situation: 'HAMMER_NIGHT', process: { positioningStress: .6, liquidityCredit: .5 } });
    }
  }

  for (const cmt of w.playerGame.commitments.filter(x => x.status === 'open' && x.dueDay < w.day)) {
    cmt.status = 'breached';
    w.playerGame.missed.push(cmt.id);
    note(w, 'commitment_missed', `Missed ${cmt.title}.`, { process: { commitments: -1 }, weight: 2 });
    if (cmt.claimId) {
      const claim = w.claims.find(x => x.id === cmt.claimId);
      if (claim) claim.status = 'default';
    }
    if (cmt.id === 'grandma-supper') {
      w.playerGame.routes.sonya.stage = 'known';
      w.playerGame.routes.sonya.heardDay = w.day;
      cmt.status = 'breached';
    }
  }

  w.playerGame.lowestCash = Math.min(w.playerGame.lowestCash, w.actors.player.cash);
  w.playerGame.maxLocked = Math.max(w.playerGame.maxLocked, w.playerGame.commitments.filter(x => x.status === 'open').reduce((s, x) => s + (x.lockedCash || 0), 0));
  return w;
}

export function visibleActions(w) {
  if (w.playerGame.home) return [];
  const l = w.playerGame.location;
  const r = w.playerGame.routes;
  const p = w.actors.player;
  const cash = playerAvailableCash(w);
  const out = [];
  const add = (id, label, reason = null, payload = {}) => {
    if (actionKnown(w, id)) out.push({ id, label, disabled: !!reason, reason, payload });
  };

  for (const [id, a] of Object.entries(w.actors)) {
    if (!a.background && id !== 'player' && a.location === l && !p.contacts.includes(id)) add('meet', `Meet ${id}`, null, { actor: id });
  }

  const joelHere = w.actors.joel.location === 'joels_bar';
  const juanHere = w.actors.juan.location === 'joels_bar';
  const aspenHere = w.actors.aspen.location === 'harbour_berth';

  if (l === 'joels_bar' && joelHere && p.contacts.includes('joel') && !knows(w, KNOWLEDGE.mai_tai_tasted)) add('mai_tai_taste', 'Taste Joel’s Mai Tai');
  if (l === 'joels_bar' && knows(w, KNOWLEDGE.mai_tai_problem) && !knows(w, KNOWLEDGE.mai_tai_ingredient)) add('mai_tai_check_shelf', 'Look over the drink shelf again');
  if (l === 'harbour_berth' && knows(w, KNOWLEDGE.mai_tai_ingredient) && !knows(w, KNOWLEDGE.mai_tai_supplied) && !p.inventory.some(x => x.kind === 'Orgeat')) add('source_orgeat', 'Buy Orgeat from the berth supplier · 6🥫', cash < 6 ? 'Need 6🥫 available' : null);
  if (l === 'joels_bar' && knows(w, KNOWLEDGE.mai_tai_ingredient) && !knows(w, KNOWLEDGE.mai_tai_supplied)) add('joel_supply_orgeat', 'Bring Joel the Orgeat', !p.inventory.some(x => x.kind === 'Orgeat') ? 'No Orgeat bottle in owned inventory' : null);
  if (l === 'joels_bar' && knows(w, KNOWLEDGE.mai_tai_supplied) && !knows(w, KNOWLEDGE.juan_bar_drink) && joelHere && juanHere) add('joel_serve_juan', 'Let Joel pour Juan the corrected Mai Tai');
  if (l === 'joels_bar' && knows(w, KNOWLEDGE.juan_bar_drink) && !knows(w, KNOWLEDGE.juan_goal_explained) && juanHere) add('juan_explain_goal', 'Tell Juan what you are trying to reach');
  if (l === 'joels_bar' && knows(w, KNOWLEDGE.juan_goal_explained) && !knows(w, KNOWLEDGE.juan_route) && juanHere) add('juan_race_offer', 'Ask what Juan meant by “a way”');

  if (l === 'harbour_berth' && knows(w, KNOWLEDGE.juan_route) && !knows(w, KNOWLEDGE.onewheel_plan) && aspenHere) add('aspen_onewheel_plan', 'Show Aspen the one-wheel problem');
  if (l === 'harbour_berth' && knows(w, KNOWLEDGE.onewheel_plan) && !r.juan.built) {
    for (const [kind, price, arrival] of ONEWHEEL_PARTS) {
      if (!p.inventory.some(x => x.kind === kind)) add('buy_part', `Source ${kind} · ${price}🥫`, w.day < arrival ? `Expected with cargo on day ${arrival}` : cash < price ? 'Not enough available cash' : null, { kind, price });
    }
    const free = availableUnits(w, 'player');
    const owned = k => free.some(x => x.kind === k);
    const honestLimes = w.playerGame.lime.stage === 'complete' && w.playerGame.lime.inspected && w.playerGame.lime.representation === 'disclose';
    const missingParts = !ONEWHEEL_CORE.every(owned) || !ONEWHEEL_FINISH.some(owned);
    add('assemble_onewheel', 'Ask Aspen to assemble the one-wheel', !aspenHere ? 'Aspen is away from the berth' : !honestLimes ? 'Aspen is waiting on an honest lime settlement' : missingParts ? 'Compatible uncommitted parts are still missing' : null);
  }
  if (l === 'harbour_berth' && r.juan.built && r.juan.practice < 4) add('practice_onewheel', `Practise on the one-wheel · ${Math.round(juanRaceChance(w) * 100)}% now`);
  if (l === 'joels_bar' && r.juan.built && !w.playerGame.sunflower.owned && knows(w, KNOWLEDGE.juan_route) && joelHere && juanHere) add('race_juan', `Race Juan · ${Math.round(juanRaceChance(w) * 100)}% chance`, r.juan.lastRaceDay === w.day ? 'No free same-day reroll' : null);
  const raceDebt = w.playerGame.commitments.find(x => x.id.startsWith('juan-race-drinks-') && ['open', 'breached'].includes(x.status));
  if (l === 'joels_bar' && raceDebt) add('repay_race_drinks', `Pay remaining race drinks · ${raceDebt.amountDue}🥫`, cash < raceDebt.amountDue ? `Need ${raceDebt.amountDue}🥫 available` : null);

  if (l === 'joels_bar' && r.sonya.stage === 'unseen') add('joel_hear_supper', 'Stay while Joel closes the Bar');
  if (l === 'joels_bar' && r.sonya.stage === 'known' && r.sonya.lastPatronageDay !== w.day) add('joel_patronage', 'Stay for a drink · 3🥫', cash < 3 ? 'Need 3🥫 available' : null);
  if (l === 'joels_bar' && r.sonya.stage === 'known' && !r.sonya.helped) add('joel_help', 'Help reset the room');
  if (l === 'joels_bar' && r.sonya.stage === 'known') add('joel_invitation', 'Follow up with Joel', r.sonya.joelTrust < 8 || !r.sonya.orgeatSupplied || !r.sonya.helped || r.sonya.patronage < 1 ? 'Trust is not yet deep enough' : null);
  if (l === 'harbour_berth' && r.sonya.stage === 'invited' && !r.sonya.rareFishUnitId) add('source_invitation_fish', 'Source the exceptional fresh catch · 10🥫', w.day < r.sonya.supperDay - 1 ? `Expected on day ${r.sonya.supperDay - 1}` : cash < 10 ? 'Need 10🥫 available' : null);
  if (l === 'sonyas_kitchen' && r.sonya.stage === 'invited') add('sonya_attend', 'Attend Grandma’s supper', w.day !== r.sonya.supperDay ? `Invitation is for day ${r.sonya.supperDay}` : !p.inventory.some(x => x.unitId === r.sonya.rareFishUnitId) ? 'The exceptional fresh catch is missing' : null);

  if (l === 'viewing_room' && !r.yasmin.preview) add('auction_preview', 'Request auction preview', w.day < r.yasmin.previewOpens ? `Preview opens day ${r.yasmin.previewOpens}` : w.day > r.yasmin.previewCloses ? 'Preview window closed' : null);
  if (l === 'viewing_room' && r.yasmin.preview && !r.yasmin.inspected) add('auction_inspect', 'Inspect the lot', w.day < 3 ? 'Inspection opens day 3' : w.day > r.yasmin.previewCloses ? 'Inspection closed' : null);
  if (l === 'viewing_room' && r.yasmin.preview && !r.yasmin.provenance) add('auction_provenance', 'Compare provenance', w.day < 4 ? 'Archive photograph arrives day 4' : null);
  if (l === 'viewing_room' && r.yasmin.preview && !r.yasmin.bid && !r.yasmin.resolved) add('auction_bid', 'Bid 16🥫', w.day !== r.yasmin.auctionDay ? `Attend on day ${r.yasmin.auctionDay}` : cash < 16 ? 'Not enough available cash' : null, { amount: 16 });
  if (l === 'viewing_room' && r.yasmin.preview && cash < 16 && !w.claims.some(c => c.issuerId === 'player' && ['open', 'default'].includes(c.status))) add('auction_finance', 'Ask about secured finance', availableUnits(w, 'player').length ? null : 'No uncommitted collateral is available');
  if (l === 'viewing_room' && r.yasmin.preview && !r.yasmin.bid && !r.yasmin.resolved) add('auction_walk', 'Walk away');

  if (l === 'harbour_berth' && w.playerGame.lime.stage === 'available') add('lime_accept', 'Accept lime delivery job');
  if (w.playerGame.lime.stage === 'held') {
    add('lime_inspect', 'Inspect lime crate', l !== 'harbour_berth' ? 'Crate is at the berth' : null);
    add('lime_represent', 'Disclose short count', null, { mode: 'disclose' });
    add('lime_represent', 'Use ambiguous wording', null, { mode: 'ambiguous' });
    add('lime_represent', 'Repeat promised count', null, { mode: 'misrepresent' });
    add('lime_refuse', 'Refuse the shipment');
    add('lime_deliver', 'Deliver limes', l !== 'harbour_berth' ? 'Delivery requires berth presence' : null);
  }

  if (w.claims.some(c => c.issuerId === 'player' && ['open', 'default'].includes(c.status))) {
    const claim = w.claims.find(c => c.issuerId === 'player' && ['open', 'default'].includes(c.status));
    add('repay_finance', 'Repay secured advance', cash < claim.face ? 'Not enough available cash' : null);
  }
  if (w.playerGame.sunflower.owned) add('go_home', 'GO HOME');

  out.push(...availableProductionActions(w));
  const hidden = w.production?.toads.find(t => t.status === 'hidden' && t.location === l && w.day >= t.availableFrom);
  if (hidden) out.push({ id: 'collect_toad', label: 'Notice the hidden toad', disabled: false, reason: null, payload: { toadId: hidden.id }, hiddenOnly: true });
  const held = w.production?.toads.find(t => t.ownerId === 'player' && t.status === 'held');
  if (held && ['nursery', 'joels_bar'].includes(l)) {
    for (const target of ['juan', 'aspen', 'wong'].filter(x => w.actors[x].location === l)) add('sell_toad', `Offer the toad to ${target} · 2🥫`, null, { target });
    if (l === 'nursery') add('invite_toad_circle', 'Invite whoever is actually free');
  }
  return out;
}

export const PROCESS_AXES = processAxes;

// Failed actions are atomic: no partial attention, cash, inventory or evidence writes.
export function performPlayerAction(current, id, payload = {}) {
  if (!actionKnown(current, id)) return { ...current, playerGame: { ...current.playerGame, lastBlock: 'You have not learned enough to do that yet.' } };
  const actor = PLAYER_COUNTERPARTIES[id];
  if (actor && !present(current, actor)) return { ...current, playerGame: { ...current.playerGame, lastBlock: 'They are not present for this exchange.' } };
  const timed = availableProductionActions(current).some(a => a.id === id) || ['invite_toad_circle', 'sell_toad'].includes(id);
  if (timed && current.attention.used >= current.attention.budget) return { ...current, playerGame: { ...current.playerGame, lastBlock: 'Not enough attention remains for this intervention.' } };
  const next = applyPlayerAction(current, id, payload);
  if (timed && next.evidence.length > current.evidence.length && !next.playerGame.lastBlock) next.attention.used++;
  if (next.playerGame.lastBlock) return { ...current, playerGame: { ...current.playerGame, lastBlock: next.playerGame.lastBlock } };
  return next;
}
