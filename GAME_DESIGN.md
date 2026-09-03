# Sunflower — Living Game Design Document

> Status: living design document. This captures the decisions, audit findings, design principles, and current direction agreed during the September 2026 redesign discussion.
>
> Core rule: do not add a mechanic merely because it sounds fun. Prefer a small set of economic primitives that can generate many behaviours systemically.

---

## 1. North Star

**Sunflower is a single-player trading sandbox about making one impossible acquisition inside a small, living market where money, goods, information, credit and reputation all have value.**

The player wants a sunflower. Nobody will simply sell one.

The primary pleasure is **strategic trading**: valuation, negotiation, information gathering, liquidity management, credit, relationships, market structure, risk, timing, and exploiting temporary opportunities.

Secondary pleasure is **exploration of an eccentric world**: odd traders, strange goods, absurd situations, hidden social routes, and emergent stories.

The desired feeling for experienced investors / business people is:

> “This game is speaking my language.”

For less experienced players, the goal is to learn genuine trading / business concepts through play rather than through quiz-style teaching.

---

## 2. Player Learning Loop

The game is intended to support repeated runs.

The player may fail, go bankrupt, discover too late that a route is gone, or realise the sunflower is no longer realistically obtainable and restart.

**Meta-progression should primarily exist in the player’s own memory, not in permanent stat upgrades.**

A restart does **not** carry over assets. It carries over only what the human player has learned about:

- which traders matter;
- what information is reliable;
- how certain markets behave;
- what hidden inventories / needs may exist;
- who can be trusted;
- when liquidity matters;
- where arbitrage appears and disappears;
- what consequences follow fraud, default, bribery, etc.

Reality-based trading skill should provide an advantage on a first run, but nobody should begin with complete market-specific informational edge.

---

## 3. Current Theme / Sunflower Motivation

The final motivation for wanting the sunflower is still being developed.

A promising direction is that the player ultimately wants **sunflower seeds**, allowing the endgame to expand from “acquiring a rare asset” into food, agriculture, culture, and gifting.

Possible post-completion content:

- sunflower seed nutrition;
- dishes / ways sunflower seeds are eaten in different countries;
- roasting / seasoning / culinary uses;
- agricultural / commodity context;
- planting and propagation;
- an unlocked community “Seed Board” where completed players leave a customised seed / seed packet / short message.

This thematic arc is valuable because it can reframe the sunflower from **asset** into **food / plant / gift / culture**, without invalidating the trading game.

The Grandma Supper ending is particularly important because it can embody the idea that not everything valuable must be acquired through market logic.

---

## 4. Opening / Context

The old prototype drops the player directly into a dense trading dashboard without establishing a mental model.

A mobile-first opening gate has now been added. It currently establishes only:

- you want a sunflower;
- nobody will sell you one;
- you have a limited number of rounds before the market closes;
- sardines are money;
- you can make multiple offers;
- other traders act while you do;
- demand can change value;
- you are not expected to understand the market on your first run.

The opening should remain short and **must not reveal the three sunflower routes**.

Current opening copy is a placeholder until the sunflower / seed motivation is finalised.

---

## 5. Information Design Constitution

**Show a number or fact when the player’s role could realistically know it. Hide it when it would realistically be private.**

Do not hide information merely to create guessing.

Do not reveal information merely because the engine contains it.

Examples:

### Public / reasonably knowable
- your own cash;
- your own inventory;
- public asking prices;
- posted buy / sell orders;
- recent public transaction history;
- published reference values;
- formal contract terms;
- formal market fees;
- public sanctions / restrictions.

### Potentially private
- another trader’s reservation price;
- hidden inventory;
- urgent liquidity needs;
- private contractual obligations;
- true motives;
- personal risk tolerance;
- undisclosed debt;
- hidden relationships;
- insider information.

### Learnable through play
Private information may become accessible through:

- observation;
- repeated business;
- friendship / relationship capital;
- paid intelligence;
- market reports;
- rumours;
- bribery;
- illicit information channels;
- counterparties voluntarily revealing information;
- inference from behaviour.

**False information changes the player’s belief state, not the actual world state.**

If a rumour falsely says Vale owns a Velvet Sleeve, the item must not magically appear in Vale’s real inventory. The player’s notebook may record:

- rumoured inventory;
- source;
- confidence;
- date / round learned.

Source quality is itself an asset.

---

## 6. Inventory Visibility

Do not automatically expose every NPC’s entire inventory.

A layered model is preferred:

1. **Public inventory / listings** — openly offered goods.
2. **Observed inventory** — things the player has personally seen.
3. **Relationship-revealed inventory** — disclosed because of trust or repeated business.
4. **Intelligence-derived inventory** — learned through reports, informants, bribery, etc.
5. **Rumoured inventory** — uncertain and possibly false.
6. **Truly hidden inventory** — remains unknown.

Player privacy should follow comparable rules. The player should not automatically enjoy more privacy than NPCs.

Market / authority status may reduce privacy. A flagged player may be inspected, restricted, or barred from legitimate venues.

---

## 7. Core Economic Model

Preferred asset-value model: **D — reference value + private utility + supply / demand.**

A good may therefore have:

- public reference value;
- market price history;
- current scarcity / demand pressure;
- different private utility for each trader;
- different reservation prices;
- urgency-driven valuation changes;
- strategic / option value beyond immediate resale.

There should not be a single omniscient “true price” exposed to the player.

---

## 8. Economic Primitives

The game should be built from a small set of primitives:

1. **Goods**
2. **Cash** (sardines)
3. **Information**
4. **Obligations**
5. **Relationships**
6. **Time**

New mechanics should preferably be representable as combinations of these rather than as bespoke minigames.

Examples:

- Loan = cash now ↔ obligation later.
- Trade credit = goods now ↔ cash obligation later.
- Forward / future delivery = promise of goods later ↔ consideration now.
- Information sale = information ↔ cash / goods / favour.
- Bribe = cash ↔ information / tolerance / action.
- Fraud = false information causing transfer of goods / cash / credit.
- Reputation = other actors updating beliefs based on past performance.
- Collateralised loan = cash now + pledged good ↔ repayment obligation.

---

## 9. Negotiation

Negotiation should be allowed.

The old model of “submit one offer and receive automatic accept / reject” is too thin for the intended game.

Desired possibility:

> Player: 4 sardines.
>
> Fishmonger: 7.
>
> Player: 5 + rope.
>
> Fishmonger: 6.

Negotiation enables genuine concepts such as:

- anchoring;
- BATNA;
- reservation price;
- concessions;
- urgency;
- walk-away discipline;
- information leakage;
- bargaining reputation;
- relationship effects;
- multi-part consideration.

NPC negotiation behaviour should depend on personality, economic state, relationship, urgency, alternatives, and beliefs about the player.

---

## 10. NPC Design

NPCs should be both **characters and economic agents**.

Personality itself should influence economic behaviour.

Possible parameters:

- risk tolerance;
- patience;
- cash preference;
- inventory tolerance;
- honesty;
- vindictiveness;
- gossip tendency;
- relationship sensitivity;
- sophistication;
- willingness to use black markets;
- authority tolerance;
- credit standards;
- information discipline;
- propensity to bluff;
- urgency schedules;
- strategic goals.

NPCs must have **strong memory**.

They should remember meaningful behaviour such as:

- repeated lowballing;
- reliable settlement;
- default;
- profitable cooperation;
- fraud;
- useful introductions;
- information sales;
- leaked secrets;
- bribery;
- betrayal;
- previous negotiation patterns.

NPCs should also be able to **approach the player proactively**, e.g.:

> “I heard you have oil.”
>
> “Someone says you know where the marble is.”
>
> “I need liquidity tonight.”

This allows the player to become an actual node in the market rather than a spectator clicking through NPC menus.

---

## 11. Information as a Tradeable Asset

Information can be bought, sold, withheld, exchanged for favours, or deliberately falsified.

The player may knowingly sell false information, but successful deception should require skill and carry potentially severe consequences.

Selling information may itself destroy the value of that information.

Example:

- player discovers a temporary Orgeat shortage;
- another trader offers 3 sardines for the information;
- selling provides immediate profit;
- the buyer becomes a competitor;
- demand rises;
- the original player’s informational edge decays.

This creates a real decision between **monetising alpha** and **preserving alpha**.

Information should have:

- source;
- confidence;
- freshness;
- exclusivity;
- verification cost;
- economic relevance;
- possible strategic leakage.

---

## 12. Credit, Debt, and Future Delivery

Borrowing is allowed.

Future delivery is allowed.

Contracts are allowed.

The player should be able to transact assets they do not currently possess if a counterparty trusts their future performance.

Examples:

- borrow 6 sardines, repay 9 in three rounds;
- receive Steel Rim now, deliver Lime Crate next round;
- sell fish now for payment two rounds later;
- pledge Blue Marble as collateral;
- sell a future receivable;
- refinance short-term debt.

Credit should therefore become a monetisable form of reputation.

---

## 13. Contract System

Avoid separate hard-coded systems for loans, forwards, trade credit, etc. Prefer a generic contract representation.

A contract may contain:

- parties;
- goods / cash / information transferred now;
- goods / cash / information owed later;
- due round;
- location / venue;
- collateral;
- enforcement regime;
- default consequences;
- optional penalties;
- transferability, if ever supported.

Formal-market contracts can be enforced by institutions.

Black-market / informal contracts may rely instead on reputation, collateral, relationships, threats, or social enforcement.

---

## 14. Formal Market, Grey Market, Black Market

Different markets should not merely sell different items. They should operate under **different institutions and information regimes**.

### Formal market
Potential features:

- public listings;
- transaction records;
- enforceable contracts;
- fees / tariffs;
- legal restrictions;
- identity / credit requirements;
- greater price transparency;
- authority oversight;
- recourse after breach.

### Black / informal market
Potential features:

- weak or no formal enforcement;
- anonymous or opaque counterparties;
- lower fees / fewer restrictions;
- illegal / stolen / sanctioned goods;
- worse information quality;
- higher fraud risk;
- extreme pricing;
- informal credit;
- bribery / favours;
- no guaranteed recourse;
- authority risk.

Do not make “black market” merely a higher-level shop.

---

## 15. Authority

Use both **institutional rules** and **human authority actors**.

Example:

### Harbour Authority (institution)
- market access;
- contract enforcement;
- trade restrictions;
- inspections;
- sanctions;
- licensing;
- reporting requirements;
- public flags.

### Inspectors / officials (actors)
Individual people may differ in:

- honesty;
- strictness;
- competence;
- bribability;
- personal relationships;
- risk tolerance;
- faction interests.

A player may influence an individual official without magically corrupting the entire institution.

Authority flagging may reduce player privacy or bar access to formal markets, forcing the player toward informal channels.

---

## 16. Fraud and the Snake-Oil Playstyle

The old **Bad Tangerine** mechanic must remain, but it should become the seed of a full deception strategy rather than a one-off punishment flag.

Fraud should be a skillful strategy, not an “evil button.”

A bad fraudster:

- tells easily verifiable lies;
- obtains one large short-term profit;
- is exposed quickly;
- loses credit and counterparties;
- gets restricted;
- collapses.

A sophisticated confidence operator may:

- choose hard-to-verify claims;
- mix truthful and false information;
- preserve some clean relationships;
- repay most debts;
- target specific counterparties;
- manage exposure;
- compensate strategically when necessary;
- maintain multiple reputational identities across social circles.

Possible final archetype:

**The Confidence Man / The Snake-Oil Merchant**

The game should be able to recognise a player who lies frequently but lies strategically well.

---

## 17. Reputation Is Not One Good/Bad Meter

Reputation should be multidimensional and actor-specific.

Possible beliefs others hold about the player:

- **Creditworthiness** — will they repay?
- **Integrity** — are their goods / claims genuine?
- **Competence** — do they know what they are doing?
- **Influence** — who do they know?
- **Danger** — what happens if you cross them?
- **Liquidity** — are they desperate for cash?

These may differ by counterparty and social network.

A player may be untrustworthy but highly competent.

Some traders may avoid that player; others may specifically seek them out.

Reputation should alter:

- credit terms;
- negotiation stance;
- willingness to reveal information;
- inventory visibility;
- access to deals;
- spreads;
- collateral requirements;
- authority scrutiny;
- gossip propagation.

---

## 18. Arbitrage and Market Feedback

Emergent arbitrage is desirable.

The author should not need to pre-script every profitable route.

However, arbitrage must not become an infinite money loop.

When a spread is exploited:

- supply changes;
- demand changes;
- inventories move;
- counterparties update beliefs;
- other traders notice;
- competition can enter;
- quoted prices change;
- the opportunity may close.

The player’s own trade size may create **market impact**.

The player may also deliberately keep an edge secret or sell it to competitors.

No boring “work a job for fixed money” loop should be used as a generic cash faucet.

Additional income should arise from market-like behaviours such as:

- information brokerage;
- lending;
- financing;
- intermediation;
- arbitrage;
- speculation;
- liquidity provision;
- structured deals;
- fraud;
- bribery / influence;
- grey-market activity.

---

## 19. Time / Rounds / Action Economy

A round must impose a genuine constraint.

The player must not be able to explore, interrogate, research, and negotiate infinitely within the same round.

The exact diegetic duration of one round is not yet fixed.

Possible constraints:

- action points;
- limited conversations;
- limited investigations;
- negotiation consumes time;
- movement between market areas consumes time;
- market reports take time;
- contracts have round-based due dates;
- certain traders leave / arrive on schedules.

Time should matter because information decays, counterparties move, obligations mature, inventory changes, and opportunities disappear.

The existing 14-round limit is provisional and should be reconsidered once the mature action economy is defined.

---

## 20. Bankruptcy / Failure

Simple `cash == 0` is not bankruptcy.

Current preferred concept:

**Economic death occurs when the player has no usable liquidity and no counterparty is willing to transact / extend credit / accept available assets in a way that can restore viability.**

Formal debt default can also trigger collapse or force the player into black-market survival.

A player may restart early once they know the sunflower is no longer realistically obtainable.

---

## 21. Success Is Separate From Trading Quality

Acquiring the sunflower and trading well are two independent axes.

A player may acquire the sunflower while destroying nearly all economic value and relationships.

Example:

**SUCCESS — THE DESPERATE ACQUIRER**

- Objective execution: exceptional
- Valuation discipline: poor
- Liquidity management: catastrophic
- Credit dependence: extreme
- Relationship preservation: low

> You got exactly what you wanted. You paid for it with almost everything else.

Likewise, a player may fail to acquire the sunflower but demonstrate exceptional market-making, information brokerage, or wealth creation.

---

## 22. Trader Diagnosis System

The end-of-run diagnosis should be much deeper than the current prototype’s few counters.

Potential dimensions:

- Valuation discipline
- Liquidity management
- Information acquisition
- Information monetisation
- Information verification
- Execution quality
- Risk appetite
- Position sizing
- Inventory turnover
- Arbitrage instinct
- Negotiation efficiency
- Patience / timing
- Network capital
- Reputation strategy
- Credit management
- Counterparty selection
- Adaptability
- Speculation tendency
- Contract reliability
- Market impact awareness
- Deception skill
- Deception exposure control
- Objective discipline

Possible archetypes include, but are not limited to:

- The Arbitrageur
- The Information Broker
- The Conviction Trader
- The Market Maker
- The Desperate Acquirer
- The Hoarder
- The Defector
- The Confidence Man / Snake-Oil Merchant
- The Whale
- The Spread Reader
- The Clean Knife
- The Bagholder

Archetypes should emerge from a multidimensional profile, not a simplistic single if/else condition.

The report should explain strengths, weaknesses, blind spots, and relevant real-world trading / business concepts.

The diagnosis is a major product goal, not decorative flavour text.

---

## 23. Educational Philosophy

Sunflower should teach by **experience first, terminology second**.

Do not interrupt play with textbook lectures.

Let players experience:

- adverse selection;
- information asymmetry;
- liquidity premium;
- opportunity cost;
- inventory risk;
- reservation price;
- spread;
- arbitrage;
- counterparty risk;
- reputation capital;
- sunk cost;
- expected value;
- market impact;
- leverage;
- collateral;
- credit spread;
- default;
- reflexivity;
- moral hazard;
- signalling;
- optionality.

Then the final report / post-run analysis can name and explain what happened.

The game should not become a gamified MBA worksheet.

---

## 24. World Tone / Charm — Must Preserve

Do not optimise away the absurdity.

Preserve the strange concrete items and the sardine economy.

Important existing flavour:

- Sardines as currency
- Dead Pigeon
- Fish Bones
- Orgeat Bottle
- Sperm Whale Oil
- Blue Glass Marble
- Bad Tangerine
- Mai Tai
- Onewheel Clown
- Grandma Supper
- Vale Auction
- Cliff Race

Do **not** flatten these into generic resources such as “Commodity A”, “Food”, “Iron”, or “Potion”.

The game should be economically serious underneath and ridiculous on the surface.

The README’s current minimalist `# Sunflower / game` has archaeological charm and should not be overwritten casually.

---

## 25. Sunflower Routes

The current prototype has three distinct routes:

1. Grandma Supper
2. Vale Auction
3. Cliff Race

These should not be presented up front as a quest checklist.

The player should discover them through world evidence, relationships, rumours, and market behaviour.

More importantly, the game should evolve so these are **not the only meaningful economic paths in the world**. They are possible ways to acquire the target, while the economic sandbox remains broader and systemic.

The Grandma route is especially valuable because it subverts pure market optimisation.

---

## 26. Missable Opportunities

The player is allowed to permanently miss routes or opportunities, even without explicit videogame-style warnings.

However, missable content should be **telegraphed through evidence**.

A good loss creates:

> “I should have noticed that.”

A bad loss creates:

> “How could the game possibly expect me to know that?”

Do not use intrusive warnings such as:

> “WARNING: selling this item permanently locks Route X.”

Prefer observable clues that experienced players can recognise on later runs.

---

## 27. Mobile-First UX

The old prototype is responsive desktop UI, not true mobile design.

Current desktop problems:

- long dashboard;
- excessive vertical scrolling;
- many simultaneous panels;
- tiny controls;
- three multi-field offer rows;
- route board / heat / stats / log all competing for attention;
- important actions can be far from the information that motivates them.

Preferred mobile information architecture:

### Main navigation
- **Market** — traders, public listings, market activity, observed signals
- **Trade** — offer / negotiation composer
- **Leads** — discovered sunflower-related rumours and opportunities
- **Bag** — player assets, obligations, information, contracts

### Persistent top bar
- time / round
- sardines / liquidity status
- important status flags

### Persistent action area
- resolve / end round / proceed

### Trader interaction
Tap a trader → bottom sheet or focused screen rather than scrolling to a distant card.

### Planned trades
Keep the idea of multiple planned actions per round, but replace desktop-style forms with touch-friendly staged trade cards.

---

## 28. Leads, Not Route Checklist

Replace the current explicit Route Board with discoveries / rumours / leads.

Possible examples:

**An Old Woman at Closing Time**
> “The apprentice says his grandmother likes fish.”

**Vale’s Auction**
> “Vale is preparing one last auction. Something is missing.”

**The Cliff Road**
> “The clown claims the flowers still grow beyond the cliffs.”

Requirements should reveal gradually through play rather than appear as developer checkboxes.

---

## 29. Public Numbers vs Hidden Numbers

The game can be relatively numbers-heavy because the target audience includes people comfortable with business / trading.

However, numbers should respect the information constitution.

Good candidates for explicit numbers:

- public prices;
- player cash;
- transaction history;
- fees;
- formal contract obligations;
- quoted interest;
- collateral;
- published reference values.

Do not expose hidden internal mechanics such as:

- exact NPC reservation price;
- exact hidden “heat” score;
- hidden personality weights;
- exact fraud-detection probability unless institutionally published.

Market Heat as a raw developer number may be removed or transformed into observable market data.

Example instead of `Heat = 4`:

- Mackerel recent trades: 4 → 5 → 6
- buy interest: strong
- available public supply: low

A paid commodity report may convert noisy public information into a clearer professional signal.

---

## 30. Perishables

Perishability is not yet mature enough and may be removed unless it creates real strategic interaction.

If retained, it should meaningfully interact with:

- timing;
- inventory risk;
- price pressure;
- expected value;
- forced selling;
- logistics.

Example:

- Mackerel is currently in rising demand;
- the player holds it;
- it expires soon;
- selling now is safer;
- waiting may produce a better price but risks spoilage.

Perishability should not exist merely as another timer to remember.

---

## 31. Prototype Audit — Major Issues

### 31.1 Market Whispers are currently untrustworthy for the wrong reason

The prototype generates NPC offers for display, but `processRound()` generates a new random set when resolving the round.

Therefore the player may make decisions based on visible “whispers” that are not the intents actually executed.

**Fix principle:** generate the round’s NPC intents once, let the player observe some subset of them, and resolve that same intent set. If rumours are uncertain, uncertainty must be intentional and represented as information quality rather than accidental rerolling.

### 31.2 NPC-to-NPC trades are insufficiently explained

Important inventory can disappear without the player clearly seeing who moved it and why.

The round resolution should present meaningful market events, especially events that affect the player’s available opportunities.

### 31.3 Event queue blocks later routes

`buildEvents()` returns `events.slice(0, 1)`. Grandma is evaluated before Auction, Auction before Cliff.

A repeatedly eligible earlier event can effectively suppress later opportunities.

**Fix principle:** multiple active opportunities should be able to coexist; player chooses from discovered leads.

### 31.4 Auction unlock condition and actual bid requirement conflict

The route can unlock based on net worth while entry actually requires sufficient liquid sardines.

**Fix principle:** either require liquidity explicitly or create a mechanism to liquidate / collateralise assets.

### 31.5 Cliff Race calculates wealth after consuming important assets

The prototype removes Mai Tai / Onewheel before calculating a net-worth-dependent win probability.

**Fix principle:** evaluate eligibility / probability from the correct pre-consumption state.

### 31.6 Perishability implementation risk

The current filter callback mutates the inventory by pushing Spoiled Fish while simultaneously replacing the inventory with the filter result, risking lost state.

### 31.7 Round logging may be off by one

The prototype increments round and then logs `Round ${next.round} resolved`, potentially reporting the new round rather than the one just resolved.

### 31.8 Diagnosis is exposed too early

Current UI continuously shows developer-like counters such as exact deliveries, profitable flips, overpays, trade count, cheats, and hidden profit.

These should largely become hidden behavioural instrumentation revealed at the end.

---

## 32. Technical Direction

Do not perform architecture for architecture’s sake, but the current ~33 KB `App.jsx` mixes:

- game data;
- NPC AI;
- market engine;
- event logic;
- win conditions;
- diagnostics;
- React components;
- UI state.

A reasonable completion-stage split:

- `gameData.js` — items, NPC definitions, dialogue, route / world data
- `gameEngine.js` — trades, rounds, contracts, market updates, events
- `App.jsx` — app-level UI state and screen composition
- `components/` — mobile screens / sheets

Add local persistence so mobile browser refresh / tab eviction does not erase a run.

Do not overbuild a commercial-grade architecture or huge automated test suite unless later needed.

---

## 33. Existing Features to Preserve

Strong existing ideas:

- NPC needs / preferences
- barter + sardine economy
- NPC-to-NPC trading
- production chain (Mechanic / Onewheel)
- multiple sunflower routes
- cheating / reputation consequences
- player archetype idea
- market-changing demand
- bizarre item catalogue

Do not replace the game wholesale. Evolve the prototype into a coherent systemic market.

---

## 34. Scope Guardrail

Potential features already discussed:

- negotiation
- credit
- contracts
- black market
- bribery
- authorities
- information market
- reputation network
- investment
- fraud
- NPC competition
- lending
- future delivery
- player privacy

All are promising, but they must be implemented through the shared primitives whenever possible.

If a proposed mechanic cannot justify itself through the core trading experience, do not add it.

---

## 35. Reference Games / Design Lessons

Useful precedents to study:

### Offworld Trading Company
Study market feedback, supply / demand, closing arbitrage, and making economic actions directly affect future prices.

### Prosperous Universe
Study breachable contracts, trust, credit relationships, and how many financial behaviours can be represented through contracts rather than separate minigames.

### Starsector
Study formal vs black markets, institutional rules, authority scrutiny, tariffs, market access, and the interaction of systems with human agents.

### Star Traders: Frontiers
Study personal reputation vs faction reputation, contacts, personality, and relationship-based access.

### Space Warlord Organ Trading Simulator
Study how serious market mechanics can coexist with bizarre / comic goods and tone.

### The Invisible Hand
Study financial satire, moral ambiguity, and avoiding textbook-like presentation.

### Capitalism Lab
Study the depth possible in business simulation while deliberately avoiding spreadsheet overload in Sunflower.

Sunflower should not become larger than these games. Its opportunity is to be **smaller, denser, more interpersonal, more information-driven, more diagnostic, and genuinely comfortable on a phone.**

---

## 36. Current Product Identity

Sunflower should feel like a **small living harbour economy** rather than a huge macroeconomic simulation.

A plausible mature scale might be:

- roughly 8–12 major recurring traders;
- a limited set of strategically meaningful assets;
- a finite trading day / session;
- dense relationships and obligations;
- many emergent deal structures;
- substantial replay value because information and strategies are discovered over multiple runs.

Complexity should come from interactions between a few systems, not from hundreds of independent mechanics.

---

## 37. Current Non-Negotiable Design Principles

1. Strategic trading is primary; world exploration is secondary.
2. Do not make players guess values that their role should realistically know.
3. Do not reveal private information merely because the engine knows it.
4. Information is an asset.
5. Credit is an asset.
6. Reputation is multidimensional and counterparty-specific.
7. NPCs remember and can approach the player.
8. Formal and black markets operate under different institutions.
9. Fraud must be viable for a skilled player, not just punished automatically.
10. Arbitrage should emerge and then close as the market adapts.
11. The player may permanently miss opportunities without explicit warnings, but evidence must exist.
12. Acquiring the sunflower and trading well are separate success dimensions.
13. Player knowledge, not permanent stat upgrades, is the main replay progression.
14. Mobile-first interaction is a requirement, not an afterthought.
15. Preserve the weird tone: sardines, dead pigeons, bad tangerines, Mai Tai, clown, grandmother, sunflower.
16. Prefer Goods · Cash · Information · Obligations · Relationships · Time over adding new resource bars.

---

## 38. Immediate Design Work Before Major Implementation

Before implementing the full economic engine, define behaviour for concrete edge cases.

Next step: run a series of trading scenarios and decide:

- what information each actor knows;
- what actions are legal / possible;
- what contracts are formed;
- what the authority can enforce;
- how NPC beliefs change;
- what market prices / opportunities change afterward;
- how the final diagnostic records the behaviour.

The purpose is to derive a coherent engine from examples instead of continuing to add mechanics by intuition.
