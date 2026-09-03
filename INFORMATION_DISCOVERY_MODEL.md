# Sunflower — Information Discovery & Market Knowledge

> Companion to `GAME_DESIGN.md`, `NPC_ENGINE_ROUTE_AUDIT.md`, `NPC_CHARACTER_BIBLE.md`, and `DAY_LOOP_MARKET_STRUCTURE.md`.

## Core rule

**No trader may read the true world state simply because the engine knows it.**

An NPC may only act on inventory information that is reasonably available to that NPC.

The purpose is not to make NPCs artificially stupid. The purpose is to create a market in which information has time, cost, provenance and competitive value.

## Why this matters

If every NPC begins Day 1 knowing exactly who owns every item, most private needs are solved immediately:

- Vale instantly finds Whale Oil;
- Sailor instantly finds Lime;
- Apprentice instantly finds Orgeat;
- Fishmonger instantly finds Dead Pigeon.

That removes both information asymmetry and player agency.

A living market should instead contain traders who know different things at different times.

## Three legitimate routes to inventory knowledge

### 1. Public stock / public listing

Some inventory is openly offered because it is part of the trader's ordinary business.

Confirmed direction:

- Fishmonger's ordinary fish is obvious public stock;
- Dock Dog may openly display some cheap junk;
- the Bar visibly sells ordinary drinks;
- **Sailor only displays selected cargo. Rare / strange cargo can remain in the hold and must be discovered.**

Public stock is knowable without spending an information action.

### 2. Public transaction tape

A completed public-market trade creates market knowledge.

If everyone sees:

> Day 2: Sailor sells Brass Compass to Vale

then market participants can reasonably update beliefs:

- Vale recently acquired a Brass Compass;
- Sailor no longer necessarily has that specific unit;
- somebody was willing to pay the observed price.

The public tape should therefore train both NPCs and the player.

### 3. Active search / social discovery

An NPC can spend limited time investigating plausible sources.

They do **not** search the entire world instantly.

A trader starts from hypotheses created by profession, geography, relationships and prior experience.

Examples:

- Vale may investigate a newly arrived Sailor for rare foreign goods;
- Sailor may ask the Bar, Fishmonger or Dock Dog about citrus;
- Fishmonger may eventually ask Dock Dog about bizarre scavenged material;
- Clown knows the Bar is the sensible place to investigate a Mai Tai.

A search can fail. Failure consumes time and is still information.

## Stable differences in information speed

NPCs should differ in how rapidly they investigate.

Current first-pass model:

- **Dock Dog:** very high information tempo; goes everywhere and hears things quickly.
- **Vale:** very high deliberate information tempo; actively researches economically important needs.
- **Sailor:** moderate; practical and deadline-driven.
- **Clown:** moderate but concentrated on things connected to his obsessions.
- **Fishmonger:** slower outside the fish business; does not constantly investigate every opportunity.
- **Bar Apprentice:** initially slow / naive; improves through experience and relationships.

This is not a generic difficulty stat. It is part of each character's stable market style.

## Pre-existing network — confirmed pieces

### Vale ↔ Sailor

Vale and Sailor **already know each other and have done business before the run begins**.

Vale is socially analogous to a queen bee: elite, central, wealthy, unusually capable of accessing privileged channels.

Sailor's exact class / social archetype remains open, but the economic relationship is already established:

> Sailor repeatedly brings outside cargo; Vale is an experienced buyer of unusual foreign goods.

Therefore Vale can rationally investigate Sailor unusually early without knowing the exact contents of the hold.

### Dock Dog — wide but shallow network

Dock Dog knows almost everyone a little.

Dog has unusually broad network reach across social strata but does not possess deep trust with everyone and is not automatically told the truth.

Dog also connects to animal-world / informal actors including candidate groups such as:

- Seagulls;
- Squirrels;
- Mosquitoes.

These actors belong to an animal social world that is close enough to human society to trade with it but remains socially discriminated against by parts of human society.

### Bar as boundary venue

The Bar is currently the **only confirmed human venue that openly permits animals to enter**.

Other human venues may ban or restrict animal people.

This makes the Bar economically and narratively important as a boundary space between human and animal markets, not merely a cocktail shop.

Venue access should eventually affect:

- who can meet whom;
- who hears which rumours;
- where private deals can occur;
- which markets exclude particular actors;
- why Dock Dog and other animal traders rely on informal networks.

The game should depict this discrimination as a property of the fictional society, not as a moral endorsement by the system.

## First-day target

Day 1 should **not** be a perfectly efficient market.

A useful target is:

- obvious ordinary trades can happen immediately;
- one or two sophisticated / well-connected actors may discover a hidden opportunity early;
- several private needs remain unresolved;
- the player has meaningful room to discover, connect, intermediate or withhold information.

A strong NPC should sometimes beat the player to an opportunity because that NPC had a believable information edge. The whole cast should not do this simultaneously.

## Public vs hidden inventory

Inventory should be represented in layers:

- **publicly offered** — anyone can see it;
- **known to a specific actor** — learned through a conversation, inspection, prior trade or investigation;
- **rumoured** — source and confidence matter;
- **private / hidden** — no actor may use it merely because the engine stores it.

The player obeys the same information constitution as NPCs. Clicking an avatar must not reveal true inventory by default.

## Player communication constraint — confirmed direction

The player is an outsider with a substantial communication barrier.

Preferred implementation direction:

- the player can understand at least some local speech / signals;
- the player cannot fluently speak the local language;
- communication relies on some combination of translation, writing, gestures, structured offers, and demonstrated behaviour;
- trade history and whether the player keeps promises become forms of communication in themselves.

Do not require a medical diagnosis to justify the silent / limited-speaking protagonist. The important gameplay fact is that the player cannot simply interrogate every NPC with unlimited natural-language questions.

This helps explain why actions such as `Investigate`, `Offer`, `Show`, `Ask about`, `Introduce`, and later `Sell information` are explicit economic actions rather than free dialogue trees.

## NPC planning sequence

A buyer trying to obtain an item should conceptually do this:

1. Check whether the item is publicly offered.
2. Check remembered public trades / known holdings.
3. Check pre-existing relationships and profession-based hypotheses.
4. If no source is known, decide whether discovering a source is worth spending time.
5. Search one or a few plausible counterparties according to the NPC's information skill and network.
6. Only after a source becomes known may the NPC form a targeted bid / negotiation plan.
7. At clearing, stale information may still cause failure because ownership may have changed.

This allows rational failure.

## Important distinction: belief vs truth

The engine may know:

> Bar owns Lime Crate.

Sailor's state may be:

> "Bar often handles citrus, but I have not confirmed stock."

or:

> "Dock Dog told me Bar had Lime yesterday. Confidence: medium."

or:

> "I saw the Lime in the Bar this morning. Confidence: high."

Those are different informational states even though the underlying world state is identical.

## Information is a tradeable asset — confirmed

The player may sell information to NPCs.

Information should eventually exist as a real game object with fields such as:

- proposition / claim;
- source;
- confidence;
- freshness;
- who currently knows it;
- whether it was personally verified;
- whether it has already diffused;
- whether resale is possible / permitted.

Example:

> `Sailor holds Sperm Whale Oil`
> Source: personally observed
> Confidence: high
> Freshness: today
> Known by: player

The player can then choose among economically different actions:

- buy the oil personally;
- sell the source information to Vale;
- tell Vale for relationship value rather than cash;
- tell multiple buyers and create competition;
- conceal the information;
- fabricate a false source claim;
- sell exclusivity and then violate it.

Information value must decay when it spreads.

## Player participation created by information friction

Information friction gives the player economic roles other than simply buying before an NPC does:

- discover a seller and become an intermediary;
- sell the source information;
- conceal the source;
- buy first and resell later;
- tell two buyers and create competition;
- deliberately provide false information;
- observe an NPC searching and infer their hidden demand;
- help a weaker NPC find a supplier;
- teach an NPC enough that they eventually stop needing the player.

This is the desired source of participation.

## Implementation guardrail

Do not solve information asymmetry with hidden dice that simply say an NPC succeeds or fails to know something.

Randomness may affect attention or noisy rumours later, but the primary system should remain reconstructable:

> public knowledge + relationships + limited search time + skill + remembered evidence.

The player should be able to say, after learning enough:

> "Of course Vale found it before me — she already knew the Sailor, saw the ship arrive, and spent the morning investigating his cargo."

not:

> "The AI rolled lucky."
