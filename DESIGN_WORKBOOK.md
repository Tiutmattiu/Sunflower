# Sunflower — Design Workbook v1

> **Purpose:** one working design file for future mechanics, quantitative balance, assessment, ending reachability and UI architecture.
>
> This file is **not** the world-canon source. `WORLD_CANON.md`, `REBIRTH_FORM_SYSTEM.md`, `SCENARIOS_TEACHING.md`, `NPC_CHARACTER_BIBLE.md`, `GAME_DESIGN.md`, `DAY_LOOP_MARKET_STRUCTURE.md`, `INFORMATION_DISCOVERY_MODEL.md` and `ITEM_ECONOMY.md` remain the domain source files.
>
> This workbook replaces the old working/audit files `NARRATIVE_KARMA_MATRIX.md`, `PLAYER_ASSESSMENT_AUDIT.md` and `NPC_ENGINE_ROUTE_AUDIT.md`.
>
> Dialogue remains separate because it is content, not systems design: `DIALOGUE_MONTAGE_BANK.md` + its temporary state audit until the next narrative consolidation.
>
> **Status discipline:** FROZEN / CURRENT CANON is stable direction; STRONG CANDIDATE is supported but not a final mechanic; OPEN is unresolved; DEFERRED is outside the current implementation target; HISTORY / RETIRED is not current authority. IMPLEMENTED requires explicit runtime evidence, not design prose.
>
> All numerical mechanics, diagnostic thresholds and paper results in this workbook are **PROVISIONAL design assumptions/evidence**, not frozen balancing constants or current-engine results. §32.15 holds the new chat-side toy models. Chapters 31–32 do not replace the incumbent clock or estate baseline.
>
> Runtime ownership remains separate. This reconciliation authorises documentation only; older work-board/batch language is not a new implementation instruction. Existing implementation claims need their own dated verification.

---

# 0. Project North Star

Sunflower is a single-player trading sandbox about making one impossible acquisition inside a small living market where:

- Goods
- Cash
- Information
- Obligations
- Relationships
- Time
- Body / Form
- Access
- Attention

all have economic value.

The same structure operates from the first action onward. Later lives/forms change the player's position inside that structure; they do not unlock a different genre.

The economic simulation must be strong enough that the narrative and metaphysical reading emerge from actual state changes rather than explanatory cutscenes.

---

# 1. Production Roadmap

This is sequencing, not runtime completion evidence. `CODEX_VERIFICATION.md` owns the dated prototype snapshot; the separate implementation lane owns subsequent results.

| Phase | Scope / gate |
|---|---|
| Playable Harbour | bounded knowledge, coherent clearing, finance/evidence/Notebook and understandable first play |
| Living Samsara Core | canonical cast, distinct Octopus ledgers, Dima, recurring economy, Juan assets/claims, incumbent forms/estates and diagnostic coverage; historical separate-lane scope |
| Market Depth | candidate Auction v2, real BATNA, inspection, market making, confidence and venue cases; Chapter 5 |
| Assessment / replay | evidence, opportunity density, route/capstone reachability and explicit time/rebirth decisions before scoring freeze |
| Narrative embodiment | state-aware montage, shared scenes, object/relationship recurrence and cross-life recognition |
| Scene UI / art | `ART_DIRECTION.md`; stable state binding before polish |
| Playtest / balance | novice, finance-literate, exploit-seeking, narrative-first and repeated-run/ending-coverage policies |

---

# 2. Actor Niches and Balance Regimes

Balance does **not** mean equal wealth. These actor niches are distinct from the **FROZEN six return classes** owned by `GAME_DESIGN.md` §2: Trade, Operate, Invest, Finance, Intermediate, Speculate. No player profession choice or skill tree is implied.

Each style should be locally strong in some world states and weak in others.

| Actor | Core style | Strong when | Weak when |
|---|---|---|---|
| Aspen | low-variance contracts / execution | deadlines, repeat counterparties, known cashflow | ambiguity, tail risk, open-ended speculation |
| Joel | relationship + experiential optionality | soft info, social access, fast learning, bridge liquidity | weak boundaries, bad stories, early credit discipline |
| Yasmin | private capital allocation / provenance | collateral, recovery, auction, real productive financing | tiny-margin operations, undocumented mess, unpriced motive |
| Wong | household enterprise / capital accumulation | fragmented demand, salvage, small services, working-capital velocity | household burn, fixed-asset threshold, long lockups, one large loss |
| Juan | duration / biological assets / distressed finance | maturity mismatch, discounted claims, future productive value | immediate liquidity, horizon mismatch, self-experimentation |
| Dima | intermediation / informal enforcement | formal exclusion, fragmented trust, claim transfer | direct trust, disintermediation, successful formalisation |
| Octopus | public clearing / payment / price discovery | low-friction standard settlement | institution, not primary archetype; personal stock and background supply accounted separately |

Provisional falsification targets (not equal-profit requirements):

- every primary style has at least **2 environment regimes** where it is top-2;
- every primary style has at least **2 regimes** where it is bottom-2;
- no one simple style is top-2 in more than ~60% of tested regimes;
- high transaction count alone does not equal dominance;
- dominance requires several dimensions: cash, wealth, sales value, access, information, claims or dependency.

Environment hypotheses to test (not guaranteed rankings):

| Regime | Expected locally strong | Expected pressured |
|---|---|---|
| high liquidity, low information | Wong / Aspen | Dima / info-heavy |
| low liquidity, high collateral | Yasmin / Joel | pure cash dealer |
| high information asymmetry | Dima / Yasmin | naive public dealer |
| urgent perishables | Aspen / Wong / marine suppliers | Juan duration |
| long-duration productive assets | Juan / Yasmin | impatient turnover |
| formal exclusion | Dima / Joel | formal-only |
| confidence shock | Juan specialists / Yasmin / Dima | face-value naive holder |
| crowded public spread | private/info routes | simple arbitrage |
| relationship-rich, cash-poor | Joel / Wong | collateral-only |
| import/outside-demand cycle | Aspen / external suppliers | actors without external route |


---

# 3. Opportunity Ecology

Generate **pressure first**, then multiple feasible responses. Meaningful alternatives differ in timing, collateral, relationship, information loss, legal access, future obligation, certainty or visibility. `SCENARIOS_TEACHING.md` owns authored case details.

| Pressure | Candidate channels to compare when actually available |
|---|---|
| Liquidity squeeze | public/inbound/private sale, wait for clearing, information sale/exclusive, Joel credit, Yasmin secured advance, Juan claim sale/collection, Dima workout, Aspen advance, abstain |
| Information edge | personal use, sale/exclusive, favour, verification, wait, disclose/breach, ignore |
| Distressed receivable | buy/sell/hold, debtor buyback, extend/collect, permitted early liquidation, abstain |
| Scarce asset | buy/bid, collateral/relationship finance, sell another asset, investigate, wait/abstain |
| Sourcing promise | source first, contract first, backup supplier, public/relationship source, certainty premium, default/decline |
| Venue / negotiation | Octopus, direct deal, Joel/Dima, wait for access; accept/counter/real BATNA/walk |
| Quantity/quality uncertainty | skip/spot/full/paid inspection, disclose/qualify/omit/misrepresent, warranty if agreed, walk |
| Two-sided inventory pressure | maintain/widen/tighten/withdraw quote, hold or liquidate, change good |
| Confidence shock | verify/share, hold/sell/extend/collect/buy or permitted liquidation |
| Relationship allocation | sale, gift, information favour, earned credit, retain resource |
| Sun Moment | natural pause versus a real contextual continuation; exact mechanic Open, never spiritually scored |
| Form-change recovery | under the tested model: recognition/proxy, relationship support, current-form work/assets/information, wait or later transition |

---

# 4. Opportunity-Density Targets

For a mature 14-day prototype life, diagnose rather than hard-force:

- <=2 ordinary days with zero meaningful routes;
- >=8 days with >=2 routes;
- >=4 days with >=3 routes;
- no more than 2 consecutive ordinary dead-choice days;
- at least 2 real liquidity squeezes;
- at least 3 independent information-use cases over a sufficient multi-life sample;
- at least 3 obligation/claim cases;
- at least 2 venue-choice cases;
- at least 2 relationship-created routes that cash alone does not reproduce exactly.

Rich opportunity state:

> >=3 materially distinct channels are actually visible and executable.

Warn when one channel is chosen in >60% of rich states across capable policies.

---

# 5. Market Depth — Candidate Mechanics and Open Terms

**Status: STRONG CANDIDATE / OPEN**, not an implementation contract. The earlier duplicated exact specifications in Chapter 20 have been consolidated here. Historical numerical presets remain in Git history rather than masquerading as current constants.

## 5.1 Yasmin Auction v2 — OPEN

The Sunflower route's strong candidate lot is a valuable antique vessel/pot with an incidental Sunflower: rivals may want the vessel while the player wants the flower. Yasmin can organise consignment, verify provenance, match buyers and charge commission without owning the seller's asset. This sits inside her private capital role, not public exchange operations.

A separate common-value teaching lot can expose noisy estimates, provenance and winner's curse. **History:** Bent Silver Fork / Shipwreck Lot, sealed-first-price format, priors, price states and bidder formulas were exploratory presets, not frozen Auction v2 internals. No replacement format, reserve, signal distribution, access chain or NPC bid policy is selected here.

Preserve commitment-time evidence, private versus common/resale value, uncertain rival information and liquidity constraints. A sound bid can lose; a poor bid can profit. Other bids never define the player's value for the flower.

## 5.2 Negotiation / BATNA — STRONG CANDIDATE

**BATNA = Best Alternative To a Negotiated Agreement:** the best feasible fallback if agreement fails. A short accept/counter/invoke alternative/walk sequence is a candidate presentation; exact rounds and action costs remain Open.

Compare actual quantity, condition, timing, risk, access and enforceability. Aspen can use a wholesaler, partial Juan supply, a delayed voyage/penalty or a disclosed substitute. Wong can hold, clear elsewhere or take another small job; Dima/Joel and Yasmin's alternatives depend on real availability and terms.

**Retired:** fixed “one alternative = +1 can, two = +2” adjustments and fixed counter-percentage limits as current contract. An outside option is not a negotiation skill bonus. The number of alternatives alone does not establish their value.

## 5.3 Short Shipment / Contract Misrepresentation — STRONG CANDIDATE

**History/Retired:** Bad Tangerine pretending to be Lime, its `item_is_lime` warranty and fixed restitution preset. Preserve adverse selection, representation, fraud, inspection and trust through shipment specification instead.

An illustrative crate promises 12 acceptable Limes; the visible top looks normal, but there may be filler/paper/stone beneath or only 8 fruit. Sizes, probabilities, inspection costs and remedies remain Open. Options include skip, spot-check, full count, supplier reputation or paid verification.

Record what the seller knew and claimed, the agreed quantity/quality, what the buyer could observe, offered/refused verification, later discovery and compensation/denial. Do not infer `cheater=true` or apply omniscient reputation penalties. `SCENARIOS_TEACHING.md` Scenario 3 owns the case.

Aspen has public classifieds, Octopus, suppliers and direct sourcing. The player's advantage can be stock, early information, relationships, verification or delivery risk; public disclosure can bring competing sellers.

## 5.4 Wong Market Making — CANDIDATE

A small two-sided quote on an existing bridge good requires real cash, inventory and counterparties. BID < ASK does not guarantee a completed round trip. Reserve resources, preserve physical copies and prevent same-clearing recycling.

An illustrative Empty Bottle bid 1 / ask 1.5 can earn only if both sides arrive. Measure realised spread separately from inventory mark and later disposal losses. One-sided flow can force quote widening, withdrawal or a loss. Exact goods, observation prerequisites, quote counts, tick sizes and reserves remain Open.

**Retired as current constraint:** hard `reference ± 2` quote bands or known floors/caps that let players extract free money. Wong's productive shop is a separate Strong Candidate, not merely a quote unlock or inventory-capacity bonus; see his bible and §32.15.

## 5.5 Juan Confidence Run — CANDIDATE backlog

A true but non-conclusive operational signal, such as greenhouse heat failure delaying maturity, can expose a mismatch between current cash and claims. Eligibility should require real creditors, claims and immature productive backing, not a fixed day or panic meter. Exact trigger counts, delay and haircut remain Open.

Creditor collection reduces liquidity; forced sale can destroy productive value; lower expected recovery can prompt more collection/selling. Hold, extend, sell, buy or liquidate only when legally available. Preserve belief versus solvency and observe both a reflexive run and a scare that resolves without insolvency.

The simpler Juan financing comparison in §32.15 supports distinct early-sale, Dima output-sharing, Yasmin fixed-loan and distress paths; no single financing path should strictly dominate.

## 5.6 Formal vs Informal Venue — current distinction, candidate terms

Octopus supplies public orders, execution, payment, price discovery and settlement records. Dima charges for private access, trust, guarantees, claim transfer or enforcement; Joel may offer a relationship-mediated proxy. Compare only actually available routes.

Cheap public clearing should preserve low-surplus trade. Privacy, delay, access and enforceability can justify a costlier intermediary. Fees and final cadence are not frozen. Dima's distress assistance must be a costly workout with a payer, loss allocation and possible refusal/default, never a free bailout.

---

# 6. Assessment Mathematics — PROVISIONAL

Current distinction: **Outcome** describes what happened (accessible/estate wealth separately, P&L, defaults, claims, relationships, forms, routes/cases); **Process/Skill** describes decision quality supported by commitment-time evidence; **Style** describes repeated, opportunity-conditioned preferences. No evidence != average. No final scoring/radar is frozen.

## 6.1 Independent Decision Case

A case requires materially different alternatives, a factual information set, resources/constraints, commitment/decline and optional later outcome. Repeated clicks in one event are not independent. A candidate context key is `lifeId + domain + eventType + counterparty + underlyingOpportunityId`; Chapter 24 owns stored fields.

## 6.2 Opportunity Richness

Provisional R: 0 forced; .35 one plausible alternative; .60 two distinct routes; .80 three-plus; 1 several materially different trade-offs.

## 6.3 Evidence Weight

Experimental `w = R × S × I × D`: richness × stake relevance × information adequacy × independence/diversity. Candidate bounds S [.5,1.25], I [.5,1], D [.4,1]. Cap stakes so a jackpot cannot dominate diagnosis.

## 6.4 Process Dimensions

Candidate dimensions: execution, liquidity, valuation, information, obligation/credit, sourcing/operations, position sizing, negotiation/alternatives, institutions, relationship stewardship and adaptability.

A case may support +1/0/−1 only where evidence justifies it. Candidate aggregation: `direction_j = sum(w_i*sign_i)/sum(w_i)`. No zero for missing evidence; preserve conflicts such as reliable delivery but willingness to restructure debt instead of averaging them into “Reliability 50.”

## 6.5 Confidence

`SCENARIOS_TEACHING.md` owns provisional categorical confidence thresholds. An optional hidden experiment is `C = 1-exp(-n_eff/3)`; do not display pseudo-scientific percentages.

## 6.6 Style — OPEN

Outcome != Style: either high- or low-risk play may succeed/fail or obtain/miss Sunflower. Valuation, liquidity, information discipline, relationship investment, risk appetite, credit discipline, integrity and adaptability remain candidate axes, not a player-facing radar.

Possible contrasts include horizon, liquid/locked capital, goods/information/claims, public/private, formal/informal, concentration/diversification, verification/uncertainty, transactional/relationship, exploit/explore and hold/realise. Only count contexts offering both sides. Sun Moment choices may be observed but never scored spiritually. Do not infer love, greed, moral worth, cowardice, kindness or enlightenment.

---

# 7. Assessment Cross-Context Requirements

`SCENARIOS_TEACHING.md` §3 owns the character coverage map. No stable process judgement should come from one NPC or a single repeated event. Compare execution across Aspen/Octopus/Juan; liquidity across credit/collateral/claims/sales; information across leads, inspection, exclusivity and event interpretation; relationships across genuine access/credit differences. Apply the same cross-context rule to valuation, sourcing, risk, negotiation, institutions and adaptation. Report low confidence where coverage is narrow; do not infer neutrality from no evidence.

---

# 8. Realised Cases / Market Scars

`SCENARIOS_TEACHING.md` owns case definitions and badge status. A realised case needs a causal sequence and evidence IDs, not a button count, moral praise, spiritual progress or completion percentage. A case may coexist with poor process.

That document records **SOLD IT BEFORE YOU HAD IT** and **EXCLUSIVE** as implemented; `CODEX_VERIFICATION.md` describes a narrower earlier verification scope without final badge scoring. This documentation pass does not settle runtime coverage or invent a new implementation result.

Additional working-title ideas, not awards to implement now:

| Candidate | Required distinctive causal evidence |
|---|---|
| Bought Somebody Else's Problem | discounted Juan claim acquired, then transferred/collected/bought back or impaired |
| Let It Grow | extension permits maturity; compare recovery with a genuinely available early-sale option |
| Too Good to Be True | optimistic common-value bid wins but later recovery disappoints |
| Market in the Middle / Bagholder | genuine two-sided spread versus one-sided inventory loss |
| Walked Away / Paid Over Ask | a real alternative or later private utility supports interpretation of the price decision |

The former “First Through the Gap = Noon resistance” definition conflicted with the temporary-arbitrage case title. Retire that duplicate definition; any resistance case name/mechanic remains Open with the final Sun Moment. Avoid fixing a badge-count target before time/assessment design is settled.

---

# 9. Ending / Capstone Reachability

Sunflower should support discovering different capstone outcomes across repeated lives.

It must **not** require one run to unlock all endings or all teaching domains.

No ending should become permanently inaccessible because the player missed one arbitrary day unless the ending itself is explicitly about irreversible loss.

## 9.1 Current known capstone states

### Sunflower acquired → Go Home
This is a major objective transition, not necessarily a final ending.

At least three acquisition routes remain conceptually distinct:

- Sonya / non-market allocation;
- Yasmin / capital-private market;
- Juan / risk-boundary route.

Missed trade != missed route.

### Juan plants the player
Possible ending/capstone.

Requires future seed-like biological evidence and Juan's botanical relation.

Do not certify this as liberation.

### Total Commodification
Possible ending/capstone.

The player's increasingly successful exchange grammar renders:

goods → claims  
information → rights  
relationships → access/exposure  
people → bundles of claims/obligations/yields

The UI itself becomes cleaner and more asset-like.

Do not label it morally good/bad.

### Karmic relation release
A primary figure may cease recurring for this player only when the relation no longer reproduces the same causal structure.

This is not a checklist ending and need not mean the person ceases to exist.

Exact full ending set remains open until late narrative freeze.

---

## 9.2 Reachability Constitution

1. Critical opportunities recur or have functional analogues.
2. One missed auction/contract does not permanently destroy a whole route.
3. Rare capstones may require multi-life state, but their necessary economic opportunities must recur.
4. A completed ending can end a life/run without deleting the possibility of pursuing another ending in a later cycle.
5. Memory/evidence persistence and estate versus reset behaviour remain Open under Chapter 31; trajectories must state which model they test.
6. Endings are factual predicates over world state, not hidden morality-point thresholds.
7. No ending requires collecting all 16 teaching domains.
8. No teaching domain is required merely because it exists.

---

## 9.3 Prototype Reachability Harness

Future developer harness should define a small list of target predicates:

- route/capstone reached?
- required mechanic actually used?
- legal player-visible path?
- no direct hidden-truth cheat?

For each target, maintain one or more deterministic **legal policy trajectories**.

Do not directly set the final ending flag.

Setup injection is acceptable only for expensive preconditions in isolated mechanic smoke tests; full reachability tests should traverse the real engine.

Across many deterministic trajectories, collect the set:

`coverage(trajectory) = {domains, cases, routes, capstones}`

Then solve a small **set-cover** problem for the developer suite:

> choose the smallest useful set of trajectories whose union reaches every currently implemented required target.

Greedy set cover is sufficient:

1. start with uncovered targets;
2. choose trajectory covering most uncovered targets;
3. repeat until all reachable targets are covered;
4. report impossible/unreached targets explicitly.

This is a test-suite optimisation tool, not a player-facing system.

---

# 10. Prototype Teaching Coverage

The 16 items in `SCENARIOS_TEACHING.md` are **trading/teaching domains**, not factions, families, quests or cosmology.

The prototype should eventually allow the developer coverage suite to realise every implemented domain at least once across multiple trajectories.

Coverage levels:

- mechanic;
- player-visible situation;
- decision evidence;
- Notebook concept;
- realised case/badge where appropriate.

A domain can be `partial` without fake green coverage.

The player is not expected to complete all domains in one life.

The game should never display `13/16 concepts`.

---

# 11. Coverage Balance Algorithm

For each policy × horizon × form, record:

- domains encountered;
- domains used;
- cases realised;
- capstone progress;
- rich-opportunity states;
- channels available;
- channels selected.

Define per-domain accessibility:

`access_rate = trajectories where domain was legitimately reachable / capable trajectories`

Define realised-use rate:

`use_rate = trajectories using domain / trajectories where reachable`

Red flags:

- required domain access_rate < .25 across capable prototype policies;
- domain available only to one brittle scripted path;
- one domain use_rate > .85 whenever available because its alternative routes are mathematically dominated;
- important diagnosis dimension receives evidence only from one NPC/context.

Do not force equal rates. Some domains are naturally rarer.

---

# 12. Economic Balance / Dominance Algorithm

Economic Health must compare more than final cash.

Per actor/policy:

- current-body liquidity;
- legally accessible wealth;
- estate wealth separately;
- public/private volume;
- public sales count/value;
- inventory turnover;
- claims;
- information;
- obligations;
- outside income/cost;
- support/social/household burn;
- recovery routes;
- objective progress;
- form transitions;
- Sun Moment opportunities/resistance.

Concentration:

- cash HHI;
- wealth HHI;
- sales-count HHI;
- sales-value HHI;
- claim-holder concentration;
- information-broker concentration.

Dominance is concerning when one actor or policy dominates **several** dimensions and others depend on it without viable substitutes.

Do not diagnose Wong/Octopus dominance from transaction count alone.

---

# 13. Market Depth Red Flags

Warn, do not automatically tune, when:

- auction abstention is almost never rational;
- winning common-value auction almost always yields profit;
- Dima route dominates whenever available despite fee;
- public route dominates every legally available case with no trade-off;
- market making becomes near-riskless spread extraction;
- inspection is always optimal because effective cost is zero;
- deception is always optimal because consequences never matter;
- claim extension always dominates collection;
- forced liquidation never destroys future value;
- Juan confidence event cannot become reflexive through real balance-sheet changes;
- one liquidity route is chosen >60% in rich states;
- Sun Moment resistance is a free-action dominant strategy;
- repeated same-place flips never deplete supply, saturate demand, move price or attract competition;
- restock appears without production, arrival, harvest, finite resale/supply or transformation;
- catalogue growth adds dead SKUs rather than bridge goods;
- race, gambling, speculation or investment makes ordinary economy irrelevant;
- private tips guarantee profit without reliability, motive, freshness or uncertainty;
- visible hard floors/caps create riskless trades;
- business growth ignores buyers, capacity, working capital, labour, supply or competition;
- wealth removes attention scarcity, illiquidity, capital lock or meaningful allocation choices;
- large positions have no price/execution/counterparty impact;
- relationship bars change no information, credit, access, terms or reliability;
- unrelated minigames are required for character growth;
- progression relies on skill-tree inflation, inventory bloat or arbitrary unlocks rather than knowledge, assets, relationships, reach and productive capacity.

These guardrails come from the supplied merchant/finance-simulation design lessons, not a new competitor benchmark or runtime test.

---

# 14. Species / Form Economic Matrix

Forms/species are not a Buddhist class system.

A form should matter only if it changes at least three of:

- mobility;
- object handling/carrying;
- legal recognition;
- formal-market access;
- informal-network access;
- environmental access;
- sustenance/maintenance;
- biological time horizon;
- information channel;
- collateral/property relation;
- vulnerability to others' actions.

## Human

- strongest ordinary legal recognition;
- easy formal contract/title access;
- broad public-market access;
- ordinary object handling.

Not spiritually superior.

## Dog

- strong dock/Animal social access;
- scavenging/salvage;
- limited formal recognition;
- food/household pressure;
- practical mobility.

Not `+relationship`.

## Seagull

- high local mobility;
- tiny-object/document movement;
- rooftop/harbour/informal access;
- limited carrying capacity;
- weaker formal trust.

Not `criminal species`.

## Penguin

- fish/cold relation;
- awkward access to many Human spaces;
- family continuity can substitute for some support;
- useful legal-memory discontinuity case.

## Octopus

- marine access;
- physical handling/throughput;
- seafood position;
- public-clearing role is institutional, not innate magic.

## Plant

Future form:

- near-zero voluntary mobility;
- growth/dormancy/reproduction;
- time/environment are primary resources;
- can itself be valued as productive stock, specimen, collateral, property or food;
- inverts the player's old object/subject position.

Final agency remains unresolved.

## Sailor

Role/condition, not species.

- external prices;
- import/export;
- absence/return;
- deadlines;
- commission;
- weaker local rootedness.

---

# 15. UI Architecture — Scene First

`ART_DIRECTION.md` §§15–18 owns desktop/mobile composition, portraits, progressive desk clutter, comic rhythm and information hierarchy. `INFORMATION_DISCOVERY_MODEL.md` owns newspaper / phone / local-market timing, provenance and alpha decay. Reuse the existing scene-first shell rather than creating a second UI architecture here.

One current location/person, one active object/paper and contextual choices remain primary. Archive evidence in Notebook/records without displaying duplicate paragraphs. Accumulated claims/invitations/provenance can clutter the desk; total commodification may make it administratively cleaner. No omniscient NPC cash/valuation, visible karma, route-checklist tabs or concept-completion grid. Preserve legibility at ~390px.

## 16. UI Implementation Boundaries — Consolidated

Only expose facts the player can legitimately know. Separate general newspaper, private phone and local/Octopus records. Final clock and form decisions must precede dependent UI rules. This documentation pass changes no UI code.

---

# 17. Next Design Freeze Gates

Before Market Depth: interpret actual Living Samsara diagnostics; verify recurring loops, bounded capacity, claim/holder symmetry, incumbent estate accounting and nontrivial Sun Moment opportunity value. Do not tune away an unexplained monopoly.

Before assessment/replay freeze: mark each domain honestly implemented/partial/candidate, establish visible opportunity diversity, legal reachability for every implemented target and cross-context evidence. Resolve Chapter 18's clock/rebirth choices before dependent rules.

Before final art: stabilise scene information, dialogue-state selection, life pacing and locations. None of these gates authorises implementation in this reconciliation.

---

# 18. Open / Intentionally Unresolved

Do not resolve these by document phrasing or code:

- exact dual-time / Human-Sun clock, clearing cadence and final action budget;
- borrowed time, hard death/reset versus estate continuity and full rebirth redesign;
- final Wong species (current presentation Dog), Plant agency and Plant death/continuation;
- exact home/release/ending mechanics and Juan planting meaning;
- Auction v2 internals; vessel/pot plus flower remains Strong Candidate;
- Juan Cliff race, safety, outcome and death/catastrophic consequences;
- pooled shipment/project implementation (**Deferred/Open**);
- exact final Sun Moment, resistance and loss-of-stop consequences;
- productive asset residual values, shop/network-credit terms and financing balance;
- final player style/scoring/radar, diagnosis weights and confidence calibration;
- business takeover, public companies, shareholders and IPO systems (**Deferred/Open**);
- exact character release, transformation mapping and romantic/attachment outcomes.

These are unresolved design decisions, not missing implementation requirements.

---

# 19. Historical Work-Lane Boundary

**History:** Living Samsara runtime and later design authoring were assigned to separate work lanes. Current implementation status must come from that lane's dated evidence, not this old board. This design branch owns documentation reconciliation; it does not merge implementation commits or authorise mechanics.

---

# 20. Market Depth Contract — Retired Duplicate

The former exact implementation contract duplicated Chapter 5 and over-froze auction, negotiation, quality, quote and run parameters. Chapter 5 now owns the candidate mechanics; historical presets remain in Git history. No Auction v2 or other Open mechanic is implementation-ready merely because the old chapter called it a contract.

---

# 21. Balance Regimes — Consolidated

Chapter 2 owns the single regime table; Chapter 27 owns provisional scoring and falsification. Marine-supply performance must not be credited to Octopus Clearing or its client float.

---

# 22. Ending / Teaching Reachability Suite

Cover implemented domains, cases, routes and capstones across multiple legal trajectories, not one run. Candidate mechanics are future coverage, not failed runtime coverage.

Target schema: `targetId`, `type = domain | case | route | capstone`, implementation status, factual predicate, visible-path requirement. Output: `{domains, cases, routes, capstones, evidenceIds}`. Chapter 28 owns legal policies; Chapter 9.3 owns set cover. Report unreachable implemented targets explicitly, with no player-facing completion grid.

---

# 23. Reachability / Balance Metrics — Consolidated

Chapter 11 owns access/use metrics and Chapter 12 owns economic concentration. A capstone needs a legal visible path with no hidden-truth requirement; recurrence or a functional analogue should survive a missed opportunity. No ending requires all teaching domains.

---

# 24. Assessment Evidence Contract

Every independent decision case should preserve:
- caseId / lifeId / day / phase / form;
- domain / event;
- counterparties;
- visible alternative channels;
- known information IDs and quality where relevant;
- current-body cash;
- accessible wealth;
- relevant goods/claims/obligations;
- relationship/access state;
- chosen action and terms;
- later outcome evidence.

Do not store inferred motive.

Chapter 6 owns provisional dimensions, weighting and independence. Add return-class tags only as analytic metadata from `GAME_DESIGN.md` §2; do not infer motive or duplicate profit across classes.

---

# 25. Comic Consequence State Binding

`ART_DIRECTION.md` owns visual style and storyboard sequences. Bind panels to observable state transitions, not random decoration: establish material state → commitment → settlement → plausible reaction → receipt/object/absence. Usually 2–5 panels is a provisional production target.

| Event | State-specific material trace |
|---|---|
| Aspen delivery | provision paper/advance and missing stock → Lime/watch/receipt; default returns reserved balance and records restitution if owed |
| Joel credit | tab/cash → later repayment or unpaid recurrence; no romance inference |
| Yasmin secured finance | inspection/collateral transfer → recovery or seizure; no automatic anger |
| Juan claim | holder changes while debtor remains; extension edits maturity, early sale removes productive stock |
| Octopus | order/cash/good transfer → public settlement record |
| Sun Moment | ordinary pause with environmental motion; only a genuinely available continuation changes the player's paper; exact final mechanic Open |
| Form change | repeated place at altered access/body scale; incumbent estate paper may remain, reset model Open |
| Commodification | papers/claims align and compress until people are framed through exposure; no moral ending label |

---

# 26. Immediate Post-Living-Samsara Decision Gate

When Codex returns raw Living Samsara data, ChatGPT reviews in this order:

1. semantic correctness:
   loops repeat; bounded knowledge; claim holder/liability consistency; estate accounting; Octopus float.

2. activity:
   dead days; plans; fills; turnover; opportunity density.

3. money:
   sources/sinks; actor P&L; concentration; outside-income dependence.

4. actor-loop viability:
   Aspen / Joel / Yasmin / Wong / Juan / Dima / Octopus.

5. player viability:
   no-action; recovery routes; form transitions; policy capability.

6. Sun Moment:
   resistance frequency; realised advantage; dominant-free-action risk.

7. only then:
   parameter tuning and final Market Depth implementation spec.

Do not patch every warning with a number change.
Structural problems are fixed structurally first.

---

# 27. Environment-Regime Scoring Protocol

The regime table above is a design hypothesis. It must be falsifiable.

For each regime, evaluate every primary economic style on the same five outcome dimensions:

1. **Liquidity** — ending accessible cash and low-cash recovery breadth.
2. **Wealth** — legally accessible reference wealth, not estate-only wealth.
3. **Resilience** — survival / form continuity / avoidance of forced dead states.
4. **Objective leverage** — progress toward scarce opportunities / Sunflower routes.
5. **Optionality** — number of materially distinct routes preserved for the next 1–2 days.

For each style × regime, normalise within that regime rather than against one global scale.

Suggested developer-only rank score:

`regimeScore = .25*Liquidity + .20*Wealth + .20*Resilience + .20*ObjectiveLeverage + .15*Optionality`

The exact coefficients are provisional and should be sensitivity-tested. The rank is more important than the exact scalar.

### Regime pass conditions

A healthy mature market should satisfy all of:

- every primary style ranks top-2 in >=2 regimes;
- every primary style ranks bottom-2 in >=2 regimes;
- no style ranks top-2 in >6 of 10 regimes;
- no style is bottom-2 in >7 regimes;
- no single route family explains >50% of the top-performing style's advantage across all its strong regimes.

### Style-specific falsification checks

**Aspen** fails if she remains top-ranked during highly ambiguous, unbounded, shock-driven regimes where her conservative scheduling should be costly.

**Joel** fails if relationship-rich regimes do not improve access/credit/optionality relative to cash-equivalent public routes.

**Yasmin** fails if her capital style dominates tiny-margin high-turnover regimes with no capital scarcity.

**Wong** fails if high-turnover environments do not produce volume advantages, or if salvage alone creates high wealth without corresponding burn/effort.

**Juan** fails if long-duration productive-value regimes do not reward waiting / maturity, or if short-horizon liquidity regimes never punish him.

**Dima** fails if formal exclusion does not create genuine fee-worthy demand for his intermediation, or if he remains equally useful once trust/formal access is frictionless.

Do not parameter-tune a style until the regime where it should be strong is actually being generated by the harness.

---

# 28. Legal Reachability Trajectory Skeletons

These are developer policies, not player walkthroughs. Use only normal actions and player-visible knowledge; no hidden-state reads, fabricated inventory or direct ending flags. Clock-dependent steps refer to the incumbent model, not a frozen future clock. Candidate mechanics remain future coverage.

| Policy | Legal sequence and distinguishing check |
|---|---|
| T1 Aspen Operator | learn provision need → contract without stock → legitimate sourcing → optional contextual Sun Moment comparison → on-time delivery; never fabricate Lime, record whether a late edit actually mattered |
| T2 Joel Relationship Liquidity | costly relationship history → cash pressure with another visible route → useful legal credit/favour/proxy → repay/reciprocate; compare best non-relationship terms, not a single favour click |
| T3 Yasmin Capital | legitimately acquire collateral → real liquidity need → compare sale/loan → future auction using legitimate clues → bid/abstain variants; separate collateral/auction P&L, immediate buy-to-pledge proves reachability only |
| T4 Juan Claims | discover through Joel/Dima → affordable known claim → hold to buyback/due → legal collect/extend/liquidate variants; compare recovery and destroyed future value without hidden Juan cashflow |
| T5 Dima Institution | real access/form constraint with two comparable channels → record Octopus/Joel/Dima availability, fee, timing and traceability → choose/settle → compare actual cost/delay/visibility |
| T6 Information Broker | acquire useful lead → enumerate exploit/sale/exclusive/favour/wait → compare at least three available branches; preserve breach truth versus detection and realised information use |
| T7 Wong Dealer — Candidate | observe bridge-good market → acquire quote stock → negotiate real BATNA → two-sided quote → balanced/one-sided flow variants; separate inventory and spread P&L, exact prerequisites Open |
| T8 Juan Confidence — Candidate | genuine multiple creditors and immature backing → legitimate non-conclusive adverse signal → hold/sell/collect/extend/liquidate variants → causal propagation; test both a run and a scare resolving without insolvency |

Provisional suite acceptance: every implemented target has a legal trajectory; materially different routes get at least two branches; no trajectory must carry >60% of targets. Chapter 9.3 owns set-cover selection. Keep omitted legal trajectories as regression diversity, not player completion requirements.

---

# 29. Codex Skill-Use Policy

Installed Codex skills may be used, but only when they are the shortest path to a real task need.

The project does **not** want ritual skill invocation.

## Skills already appropriate in this project

### Ponytail / minimal-change implementation
Use at the start of a coding batch or when modifying a coherent existing subsystem.

Purpose:
- preserve current authority boundaries;
- prefer existing helpers;
- avoid architecture growth.

Do not repeatedly reload it mid-batch.

### diagnosing-bugs
Use only after a real unexpected failure, incorrect runtime result, or invariant break.

Do not invoke it proactively before anything is broken.

### Computer Use / browser verification
Use only when a player-facing UI path changed and visual/runtime browser verification is genuinely needed.

For this project:
- one focused desktop pass;
- one focused ~390px pass;
- no broad UX audit unless explicitly requested.

### Other installed skills
May be used only if the current task directly matches the skill's unique capability.

Before using a skill, Codex should be able to answer:

> What concrete failure/risk/task does this skill solve that ordinary repository work does not?

If there is no concrete answer, do not load it.

## Skills Codex should not use for ChatGPT-owned work

Do not use research/design-oriented skills to independently redesign:

- finance mechanics;
- player diagnosis;
- karma/world interpretation;
- character psychology;
- art direction;
- ending design;
- balance targets.

Those are authored outside Codex and then handed over as implementation contracts.

## Quota-efficient cadence

Default:

1. one environment/HEAD check;
2. load at most the one implementation skill that is directly useful;
3. implement coherent batch;
4. only if a real failure occurs, load diagnosing-bugs;
5. one final focused verification cycle;
6. commit/push.

Do not spend quota proving that a healthy baseline is healthy before every batch.

---

# 30. Design Backlog — Consolidated

Review actual economic-health evidence through Chapter 26 before further parameter work. Candidate follow-ups are Market Depth sensitivity (Chapter 5), coverage/assessment (6–12, 22–28) and state-bound comic consequences (25 / `ART_DIRECTION.md`). The old “while implementation finishes” schedule is History, not current completion evidence.

---

# 31. Provisional Core-Loop Redesign — Dual Time, Slow Market, Visible Opportunity

**OPEN design hypotheses.** The incumbent Sunrise / Morning / Noon / Afternoon / Sunset loop and estate/current-form baseline are not replaced here. Daily clearing, separate Morning/Afternoon pools, two actions, order-count caps, 14 days, Human/Sun naming, borrowed time, Plant agency and death/reset are not frozen future rules.

## 31.1 Direction and competing constraints

**Strong candidate:** make opportunities legible, keep truth incomplete, and make intervention consume scarce attention. Market depth should arise from actual needs, finite capacity and commitments rather than repeated discovery clicks. Publicly visible leads must not expose hidden inventories, plans or solvency.

Missed opportunities can continue through NPC action. Their observable aftermath returns through newspaper, private phone updates, local scenes and market records according to provenance and publication timing, not a universal tape. Investigation deepens/verifies a lead; private information can reach the player before public disclosure erodes its edge.

## 31.2 Dual time / borrowed time — OPEN

The historical hypothesis calls ordinary participation “Human Time” and Animal/Plant participation “Sun Time.” Names, cosmology and mapping are unresolved. They describe participation contexts in one causal world, not automatically inverted transactions or two complete economies.

A contextual continuation at a stopping boundary might provide the time needed for a real unfinished action while creating equal active-time debt in a counterpart embodiment:

`borrowed units now = active units owed elsewhere`

Conservation is a guardrail **if borrowing is adopted**, not proof that the mechanic is canon. The earlier Human → Animal → Plant debt cascade is only one hypothesis; exact accounting, repayment, disclosure, labels and final Sun Moment remain Open. No free-action bonus or spiritual “[LET GO] = correct answer.”

## 31.3 Plant agency — OPEN

One candidate gives Plant near-zero movement/intervention but broader materially observable information: cargo moves, claims change hands, absences and consequences become visible. It grants no automatic hidden engine truth or guaranteed saleable information.

Earlier prohibitions on all trading/travel/investigation and “being eaten ends the run” were hypotheses, not settled form rules. Final agency, death/continuation, germination and Juan planting meaning remain Open. Avoid both a punishment Wait screen and an information-farming exploit; §32.10 preserves the paper test.

## 31.4 Slower clearing and one time budget — OPEN

One candidate accumulates orders/needs for two windows or two in-world days, then locks and clears once. These units are not yet equivalent under a final clock. A shared book can pool liquidity even if participation differs; §32.9 records evidence against fragmenting that stylised market into separate phase books.

Real constraints are reserved cash/inventory/collateral, capacity, expiry, delivery risk and time; receipts cannot finance another purchase in the same clearing. A visit may prepare multiple feasible orders without one action per fill. Exact cadence and action pricing are unresolved.

Historical calibration examples, **not frozen values**:

| Candidate activity | Illustrative time units |
|---|---:|
| notice a public fact/read a book or market record | 0 |
| ordinary visit/conversation or prepare a feasible order set | 1 |
| inspection, focused investigation, private negotiation/contract | 1–2 |
| substantial physical work | 2 |
| contextual overrun if borrowing adopted | actual overrun, conserved |

A single budget B replaces split pools only in this hypothesis. Compare at least two budgets and life lengths by decision density, abandoned opportunities and clicks. Earlier pacing sketches used 16 days/eight two-day clearings, 10–15 memorable choices, 1–2 crossings and 2–5 valuable leads, including a `2 ordinary / 4 Sun / 4 ordinary / 4 Sun / 2 ordinary` sketch. They remain paper-test inputs, not a final life architecture.

## 31.5 Death and replay — OPEN conflict

Keep three competing models explicit:

1. hard run reset on every death;
2. within-run transformation, but actual death resets;
3. incumbent estate/current-form continuity.

Earlier notes favoured option 2, with knowledge rather than inherited cash/stats driving replay. That preference does not settle the conflict. Persistent evidence, legal estates, assets, form transitions, run boundaries and authored replay changes require one coherent decision before implementation.

## 31.6 Bounded player participation — STRONG CANDIDATE

The player is an attention-constrained general participant with cross-domain visibility. They may learn bounded sourcing, repairs, inspection, bartending, ordinary trade, claims or financing through legal prerequisites and the same accounting rules/costs as others.

**Retired:** the universal copyability promise that every NPC business/institution must become player-operable. Comparable economic actions do not grant Joel's network, Yasmin's capital, Dima's enforcement, Aspen's routes, Wong's throughput, Juan's expertise or Octopus Clearing. Player takeover remains Open/Deferred.

Test whether ordinary player opportunities remain viable under finite NPC capacity, not whether the player can become master of every economic organ. Wealth cannot buy infinite attention or erase inventory, demand, liquidity and market-impact constraints; Chapters 12–13 own the diagnostic guardrails.

## 31.7 Freeze gates; no implementation batch authorised

Before choosing a smallest coherent slice:

1. compare paper timelines, budgets and life lengths using real visible choices and unresolved leads;
2. if borrowing survives, prove conservation and non-dominance against the best alternative use of attention;
3. show several actor niches and player participation under finite capacity;
4. audit every surfaced fact for source, observation/receipt time, credibility and legitimate access;
5. explicitly decide death/reset versus estate continuity;
6. decide Plant agency and verify its interest without omniscience or saleable-information farming;
7. freeze the selected rule, scenario and success/failure evidence separately from this workbook.

The old proposed implementation batches are retired scheduling notes. Do not start borrowed time, slow clearing, form changes or universal business copyability from those notes.

---

# 32. Quantitative Harbour Economy & Demand Ecology — Stress-Tested Design Pass

Status: **PROVISIONAL quantitative design experiments / toy-model evidence, not runtime evidence or frozen canon.**

This chapter records the September 5 design tests that followed the Living Samsara diagnostics and Joel Bar demand work. It exists so the test-backed conclusions are not lost in chat. Numerical results below are from deliberately simplified Monte Carlo / paper models, **not current-engine Economic Health traces**. They establish structural direction and falsification targets; exact constants remain provisional until the engine reproduces the same effects.

The surface objective remains unchanged:

> **Get a sunflower.**
>
> After acquisition: **Go home.**

Demand ecology, the Bar, clearing, background trade and any future dual-time mechanic must support that game rather than replace it.

## 32.1 Economic-organ model

`NPC_CHARACTER_BIBLE.md` owns the cast/operations; `GAME_DESIGN.md` owns the six return classes and player role. Joel consumes inputs to serve customers; Juan holds biological productive capital; Aspen connects external routes; Wong turns stock/services into household surplus; Yasmin allocates private capital; Dima reduces informal friction. Octopus clears public trades without owning all marine supply. Anonymous populations complete the economy.

## 32.2 Demand ecology constitution

`ITEM_ECONOMY.md` owns **Need → local demand → feasible trade → use/sink → outside fallback if needed**. Every gain/cost needs a payer, source/sink and real capital/labour/inventory/information/risk path. Wages enter purchasing power unless explicitly external. Finance serves a final need/project, not an isolated claim economy.

Provisional coverage heuristic: ordinary frequent goods usually need 2–3 independent demand sources; rare provenance goods may have one or none. Consumption, wear, production, social use, export, spoilage/destruction or long-duration lock terminate/defer circulation.

## 32.3 Where new goods can come from

Production/transformation, financed external arrival, finite harvest, salvage/recovery or resale must explain supply. Discovery/brokerage connects an existing seller; it does not create goods. No unexplained overnight restock. Route reach and travel survival can introduce bridge goods gradually; no arbitrary day-unlock catalogue.

---

## 32.4 Background economy is required

A stylised 8-category harbour model was run with anonymous households, marine lots, visiting sellers/buyers and the named actors. Baseline public clearing plus limited Dima fallback produced about **3.12 fills per market window** with **3.2% dead windows**.

Stress tests:

| Scenario | Fills/window | Dead-window share |
|---|---:|---:|
| baseline with anonymous background economy | 3.12 | 3.2% |
| remove background supply | 1.11 | 31.4% |
| remove background demand | 1.89 | 13.8% |
| remove both background supply and demand | 0.90 | 38.9% |

Conclusion:

> **The six named characters cannot be the whole economy.**

Anonymous boats, households, visiting buyers, small vendors and event guests are not filler NPCs. They are the population that prevents every price and story from depending on one named person.

Do not give these background actors full character bibles. They are bounded economic populations with visible aggregate effects. Wages paid to crews/workers enter purchasing power unless explicitly an external drain; households may buy food, simple drinks, lodging and ordinary goods.

## 32.5 Actor-removal stress

With the same anonymous background sector retained, random primary-actor removals were much less destructive:

| Removed primary actors | Mean fills/window | Mean dead share |
|---:|---:|---:|
| 1 | 2.78 | 4.8% |
| 2 | 2.45 | 6.8% |
| 3 | 2.14 | 9.6% |

Worst tested triple was roughly Aspen + Wong + Joel:

- fills/window ≈ **1.63**;
- dead share ≈ **16.3%**.

This is the desired direction: named people matter, but the harbour does not stop existing because one person is unavailable.

## 32.6 Joel absent means the Bar is closed unless somebody actually operates it

Do not silently spawn a substitute bartender.

In the stylised public-market model:

- baseline: **3.12 fills/window**, **3.2% dead**;
- Joel removed and Bar demand removed: **2.71 fills/window**, **5.0% dead**;
- Joel removed but a deliberately modelled lower-capability replacement operator exists: **2.99 fills/window**, **3.6% dead**.

Interpretation:

- the overall harbour survives without Joel;
- cocktail production and Bar hospitality do not;
- the physical venue may still exist or be used for some non-Bar purpose, but drinks do not magically appear;
- a player or another actor may eventually operate the Bar only through a real acquisition/lease/work/relationship transition and then uses the same production constraints as Joel.

Temporary Joel absence during a phase is therefore much less dangerous than deleting Joel from the entire run. Standing public orders can remain while the Bar itself is shut.

## 32.7 Joel Bar — retained scope and quantitative assumptions

`ITEM_ECONOMY.md` owns the real-menu source, curated active ingredient pool, serving yields and flavour/production metadata. `NPC_CHARACTER_BIBLE.md` owns Joel's business. This pass adds no Joel system.

Retain the demand loop: information → procurement of complementary bundles → production under capacity → actual customer sales → leftovers/markdown → spoilage/waste → bounded recovery. Profit can coexist with cash locked in bottles, equipment and tabs.

Information value compares `EV(best action after info) - EV(best action before info)`, net of cost/attention. Ordinary taste gossip may be worth ~0; an event lead changing irreversible procurement can be valuable, then worthless after commitment. Trust can affect influence without deleting Joel's budget, substitutes or BATNA.

Demand shapes: Juan's recurring consumption/tab risk is finite; Aspen attendance/NA preference depends on schedule/recovery; Wong has little discretionary budget but can supply/buy markdown/salvage; Yasmin hosts lumpy groups; Dima meetings occupy space; the player is not guaranteed baseline demand.

**Provisional waste assumptions:** unsold/spoiled perishables become Organic Scrap near zero reference value. Bounded compost recovery was sketched at roughly **10–25% of destroyed input value**, never 1:1. Harmless waste leaves automatically unless deliberately diverted to a real recovery path; awkward/hazardous disposal can occasionally create liability, not a daily garbage minigame.

---

## 32.8 Octopus and Dima must remain institutionally separate

The historical **finite-capacity pooled shipment / investment project** remains **Deferred/Open**, separate from current public clearing. The paper test below preserves evidence, not a current implementation target.

### Public rail vs informal rail stress test

Stylised result:

| Institutional structure | Fills/window | Dead share |
|---|---:|---:|
| cheap public clearing + Dima edge-case route | 3.12 | 3.2% |
| no public rail; Dima-like ~3🥫 friction on all trades | 1.43 | 20.5% |
| public rail but Dima removed | 3.10 | 3.3% |

This model supports cheap public clearing for low-surplus trade and Dima for costly exclusion/privacy/trust/enforcement cases, not merging them. Institutional replacement may preserve clearing if Octopus is absent; removing the low-cost institution itself damages trade. Successful formalisation should be capable of reducing Dima's rents.

### Clearing is not merchant inventory

`Octopus Clearing != Octopus personal merchant book`.

Marine physical supply should be fragmented among small boats, wharf lots, catches, visiting sellers and occasional Octopus-owned inventory. The clearing operator may process a majority of trades without owning their goods or counting settlement float as wealth.

### Finite pooled shipment — DEFERRED / OPEN

Historical paper candidate: a finite project with locked cash/in-kind contributions, a real external outcome, delayed claims and possible loss. Exact cadence, terms, operator and implementation remain Open; no permanent stock or guaranteed-yield button is selected.

Example structure:

- target/cap contribution basis around 20🥫 in the paper test;
- accepts cash and only project-relevant in-kind goods;
- each in-kind good has a pre-announced project bid/haircut and quantity cap;
- contribution creates a delayed project claim, not immediate cash;
- actual external demand, spoilage/delay and realised sales determine proceeds;
- unsold residual assets remain economically real;
- no same-cycle contribution -> payout -> recontribution loop;
- Octopus may receive a small carry on realised profit, not a fixed daily return;
- player/NPC claims may later be sold through the normal claim/intermediation system.

Illustrative Monte Carlo calibration only:

- funded basis: 20🥫;
- carry: 12% of positive project profit;
- mean investor multiple ≈ **1.047x**;
- loss probability ≈ **36.1%**;
- 5th/95th percentile multiple ≈ **0.79x / 1.28x**;
- average Octopus carry ≈ **0.24🥫 per completed project**.

An illiquid item with reference 8🥫 but project contribution bid 5🥫 produced an illustrative expected payout ≈ **5.24🥫**, with 5th/95th ≈ **3.94 / 6.42🥫**. That is intentional liquidity transformation: haircut + delay + venture risk, not guaranteed value washing.

When the finite pool was added to the stylised harbour supply model, fills rose from **3.12 to 3.59/window** and dead windows fell from **3.2% to 1.9%**. In that run the project accounted for about 18% of sale count. Treat that volume as **project throughput**, not Octopus personal wealth.

This pool remains **Deferred/Open**. A live demand economy alone does not freeze its implementation; it still requires a separate design decision.

## 32.9 Slow clearing and dual-time stress tests

### Fixed accumulation beats thin daily clearing in the paper model

Using the same harbour supply/demand model:

- one-window clearing: about **3.12 fills/window**, **3.3% dead clearings**;
- two-window accumulation with ~15% aged-fresh spoilage: about **3.90 fills per underlying window / 7.80 per clearing**, near-zero dead clearings;
- two-window accumulation with ~30% aged-fresh spoilage: about **3.81 fills/window / 7.61 per clearing**, near-zero dead clearings.

Even after allowing substantial first-window demand expiry, the two-window version remained thicker than daily clearing in this stylised model.

This strengthens the **fixed two-window / two-day shared clearing** candidate. A volume-triggered clearing can also thicken the market, but unpredictable timing creates a player-legibility cost. Prefer fixed predictable settlement for the first real test.

### Never split Human and Sun liquidity into separate books

Randomly splitting supply and demand into two phase-specific books reduced the same model from:

- shared book: **3.12 fills/window**, **3.2% dead**;
- split phase books: **2.19 fills/window**, **9.9% dead**.

Therefore, if dual time survives design:

> **Human/Sun participation may differ, but committed orders enter one shared settlement book.**

Dual time is a participation/access rule, not two independent economies.

## 32.10 Borrowed-time test

A stylised opportunity-knapsack test used 1–2 unit tasks with noisy economic value and compared free extra time against exact debt shifted into the next participation window.

With base budget `B=4`, max borrow 2:

- exact equal debt was rational in about **38.6%** of windows;
- average debt taken ≈ **0.53 units**;
- average value gain ≈ **0.78** model-value units;
- free extra time was used in about **69.4%** of windows and generated much larger advantage.

With `B=5`:

- exact debt use ≈ **35.0%**;
- free-extra use ≈ **54.5%**.

Conclusion:

> **Continue only works if borrowed time is conserved.**

Free late actions are predictably too attractive. `B=4` and `B=5` both remain useful candidates; do not freeze the number yet.

### Plant-information farming guardrail

Estimated marginal active-time value in the same stylised opportunity distribution was roughly:

- `B=4`: **1.90 value units per marginal active unit**;
- `B=5`: **1.32**.

If Plant observation automatically creates saleable/provenanced information worth more than the active time the player gives up, rational players will deliberately farm Plant debt.

Therefore Plant may widen observation, but most Plant observations must be:

- player knowledge without automatic saleability;
- weakly provenanced;
- useful for future inference;
- monetisable only after later verification, access or a separate causal observation.

This keeps Plant as low-agency/high-observation rather than a hidden information mine.

## 32.11 Sunflower-route resilience

`GAME_DESIGN.md` §14 owns Sonya/Supper, Yasmin/Auction and Juan/Cliff. The following is a **paper dependency audit of incumbent route concepts**, not current-engine reachability proof:

| Removal for a whole run | Reported dependency consequence |
|---|---|
| Joel | Supper and incumbent Cliff drink path fail; Auction remains |
| Yasmin | Supper + Cliff remain |
| Juan | Supper + Auction remain |
| Aspen | incumbent Onewheel-production monopoly can block Cliff |
| Wong/Dima | need not delete a route if goods/access have substitutes |

Joel was therefore a route-diversity bottleneck, not total-goal failure. Bounded player drink/repair work could remove unrelated production monopolies; it does not require universal business takeover. Sonya remains specifically family-linked, with ordinary household Sunflower allocation and fresh-fish demand, not a seventh economic archetype.

Candidate resilience checks: any single primary-actor absence leaves at least one legal acquisition route; temporary absence does not permanently kill one without a knowingly missed real deadline; avoid multiple unrelated unreplaceable production gates. Acquisition stays unpriced → Go home. Exact Auction v2, Cliff safety/outcome/death and home/release mechanics remain Open.

## 32.12 Yasmin's secondary hosting demand

The Bar paper model used lumpy group headcount with uncertain tastes, creating procurement information value and capacity pressure. This supplements her private capital/provenance role in the bible. Investment requires a real operating/working-capital need; no need means no investment story.

## 32.13 Wong species is reopened, not silently changed

Current presentation still uses Wong as a Dog; final species is Open. The creator has reopened whether that complexity is actually earned.

A small access-sensitivity test changed Wong's formal-access probability from dog-like ~0.55 to human-like ~0.95. Aggregate fills changed only from roughly **3.11 to 3.18/window** (~2%), while Dima-route use fell. That means the current economy does **not yet** mechanically justify the full Human/Animal distinction through Wong alone.

Decision gate:

> Keep Dog Wong only if his body/form changes at least several concrete opportunity dimensions in play — e.g. formal access, Animal-network information, mobility/handling, household/rescue ecology — rather than functioning as a human trader with a dog portrait.

Until that gate is tested, **do not migrate Wong to Human and do not add more species-specific complexity.** The visual/social appeal of Dog Wong is real, but mechanics must earn the ontology.

The same standard applies to all forms: communication can be ordinary world fact, but form must materially change opportunity rather than exist only as surreal decoration.

## 32.14 Scope of earlier implementation proposal

**History:** the prior paper pass proposed a bounded Demand Ecology slice: Joel demand/capacity/complementary inputs and serving yields, local/external payer accounting, leftovers/markdown/Organic Scrap recovery, anonymous sectors, distinct Octopus ledgers, Juan claim symmetry and route/economic-health diagnostics. It did not establish that those systems were implemented.

Keep Joel's existing scope intact in this reconciliation. Chapter 18 lists unresolved/deferred mechanics. This pass implements none of them; old batch language does not authorise a dual-time/rebirth rewrite, shop, crop system, loans/workout, pooled shipment or Auction v2.

## 32.15 Provisional quantitative design experiments — CHAT-SIDE TOY MODELS

**Provenance:** approximate results supplied in the reconciliation brief from chat-side toy models. These are **NOT runtime evidence, production balancing values or frozen canon**. No source simulation, random seed, sample size or full distribution was supplied here; reported probabilities cannot be independently reproduced from this brief. Preserve them as design evidence and sensitivity questions, not empirical claims about the current game. “Window” is a model interval, not a frozen action budget/day/dual-time clock. Cans are the toy accounting unit, separate from the existing prototype price rebase.

### A. Aspen — information value and attention

Toy assumptions: baseline real Lime/provision shortage probability ≈35%; acting correctly nets ≈+5 cans, acting incorrectly costs ≈−3 through carry/spoilage/resale. The supplied table varies private-signal reliability:

| Private-signal reliability | Posterior shortage probability | Action EV (cans) |
|---:|---:|---:|
| 50% | 35.0% | −0.20 |
| 55% | 39.7% | +0.18 |
| 60% | 44.7% | +0.57 |
| 65% | 50.0% | +1.00 |
| 70% | 55.7% | +1.45 |
| 75% | 61.8% | +1.94 |
| 80% | 68.3% | +2.46 |

**Arithmetic interpretation, not an additional test result:** this table is consistent with a positive signal having symmetric sensitivity/specificity r: `p = .35*r / (.35*r + .65*(1-r))`, then `EV = 5*p - 3*(1-p)`. A differently defined “reliability” would require a different posterior; the symmetric interpretation must not become a world rule.

Low-quality insider information can have negative EV. Even +1 to +2 cans may be unattractive when an attention/action window has comparable alternative value. Include information/verification cost and opportunity cost of attention. A fast/narrow/uncertain phone lead may carry an early advantage; a slower broad newspaper report can erode it by informing competitors. **65–80% is only an initial testing band.**

Strong candidate chain: deadline + weather + private signal + delayed newspaper + real BATNA + public disclosure/alpha decay. Test against outside suppliers and competing sellers, never a player-only shortage solution.

### B. Wong — recurring burn and capital formation

Toy assumptions: starting cash ≈7 cans; average retail margin ≈18%; demand ≈4.2 units/window; horizon 16 windows; first shop/fixed-asset threshold ≈11 cash; fixed asset cost ≈6. Only recurring household burn varied.

| Household burn/window | Probability of shop/fixed-asset stage by 16 windows |
|---:|---:|
| 0.8 | ≈90.3% |
| 0.9 | ≈48.5% |
| 1.0 | ≈5.5% |

This is **too knife-edge for final balance**, but illustrates how a small recurring burden can prevent labour surplus from ever crossing into productive capital. Test sensitivity before adopting any threshold. This supports household-enterprise capital formation, not an ethnic work-ethic story.

### C. Wong — network credit and access to capital

A toy ≈3-can informal/network credit option changed reported shop-transition probability:

| Household burn/window | No credit | +3 network credit |
|---:|---:|---:|
| 0.90 | 48.6% | 78.3% |
| 0.95 | 22.4% | 65.1% |
| 1.00 | 5.5% | 50.3% |

The 48.5% versus 48.6% baseline is preserved as supplied approximate model reporting, not harmonised into false precision. Credit expands access to productive capital; it also creates repayment, can reduce short-term net wealth and can default. **Credit should improve the possibility set, not guarantee success.** Loan terms and the mechanism behind these probabilities remain unprovided/Open.

### D. Wong — shop productivity and residual value

The supplied toy test found that a shop offering only **+3 inventory capacity** did not justify rent, staff cost and capital lock at low retail margins. No numerical payoff distribution was supplied for this comparison.

A multi-use shop should create actual retail/parcel/storage revenue, reduced travel/carrying cost, better storage/lower spoilage, inventory staging and network/information value. These are candidate operating effects requiring buyers and costs, not additive guaranteed bonuses.

A productive asset should retain some residual value: spending 6 cash does not automatically destroy 6 wealth. **Cash != wealth.** Exact residual/recovery values, lease versus ownership, staff needs and profitability remain Open. Do not promote the shop to implemented canon.

### E. Juan — maturity mismatch and distress finance

Toy starting state: cash ≈1, debt due now ≈5, biological maturity in ≈4 windows. Future plant value: mean ≈9.56; median ≈10.15; 10th–90th percentile ≈3.58–12.91; bad-tail/crop-failure probability ≈12%.

| Toy strategy | Supplied terms | Approximate reported ending-value outcomes |
|---|---|---|
| Distressed sale now | discounted early sale; give up future upside | mean 2.40; 10th percentile 1.76 |
| Dima future-output claim / risk sharing | current liquidity for ≈58% of harvest; Juan retains ≈42% | mean 4.02; median 4.26; 10th percentile 1.50; outcome <1 ≈4.2% |
| Yasmin secured loan | borrow ≈4; repay ≈4.8 at maturity | mean 5.01; median 5.35; 90th percentile 8.11; default ≈12.2%; 10th percentile ≈0 |
| Do nothing / miss debt | endure distress | mean 0.82; ending wealth <1 ≈63.2% |

The brief describes early sale as certain discounted current cash while reporting dispersion in ending value; it does not specify the source of that dispersion, liquidation/recovery rules or whether all net-value conventions match. Preserve the summaries without inventing those missing assumptions. High-level arithmetic checks are not a reproduction of this simulation.

Desired qualitative trade-offs:

- **Early sale:** lower return/lower downside; sacrifice maturity upside.
- **Dima:** expensive upside sharing but reduced fixed-default exposure; risk borne by real counterparties, no free rescue.
- **Yasmin:** more capital-efficient/higher expected retained payoff in this toy case, with sharper fixed repayment/default downside.
- **Do nothing:** poor distress path, without a magical immediate game-over flag.

“No one financing option should strictly dominate” is a **design target**, not a stochastic-dominance proof from these summaries. Compare liquidity, downside, collateral loss, time locked and counterparty willingness as well as mean return. Current debt payment, future maturity and who bears each loss must be explicit in any future model.

### Design consequences and next falsification questions

Aspen's logistics/BATNA and information timing; Wong's household burn → working capital → productive fixed asset; Juan's maturity versus current liability; Yasmin's real collateral finance; and Dima's costly distressed workout are **Strong Candidates** supported by these limited experiments. They are not permissions to implement weather, phone/newspaper, a shop, crop system or loans here.

Test whether attention eliminates the apparent information edge, whether Wong thresholds can be less knife-edge, whether shop services cover real costs, whether credit still permits failure, and whether early sale/output-sharing/secured credit each has a state where it is rational. Keep pooled shipment, public-company/IPO expansion and business takeover Deferred/Open. Case coverage lives in `SCENARIOS_TEACHING.md`, not a new quest list.
