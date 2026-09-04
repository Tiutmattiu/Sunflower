# Sunflower — Player Assessment Audit v1

> **Working design audit, September 2026.**
>
> This is not a new runtime subsystem and not a request for a second scoring engine.
> It is intended to be folded into `SCENARIOS_TEACHING.md` / existing diagnosis documentation after the current implementation batch stabilises.
>
> Source principle:
>
> **Outcome != Process != Style.**
>
> The engine may record facts. Diagnosis may infer only what those facts support. No evidence is not average performance.

---

# 1. Why the old counter approach is insufficient

Current convenience counters are useful for smoke tests and factual recap, but many are unsafe as direct player attributes.

| Current counter / fact | Safe use | Unsafe inference |
|---|---|---|
| `profitableFlips` | realised positive reference-PnL events | `good valuation` |
| `overpays` | player paid materially above current reference accounting | `bad trader`, `irrational` |
| `totalProfit` | realised reference accounting outcome | skill, welfare, private value |
| `tradeCount` | market activity | expertise or quality |
| `cheats` | count of specifically represented deceptive cases | global honesty / morality |
| `informationSales` | information monetisation activity | information skill |
| `creditUsed` | credit exposure / financing style | poor liquidity discipline |
| `defaults` | realised missed obligations | bad process in every case |
| `proxyUses` | institutional-navigation behaviour | dependency / incompetence |
| `lives` | factual form/life outcome | spiritual failure / progress |
| `gifts` | goods allocated outside spot sale | generosity / goodness |
| `informationFavours` | information allocated as favour | altruism / relationship skill |
| `inboundTrades` | fills initiated by counterparties | passive or active style by itself |
| relationship level | accumulated relationship state | healthy relationship / social skill |
| Talk count | time spent on a person | love, empathy, charisma |
| unused actions | non-use of time resource | laziness / poor optimisation |

Especially dangerous:

## `overpays`

Reference price is not metaphysical true value.

A player can knowingly pay above reference because:

- the item has private utility;
- the item opens a route;
- provenance is worth more to a specific counterparty;
- the player is buying time;
- the player is preserving a relationship;
- the player is preventing a worse loss;
- the player is intentionally taking a high-variance position.

Therefore `overpay` is an accounting description, not a judgement of valuation skill.

## `profitableFlips`

Profit is outcome.

A player can profit from:

- excellent information;
- correct inference;
- reckless concentration;
- luck;
- an NPC mistake;
- an event that moved after commitment.

Do not back-fill sound reasoning from profit.

## `defaults`

Default is a real consequence and strong evidence about reliability, but process still depends on context.

A deliberate strategic default may be:

- economically rational;
- harmful to a counterparty;
- good capital allocation;
- terrible relationship management;
- all of these simultaneously.

Diagnosis must be multidimensional enough to say that.

---

# 2. Assessment has three separate layers

## 2.1 Outcome — what actually happened

Outcome contains factual end states and realised consequences.

Examples:

- Sunflower acquired: yes/no;
- day / life / form when acquired;
- ending cash;
- ending reference inventory value;
- ending reference net worth;
- realised trade PnL accounting;
- defaults / seizures / successful obligations;
- relationships that actually changed;
- routes / special situations actually completed;
- lives / form transitions;
- realised badges / market scars;
- survival / recoverability events;
- total public/private market participation.

Outcome can be reported even with very little behavioural evidence.

It must not be relabelled as skill.

## 2.2 Process / Skill — how decisions were made under information available then

Process requires commitment-time evidence.

The core question is not:

> `Did this make money?`

It is:

> `Given what the player could know and control at commitment, what kind of decision process is evidenced?`

Candidate process dimensions are below.

## 2.3 Style — recurring preference / allocation pattern

Style is descriptive, not evaluative.

Examples:

- prefers liquid cash versus invested inventory;
- public versus private channels;
- goods versus information versus claims;
- concentrated versus diversified exposure;
- short versus long horizon;
- relationship-heavy versus transaction-heavy use of time;
- formal versus informal institutional routes;
- exploration versus repeated exploitation;
- early commitment versus waiting for more certainty.

Style must not be called skill.

A conservative player can be excellent or poor.
A high-risk player can be excellent or poor.
A relationship-heavy player can be excellent or poor.

---

# 3. Process / Skill dimensions — audited draft

These are not final UI scores. They are evidence families.

## 3.1 Execution & settlement discipline

What it asks:

> Does the player understand what becomes binding, what resources are actually available at settlement, and why an order did or did not fill?

Useful evidence:

- funded versus unfunded commitment;
- repeated opening-resource conflicts;
- stale-holding attempts after information aged;
- adjustment after an execution failure;
- use of public ask versus invented price;
- successful fulfilment of locked future delivery;
- avoiding accidental double-use of the same barter/cash resource.

Positive-looking outcome is not required.

One rejected order is not enough to label weak execution.

## 3.2 Evidence-sensitive valuation

Avoid the phrase `valuation skill` if the engine cannot observe subjective private value.

What can be assessed more safely:

> Does the player change price/terms in response to relevant discoverable evidence?

Useful evidence:

- provenance changes price paid/asked;
- verified information changes commitment;
- competition / tape causes bid revision;
- deterioration / perishability changes willingness to hold;
- collateral haircut is understood as a financing constraint;
- player declines a trade whose known terms dominate visible alternatives;
- player pays a premium where there is a traceable time/access/private-route benefit.

Forbidden inference:

> `Paid above reference, therefore bad valuation.`

## 3.3 Liquidity management

What it asks:

> Can the player preserve or create enough near-term payment capacity for obligations and opportunities?

Useful evidence:

- cash before a known due obligation;
- visible recovery routes when cash falls to 0–3;
- use of secured/relationship credit;
- forced sale versus planned liquidation;
- bridge financing;
- maintaining several commitments with enough opening resources;
- default caused by avoidable maturity mismatch;
- survival through a liquidity squeeze without destroying most long-term value.

Distinguish liquidity from solvency.

## 3.4 Obligation / credit discipline

What it asks:

> How does the player create, manage, renegotiate, fulfil or default on claims through time?

Useful evidence:

- future-delivery fulfilment;
- repayment timing;
- collateral seizure;
- deliberate versus accidental default where the decision record supports the distinction;
- overlapping maturities;
- relationship credit followed by repayment;
- taking credit with or without a plausible repayment source.

Do not turn `never borrowed` into excellent credit skill.

It is insufficient evidence.

## 3.5 Information practice

What it asks:

> How does the player obtain, verify, preserve, monetise and act on information under uncertainty?

Useful evidence:

- Talk versus Investigate allocation;
- personal verification;
- source confidence / precision;
- acting on stale versus current information;
- selling an edge versus preserving exclusivity;
- leak / breach / detection;
- buyer use of sold information;
- inference from public tape;
- acting before exact confirmation when broad evidence was sufficient.

Do not reward investigation count by itself.

Research can be wasteful.

## 3.6 Sourcing / operational planning

What it asks:

> Can the player connect a future commitment to a physically plausible source and timing chain?

Useful evidence:

- sold-before-owned contract;
- underlying availability at commitment;
- time to due date;
- perishability / physical age;
- route/source diversification;
- sourcing after one source disappears;
- production input completeness;
- physical item actually transferred rather than bookkeeping shortcut.

This dimension becomes especially important once Juan's biological assets exist.

## 3.7 Position sizing / exposure control

What it asks:

> How much of the player's available economic capacity is committed to one uncertain outcome?

Useful evidence:

- cash commitment ratio at opening;
- inventory concentration;
- collateral concentration;
- debt relative to liquid resources;
- repeated all-in exposure;
- diversified versus concentrated claims;
- whether failure of one event makes ordinary survival impossible.

This is process.

Risk appetite itself belongs under Style.

## 3.8 Adaptability

What it asks:

> Does the player update after new evidence, failed execution, changed access or changed form?

Useful evidence:

- source change after stale inventory;
- price/term change after public tape;
- switching from public to private route when formal access changes;
- switching financing method after collateral/credit availability changes;
- continuing the exact same failed action without new evidence;
- exploiting a second-order opportunity after missing the first trade.

Adaptability should require sequence evidence, not one isolated action.

## 3.9 Institutional navigation

What it asks:

> Can the player distinguish what can be done through formal, informal and proxy systems under their current form / identity?

Useful evidence:

- proxy use when direct formal access is unavailable;
- paying Dima / other broker only when needed;
- use of formal collateral when legal identity permits;
- recognising when a claim is enforceable against property but not the new legal person;
- moving between venue types without engine-omniscient shortcuts.

No moral preference for formal or informal channels.

## 3.10 Relationship-capital stewardship

This is intentionally narrow.

Do not score `likability`.

What can be assessed:

> Does the player understand that relationships can create access, credit, recovery and information, and that using them creates history?

Useful evidence:

- relationship credit used and repaid;
- favour later producing access;
- repeated extraction without reciprocity where the world records a consequence;
- choosing to preserve a counterparty relationship at an observable economic cost;
- relationship-based recovery from low liquidity;
- default consequences differing by counterparty.

Time spent talking is Style evidence, not relationship skill by itself.

## 3.11 Negotiation / term construction

Keep as provisional until enough real negotiation exists.

Useful future evidence:

- anchor response;
- walk-away behaviour;
- BATNA use;
- cash versus barter package;
- collateral / maturity / exclusivity terms;
- accepting worse headline price for better risk terms.

Do not score this from one fixed-price click.

## 3.12 Special-situation reasoning

What it asks:

> Can the player identify and structure around rare path-dependent opportunities without reducing the game to event hunting?

Useful evidence:

- event interpretation;
- second-order effects;
- financing one-off opportunity;
- distinction between public price and private/catalyst value;
- aftermath trade;
- auction / shock / route decisions when implemented.

Special-situation profit alone is Outcome.

---

# 4. Style axes — descriptive only

Style should be inferred only from repeated allocation patterns.

Possible axes:

## 4.1 Time horizon

Immediate cash conversion ←→ delayed / future value

Evidence:

- inventory hold time;
- future contracts;
- maturity choice;
- willingness to wait;
- debt maturity choice.

## 4.2 Risk exposure

Low-variance / protected ←→ high-variance / convex

Evidence:

- secured versus unsecured exposure;
- concentration;
- cliff / event positions;
- uncertain sourcing;
- repeated downside tolerance.

Do not call one side better.

## 4.3 Liquidity preference

Cash-heavy ←→ invested / illiquid

Evidence:

- cash ratio across decisions;
- collateral use;
- held productive stock;
- receivables / claims.

## 4.4 Economic medium

Goods ←→ Information ←→ Claims / finance

A player can be mixed.

Do not force a single class label.

## 4.5 Social allocation

Transactional ←→ relationship-heavy

Evidence:

- action allocation;
- gifts/favours;
- private relationship credit;
- repeated non-transactional attention.

Never translate this into `romantic`.

## 4.6 Institutional style

Formal ←→ informal / proxy-heavy

Requires actual access opportunities.

## 4.7 Concentration

Concentrated positions / counterparties ←→ diversified

Can describe:

- goods;
- claims;
- counterparties;
- information buyers.

## 4.8 Exploration / exploitation

New people / new goods / new methods ←→ repeated known route

Important for replay diagnosis.

Repeated use of a good strategy is not automatically rigidity.

The question is whether the environment changed and whether alternatives were visible.

## 4.9 Commitment timing

Wait-for-certainty ←→ commit-before-control

Future delivery is strong evidence.

Neither is inherently better.

## 4.10 Attention concentration

Distributed attention ←→ repeated focus on one person / domain

This can support statements such as:

> `Across four mornings, most of your discretionary time went to Sterling.`

It cannot support:

> `You were in love with Sterling.`

---

# 5. Evidence sufficiency

A diagnosis should be built from **independent decision cases**, not raw click count.

## 5.1 What is an independent case?

Examples:

- one future-delivery contract from commitment through outcome;
- one liquidity squeeze;
- one information lead from acquisition through use/sale/expiry;
- one auction;
- one obligation maturity;
- one execution failure and later response;
- one access/form problem;
- one special situation.

Five clicks inside the same case are not five independent observations.

## 5.2 Provisional confidence rule

Working thresholds:

- **1 case** — anecdote only; can be shown as a story, not a trait;
- **2 independent cases** — emerging pattern;
- **3+ cases across at least 2 contexts** — supported pattern;
- **5+ cases across at least 3 contexts** — high-confidence pattern if evidence is not strongly contradictory.

These are design heuristics, not a visible XP system.

## 5.3 Contradiction is information

Do not average contradiction into beige.

Example:

> You preserved liquidity carefully in three ordinary trades, then went all-in at the Cliff.

That can mean:

- normally conservative, selectively extreme;
- context-sensitive risk taking;
- a change over time.

It should not become:

> `Risk score 50/100`.

---

# 6. Decision evidence schema — minimum semantics

The existing append-only `decisionEvidence` stream remains the right substrate.

A meaningful commitment should preserve enough to reconstruct what was knowable then.

Useful shared fields where relevant:

- `day`
- `phase`
- `type`
- `actor / counterparty`
- `channel`
- `openingCash`
- `openingInventory`
- `actionsBefore / actionsAfter`
- `relationshipBefore / relationshipAfter`
- `knownInformationIds`
- `publicTapeContextIds`
- `openObligationIds`
- `dueWithinN` or due dates when relevant
- `terms`
- `collateral`
- `underlyingOwnedAtCommitment`
- `outcome` recorded separately later

Important:

**Do not rewrite old commitment evidence after the outcome is known.**

Outcome links to commitment evidence by ID.

This preserves process/outcome separation.

---

# 7. Forbidden psychological inference

The final diagnosis must never claim as engine fact:

- love;
- attraction;
- grief;
- greed;
- fear;
- enlightenment;
- spiritual progress;
- selfishness;
- altruism;
- moral goodness;
- moral corruption;
- conscious motive;
- unconscious motive.

It may describe behaviour:

> `You spent 7 of 12 discretionary actions with Sterling.`

It may describe consequence:

> `Those actions displaced two visible market investigations.`

It may not define why.

---

# 8. Final diagnosis format — recommended

Avoid one dominant archetype label.

Prefer a factual dossier:

## WHAT HAPPENED

- acquired / did not acquire Sunflower;
- final economic state;
- major realised cases;
- market scars / badges.

## HOW YOU OPERATED

Only supported process findings, each linked to concrete cases.

Example:

> **Liquidity — supported evidence**
>
> Across three cash squeezes, you used secured borrowing once, relationship credit once, and sold inventory once. None became overdue.

or:

> **Execution — contradictory evidence**
>
> You adjusted after two stale-stock failures, but twice committed more opening cash than could settle simultaneously.

## YOUR MARKET STYLE

Descriptive axes only where supported.

Example:

> **Economic medium:** information-heavy.
>
> 5 of 8 monetised opportunities came from information rather than physical resale.

## INSUFFICIENT EVIDENCE

Explicitly list domains the run did not test.

Example:

> Negotiation — insufficient evidence.
>
> You did not encounter enough negotiable bilateral terms in this life.

This is more trustworthy than pretending every run reveals every attribute.

---

# 9. Badges / market scars versus diagnosis

Badges are realised cases.

They are not points and do not directly increase a trait.

Examples:

- `Sold It Before You Had It` proves one specific multi-event story occurred.
- `Exclusive` proves one useful exclusivity window was kept.
- `Fire Sale` proves a particular liquidity outcome.

A badge can become evidence for diagnosis only through the underlying linked evidence IDs.

The title itself is not the data.

---

# 10. Multi-life assessment

Because Sunflower is a rebirth game, one life and the player-across-lives record should remain distinct.

## Life diagnosis

What this legal/form life did.

## Cross-life record

Patterns repeated across forms / identities.

Cross-life assessment can ask:

- did a style persist after legal access changed?;
- did the player repeat the same liquidity problem in another medium?;
- did relationship attention persist when the NPC no longer recognised the player?;
- did the player adapt after losing formal ownership continuity?;
- did a karmic problem recur as goods, debt, information, then relationship?

Do not turn cross-life repetition into a visible `karma score`.

The evidence itself is enough.

---

# 11. Audit of current implementation priorities

Before final diagnosis is implemented, the engine still needs enough raw evidence for:

- Talk / Investigate allocation;
- unused action decisions;
- future-delivery commitment and outcome;
- relationship credit;
- secured borrowing / seizure;
- exclusivity breach truth and detection;
- later negotiation;
- auction bid context;
- future special situations;
- player-visible alternatives at commitment where feasible.

The current Codex batch is correctly asked to add factual evidence only.

Do not implement scores until Economic Health and more decision families exist.

A scoring system built now would mostly measure which prototype buttons happened to exist.

---

# 12. Assessment gate

Do not freeze final player attributes until the game has at least:

1. public execution;
2. information acquisition/use;
3. future delivery;
4. relationship credit;
5. secured finance;
6. exclusivity;
7. one meaningful auction;
8. one event / special-situation family;
9. one institutional/form-access problem;
10. enough recurring economy that `do nothing` and one repetitive route are not accidentally dominant.

Only then run evidence coverage against several play styles and decide which dimensions the game can honestly diagnose.
