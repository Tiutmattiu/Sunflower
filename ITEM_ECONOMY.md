# Sunflower — Item Economy

> Status: active system design and live-code audit. Keep this document focused on what goods *do economically* and how the market feels. Do not collect objects merely to inflate the catalogue.

## Core rule

**More items are only useful when they create more decisions, more market texture, or more inference.**

Sunflower is a trading game, not a key-and-lock adventure.

An NPC wanting `X` should normally mean `X`, unless a broader category or substitute relationship has been made legible to the player through ordinary world knowledge, professional expertise, explicit dialogue, public listings, or acquired information.

### No invisible substitute puzzles

Do not silently implement rules such as:

> Sailor says Lime, but Dried Citrus Peel secretly counts as 60% Lime.

That makes the player guess the designer rather than read a market.

A substitute is valid only when at least one of these is true:

- the need was stated as a category;
- the NPC explicitly says alternatives are acceptable;
- the relationship is ordinary enough to infer from real knowledge;
- the player can discover the substitution rule as information before committing the trade.

The engine should not award hidden partial credit for designer-only associations.

---

## Current catalogue size

As of the September 4 live audit, `ITEMS` contains **67 item definitions** after deleting the obsolete `Auction Sunflower` pseudo-item.

That is enough for the current design phase.

Target range for the eventual game:

- roughly **60–80 total goods** across all forms / routes;
- only roughly **20–30 should be economically legible in an early Human run**;
- another **10–15 can enter through later arrivals, relationships, events and hidden stock**;
- form-specific / black-market / Sailor goods can make the same world feel new on replay without putting the whole catalogue on one screen.

Do not add another large batch until this pool has been played, cut and aesthetically refined.

---

# Live-item rule

A kept item should satisfy at least one of these in live code:

1. exists in a starting inventory;
2. arrives through a deterministic business cycle;
3. is produced / transformed by an implemented rule;
4. can be consumed or used by a business/body;
5. is an explicit NPC need;
6. matches at least one stable NPC market interest;
7. is a route / event output;
8. carries information, access, collateral, sentimental or form-specific meaning that is intended for a near-term mechanic.

A pure definition in `ITEMS` with no path into play is a bug, not content.

### Reachability audit result

The current pool now has a live path:

- starting inventories seed most goods;
- Dock Dog cycles scavenged / animal-network goods, including the previously dead `Pocket Match`;
- Fishmonger cycles fresh catch, ice and sea produce;
- Sailor cycles imported repair, bicycle, bar-tool and mystery cargo until departure;
- `Mai Tai`, `Built Onewheel`, `Auction Onewheel`, spoilage and the living `Sunflower` are produced by rules/events rather than normal supply.

The living Sunflower is **not** represented by a separate ordinary `Auction Sunflower` asset anymore. Vale's reserve is event-level pricing, not an intrinsic/reference price attached to a flower item.

This should still be rechecked by Codex/runtime smoke because static reachability is not the same as a fun market.

---

# First coordinated price rebase — 2026-09-03

The original 1–16🥫 ordinary price band was too compressed. A one-tin change often meant a 20–50% move, making spread, urgency, market heat, relationship effects and distressed pricing impossible to distinguish cleanly.

The first rebase widens the asset scale **without redefining what a sardine tin is**.

A tin still has literal survival meaning: nightly sustenance can still consume **1🥫**. The point is that a professional tool should cost many tins, not that dinner should suddenly cost four abstract currency points.

### Current reference-price bands

| Broad class | Current rough band |
|---|---:|
| waste / tiny junk | 1–3🥫 |
| small everyday / scavenged object | 2–6🥫 |
| common food / commodity | 4–9🥫 |
| cocktail ingredient / ordinary part | 5–14🥫 |
| useful durable / professional tool | 7–18🥫 |
| scarce input / collateral-like durable | 12–20🥫 |
| prestige / collectible / special situation | 9–22+🥫 |
| vehicle / major route asset | 28–30+🥫 |
| living `Sunflower` | **unpriced** |

Vale's current auction reserve is a **provisional event price**, not the Sunflower's reference value.

These are **reference prices**, not intrinsic value.

### Current liquidity pools

First-pass starting cash was rebased with the goods:

- Player: 18🥫
- Dock Dog: 18🥫
- Fishmonger: 30🥫
- Sailor: 26🥫
- Mirelle Vale: 52🥫
- Onewheel Clown: 22🥫
- Bar Apprentice: 34🥫

These numbers are provisional and should be tuned from play, not protected because they look neat.

### Still intentionally small

- nightly sustenance: 1 food unit or 1🥫;
- information sale base: 2🥫 (code migration still needs runtime verification);
- formal-market proxy fee: 2🥫.

Keeping survival small relative to assets is deliberate: hunger matters as a liquidity floor without turning the whole game into food survival accounting.

---

# Market interests: make objects tradeable without making them quest keys

The NPC engine now has stable category interests in addition to explicit goals.

This is deliberately small and legible:

- **Dock Dog** — scavenged goods, animal-network goods, tiny utilities, containers;
- **Fishmonger** — food commodities, cold-chain goods, harbour material;
- **Sailor** — bicycle goods, repair inputs, tools, durable goods;
- **Vale** — prestige, collectibles, provenance/story, information-bearing goods, curios, mystery assets;
- **Clown** — speculative junk, vehicles, bicycle goods, mystery assets, strange stories;
- **Bar Apprentice** — cocktail ingredients, professional bar tools, barware, containers.

A market interest is **not** omniscience.

NPCs may act on interests only when the item is public, appears on the public tape, or has become known through acquired information. Broad interests do not scan hidden inventories.

Explicit needs can still motivate targeted investigation through plausible contacts.

This lets objects circulate because different actors value categories differently while preserving information asymmetry.

---

# Market texture by trader

## Dock Dog — harbour reality + surreal everyday debris

Typical goods:

- Dead Pigeon
- Chewed Rope Toy
- Red Ribbon
- Empty Green Bottle
- Glasses Wipe
- Bicycle Bell
- Chia Seeds
- Pocket Match

Dog should make low-value objects feel surprisingly connected to people, animals and information.

## Fishmonger — material harbour goods + accidental oddities

Typical goods:

- Fresh Mackerel
- Smoked Eel
- Two Octopus Tentacles
- Ice Block
- Rusty Harpoon
- an inexplicable Orgeat Bottle acquired through barter / debt / misdelivery
- an equally inexplicable Hawthorne Strainer

Fishmonger's weird objects should feel weird because they do not belong in an otherwise comprehensible operating business.

## Sailor — cross-border material goods + professional equipment + strange cargo

Typical goods:

- Brass Compass
- Sperm Whale Oil
- Sealed Parcel
- Presta Inner Tube
- Chain Quick-Link
- Brake Cable
- Tiny Torque Wrench
- 30/45 Jigger
- Fine Mesh Strainer
- Three Metres of Stolen Theatre Wire
- Patch Cut from the Ship Mercy

Sailor stock should carry geography, provenance and mobility.

## Mirelle Vale — story fragments + elite / illiquid collectibles

Typical goods:

- Valentino Still
- Film Canister
- One White Glove
- Numbered Funeral Ticket
- Taxidermied Moth
- Unsent Letter

Vale's inventory should make the player ask whether price comes from use, scarcity, provenance, fashion, status or somebody else's willingness to pay.

## Bar Apprentice — professional bar equipment + relationship objects

Typical goods / needs:

- Rum Bottle
- Orange Curaçao
- Demerara Syrup
- Long Bar Spoon
- Hand Citrus Press
- Lewis Bag
- Chipped Nick & Nora Glass
- missing / desired professional tools such as Hawthorne Strainer, Jigger and Fine Mesh Strainer

The Bar should reward actual cocktail knowledge without becoming a recipe quiz. A knowledgeable player may infer more from incomplete observations and therefore spend fewer information actions.

## Onewheel Clown — surreal everyday goods + speculative junk + mobility debris

Typical goods:

- Lollipop
- Lucky Sticker
- Glitter Tape
- Handlebar Tape
- Key That Opens Nothing
- Tool Roll

Clown can assign coherent private utility to things other traders dismiss without turning every weird item into a secret quest key.

---

# Important item families

### Food / sustenance

Fresh Mackerel, Smoked Eel, Two Octopus Tentacles, Sea Lettuce, Salted Cod, Hardtack and Chia Seeds can all compete with the decision to preserve inventory for resale.

### Perishables / timing

Ice, Bruised Mint, Lime, Fresh Mackerel and Tentacles produce storage and fire-sale pressure.

### Recurring inputs

The Bar consumes ice. Dock Dog consumes fresh fish for the cat colony. Demand should return because businesses and bodies continue doing things, not because a quest flag resets.

### Professional durable tools

Bar and bicycle tools should increasingly affect capability, production quality, verification, or access. In the current milestone they already have counterparty utility and trade value, but several still need deeper non-resale functions.

### Mystery / information-bearing goods

Sealed Parcel, Unsent Letter, Old Coupon and story-bearing collectibles should create belief / provenance problems, not guaranteed treasure-chest rewards.

---

# Expertise and incomplete information

Items can communicate information without a tutorial prompt spelling it out.

The Bar example is canonical:

> The Apprentice is learning a Mai Tai, but one ingredient is missing.

A knowledgeable player may infer likely missing inputs from what is visibly behind the bar. A player without cocktail knowledge can spend additional investigation actions until the clue becomes exact.

**Expertise buys time; it does not gate progress.**

The same structure can later apply to bicycle repair, film equipment, fish quality, shipping cargo and other domains.

---

# Three-question item test

Before keeping or refining a good, ask:

1. **Who might want it, and for what different reasons?**
2. **Why could its value / liquidity differ tomorrow?**
3. **What can the player do with it besides immediately sell it?**

Possible answers include eat, hold, inspect, use, pledge, gift, repair with, infer information from, move across markets, sell under time pressure, or preserve because another actor may value it privately.

An item that survives only because its name is cute should be cut or redesigned after playtesting.

---

# Next balance audit

Do not add a second arbitrary multiplier.

Run several real market simulations and record:

- how many trades clear per day;
- how often cash constraints block rational bids;
- spread as a percentage of reference price;
- time to first cash shortage;
- whether Vale can dominate simply because she starts liquid;
- whether Dog can actually act like a dealer;
- whether Bar can afford operating inputs and upgrades;
- whether expensive tools ever transact;
- whether speculative / prestige goods become permanently dead inventory;
- whether player starting 18🥫 permits meaningful positioning without trivialising food;
- whether auction thresholds remain reachable after the rebase.

Then change the smallest set of numbers that explains the observed problem.
