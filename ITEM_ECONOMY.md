# Sunflower — Item Economy

> Status: active item-economy source of truth. The old 67-item runtime catalogue is prototype scaffolding, not protected content. Preserve mechanics, recurring needs and useful cross-system links; rebuild or remove objects that exist only because an early prototype needed texture.

## Core rule

**More items are useful only when they create more decisions, more market texture, or more inference.** Sunflower is a small living-market trading game, not a key-and-lock adventure and not a giant catalogue simulator.

Named characters are economic organs inside a larger harbour economy. Anonymous households, crews, visitors, small sellers/buyers and background suppliers are economically necessary, but they do not need character-bible depth.

Prefer:

> **Need → source → trade / service / production → use or transformation → sink → renewed need.**

Every recurring gain or cost needs a balance-sheet path. Finance must ultimately serve consumption, production, logistics, projects, liquidity or risk transfer rather than become a self-contained paperwork economy.

Octopus Clearing, Octopus personal inventory and background marine supply are distinct. Settlement float is never Octopus personal wealth.

---

## Naming rule — ordinary things first

Sunflower does **not** need invented whimsy in ordinary object names.

A normal good should sound like something that could appear on a supermarket label, wholesale invoice, bicycle catalogue, chandlery shelf, nursery tag, auction catalogue or museum label.

Prefer names such as:

- `700C Steel Bicycle Rim`
- `Presta Inner Tube, 700×25–32C`
- `9-Speed Chain Quick-Link`
- `Stainless Steel Brake Cable`
- `2–14 N·m Torque Wrench`
- `Self-Adhesive Sail Repair Patch`
- `Tinned Copper Marine Cable, 3 m`
- `White Kid-Leather Evening Gloves, Pair`
- `Gelatin Silver Print, 20 × 25 cm`
- `Atlas Moth, Taxidermy Specimen`

Avoid author-winking names such as `Key That Opens Nothing`, `Lucky Sticker`, `Three Metres of Stolen Theatre Wire` or `Patch Cut from the Ship Mercy` unless a story has already made that exact provenance economically relevant.

**The world should feel strange because accurately named ordinary things acquire strange prices, histories, uses and obligations.**

---

## Item architecture

Do not flatten every economically meaningful thing into one ordinary-inventory SKU table.

### A. Physical goods

Normal transferable objects and consumables.

Examples: Limes, Rum, Brake Cable, Green Tea, Empty Glass Bottle, Silver Serving Fork.

### B. Living assets

A species identity plus mutable state such as stage, health, maturity, yield and remaining productive life.

Do **not** create separate SKU identities for every plant stage when one living asset plus state is enough.

Example:

`Lime Plant { stage: seedling, health: 0.82, maturity: 0.25 }`

rather than separate `Lime Seedling`, `Young Lime Tree`, `Mature Lime Tree` market goods.

### C. Claims / contracts

Issuer, holder, maturity, face/recovery value, collateral, seniority and state.

These are financial positions, not ordinary goods.

### D. Services / capacity

Shipping, storage, custody, inspection, guarantee, settlement, workshop time and similar services are capacities or contracts, not physical goods.

---

## State is not a new SKU

Several prototype items should become state changes on ordinary goods rather than separate catalogue entries.

Examples:

- `Bruised Mint` → `Mint` with lower condition/freshness;
- `Spoiled Fish` → `Fresh Mackerel` or other fish with spoiled condition;
- `Bad Tangerine` → retire as a good; Short Shipment / contract misrepresentation concerns quantity, count, quality and inspection of the promised `Limes` delivery;
- plant maturity → living-asset state, not a new good identity.

A shortage or fraud should normally be represented by facts about the same promised good:

`Limes, 24-count crate` promised versus 17 acceptable limes delivered.

This creates inspection, reputation, timing and contract risk without inventing a fake substitute SKU.

---

## Market exposure levels

The full content library may be much larger than the set a player actively trades. Use exposure deliberately.

### M0 — Backend-only

Exists in the world and can support recipes, menu richness or anonymous procurement, but normally does not demand independent player attention.

Typical examples: many ordinary herbs, lettuces, mushrooms, pantry staples, common meats and secondary bar bases.

### M1 — Ordinary recurring market

Repeated real source and repeated real sink; understandable public or bilateral trade.

Examples should usually have ongoing consumption, replacement, spoilage or production use.

### M2 — Thin / specialised market

Fewer sources or fewer buyers; appears when a route, profession or event makes it relevant.

Typical examples: bicycle parts, speciality spices, professional tools, imported delicacies.

### M3 — Private / event assets

Provenance-heavy collectibles, auction lots, private consignments and similar assets that should not sit in a normal public commodity queue every day.

### M4 — Unique / special objects

Goal objects, singular living assets, unusual custody objects or authored one-offs that should not develop a normal market series.

---

# Prototype catalogue disposition

The September 4 runtime audit found 67 item definitions. That count is implementation history, not a target and not a reason to preserve early generated objects.

A kept item should have at least one live reason to exist: recurring source/sink, production use, consumption, real professional utility, route function, collateral/provenance role, or a specific authored event that justifies event-only treatment.

## Protect concept / review exact implementation

- Sperm Whale Oil
- Fresh Mackerel
- Ice
- Rum
- Orange Curaçao
- Orgeat
- Demerara Syrup
- Steel Rim
- Presta Inner Tube
- Chain Quick-Link
- Brake Cable
- Handlebar Tape
- Tiny Torque Wrench
- Bicycle Bell
- Hawthorne Strainer
- Jigger
- Fine Mesh Strainer
- Long Bar Spoon
- Hand Citrus Press
- Lewis Bag
- Limes
- Sunflower
- Built Onewheel

## Keep function, rename / reclassify / convert to state

- Brass Compass
- Sealed Parcel
- Theatre Wire
- Ship Mercy Patch
- Film Canister
- Hand Mirror
- Bent Silver Fork
- White Glove
- Taxidermied Moth
- Tool Roll
- Nursery Seed Packet
- Mature Nursery Plant
- Bruised Mint
- Cracked Shaker
- Chipped Nick & Nora Glass
- Spoiled Fish

## Likely delete / replace unless a current mechanic proves otherwise

- Blue Glass Marble
- Dead Pigeon
- Collar Tag
- Chewed Rope Toy
- Red Ribbon
- Glasses Wipe
- Hotel Sugar Cubes, 23 Count
- Rusty Harpoon
- Valentino Still
- Velvet Sleeve
- Numbered Funeral Ticket
- Unsent Letter
- Lollipop
- Glitter Tape
- Lucky Sticker
- Wax Candle Stub
- Key That Opens Nothing
- Bad Tangerine
- Old Coupon
- Pocket Match

## Review for backend-only treatment

- Smoked Eel
- Sea Lettuce
- Sea Urchin
- Salted Cod
- Hardtack
- Chia Seeds
- ordinary menu pantry goods

These labels are **design rebuild decisions, not permission to delete runtime objects before dependency testing**.

---

## Bicycle / Onewheel family

Protect the bicycle-repair family because it has already become a useful cross-system mechanic:

- Steel Rim
- Presta Inner Tube
- Chain Quick-Link
- Brake Cable
- Handlebar Tape
- Tiny Torque Wrench
- Bicycle Bell

Current runtime discrepancy to preserve for audit, **not** silently fix in Markdown:

> Runtime Built Onewheel inputs are `Steel Rim + Chain Quick-Link + Brake Cable + Handlebar Tape`, with `Tiny Torque Wrench` retained as a durable tool. `Presta Inner Tube` currently exists but is not consumed by that recipe.

The design may later decide that Inner Tube belongs in the recipe and Handlebar Tape is optional/finish quality, but this remains **Open until runtime/design reconciliation**.

---

## Sperm Whale Oil

Keep `Sperm Whale Oil` as a concrete historical material. Its strangeness comes from real-world history, scarcity, obsolete use, provenance and ethical context rather than invented naming.

It is a model for Sunflower's preferred weirdness: the object itself is real; the surrounding market and human behaviour make it strange.

---

## Limes / Short Shipment

Keep Limes as a high-density bridge good connecting Bar, provisioning, routes, perishability, cultivation and contract quantity/quality risk.

Prefer a concrete unit such as `Limes, 24-count crate` once exact units are frozen.

`Bad Tangerine` is retired as the teaching object. The candidate teaching case is Short Shipment / contract misrepresentation: promised acceptable quantity versus delivered count/condition, possibly concealed under a normal top layer. Inspection, counting, supplier reputation and paid verification all have costs.

---

## Joel Bar — real-menu source

The real Night Menu supplied by the creator is a **reference pool**, not a command to create one market SKU per printed ingredient.

Raw reference count:

- **132 ingredient/base entries**;
- plus 5 style choices;
- plus 5 extra-direction choices.

After obvious aliases, repeated entries and colour/cultivar variants are grouped, the current first-pass estimate is about **114 canonical culinary families**. This number is provisional and exists only to describe menu breadth; it is **not** a target market size.

### Menu grammar

Style:

- fruity
- spirit-forward
- dry (no sweet)
- sweet
- balanced

Extras:

- sour
- smoky
- savoury
- spicy
- surprise me

Base:

- alcoholic
- non-alcoholic

Actual production remains constrained by **what is physically available tonight**.

A small number of classic cocktails can remain benchmark recipes or authored route anchors. The long-term Bar system is generative, not a fixed catalogue of hundreds of named cocktails.

### Important canonicalisation examples

These should normally share one market family with variants/forms rather than create separate public-price series:

- Green Apple / Red Apple → `Apple` + cultivar/colour;
- Grape / Red Grape → `Grape` + variant;
- Orange / Blood Orange → `Orange` + variant;
- Bell Peppers red/green/yellow → `Bell Pepper` + colour;
- Onion / Red Onion → `Onion` + variant;
- Tomato / Cherry Tomato → `Tomato` + cultivar/form;
- Basil / Thai Basil → `Basil` + cultivar;
- Red / Bird / Green Chilli → `Chilli` + variety;
- Eggplant / Aubergine → alias;
- Courgette / Zucchini → alias/family + colour variant;
- Scallion / Spring Onion → one market family unless a later culinary rule genuinely needs a distinction;
- Ginger appearing under more than one menu heading → one physical family;
- Fennel appearing as spice and vegetable → one botanical family with part/form where necessary.

Do **not** over-merge things that are economically different forms. `Lime` and `Lime Leaf`, for example, are related botanically but not the same tradable unit.

### Mai Tai benchmark

Protect the real inputs and durable tools around the existing benchmark route:

- Rum
- Orange Curaçao
- Orgeat
- Lime
- Hawthorne Strainer
- Jigger
- Fine Mesh Strainer
- Long Bar Spoon
- Hand Citrus Press
- Lewis Bag

`Mai Tai` itself should not be treated as an ordinary circulating market commodity. It is a Bar output/service product or authored event object. The same rule should apply to future cocktails so hundreds of drinks do not become public SKUs.

---

## Bar ingredients: what should face the player?

The Bar can feel rich without turning the harbour into a grocery terminal.

### Strong bridge-good candidates

First-pass candidates worth testing because they connect more than one economic organ:

- Lime
- Lemon
- Orange
- Apple
- Grape
- Pineapple
- Mango
- Cucumber
- Tomato
- Ginger
- Fennel
- Mint
- Basil
- Lemongrass
- Cardamom
- Cinnamon
- Cumin
- Szechuan Pepper
- Hibiscus
- Green Tea
- Rum
- Wine

This is a **simulation candidate set**, not frozen canon.

### Likely backend examples

Many menu ingredients can remain real without becoming independent public goods, for example:

- Arugula
- Baby Red Radish
- Broccoli
- Cauliflower
- Dill
- Italian Parsley
- Tarragon
- Thyme
- Little Gem
- Romaine Lettuce
- Butter Lettuce
- Frisée
- Vene Cress
- Basil Cress
- Affila Cress
- Poppy Seeds
- White Sesame
- Black Sesame
- Mustard Seeds
- Button Mushroom
- Shimeji Mushroom
- Portobello
- most common meat/fish menu ingredients
- most ordinary spirit bases

Their normal supply can be bounded anonymous wholesale procurement. A specific one can be promoted to M1/M2 later when a real route, shortage, buyer or authored event makes it economically interesting.

### Alcohol rule

Do not make every spirit an independent market just because the Bar uses it.

`Rum` has unusually strong cross-system value because of the Mai Tai benchmark, Joel's operation, Aspen cargo and Juan Cliff context, so it is a strong market candidate.

`Wine` is a thin-market candidate.

Brandy, Gin, Vodka, Whisky, Tequila and Mezcal can remain backend by default until another system gives one of them a second economic role.

### Meat / fish rule

Do not create ten ordinary meat price series solely because the menu prints ten meats.

Common Pork, Lamb, Beef and Chicken can remain background food procurement. A speciality such as `Jamón Ibérico` may later become a thin imported/provenance-sensitive good because it can connect Aspen import, Joel special service and Yasmin hosting.

---

## Aspen — cargo and route reveal

Aspen is a logistics/contract operator, not a random-curio generator.

Her cargo should increasingly use normal professional names and connect to route reach, delivery timing, weather, sourcing and repair.

Prototype names should be normalised where the mechanic survives:

- `Brass Compass` → candidate `Brass Marine Compass`;
- `Three Metres of Stolen Theatre Wire` → candidate `Tinned Copper Marine Cable, 3 m`;
- `Patch Cut from the Ship Mercy` → candidate `Self-Adhesive Sail Repair Patch`;
- `Sealed Parcel` should be considered a custody/delivery object or contract context rather than an ordinary commodity.

Aspen routes should generally change **source availability**, not teach the player that a familiar real-world ingredient suddenly exists.

Useful availability language:

`UNKNOWN → KNOWN → SOURCE_LOCATED → LOCALLY_AVAILABLE → ESTABLISHED`

If the Bar menu already shows Cardamom, the player already knows Cardamom exists. Aspen may locate a reliable supplier, bring a finite shipment, improve lead time or create a new local source path.

Candidate route-profile research pools may include agricultural/botanical, spice/tea, industrial/repair and metropolitan/cultural. Exact ports, shipment sizes, unlock counts and route timing remain Open.

---

## Wong — rebuild from household enterprise needs

The old Wong prototype catalogue should not be protected because it is cute or surreal.

Early texture such as `Dead Pigeon`, `Chewed Rope Toy`, `Red Ribbon`, `Glasses Wipe`, `Pocket Match`, `Fish Bones` and similar junk is **purge/replacement material** unless a later mechanic gives a specific object a real source, sink and consequence.

`Bicycle Bell` has a clear bridge into the bicycle/repair economy and is worth retaining.

Future Wong low-value circulation should favour ordinary material that a small household enterprise could genuinely aggregate, store, reuse or move, for example:

- Returnable Glass Bottle
- Plastic Produce Crate
- Cardboard Shipping Carton
- Packing Tape
- Cotton Rope
- Used Bicycle Parts
- Reusable Shopping Bag
- Small Padlock
- Luggage Tag
- Parcel Envelope
- Packing Paper / Bubble Wrap
- Second-hand Phone Charger
- Folding Hand Trolley

These are **design directions**, not a command to instantiate every line as a SKU.

The point is that Wong makes money from turnover, aggregation, custody, salvage, clearance and small services—not from an endless random-junk generator.

The candidate multi-use parcel / short-storage / salvage counter remains stronger than pharmacy or laundry. Regulated-pharmacy and Juan-remedy manufacturing are not current design commitments.

---

## Juan — biological productive capital, not junk or alchemy

The old Juan prototype objects `Lollipop`, `Glitter Tape`, `Lucky Sticker`, `Wax Candle Stub`, `Key That Opens Nothing` and similar speculative junk are **history/purge candidates**.

Keep `Tool Roll` and `Handlebar Tape` only where bicycle/repair mechanics justify them.

Replace generic botanical placeholders such as `Nursery Seed Packet` / `Mature Nursery Plant` over time with real species identities and mutable living state.

First-pass species candidates for simulation:

- Mint
- Basil
- Tomato
- Lemongrass
- Lime
- Fennel **or** Hibiscus
- one slower specimen/ornamental not yet named

This is deliberately a small crop set. Juan is not a farming game inside the trading game.

The intended economic contrast is enough to teach maturity, working capital, future-output finance, forced sale and biological risk: fast herbs, medium produce and slower citrus/specimen capital.

Do not add a pharmacy, remedy factory, alchemy system or grape-to-wine production chain merely to create more products.

---

## Yasmin — real collectibles, provenance and private capital

Yasmin should not be a source of vaguely poetic curios. Her assets should read like real auction, gallery, museum or high-end resale catalogue entries.

Prototype objects such as `One White Glove`, `Numbered Funeral Ticket`, `Unsent Letter`, `Valentino Still` and `Velvet Sleeve` are **rename/rebuild or purge candidates** unless a current authored scene depends on the exact object.

A real object may remain unusual without a literary name. `Taxidermied Moth`, for example, can become a specific catalogue object such as `Atlas Moth, Taxidermy Specimen`.

Candidate language families:

### Photography / film

- Gelatin Silver Print, 20 × 25 cm
- 35 mm Film Reel, 400 ft
- Signed Contact Sheet, 12 Frames
- Vintage Cinema Lobby Card

### Decorative art / silver

- Sterling Silver Serving Fork
- Art Deco Silver Cigarette Case
- Cut-Crystal Decanter
- Hand-Painted Porcelain Bowl

### Fashion / textile

- White Kid-Leather Evening Gloves, Pair
- Silk Twill Scarf, Hand-Rolled Hem
- Beaded Evening Bag
- Wool-Cashmere Overcoat

### Natural history / specimen

- Atlas Moth, Taxidermy Specimen
- Nautilus Shell Specimen
- Pressed Botanical Specimen Sheet

These are naming and asset-class references, not a frozen shopping list.

Collectible value should differ structurally from commodity value. Useful variables include authenticity, provenance, condition, scarcity, current fashion, buyer-specific utility, number and wealth of competing buyers, and liquidity/time to sale.

A collectible can therefore be worth little without evidence and much more after provenance is verified, without changing the underlying physical object.

---

## First-pass Market Core v0 — simulation input only

Use a compact heterogeneous set for source/sink and attention testing before rebuilding the whole library.

### Food / botanical bridge

1. Lime
2. Lemon
3. Orange
4. Apple
5. Cucumber
6. Tomato
7. Ginger
8. Mint
9. Basil
10. Fennel
11. Lemongrass
12. Hibiscus
13. Green Tea
14. Cardamom
15. Cinnamon
16. Szechuan Pepper

### Bar / logistics

17. Rum
18. Ice
19. Orgeat
20. Orange Curaçao
21. Demerara Syrup

### Marine / ordinary material economy

22. Fresh Mackerel
23. Smoked Eel
24. Organic Scrap
25. Empty Glass Bottle

### Mobility / repair

26. Steel Rim
27. Presta Inner Tube
28. Chain Quick-Link
29. Brake Cable
30. Tiny Torque Wrench

This **30-item Market Core v0 is not the final catalogue and must not be copied wholesale into runtime before quantitative testing.** Its purpose is to compare source/sink density, redundancy, dead-good rate, attention burden and actor concentration against the old prototype catalogue.

A healthy active market should remain heterogeneous. As a rough research composition, food/Bar/provisioning should not automatically occupy most visible slots; repair, packaging/logistics, household/salvage, collectibles, living assets and special/event objects need room too.

---

## Economic density test

Before a physical good is promoted into the player-facing market, ask:

1. Who can source it, and is the source actually reachable?
2. Who consumes, transforms, holds or values it?
3. Does its price/liquidity have a reason to change?
4. What can the player do besides immediately resell it?
5. Does it bridge more than one system or teach a unique mechanic?
6. Is it creating a real choice, or merely another label to remember?

Useful actions include consuming, transforming, repairing with, cultivating, holding, inspecting, pledging, consigning, gifting, moving between markets, using under deadline, using as collateral, or learning information from it.

An item supported only by one authored joke or one buyer is a candidate for deletion, reclassification or event-only treatment.

---

## Anti-bloat / anti-exploit guardrails

- No same-place infinite low-risk flipping.
- No magical next-day inventory refill solely to keep trade available.
- No side activity whose expected return permanently dominates the real economy.
- No guaranteed profitable inside information.
- No unlimited exponential business growth without capacity, competition, demand and financing constraints.
- Relationships must affect economically real variables such as credit, information, access, verification cost, priority, collateral or terms.
- Large positions must encounter finite liquidity and/or price impact.
- Ordinary recurring goods should normally have more than one effective source and more than one independent sink over the world model.
- Octopus clearing throughput is not Octopus personal market share.

---

## Open / not frozen

The following remain open and should be settled by simulation or later authored design rather than inferred from this document:

- final total content-library size;
- final count of true market-facing goods;
- exact early-run active-good count;
- exact Aspen route pools, ports, shipment sizes and first-route reveal count;
- exact Juan species list and growth parameters;
- exact Onewheel recipe correction, if any;
- exact Wong counter inventory and equipment;
- exact Yasmin collectible lots and Auction v2 rules;
- pooled shipment implementation;
- exact forms of information, reputation and relationship quantification;
- Plant agency / final Sunflower route details;
- whether any current prototype object survives for a later authored reason.

The next quantitative comparison should test **old prototype catalogue versus rebuild Market Core v0** on source/sink density, effective redundancy, dead inventory, player attention load, actor dominance and exploitability before runtime deletion or migration.
