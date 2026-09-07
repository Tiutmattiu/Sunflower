import { NIGHT_MENU_MASTER } from "./economicContent.js";

// Bar stock is reconciled from the authoritative trader inventory. Once opened,
// a procurement unit leaves public inventory and becomes residual-valued operating stock.
export const FLAVOUR_DIMENSIONS = ["sweet", "sour", "dry", "bitter", "fruity", "herbal", "spicy", "savoury", "smoky", "strength", "novelty"];
export const BAR_MASTER_MENU = NIGHT_MENU_MASTER;

export const BAR_INGREDIENTS = {
  Pineapple: { source: "real_menu_reference", family: "fruit", profile: { sweet: 3, sour: 1, fruity: 4 }, yield: 5, shelfLife: "perishable", unit: "fruit crate", cost: 6 },
  Raspberry: { source: "real_menu_reference", family: "fruit", profile: { sweet: 2, sour: 2, fruity: 4 }, yield: 4, shelfLife: "perishable", unit: "punnet", cost: 5 },
  Grapefruit: { source: "real_menu_reference", family: "fruit", profile: { sour: 3, bitter: 2, fruity: 3, dry: 1 }, yield: 5, shelfLife: "perishable", unit: "crate", cost: 6 },
  Cucumber: { source: "real_menu_reference", family: "savoury_produce", profile: { herbal: 1, savoury: 2, dry: 1 }, yield: 6, shelfLife: "perishable", unit: "crate", cost: 4 },
  Tomato: { source: "real_menu_reference", family: "savoury_produce", profile: { sour: 1, savoury: 4 }, yield: 5, shelfLife: "perishable", unit: "crate", cost: 4 },
  Mint: { source: "real_menu_reference", family: "herb", profile: { herbal: 4, novelty: 1 }, yield: 8, shelfLife: "perishable", unit: "bunch", cost: 3 },
  Basil: { source: "real_menu_reference", family: "herb", profile: { herbal: 3, savoury: 1 }, yield: 7, shelfLife: "perishable", unit: "bunch", cost: 3 },
  Cardamom: { source: "real_menu_reference", family: "spice", profile: { spicy: 2, herbal: 2, novelty: 2 }, yield: 12, shelfLife: "durable", unit: "spice tin", cost: 5 },
  Cinnamon: { source: "real_menu_reference", family: "spice", profile: { spicy: 2, sweet: 1 }, yield: 12, shelfLife: "durable", unit: "spice tin", cost: 4 },
  "Sichuan Pepper": { source: "real_menu_reference", family: "spice", profile: { spicy: 4, novelty: 3 }, yield: 12, shelfLife: "durable", unit: "spice tin", cost: 6 },
  "Rum Bottle": { source: "sunflower_support", family: "base", profile: { strength: 4, sweet: 1 }, yield: 8, shelfLife: "durable", unit: "bottle", cost: 10, compatibility: "alcoholic" },
  "Orange Curaçao": { source: "sunflower_support", family: "modifier", profile: { sweet: 2, fruity: 2, strength: 2 }, yield: 10, shelfLife: "durable", unit: "bottle", cost: 12, compatibility: "alcoholic" },
  "Orgeat Bottle": { source: "sunflower_support", family: "modifier", profile: { sweet: 3 }, yield: 10, shelfLife: "medium", unit: "bottle", cost: 14 },
  "Lime Crate": { source: "sunflower_support", family: "acid", profile: { sour: 4, fruity: 1 }, yield: 10, shelfLife: "perishable", unit: "crate", cost: 8 },
  "Ice Block": { source: "sunflower_support", family: "service", profile: {}, yield: 12, shelfLife: "service_window", unit: "block", cost: 5 },
  Soda: { source: "sunflower_support", family: "base", profile: { dry: 2 }, yield: 8, shelfLife: "medium", unit: "case", cost: 5, compatibility: "non_alcoholic" },
};
export const ACTIVE_REAL_MENU = Object.keys(BAR_INGREDIENTS).filter((name) => BAR_INGREDIENTS[name].source === "real_menu_reference");
export const ACTIVE_SUPPORT = Object.keys(BAR_INGREDIENTS).filter((name) => BAR_INGREDIENTS[name].source === "sunflower_support");
export const INACTIVE_REAL_MENU = ["Green Apple", "Red Apple", "Blackberry", "Strawberry", "Watermelon", "Cherry", "Grape", "Peach", "Avocado", "Cacao", "Mango", "Orange", "Pear", "Fennel", "Eggplant", "Dill", "Lemongrass", "Rosemary", "Thyme", "Cumin", "Sesame", "Mustard Seed"];
export const BENCHMARKS = {
  "Mai Tai": { authored: true, base: "alcoholic", ingredients: ["Rum Bottle", "Orange Curaçao", "Orgeat Bottle", "Lime Crate"], style: "balanced", price: 9 },
  "Cucumber Highball": { authored: true, base: "non_alcoholic", ingredients: ["Soda", "Cucumber", "Lime Crate"], style: "dry", price: 5 },
};

const removeOne = (items, item) => { const copy = [...items]; const index = copy.indexOf(item); if (index >= 0) copy.splice(index, 1); return copy; };
const available = (game, name) => (game.bar.servings[name] || 0) + (game.traders.joel?.inventory.filter((item) => item === name).length || 0) * BAR_INGREDIENTS[name].yield;
export const usableServings = available;
export function createBarState(seed = 1) {
  return { operatorId: "joel", open: true, seed, capacity: 5, servings: {}, opened: {}, countedUnits: {}, inventoryCostBasis: 0, serviceWindows: [], ingredientTransactions: [], procurement: [], spoilage: 0, markdown: 0, organicScrap: 0, scrapCostBasis: 0, scrapProcessed: 0, scrapExited: 0, processingCapacity: 4, recoveryValue: 0, receivables: 0, publicSignal: "A small mixed crowd is expected; taste remains uncertain." };
}

export function syncBarInventory(game) {
  if (!game.traders.joel) return;
  for (const [name, ingredient] of Object.entries(BAR_INGREDIENTS)) {
    const units = game.traders.joel.inventory.filter((item) => item === name).length;
    const prior = game.bar.countedUnits[name] || 0;
    if (units > prior) {
      const added = units - prior;
      game.bar.inventoryCostBasis += added * ingredient.cost;
      game.bar.ingredientTransactions.push({ day: game.day, ingredient: name, units: added, value: added * ingredient.cost, kind: "stock_received" });
    }
    game.bar.countedUnits[name] = units;
  }
}

function openUnit(game, name) {
  const ingredient = BAR_INGREDIENTS[name];
  if (!ingredient || !game.traders.joel?.inventory.includes(name)) return false;
  game.traders.joel.inventory = removeOne(game.traders.joel.inventory, name);
  game.bar.countedUnits[name] = Math.max(0, (game.bar.countedUnits[name] || 1) - 1);
  game.bar.servings[name] = (game.bar.servings[name] || 0) + ingredient.yield;
  game.bar.opened[name] = (game.bar.opened[name] || 0) + 1;
  return true;
}

export function ingredientCarrying(game, name) {
  const ingredient = BAR_INGREDIENTS[name];
  const servings = game.bar.servings[name] || 0;
  const unopened = game.traders.joel?.inventory.filter((item) => item === name).length || 0;
  return { originalCostBasis: ingredient.cost, servingsInitial: ingredient.yield, servingsRemaining: servings, unopenedUnits: unopened, remainingCarryingValue: Number((unopened * ingredient.cost + servings * ingredient.cost / ingredient.yield).toFixed(2)), resaleEligible: unopened > 0, resaleValue: unopened * ingredient.cost };
}

export function flavourProfile(names) {
  const totals = {}, weights = names.map((_, index) => index === 0 ? 1 : .75);
  names.forEach((name, index) => Object.entries(BAR_INGREDIENTS[name]?.profile || {}).forEach(([dimension, value]) => { totals[dimension] = (totals[dimension] || 0) + value * weights[index]; }));
  const divisor = Math.max(1, weights.reduce((sum, value) => sum + value, 0));
  return Object.fromEntries(Object.entries(totals).map(([key, value]) => [key, Number((value / divisor).toFixed(2))]));
}

const styleTargets = { fruity: "fruity", "spirit-forward": "strength", dry: "dry", sweet: "sweet", balanced: null, sour: "sour", smoky: "smoky", savoury: "savoury", spicy: "spicy" };
function proposition(name, base, ingredients, style, authored = false) {
  const cost = ingredients.reduce((sum, item) => sum + BAR_INGREDIENTS[item].cost / BAR_INGREDIENTS[item].yield, 0);
  return { name, base, ingredients, style, authored, profile: flavourProfile(ingredients), cost: Number(cost.toFixed(2)), prepBurden: ingredients.length, price: Math.ceil(cost + 2 + Math.max(0, ingredients.length - 3) * .5) };
}
export function feasibleDrink(game, recipe) { return recipe.ingredients.every((name) => available(game, name) >= 1); }

export function buildDrinkPropositions(game, demand = null) {
  if (!game.traders.joel) return [];
  const result = Object.entries(BENCHMARKS).filter(([, recipe]) => feasibleDrink(game, recipe)).map(([name, recipe]) => proposition(name, recipe.base, recipe.ingredients, recipe.style, true));
  const bases = [["Soda", "non_alcoholic"], ["Rum Bottle", "alcoholic"]].filter(([name]) => available(game, name)).sort((a,b)=>(b[1]===demand?.base)-(a[1]===demand?.base));
  const wanted = styleTargets[demand?.extra] || styleTargets[demand?.style];
  const accents = ACTIVE_REAL_MENU.filter((name) => available(game, name)).sort((a, b) =>
    Number(BAR_INGREDIENTS[b].profile[wanted] || 0) - Number(BAR_INGREDIENTS[a].profile[wanted] || 0) || a.localeCompare(b));
  for (const [baseName, base] of bases) {
    for (const accent of accents) {
      if (result.filter((drink) => drink.base === base).length >= 2) break;
      if (base === "alcoholic" && accent === "Tomato") continue;
      const ingredient = BAR_INGREDIENTS[accent];
      const needsAcid = !["Grapefruit", "Raspberry", "Tomato"].includes(accent);
      const ingredients = [baseName, accent, ...(needsAcid ? ["Lime Crate"] : [])];
      if (!ingredients.every((name) => available(game, name))) continue;
      const key = styleTargets[demand?.extra] || styleTargets[demand?.style] || Object.entries(ingredient.profile).sort((a,b)=>b[1]-a[1])[0]?.[0] || "balanced";
      result.push(proposition(`${accent} ${base === "alcoholic" ? "Rum" : "Soda"} Pour`, base, ingredients, key));
    }
  }
  return result.slice(0, 5);
}

function scoreDrink(drink, customer) {
  const primary = styleTargets[customer.style]; const extra = styleTargets[customer.extra];
  const target = (primary ? drink.profile[primary] || 0 : 2) + (extra ? (drink.profile[extra] || 0) * .5 : 0);
  return target - drink.cost * .12 - drink.prepBurden * .08;
}
function missingReason(game, customer) {
  const base = customer.base === "alcoholic" ? "Rum Bottle" : "Soda";
  if (!available(game, base)) return "missing_base";
  if (!available(game, "Lime Crate") && !["sour", "savoury"].includes(customer.extra)) return "missing_complementary_input";
  return Object.values(game.bar.servings).some((n) => n === 0) ? "stockout" : "no_feasible_drink";
}

function consume(game, drink) {
  for (const name of drink.ingredients) {
    if (!(game.bar.servings[name] > 0) && !openUnit(game, name)) return false;
    game.bar.servings[name] -= 1;
    game.bar.ingredientTransactions.push({ day: game.day, ingredient: name, servings: 1, value: BAR_INGREDIENTS[name].cost / BAR_INGREDIENTS[name].yield, kind: "bar_use" });
  }
  return true;
}
export function produceDrink(game, recipeName) {
  syncBarInventory(game);
  const recipe = BENCHMARKS[recipeName];
  if (!recipe || !game.bar.open || !feasibleDrink(game, recipe)) return null;
  const drink = proposition(recipeName, recipe.base, recipe.ingredients, recipe.style, true);
  return consume(game, drink) ? drink : null;
}

export function demandForWindow(game) {
  if (game.bar.demandOverride) return game.bar.demandOverride.map((row, index) => ({ id: `override-${index}`, ...row }));
  return [
    ...(game.day % 2 ? [{ source: "background_local", style: "balanced", extra: game.day % 5 ? "fruity" : "savoury", base: "non_alcoholic", budget: 6 }] : []),
    ...(game.day % 3 === 0 ? [{ source: "external_visitor", style: "fruity", extra: "surprise", base: "alcoholic", budget: 10 }] : []),
    ...(game.day % 4 === 0 ? [{ source: "juan", style: "spirit-forward", extra: "spicy", base: "alcoholic", budget: 9, tab: true }] : []),
    ...(game.day % 7 === 0 ? [{ source: "wong", style: "balanced", extra: "sour", base: "non_alcoholic", budget: 4, substituteTolerance: 1 }] : []),
    ...(game.flags?.sailorDeparturePressure && game.day % 3 === 1 ? [{ source: "aspen", style: "dry", extra: "herbal", base: "non_alcoholic", budget: 6 }] : []),
    ...(game.bar.hostingEvent ? Array.from({ length: game.bar.hostingEvent.headcount || 3 }, (_, index) => ({ source: "yasmin_event", style: ["dry", "fruity", "balanced"][index % 3], extra: "surprise", base: index % 2 ? "alcoholic" : "non_alcoholic", budget: 10 })) : []),
    ...(game.bar.dimaMeeting ? [{ source: "dima_venue", venueOnly: true, capacity: 2, budget: 3 }] : []),
  ].map((row, index) => ({ id: `${game.day}-${index}`, ...row }));
}

function acquireBundle(game, bundle, result) {
  const reserve = 12; const cost = bundle.reduce((sum, name) => sum + BAR_INGREDIENTS[name].cost, 0);
  const lot = game.backgroundEconomy.barSupplyLots?.find((entry) => !entry.sold && bundle.every((name) => entry.items.includes(name)));
  if (!lot) { result.failedProcurement.push({ bundle, reason: "missing_supplier" }); return false; }
  if (game.traders.joel.sardines - cost < reserve) { result.failedProcurement.push({ bundle, reason: "insufficient_cash_after_reserve" }); return false; }
  game.traders.joel.sardines -= cost; game.backgroundEconomy.externalDrains += cost; lot.sold = true;
  bundle.forEach((name) => game.traders.joel.inventory.push(name)); syncBarInventory(game);
  const row = { day: game.day, source: lot.source, items: bundle, spend: cost, completeBundles: 1, remainingCashReserve: game.traders.joel.sardines };
  game.bar.procurement.push(row); result.procurementCost += cost; result.procurement.push(row); return true;
}
export function planBarProcurement(game, demand, result) {
  const needsAlcohol = demand.some((row) => row.base === "alcoholic"); const needsNA = demand.some((row) => row.base === "non_alcoholic");
  const bundles = [...(needsAlcohol && !buildDrinkPropositions(game, { base: "alcoholic" }).some((d) => d.base === "alcoholic") ? [["Rum Bottle", "Pineapple", "Lime Crate"]] : []), ...(needsNA && !buildDrinkPropositions(game, { base: "non_alcoholic" }).some((d) => d.base === "non_alcoholic") ? [["Soda", "Cucumber", "Lime Crate"]] : [])];
  bundles.forEach((bundle) => acquireBundle(game, bundle, result));
}

function processScrap(game, result) {
  const capacity = game.traders.juan ? game.bar.processingCapacity : 0;
  const processed = Math.min(capacity, game.bar.organicScrap); const unitBasis = game.bar.organicScrap ? game.bar.scrapCostBasis / game.bar.organicScrap : 0;
  const recovery = processed * unitBasis * .15;
  game.bar.organicScrap -= processed; game.bar.scrapCostBasis = Math.max(0, game.bar.scrapCostBasis - processed * unitBasis); game.bar.scrapProcessed += processed; game.bar.recoveryValue += recovery;
  const exited = Math.max(0, game.bar.organicScrap - 12); game.bar.organicScrap -= exited; game.bar.scrapExited += exited;
  Object.assign(result, { scrapProcessed: processed, scrapUnprocessed: game.bar.organicScrap, scrapExited: exited, processingCapacity: capacity, recoveryValue: recovery });
}

export function settleBarService(game) {
  if (!game.bar) game.bar = createBarState(game.seed || 1);
  game.bar.open = Boolean(game.traders.joel) && game.bar.operatorId === "joel";
  syncBarInventory(game);
  const arrivals = game.bar.open ? demandForWindow(game) : (game.bar.demandOverride || demandForWindow(game));
  const result = { day: game.day, arrivals: arrivals.length, served: 0, unserved: 0, unservedByReason: {}, arrivalsBySource: {}, servedBySource: {}, outcomes: [], localRevenue: 0, externalRevenue: 0, tabs: 0, production: 0, capacity: game.bar.capacity, capacityUsed: 0, procurementCost: 0, procurement: [], failedProcurement: [], spoilage: 0, organicScrap: 0, scrapProcessed: 0, scrapUnprocessed: game.bar.organicScrap, scrapExited: 0, processingCapacity: game.bar.processingCapacity, recoveryValue: 0 };
  const reject = (customer, reason) => { result.unserved++; result.unservedByReason[reason] = (result.unservedByReason[reason] || 0) + 1; result.outcomes.push({ source: customer.source, served: false, reason }); };
  arrivals.forEach((customer) => { result.arrivalsBySource[customer.source] = (result.arrivalsBySource[customer.source] || 0) + 1; });
  if (!game.bar.open) arrivals.forEach((customer) => reject(customer, "bar_closed"));
  else {
    planBarProcurement(game, arrivals, result);
    for (const customer of arrivals) {
      const footprint = customer.capacity || 1;
      if (result.capacityUsed + footprint > game.bar.capacity) { reject(customer, "capacity_full"); continue; }
      if (customer.venueOnly) { result.served++; result.capacityUsed += footprint; result.localRevenue += customer.budget; game.traders.dima.sardines -= customer.budget; game.traders.joel.sardines += customer.budget; result.servedBySource[customer.source] = (result.servedBySource[customer.source] || 0) + 1; continue; }
      const choices = buildDrinkPropositions(game, customer).filter((drink) => drink.base === customer.base).sort((a,b)=>scoreDrink(b,customer)-scoreDrink(a,customer));
      if (!choices.length) { reject(customer, missingReason(game, customer)); continue; }
      const drink = choices[0]; const match = scoreDrink(drink, customer);
      if (match < -.25 && !customer.substituteTolerance) { reject(customer, "customer_match_reject"); continue; }
      if (customer.budget < drink.price) { reject(customer, "customer_budget_reject"); continue; }
      if (customer.tab) { const claim = game.claims.find((entry) => entry.id === "juan-joel-tab" && entry.status === "open"); if (!claim || claim.faceAmount + drink.price > 16) { reject(customer, "credit_limit_reject"); continue; } }
      if (!customer.tab && customer.source !== "external_visitor" && game.backgroundEconomy.localHouseholdsCash < drink.price) { reject(customer, "customer_budget_reject"); continue; }
      if (!consume(game, drink)) { reject(customer, "stockout"); continue; }
      if (customer.tab) { const claim = game.claims.find((entry) => entry.id === "juan-joel-tab" && entry.status === "open"); claim.faceAmount += drink.price; game.bar.receivables += drink.price; result.tabs += drink.price; }
      else if (customer.source === "external_visitor") { game.traders.joel.sardines += drink.price; game.backgroundEconomy.externalInjections += drink.price; result.externalRevenue += drink.price; }
      else { const payer = game.backgroundEconomy.localHouseholdsCash; game.backgroundEconomy.localHouseholdsCash -= drink.price; game.traders.joel.sardines += drink.price; result.localRevenue += drink.price; if (payer < drink.price) throw new Error("local payer underfunded after validation"); }
      result.served++; result.production++; result.capacityUsed += footprint; result.servedBySource[customer.source] = (result.servedBySource[customer.source] || 0) + 1; result.outcomes.push({ source: customer.source, served: true, proposition: drink.name, ingredients: drink.ingredients });
    }
  }
  if (game.day % 3 === 0) for (const name of ACTIVE_REAL_MENU.concat("Lime Crate")) {
    const ingredient = BAR_INGREDIENTS[name]; const lost = ingredient.shelfLife === "perishable" ? game.bar.servings[name] || 0 : 0; if (!lost) continue;
    const value = lost * ingredient.cost / ingredient.yield; game.bar.servings[name] = 0; game.bar.opened[name] = 0; result.spoilage += value; result.organicScrap += lost; game.bar.organicScrap += lost; game.bar.scrapCostBasis += value;
  }
  game.bar.spoilage += result.spoilage; processScrap(game, result); game.bar.serviceWindows.push(result); return result;
}

export function barDiagnostics(game) {
  const windows = game.bar?.serviceWindows || []; const sum = (key) => windows.reduce((total, row) => total + Number(row[key] || 0), 0); const merge = (key) => windows.reduce((out,row)=>{Object.entries(row[key]||{}).forEach(([name,n])=>out[name]=(out[name]||0)+n);return out;},{});
  return { arrivals: sum("arrivals"), served: sum("served"), unserved: sum("unserved"), unservedByReason: merge("unservedByReason"), arrivalsBySource: merge("arrivalsBySource"), servedBySource: merge("servedBySource"), localRevenue: sum("localRevenue"), externalRevenue: sum("externalRevenue"), tabsReceivable: game.bar?.receivables || 0, production: sum("production"), capacity: sum("capacity"), capacityUsed: sum("capacityUsed"), inventoryCostBasis: game.bar?.inventoryCostBasis || 0, spoilage: sum("spoilage"), organicScrapGenerated: sum("organicScrap"), scrapProcessed: game.bar?.scrapProcessed || 0, scrapUnprocessed: game.bar?.organicScrap || 0, scrapExited: game.bar?.scrapExited || 0, processingCapacity: game.bar?.processingCapacity || 0, compostRecoveryValue: game.bar?.recoveryValue || 0, procurementCost: sum("procurementCost") };
}
