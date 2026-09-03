# Sunflower — Item Economy

> Status: active system design. Keep this document focused on what goods *do economically* and how the market feels. Do not collect objects merely to inflate the catalogue.

## Core rule

**More items are only useful when they create more decisions, more market texture, or more inference.**

Sunflower is a trading game, not a key-and-lock adventure.

An NPC wanting `X` should normally mean `X`, unless a broader category or substitute relationship has been made legible to the player through ordinary world knowledge, professional expertise, explicit dialogue, public listings, or acquired information.

### No invisible substitute puzzles

Do **not** silently implement rules such as:

> Sailor says Lime, but Dried Citrus Peel secretly counts as 60% Lime.

That makes the player guess the designer rather than read a market.

A substitute is valid only when at least one of these is true:

- the need was stated as a category (`citrus provisions`, not `Lime Crate`);
- the NPC explicitly says alternatives are acceptable;
- the relationship is ordinary enough to infer from real knowledge;
- the player can discover the substitution rule as information before committing the trade.

The engine should not award hidden partial credit for designer-only associations.

---

## Catalogue size

As of the September 3 expansion, `ITEMS` contains **68 provisional item definitions**.

That is already enough for the current design phase.

Target range for the eventual game:

- **60–80 total goods** across all forms / routes is probably sufficient;
- only roughly **20–30 should be economically legible in an early Human run**;
- another **10–15 can enter through later arrivals, relationships, events and hidden stock**;
- form-specific / black-market / Sailor goods can make the same world feel new on replay without putting 70 objects on one screen.

Do not add another 30 items until the current pool has been playtested and cut.

An item that remains mechanically interchangeable with another item after several runs should usually be deleted, merged or given a stronger reason to exist.

---

## Market texture by trader

The world should contain all four broad object aesthetics, but **not in equal proportions from every trader**.

### Dock Dog — harbour reality + surreal everyday debris

Typical texture:

- Dead Pigeon
- Chewed Rope Toy
- Red Ribbon
- Empty Green Bottle
- Glasses Wipe
- Bicycle Bell
- Chia Seeds

Dog should make low-value objects feel surprisingly connected to people, animals and information.

### Fishmonger — material harbour goods + accidental oddities

Typical texture:

- Fresh Mackerel
- Smoked Eel
- Two Octopus Tentacles
- Ice Block
- Rusty Harpoon
- an inexplicable Orgeat Bottle acquired through barter / debt / misdelivery

Fishmonger's weird items should feel weird **because they do not belong in an otherwise comprehensible operating business**.

### Sailor — cross-border material goods + professional equipment + strange cargo

Typical texture:

- Brass Compass
- Sperm Whale Oil
- Sealed Parcel
- Presta Inner Tube
- Chain Quick-Link
- Brake Cable
- Tiny Torque Wrench
- Three Metres of Stolen Theatre Wire
- Patch Cut from the Ship Mercy

Sailor stock should carry geography, provenance and mobility.

### Mirelle Vale — story fragments + elite / illiquid collectibles

Typical texture:

- Valentino Still
- Film Canister
- One White Glove
- Numbered Funeral Ticket
- Taxidermied Moth
- Unsent Letter

Vale's inventory should make the player ask whether the price comes from use, scarcity, provenance, fashion, status or somebody else's willingness to pay.

### Bar Apprentice — real professional bar equipment + relationship objects

Typical texture:

- Hawthorne Strainer
- 30/45 Jigger
- Long Bar Spoon
- Fine Mesh Strainer
- Hand Citrus Press
- Lewis Bag
- Orange Curaçao
- Demerara Syrup
- Chipped Nick & Nora Glass

The Bar should reward actual cocktail knowledge without becoming a recipe quiz. A knowledgeable player may infer more from incomplete observations and therefore spend fewer information actions.

### Onewheel Clown — surreal everyday goods + speculative junk + mobility debris

Typical texture:

- Lollipop
- Lucky Sticker
- Glitter Tape
- Handlebar Tape
- Key That Opens Nothing
- Tool Roll

Clown can assign coherent private utility to things other traders dismiss without turning every weird item into a secret quest key.

---

## Current economic item families

### Food / sustenance

Examples:

- Fresh Mackerel
- Smoked Eel
- Two Octopus Tentacles
- Sea Lettuce Bundle
- Salted Cod
- Hardtack Tin
- Chia Seeds

The player may eat inventory rather than preserve it for resale. That gives ordinary goods a real opportunity cost.

### Perishable / timing-sensitive inputs

Examples:

- Ice Block
- Bruised Mint
- Lime Crate
- Fresh Mackerel
- Two Octopus Tentacles

These create timing, storage and fire-sale pressure.

### Recurring operating inputs

The Bar repeatedly consumes ice.

Dock Dog repeatedly consumes fresh fish for the cat colony.

Demand should return because businesses and bodies continue doing things, not because a quest flag resets arbitrarily.

### Professional durable tools

Examples:

- Hawthorne Strainer
- Jigger
- Citrus Press
- Tiny Torque Wrench
- Tool Roll

Durable tools should increasingly affect capability, production, verification or access rather than act only as resale tokens.

### Durable / collateral-like goods

Examples:

- Brass Compass
- Blue Glass Marble
- some professional tools / collectible goods

Their value can diverge from cash because liquidation speed and counterparty interest differ.

### High-uncertainty / special situations

Examples:

- Sealed Parcel
- Numbered Funeral Ticket
- Unsent Letter
- Key That Opens Nothing

These should create information and belief problems rather than contain a guaranteed designer reward.

### Animal-network / informal goods

Examples:

- Chia Seeds
- Red Ribbon
- Empty Green Bottle
- Fish Bones
- Glasses Wipe
- scavenged bicycle debris

Their liquidity and social meaning may differ sharply across human and animal networks.

---

## Information can be embedded in goods

Some objects are valuable partly because possession tells you something.

Examples:

- a shipping label reveals origin;
- a sealed parcel has uncertain contents but known provenance;
- an Unsent Letter may contain private information;
- a specialist bicycle part suggests who is repairing what;
- professional bar stock lets an experienced player infer what the Apprentice is trying to make.

This is preferable to treating `Information` and `Items` as completely separate universes.

---

## Price audit — current values are NOT canon

The current ordinary reference-price range is mostly **1–16🥫**, with `Sunflower = 99` as an old prototype placeholder.

This scale is too compressed to support the eventual market cleanly.

Examples of the problem:

- 2🥫 → 3🥫 is a 50% move;
- a +1 urgency premium can dominate the entire reference price;
- spread, relationship discount, liquidity discount, reputation premium and market heat collapse into the same one-tin increment.

Therefore current `ITEMS[item].value` should be understood as a **provisional reference number**, not intrinsic value and not final balance.

Before serious balance playtesting, do one coordinated rebase covering:

- item reference prices;
- initial NPC/player cash;
- nightly sustenance cost;
- information prices;
- proxy fees;
- auction reserves;
- route net-worth thresholds;
- NPC markups / urgency increments / heat increments.

Do not scale item prices alone or the economy will become incoherent.

Likely desirable result: a wider ordinary price band so that +1 is a small signal, +several tins is meaningful, and a desperation premium can be visibly large without automatically doubling the asset price.

Also reconsider whether a living `Sunflower` should have any universal numeric reference price at all.

---

## Three-question item test

Before keeping a new good, ask:

1. **Who might want it, and for what different reasons?**
2. **Why could its value / liquidity differ tomorrow?**
3. **What can the player do with it besides immediately sell it?**

Possible answers include:

- eat;
- hold;
- inspect;
- use;
- pledge;
- gift;
- repair with;
- infer information from;
- move across markets;
- sell under time pressure;
- keep because another actor may value it privately.

Not every item needs all three dimensions, but an item that has none is probably filler.

---

## Current design target

A healthy small market should contain at the same time:

- obvious low-margin commodity trades;
- at least one perishability / timing problem;
- one or two illiquid / mysterious assets;
- recurring operating demand;
- professional goods whose significance rewards domain knowledge;
- information edges of different precision;
- goods whose value differs sharply by counterparty;
- some objects that are funny, intimate or inexplicable before they are economically useful.

The player should ask:

> Do I eat this, sell it, hold it, investigate it, use it, show it to someone, or keep quiet about who has it?

not:

> Which bespoke key opens the next NPC?
