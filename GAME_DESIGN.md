# Sunflower — Current Game Design

> **Source-of-truth overview, September 2026.** Older versions remain in Git history. This file deliberately stops being an archive of every idea ever discussed.
>
> Core rule: build a small number of economic primitives that create many behaviours. Do not add a mechanic merely because it sounds interesting.
>
> **Status boundary, 2026-09-07:** §5 owns the frozen constitution. Continuous attention/time, Workbench, locations and surfaced opportunities replace the prototype phase UI. Rebirth, reincarnation, automatic embodiment transitions and former-life/estate gameplay are **RETIRED — DO NOT IMPLEMENT**. Sun Moment remains; future borrowed time/time debt is Open without any form architecture.

---

## 1. North Star

**Sunflower is a single-player trading sandbox about making one impossible acquisition inside a small living market where money, goods, information, obligations, relationships and time all have value.**

The surface objective is simple:

> **Get a sunflower.**

The design goal is a **high-density small economy**, spanning trade, production, operations, financing, investment, speculation and social consequences. It is not an empire simulator, stock terminal, dating sim, finance quiz or item-delivery quest chain.

The primary pleasure is making consequential economic choices:

- valuation;
- information asymmetry;
- timing;
- liquidity;
- negotiation / offer construction;
- private utility;
- relationships and credit;
- competition for scarce stock;
- learning how a small market actually works.

The eccentric world, strange goods, recurring characters and metaphysics deepen that market. They must not replace it.

The economic hierarchy is not a set of interchangeable bonuses:

> **Trading keeps you alive.**
>
> **Information makes you good.**
>
> **Relationships make you resilient.**
>
> **Special situations make you rich.**

Cash and ordinary trade sustain the run. Information improves decisions and timing. Relationships create credit, access and recovery paths. Exceptional wealth belongs to scarce situations that require the earlier layers rather than replacing them.

Experienced business / market players should sometimes think:

> “I know what kind of problem this is.”

A beginner should be able to learn the same idea by playing rather than by taking a quiz.

---

## 2. Core Economic Primitives

The game should keep returning to six primitives:

1. **Goods**
2. **Cash** — sardine tins `🥫`
3. **Information**
4. **Obligations**
5. **Relationships**
6. **Time**

Examples:

- a loan is cash now plus an obligation later;
- trade credit is goods now plus an obligation later;
- information brokerage is information exchanged for cash / favour / access;
- a proxy converts relationship + fee / obligation into institutional access;
- a deadline turns time into bargaining power;
- a gift can convert a good into relationship capital rather than market revenue.

Prefer combinations of these primitives over bespoke minigames.

### Six economic return classes — FROZEN analytic / diagnostic grammar

These classify **how money is earned**, not skills, professions or character classes. They can later support event tags, P&L decomposition, case/tutorial coverage and trading-style diagnosis; that tooling is not claimed implemented.

| Class | Source of return | Accounting / examples |
|---|---|---|
| **Trade** | location, time or counterparty valuation spread | proceeds − acquisition − transport/carry/spoilage/fees; ordinary arbitrage |
| **Operate** | transforming inputs, labour, time and capacity into paid goods/services | Joel Bar, Wong services, Aspen logistics; real buyers and operating costs |
| **Invest** | holding productive capital for future output / operating value | Juan maturity, equipment, ownership/profit share; future pooled projects remain Deferred |
| **Finance** | supplying capital, time, liquidity or risk-bearing | lending, trade finance, claims; return net of default loss, funding cost and time locked |
| **Intermediate** | reducing search, access, trust, enforcement, settlement or privacy friction | Octopus clearing, Dima brokerage/guarantees, Wong matching |
| **Speculate** | future price movement rather than productive cashflow or service margin | auction resale, thin speculative assets, wagers/race positions |

Arbitrage is a form of **Trade**. Hedge/insurance changes risk distribution; fraud/manipulation is a behavioural method; neither is a seventh class. Entrepreneurship can combine Operate + Invest + Finance. Consumption/gifts are utility use or sinks, not an investment class. Mixed activities may earn several kinds of return; separate their causes rather than counting the same profit twice.

---

## 3. Current Player Mystery — Seed / Home

The strongest current protagonist direction supersedes the old “employer sent an acquisition agent” premise.

The player is, at a deeper level, **a sunflower seed**.

Do **not** reveal this literally at the opening.

The player begins with only a primitive conviction:

> 🌻 **You want a sunflower.**
>
> You do not know why.
>
> You only know that it feels like a way home.

The desired sunflower is therefore not simply a rare commodity. It is the concrete object around which the player organises an impossible desire for origin / return / wholeness.

Important guardrail:

- the sunflower is **not literally “Mother”**;
- the core game should never explain the psychoanalytic interpretation in exposition;
- the structure should be playable without knowing Lacan, Buddhism or any philosophy.

The crucial first reveal is:

1. objective: **Get a sunflower**;
2. player finally acquires one;
3. `You got it.`;
4. nothing metaphysical happens;
5. the flower sits in inventory, **unpriced**;
6. objective changes to **Go home**;
7. the market and life continue.

This is recorded in the dated prototype verification; this document pass does not re-verify runtime.

The seed’s only biological direction is ultimately not “return into the flower” but **germination / becoming**. This imagery does not authorise player transformation or playable Plant mechanics.

---

## 4. Prototype history — not a gameplay contract

Morning/Afternoon pools, 2 actions, mandatory daily Noon, 3 orders/trades, 14 days and NPC-card Talk/Investigate were prototype scaffolding. Detailed old contracts remain in Git history and dated verification. §5 supersedes them; do not build the new flow around those constants.

## 5. Frozen Gameplay Constitution v1

**FROZEN product constraints, 2026-09-07.** This section owns the gameplay constitution. It specifies required experience and causality, not completed implementation, code architecture or balancing constants. It supersedes conflicting prototype UI/phase prescriptions elsewhere; other sections and documents supply detail only within this boundary.

1. **Objective and experience.** Find a Sunflower inside a small, continuously operating harbour economy using goods, cash, information, obligations, relationships and scarce time. Acquisition produces `You got it.`, no automatic supernatural salvation, and the new objective `Go home`; the world continues.
2. **Workbench home.** Newspaper, Phone, Ledger/Notebook, Inventory/Assets, Finance and Reputation/Relationships remain accessible. Reading, reviewing records and inspecting known opportunities cost no action and do not advance the world when switching surfaces. Accessible does not mean displaying everything simultaneously.
3. **Continuous attention/time pays for intervention.** Explore through locations; follow known events directly into their actual place or communication scene. Seeking new information, investigation, appointments, labour, negotiation and performance use scarce time/attention. Before commitment, show known costs, deadlines and binding effects. Budget and clock units remain Open. Repeated navigation, exhausted dialogue and mandatory phase-by-phase clicking must not manufacture choice.
4. **Places contain ongoing life.** Dock, Bar, Nursery, Wong's counter/parcel station and viewing/auction scenes contain relevant people, goods, activities and change. Work and obligations determine NPC location and availability. A player's first in-person meeting and conversation establishes acquaintance before adding that person's contact. Phone supports enquiries, quotes, appointments and incoming messages; it does not bypass physical inspection, transport or performance.
5. **Information supports inference, not omniscience.** Newspaper reports weather, shipping, social and public events, never guaranteed-profit instructions. Phone carries sourced, dated private claims that may be mistaken or deceptive. Local scenes expose observable facts; Notebook preserves acquired evidence. Player and NPCs use only legitimately acquired information. Public availability is not automatic attention or correct interpretation; private is not synonymous with true.
6. **NPCs keep living.** Consumption, production, maintenance, deadlines, households, relationships and business recreate needs after initial wants are satisfied. NPC choices follow their own knowledge, resources, character, obligations and opportunity costs, not random action selection. Randomness belongs to world conditions; identical conditions and beliefs must produce reproducible choices. Players can infer tendencies and causes without reading hidden plans.
7. **Trade is multi-directional and situated.** Players can initiate purchases, sales, offers and negotiation as well as respond. Public and private trade, operations, services and contracts cannot all be collapsed into one all-NPC barter-order pool. Distinguish quote, acceptance, resource lock, delivery and settlement; immediacy follows the actual transaction, not a universal submit-later ritual.
8. **Six return classes are analysis.** TRADE / OPERATE / INVEST / FINANCE / INTERMEDIATE / SPECULATE explain sources of return, not six professions or main-menu buttons. Players inspect a lime crate, supply the Bar, finance growing plants or arrange delivery. Mixed returns must not double-count profit; §2 owns the definitions.
9. **Economy has sources, uses and renewed needs.** Procurement feeds consumption, service or production and subsequent demand. Bar revenue needs actual customers, inputs and finite capacity; finance needs an underlying purpose, payer and loss bearer. Anonymous households, crews, visitors and suppliers repeatedly trade without requiring named-character depth. External arrivals, receipts and spending need bounded causes; no unlimited stock, unaccounted cash creation or guaranteed-margin fallback.
10. **Octopus is an institution.** Octopus Clearing provides clearing, payment and local market data; it is not an ordinary NPC, contact, relationship or Talk target. Any retained marine principal/business model belongs to a separate goods owner, not the institution. Anonymous marine supply is also distinct. Client float is not merchant wealth. Public records are neither general news nor private motives.
11. **Consequences and reputation are specific.** Distinguish cash, receivables, payables, locked funds, collateral and future obligations. Payment reliability, delivery reliability, representation integrity and personal relationships cannot collapse into one universal reputation number. Explain failure using causes the player may know, without leaking private valuations.
12. **Protect routes and resilience.** Keep Sonya/Grandma Supper as relationship/social allocation, Yasmin/Auction as capital/access, and Juan/Cliff as preparation/risk. The Onewheel assembly/repair challenge is protected; exact recipe and repair/workshop provider are OPEN, and Aspen is not assigned that role. Aspen's Limes chain is provisioning → inspection → short shipment/quantity/quality → representation → consequence, without a fixed scurvy rationale; Bad Tangerine is retired as a good. With any one primary economic actor absent, at least one legal Sunflower acquisition route must remain. Alternatives need discoverable world paths and real costs. This is ordinary economic resilience, not disappearance through alternate forms.

**Freeze boundary.** Sun Moment is protected. Specific time budget, clearing cadence, run length, Onewheel exact recipe, repair/workshop provider, future borrowed-time/time-debt mechanics, final item counts, prices and balance are **OPEN**. Rebirth/reincarnation, automatic Human↔Animal↔Plant transitions, former-life/estate gameplay and alternate-form disappearance are **RETIRED**, not Open or Deferred.

**Product acceptance.** Players can acquire a lead at the workbench, infer, choose an intervention and observe consequences. The world acts intelligibly without player intervention; buying and selling can both be initiated; missed opportunities follow real constraints; NPCs are not omniscient. Bar operations, anonymous repeat trade and Octopus must work through visible playable flows. Economic simulation results cannot substitute for these checks.

---

## 6. Scene Intent — Conversation and Investigation

These describe different scene purposes, not an NPC-card Talk/Investigate UI or mandatory repeated clicks. §5 owns interaction and continuous attention/time.

### Conversation
Purpose: relationship and character knowledge.

Talk should:

- feel like a small scene, not `relationship +1`;
- gradually change how an NPC treats the player;
- reveal personality, social context and sometimes voluntarily shared leads;
- make future credit / access / disclosure possible.

The internal relationship number is hidden behind qualitative language such as:

- stranger;
- recognises you;
- familiar;
- knows you well.

### Investigate
Purpose: market intelligence.

Investigate should:

- reveal activity, pressure, category clues, deadlines or hidden holdings;
- not automatically make the target like the player;
- use staged precision rather than immediately naming the answer.

Example — Joel / Mai Tai:

1. “Joel is learning a Mai Tai; one ingredient is missing.”
2. “Rum, lime and orange curaçao are already behind the bar.”
3. only later: exact Orgeat confirmation.

A player who knows bartending can infer Orgeat earlier and save time.

**Expertise buys time, not permission to play.**

---

## 7. Information Constitution

**Frozen information-surface direction under §5; detailed timing remains Open: three layers**, detailed in `INFORMATION_DISCOVERY_MODEL.md`:

| Surface | Reach and timing | Content |
|---|---|---|
| Newspaper | broad, public, slower and delayed | general world/social news: weather, harbour, shipping, culture, accidents, notices and classifieds |
| Phone | fast, narrow, private, timely | messages, quotes, relationship changes, uncertain leads, order/project updates and urgent failures |
| Local / market / scene | immediate and actionable | visible people, goods, offers, opportunity panels and Octopus orders, prices, completed trades and settlement records |

The newspaper reports social facts, not trading instructions: “Thunderstorms expected east of the cape” can mean route delays to Aspen, visitor changes to Joel and spoilage exposure to a cargo holder. Octopus market data is not the world's general news medium.

**Private edge → public disclosure → alpha decay.** News can follow a private message; once others learn the fact, competition can reduce the earlier advantage. Private does not mean true or profitable. Information value includes verification, delay, risk and the opportunity cost of attention.

**Nonrandom does not mean omniscient.** Engine truth and actor belief remain separate. Actors use their own observations, legitimate public information, acquired leads, plausible contacts and bounded search; they cannot scan true inventories. Claims retain source, provenance, credibility/confidence, motive, precision, observation time and freshness. Precision is specificity, not reliability. A rational order based on once-correct information may fail after ownership changes.

---

## 8. Current NPC Economic Identities

Six named people operate inside a larger population; they are not six professions for the player to select.

| Actor | Current identity / economic direction | Constraint |
|---|---|---|
| Aspen | Japanese lesbian woman; reliable, strict logistics / contract operator | route reach, cargo, provisioning, time, weather, working capital, dated obligations and real BATNA; not primarily speculation |
| Joel | Bar operator / apprentice; working capital, inventory, customer demand, tabs and menu production | complementary inputs, capacity, cash and relationships; existing Bar scope remains |
| Yasmin | family capital; **strong candidate** private capital allocator / family-office or merchant-bank-like principal | collateral, provenance, recovery, access and social maintenance; not the public exchange |
| Wong | frugal household enterprise; low-margin turnover, salvage, resale and small services | recurring household/rescue burn and limited liquidity; Dog presentation, final species **Open** |
| Juan | botanist / grower / nursery; productive biological capital and future output | asset-rich/cash-poor maturity mismatch, alongside intentional impulsive drinking, wagers and risky commitments |
| Dima | Seagull informal broker: proxy, guarantees, access, claim transfer, settlement and enforcement | trust/network limits; **strong candidate** costly distressed workout, never a free bailout |

Sonya is Joel's Penguin grandmother and a supporting social/household Sunflower route, not a seventh economic archetype. Octopus is public clearing, payment and price discovery; client float, separate merchant stock and background marine supply remain separate; Octopus has no ordinary NPC/Talk identity. Detailed identity, speech and recurring loops belong in `NPC_CHARACTER_BIBLE.md`.

### Player role — frozen attention / visibility direction

The player's distinctive asset is **attention + cross-domain visibility**: see Aspen's deadline, Joel's cash need, Juan's maturity, Wong's clearance, Yasmin's event and Dima's private opportunity, but act on only a few. There is no permanent profession choice or universal mastery.

Bounded bartending, sourcing, repair, inspection, ordinary trade, claims and basic financing may be learnable through real prerequisites. This does not grant Joel's customer network, Yasmin's capital, Dima's trust network, Aspen's route expertise, Wong's throughput, Juan's botanical skill or Octopus's institution. The motive stays **get a Sunflower / go home**; business takeover remains Open/Deferred.

---

## 9. Goods and Value

The catalogue is intentionally strange but should not be filler.

`ITEM_ECONOMY.md` owns the rebuilt catalogue and exposure levels. Old runtime item counts are not content targets; expose only goods that earn player attention.

Requested core texture includes:

- chia seeds;
- octopus tentacles;
- glasses wipe;
- bicycle parts / tools;
- real professional bartending tools and ingredients;
- harbour commodities;
- provenance-heavy collectibles;
- sentimental fragments;
- speculative junk.

A good earns its place by doing at least one useful job:

- recurring consumption;
- production input;
- perishability;
- collateral / durability;
- access / identity;
- information-bearing object;
- private / sentimental value;
- speculation;
- competing demand;
- route / relationship significance.

There are **no invisible designer-only substitutes**.

If alternatives exist, the category or substitution must be legible through the world, expertise or information.

All numeric item values are **reference prices**, not metaphysical true values.

The living Sunflower has no universal reference price.

See `ITEM_ECONOMY.md`.

---

## 10. Recurring Economy

The market should not finish its quests and then freeze.

Named characters are economic organs inside a larger harbour economy. Anonymous households, crews, small boats, visitors and small sellers/buyers are economically necessary but do not need character bibles.

Prefer:

> **Need → local demand → trade if feasible → consumption / use / production / social use → sink or transformation → outside fallback only when local supply cannot satisfy it.**

Recurring gain or cost needs a balance-sheet path: who paid, why, what was supplied or used, and where capital, labour, inventory, information or risk came from. Finance should serve real consumption, production or projects rather than become a self-contained claim economy with no final user.

Examples:

- Wong's household and rescue needs create actual food / household demand before an outside fallback;
- marine suppliers pay sourcing costs, receive finite catch and sell to local or outside customers;
- Joel's Bar earns only from actual customers, complementary inputs and finite service capacity;
- Aspen pays import / sourcing costs before departure;
- wages paid to crews/workers enter background purchasing power unless explicitly accounted as an external drain;
- named actors still trade with one another when their beliefs and utilities justify it.

### Economic guardrails — current design

- Repeated profitable flips must deplete supply, saturate demand, move prices or attract competition; no infinite same-place spread or exploitable guaranteed price floor/cap.
- Restock requires production, arrival, harvest, finite resale/supply or transformation. Prefer a few bridge goods over dead SKU volume.
- Growth requires buyers, capacity, working capital, labour, supply and competition. Wealth still faces attention, liquidity, locked capital, market impact and allocation choices.
- Race/gambling/speculation/investment must not dominate the core economy. Insider tips are uncertain; relationships must causally change information, credit, access, terms or reliability.
- Large positions must affect price, execution and counterparties. Do not force unrelated minigames to unlock character growth.
- Progress comes from knowledge, assets, relationships, reach, productive capacity and new causal opportunities, not skill-tree inflation or arbitrary unlocks.

`DESIGN_WORKBOOK.md` Chapter 13 owns diagnostic warnings; numerical tests are evidence, not automatic rebalancing instructions.

This is deliberately small.

Keep the background economy bounded and legible; named arrivals, consumption, production and outside customers are enough for the current prototype.

The purpose is simply to make money and goods have **sources and sinks** so a no-action run does not look like arbitrary wealth teleportation.

---

## 11. Historical execution reference

The prototype batched orders at Noon. Its old priority/resource rules are dated evidence in `CODEX_VERIFICATION.md`, not a universal player-facing trade path. Future settlement must explain commitment, resource locks, delivery and outcomes under §5.

## 12. Retired former-life gameplay

Reincarnation, automatic form changes, estate/current-body asset separation and form-based proxy access are retired. Their implementation residues belong in migration debt, not future design requirements.



## 13. Sun Moment

The current metaphysical source of truth is `WORLD_CANON.md`.

Core principles:

- Sun Moment is a real organism-level disengagement, not a state-imposed ritual;
- living beings briefly stop separate goal pursuit;
- resisting can create genuine economic advantage;
- repeated attachment can make stopping harder;
- attachment is not identical to greed or desire;
- love, responsibility, freedom-seeking and enlightenment-seeking can also bind;
- karma is better understood as action that has not finished happening;
- no visible `ENTANGLEMENT 73/100` meter.

The natural Sun Moment remains canon. Refuse-to-stop, borrowed time and time debt may be researched later; they do not imply embodiment transitions or reincarnation. No such future mechanism is frozen here.

---

## 14. Current Sunflower Routes

Routes should remain discoveries, not a visible quest checklist.

### Sonya / Grandma Supper — People / non-market allocation
Joel's hospitality, family connection and fresh-fish pattern can lead to an after-closing meal and a sunflower changing hands outside ordinary pricing. Mai Tai / Orgeat remains an authored benchmark, not the whole Bar economy.

### Yasmin / Auction — Capital / private market
Capital, provenance and formal access can lead to a private allocation event. **Strong candidate:** an antique vessel / pot with an incidental Sunflower; rivals value the vessel while the player values the flower. Exact Auction v2 internals remain **Open**.

### Juan / Cliff — Risk / boundary
Juan knows or can lead to a Sunflower field. Preparing an Onewheel by assembly/repair is protected; exact recipe and repair/workshop provider remain **OPEN**; Aspen is not the frozen repair provider. Drink, mobility and relationship details include historical prototype triggers, not immutable item dependencies.

Multiple currently real opportunities may coexist. The engine should not hide all but one because of arbitrary route priority.

Routes are resilient chains rather than single missable trades:

> **signal → contest → outcome → aftermath → second-order opportunity**

Missing an arbitrage can close that trade without deleting the surrounding story. If Yasmin independently buys Whale Oil, the player may lose the oil spread while the public transaction, completed screening, investigation, access, provenance, capital and later auction still provide entry points. Strong NPCs remain capable; onboarding must not require making them artificially stupid.

None of these routes is the final victory anymore. They all feed the same first reveal:

> **You got a sunflower. Nothing happens. Go home.**

---

## 15. Learning Design

Terminology should usually come **after experience**.

The preferred first-life rhythm is approximate rather than scripted:

- **Day 1 — execution:** make or decline a concrete commitment;
- **Day 2 — observation:** see market and world consequences;
- **Day 3+ — inference / exploitation:** connect evidence to a new opportunity.

The game does not say:

> “Today’s lesson is liquidity.”

It gives the player a tempting opportunity while their cash is tied up, then later may name the concept.

Outcome and process are separate.

A profitable reckless action is still profitable.
It can also have been a poor decision process.

Knowledge and assessment are core deliverables:

> **PLAY → WORLD CONSEQUENCE → optional `?` CONCEPT DISCOVERY → distinctive BADGE / CASE → persistent NOTEBOOK → FINAL DIAGNOSIS**

`?` is a timely optional explanation after the relevant consequence, never a pre-emptive answer. A badge records a distinctive realised story or pattern and is not automatically praise. The notebook keeps situations, concepts and evidence across the run. Final diagnosis synthesises that record; it must not be the player's first encounter with the ideas.

Final trader archetypes / badges should diagnose behaviour rather than moralise. Valuation, liquidity, information discipline, relationship investment, risk appetite, credit discipline, integrity and adaptability are candidate axes, not a frozen player-facing radar. **Outcome != Style:** either high- or low-risk play can succeed or fail, acquire or miss the flower. Describe how choices were made, not merely final wealth.

`SCENARIOS_TEACHING.md` defines implementation and coverage targets. Its exact scenes need not all become rigid quests, but their meaningful economic behaviours must become mechanically representable, observable, diagnosable and capable of timely learning feedback.

---

## 16. What Is Deliberately Deferred

### Implementation rule

- Implement a sufficiently specified, non-superseded mechanic only within an explicitly authorised implementation task. This documentation task authorises none.
- A genuine unresolved design or canon choice should be resolved or prototyped before coding.
- Complexity alone is not a reason to defer settled design.
- Final visual polish remains later.
- Large test or CI architecture is unnecessary unless a real need appears.

The following remain deliberately deferred because their design is unresolved or outside the current slice:

- full conversational negotiation / counteroffer tree;
- generic contract editor;
- broad lending / collateral markets;
- full black-market venue;
- authority / inspector system;
- multiple currencies / FX;
- business ownership / player takeover, public companies and IPOs;
- pooled shipment / project investment (**Deferred/Open**);
- Sun Moment resistance gameplay;
- seeded deterministic replay architecture;
- large automated test suite / CI.
- final visual UI / art pass and final archetype presentation.

These remain strong future directions where supported by the specialised design docs.

---

## 17. Next Implementation Acceptance Boundary

`§5` owns the frozen product acceptance criteria. The incumbent runtime is an economic test harness and migration source, not the approved player-facing foundation. This does not require deleting useful settlement, inventory, knowledge or obligation logic.

A later explicitly authorised engineering task must map reusable mechanisms and missing playable paths before choosing its smallest coherent slice. Validate the workbench → lead → situated intervention → visible economic consequence flow, together with NPC autonomy and repeat demand. Do not require a mandatory Noon click or an NPC-card carousel merely because the prototype has one.

No gameplay implementation is authorised by this documentation pass. Do not resolve Open time parameters or restore retired canon in code. Historical checks in `CODEX_VERIFICATION.md` retain their dated scope and cannot establish acceptance of the new constitution.
