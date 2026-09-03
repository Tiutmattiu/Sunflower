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

Examples:

- Fishmonger's fresh fish can be obvious public stock;
- Dock Dog may openly display cheap junk;
- the Bar may visibly sell ordinary drinks;
- a Sailor may display some cargo without revealing every rare item in the hold.

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

Provisional first-pass model:

- **Dock Dog:** very high information tempo; goes everywhere and hears things quickly.
- **Vale:** very high deliberate information tempo; actively researches economically important needs.
- **Sailor:** moderate; practical and deadline-driven.
- **Clown:** moderate but concentrated on things connected to his obsessions.
- **Fishmonger:** slower outside the fish business; does not constantly investigate every opportunity.
- **Bar Apprentice:** initially slow / naive; improves through experience and relationships.

This is not a generic difficulty stat. It is part of each character's stable market style.

## First-day target

Day 1 should **not** be a perfectly efficient market.

A useful target is:

- obvious ordinary trades can happen immediately;
- one or two sophisticated / well-connected actors may discover a hidden opportunity early;
- several private needs remain unresolved;
- the player has meaningful room to discover, connect, intermediate or withhold information.

A strong NPC should sometimes beat the player to an opportunity because that NPC had a believable information edge. The whole cast should not do this simultaneously.

## Public vs hidden inventory

Inventory should eventually be represented in layers:

- **publicly offered** — anyone can see it;
- **known to a specific actor** — learned through a conversation, inspection, prior trade or investigation;
- **rumoured** — source and confidence matter;
- **private / hidden** — no actor may use it merely because the engine stores it.

The player should obey the same information constitution as NPCs. The UI must eventually stop showing every true inventory item by default.

## NPC planning sequence

A buyer trying to obtain an item should conceptually do this:

1. Check whether the item is publicly offered.
2. Check remembered public trades / known holdings.
3. If no source is known, decide whether discovering a source is worth spending time.
4. Search one or a few plausible counterparties according to the NPC's information skill and network.
5. Only after a source becomes known may the NPC form a targeted bid / negotiation plan.
6. At clearing, stale information may still cause failure because ownership may have changed.

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

> "Of course Vale found it before me — the Sailor arrived yesterday and she spent the morning investigating his cargo."

not:

> "The AI rolled lucky."
