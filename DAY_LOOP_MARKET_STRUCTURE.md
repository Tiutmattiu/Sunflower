# Sunflower — Solar Day Loop & Market Structure

> This document locks the current time structure for the next implementation milestone. It complements `GAME_DESIGN.md`, `NPC_ENGINE_ROUTE_AUDIT.md`, and `WORLD_LORE_SUN_MOMENT.md`.

## 1. Core Time Rule

**One in-game day = one strategic round.**

The old abstract 14-round structure becomes a 14-day prototype structure.

The day is naturally divided by the world’s solar behaviour:

1. **Sunrise** — Sun Moment / day boundary.
2. **Morning** — information, investigation, relationships, negotiation and positioning.
3. **Noon** — Sun Moment followed by the only regular public-market clearing session of the day.
4. **Afternoon** — interpret what happened, investigate, negotiate private matters, invest, build relationships and position for tomorrow.
5. **Sunset** — Sun Moment / settlement / consequences / next-day transition.

The Sun Moment is therefore not a separate philosophy minigame bolted onto the economy. It is the natural clock of the game world.

---

## 2. Noon Public Market

The regular public market opens **once per day at noon**.

This is where ordinary public-market liquidity is concentrated and where the large-scale movement of goods and sardines becomes real.

Before noon, traders may:

- research;
- gather information;
- post or prepare intentions;
- negotiate;
- seek financing;
- inspect goods;
- form beliefs about supply and demand;
- prepare orders.

At noon, committed orders / intentions clear against the actual available state.

After clearing:

- ownership changes;
- sardines move;
- failed orders remain failed;
- public transaction history updates;
- other traders can observe at least the public portion of the tape;
- prices and beliefs may change for tomorrow.

**Critical engine rule:** NPC market intentions are generated before clearing and committed. The engine resolves those same intentions. It must never reroll NPC intentions at the moment the player presses Resolve.

---

## 3. Public Market vs Private Deal

The daily public market is the most liquid, visible and standardised venue.

It is **not** the only possible place where value can change hands.

Outside the public session, future versions may support private / OTC activity such as:

- negotiated bilateral trades;
- barter;
- loans;
- forward delivery;
- investment;
- equity stakes;
- collateralised deals;
- information sales;
- black-market transactions;
- relationship-based gifts / favours.

These require finding a counterparty and consuming time. They are not globally liquid.

This distinction allows a player to be asset-rich but cash-poor before a time-sensitive opportunity, creating liquidity problems naturally rather than through scripted tutorials.

---

## 4. Morning

Morning is primarily **Observe → Investigate → Position**.

Example actions:

- talk to Dock Dog;
- investigate why Vale appears interested in an item;
- verify a rumour;
- inspect a good;
- ask the Sailor about departure;
- negotiate a private agreement;
- arrange financing;
- prepare a noon order;
- build a relationship;
- sell / buy information;
- research a business or asset.

Morning actions are freely chosen but **not infinite**.

For the first implementation milestone, use a small provisional time budget rather than trying to perfectly balance the final action economy.

Current provisional implementation target:

- 2 meaningful Morning actions;
- preparation of up to 3 noon offers/orders.

These values are balance constants, not lore canon.

---

## 5. Noon

Noon is the daily execution window.

The market should feel more like a short clearing session, exchange, auction board or limited-time wholesale market than an always-open RPG shop.

The player should experience a difference between:

> “I think this is going to happen.”

and

> “The market cleared. This actually happened.”

The public tape created at noon becomes information for the afternoon and future days.

A correct rumour can still lead to a losing trade if supply, competition or interpretation differs from what the player expected.

---

## 6. Afternoon

Afternoon is primarily **Interpret → React → Prepare Tomorrow**.

Examples:

- ask why an expected trade did not clear;
- approach a distressed seller;
- lend to someone who became illiquid;
- investigate an unusual print on the tape;
- talk to a winner / loser;
- build relationships;
- research tomorrow’s supply;
- arrange a forward contract;
- invest in the bar;
- commission the Sailor;
- enter a black-market venue;
- repair or produce an object;
- pursue story / world leads.

Current provisional implementation target:

- 2 meaningful Afternoon actions.

Again, this is a balance constant rather than final canon.

---

## 7. Sunset Settlement

Sunset closes the strategic day.

Possible settlement work includes:

- perishables aging / spoiling;
- consumption by NPC businesses or personal needs;
- debts becoming due;
- contract performance / default;
- business production;
- Sailor departure countdown;
- relationship and reputation consequences;
- rumours propagating through social networks;
- NPC belief updates;
- NPC learning from observed behaviour;
- Authority records / scrutiny;
- generating tomorrow’s committed market positions from the new state.

The next day must be causally downstream of the current one.

---

## 8. Liquidity Window

Once-daily public clearing creates an important systemic property:

**owning value does not mean being able to turn it into cash immediately.**

Example:

- player owns a Compass worth roughly 10;
- player has only 1 sardine in liquid cash;
- a private opportunity requires 6 sardines before noon;
- the Compass may not be easily sold until the noon public market.

The player may need to:

- borrow;
- pledge collateral;
- privately fire-sale the Compass;
- sell a receivable;
- negotiate delayed payment;
- miss the opportunity.

This produces liquidity, collateral, fire-sale and credit lessons naturally from the time structure.

---

## 9. NPC Time Symmetry

NPCs live in the same day as the player.

They do not get infinite free investigation or omniscience.

NPC information should depend on whether they:

- observed a public transaction;
- were physically / socially connected to an event;
- spent time investigating;
- bought information;
- received a rumour from a connected source;
- had the skill to notice the signal.

NPC learning must therefore consume attention / opportunity just as player learning does.

Do not implement hidden difficulty rubber-banding where NPCs automatically learn simply because the player profited.

---

## 10. Core Daily Loop

The current concise loop is:

**Observe → Position → Market → Interpret → Prepare → Settle → Repeat**

Or narratively:

> Today’s market is the consequence of yesterday’s needs, information, relationships and decisions. Today’s market changes what tomorrow can become.

---

## 11. Implementation Milestone: One Living Day

Before contracts, black markets, leverage, Sun-Moment attachment consequences, multi-currency FX, or the full conspiracy layer, the engine must prove that one complete day is coherent.

Milestone 1 should support:

- Day counter replacing abstract Round counter;
- Sunrise / Morning / Noon / Afternoon / Sunset phases;
- limited Morning and Afternoon time actions;
- NPC noon intentions committed before market clearing;
- one noon public-market clearing per day;
- actual movement of inventory and sardines at clearing;
- structured transaction history / public tape;
- simple stable NPC trading profiles;
- simple goal / pressure-based NPC decisions instead of arbitrary random selection;
- basic NPC memory of observed demand;
- sunset settlement;
- Day 2 generated from Day 1 state;
- existing sunflower routes retained as hidden event hooks where practical, but not allowed to dictate the whole economy.

Success criterion:

> If the player does very little, the market should still move for intelligible reasons, and after observing enough context the designer should be able to explain why each important NPC trade occurred.

---

## 12. Explicitly Deferred

Do **not** block Milestone 1 on:

- exact metaphysical animalisation threshold;
- final Fishmonger identity / secret;
- final player employer;
- full Sun Moment attachment mechanics;
- full contract / collateral priority system;
- black-market implementation;
- multiple currencies / FX;
- complete bar acquisition model;
- final Clown liberation story;
- final Grandma / animal sanctuary lore;
- final endgame diagnosis taxonomy.

Those systems can be layered onto a living daily market. They should not be used to hide a weak market engine.
