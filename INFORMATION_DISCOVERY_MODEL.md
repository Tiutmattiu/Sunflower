# Sunflower — Information Discovery & Market Knowledge

> Companion to `GAME_DESIGN.md`, `DESIGN_WORKBOOK.md`, `NPC_CHARACTER_BIBLE.md`, and `DAY_LOOP_MARKET_STRUCTURE.md`.

## Core rule

**No trader may read the true world state simply because the engine knows it.**

An NPC may only act on information reasonably available to that NPC.

The purpose is not to make NPCs artificially stupid. The purpose is to create a market in which information has time, cost, provenance, precision and competitive value.

## Black-Box Constitution

**IN-WORLD HIDDEN INFORMATION IS GOOD. DESIGNER-HIDDEN CAUSAL RULES ARE NOT.**

The player does not need Yasmin's exact private utility, every inventory or private relationship, or secret numerical scores. Legitimate hidden information includes private valuation, hidden stock, a private relationship, and a rumour not yet received.

Important outcomes must eventually expose discoverable types of causes. Arbitrary invisible multipliers without a world clue, NPC knowledge caused only by engine omniscience, and diagnosis that asserts player motivation without evidence are illegitimate black boxes.

Decision evidence records information available to the player at commitment time. It does not claim what the player believed unless an explicit player choice establishes that belief.

---

## Three information layers — STRONG CANDIDATE

This is the current information architecture, not a claim that newspaper/phone runtime exists.

| Layer | Timing / reach | Material content |
|---|---|---|
| **Newspaper** | broad, public, slower, delayed; beyond the player's contacts | world, harbour, weather, shipping, society, culture, accidents, public notices, classifieds and external events |
| **Phone** | fast, narrow, private and timely | personal messages, quotes, relationship updates, leads, order changes, project/investment reports, logistics alerts and sudden failures |
| **Local / market / scene** | immediate actionable state | visible goods, offers, people, opportunity panels, Octopus board, clearing outcomes and scene facts |

The newspaper is **general social/world media**, closer to a small BBC-style publication than a Bloomberg terminal. It reports social facts: “Thunderstorms expected east of the cape,” not “Lime +20% tomorrow.” Aspen infers route-delay risk; Joel considers visitor demand; the player considers perishable cargo; suppliers consider provisioning. These are uncertain interpretations, not guaranteed forecasts of profit.

Octopus publishes public orders, completed public trades, prices, clearing data and settlement records. This is **market data only**, not the world's general information medium. A market record establishes what publicly settled, not the buyer's secret motive or continuing ownership forever.

Phone claims must retain **source, provenance, credibility, motive and freshness**, alongside precision. A private message can be stale, mistaken or strategically misleading. Keep event/observation time distinct from receipt/publication time; a fast delivery does not make an old observation fresh.

### Public disclosure and the cost of attention

**Private edge → public disclosure → alpha decay.** A private shortage message can arrive before Aspen places a classified ad or the newspaper reports a disruption. More sellers then learn about demand, competing quotes change, and the earlier edge can shrink or disappear. Publicity does not mechanically force a fixed price change.

Aspen can use classifieds, Octopus, background suppliers or direct sourcing herself. The player has no exclusive courier permission: earlier knowledge, existing stock, supplier relationships, faster verification and willingness to carry delivery risk can create a temporary advantage.

Evaluate information against the best action available without it, including acquisition/verification cost, inventory/carry risk, capital lock, delay and **opportunity cost of attention**. A positive gross EV can still be worse than another use of the same window. Section 32.15 of `DESIGN_WORKBOOK.md` preserves the provisional Aspen signal experiment; its reliability band is not canon.

Physical newspaper, phone and local documents belong on the desk; `ART_DIRECTION.md` owns presentation. The Notebook is the persistent evidence/concept archive, not a fourth omniscient live feed.

## Why this matters

If every NPC begins Day 1 knowing exactly who owns every item, most private needs are solved immediately:

- Yasmin instantly finds Whale Oil;
- Aspen instantly finds Lime;
- Joel instantly finds Orgeat;
- a marine supplier instantly finds Dead Pigeon.

That removes both information asymmetry and player agency.

A living market should instead contain traders who know **different things at different levels of detail** at different times.

---

# Information precision is NOT confidence

This distinction is now core.

**Precision** answers:

> How specific is the claim?

**Confidence** answers:

> How strongly should I believe it?

These are independent dimensions.

Examples:

### High-confidence, low-precision

> Joel is trying to learn a Mai Tai and the recipe keeps failing because one ingredient is missing.

This may be directly observed and therefore highly reliable, but it does not name the missing ingredient.

### High-confidence, medium-precision

> Rum, fresh lime and orange curaçao are already behind the bar.

A knowledgeable bartender can infer the likely missing component without the game spelling it out.

### High-confidence, exact

> The missing ingredient is orgeat.

This is actionable but costlier to discover.

### Low-confidence, exact

> Wong says a wharf seller has an Orgeat Bottle under the counter.

The claim is precise but the source may be wrong, stale or deceptive.

Do not collapse these states into a single `confidence` number.

Current prototype precision labels:

- `context` — activity / situation / broad pattern;
- `category` — broad class of need or holding;
- `specific` — enough details that domain expertise may solve the inference;
- `exact` — item / person / event explicitly identified.

---

## Domain knowledge should save information actions

The original design was partly a personal menu / game for someone with real cocktail expertise. Preserve that spirit.

A knowledgeable player should occasionally infer the answer **before the game explicitly names it**.

Example — Joel:

1. `context`: Joel is learning to make a Mai Tai, but one ingredient is missing.
2. `specific`: rum, fresh lime and orange curaçao are already present.
3. `exact`: the missing ingredient is Orgeat.

A bartender may infer Orgeat at stage 1 or 2 and spend their next action sourcing it instead of paying for stage 3.

A player who does not know cocktails is not punished permanently; they can spend more time to obtain the exact clue.

This pattern can also apply to:

- bicycle repair;
- film / projection equipment;
- fishing / cold chain;
- shipping / cargo;
- legal or financial documents;
- unusual collectibles.

The principle is:

> **Expertise buys time, not a mandatory trivia gate.**

Do not turn the game into a quiz. Every important inference should remain discoverable through play.

---

## Three legitimate routes to inventory knowledge

### 1. Public stock / public listing

Some inventory is openly offered because it is part of the trader's ordinary business.

Confirmed direction:

- ordinary fish from finite marine suppliers can be obvious public stock;
- Wong may openly display some cheap junk;
- the Bar visibly sells ordinary drinks;
- **Aspen only displays selected cargo. Rare / strange cargo can remain in the hold and must be discovered.**

Public stock is knowable without spending an information action.

### 2. Octopus completed-public-trade records

A completed public-market trade creates market knowledge.

If everyone sees:

> Day 2: Aspen sells Brass Compass to Yasmin

then market participants can reasonably update beliefs:

- Yasmin recently acquired a Brass Compass;
- Aspen no longer necessarily has that specific unit;
- somebody was willing to pay the observed price.

These market records should inform both NPCs and the player without becoming a universal world-news feed.

### 3. Active search / social discovery

An NPC or player can spend limited time investigating plausible sources.

They do **not** search the entire world instantly.

A trader starts from hypotheses created by profession, geography, relationships and prior experience.

Examples:

- Yasmin may investigate a newly arrived Aspen for rare foreign goods;
- Aspen may ask the Bar, a marine supplier or Wong about citrus;
- a marine supplier may eventually ask Wong about bizarre scavenged material;
- Juan knows the Bar is the sensible place to investigate a Mai Tai.

A search can fail. Failure consumes time and is still information.

---

## Investigations should usually deepen rather than teleport to truth

Current prototype direction:

Repeated investigation of the same actor progresses through authored information stages before falling through to exact hidden holdings.

For example, investigating Aspen may reveal:

1. only selected cargo is displayed and departure is approaching;
2. an undeclared lot smells oily / medicinal and Yasmin's people are watching the ship;
3. exact confirmation of Sperm Whale Oil.

This is preferable to:

> click Investigate once → receive `Aspen has Whale Oil`.

The exact sequence can differ by character. Some people are transparent about needs but secretive about inventory; others are the reverse.

---

## Stable differences in information speed

NPCs should differ in how rapidly they investigate.

Current first-pass model:

- **Wong:** very high information tempo; goes everywhere and hears things quickly.
- **Yasmin:** very high deliberate information tempo; actively researches economically important needs.
- **Aspen:** moderate; practical and deadline-driven.
- **Juan:** moderate but concentrated on things connected to his obsessions.
- **background marine suppliers:** slower outside their physical businesses; they do not constantly investigate every opportunity.
- **Joel:** initially slow / naive; improves through experience and relationships.

This is not a generic difficulty stat. It is part of each character's stable market style.

---

## Pre-existing network — confirmed pieces

### Yasmin ↔ Aspen

Yasmin and Aspen already know each other and have done business before the run begins.

Yasmin is socially analogous to a queen bee: elite, central, wealthy, unusually capable of accessing privileged channels.

Aspen's Sailor role remains a broader liminal design question, but the economic relationship is established:

> Aspen repeatedly brings outside cargo; Yasmin is an experienced buyer of unusual foreign goods.

Therefore Yasmin can rationally investigate Aspen unusually early without knowing the exact contents of the hold.

### Wong — wide but shallow network

Wong knows almost everyone a little.

Wong has unusually broad network reach across social strata but does not possess deep trust with everyone and is not automatically told the truth.

Wong also connects to animal-world / informal actors including candidate groups such as:

- Seagulls;
- Squirrels;
- Mosquitoes.

### Bar as boundary venue

The Bar is currently the only confirmed human venue that openly permits animals to enter.

Other human venues may ban or restrict animal people.

This makes the Bar economically and narratively important as a boundary space between human and animal markets, not merely a cocktail shop.

---

## First-day target

Day 1 should **not** be a perfectly efficient market.

A useful target is:

- obvious ordinary trades can happen immediately;
- one or two sophisticated / well-connected actors may discover a hidden opportunity early;
- several private needs remain unresolved;
- the player has meaningful room to discover, connect, intermediate or withhold information.

A strong NPC should sometimes beat the player to an opportunity because that NPC had a believable information edge. The whole cast should not do this simultaneously.

---

## Public vs hidden inventory

Inventory should be represented in layers:

- **publicly offered** — anyone can see it;
- **known to a specific actor** — learned through a conversation, inspection, prior trade or investigation;
- **rumoured** — source and confidence matter;
- **private / hidden** — no actor may use it merely because the engine stores it.

The player obeys the same information constitution as NPCs. Clicking an avatar must not reveal true inventory by default.

---

## Player communication constraint — confirmed direction

The player is an outsider with a substantial communication barrier.

Preferred implementation direction:

- the player can understand at least some local speech / signals;
- the player cannot fluently speak the local language;
- communication relies on some combination of translation, writing, gestures, structured offers, and demonstrated behaviour;
- trade history and whether the player keeps promises become forms of communication in themselves.

Do not require a medical diagnosis to justify the silent / limited-speaking protagonist.

The important gameplay fact is that the player cannot simply interrogate every NPC with unlimited natural-language questions.

---

## NPC planning sequence

A buyer trying to obtain an item should conceptually do this:

1. Check whether the item is publicly offered.
2. Check remembered public trades / known holdings.
3. Check pre-existing relationships and profession-based hypotheses.
4. If no source is known, decide whether discovering a source is worth spending time.
5. Search one or a few plausible counterparties according to information skill and network.
6. Only after a source becomes sufficiently known may the NPC form a targeted bid / negotiation plan.
7. At clearing, stale information may still cause failure because ownership may have changed.

This allows rational failure.

---

## Important distinction: belief vs truth

The engine may know:

> Bar owns Lime Crate.

Aspen's state may be:

> "Bar often handles citrus, but I have not confirmed stock."

or:

> "Wong told me Bar had Lime yesterday. Confidence: medium."

or:

> "I saw the Lime in the Bar this morning. Confidence: high."

Those are different informational states even though the underlying world state is identical.

---

## Information is a tradeable asset — confirmed

Information can exist as a real game object with fields such as:

- proposition / claim;
- source, provenance and source motive;
- **precision**;
- confidence;
- observation/event time, receipt/publication time and freshness;
- who currently knows it;
- whether it was personally verified;
- whether it has already diffused;
- whether resale is possible / permitted.

Example:

> `Aspen holds Sperm Whale Oil`
> Precision: exact
> Source: personally observed
> Confidence: high
> Freshness: today
> Known by: player

The player can then choose among economically different actions:

- buy the oil personally;
- sell the source information to Yasmin;
- tell Yasmin for relationship value rather than cash;
- tell multiple buyers and create competition;
- conceal the information;
- fabricate a false source claim;
- sell exclusivity and then violate it.

Information value must decay when it spreads.

### Documented prototype resale / diffusion contract

- A holding lead records source, precision, confidence, freshness, personal verification, known actors, sales, favours, diffusion count and resale state.
- Selling or sharing teaches only the named recipient; it does not broadcast the lead globally.
- A recipient may later resell through an established bilateral relationship. That private transfer moves cash, updates the buyer's bounded memory and appends a structured resale record.
- Price falls as the audience grows and as the lead ages; stale leads cannot be sold.
- The verification snapshot documents this history without final scoring; `SCENARIOS_TEACHING.md` separately records badge implementation claims. This design pass does not establish new runtime coverage.

---

## Player participation created by information friction

Information friction gives the player economic roles other than simply buying before an NPC does:

- infer a need before it is named;
- discover a seller and become an intermediary;
- sell source information;
- conceal the source;
- buy first and resell later;
- tell two buyers and create competition;
- deliberately provide false information;
- observe an NPC searching and infer hidden demand;
- help a weaker NPC find a supplier;
- teach an NPC enough that they eventually stop needing the player.

This is the desired source of participation.

---

## Implementation guardrail

Do not solve information asymmetry with hidden dice that simply say an NPC succeeds or fails to know something.

Randomness may affect attention or noisy rumours later, but the primary system should remain reconstructable:

> public knowledge + relationships + limited search time + expertise + precision + source quality + remembered evidence.

The player should be able to say:

> "Of course Yasmin found it before me — she already knew Aspen, saw the ship arrive, and spent the morning investigating her cargo."

not:

> "The AI rolled lucky."
