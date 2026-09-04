# Sunflower — Design Workbook

> Status: current **working** design for future mechanics, quantitative balance, assessment, ending reachability and UI architecture. It is deliberately one workbook rather than many audit/spec MDs.
>
> Domain source files remain authoritative for their own areas: `WORLD_CANON.md`, `GAME_DESIGN.md`, `DAY_LOOP_MARKET_STRUCTURE.md`, `REBIRTH_FORM_SYSTEM.md`, `SCENARIOS_TEACHING.md`, `INFORMATION_DISCOVERY_MODEL.md`, `ITEM_ECONOMY.md`, `NPC_CHARACTER_BIBLE.md`.
>
> This workbook supersedes the old working/audit files `NARRATIVE_KARMA_MATRIX.md`, `PLAYER_ASSESSMENT_AUDIT.md` and `NPC_ENGINE_ROUTE_AUDIT.md`.

---

## 1. Production roadmap

1. **Playable Harbour** — bounded knowledge, Noon market, finance, evidence, onboarding, scene shell. Substantially complete.
2. **Living Samsara Core** — current implementation: canonical cast, Octopus Clearing, Dima, Sun Moment, recurring loops, Juan plants/claims, estate accounting, Economic Health v2.
3. **Market Depth** — Yasmin Auction v2, BATNA, inspection/deception, market making, confidence run/fire sale, deeper venue choice.
4. **Assessment + Replay Freeze** — Outcome/Process/Style, opportunity density, ending/case reachability, life/rebirth pacing.
5. **Narrative Embodiment** — state-aware scenelets, cross-life recognition, multi-character scenes, object recurrence.
6. **Final Scene UI + Art** — illustrated locations/portraits, physical papers, progressive desk clutter, commodification UI transformation.
7. **Real Playtest + Final Balance** — novice, finance-literate, exploit, narrative-first, repeated-run and ending-coverage players.

Do not skip the quantitative gates between major mechanics phases.

---

## 2. Balance constitution

Balance does **not** mean equal ending wealth.

Each primary economic style should have world states where it is locally strong and states where it is locally weak.

- Aspen — low-variance execution / contracts.
- Sterling — relationship / experiential optionality.
- Yasmin — capital allocation / provenance.
- Wong — high-turnover low-margin.
- Juan — duration / biological assets / distressed finance.
- Dima — informal intermediation / enforcement.
- Octopus — physical wholesale / public clearing infrastructure, not a seventh diagnostic archetype.

Quantitative target for mature regime tests:

- each primary style top-2 in at least 2 meaningful environment regimes;
- each primary style bottom-2 in at least 2 regimes;
- no simple style top-2 in >~60% of tested regimes;
- transaction count alone never proves dominance;
- structural dominance means simultaneous control of several resources/flows or unavoidable dependency without substitute routes.

Test regimes should include high/low liquidity, information asymmetry, perishables, long-duration assets, formal exclusion, confidence shocks, crowded spreads, relationship-rich cash-poor states and outside-demand cycles.

---

## 3. Opportunity ecology

Sunflower generates **pressure first** and lets several systems answer the same pressure.

A choice is strategically meaningful only when at least two materially different routes are actually visible/executable.

Routes are materially distinct when they differ in time, collateral, relationship dependence, information loss, legal access, future obligation, certainty or public visibility.

Important pressure families and candidate routes:

### Liquidity squeeze
Public sale / inbound bid / wait for clearing / information sale / exclusivity / Sterling credit / Yasmin collateral / Juan receivable / Dima route / Aspen advance / abandon opportunity.

### Information edge
Exploit personally / sell / exclusive / favour / verify / wait / breach / ignore.

### Distressed claim
Buy / sell onward / hold / buyback / extend / collect / force liquidation / abstain.

### Scarce asset
Buy / auction / secured finance / relationship finance / sell another asset / investigate / wait / abstain.

### Sourcing obligation
Source first / contract first / backup source / public source / relationship source / pay certainty premium / default / decline.

### Venue problem
Octopus public / Dima informal / Sterling proxy / wait / abstain.

### Quality uncertainty
Inspect / disclose / uncertainty / omission / exaggeration / falsehood / warranty / walk.

### Market-making inventory pressure
Maintain / widen / tighten / stop / liquidate / hold / switch good.

### Confidence event
Sell claim / hold / extend / collect / buy distressed / liquidate / use information.

### Sun Moment opportunity
Natural pause / keep working when a real late-order opportunity exists. Never a spirituality score.

### Form-change recovery
Formal route / Dima / Sterling / current-form work/assets/info / wait / later transition.

Mature 14-day diagnostic targets:

- <=2 ordinary zero-route days;
- >=8 days with >=2 routes;
- >=4 days with >=3 routes;
- no more than 2 consecutive ordinary dead-choice days;
- important diagnosis dimensions receive evidence in multiple characters/contexts.

---

## 4. Market Depth v1

### Yasmin Auction v2

First common-value teaching lot: **Bent Silver Fork — Shipwreck Lot**.

- public reference 10🥫;
- reserve 8🥫;
- sealed first-price auction;
- ordinary state resale value 10🥫;
- documented wreck state resale value 20🥫;
- prototype prior P(wreck)=.40;
- noisy inspection clue and stronger provenance-document clue;
- NPCs bid only from their own evidence + liquidity, never hidden truth.

Use this ordinary lot to create winner's-curse cases before Sunflower ever uses the same auction grammar. Other bids must never define the player's private value for Sunflower.

### Negotiation / BATNA

Opening offer → Accept / one Counter / invoke a **real** visible alternative / Walk → at most one final response.

No repeated haggling loop.

Prototype guardrail: counter changes transfer by at most ~25% of opening value. A credible alternative may improve terms 1–2🥫; no outside option means no magical persuasion bonus.

First hosts: Wong, Dima, Yasmin.

### Quality / inspection / deception

First case uses Bad Tangerine vs an explicit Lime requirement.

Store factual representation category, not morality:
`full_disclosure`, `uncertain_description`, `strategic_omission`, `exaggeration`, `direct_falsehood`.

Inspection, warranty and later discovery must be causal. No omniscient reputation hit.

### Market making

First eligible standardised goods: Fish Bones and Empty Green Bottle.

One two-sided quote in v1; real cash/inventory reserved; `BID < ASK`; no same-batch recycling. Maker must be able to earn spread **and** lose from inventory.

### Juan confidence run

Eligible only with multiple creditors, meaningful face value, immature productive assets and inadequate current cash.

First operational signal can delay a crop without proving insolvency. Reflexivity must arise through real claim sale, collection, liquidity loss and forced liquidation. No panic meter.

### Formal vs informal venue

Octopus = public, standardised, tape-visible, batch settlement.
Dima = fee-bearing, private, can bridge some exclusion, weaker public price discovery, network enforcement.
Sterling = potentially cheaper relationship route after prior time investment.

---

## 5. Assessment mathematics

Assessment has three outputs:

- **Outcome** — what happened.
- **Process / Skill** — what commitment-time evidence supports about decision quality.
- **Style** — repeated preference for structuring choices.

Style != Skill. No evidence != average.

### Independent decision case

A click is not a case. A case needs materially different alternatives, factual information set, resources/constraints, a commitment/decline and optional later outcome.

Approximate context key:
`lifeId + domain + eventType + counterparty + underlyingOpportunityId`.

Repeated actions in one context are down-weighted.

### Opportunity richness

Conceptual R:

- 0 forced;
- .35 one plausible alternative;
- .60 two distinct routes;
- .80 three+ routes;
- 1.0 several genuinely different trade-offs.

### Evidence weight

Conceptual:
`w = R × S × I × D`

R opportunity richness; S capped stake relevance; I information adequacy; D independence/diversity.

### Process dimensions

1. execution / settlement;
2. liquidity;
3. valuation;
4. information practice;
5. obligation / credit;
6. sourcing / operations;
7. position sizing / exposure;
8. negotiation / alternatives;
9. institutional navigation;
10. relationship-capital stewardship;
11. adaptability / updating.

Each independent case may support +1 / 0 / -1 where facts justify it.

Aggregate direction only with sufficient evidence:
`sum(w*sign)/sum(w)`.

Conflicting contexts remain visible instead of becoming a fake 50/100 score.

Confidence:

- 1 case anecdote;
- 2 independent contexts emerging;
- 3+ across >=2 context types supported;
- 5+ across >=3 context types high confidence.

Never infer love, greed, spirituality, moral worth, cowardice, kindness or enlightenment from behaviour.

Style denominators must be opportunity-conditioned: e.g. private-venue preference is measured only where public and private routes were both genuinely available.

---

## 6. Cross-context diagnosis requirements

Stable judgement should not come from one NPC alone.

- Execution: Aspen + Octopus + Juan.
- Liquidity: Sterling + Yasmin + Juan + public sale.
- Valuation: auction + public gap + claims + collateral + gift/sale.
- Information: investigation + auction clues + exclusivity + inspection + confidence signal.
- Obligation: Aspen + Sterling + exclusivity + claims.
- Sourcing: Aspen + Sterling inputs + Juan crops.
- Position sizing: auction + market making + leverage/claims.
- Negotiation: Wong + Dima + Yasmin.
- Institutional navigation: Octopus/Dima + form change.
- Relationship stewardship: Sterling + Wong/Sonya support + favours.
- Adaptability: alpha decay + auction learning + run signal + form change.

---

## 7. Realised cases / badges

Badge = realised market story, not points/progress.

Rules:

- causal sequence required;
- mechanic click is insufficient;
- profit generally not required;
- badge can coexist with poor process;
- no completion percentage;
- diagnosis reads evidence, not badge count;
- first 14-day life should usually yield only ~1–4 memorable cases.

Implemented:

- **SOLD IT BEFORE YOU HAD IT** — sign without underlying → later source → on-time delivery.
- **EXCLUSIVE** — exclusivity premium → no breach → buyer uses information.

Next cases, with final copy allowed to change:

- **FIRST THROUGH THE GAP** — contextual Noon resistance changes clearing result favourably.
- **RICH, BROKE** — positive assets but near-zero cash and a real near-term liquidity need.
- **BRIDGE BUILDER** — relationship-created route not otherwise available on equivalent terms, later reciprocated/repaid.
- **PAWN THE COMPASS** — collateral creates liquidity used elsewhere; collateral later recovered or rationally surrendered.
- **Bought Somebody Else's Problem** — acquire Juan claim and later collect/buyback/transfer/impaired recovery.
- **Let It Grow** — extend Juan claim; productive asset matures; realised recovery beats original liquidation route.
- **FIRE SALE** — forced immature-asset liquidation below future mature value.
- **RUN ON YOU** — independent counterparties withdraw/collect/sell on discoverable confidence signals and jointly damage liquidity.
- **READ THE FINE PRINT** — warranty/representation changes later settlement after discovery.
- **TOO GOOD TO BE TRUE** — realised winner's-curse story.
- **MARKET IN THE MIDDLE** — genuine market-making spread earned while inventory risk existed.
- **BAGHOLDER** — maker inventory loss after one-sided flow.
- **WALKED AWAY** — rejected terms later shown inferior to a real alternative already available.
- **PAID OVER ASK** — deliberate above-reference payment later produces realised private/non-market benefit.

Capstone cases stay future until their systems mature.

---

## 8. Ending / capstone reachability

The player is **not** expected to unlock every ending or teaching domain in one life.

Critical routes must recur or have functional analogues; missing one arbitrary day should not permanently destroy a whole route unless irreversibility is the point of that ending.

Current known capstone directions:

- Sunflower acquired → objective becomes Go Home (major transition, not automatically final ending);
- Juan plants the player (possible capstone; not automatically certified as liberation);
- Total Commodification (possible capstone; not labelled good/bad);
- rare karmic relation release when a relation no longer reproduces the same causal structure.

Exact full ending list remains intentionally open until late narrative freeze.

Reachability rules:

1. required economic opportunities recur across lives;
2. one missed auction/contract does not kill an entire route;
3. multi-life endings may require persistent factual history, not morality points;
4. one ending/run can finish without deleting later-cycle pursuit of another ending;
5. endings are predicates over factual world state, not hidden moral scores;
6. no ending requires collecting all 16 teaching domains;
7. no teaching domain is mandatory merely because it exists.

### Developer reachability suite

For each implemented route/case/capstone define a target predicate and at least one deterministic **legal** policy trajectory using player-visible state.

A trajectory reports:
`{domains, cases, routes, capstones}`.

Use a simple greedy set-cover step in the developer harness to choose a compact suite whose union reaches every currently implemented required target. Report unreachable targets explicitly.

This optimiser is developer-only and never player-facing.

---

## 9. Teaching-domain coverage

The 16 items in `SCENARIOS_TEACHING.md` are **trading/teaching domains**, not families/factions/quests/cosmology.

Prototype coverage across multiple legal trajectories should distinguish:

- mechanic implemented;
- player-visible situation reachable;
- evidence recorded;
- Notebook concept path;
- realised case/badge where appropriate.

Do not fake green coverage and do not show `13/16 concepts` to the player.

Per-domain diagnostics:

`access_rate = capable trajectories where legitimately reachable / capable trajectories`

`use_rate = trajectories using domain / trajectories where reachable`

Warnings:

- important implemented domain access_rate < .25;
- domain reachable only through one brittle scripted path;
- use_rate > .85 because alternatives are mathematically dominated;
- important assessment dimension receives evidence only from one NPC/context.

Some domains are naturally rarer; equal rates are not a goal.

---

## 10. Species / form economics

Forms/species are not Buddhist classes.

A form is mechanically worthwhile only if it changes at least three of:

- mobility;
- object handling;
- legal recognition;
- formal access;
- informal access;
- environmental access;
- sustenance;
- biological time horizon;
- information channels;
- property/collateral relation;
- vulnerability to others.

Human: strongest ordinary formal recognition and object handling; not spiritually higher.

Dog: dock/Animal access, scavenging/salvage, practical mobility, food/household pressure, weaker formal recognition.

Seagull: high local mobility and tiny-object/document movement, informal physical access, limited carrying/formal trust.

Penguin: fish/cold relation, awkward Human-space access, family continuity as support, useful legal/memory discontinuity case.

Octopus: marine access and physical throughput; clearing role is institutional, not innate magic.

Plant: future form with minimal voluntary mobility, growth/dormancy/reproduction, environment/time as core resources, and the possibility that the former trader is now itself valued as productive stock/property/specimen. Final agency unresolved.

Sailor is a role/condition, not a species: import/export, absence/return, external prices, deadlines, commissions.

---

## 11. Quantitative balance / dominance

Economic Health must compare more than final cash:

- current-body liquidity;
- legally accessible wealth;
- estate wealth separately;
- public/private volume;
- sales count/value;
- turnover;
- claims;
- information;
- obligations;
- outside income/cost;
- household/social/support burn;
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

Warn rather than auto-tune when:

- auction abstention is almost never rational;
- auction winner almost always profits;
- Dima always dominates despite fee;
- public route dominates every case with no trade-off;
- market making becomes near-riskless spread extraction;
- inspection is always optimal because cost is effectively zero;
- deception is always optimal because consequences never matter;
- claim extension always dominates collection;
- forced liquidation never destroys future value;
- confidence event cannot become reflexive through real balance-sheet changes;
- one liquidity route is used >60% of rich states;
- Sun Moment resistance becomes a free-action dominant strategy.

---

## 12. UI architecture — scene first

Current React already contains a scene-first foundation. Do not restart it.

Long-term grammar:

1. location/scene;
2. active character or operator;
3. one active paper/object;
4. small rail of persistent desk objects;
5. bottom dialogue/consequence strip;
6. contextual actions;
7. archives as drawers, not permanent walls of text.

Desktop target:

- top status ~8–10%;
- left location/portrait ~38%;
- active paper ~44%;
- side/bottom rail for Notebook / Public Tape / Inventory / IOUs;
- bottom current dialogue/result + choices.

Mobile ~390px:

- compact status;
- portrait/location 25–30vh;
- active paper;
- horizontal object rail;
- contextual bottom sheet;
- details as full-width drawer;
- no overlay covering content.

State hierarchy:

**NOW** — current scene, current fact/result, immediate choice.

**ON THE DESK** — order, claim, item, invitation, current public tape.

**ARCHIVE** — Notebook, old tape, old contracts, realised cases.

Do not duplicate the same fact as full text in NOW and ARCHIVE simultaneously.

Portraits should use stable NPC IDs; character state can come from props, posture, scene and dialogue rather than dozens of emotion sprites.

Progressive clutter:

- early game sparse;
- later IOUs, provenance, invitations, claims, returned objects and Notebook scars accumulate;
- Total Commodification can invert this and make the interface **cleaner**, more standardised and more asset-like while people remain present.

Do not show hidden valuation, unjustified NPC cash, karma/entanglement meters or concept-completion grids.

---

## 13. Freeze gates

Before Market Depth implementation:

- Living Samsara Economic Health v2 interpreted;
- recurring loops actually repeat;
- no unexplained catastrophic actor monopoly;
- current-body vs estate accounting works;
- Sun Moment resistance is useful but nontrivial;
- Juan claims exhibit real pricing/duration behaviour.

Before Assessment/Replay freeze:

- Market Depth mechanics implemented;
- all 16 domains honestly marked implemented/partial;
- opportunity-density metrics stable;
- deterministic legal reachability trajectory exists for every implemented major route/capstone;
- cross-context evidence is sufficient for diagnosis.

Before final art:

- information architecture stable;
- dialogue state selection stable;
- life/rebirth pacing stable;
- major location set stable.

---

## 14. Intentionally unresolved

Do not accidentally settle through code:

- exact full ending list;
- true nature of home;
- whether Juan planting is liberation/death/another form;
- final Plant agency;
- final loss-of-stop threshold;
- exact ontology of character release;
- complete transformation causality;
- moral status of Total Commodification;
- final intimacy outcomes;
- final art details.
