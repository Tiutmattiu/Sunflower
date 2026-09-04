# Sunflower — NPC Character & Economy Bible

> Companion to `GAME_DESIGN.md`, `SCENARIOS_TEACHING.md`, and `NPC_ENGINE_ROUTE_AUDIT.md`.
>
> This file captures the narrative-economic character concepts established during the September 2026 freestyle session. These are **character truths and design hypotheses**, not yet final numerical balance.

---

# 1. Core Rule: NPCs Are People Before They Are Functions

NPCs are not quest dispensers and are not random market bots.

Each NPC should have:

- a life outside the player;
- a reason to be at the harbour today;
- recurring needs and expenses;
- a source of goods / income;
- things they personally value beyond resale price;
- a social network;
- a stable trading style;
- incomplete beliefs about the market;
- deadlines / schedules;
- an ability to learn;
- a reason to leave, stay, spend, save, speculate, or refuse a deal.

The player is the seventh market participant entering a world that already moves without them.

No NPC currently shares the player's sunflower objective by default. Their independent goals make the sunflower difficult to obtain indirectly.

---

# 2. Dock Dog 🐕

## Narrative identity

Dock Dog is a ship-and-harbour dog who survives by roaming docks, ships, alleys, rubbish piles, and discarded cargo.

Dog is also the local stray-cat rescuer / organiser and has personally taken in roughly seven or eight cats.

This creates a recurring, non-market motive: Dog constantly needs food, cat supplies, bedding / litter-like materials, scraps, and other things useful for keeping the cats alive.

Dog also needs food for themself.

## Economic role

Dog is a **high-volume, low-margin scavenger / junk dealer / informal intermediary**.

Dog acquires:

- discarded objects;
- food scraps;
- bones;
- spoiled / decaying goods;
- dead small animals / bizarre refuse;
- ship leftovers;
- low-value miscellaneous goods;
- occasionally surprisingly valuable lost or abandoned objects.

Dog is willing to buy things other traders consider worthless, especially if they can be resold in bulk or repurposed.

Dog's basic profit model is simple:

> pick up cheap / free things → trade them somewhere else → repeat at high volume.

Dog is **not initially a sophisticated trader**. Their edge is access and information, not valuation expertise.

## Information role

Dog goes everywhere and knows many people. This makes Dog one of the harbour's strongest gossip / access nodes.

Dog may know:

- where people have been;
- who is looking for something;
- which ship arrived;
- who was seen near the black market;
- what was thrown away;
- which trader suddenly has cash;
- which official is corrupt;
- which rumour is circulating.

Dog may not always understand the economic significance of what they know.

This creates a strong asymmetry:

> information access: high
> source evaluation / valuation skill: initially low-to-medium

Dog can improve significantly over time by watching what the player does with information.

## Black-market role

Dock Dog is a natural **gateway to underground trading**.

Dog has relationships with local criminal / informal networks. Candidate factions include seagull-run or squirrel-run gangs operating:

- black-market access;
- underground lending / money changing;
- illicit goods;
- fences for stolen goods;
- unofficial information brokerage.

The player should not unlock a generic `BLACK MARKET` button. Instead, access can arise socially through Dog or other contacts.

## Daily life without player

If the player never appears, Dog will:

1. forage / scavenge;
2. find food or useful scraps;
3. trade low-value goods in volume;
4. acquire cat food / supplies;
5. maintain relationships across the harbour;
6. occasionally stumble into high-value lost objects;
7. potentially pass information between legitimate and illegitimate networks.

## Stable trading style

**High turnover / low margin / socially informed / cash-poor / inventory-tolerant.**

Dog should remain recognisably Dog even as they become better at business.

Potential growth arc:

> naive junk flipper → socially informed dealer → surprisingly capable information intermediary / small-scale market maker.

---

# 3. Fishmonger 🐠

## Narrative identity

Fishmonger owns / operates the fish market stall and is fundamentally **a fish trader / fisher**, not a general-purpose arbitrageur.

Their identity should remain tied to fish even if other goods occasionally become more profitable.

They may personally fish and occasionally pull strange non-fish objects from the water, allowing unusual items / machine parts / lost objects to enter the economy organically.

## Critical world role: source of sardines

Sardines are the harbour's primary currency. Fishmonger is therefore closely connected to the **primary source / conversion point of currency**.

This makes Fishmonger partly analogous to:

- a commodity producer;
- a mint-like source of the settlement good;
- an exchange house;
- a liquidity source.

This requires careful design so Fishmonger does not literally create infinite free money.

The world must eventually define why sardines function as money and how new sardines enter circulation.

## Possible multi-currency / FX direction

A possible later system is to have several fish / settlement commodities with changing exchange rates while sardines remain the dominant unit of account.

Relative abundance could move with:

- catch conditions;
- season;
- ship arrival;
- spoilage;
- local demand.

Fishmonger could then act partly like a **currency exchange / commodity exchange point**.

This is not yet approved for 1.0; it is a promising expansion only if it can remain legible.

## Stable trading style

Fishmonger should not abandon fish merely because steel rims temporarily have better margins.

Likely traits:

- understands fish quality and fish demand very well;
- knows local food buyers;
- manages fresh inventory and spoilage;
- may be less skilled outside their domain;
- can learn from repeated market behaviour;
- may notice downstream demand when the player repeatedly buys the same fish;
- may gradually improve at pricing / market inference without becoming Vale.

## Daily life without player

Fishmonger:

- catches / sources fish;
- sells fish;
- manages perishable inventory;
- exchanges fish-related settlement goods;
- occasionally introduces strange recovered items from the harbour / sea;
- maintains the monetary / food-liquidity backbone of the local market.

---

# 4. Sailor / Mechanic ⚙️

## Narrative identity

The current `Ship Mechanic` should be understood more broadly as a **sailor / seafarer who can repair things** rather than a stationary repair-shop owner.

They travel with a ship and will **leave the harbour at a known or discoverable round**.

Their presence is temporary.

## Economic role

The Sailor arrives with varied goods from elsewhere and primarily wants to **sell cargo / foreign or shipborne goods** before departure.

They are not especially motivated by hoarding sardines or becoming wealthy in the harbour.

They mainly need to provision the ship for departure.

Likely purchases include:

- food;
- clothing / practical supplies;
- ship necessities;
- citrus / limes;
- repair-related materials when relevant.

## Lime need

The Sailor has a hard requirement to acquire limes before departure, originally inspired by preventing scurvy on a sea voyage.

Therefore Lime has unusually high private utility to the Sailor near departure.

The Sailor's willingness to pay should increase as departure approaches if the need remains unsatisfied.

This is a natural deadline-driven valuation mechanic.

## Repair function / Onewheel route

The Sailor can repair or assemble the Clown's broken onewheel, but this should **not be visible as a menu service from the beginning**.

The player may discover the ability socially:

> Sailor asks what the player is trying to do.
>
> Player mentions the wager / broken onewheel.
>
> Sailor says they can probably repair it if the parts are found.

Repair parts may enter the world organically through:

- Fishmonger pulling something strange from the water;
- Dock Dog scavenging ship waste;
- cargo from another trader;
- formal / black-market purchase.

This turns the route from a checklist into relationship-driven discovery.

## Stable trading style

**Seller-heavy, practical, deadline-driven, moderately skilled, widely trusted.**

The Sailor is not the best trader but most people are willing to do business with them.

Their credibility may come from:

- repeated voyages;
- practical reliability;
- being known across ports;
- limited interest in manipulating local prices;
- a reputation for completing what they promise before departure.

---

# 5. Mirelle Vale 🎬

## Narrative identity

Mirelle Vale is an art-gallery aristocrat / socialite / auction operator.

She makes money through auctions and operates in privileged, high-end social markets rather than Dock Dog's high-volume low-value world.

She has connections across elite and criminal circles.

She is wealthy, sophisticated, socially powerful, and not especially pleasant.

## Economic role

Vale's edge comes from:

- auction expertise;
- collector networks;
- access to wealthy buyers;
- social status;
- specialised valuation of prestige goods;
- strategic relationship building;
- patient capital;
- access to investment opportunities;
- information control.

She seeks rare / collectible objects and unusual goods rather than bulk necessities.

The temporary presence of the Sailor is therefore strategically interesting to her: seafarers may bring things unavailable locally.

## Whale Oil need

Vale is hosting a prestige film screening using an old projector / historical apparatus whose operation requires sperm-whale oil or a similarly rare old fuel.

This creates an urgent private demand for a rare item brought by the Sailor.

Important design principle:

The oil should have a real world use to Vale, not exist merely as an auction-route key.

## Auction role

Vale runs the sunflower auction route.

This route should eventually teach:

- auction strategy;
- liquidity;
- financing;
- bidder information;
- bluffing;
- winner's curse / overpayment;
- settlement risk;
- strategic bidding;
- potentially bidder collusion / dirty trade scenarios.

## Stable trading style

**High sophistication / patient / status-sensitive / information-controlled / high selectivity / strong auction ability.**

Vale should often force others to reveal information first.

She can begin as one of the strongest traders in the harbour and still improve in fraud detection / player-specific modelling.

---

# 6. Onewheel Clown 🤡

## Narrative identity

Clown is an alcoholic / heavy drinker, a frequent bar customer, and especially loves Mai Tais.

Clown is also indebted and uses wagers / races as a way to make money.

They are not racing merely for honour. They have a financial motive.

## Long-term goal

The current bar owner is absent / trying to sell the establishment.

Clown's aspirational goal is to make enough money to **buy / take over / invest in the bar**.

This creates a natural bridge into ownership / investment concepts.

Clown may therefore be both:

- a debtor;
- a gambler / speculator;
- a would-be entrepreneur / acquisition buyer.

## Mai Tai dependency

Clown wants Mai Tai.

Mai Tai requires a special ingredient that the player must locate / finance / negotiate for through the market, after which the Bar Apprentice can prepare it.

The exact ingredient chain remains to be cleaned up from the prototype.

## Race role

Clown proposes races / wagers because that is part of their income strategy.

They should have **high risk tolerance**, not random behaviour.

Race outcomes should eventually depend on analysable uncertainty rather than a naked random roll:

- equipment condition;
- route knowledge;
- weather;
- rider ability;
- alcohol / condition;
- sabotage;
- information quality;
- odds / betting market.

Clown may also bet on things beyond the race if this fits the final system.

## Stable trading style

**High-risk / leveraged / speculative / opportunistic / willing to bet / weak capital preservation.**

Clown can be smart without being prudent.

Their learning should improve odds assessment and deal structure while preserving appetite for risk.

---

# 7. Bar Apprentice 🍸

## Narrative identity

The Bar Apprentice works at a bar whose owner is currently absent and intends to sell the business.

The Apprentice is there primarily because they **love bartending, alcohol culture, socialising, and learning the craft**.

They are not primarily motivated by money.

Their family may in fact be wealthy, potentially connected to a winery / alcohol business or another comfortable background.

This creates the useful inversion:

> Vale looks richest;
> Bar Apprentice may secretly have the strongest family resources.

## Economic role

The Apprentice is likely:

- not highly profit-maximising;
- relationship-oriented;
- socially connected;
- knowledgeable about drinks / ingredients;
- willing to trade value for experiences / favours / relationships;
- capable of providing production transformation (ingredients → cocktails);
- potentially an important source of soft information from customers.

They may eventually become one of the NPCs everyone likes doing business with despite only average trading sophistication.

## Grandma route

The Grandma Supper route should grow naturally from the Apprentice's family / personal life rather than appearing as a checklist.

The player may build a relationship, learn about Grandma, help with drinks / food, and eventually receive an invitation.

This route remains the strongest candidate for a non-market resolution of the sunflower goal.

---

# 8. Relative Wealth / Reputation — Current Hypotheses

Not fully final.

Current narrative direction:

- **Poorest:** Dock Dog.
- **Looks richest / strongest visible wealth:** Mirelle Vale.
- **Potentially richest background / hidden family resources:** Bar Apprentice.
- **Most sophisticated trader:** Vale.
- **Most broadly trusted despite only moderate trading skill:** Sailor / Mechanic.
- **Highest risk appetite / most speculative:** Clown.
- **Most socially connected at street / informal level:** Dock Dog.
- **Most privileged social-network access:** Vale.

Still missing:

- who is cash-rich but asset-poor;
- who is asset-rich but liquidity-poor;
- who is secretly overleveraged;
- whether a new NPC should embody explicit investment / speculation expertise, or whether Clown + Vale already cover enough of that space.

---

# 9. Pre-existing Social Network — Not Yet Designed

This is now a critical missing piece.

The harbour needs a network before the player arrives.

Likely connections already implied:

- Dog knows underground / criminal actors.
- Vale has some connection to criminal and elite networks.
- Clown frequents the Bar and knows the Apprentice.
- Sailor is valuable to Vale because of rare foreign cargo.
- Sailor is generally trusted by local traders.
- Apprentice hears customer gossip through the Bar.

Still to design explicitly:

- friendships;
- grudges;
- debts;
- family ties;
- previous failed deals;
- gossip pathways;
- authority relationships;
- who trusts which information source;
- which networks overlap and which remain separate.

This network is necessary so rumours and reputation propagate through relationships rather than teleporting globally.

---

# 10. Market Day Variability

Runs should not begin identically.

Characters remain recognisable, but starting conditions can vary:

- ship arrival / departure timing;
- Sailor inventory;
- fish catch;
- available strange salvage;
- Vale's current prestige event;
- Bar sale conditions;
- Clown's debt pressure;
- Dog's scavenged finds;
- active rumours;
- Authority scrutiny;
- available credit;
- weather / race conditions;
- temporary shortages.

The player should learn **market structure and people**, not memorise a deterministic answer sheet.

---

# 11. NPCs Do Not Compete for the Sunflower by Default

No current major NPC begins with the same stated objective as the player.

They do not know the player wants the sunflower unless the player reveals it or their behaviour makes it inferable.

Their independent actions can nevertheless:

- buy needed route items;
- consume scarce inputs;
- alter prices;
- close arbitrage;
- change auction conditions;
- create / remove credit;
- strengthen competitors;
- trigger Authority action;
- make a route harder or easier.

This is preferable to artificially making everyone race for the same quest object.

---

# 12. Emerging Character-Economy Contrast

The six characters now represent meaningfully different economic worlds:

| NPC | Economic world | Natural lesson space |
|---|---|---|
| Dock Dog | scavenging, low-margin turnover, informal networks | volume, spread, information access, black markets |
| Fishmonger | food production, perishables, settlement commodity | supply, inventory, liquidity, commodity / currency ideas |
| Sailor | temporary foreign supply, provisioning, deadlines | scarcity, private utility, deadline pricing, trust |
| Vale | elite auctions, collectibles, privileged networks | auctions, valuation, financing, information strategy |
| Clown | debt, gambling, acquisition ambition | risk, leverage, odds, speculation, entrepreneurship |
| Bar Apprentice | production, relationships, low money motive | non-financial utility, transformation, relationship capital |

This is strong because the NPC cast can teach different economic intuitions without becoming tutorial characters.

---

# 13. Critical Design Questions Produced by This Freestyle

These must be resolved before detailed NPC implementation.

1. **What exactly makes sardines money?**
   - Are sardines literal preserved fish?
   - Who accepts them and why?
   - Can Fishmonger create them at will?
   - What constrains supply?
   - Are they commodity money, minted tokens backed by fish, or a joke world convention?

2. **Does 1.0 need multiple currencies?**
   - FX / exchange-rate gameplay is attractive but may duplicate commodity speculation and dramatically increase cognitive load.

3. **Who supplies Lime?**
   - Lime must exist for reasons beyond Sailor route gating.
   - Who imports / grows / holds it, and who else wants it?

4. **What is the exact Mai Tai supply chain?**
   - Which special ingredient is scarce?
   - Why is it scarce today?
   - Who normally supplies it?

5. **How does the Bar sale work?**
   - Asking price?
   - Existing debt / revenue?
   - Does the player or Clown have access to financial statements?
   - Can multiple NPCs bid / invest?
   - Can the player finance Clown or buy a stake?

6. **Does Sunflower 1.0 need another explicitly investment-oriented NPC?**
   - Vale already covers sophisticated capital / auctions.
   - Clown covers speculation / leverage.
   - Adding another may broaden concepts but risks character bloat.

7. **What social relationships exist before Round 1?**

8. **What is one round in story time and action economy?**

9. **What goods are sourced, transformed, consumed, and permanently sunk each run?**

10. **What information can each NPC observe without spending an action?**

11. **What does each NPC optimise?** Money cannot be the sole utility function.

12. **What does each NPC consider an unacceptable outcome?**

---

# 14. Provisional Utility Functions — Narrative First

NPC decision-making should not reduce to `maximise sardines`.

A useful conceptual model is:

`utility = money + goal progress + survival / obligations + relationship value + personal utility + strategic option value - risk - time pressure - reputation / legal cost`

Weights differ dramatically by NPC.

Examples:

### Dock Dog
High weight on:
- cat food / supplies;
- immediate usable goods;
- small positive margins at high turnover;
- relationships / access;
- information;
- avoiding total cash starvation.

Lower initial weight on:
- sophisticated long-term portfolio optimisation.

### Fishmonger
High weight on:
- fish business continuity;
- inventory turnover;
- avoiding spoilage;
- maintaining exchange / settlement role;
- domain-specific profit.

### Sailor
High weight on:
- provisioning before departure;
- liquidating excess cargo;
- reliability;
- leaving on time.

Money matters, but missing departure-critical supplies matters more.

### Vale
High weight on:
- profit;
- rare acquisitions;
- prestige;
- maintaining elite network position;
- optionality;
- information advantage.

### Clown
High weight on:
- upside;
- immediate liquidity;
- debt escape;
- funding bar acquisition;
- thrill / risk preference.

High tolerance for downside.

### Bar Apprentice
High weight on:
- relationships;
- craft / learning;
- interesting ingredients;
- social experience;
- helping people they like.

Profit maximisation is relatively low priority.

---

# 15. Key Implementation Principle

The engine should be able to explain an NPC action in human terms.

For internal debugging, every major NPC decision should be able to produce a hidden reasoning summary such as:

> Sailor bought Lime at 8 because departure is in 2 rounds, no confirmed alternative supplier exists, current belief assigns a 70% chance of no future supply, and player is considered reliable.

or:

> Dog bought three low-value scraps because cat-supply need is high, resale spread is small but positive, cash reserve remains above Dog's minimum, and the goods are easy to move through the informal network.

The player need not see this explanation directly. It exists so designers can verify that the market is behaving logically rather than randomly.

## Small finance notes for the current runtime

- Sailor can privately reserve cash for one authored Lime future-delivery promise while retaining working cash.
- Bar Apprentice may extend one small relationship-backed, interest-free cash loan.
- Vale may hold eligible durable collateral and lend against a 60% reference-value advance.
- A buyer may pay a small premium for temporary information distribution scarcity; private breach and public detection remain separate facts.
