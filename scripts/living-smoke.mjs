// Targeted design regression smoke. No test framework / CI required.
import assert from "node:assert/strict";
import {
  acceptInboundOffer,
  advancePhase,
  buildInboundOffers,
  createGame,
  giveItem,
  informationPrice,
  publiclyKnownPlayerItems,
  resolveNoonMarket,
  shareInformationAsFavor,
} from "../src/livingGame.js";

function enterMorning(game = createGame()) {
  return advancePhase(game);
}

// The world notices the player: Dog can see the Fish Bones the outsider is visibly carrying.
let game = enterMorning();
assert(publiclyKnownPlayerItems(game).includes("Fish Bones"));
const dogOffer = game.inboundOffers.find((offer) => offer.kind === "buy-item" && offer.buyerId === "dog" && offer.item === "Fish Bones");
assert(dogOffer, "Day 1 should contain a causally justified inbound offer from Dog for visible Fish Bones");
const beforeCash = game.traders.player.sardines;
game = acceptInboundOffer(game, dogOffer.id);
assert.equal(game.inboundOffers.find((offer) => offer.id === dogOffer.id).status, "accepted");
assert(game.marketPlan.some((order) => order.from === "dog" && order.to === "player" && order.wantItem === "Fish Bones"));
game = advancePhase(game);
game = resolveNoonMarket(game);
assert(game.traders.dog.inventory.includes("Fish Bones"));
assert(!game.traders.player.inventory.includes("Fish Bones"));
assert(game.traders.player.sardines > beforeCash);

// Information is worth more when precise/exclusive and decays as it spreads.
game = enterMorning();
game.information.push({
  id: "manual-lead",
  claimType: "holding",
  subjectId: "mechanic",
  item: "Sperm Whale Oil",
  text: "Sailor has Sperm Whale Oil below deck.",
  source: "personal investigation",
  precision: "exact",
  confidence: "high",
  observedDay: 1,
  freshness: "current",
  exclusive: true,
  sellable: true,
  soldTo: [],
  sharedWith: [],
  knownBy: ["player"],
  diffusionCount: 0,
  personallyVerified: true,
});
const lead = game.information.find((info) => info.id === "manual-lead");
const exclusivePrice = informationPrice(game, lead, "vale");
lead.knownBy.push("dog", "bar");
lead.diffusionCount = 2;
lead.exclusive = false;
const spreadPrice = informationPrice(game, lead, "vale");
assert(exclusivePrice > spreadPrice, "information should lose resale value as it diffuses");

// Giving information as a favour converts information into relationship capital instead of cash.
lead.knownBy = ["player"];
lead.diffusionCount = 0;
lead.exclusive = true;
const valeRelationship = game.relationships.vale;
game = shareInformationAsFavor(game, lead.id, "vale");
assert.equal(game.relationships.vale, valeRelationship + 1);
assert(game.learningNotes.some((note) => note.id === "relationship-capital"));

// A physical gift is also a non-market allocation path.
game = enterMorning();
const dogRelationship = game.relationships.dog;
game = giveItem(game, "dog", "Chia Seeds");
assert(game.relationships.dog > dogRelationship);
assert(!game.traders.player.inventory.includes("Chia Seeds"));
assert(game.traders.dog.inventory.includes("Chia Seeds"));
assert(game.learningNotes.some((note) => note.id === "gift-economy"));

// Onewheel production now uses actual bicycle parts; Lime remains provisioning, not a magic repair ingredient.
game = enterMorning();
game.traders.mechanic.inventory = game.traders.mechanic.inventory.filter((item) => !["Built Onewheel", "Steel Rim", "Handlebar Tape"].includes(item));
game.traders.mechanic.inventory.push("Chain Quick-Link", "Brake Cable", "Tiny Torque Wrench", "Handlebar Tape");
game.traders.player.inventory.push("Steel Rim");
game = giveItem(game, "mechanic", "Steel Rim");
assert(game.traders.mechanic.inventory.includes("Built Onewheel"), "complete bicycle parts should produce a working onewheel");
assert(!game.traders.mechanic.inventory.includes("Steel Rim"));
assert(game.traders.mechanic.inventory.includes("Tiny Torque Wrench"), "durable tool should not be consumed as a part");

// Broad inbound generation remains bounded rather than becoming another dashboard flood.
game = enterMorning();
assert(buildInboundOffers(game, "morning").length <= 2);

console.log("Living systems smoke passed.");
