import {
  acceptFutureDelivery, acceptInboundOffer, advancePhase, applyLateOrderEdit, buyJuanClaim, createGame,
  duePrivateMatters, economicSnapshot, fulfillFutureDelivery, futureDeliveryAvailable, informationBuyers,
  performFreeAction, requestRelationshipLoan, requestSecuredLoan, resistSunMoment, resolveDuePrivateMatter,
  resolveEvent, resolveNoonMarket, securedCollateralItems, sellInformation, sellInformationExclusive, shareInformationAsFavor, valueOf,
} from "../src/gameEngine.js";
import { visibleSellListings } from "../src/npcAI.js";

const POLICIES = ["NO_ACTION", "PUBLIC_DEALER", "VALUE_CONSERVATIVE", "HIGH_TURNOVER", "INFORMATION_BROKER", "RELATIONSHIP_OPERATOR", "SECURED_LIQUIDITY", "CLAIMS_DISTRESSED", "LOW_VARIANCE_CONTRACT", "HIGH_RISK_SPECIAL", "MIXED_ADAPTIVE"];
const HORIZONS = [14, 42, 100];
const PAUSE_POLICIES = ["NATURAL_PAUSE", "RESIST_WHEN_USEFUL"];
const ACTORS = ["player", "wong", "aspen", "yasmin", "juan", "sterling", "dima", "octopus"];
const sum = (values) => values.reduce((total, value) => total + Number(value || 0), 0);
const hhi = (values) => { const total = sum(values); return total ? sum(values.map((value) => (value / total) ** 2)) : 0; };
const wealth = (trader) => trader.sardines + sum(trader.inventory.map(valueOf));
const actorWealth = (game, id) => wealth(game.traders[id]) + sum(game.claims.filter((claim) => claim.status === "open" && claim.currentHolderId === id).map((claim) => claim.faceAmount)) - sum(game.claims.filter((claim) => claim.status === "open" && claim.debtorId === id).map((claim) => claim.faceAmount)) - sum(game.obligations.filter((entry) => entry.status === "open" && entry.debtorId === id).map((entry) => entry.amount));

function writeOrder(game, mode = "value") {
  const listings = visibleSellListings(game).filter((row) => row.ask <= game.traders.player.sardines);
  const candidates = mode === "value" ? listings.filter((row) => row.ask <= row.reference) : listings;
  candidates.sort((a, b) => mode === "turnover" ? a.ask - b.ask : (b.reference - b.ask) - (a.reference - a.ask));
  if (candidates[0]) game.playerOrders[0] = { to: candidates[0].sellerId, wantItem: candidates[0].item, offerItem: "", sardines: candidates[0].ask };
}

function acceptPublicExit(game) {
  const offer = game.inboundOffers.find((entry) => entry.day === game.day && entry.phase === game.phase && entry.status === "pending" && entry.kind === "buy-item");
  return offer ? acceptInboundOffer(game, offer.id) : game;
}

function sellLead(game, exclusive = false) {
  for (const info of game.information) {
    const buyer = informationBuyers(game, info)[0];
    if (buyer) return exclusive && (info.knownBy || []).length === 1 ? sellInformationExclusive(game, info.id, buyer) : sellInformation(game, info.id, buyer);
  }
  return game;
}

function act(game, policy, phase) {
  if (!game.actionsRemaining || policy === "NO_ACTION") return game;
  if (["PUBLIC_DEALER", "HIGH_TURNOVER", "MIXED_ADAPTIVE"].includes(policy)) game = acceptPublicExit(game);
  if (phase === "morning" && ["PUBLIC_DEALER", "VALUE_CONSERVATIVE", "HIGH_TURNOVER", "MIXED_ADAPTIVE"].includes(policy)) writeOrder(game, policy === "HIGH_TURNOVER" ? "turnover" : "value");
  if (!game.actionsRemaining) return game;
  if (policy === "INFORMATION_BROKER") {
    const sold = sellLead(game, game.day % 3 === 0);
    return sold.actionsRemaining < game.actionsRemaining ? sold : performFreeAction(game, "investigate", ["octopus", "aspen", "sterling", "yasmin"][game.day % 4]);
  }
  if (policy === "RELATIONSHIP_OPERATOR") {
    for (const info of game.information) {
      const buyer = informationBuyers(game, info)[0];
      if (buyer) return shareInformationAsFavor(game, info.id, buyer);
    }
    if ((game.relationships.sterling || 0) >= 2 && !game.obligations.some((entry) => entry.kind === "relationship-loan" && entry.status === "open")) {
      const financed = requestRelationshipLoan(game);
      if (financed.actionsRemaining < game.actionsRemaining) return financed;
    }
    return performFreeAction(game, game.day % 2 ? "investigate" : "talk", game.day % 2 ? "octopus" : "sterling");
  }
  if (policy === "SECURED_LIQUIDITY") {
    const collateral = securedCollateralItems(game)[0];
    if ((game.relationships.yasmin || 0) >= 1 && collateral) {
      const financed = requestSecuredLoan(game, collateral);
      if (financed.actionsRemaining < game.actionsRemaining) return financed;
    }
    if (phase === "morning" && !collateral) {
      const asset = visibleSellListings(game).find((row) => row.sellerId === "yasmin" && row.item === "Velvet Sleeve" && row.ask <= game.traders.player.sardines);
      if (asset) game.playerOrders[0] = { to: asset.sellerId, wantItem: asset.item, offerItem: "", sardines: asset.ask };
    }
    return performFreeAction(game, "talk", "yasmin");
  }
  if (policy === "CLAIMS_DISTRESSED") {
    const forSale = game.claims.find((claim) => claim.status === "open" && claim.knownByPlayer && claim.currentHolderId !== "player");
    if (forSale) {
      const bought = buyJuanClaim(game, forSale.id);
      if (bought.actionsRemaining < game.actionsRemaining) return bought;
    }
    return performFreeAction(game, "investigate", "dima");
  }
  if (policy === "LOW_VARIANCE_CONTRACT") {
    if (futureDeliveryAvailable(game)) return acceptFutureDelivery(game);
    const future = game.obligations.find((entry) => entry.kind === "future-delivery" && entry.status === "open");
    if (future && game.traders.player.inventory.includes("Lime Crate")) return fulfillFutureDelivery(game, future.id);
    return performFreeAction(game, "talk", "aspen");
  }
  if (policy === "HIGH_RISK_SPECIAL") return performFreeAction(game, "talk", "juan");
  if (policy === "MIXED_ADAPTIVE") {
    const sold = sellLead(game);
    if (sold.actionsRemaining < game.actionsRemaining) return sold;
  }
  return performFreeAction(game, policy === "VALUE_CONSERVATIVE" ? "investigate" : "talk", ["wong", "octopus", "sterling", "aspen"][game.day % 4]);
}

function recoveryChannels(game) {
  const channels = new Set();
  if (game.inboundOffers.some((entry) => entry.status === "pending" && entry.kind === "buy-item")) channels.add("public-exit");
  if (game.information.some((info) => informationBuyers(game, info).length)) channels.add("information-sale");
  if ((game.relationships.sterling || 0) >= 2) channels.add("relationship-credit");
  if ((game.relationships.yasmin || 0) >= 1 && securedCollateralItems(game).length) channels.add("secured-liquidity");
  if (game.claims.some((claim) => claim.currentHolderId === "player" && claim.status === "open" && game.traders.juan.sardines >= Math.ceil(claim.faceAmount * .7))) channels.add("claim-buyback");
  if (game.playerState.form === "animal" && game.traders.player.sardines >= 3) channels.add("dima-proxy");
  return channels.size;
}

function resolveMatters(game, policy) {
  for (const matter of duePrivateMatters(game)) {
    let action;
    if (matter.debtorId === "juan") action = policy === "CLAIMS_DISTRESSED" && matter.extensionCount < 1 ? "extend" : matter.linkedProductiveAsset && game.traders.juan.sardines < matter.faceAmount ? "liquidate" : "collect";
    else if (matter.kind === "future-delivery") action = game.traders.player.inventory.includes(matter.item) ? "deliver" : "default";
    else action = game.traders.player.sardines >= matter.amount ? "repay" : "seize";
    game = resolveDuePrivateMatter(game, matter.id, action);
  }
  return game;
}

function dismissEvents(game) {
  for (const event of [...game.pendingEvents]) game = resolveEvent(game, event.id, event.actions?.at(-1) || "Decline");
  return game;
}

function run(policy, horizon, pausePolicy) {
  let game = createGame();
  game.maxDays = horizon;
  const daily = [];
  while (!game.ended) {
    game = advancePhase(game);
    const day = game.day;
    const evidenceStart = game.decisionEvidence.length;
    const cashStart = sum(ACTORS.map((id) => game.traders[id].sardines));
    game = act(game, policy, "morning");
    if (game.actionsRemaining) game = act(game, policy, "morning");
    game = advancePhase(game);
    if (pausePolicy === "RESIST_WHEN_USEFUL" && game.sunMoment.eligible) {
      game = resistSunMoment(game);
      const order = game.lockedPlayerOrders[0];
      game = applyLateOrderEdit(game, 0, { ...order, sardines: Math.min(game.noonOpeningPlayer.cash, order.sardines + 1) });
    }
    game = resolveNoonMarket(game);
    game = dismissEvents(game);
    const todayTrades = game.history.filter((trade) => trade.day === day);
    const visibleOpportunities = visibleSellListings(game).length + game.inboundOffers.filter((entry) => entry.day === day && entry.status === "pending").length + game.information.filter((info) => informationBuyers(game, info).length).length;
    game = advancePhase(game);
    game = act(game, policy, "afternoon");
    if (game.actionsRemaining) game = act(game, policy, "afternoon");
    game = advancePhase(game);
    game = resolveMatters(game, policy);
    const lowCashRoutes = game.traders.player.sardines <= 3 ? recoveryChannels(game) : null;
    game = advancePhase(game);
    const evidence = game.decisionEvidence.slice(evidenceStart);
    daily.push({ day, trades: todayTrades.length, visibleOpportunities, lowCashRoutes, cashStart, cashEnd: sum(ACTORS.map((id) => game.traders[id].sardines)), evidence });
  }

  const privateFlows = Object.fromEntries(ACTORS.map((id) => [id, 0]));
  const financeFlows = Object.fromEntries(ACTORS.map((id) => [id, 0]));
  const claimFlows = Object.fromEntries(ACTORS.map((id) => [id, 0]));
  const move = (bucket, from, to, amount) => { bucket[from] -= Number(amount || 0); bucket[to] += Number(amount || 0); };
  game.decisionEvidence.forEach((entry) => {
    if (["information-sold", "inbound-information-accepted"].includes(entry.type)) move(privateFlows, entry.buyerId, "player", entry.price);
    if (entry.type === "information-exclusivity-sold") move(privateFlows, entry.buyerId, "player", entry.price);
    if (entry.type === "relationship-loan-opened") move(financeFlows, entry.counterpartyId, "player", entry.amount);
    if (entry.type === "secured-loan-opened") move(financeFlows, entry.counterpartyId, "player", entry.principal);
    if (["credit-repaid", "secured-loan-repaid"].includes(entry.type)) move(financeFlows, "player", entry.creditorId, entry.amount);
    if (entry.type === "proxy-access" && !entry.onCredit) move(financeFlows, "player", entry.via, entry.fee);
    if (entry.type === "claim-transferred") { move(claimFlows, "player", entry.oldHolder, entry.transferPrice); if (entry.fee) move(claimFlows, "player", "dima", entry.fee); }
    if (entry.type === "claim-buyback") move(claimFlows, "juan", "player", entry.price);
    if (["claim-collected", "claim-forced-liquidation"].includes(entry.type)) move(claimFlows, "juan", "player", entry.recovered);
  });
  const actorRows = ACTORS.map((id) => {
    const buys = game.history.filter((trade) => trade.from === id);
    const sales = game.history.filter((trade) => trade.to === id);
    const ledger = game.recurringLedger.filter((entry) => entry.actorId === id);
    return {
      actor: id, cash: game.traders[id].sardines, wealth: actorWealth(game, id), claimValue: sum(game.claims.filter((claim) => claim.status === "open" && claim.currentHolderId === id).map((claim) => claim.faceAmount)), claimLiabilities: sum(game.claims.filter((claim) => claim.status === "open" && claim.debtorId === id).map((claim) => claim.faceAmount)), publicBuys: buys.length, publicBuyValue: sum(buys.map((trade) => trade.sardines)), publicSales: sales.length, publicSaleValue: sum(sales.map((trade) => trade.sardines)),
      outsideIncome: sum(ledger.filter((entry) => entry.amount > 0).map((entry) => entry.amount)), outsideCost: -sum(ledger.filter((entry) => entry.amount < 0).map((entry) => entry.amount)),
      householdSocialSupportBurn: -sum(ledger.filter((entry) => /household|rescue|social-position|support-personal/.test(entry.category) && entry.amount < 0).map((entry) => entry.amount)),
      businessInputs: -sum(ledger.filter((entry) => /business-input|planting|physical-arrival|seed-sourcing/.test(entry.category) && entry.amount < 0).map((entry) => entry.amount)),
      privateCashflows: privateFlows[id], financePrincipalFees: financeFlows[id], claimsBrokerage: claimFlows[id],
      liquidationSeizure: sum(ledger.filter((entry) => /liquidation/.test(entry.category)).map((entry) => entry.amount)),
      sterlingFamilySubsidy: id === "sterling" ? sum(ledger.filter((entry) => entry.category === "family-subsidy").map((entry) => entry.amount)) : 0,
    };
  });
  const salesCounts = actorRows.filter((row) => row.actor !== "player").map((row) => row.publicSales);
  const salesValues = actorRows.filter((row) => row.actor !== "player").map((row) => row.publicSaleValue);
  const cash = ACTORS.map((id) => game.traders[id].sardines);
  const wealths = ACTORS.map((id) => Math.max(0, actorWealth(game, id)));
  const deadDays = daily.filter((row) => !row.trades).length;
  let streak = 0, maxDeadStreak = 0;
  daily.forEach((row) => { streak = row.trades ? 0 : streak + 1; maxDeadStreak = Math.max(maxDeadStreak, streak); });
  const publicCashVolume = sum(game.history.map((trade) => trade.sardines));
  const claimTransfers = game.decisionEvidence.filter((entry) => entry.type === "claim-transferred");
  const warnings = [];
  if (daily.slice(0, 10).some((_, index) => index >= 2 && daily.slice(index - 2, index + 1).every((row) => !row.trades))) warnings.push(">2 consecutive dead public-market days in first 10");
  if (horizon === 42 && deadDays / horizon > .5) warnings.push("42-day dead-day share >50%");
  if (horizon === 100 && deadDays / horizon > .6) warnings.push("100-day dead-day share >60%");
  if (hhi(cash) > .3) warnings.push("sustained cash HHI >.30");
  if (Math.max(...cash) / sum(cash) > .4) warnings.push("largest actor cash share >40%");
  const largestSalesCount = Math.max(...salesCounts), largestSalesValue = Math.max(...salesValues);
  if (horizon >= 42 && largestSalesCount / Math.max(1, sum(salesCounts)) > .5 && largestSalesValue / Math.max(1, sum(salesValues)) > .35) warnings.push("one actor >50% sales count AND >35% sales value long-run");
  const lowCashDays = daily.filter((row) => row.lowCashRoutes !== null);
  if (lowCashDays.length && lowCashDays.filter((row) => row.lowCashRoutes < 2).length > lowCashDays.length / 2) warnings.push("low-cash states usually <2 recovery routes");
  for (const [actor, category] of [["aspen", "voyage-return"], ["sterling", "outside-service-revenue"], ["yasmin", "outside-capital-family-yield"], ["wong", "labour-produced-salvage"], ["juan", "crop-maturity"], ["octopus", "physical-arrival"]]) if (!game.recurringLedger.some((entry) => entry.actorId === actor && entry.category === category)) warnings.push(`${actor} intended loop never completed`);
  if (game.settlementFloat !== 0 || game.clearingBatches.some((batch) => !batch.reconciled || batch.settlementFloat !== 0)) warnings.push("clearing float nonzero / included in wealth");
  const capability = {
    NO_ACTION: true,
    PUBLIC_DEALER: game.history.some((trade) => trade.from === "player") && game.history.some((trade) => trade.to === "player"),
    VALUE_CONSERVATIVE: game.history.some((trade) => trade.from === "player"), HIGH_TURNOVER: game.history.some((trade) => trade.from === "player" || trade.to === "player"),
    INFORMATION_BROKER: game.decisionEvidence.some((entry) => ["information-sold", "information-exclusivity-sold", "information-favour"].includes(entry.type)),
    RELATIONSHIP_OPERATOR: game.decisionEvidence.some((entry) => ["relationship-loan-opened", "information-favour", "proxy-access"].includes(entry.type)),
    SECURED_LIQUIDITY: game.decisionEvidence.some((entry) => entry.type === "secured-loan-opened"), CLAIMS_DISTRESSED: claimTransfers.length > 0,
    LOW_VARIANCE_CONTRACT: game.decisionEvidence.some((entry) => entry.type === "future-delivery-bound"), HIGH_RISK_SPECIAL: false,
    MIXED_ADAPTIVE: game.history.some((trade) => trade.from === "player" || trade.to === "player") && game.decisionEvidence.some((entry) => ["talk", "investigate", "information-sold"].includes(entry.type)),
  }[policy];
  if (!capability) warnings.push(`${policy} unable to access defining mechanic${policy === "HIGH_RISK_SPECIAL" ? " (capability-incomplete: true high-risk mechanics do not exist)" : ""}`);
  const resistances = game.sunMomentHistory.filter((entry) => entry.state === "resisted").length;
  const lateEdits = game.decisionEvidence.filter((entry) => entry.type === "sun-moment-late-order-edit").length;
  if (resistances && lateEdits !== resistances) warnings.push("Noon resistance became unconditional free-action dominance");
  const privateDeals = game.decisionEvidence.filter((entry) => ["information-sold", "information-exclusivity-sold", "information-favour", "claim-transferred"].includes(entry.type)).length;
  return {
    policy, horizon, pausePolicy, game, daily, actorRows, warnings, snapshot: economicSnapshot(game), deadDays, maxDeadStreak,
    publicFills: game.history.length, privateDeals, claimTransfers: claimTransfers.length,
    infoTransactions: game.decisionEvidence.filter((entry) => ["information-sold", "information-exclusivity-sold", "information-favour", "inbound-information-accepted"].includes(entry.type)).length,
    uniqueGoods: new Set(game.history.map((trade) => trade.item)).size, uniqueCounterparties: new Set(game.history.flatMap((trade) => [trade.from, trade.to])).size,
    visibleOpportunitiesPerDay: sum(daily.map((row) => row.visibleOpportunities)) / horizon, cashVelocity: publicCashVolume / Math.max(1, sum(daily.map((row) => row.cashStart)) / horizon), goodsTurnover: game.history.length / horizon,
    claimHoldingDuration: claimTransfers.length ? sum(game.claims.filter((claim) => claim.transferHistory.length).map((claim) => (claim.settledDay || horizon) - claim.transferHistory.at(-1).day)) / claimTransfers.length : 0,
    lowCashDays: daily.filter((row) => row.lowCashRoutes !== null).length, lowCashRecoveryRoutesMean: lowCashDays.length ? sum(lowCashDays.map((row) => row.lowCashRoutes)) / lowCashDays.length : 0,
    publicShare: game.history.length / Math.max(1, game.history.length + privateDeals),
    cashHHI: hhi(cash), wealthHHI: hhi(wealths), salesCountHHI: hhi(salesCounts), salesValueHHI: hhi(salesValues), largestCashShare: Math.max(...cash) / sum(cash), largestWealthShare: Math.max(...wealths) / sum(wealths), largestSalesCountShare: largestSalesCount / Math.max(1, sum(salesCounts)), largestSalesValueShare: largestSalesValue / Math.max(1, sum(salesValues)),
    claimHolderConcentration: hhi(ACTORS.map((id) => game.claims.filter((claim) => claim.status === "open" && claim.currentHolderId === id).reduce((total, claim) => total + claim.faceAmount, 0))),
    infoBrokerConcentration: hhi(ACTORS.map((id) => game.informationTrades.filter((trade) => trade.from === id).length)),
    sun: { moments: game.sunMomentHistory.length, eligibleNoons: game.sunMomentHistory.filter((entry) => entry.moment === "noon" && entry.contextualOpportunityIds.length).length, naturalPauses: game.sunMomentHistory.filter((entry) => entry.state === "natural_pause").length, resistances, lateEdits, immediateFactualValue: 0, laterAttributedValue: sum(game.decisionEvidence.filter((entry) => entry.type === "market-order-outcome" && entry.outcome === "filled" && game.decisionEvidence.some((late) => late.type === "sun-moment-late-order-edit" && late.orderId === entry.orderId)).map((entry) => entry.referencePnL)) },
  };
}

const runs = HORIZONS.flatMap((horizon) => POLICIES.flatMap((policy) => (policy === "VALUE_CONSERVATIVE" ? PAUSE_POLICIES : ["NATURAL_PAUSE"]).map((pausePolicy) => run(policy, horizon, pausePolicy))));
console.log("\nECONOMIC HEALTH POLICY TABLE");
console.table(runs.map((run) => ({ policy: run.policy, pause: run.pausePolicy, days: run.horizon, currentCash: run.snapshot.currentBodyCash, currentWealth: run.snapshot.currentBodyWealth, estateWealth: run.snapshot.formerEstateWealth, legalWealth: run.snapshot.legallyAccessibleWealth, claims: run.snapshot.currentBodyClaimsReference, liabilities: run.snapshot.currentBodyLiabilities, transitions: run.snapshot.formTransitionCount, publicFills: run.publicFills, privateDeals: run.privateDeals, claimTransfers: run.claimTransfers, infoTransactions: run.infoTransactions, uniqueGoods: run.uniqueGoods, counterparties: run.uniqueCounterparties, deadDays: run.deadDays, maxDead: run.maxDeadStreak, visibleOppsPerDay: run.visibleOpportunitiesPerDay.toFixed(1), cashVelocity: run.cashVelocity.toFixed(3), turnover: run.goodsTurnover.toFixed(3), claimHoldDays: run.claimHoldingDuration.toFixed(1), publicShare: run.publicShare.toFixed(3), lowCashDays: run.lowCashDays, lowCashRoutes: run.lowCashRecoveryRoutesMean.toFixed(1), cashHHI: run.cashHHI.toFixed(3), wealthHHI: run.wealthHHI.toFixed(3), salesCountHHI: run.salesCountHHI.toFixed(3), salesValueHHI: run.salesValueHHI.toFixed(3), largestCashShare: run.largestCashShare.toFixed(3), largestWealthShare: run.largestWealthShare.toFixed(3), largestSalesCountShare: run.largestSalesCountShare.toFixed(3), largestSalesValueShare: run.largestSalesValueShare.toFixed(3), claimHolderHHI: run.claimHolderConcentration.toFixed(3), infoBrokerHHI: run.infoBrokerConcentration.toFixed(3), warnings: run.warnings.length })));
console.log("\nACTOR P&L / DOMINANCE TABLE");
console.table(ACTORS.map((actor) => { const rows = runs.map((run) => run.actorRows.find((row) => row.actor === actor)); return { actor, endingCashMean: (sum(rows.map((row) => row.cash)) / rows.length).toFixed(1), endingWealthMean: (sum(rows.map((row) => row.wealth)) / rows.length).toFixed(1), claimValue: sum(rows.map((row) => row.claimValue)), claimLiabilities: sum(rows.map((row) => row.claimLiabilities)), publicBuys: sum(rows.map((row) => row.publicBuys)), publicBuyValue: sum(rows.map((row) => row.publicBuyValue)), publicSales: sum(rows.map((row) => row.publicSales)), publicSaleValue: sum(rows.map((row) => row.publicSaleValue)), privateCashflows: sum(rows.map((row) => row.privateCashflows)), outsideIncome: sum(rows.map((row) => row.outsideIncome)), outsideCost: sum(rows.map((row) => row.outsideCost)), householdSocialSupportBurn: sum(rows.map((row) => row.householdSocialSupportBurn)), businessInputs: sum(rows.map((row) => row.businessInputs)), financePrincipalFees: sum(rows.map((row) => row.financePrincipalFees)), claimsBrokerage: sum(rows.map((row) => row.claimsBrokerage)), liquidationSeizure: sum(rows.map((row) => row.liquidationSeizure)), sterlingFamilySubsidy: sum(rows.map((row) => row.sterlingFamilySubsidy)) }; }));
console.log("\nCHARACTER LOOP TABLE");
console.table(ACTORS.filter((actor) => actor !== "player").map((actor) => { const entries = runs.flatMap((run) => run.game.recurringLedger.filter((entry) => entry.actorId === actor)); const counts = Object.fromEntries([...new Set(entries.map((entry) => entry.category))].sort().map((category) => [category, entries.filter((entry) => entry.category === category).length])); const batches = actor === "octopus" ? runs.flatMap((run) => run.game.clearingBatches) : []; return { actor, events: entries.length, grossIncome: sum(entries.filter((entry) => entry.amount > 0).map((entry) => entry.amount)), grossCost: -sum(entries.filter((entry) => entry.amount < 0).map((entry) => entry.amount)), cycles: entries.filter((entry) => /return|maturity|outside-service-revenue|labour-produced-salvage/.test(entry.category)).length, delays: entries.filter((entry) => entry.category === "voyage-delay").length, destroyedFutureValue: sum(entries.map((entry) => entry.destroyedFutureValue)), clearingBatches: batches.length, clearingCash: sum(batches.map((batch) => batch.cashTotal)), floatFailures: batches.filter((batch) => !batch.reconciled || batch.settlementFloat !== 0).length, categories: JSON.stringify(counts) }; }));
console.log("\nSUN MOMENT NATURAL VS RESIST TABLE");
console.table(runs.filter((run) => run.policy === "VALUE_CONSERVATIVE").map((run) => ({ policy: run.policy, days: run.horizon, pause: run.pausePolicy, moments: run.sun.moments, eligibleNoons: run.sun.eligibleNoons, naturalPauses: run.sun.naturalPauses, resistances: run.sun.resistances, lateEdits: run.sun.lateEdits, immediateFactualValue: run.sun.immediateFactualValue, laterAttributedValue: run.sun.laterAttributedValue, endingLegalWealth: run.snapshot.legallyAccessibleWealth })));
console.log("\nWARNINGS");
runs.filter((run) => run.warnings.length).forEach((run) => console.log(`${run.policy} / ${run.pausePolicy} / ${run.horizon}d: ${run.warnings.join("; ")}`));
