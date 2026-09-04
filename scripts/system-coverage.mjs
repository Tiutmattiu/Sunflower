import assert from "node:assert/strict";
import {
  acceptFutureDelivery, advancePhase, applyLateOrderEdit, buyJuanClaim, createGame, fulfillFutureDelivery,
  requestMarketProxy, resistSunMoment, resolveDuePrivateMatter, resolveNoonMarket, sellInformationExclusive,
} from "../src/gameEngine.js";
import { sellerAsk } from "../src/npcAI.js";

const morning = () => advancePhase(createGame());
const exercised = new Set();

let game = morning();
game.information.push(
  { id: "lime-source", claimType: "holding", subjectId: "sterling", item: "Lime Crate", text: "Sterling has Lime.", source: "investigation", precision: "exact", confidence: "high", freshness: "current", observedDay: 1, knownBy: ["player"] },
  { id: "lime-need", claimType: "need", subjectId: "aspen", item: "Lime Crate", text: "Aspen needs Lime.", source: "conversation", precision: "exact", confidence: "high", freshness: "current", observedDay: 1, knownBy: ["player"] },
);
game = acceptFutureDelivery(game);
const future = game.obligations.find((entry) => entry.kind === "future-delivery");
game.traders.player.inventory.push("Lime Crate"); game.phase = "afternoon"; game.actionsRemaining = 1;
game = fulfillFutureDelivery(game, future.id);
assert(game.badges.some((badge) => badge.id === "sold-before-owned"));
exercised.add("future-delivery"); exercised.add("sold-before-owned");

game = morning();
game.information.push({ id: "exclusive-oil", claimType: "holding", subjectId: "aspen", item: "Sperm Whale Oil", text: "Aspen has oil.", source: "investigation", precision: "exact", confidence: "high", freshness: "current", observedDay: 1, exclusive: true, sellable: true, soldTo: [], sharedWith: [], knownBy: ["player"], diffusionCount: 0, personallyVerified: true });
game = sellInformationExclusive(game, "exclusive-oil", "yasmin");
game.marketPlan = [{ from: "yasmin", to: "aspen", wantItem: "Sperm Whale Oil", offerItem: null, sardines: sellerAsk(game, "aspen", "Sperm Whale Oil"), infoId: "exclusive-oil" }];
game = advancePhase(game); game = resolveNoonMarket(game); game = advancePhase(game); game = advancePhase(game); game = advancePhase(game); game = advancePhase(game); game = advancePhase(game); game = resolveNoonMarket(game);
assert(game.badges.some((badge) => badge.id === "exclusive"));
exercised.add("exclusive"); exercised.add("information");

game = morning();
game.playerState.form = "animal"; game.playerState.legalIdentity.status = "unrecognized";
game = requestMarketProxy(game, "dima");
assert(game.decisionEvidence.some((entry) => entry.type === "proxy-access" && entry.via === "dima"));
exercised.add("dima-proxy");

game = morning();
game.claims.find((claim) => claim.id === "juan-sterling-tab").knownByPlayer = true;
game = buyJuanClaim(game, "juan-sterling-tab");
assert(game.decisionEvidence.some((entry) => entry.type === "claim-transferred" && entry.fee === 1));
const bought = game.claims.find((claim) => claim.id === "juan-sterling-tab");
game.day = bought.dueDay; game.phase = "sunset"; game.traders.juan.sardines = bought.faceAmount;
game = resolveDuePrivateMatter(game, bought.id, "collect");
assert(game.decisionEvidence.some((entry) => entry.type === "claim-collected"));
exercised.add("claim-buy"); exercised.add("claim-collect"); exercised.add("dima-broker");

game = createGame();
let distressed = game.claims.find((claim) => claim.id === "juan-dima-roll");
distressed.knownByPlayer = true; distressed.currentHolderId = "player"; distressed.creditorId = "player"; distressed.currentHolderLifeId = "life-1";
game.day = distressed.dueDay; game.phase = "sunset";
game = resolveDuePrivateMatter(game, distressed.id, "extend");
distressed = game.claims.find((claim) => claim.id === distressed.id);
game.day = distressed.dueDay; game.phase = "sunset"; game.traders.juan.sardines = 0; game.crops.push({ id: "coverage-crop", plantedDay: game.day - 2, maturityDay: game.day + 2, status: "growing", linkedAssetId: "juan-crop-cycle" });
game = resolveDuePrivateMatter(game, distressed.id, "liquidate");
assert(game.decisionEvidence.some((entry) => entry.type === "claim-extended"));
assert(game.decisionEvidence.some((entry) => entry.type === "claim-forced-liquidation"));
exercised.add("claim-extend"); exercised.add("claim-liquidate");

game = morning();
game.information.push({ id: "noon-info", claimType: "holding", subjectId: "octopus", item: "Fresh Mackerel", text: "Octopus has fish.", source: "investigation", precision: "exact", confidence: "high", freshness: "current", observedDay: 1, knownBy: ["player"] });
game.decisionEvidence.push({ id: "coverage-investigate", day: 1, phase: "morning", type: "investigate", informationId: "noon-info" });
game.playerOrders[0] = { to: "octopus", wantItem: "Fresh Mackerel", offerItem: "", sardines: sellerAsk(game, "octopus", "Fresh Mackerel") };
game = advancePhase(game); game = resistSunMoment(game); game = applyLateOrderEdit(game, 0, { ...game.lockedPlayerOrders[0], sardines: game.lockedPlayerOrders[0].sardines + 1 }); game = resolveNoonMarket(game);
assert(game.clearingBatches[0].settledBy === "octopus" && game.clearingBatches[0].settlementFloat === 0);
assert(game.decisionEvidence.some((entry) => entry.type === "sun-moment-late-order-edit"));
exercised.add("octopus-clearing"); exercised.add("sun-resistance");

const rows = [
  ["1 order/settlement", "yes", "yes", "yes", "yes", "yes", "octopus-clearing"],
  ["2 arbitrage/alpha decay", "yes", "yes", "yes", "yes", "yes", "information"],
  ["3 future delivery", "yes", "yes", "yes", "yes", "yes", "sold-before-owned"],
  ["4 negotiation/BATNA", "partial", "yes", "yes", "yes", "yes", "octopus-clearing"],
  ["5 liquidity/financing", "yes", "yes", "yes", "yes", "yes", "claim-buy"],
  ["6 relationship credit", "yes", "yes", "yes", "yes", "yes", "future-delivery"],
  ["7 private information", "yes", "yes", "yes", "yes", "yes", "information"],
  ["8 information brokerage/exclusivity", "yes", "yes", "yes", "yes", "yes", "exclusive"],
  ["9 quality/deception", "yes", "yes", "yes", "yes", "yes", "octopus-clearing"],
  ["10 market making", "partial", "yes", "yes", "yes", "no", "octopus-clearing"],
  ["11 execution/venue", "yes", "yes", "yes", "yes", "yes", "dima-proxy"],
  ["12 auction", "partial", "yes", "yes", "no", "yes", null],
  ["13 confidence run/fire sale", "no", "no", "no", "no", "no", null],
  ["14 leverage/position sizing", "partial", "yes", "yes", "yes", "yes", "claim-liquidate"],
  ["15 price vs value", "yes", "yes", "yes", "yes", "yes", "octopus-clearing"],
  ["16 institutions/formal-informal", "yes", "yes", "yes", "yes", "yes", "dima-broker"],
].map(([domain, implemented, reachable, evidence, notebook, realised, proof]) => ({ domain, implemented, "player-visible reachable": reachable, evidence: proof ? (exercised.has(proof) ? evidence : "no") : evidence, "Notebook path": notebook, "realised case/badge": realised }));

assert(["claim-buy", "claim-collect", "claim-extend", "claim-liquidate", "dima-proxy", "dima-broker", "sun-resistance", "octopus-clearing", "sold-before-owned", "exclusive"].every((item) => exercised.has(item)));
console.log("\n16 TRADING/TEACHING DOMAINS — SYSTEM COVERAGE");
console.table(rows);
