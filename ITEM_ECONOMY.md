# Sunflower — Item Economy

> Status: active system design. Keep this document focused on what goods *do economically*, not on collecting a giant catalogue for its own sake.

## Core rule

**More items are only useful when they create more decisions.**

Sunflower should not become a key-and-lock adventure where every NPC wants exactly one bespoke quest object and then stops participating in the economy.

A good item should usually do at least one of the following:

- satisfy recurring consumption;
- substitute imperfectly for another good;
- act as a production input;
- store value or serve as plausible collateral;
- perish and create timing pressure;
- expose the holder to price / information risk;
- move differently through formal and informal markets;
- carry social, access or identity meaning;
- support resale / arbitrage rather than only one scripted delivery;
- create competition between multiple buyers.

## Current economic item families

### Food / sustenance

Examples:
- Fresh Mackerel
- Smoked Eel
- Sea Lettuce Bundle
- Salted Cod
- Hardtack Tin

These are not decorative. A player must eat at sunset. Holding food can therefore preserve cash, while selling food can improve liquidity at the cost of future survival.

### Perishable / timing-sensitive inputs

Examples:
- Ice Block
- Bruised Mint
- Lime Crate
- Fresh Mackerel

These decay on different schedules. Their value is partly a function of time and who currently needs them.

### Substitutes

Current first-pass examples:
- Sailor prefers Lime Crate but can accept Dried Citrus Peel at lower utility.
- Bar prefers Orgeat Bottle but can temporarily make do with Almond Paste Jar.
- Dock Dog prefers Fresh Mackerel but can feed the cats with Smoked Eel or Sea Lettuce.

Substitution is important because `NPC wants X` should not always mean `find exact key X`.

### Recurring operating inputs

The Bar repeatedly consumes Ice Block.

Dock Dog repeatedly consumes food for the cat colony.

This makes demand return after a purchase instead of disappearing permanently.

### Repair / productive capital

Examples:
- Steel Rim
- Copper Wire Coil
- Sailcloth Patch
- Tool Roll

These should increasingly feed repair, transport and production systems rather than function only as price tags.

### Durable / collateral-like goods

Examples:
- Brass Compass
- Bent Silver Fork
- Blue Glass Marble

Their usefulness is that they can hold value when cash is scarce and later support collateral / distressed-sale mechanics.

### High-uncertainty / special situations

Example:
- Sealed Parcel

Both Vale and Clown can value it for very different reasons. This creates buyer competition without requiring the item to have one objectively correct use.

### Animal-network / informal goods

Examples:
- Red Ribbon
- Empty Green Bottle
- Fish Bones
- Sugar Cube Tin
- scavenged oddities

These should eventually have different liquidity and meaning in animal society than in the formal human market.

## Recurring supply

The prototype now uses deterministic business cycles rather than random loot fountains:

- Fishmonger repeatedly lands fish / ice / sea produce.
- Dock Dog repeatedly scavenges low-value but socially connected goods.
- Sailor unloads rotating imported goods until the departure window.

This is deliberately deterministic for now so market changes remain explainable.

## Design target

A healthy small market should contain at the same time:

- obvious low-margin commodity trades;
- at least one perishable timing problem;
- at least one substitution decision;
- one or two illiquid / mysterious assets;
- a recurring operating need;
- a possible information edge;
- goods whose value differs sharply by counterparty.

The player should sometimes ask:

> Do I eat this, sell it, hold it, use it as an input, reveal who has it, or keep the information private?

That is preferable to:

> Which NPC is the scripted owner of the next quest key?

## Current item-pool judgement

The original prototype pool had charming names but was economically too thin. Many items were route-specific and many NPC needs could be solved once and permanently.

The September 3 expansion adds more goods, but **future expansion should be driven by missing economic roles rather than a target item count**.

Do not add ten objects just to make the bag look full.
