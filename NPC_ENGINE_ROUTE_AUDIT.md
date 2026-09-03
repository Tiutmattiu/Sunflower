# Sunflower — NPC Engine, System Audit, Route Redesign, and Open Questions

> Companion to `GAME_DESIGN.md` and `SCENARIOS_TEACHING.md`.
>
> This document captures the current direction for deterministic-but-adaptive NPC behaviour, the major systemic risks in the design, improvements to the three original sunflower routes, and the next questions that must be answered before implementation.

---

## 1. Teaching Principle: Experience First, Terminology Later

Sunflower should support players with no trading or business background.

**Core rule: the player experiences the economic event before the game names the concept.**

Example:

- The player owns a valuable Blue Marble but only 1 sardine in cash.
- A time-limited opportunity costs 6 sardines now.
- The player must decide whether to sell the marble cheaply, pledge it for a loan, sell a future receivable, or miss the deal.
- Only after the decision does the game explain: liquidity, collateral, fire sale, receivables financing.

Do not ask players to learn vocabulary before they can act.

Do not turn Sunflower into a quiz or financial-training dashboard.

The correct educational sequence is:

1. concrete situation;
2. intuitive decision;
3. consequence;
4. NPC/world reaction;
5. optional explanation of the real-world concept;
6. badge / Market Scar / War Story;
7. later diagnosis incorporates the pattern.

---

## 2. Market Scars / War Stories

Important market events should be memorable achievements rather than hidden telemetry only.

These are not necessarily positive achievements. They are stories the player has lived through.

Possible badges:

- **Snake Oil** — sold a seriously misunderstood or misrepresented good.
- **Technically True** — completed a misleading trade without making a literally false statement.
- **Read the Fine Print** — avoided a bad trade through inspection / warranty / contract language.
- **Sold It Before You Had It** — sold a future delivery before owning the underlying good, then successfully delivered.
- **Empty Promise** — accepted consideration for a future delivery and failed to deliver.
- **Closed the Spread** — exploited an arbitrage until competition / market impact erased it.
- **Sold the Map** — sold information about an opportunity and created a competitor.
- **Taught Your Rival** — educated a customer or counterparty until they could compete with you.
- **Fire Sale** — sold a valuable asset below reasonable value because immediate liquidity mattered more.
- **Wrong Sign** — possessed correct information but traded in the wrong direction.
- **Sacred Word** — gave up a profitable opportunity to honour a due obligation.
- **Broke the Promise, Made the Trade** — defaulted in order to fund a higher-return opportunity.
- **Run on You** — survived or failed during a self-fulfilling liquidity panic.
- **Last Lender** — provided emergency liquidity when other traders would not.
- **Fooled by Sardines** — made large profits from fragile or poorly justified decisions.
- **Paid for the Story** — bought an asset mainly because others believed the price would keep rising.
- **Pyrrhic Bloom** — obtained the sunflower while destroying most economic value / relationships / market access.

Badges should feed into final archetype analysis. One badge alone should never determine an archetype.

---

## 3. Classic Trading / Business Sources as Scenario Mines

Use classic books and market history to generate situations, not to transplant advice mechanically.

Useful source families:

### Market microstructure
Larry Harris, *Trading and Exchanges*.

Useful concepts:
- market structure;
- information asymmetry;
- liquidity;
- bid/ask spreads;
- informed vs uninformed traders;
- arbitrage;
- market impact;
- order visibility;
- manipulation;
- insider information;
- market-maker behaviour.

### Negotiation
Fisher, Ury, Patton, *Getting to Yes*.

Useful concepts:
- BATNA;
- reservation point;
- anchoring;
- concessions;
- alternatives;
- interests vs positions;
- walk-away discipline.

### Leverage and liquidity crises
Roger Lowenstein, *When Genius Failed*.

Useful concepts:
- leverage;
- crowded positions;
- liquidity mismatch;
- being directionally correct but unable to survive long enough;
- forced selling;
- refinancing risk.

### Luck vs skill
Nassim Nicholas Taleb, *Fooled by Randomness*.

Useful concepts:
- outcome bias;
- lucky profits;
- survivorship;
- fragile strategies that look brilliant during good runs;
- diagnosis should separate process from outcome.

### Price, value, cycles, risk
Howard Marks, *The Most Important Thing*.

Useful concepts:
- price vs value;
- second-level thinking;
- risk;
- cycles;
- contrarian behaviour;
- patience;
- crowded consensus.

### Market psychology and war stories
Edwin Lefèvre, *Reminiscences of a Stock Operator*.

Useful scenario patterns:
- tips from respected traders;
- rumours;
- manipulation;
- changing rules;
- knowing the right trade but being persuaded out of it;
- crowd psychology;
- overconfidence after success;
- market regime changes.

The game should transform these into small-port market stories involving sardines, strange goods, NPCs, contracts, rumours and relationships.

---

# PART II — NPC ENGINE

## 4. Current Prototype Problem

The old NPC engine is fundamentally too random for the intended game.

Current behaviour chooses random counterparties, randomly samples desired inventory, and randomly chooses whether to pay with goods or sardines. Static `NPC_PREFERENCES` provide only a weak filter.

This produces movement, but not intelligible market behaviour.

A player cannot reasonably learn from a market if NPC decisions do not follow stable incentives.

**New design rule: NPC behaviour may be uncertain, but should almost never be causeless.**

The player should usually be able to reconstruct why an NPC acted after learning enough about their situation.

---

## 5. What Drives an NPC?

NPC decisions should come from several layers, evaluated in order.

### Layer 1 — Hard state / needs
Concrete things that currently matter:

- cash on hand;
- inventory;
- debts and due dates;
- contracts owed / receivable;
- production needs;
- personal / narrative needs;
- time until departure or deadline;
- formal-market access;
- legal / authority restrictions;
- collateral tied up;
- current information set.

These create immediate pressure.

### Layer 2 — Stable personality
Traits should be relatively persistent between runs unless a character arc specifically changes them.

Examples:

- risk tolerance;
- patience;
- cash preference;
- willingness to hold inventory;
- honesty;
- propensity to bluff;
- gossip tendency;
- vindictiveness;
- relationship sensitivity;
- authority aversion;
- appetite for leverage;
- preference for simple vs complex contracts;
- willingness to speculate;
- negotiation aggression;
- need for control;
- tolerance for ambiguity;
- willingness to transact with untrusted actors.

Personality changes *how* an NPC responds to the same economic problem.

### Layer 3 — Trading style
Each NPC should have a recognisable, stable market style.

Possible styles:

- **Inventory trader** — likes buying useful stock cheaply and reselling steadily.
- **Liquidity-first merchant** — discounts heavily when needing cash and avoids receivables.
- **Relationship trader** — accepts worse immediate economics for trusted long-term counterparties.
- **Speculator** — willing to hold assets on a view about future demand.
- **Arbitrageur** — aggressively searches for cross-counterparty price mismatches.
- **Market maker / dealer** — prefers earning small spreads repeatedly rather than directional bets.
- **Information trader** — invests heavily in finding private or early information.
- **Credit trader / lender** — values repayment history and collateral more than goods themselves.
- **Opportunistic distressed buyer** — waits for forced sellers.
- **Confidence operator** — exploits beliefs, ambiguity and verification gaps.
- **Conservative producer** — mainly trades to secure inputs needed for production.

Style should be visible in repeated behaviour, not shown as an RPG class label at first contact.

### Layer 4 — Beliefs
NPCs do not act on the true game state. They act on what they believe.

Beliefs may include:

- estimated value of an item;
- expected future demand;
- what another NPC owns;
- whether the player is desperate;
- probability that a contract will be honoured;
- source reliability;
- whether a rumour is true;
- likelihood of authority intervention;
- whether a spread will persist;
- whether another trader is competing for the same asset.

Beliefs can be wrong.

This is crucial: an NPC should be able to make a rational decision from bad information.

### Layer 5 — Relationship / reputation
The same offer can produce different responses depending on:

- creditworthiness;
- integrity;
- competence;
- influence;
- danger;
- perceived liquidity;
- personal friendship / resentment;
- shared history;
- faction / social-network beliefs.

### Layer 6 — Opportunity set
An NPC should compare the player's proposal against realistic alternatives.

Questions the NPC should effectively ask:

- Can I sell this elsewhere?
- Can I wait?
- Do I have another buyer?
- Can I borrow instead?
- Do I need cash now?
- Will a better opportunity appear before my deadline?
- What happens if this player defaults?

This is the economic heart of BATNA.

### Layer 7 — Learning
NPCs should update from experience.

They may learn:

- a recurring arbitrage route;
- which sources are reliable;
- how to negotiate better;
- that the player tends to overpay;
- that a certain trader is desperate at closing time;
- that formal-market prices lag black-market demand;
- that an apparently safe strategy is crowded;
- that specific goods have hidden utility;
- how to interpret transaction history.

NPC improvement must be bounded by their sophistication, attention and access to data.

A naive trader should not become a hedge-fund genius after two rounds.

---

## 6. Proposed NPC Decision Process

At each decision opportunity, an NPC should:

1. **Update beliefs** from observed trades, private information, rumours, reports, conversations and memory.
2. **Check obligations / deadlines** that create urgent constraints.
3. **Generate goals**, e.g. raise cash, acquire Lime, reduce inventory, exploit a spread, protect reputation, repay debt, investigate a rumour.
4. **Generate candidate actions** that are actually available.
5. **Estimate outcomes** according to the NPC's imperfect beliefs.
6. **Score candidate actions** using the NPC's style, risk tolerance, relationships, urgency and expected utility.
7. **Choose from the best plausible actions**, with limited bounded variation rather than arbitrary randomness.
8. **Remember the result** and update future behaviour.

Randomness can exist in:

- which rumour reaches them;
- whether they notice a weak signal;
- tie-breaking between similarly attractive actions;
- emotional / personality noise;
- unexpected exogenous events.

Randomness should not decide core economic preferences without explanation.

---

## 7. Stable Style + Improvement

NPCs need both **identity** and **adaptation**.

A good model is:

> stable preferences + changing beliefs + improving skill.

Example: Dock Dog may always be socially curious, opportunistic and gossip-heavy. Over several rounds, Dog can become better at recognising which gossip is economically valuable. Dog remains recognisably Dog.

Fishmonger may remain inventory-focused and margin-conscious, but learn that the player's repeated Cod purchases imply downstream demand.

Vale may remain status-oriented and patient, while improving her ability to detect bluffing.

NPC learning should change:

- what they notice;
- what questions they ask;
- which information they buy;
- how they estimate value;
- negotiation sophistication;
- position sizing;
- willingness to copy successful strategies.

It should not erase personality.

---

## 8. NPC Competence Is Multidimensional

Avoid a single `intelligence = 8` stat.

Possible dimensions:

- valuation skill;
- information gathering;
- source evaluation;
- negotiation;
- credit analysis;
- risk management;
- liquidity management;
- strategic planning;
- fraud detection;
- deception;
- market observation;
- legal / authority knowledge;
- relationship management.

This allows a socially brilliant NPC to be terrible at pricing, or a quantitative trader to be easy to deceive socially.

---

## 9. NPC Progression and Player Competition

NPCs can become stronger because the player teaches them indirectly.

Examples:

- repeated obvious arbitrage trains competitors;
- selling research improves a customer's market understanding;
- aggressively lowballing reveals the player's negotiating pattern;
- repeatedly borrowing reveals liquidity needs;
- public successful trades attract copycats;
- an NPC who loses money due to bad information becomes more demanding about source verification.

The game should therefore naturally produce **alpha decay** and **competition learning**.

---

# PART III — SYSTEMIC RISKS / DESIGN HOLES

## 10. Can the Game Support This Complexity?

Yes, but only if complexity is produced by reusable primitives rather than bespoke features.

The intended system is feasible if most mechanics reduce to:

1. Goods
2. Cash
3. Information
4. Obligations
5. Relationships
6. Time

The danger is not computational complexity. The danger is **combinatorial player confusion** and rules that interact inconsistently.

Sunflower can support a deep economy if the underlying verbs stay small and legible.

Recommended core verbs:

- Observe
- Ask / investigate
- Negotiate
- Buy / sell / barter
- Promise / contract
- Borrow / lend
- Reveal / withhold / sell information
- Verify / inspect
- Wait / pass
- Use influence / bribe (when available)

Do not create a unique interface or subsystem for every concept.

---

## 11. Major Design Risks

### Risk A — NPC omniscience
If NPCs know the true world state while the player works through rumours and uncertainty, the game is unfair.

NPCs need belief states too.

### Risk B — NPC stupidity disguised as randomness
If traders randomly hand away strategically critical assets, players cannot learn market logic.

Every important trade should have an intelligible motive.

### Risk C — Too much hidden information
If almost everything is private, the game becomes guessing.

The player needs enough public market data and affordable investigative routes to make informed decisions.

### Risk D — Too much information
If every inventory, belief, contract, relationship and probability is visible, the game becomes spreadsheet analysis.

Information must be layered and contextual.

### Risk E — Infinite negotiation
Negotiation cannot be costless. Otherwise the player can interrogate every counterparty until finding reservation prices.

Negotiation must consume time / actions / patience / relationship capital.

### Risk F — Infinite credit loops
If players can borrow against future promises recursively with no haircut, lender risk model or collateral limits, they can manufacture infinite purchasing power.

Credit must depend on:

- expected repayment capacity;
- existing liabilities;
- counterparty trust;
- collateral quality;
- enforcement regime;
- maturity;
- liquidity;
- risk premium.

### Risk G — Infinite information duplication
Unlike fish, information can be copied at nearly zero marginal cost.

Its value therefore needs to depend on:

- exclusivity;
- freshness;
- credibility;
- market impact after dissemination;
- whether buyers can resell it;
- whether recipients become competitors.

### Risk H — Fraud that is either trivial or unbeatable
If deception is a simple button, it is shallow. If NPCs instantly detect all deception, it is pointless.

Fraud needs verification difficulty, source credibility, evidence, memory and social propagation.

### Risk I — Snowballing
A player who gets one early informational edge may become impossibly rich; conversely, one early loss may make recovery impossible.

Counterforces can include:

- market impact;
- competition entry;
- rising financing costs;
- diminishing edge;
- larger positions attracting attention;
- more sophisticated counterparties;
- opportunity costs;
- changing market regimes.

### Risk J — Diagnostics distort gameplay
If the player sees “Speculation +3” after every action, they will optimise the personality test instead of playing the market.

Most diagnostic scoring should remain hidden until end-of-run or major reflection points.

### Risk K — Designed routes overpower the sandbox
If every strategic asset ultimately exists only because Grandma/Auction/Race needs it, players will recognise the economy as a disguised quest tree.

Sunflower routes must sit *inside* the economy, not determine the entire economy.

### Risk L — Content explosion
A realistic system could create thousands of edge cases.

The engine needs generic rules for:

- ownership;
- transfer;
- promises;
- due dates;
- collateral;
- visibility;
- belief updates;
- reputation updates;
- enforcement;
- default;

Do not hand-script every combination.

---

## 12. Critical Current Prototype Bugs / Mismatches

The current prototype has several mechanics that must not survive unchanged:

- NPC trade selection is heavily random.
- Market whispers and actual resolved NPC intent are not reliably the same information set.
- NPC inventories are fully visible.
- Values are treated as near-objective constants.
- `exactWant` dominates behaviour too strongly.
- Blue Glass Marble is artificially forbidden from NPC trading rather than protected by believable motives / ownership incentives.
- The player cannot negotiate.
- Contracts / credit / future delivery do not exist.
- Market Heat is an opaque hidden modifier rather than a market phenomenon expressed through observable activity.
- Perishability is thin and currently creates confusing behaviour.
- Route events are author-gated checklists rather than emergent opportunities.
- `buildEvents()` returns only the first available route, so one route can block another.
- Auction unlock checks net worth but actual bidding requires liquid sardines, creating contradictory eligibility.
- Cliff Race calculates success after consuming major assets, distorting the intended probability logic.
- Archetype classification is far too simple for the intended diagnosis.

---

# PART IV — THE THREE ORIGINAL SUNFLOWER ROUTES

## 13. Route Design Rule

The three original routes should survive as **three distinct ways of solving the sunflower problem**, but they should no longer behave like visible quest recipes.

A route should emerge because the player understands people, markets and opportunities.

The route should not say:

> Collect Orgeat + Fish + Mai Tai = Grandma ending.

It should produce clues and economic circumstances that make such a solution discoverable.

---

## 14. Grandma Supper — Relationship / Non-Market Route

### Why it works
This is currently the strongest thematic route.

The player spends the game learning to assign prices to everything, yet ultimately receives the sunflower through hospitality / gifting / relationship rather than purchase.

It challenges the assumption that every valuable thing must be acquired through market exchange.

### Current weakness
The prototype reduces it to a checklist:

- deliver Orgeat;
- hold Mai Tai;
- hold soup fish;
- trigger event.

This makes it feel like a recipe puzzle rather than a social discovery.

### Redesign
Make Grandma exist socially before the route exists mechanically.

Possible progression:

1. The Bar Apprentice occasionally mentions closing early to visit his grandmother.
2. Through conversation / repeated business, the player learns she likes certain food / drinks or has a cultural connection to sunflower seeds.
3. The player may help the Bar Apprentice for reasons unrelated to the sunflower.
4. A supper invitation can emerge from relationship, timing and what the player happens to bring.
5. The sunflower is present at supper as an ordinary household object / food / plant, not a rare auction asset.
6. The player can receive it as a gift, trade for it informally, or perhaps earn seeds through generosity.

### Economic lesson
- relationship capital;
- reciprocity;
- gift economies;
- non-monetary value;
- sometimes maximising transaction value is not the best way to obtain an outcome.

### Failure / dirty variants
A manipulative player could fake friendship solely to access Grandma. The game should allow this, but NPC memory and diagnosis may recognise instrumental relationship use.

### Current ranking
**Favourite route.** It gives the entire market simulation thematic contrast and meaning.

---

## 15. Vale Auction — Capital / Liquidity / Information Route

### Why it works
This is the route most naturally aligned with the game's core trading systems.

It tests whether the player can become sufficiently liquid / informed / well-positioned to compete for a scarce asset.

### Current weakness
The prototype is too scripted:

- give Whale Oil;
- own Blue Marble;
- meet net-worth threshold;
- pay fixed reserve.

The Blue Marble is artificially protected from NPC movement solely to preserve the quest.

### Redesign
Turn the auction into a genuine market event.

Possible design:

1. Vale is assembling an auction but the exact lots are initially uncertain.
2. Information about the sunflower lot can be discovered early, late, truthfully or falsely.
3. Auction access may require reputation, deposit, invitation, identity, relationship or proof of funds.
4. Other NPCs may also want the sunflower or related lots.
5. The player can prepare liquidity, secure financing, buy information about competitors, arrange collateral, or intentionally misdirect rivals.
6. Bids should depend on actual rival valuations, budgets and strategies rather than a fixed minimum only.
7. Losing the sunflower auction need not end the route: a player might buy another lot, resell it, obtain the seller's identity, negotiate after the auction, finance another bidder, or exploit settlement failure.
8. A winner might default after bidding too aggressively, creating a distressed post-auction opportunity.

### Economic lessons
- liquidity vs net worth;
- auction strategy;
- winner's curse;
- financing;
- information advantage;
- bidding discipline;
- collateral;
- settlement risk;
- price discovery.

### Dirty variants
- collusion;
- misleading rivals;
- bribing an insider for bidder information;
- financing a rival in exchange for future rights;
- deliberately pushing another bidder above sustainable levels.

The route should teach that **winning an auction can itself be a bad trade**.

---

## 16. Cliff Race — Speculation / Optionality / High-Variance Route

### Why it works
The route introduces genuine uncertainty and a non-market conversion of economic assets into a chance at the goal.

### Current weakness
In the prototype it is mainly a checklist followed by a random coin flip:

- own Onewheel;
- own Mai Tai;
- have stake;
- roll success probability.

This does not yet justify the trading game's depth.

### Redesign
The race should become a **high-variance special situation** whose probability can be researched and influenced.

Possible inputs:

- quality / condition of the Onewheel;
- route knowledge;
- weather information;
- relationship with the Clown;
- whether the player inspected the vehicle;
- whether the player bought or built it;
- physical shortcut information;
- sabotage risk;
- insurance / side bets;
- stake size;
- whether other traders are betting on the outcome.

The player should never know the exact probability, but should be able to improve their estimate.

The race can generate a side betting market.

The player may choose to:

- race personally;
- back the Clown;
- finance another racer;
- sell the Onewheel instead;
- insure the stake;
- sell route information;
- manipulate odds through rumours.

### Economic lessons
- expected value;
- uncertainty;
- risk premium;
- position sizing;
- optionality;
- information value;
- insurance;
- speculation vs investment.

### Dirty variants
- sabotage;
- bribed route information;
- false rumours about weather / vehicle condition;
- betting while possessing private information.

### Route identity
This should be the route for players who enjoy **special situations and controlled gambling**, not merely “the random ending.”

---

## 17. Possible Fourth Category Without a Fourth Scripted Route

Do not necessarily add a fourth authored sunflower route.

Instead allow systemic solutions to emerge, for example:

- finance the auction winner and receive the sunflower as collateral after default;
- buy information identifying the sunflower's real owner and negotiate directly;
- become so important as a lender / market maker that another NPC offers the flower to secure your help;
- acquire a contract claim on the sunflower rather than the physical item;
- manipulate a distressed sale;
- steal / fraudulently obtain it and survive the consequences;
- obtain sunflower seeds without obtaining Vale's display flower.

If these arise from core rules, the game becomes a sandbox rather than a three-answer puzzle.

---

# PART V — OPEN QUESTIONS TO GRILL

## 18. NPC Identity Questions

These must be answered before implementing the new NPC engine.

1. **What does each existing NPC ultimately want beyond one `exactWant` item?**
   - Dock Dog
   - Fishmonger
   - Ship Mechanic
   - Mirelle Vale
   - Onewheel Clown
   - Bar Apprentice

2. Which NPC is the strongest trader at the start? Which is weakest?

3. Which NPC is best at:
   - valuation;
   - negotiation;
   - information gathering;
   - credit;
   - deception;
   - fraud detection;
   - relationship building;
   - risk management?

4. Which NPCs actively want to become richer, and which mainly trade instrumentally to achieve other goals?

5. Who naturally teaches the player something through behaviour?

6. Who improves fastest?

7. Who copies the player?

8. Who notices patterns but keeps information private?

9. Who gossips?

10. Who bears grudges?

11. Who values status / prestige more than money?

12. Who will knowingly do illegal trades?

13. Who can be bribed?

14. Who can become an ally even if the player is dishonest?

15. Which relationships between NPCs pre-exist the player's arrival?

---

## 19. NPC Learning Questions

1. Do NPCs learn within one run only, or should some market archetypes / behaviour vary between runs?

2. Can an NPC learn directly from public transaction history, or only if their sophistication is high?

3. Can NPCs buy reports from each other?

4. Can NPCs lie to each other without the player involved?

5. Can NPCs form alliances / collusion?

6. Can NPCs teach each other?

7. If an NPC discovers a player's profitable strategy, how quickly should competition arrive?

8. Should sophisticated NPCs intentionally conceal that they understand the player's strategy?

9. Can NPCs deliberately bait the player with apparent opportunities?

10. Can an NPC have a mistaken theory of the market and persist with it for several rounds?

---

## 20. Market Structure Questions

1. Is there one physical market with formal / informal venues, or several neighbourhoods / locations?

2. What transactions are publicly recorded?

3. Are posted offers binding?

4. Can players cancel offers freely?

5. Does cancelling or reneging damage reputation?

6. Who publishes reference prices?

7. What creates new goods / removes goods from the economy?

8. Is total sardine supply fixed, or can credit expand purchasing power?

9. Are sardines themselves subject to liquidity / scarcity issues?

10. What fees / taxes / tariffs exist, if any?

11. How does the Authority detect suspicious activity?

12. How does information physically spread: observation, gossip network, formal reports, public ledger?

13. Can counterparties transact simultaneously, creating race conditions for scarce goods?

14. How are conflicting simultaneous contracts resolved?

---

## 21. Player-Time Questions

1. What does one round represent diegetically?

2. How many meaningful actions fit in one round?

3. Does opening a negotiation consume an action even if no deal occurs?

4. Does inspecting an item consume time?

5. Does reading a public market report consume time?

6. Can the player queue actions before resolution?

7. When do NPCs act relative to the player?

8. Can the player interrupt or respond to incoming NPC offers before the round closes?

9. Does moving between locations consume time?

10. Can time itself be negotiated (e.g. delivery deadline extension)?

---

## 22. Scope Gate Before Coding

Before building the mature economy, freeze answers to three things:

1. **NPC objective / personality matrix** for the existing six major NPCs.
2. **Round / action economy** — what the player and NPCs can do before time advances.
3. **Market visibility / information propagation rules** — what becomes public, observed, private or rumoured.

Without these, coding credit, contracts, fraud or advanced routes will create inconsistent special cases.

---

## 23. Current Recommendation

Do **not** implement all advanced systems at once.

First build a vertical slice where:

- 3 NPCs have genuinely different stable trading styles;
- their decisions are utility-driven rather than random;
- they maintain beliefs and memory;
- they negotiate;
- one NPC can learn from repeated player behaviour;
- one simple contract can be created and defaulted;
- one piece of information can be bought / sold / become stale;
- one temporary arbitrage can be discovered and disappear through competition;
- the player can reach one sunflower opportunity through emergent behaviour.

If that feels coherent, the architecture can support the larger game.

If it does not, adding bribery, black markets, leverage, auctions and ten more NPCs will only hide the underlying problem.
