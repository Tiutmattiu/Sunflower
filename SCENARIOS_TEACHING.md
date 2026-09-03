# Sunflower — Scenario Teaching Layer

> Companion to `GAME_DESIGN.md`.
>
> Teaching rule: **experience first, terminology second**. A player should never need a trading background to understand a decision. The game presents an ordinary concrete problem in Sunflower language; after the player acts and consequences begin to unfold, the game names the real-world concept, explains why it mattered, and records the behaviour for diagnosis / badges.

## Teaching and assessment contract

1. **Play** — a situation and choice expressed in ordinary Sunflower language.
2. **World consequence** — NPCs, prices, credit, inventory, access and later opportunities respond systemically.
3. **Optional `?` concept discovery** — after the consequence, the player may open a timely explanation. It never blocks play or reveals the right answer in advance.
4. **Badge / case** — only when a distinctive realised story or market pattern completes. It is evidence, not automatic praise.
5. **Notebook** — durable memory of experienced situations, concepts and supporting evidence.
6. **Final diagnosis** — synthesis across the run, never the player's first exposure to the concept.

These scenarios are implementation and coverage targets, not disposable idea-bank material. Their exact fiction need not become rigid quests, but their meaningful behaviour must be mechanically representable, observable, diagnosable and capable of timely learning feedback.

The game must distinguish **successful outcome** from **sound process**. A reckless poorly informed trade can make a large profit: good outcome, poor process. A well-reasoned trade can lose money: poor outcome, sound process. Wealth alone cannot determine decision quality.

## Canonical coverage families

These are coverage families, not sixteen scripted quests. One scenario may cover several families.

1. Order / settlement / execution basics
2. Arbitrage & alpha decay
3. Forward delivery & sourcing risk
4. Negotiation / BATNA / anchoring
5. Liquidity vs solvency / financing
6. Relationship capital / credit / obligations
7. Private information / event interpretation
8. Information brokerage / exclusivity / learning
9. Quality / deception / due diligence / adverse selection
10. Market making / spread / inventory risk
11. Execution / market impact / order visibility / venue choice
12. Auctions / private vs common value / winner's curse
13. Confidence runs / reflexivity / fire-sale spiral
14. Leverage / crowding / position sizing / luck
15. Price vs value / reference points / disposition
16. Institutions / traceability / formal vs informal markets

Assessment rules:

- Outcome != Process.
- Style != Skill.
- No evidence != average.
- Insufficient evidence remains insufficient evidence.
- Confidence grows from repeated independent decisions in varied contexts, not button counts.
- Contradictory behaviour remains visible rather than being averaged away.
- Badges are realised stories, not points.

Treat **You Got the Flower and Wrecked Everything Else** as the capstone diagnosis situation. Do not build the final archetype taxonomy from these families.

---

## Scenario 1 — Selling Tomorrow’s Lime

### Game-language situation
Mechanic needs a Lime Crate next round and will pay well. You do not own one. Bar Apprentice has one but has not promised to sell it. Mechanic trusts you because you settled two earlier deals.

Possible actions:
- promise delivery and take a deposit;
- promise delivery without taking money now;
- first secure the Lime from Bar, then sell it;
- offer Mechanic a contract conditional on obtaining Lime;
- walk away.

### What the world should model
A promise of future delivery creates an **obligation** even if the player does not currently own the good. Counterparties price the risk that the player may fail to source it. Better credit history permits more aggressive promises and lower collateral requirements.

If Bar later refuses to sell, the player has **sourcing risk**. In a formal contract, failure can trigger agreed penalties / collateral / authority records. In an informal contract, consequences depend on relationship, reputation and bargaining power.

### Real-world concepts revealed after play
- forward / future-delivery contract;
- trade credit / advance payment;
- counterparty risk;
- sourcing risk;
- creditworthiness;
- collateral;
- default.

### Badge ideas
- **Sold It Before You Had It** — complete a profitable future-delivery contract without initially owning the good.
- **Promise Kept** — settle a difficult obligation on time.
- **Paper Merchant** — repeatedly trade obligations rather than inventory.
- **Empty Hands, Full Book** — maintain several outstanding delivery promises at once without defaulting.

---

## Scenario 2 — The Cod Route Everyone Notices

### Game-language situation
Fishmonger sells Salted Cod cheaply. Vale privately pays much more. You buy from one and resell to the other. It works twice. Other traders begin noticing your movements.

Possible actions:
- keep the route secret;
- sell the information;
- lie about what Vale is buying;
- lock up supply through contracts;
- buy aggressively before competitors learn;
- stop because the opportunity is already crowded.

### What the world should model
The opportunity must decay. Buying Cod reduces cheap supply; selling to Vale satisfies her need; observed profits attract competitors. Competition raises the buy price and/or lowers the resale price until the spread closes.

Selling the information converts an informational advantage into immediate cash but accelerates competition. False information can redirect competitors temporarily, but if the lie is attributable the player loses integrity and may face retaliation.

### Real-world concepts
- arbitrage;
- spread;
- market efficiency;
- information diffusion;
- market impact;
- alpha decay;
- crowded trade;
- predatory / anticipatory trading.

### Badge ideas
- **First Through the Gap** — exploit a temporary price discrepancy before anyone else.
- **Closed the Spread** — make enough trades that your own activity destroys the arbitrage.
- **Sold the Map** — sell a profitable route to another trader.
- **False Trail** — profit by deliberately misdirecting a competitor, with later detection risk.

---

## Scenario 3 — The Bad Tangerine Pitch

### Game-language situation
Mechanic wants lime. You possess a bad tangerine. You never literally say “this is a lime”; you say something technically vague that you know Mechanic will probably misunderstand.

Possible actions:
- explicitly tell the truth;
- exaggerate quality;
- use careful ambiguity;
- directly lie;
- allow inspection;
- refuse inspection;
- compensate later if discovered;
- deny responsibility.

### What the world should model
Deception is not a single binary flag. The system should record what the player claimed, what they knew, what the counterparty reasonably inferred, how verifiable the claim was, whether inspection was permitted, and what happened after discovery.

The best confidence players should be able to maintain credibility by mixing truth with ambiguity, choosing hard-to-verify claims, preserving clean relationships, and strategically compensating victims.

### Real-world concepts
- misrepresentation;
- omission / strategic ambiguity;
- adverse selection;
- due diligence;
- warranties / inspection rights;
- reputation capital;
- lemons problem.

### Badge ideas
- **Snake Oil** — knowingly sell a materially misleading product claim.
- **Technically True** — complete a deceptive sale without making a literally false statement.
- **Read the Fine Print** — avoid being deceived by inspecting or contractually defining quality.
- **Confidence Artist** — sustain repeated deception without losing market access.

---

## Scenario 4 — Rich on Paper, Broke Today

### Game-language situation
You have only 1 sardine in cash, but you own a valuable Blue Marble and somebody formally owes you 8 sardines in two rounds. A deal available right now costs 6.

Possible actions:
- borrow cheaply from a formal lender;
- borrow expensively and privately;
- pledge the Marble as security;
- sell the receivable for less than its face value;
- sell the Marble quickly at a discount;
- abandon the opportunity and preserve liquidity.

### What the world should model
A player can be economically healthy but unable to pay today. Assets differ in liquidity. Receivables and goods may be collateral or may need to be sold at a discount. In stressful conditions, lenders may demand more collateral precisely when the player can least afford it.

### Real-world concepts
- liquidity vs solvency;
- collateral;
- secured lending;
- haircut;
- receivables financing / factoring;
- fire sale;
- leverage;
- liquidity premium.

### Badge ideas
- **Rich, Broke** — own positive net assets while unable to meet an immediate cash need.
- **Pawn the Marble** — finance a trade with collateral.
- **Fire Sale** — sell a valuable asset materially below normal value because you need cash now.
- **Liquidity Surgeon** — solve a cash shortage without destroying long-term value.

---

## Scenario 5 — Dirty Sardines, Clean Contract

### Game-language situation
Authority distrusts you after black-market activity. You have money, but counterparties question where it came from. A respected trader offers a formal deal that could make your money look connected to legitimate business.

### What the world should model
The game should not treat one transaction as a magic “clean money” button. Authority risk should depend on transaction history, counterparties, traceability, suspicious patterns, unexplained wealth and individual inspectors. Using respected intermediaries can reduce suspicion, but layering transactions can itself become suspicious.

### Real-world concepts
- money laundering;
- layering / integration;
- know-your-customer style scrutiny;
- source-of-funds risk;
- regulatory arbitrage;
- reputation laundering.

### Badge ideas
- **Washed in Daylight** — route suspicious proceeds through apparently legitimate transactions.
- **Too Clean** — trigger scrutiny by making an implausibly neat laundering pattern.
- **Respectable Company** — improve access by associating with high-reputation counterparties.

---

## Scenario 6 — Bell Knows Tomorrow’s Ban

### Game-language situation
Inspector Bell privately tells you that Whale Oil will be restricted next round. Nobody else knows yet. You can trade on it, sell the information, verify it, or ignore it.

Possible actions:
- buy oil because you expect scarcity;
- sell oil because you expect holders to panic;
- buy related substitutes instead;
- sell the information;
- leak it publicly;
- trade very subtly;
- do nothing because the source may be unreliable.

### What the world should model
Private information is not automatically useful: the player still has to interpret how other traders will react. Regulation may change supply, demand, forced selling, substitutes and black-market prices differently. Trading too aggressively can reveal that the player knew something.

Legality should depend on Sunflower’s institutional rules rather than copying one jurisdiction mechanically, but the game can teach the general idea of **material non-public information** and misuse of privileged information.

### Real-world concepts
- insider information;
- material non-public information;
- event-driven trading;
- regulatory shock;
- second-order effects;
- information leakage;
- suspicious trading patterns.

### Badge ideas
- **Heard It Before the Bell** — profit from genuinely private regulatory information.
- **Wrong Sign** — correctly obtain private news but trade the wrong direction.
- **Quiet Hands** — exploit private information without creating an obvious footprint.
- **Megaphone** — deliberately release private information to change the market.

---

## Scenario 7 — Your Best Customer Becomes Your Rival

### Game-language situation
You sell useful reports to Fishmonger. He learns from them. Eventually he stops buying and begins selling competing reports for less.

Possible actions:
- keep selling and accept competition;
- charge more while the information is unique;
- sell delayed reports;
- sign exclusivity;
- give different clients different information;
- stop educating a dangerous future competitor;
- collaborate and split the market.

### What the world should model
Knowledge transfer changes capabilities. Information buyers learn. A customer can become a competitor. Exclusivity has value only when it can actually be enforced. Informal markets may rely on reputation rather than legal enforcement.

### Real-world concepts
- information economics;
- commoditisation of research;
- exclusivity;
- non-compete / confidentiality arrangements;
- intellectual capital;
- first-mover advantage;
- competition and barriers to entry.

### Badge ideas
- **Taught Your Rival** — create a competitor by repeatedly selling them useful information.
- **Research House** — earn meaningful income from information rather than goods.
- **Exclusive** — profit from selling limited-access information.

---

## Scenario 8 — Pay the Debt or Take the Deal

### Game-language situation
You promised Bar 8 sardines today. You have exactly 8. A nearly irresistible opportunity also costs 8 now and may return much more later. Bar refuses to wait.

Possible actions:
- repay as promised;
- default and take the opportunity;
- renegotiate;
- find bridge financing;
- sell another asset;
- split the difference if possible;
- walk away from the new opportunity.

### What the world should model
A profitable future does not erase a missed promise today. A rational economic decision for the player may still be a harmful counterparty decision. Diagnosis must be multidimensional: capital allocation may be excellent while reliability is poor.

Default should change future credit terms even if the player later becomes rich. Some counterparties may forgive profitable opportunism; others care strongly about punctual settlement.

### Real-world concepts
- opportunity cost;
- default;
- maturity mismatch;
- refinancing / bridge financing;
- covenant discipline;
- time value of liquidity;
- strategic default.

### Badge ideas
- **Broke the Promise, Made the Trade** — deliberately default to fund a higher-return opportunity.
- **Sacred Word** — honour a costly obligation despite a tempting alternative.
- **Bridge Builder** — finance both obligations without default.

---

## Scenario 9 — Everyone Thinks You’re Broke

### Game-language situation
A false rumour says you cannot pay your debts. Traders demand cash, lenders ask for more collateral, and credit disappears. You were healthy before the rumour; the reaction itself may ruin you.

Possible actions:
- publish proof of assets;
- repay some debts early;
- ask a trusted trader to vouch for you;
- obtain emergency liquidity;
- sell assets;
- attack the rumour source;
- spread counter-rumours;
- hide weakness and bluff confidence.

### What the world should model
Beliefs about liquidity must be separate from actual liquidity. Counterparties react to what they think is true. If enough of them withdraw credit simultaneously, a solvent player can be forced into fire sales and become genuinely distressed.

### Real-world concepts
- run / funding run;
- self-fulfilling liquidity crisis;
- confidence shock;
- collateral call;
- fire-sale spiral;
- contagion;
- lender of last resort / emergency liquidity.

### Badge ideas
- **Run on You** — trigger a self-reinforcing withdrawal of credit.
- **Still Solvent** — survive a confidence crisis without default.
- **Last Lender** — rescue another trader from a run and gain influence.
- **Rumour Became Reality** — begin solvent and end distressed because others believed you were distressed.

---

## Scenario 10 — You Got the Flower and Wrecked Everything Else

### Game-language situation
You acquire the sunflower through high-cost borrowing, deception, bribery, defaults and aggressive event bets. The target is achieved, but your finances and relationships are wrecked.

### What the world should model
Winning the stated objective must be separate from trading quality. Final diagnosis should use multiple dimensions and distinguish tactical brilliance from sustainability.

Possible dimensions:
- objective execution;
- valuation discipline;
- liquidity management;
- credit discipline;
- information edge;
- negotiation efficiency;
- risk appetite;
- position sizing;
- adaptability;
- relationship capital;
- integrity / deception skill;
- regulatory exposure;
- sustainability.

### Badge ideas
- **Whatever It Takes** — acquire the sunflower while ending near economic ruin.
- **Pyrrhic Bloom** — succeed at the objective while destroying most starting economic value.
- **Black-and-Gold Route** — combine formal and illicit channels in a single winning run.

---

# Additional Scenario Families Inspired by Trading / Business Literature

These should be introduced as concrete Sunflower events first. The book / real-world concept belongs in an optional post-event “Why this mattered” layer, not in the decision prompt.

## A. The First Number Wins — Negotiation Anchor
A trader opens with an absurdly high number. Even if the player rejects it, later counteroffers remain suspiciously close to that first number.

Concepts: **anchoring**, reservation price, BATNA, concession discipline.

Possible badge: **Unanchored** — walk away or reset a negotiation after a manipulative opening number.

Design inspiration: *Getting to Yes* and negotiation research on BATNA / bargaining; anchoring research can supply the behavioural layer.

## B. The Deal You Should Walk Away From — BATNA
A counterparty pressures the player with “take it now or lose it.” The player actually has a quieter alternative elsewhere that is slightly less profitable but much safer.

Concepts: BATNA, walk-away price, urgency manipulation, option value.

Badge: **Had Somewhere Else to Go**.

## C. Everyone Is Winning — Until They Aren’t
A leveraged strategy works repeatedly. NPCs copy it. Lenders lower collateral requirements because it appears safe. One shock causes everyone to need cash simultaneously.

Concepts: leverage, crowded trade, margin / collateral spiral, model risk, liquidity feedback.

Badge: **Genius Until Round 9** or **Deleveraged Before the Crowd**.

Design inspiration: *When Genius Failed* and real liquidity spirals.

## D. Lucky Idiot
The player makes a reckless, poorly informed bet and earns a huge profit. The game explicitly records the outcome as profitable but the process as weak. Repeating the behaviour may eventually destroy the player.

Concepts: luck vs skill, outcome bias, survivorship bias, variance.

Badge: **Fooled by Sardines**.

Design inspiration: *Fooled by Randomness*.

## E. Price Is Not Value
A fashionable item trades far above its reference / utility value because everybody expects somebody else to pay more. The player can join, avoid, short via a future-delivery obligation if allowed, or provide liquidity.

Concepts: price/value distinction, second-level thinking, contrarianism, bubble dynamics.

Badge: **Paid for the Story**, **Second-Level Thinker**, or **Last Buyer**.

Design inspiration: Howard Marks’ *The Most Important Thing*.

## F. The Tip From a Genius
A famous successful NPC gives the player a confident tip. The player can follow blindly, verify independently, take a smaller position, or ignore it. The expert may be wrong for reasons unrelated to competence.

Concepts: authority bias, independent judgment, position sizing, uncertainty.

Badge: **Borrowed Conviction** or **Checked the Tape**.

Design inspiration: *Reminiscences of a Stock Operator* and *Market Wizards*.

## G. The Rule Changes Mid-Trade
The player has a profitable position under current rules. Authority unexpectedly changes eligibility, tariff, settlement or market access. The trade may become unprofitable or impossible.

Concepts: regulatory risk, rule-change risk, political / institutional risk, basis risk.

Badge: **The Rulebook Moved**.

Design inspiration: historical episodes described in *Reminiscences of a Stock Operator* and general market-structure literature.

## H. Make the Market Look Busy
A sophisticated trader creates misleading apparent interest to attract other traders, then unloads inventory into the induced demand.

The implementation must stay stylised and game-mechanical rather than teaching real-world evasion tactics.

Concepts: bluffing, manipulation, false signalling, distribution, market impact.

Badge: **Painted the Harbour** / **Saw Through the Crowd**.

Design inspiration: market-manipulation sections of *Trading and Exchanges* and *Reminiscences of a Stock Operator*.

## I. The Lemon Market
Nobody trusts the quality of used / opaque goods. Honest sellers leave because buyers refuse to pay enough; average quality deteriorates further. A trusted inspection / certification service can restore trade.

Concepts: adverse selection, information asymmetry, certification, warranties.

Badge: **Made a Market in Lemons**.

## J. The Lender Who Saves You Owns You
An emergency lender provides liquidity when nobody else will, at expensive terms or with powerful collateral / influence rights.

Concepts: lender of last resort, distressed financing, bargaining power under stress, liquidity premium.

Badge: **Last Sardine Standing**.

---

## Badge Philosophy

Badges should primarily recognise **behavioural patterns and notable market events**, not moralise.

A badge is not necessarily praise. Examples:

- `Snake Oil` — notable deception event.
- `Fire Sale` — forced-liquidity event.
- `Run on You` — confidence crisis.
- `Fooled by Sardines` — lucky bad process.
- `Closed the Spread` — arbitrage changed the market.
- `Sacred Word` — honoured costly obligation.

Badges can feed the final diagnosis but must not determine it mechanically. A player may hold contradictory badges: `Sacred Word` and `Strategic Default`, or `Snake Oil` and `Trusted Counterparty`, reflecting different relationships and moments.

## Diagnosis Ontology

Structured evidence should preserve three separate layers before any final scoring model is chosen:

1. **Outcome — what happened?** Sunflower objective, realised value, liquidity / solvency, defaults, retained relationships and access.
2. **Process / skill — how was the decision made?** Valuation, information calibration, verification, execution, liquidity, credit, position sizing, negotiation, adaptability, market impact and sustainability.
3. **Style — what kind of participant did repeated behaviour create?** Aggressive / patient, concentrated / diversified, inventory / information focused, public-market / relationship or OTC, liquidity taker / provider, transparent / secretive, trusting / verification-heavy, straightforward / strategically ambiguous.

Style is not a moral or skill score. High risk appetite is a style; staking nearly all capital on an unverified rumour can additionally be poor position sizing and poor information process.

This permits outcomes such as:

- won + rich + reckless;
- won + poor + brilliant execution;
- lost + excellent trader;
- profited + poor reasoning / lucky;
- deceived often + unusually strong credibility management;
- honest + commercially ineffective;
- high information edge + weak execution.

The educational layer should explain these distinctions without implying that one archetype is the universally “correct” way to trade.
