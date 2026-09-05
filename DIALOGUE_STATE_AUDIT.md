# Sunflower — Dialogue / State Audit v1

> **Status: active editorial audit, September 2026.**
>
> Companion to `DIALOGUE_MONTAGE_BANK.md`, `NPC_CHARACTER_BIBLE.md`, `DESIGN_WORKBOOK.md`, `INFORMATION_DISCOVERY_MODEL.md`, `REBIRTH_FORM_SYSTEM.md`, and `WORLD_CANON.md`.
>
> This file does not add a second narrative canon. It records which authored scenelets are already strong, which require state guards, which should be rewritten, and which must wait for unresolved mechanics or cosmology.
>
> The goal is not more dialogue. The goal is **less generic dialogue, less omniscience, fewer author punchlines, stronger character separation, and a direct relationship between prose and world state.**

---

# 1. Audit verdict

`DIALOGUE_MONTAGE_BANK.md` currently contains 134 authored scenelets across:

- six main characters;
- pair scenes;
- Bar ensembles;
- attention / intimacy scenes;
- cross-life scenes;
- Sonya supporting scenes;
- market/document montages;
- Sun Moment variants;
- post-Sunflower reactions.

The quantity is already sufficient for a first substantial narrative layer.

The main problem is not lack of content.

The main problems are:

1. several lines sound like an author demonstrating the character's concept rather than a person speaking;
2. too many characters use the same compact deadpan reversal rhythm;
3. some scenes assume the player speaks fluent local language despite the communication barrier;
4. some scenes expose information without establishing how the player or NPC learned it;
5. some cross-life scenes accidentally imply automatic soul recognition;
6. some ensemble scenes read like six finance archetypes taking turns delivering one-liners;
7. some author notes are embedded inside the scene as though they were player-facing prose;
8. a small number of scenes accidentally lock still-unresolved mechanics or legal wording;
9. a few scenes are simply arithmetically or economically wrong.

The first editorial priority is therefore:

> **state correctness → voice separation → remove writerly explanation → preserve only the strongest dry cuts.**

---

# 2. Scene selection contract

Do not implement a large dialogue DSL.

Every authored scene only needs enough metadata to answer six questions:

1. **WHEN** — phase / day-state / recurrence stage.
2. **WHO IS PRESENT** — do not teleport Dima, Yasmin, Aspen, etc. into a scene for a punchline.
3. **WHAT HAPPENED** — concrete state or evidence that justifies the scene.
4. **WHO KNOWS IT** — actor knowledge path.
5. **WHAT MUST NOT ALREADY HAVE HAPPENED** — route/reveal exclusions.
6. **WHAT THE SCENE COSTS** — no action, or one real Talk/private action where relevant.

A compact implementation shape later can be conceptually equivalent to:

```text
id
requiresState
requiresPresence
requiresKnowledge
forbidsState
recurrenceGroup
costsAction
```

This is an implementation aid, not a second engine.

The authoritative facts remain in existing market, relationship, obligation, evidence, form, and knowledge state.

## 2.1 Knowledge rule

A scene cannot make an NPC know something merely because the author wants the contrast.

Examples:

- Yasmin may mention Wong's report about the player's cut only if Wong actually observed it and told her through a plausible social path.
- Dima may say `I know` about a missed informal payment only if he brokered the arrangement, owns the claim, was told, or observed evidence.
- Joel does not know Juan's hidden creditor stack merely because Juan drinks at the Bar.
- Wong does not know Yasmin family decisions without gossip or a source.
- Aspen does not produce an exact weather forecast without having checked a forecast source.
- Juan does not know metaphysical truth because he is Juan.

## 2.2 Player communication rule

The current information model says the player understands some local speech/signals but cannot simply conduct unlimited fluent conversation.

Therefore, in `DIALOGUE_MONTAGE_BANK.md`:

> **unlabelled full-sentence player dialogue is an intent placeholder, not canonical spoken dialogue.**

At runtime, player communication should usually be rendered through:

- pointing;
- nodding / shaking head;
- numbers;
- writing;
- selecting a short structured intent;
- translation / proxy where available;
- a very short learned local phrase where specifically justified.

Do not silently make the player eloquent because a scene reads better that way.

## 2.3 Author note rule

The following belong in metadata / editorial notes, never inside player-facing prose:

- `No transaction is created.`
- `No relationship label appears.`
- `Nothing unlocks.`
- `That is his entire first reaction.`
- `The game does not say why.`
- `Both statements are defensible.`
- `The player may or may not know the private note.`
- `You have no answer option that defines the feeling.`

The absence of a UI event should be implemented, not narrated.

---

# 3. Voice separation pass

The current bank is strongest when characters differ in **attention**, not merely opinions.

## Aspen

Primary speech engine:

> quantity → time → condition → exception.

Aspen should sound exact even when she is being personal.

She may be terse, but she should not become a deadpan joke machine.

Good recurring materials:

- actual clock time;
- tide / pressure / temperature;
- body data;
- maintenance windows;
- explicit quantities;
- schedule collisions;
- things she has already checked.

Reduce:

- generic `I know` punchlines;
- polished aphorisms;
- intentionally witty descriptions of risk.

Aspen is funny because exactness survives absurd circumstances.

## Joel

Primary speech engine:

> sensory notice → curiosity → trying something → delayed conclusion.

Joel should have more unfinished attention than the others.

He can:

- change subject because he notices texture/smell/object;
- ask a question without immediately using the answer;
- leave a thought incomplete;
- return later having learned surprisingly fast.

Reduce:

- making every generous choice a clever moral reversal;
- making him permanently naive;
- making him speak like a therapist.

His danger is not verbal innocence. It is rapid learning without a stable instrumental framework.

## Yasmin

Primary speech engine:

> social courtesy → positioning → one precise question → silence / changed access.

Current draft sometimes makes Yasmin sound too much like a finance terminal with a face.

She should use more:

- names;
- invitations;
- remembered family details;
- soft phrasing;
- indirect refusal;
- small changes in seating/timing/access;
- apparently ordinary social logistics.

Her calculation should often be visible only because the room changes afterward.

Reduce:

- repeated `What is the return? / What is the security? / Why?` as her whole voice;
- villainously polished metaphors;
- explicit explanations that she is modelling incentives.

## Wong

Primary speech engine:

> quantity → immediate cost → work interruption → bargain.

Wong should sound busiest, not merely cheapest.

His scenes need more:

- children / dependents interrupting;
- bags, cages, food, carrying;
- half-finished work while he talks;
- remembering tiny sums because volume matters;
- abrupt refusal because there is literally another job.

Reduce:

- every conversation becoming a negotiation joke;
- proverb-like lines about margins;
- migrant caricature or stylised broken speech.

## Juan

Primary speech engine changes with state.

Sober Juan:

> precise, financially literate, ex-professional, capable of long causal chains.

Using / withdrawing / intensely activated Juan:

> short horizon, repeated measurement, interrupted plans, insistence on another trial.

Current Juan is the most distinct voice in the bank, but too many scenes end on a neat joke.

Keep the gap between:

- high analytic competence;
- disastrous immediate reward allocation.

Do not make addiction synonymous with stupidity.

## Dima

Primary speech engine:

> scope → enforceability → fee → next operational step.

Current Dima risks becoming a movie gangster who exists to say concise cool lines.

He needs more mundane brokerage:

- names he will not reveal;
- deliveries that need somebody to wait;
- stamped informal paperwork;
- people who no longer get introductions;
- a fee changing because a route became easier;
- two parties arguing over what his guarantee actually covers.

Reduce:

- `Now we are talking`;
- constant fee punchlines;
- fashion-joke gangster scenes;
- implied omnipotence.

Dima is powerful only where enough people still believe his settlement/enforcement network is useful.

---

# 4. Scene-by-scene disposition

Legend:

- **KEEP** — prose direction strong; only normal runtime guard needed.
- **GUARD** — prose usable, but current trigger is insufficient; actor knowledge/presence/state must be explicit.
- **REWRITE** — concept useful, current prose too neat/meta/incorrect.
- **DEFER** — do not render until unresolved mechanic/cosmology is actually specified.

## Aspen

| ID | Status | Editorial note |
|---|---|---|
| A01 | KEEP | Strong Aspen rhythm. Player response should be gesture/write. |
| A02 | GUARD | Requires checked weather source and Joel presence. |
| A03 | KEEP | Good body-as-operational-data scene. |
| A04 | KEEP | Strong montage; no need to explain lover relationship. |
| A05 | GUARD | Requires a real uncertain opportunity with actual 10-risk / 30-upside scale or generated terms. |
| A06 | KEEP | Good uncertainty without making Aspen embrace it. |
| A07 | DEFER | Personal Aspen loan is not current finance canon; do not create generic lender behaviour merely for this scene. |
| A08 | KEEP | Good toad differentiation. |
| A09 | GUARD | Only after a real obligation collision; wrapped gift must have existed previously. |
| A10 | KEEP | Strong early Sun Moment. |
| A11 | DEFER | Later Sun-Moment resistance state not yet implemented precisely enough. |
| A12 | KEEP | Good emergent-attention scene; no romance interpretation. |

## Joel

| ID | Status | Editorial note |
|---|---|---|
| S01 | KEEP | Strong first-contact Joel. |
| S02 | REWRITE | `Excellent banking` is too sitcom-clean and Dima should not appear automatically. |
| S03 | GUARD | Requires an actual Joel loss and Wong claim/idea he chose to test. |
| S04 | KEEP | Good learning-through-practice. |
| S05 | KEEP | Strong because truth recognition does not dictate moral response. |
| S06 | DEFER | Exact Bar legal ownership remains unresolved; do not state `legal owner is neither` yet. |
| S07 | GUARD | Requires real Bar cashflow + actual family subsidy; Yasmin presence/knowledge cannot be assumed. |
| S08 | GUARD | Mutually exclusive with S09; requires actual overdue Juan tab. |
| S09 | GUARD | Same state as S08 but Joel fails boundary. |
| S10 | REWRITE | Remove `Afternoon action is almost gone`; engine spends the action. |
| S11 | REWRITE | Remove `No transaction is created`; absence of trade is state, not narration. |
| S12 | GUARD | Wong must actually possess/source the fish. |
| S13 | GUARD | Requires player to observe fish preparation after enough Joel familiarity. |
| S14 | GUARD | First Sonya visual reveal; must not happen merely by clicking Joel. |

## Yasmin

| ID | Status | Editorial note |
|---|---|---|
| Y01 | KEEP | Strong incentive uncertainty. |
| Y02 | GUARD | Requires Wong-to-Yasmin information path or direct observation. Remove meta `No relationship label appears`. |
| Y03 | GUARD | Requires known elite contact; useful demonstration of social labour. |
| Y04 | KEEP | Strong second-child pressure without exposition. |
| Y05 | REWRITE | `buying an object and a missing sentence` is a writer line. Make the missing provenance change the offer directly. |
| Y06 | KEEP | Strong object-same / evidence-different montage. |
| Y07 | GUARD | Yasmin needs a plausible path to know Joel helped. |
| Y08 | GUARD | Requires real Juan claim with face value, price, and security state. |
| Y09 | KEEP | Excellent if breach has actually been detected. |
| Y10 | GUARD | Requires old signature + demonstrated memory continuity + formal legal discontinuity. |
| Y11 | KEEP | Good social-maintenance body cost. |
| Y12 | GUARD | Requires real high-return socially costly deal; Dima presence optional, not automatic. |

## Wong

| ID | Status | Editorial note |
|---|---|---|
| W01 | GUARD | Damaged tin can be private barter value, not literal half-currency unless currency rule allows it. |
| W02 | GUARD | Player must actually know turnover from tape/observation. |
| W03 | REWRITE | `That makes the number nine` is too writerly. Preserve action, flatten dialogue. |
| W04 | KEEP | Good merit + practical care coexistence. |
| W05 | GUARD | Requires Dima-brokered cross-form deal. |
| W06 | REWRITE | Concept is right but line explains volume economics too neatly. Let repeated one-tin disputes establish it over time. |
| W07 | KEEP | Good private-use distinction if Juan really values the junk. |
| W08 | KEEP | Strong toad-market scene. |
| W09 | KEEP | Excellent money-in / dependents-expand montage. |
| W10 | REWRITE | `I know many things / it is the price` is generic cleverness. |
| W11 | GUARD | Animal form + earned Wong access; no automatic recognition of old identity required. |
| W12 | KEEP | Strong work rhythm. |

## Juan

| ID | Status | Editorial note |
|---|---|---|
| J01 | KEEP | Excellent Juan. |
| J02 | GUARD | Claims list is not omniscient UI; player needs access to the claims data. |
| J03 | REWRITE | Too directly explains creditor-asset lesson. Let the tradable claim itself demonstrate it. |
| J04 | KEEP | Strong distressed-debt scene. |
| J06 | KEEP | `still modelling` fits Juan if not overused. |
| J07 | KEEP | Strong spiritual-materialism-through-protocol scene. |
| J08 | KEEP | Good refusal to certify revelation. |
| J09 | KEEP | Strong contrast between pseudo-precision and Aspen's measurement. |
| J10 | KEEP | Good Joel/Juan boundary scene. |
| J11 | GUARD | Requires actual claim consolidation and creditor identities. |
| J12 | KEEP | Good Sun Moment protocol obsession. |

## Dima

| ID | Status | Editorial note |
|---|---|---|
| D01 | REWRITE | `Now we are talking` is generic gangster dialogue. |
| D02 | KEEP | Good refusal to turn black market into a place/button. |
| D03 | KEEP | Strong exclusion-rent line. |
| D04 | REWRITE | Too much abstract enforcement explanation in one exchange. Use one concrete consequence. |
| D05 | GUARD | Requires Joel employment relationship; exact Seagull ownership remains provisional. |
| D06 | KEEP | Good Joel learning changes bargaining power. |
| D07 | KEEP | Strong front/back entrance montage if both have reason to be there. |
| D08 | GUARD | Wong roof route must exist materially; otherwise package is author magic. |
| D09 | KEEP | Good distressed-claim pricing. |
| D10 | DEFER | Formal Animal liberalisation not yet a specified world event. |
| D11 | REWRITE | Currently reads like a sitcom fashion joke and generic Russian-gangster coding. |
| D12 | KEEP | Strong informal-institution object. |

## Pair scenes

| ID | Status | Editorial note |
|---|---|---|
| P01 | REWRITE | Arithmetic is wrong: 6 + 1 + 1 = 8, not 7. Rebuild from actual sourcing/transport/replacement cost. |
| P02 | KEEP | Strong Aspen/Yasmin conflict. |
| P03 | KEEP | Good information/provenance friction. |
| P04 | KEEP | Good legal vs actual possession ambiguity. |
| P05 | REWRITE | `It is to me` states Joel's design thesis too cleanly. |
| P06 | KEEP | Good bargaining learning. |
| P07 | GUARD | Requires real unpaid customers / closing pressure. |
| P08 | REWRITE | `next twenty objects` is an author punchline, not a state-aware scene. |
| P09 | KEEP | Excellent Dima information-network incentive. |
| P10 | KEEP | Good collateral conversation if Onewheel is actually eligible/considered. |
| P11 | KEEP | Good Wong/Dima bargaining texture. |
| P12 | GUARD | Toad barter requires actual toad availability/value. |
| P13 | REWRITE | `Tomorrow gives me certainty` is a finance textbook line. Dima can simply insist on the maturity he prefers. |
| P14 | KEEP | Strong because Aspen's refusal is mechanical, not moral. |

## Ensemble scenes

| ID | Status | Editorial note |
|---|---|---|
| E01 | KEEP | Strong ensemble; ordinary absurdity. |
| E02 | KEEP | Good public-tape reaction; all knowledge justified by tape. |
| E03 | REWRITE | Too close to a lesson about utility/value. |
| E04 | REWRITE | Payment chain is strong; `we invented finance` is a wink at the player. Remove it. |
| E05 | KEEP | Strong because `broke` can mean several real things. |
| E06 | REWRITE | Six characters each delivering their archetype response reads like a sitcom roll call. |
| E07 | GUARD | Requires formal exclusion + Dima fee + Joel willingness + Wong route + impending market. |
| E08 | KEEP | Strong if Juan's broken-glass risk is established enough that Dima's line is ordinary expectation, not prophecy. |

## Attention / intimacy

| ID | Status | Editorial note |
|---|---|---|
| I01 | KEEP | Strong Aspen attention without romance label. |
| I02 | KEEP | Strong Yasmin object recurrence. |
| I03 | REWRITE | Remove `Nothing unlocks`; staying itself is the scene. |
| I04 | REWRITE | `String is not free. This piece was.` is a crafted aphorism. Flatten it. |
| I05 | KEEP | Very good Juan intimacy because money intrudes without cancelling silence. |
| I06 | KEEP | Good Dima trust without warmth. |

## Cross-life / form

| ID | Status | Editorial note |
|---|---|---|
| R01 | GUARD | Yasmin must have evidence for continuity and still distinguish registry identity. |
| R02 | KEEP | Good because Dima prices enforceability rather than declaring metaphysics. |
| R03 | REWRITE | Wong must not automatically soul-recognise player. Recognition should follow a repeated bargaining habit, impossible memory, or introduced proof. |
| R04 | REWRITE | Joel must not automatically know taste continuity. Let player indicate the same preference first; Joel notices recurrence second. |
| R05 | KEEP | Strong Sailor-player / Aspen mirrored condition. |
| R06 | GUARD | Juan may treat reincarnation as evidence only after player demonstrates impossible prior-life knowledge. |
| R07 | DEFER | Plant agency/property interaction is still unresolved. |
| R08 | DEFER | Same reason; do not canonise inability to signal before Plant mechanics exist. |

## Sonya

| ID | Status | Editorial note |
|---|---|---|
| G01 | REWRITE | Do not make Wong the default fish retailer. Use whoever actually holds the fish that day / background fish stall. |
| G02 | KEEP | Strong. |
| G03 | KEEP | Strong first visual encounter. |
| G04 | GUARD | Exact legal form wording is provisional until institutional language is canonised. |
| G05 | GUARD | Requires Sunflower actually present in household state; route should not spawn it as decoration merely for scene. |

## Market / document montage

| ID | Status | Editorial note |
|---|---|---|
| M01 | REWRITE | Claim transfer is excellent; `cold distinction / also correct` is too thesis-like. |
| M02 | DEFER | Requires a real competing broker / access reform rather than invented offscreen competition. |
| M03 | KEEP | Excellent Aspen reliability via penalty behaviour. |
| M04 | GUARD | Private note must only be visible if player has legitimately obtained it; move explanatory author note to metadata. |
| M05 | KEEP | Strong Wong cashflow montage. |
| M06 | REWRITE | Remove `Both statements are defensible`; use the numbers and two reactions only. Hard-coded family transfer only if actual state. |

## Sun Moment

| ID | Status | Editorial note |
|---|---|---|
| U01 | KEEP | Strong Wong tension without moral judgement. |
| U02 | KEEP | Strong Yasmin capacity to stop. |
| U03 | KEEP | Strong Joel sensory continuation after pause. |
| U04 | KEEP | Strong Dima institutional habit. |
| U05 | GUARD | Do not imply Juan actually moved first unless evidence supports it. His uncertainty is the point. |
| U06 | KEEP | Strong Aspen: time is not the only variable she monitors. |

## Post-Sunflower

| ID | Status | Editorial note |
|---|---|---|
| F01 | REWRITE | `Now we know that wasn't enough` states the thesis before the player has decided what the failure means. |
| F02 | REWRITE | Remove `no answer option that defines the feeling`; just do not provide one. |
| F03 | REWRITE | Remove `That is his entire first reaction.` |
| F04 | KEEP | Very strong Yasmin reaction. |
| F05 | KEEP | Strong Aspen reaction. |
| F06 | KEEP | Strong Joel reaction. |
| F07 | REWRITE | Remove narrator explanation of Juan's smile. |

---

# 5. Exact rewrite set — first editorial pass

These replace weak lines while preserving already-discussed character/state.

## S02 — Tab

**Keep trigger:** player lacks immediate payment; Joel relationship sufficient; Dima appears only if actually present.

Preferred core:

> Joel writes the amount in the tab book.
>
> You point to `tomorrow`.
>
> “Fine.”
>
> If Dima is present, he looks at the page.
>
> “Again?”
>
> Joel closes the book.

Do not add a joke explaining that Joel is a bad banker.

## S10 — Sensory distraction

> You put the shortage note on the counter.
>
> Joel reads the first line.
>
> A blue thread is caught on your sleeve.
>
> “Wait.”
>
> He pulls it free and holds it against the light.
>
> The note stays open under his other hand.

The action cost comes from the Talk interaction, not narration.

## S11 — Repeated attention

> “You don't need anything.”
>
> You shake your head.
>
> Joel polishes the glass once more.
>
> “Okay.”
>
> He reaches under the counter.
>
> “Try this.”

Stop there.

## Y05 — Provenance

> “Where did you get it?”
>
> You indicate Wong.
>
> “And him?”
>
> You shrug.
>
> Yasmin turns the object over once.
>
> “Three.”

If documented provenance later justifies six or eight, the changed number does the explanatory work.

## W03 — Rescue

> You point at the cages.
>
> “Eight?”
>
> Wong counts.
>
> “Nine.”
>
> A small bird moves inside his coat.
>
> He goes back to tying the bag.

## W06 — Tiny margin

Replace the explanatory scene with recurrence.

First trade:

> Wong argues over one tin.

Later trade:

> Wong argues over one tin again.

Later still, after high turnover:

> `WONG — 18 FILLS`
>
> He is still arguing over one tin.

No speech about `one tin twenty times` is needed.

## W10 — Cash first

> Juan: “Tomorrow.”
>
> Wong holds out his hand.
>
> Juan: “You know me.”
>
> Wong keeps his hand out.
>
> Juan finds the cash.

## J03 — Creditor asset

> “Collect today if you want.”
>
> You point to the amount due.
>
> Juan nods toward Dima.
>
> “He'll buy it.”
>
> Dima: “Maybe.”
>
> Juan: “See?”

The claim market, not Juan's lecture, teaches that his debt is somebody else's asset.

## D01 — Service

> You show Dima the request.
>
> “Can you do it?”
>
> “Yes.”
>
> You point to `legal?`
>
> “No.”
>
> You write a number.
>
> Dima crosses it out and writes another.

## D04 — Enforcement

> “They didn't pay.”
>
> Dima reads the name.
>
> He takes a pencil and crosses out one introduction on tomorrow's list.
>
> “Come back after Noon.”

The network consequence explains enforcement better than a speech.

## D11 — Tracksuit

Keep Dima's ordinary tracksuit as visual fact, not Russian-gangster comedy.

Preferred scene:

> The invitation says `FORMAL DRESS`.
>
> Dima arrives in the same clean tracksuit.
>
> Yasmin looks at him once.
>
> “You received the card?”
>
> “Yes.”
>
> She lets him in.

The point is not that Yasmin is a fashion cop. The point is that Dima's access can sometimes override the room's symbolic rules.

## P01 — Imported tool

Fix the arithmetic and tie price to real cost.

> Joel turns the jigger over.
>
> “How much?”
>
> “Eight.”
>
> “Your note says six.”
>
> “Six at the other port.”
>
> Aspen taps the freight line, then the replacement date.
>
> Joel pays eight or walks away according to his state.

Do not invent a flat `replacement-risk +1` constant in dialogue.

## P05 — Joel / Yasmin investment

> Yasmin: “What does it return?”
>
> Joel: “I don't know.”
>
> She puts the paper down.
>
> Joel picks it back up.
>
> “I still want to try it.”

## P08 — Yasmin / Wong object

> Wong: “Three.”
>
> Yasmin looks at the mark on the underside.
>
> “Twelve.”
>
> Wong looks at the mark too.
>
> “What is that?”
>
> Yasmin does not answer until the object is in her hand.

This preserves asymmetric/private value without an authorial `next twenty objects` punchline.

## P13 — Juan / Dima maturity

> Dima: “Tomorrow.”
>
> Juan: “Friday. Seven.”
>
> Dima: “Tomorrow.”
>
> “Five tomorrow or seven Friday.”
>
> Dima points to `tomorrow` on the paper.

No abstract `certainty` explanation.

## E03 — Good deal

> Joel puts the purchased object on the Bar.
>
> “Was that bad?”
>
> Aspen asks, “Do you need it?”
>
> Joel looks at the object.
>
> “Not yet.”

Stop before the cast explains utility theory.

## E04 — Payment chain

Keep the chain:

> Wong owes Dima.
>
> Dima owes Aspen.
>
> Aspen is waiting for Yasmin.
>
> Yasmin is waiting for a buyer who is not in the room.
>
> Joel puts six glasses on the counter.
>
> Dima looks at Juan.
>
> “Pay your tab.”

Remove `We have invented finance.`

## E06 — Reputation

Do not let six characters recite their archetype.

Preferred versions should use only 2–3 characters depending on who is actually present.

Example:

> A stranger asks Yasmin, “Can I trust Dima?”
>
> “For what?”
>
> Dima, two seats away: “Correct answer.”

Or:

> A stranger asks Joel who is safe to borrow from.
>
> Joel looks around the room.
>
> “How soon can you pay it back?”

Different scenes can answer different dimensions of trust over time.

## I03 — After close

> The Bar is closed.
>
> Joel is cleaning the same patch of counter.
>
> You point to the door.
>
> “I know.”
>
> He keeps cleaning.
>
> You stay.

End.

## I04 — Wong practical intimacy

> Your sleeve is torn.
>
> Wong looks at it.
>
> “Hold still.”
>
> He ties it with string from his pocket.
>
> You reach for a tin.
>
> “Keep it.”
>
> He has already turned back to the stall.

## R03 — Wong recognition

Do not begin with automatic recognition.

> Wong names a price.
>
> You write the same counteroffer you used repeatedly in the previous life.
>
> He looks at the number.
>
> Then at you.
>
> “Again?”

That is enough for the first recurrence.

## R04 — Joel continuity

> Joel puts two bottles down.
>
> You point to the sweeter one.
>
> He stops.
>
> “Again?”
>
> You point to it once more.
>
> He pours from that bottle.

Do not make him know an old preference before the current player demonstrates it.

## G01 — Fish order

Use actual seller state.

> Joel: “Mackerel.”
>
> The current seller names a price.
>
> Joel tries one counteroffer.
>
> If refused, he still buys when Sonya need is active and liquidity permits.

The seller can be a background fish stall, Wong when he actually has fish, Aspen after an import, or another reachable source.

## M01 — Claim transfer

> `PRIVATE CLAIM TRANSFER`
>
> Seller: Joel
>
> Buyer: Yasmin
>
> Face: 10🥫
>
> Price: 6🥫
>
> Juan reads it.
>
> “You sold it?”
>
> Joel: “Yes.”
>
> Juan reads Yasmin's name again.

No thesis line is necessary.

## M06 — Bar day

Only show fields the player can legitimately see.

> `BAR REVENUE: 14🥫`
>
> `OPERATING COSTS: 11🥫`
>
> `UNPAID TABS: 8🥫`
>
> [show family transfer only if known]
>
> Joel: “Good day.”
>
> If Dima knows the books and is present, he may simply say, “No.”

Stop.

## F01 — After the flower

> `SUNFLOWER ×1`
>
> `REFERENCE PRICE: —`
>
> Joel: “So?”
>
> Nothing happens.
>
> Juan looks at the flower.
>
> “Again?”

`Again?` is preferable to explaining what the failed acquisition proves.

## F02 — Dima

> You show Dima the Sunflower.
>
> “How much?”
>
> You shake your head.
>
> “Not selling?”
>
> You shake your head.
>
> He waits.
>
> “Fine.”

No sentence should explain that the game refused to label the player's feeling.

## F03 — Wong

> Wong looks at the Sunflower.
>
> “Can you eat it?”
>
> You shrug.
>
> “Don't put it near the cats.”

End.

## F07 — Juan

> “So you got it.”
>
> You nod.
>
> “And?”
>
> You wait.
>
> Juan smiles.

End there.

---

# 6. Knowledge and evidence map for high-value scenes

These scenes are worth implementing early because their evidence paths are already close to existing engine primitives.

| Scene | Required evidence/state | What must remain hidden |
|---|---|---|
| A04 Lover parcel | Aspen cargo/commission list visible | exact relationship label unless learned |
| A09 Missed promise | real personal obligation + commercial obligation collision | author's judgement of which mattered more |
| S07 Bar money | Bar revenue/cost + actual subsidy | Joel motive |
| S08/S09 Juan tab | overdue Bar claim + Joel choice | moral judgement of enabling |
| Y05/Y06 Provenance | object source known/unknown + documentation | Yasmin exact private utility |
| Y09 Breach | actual agreement + detected breach | undetected breach must not trigger scene |
| W09 Good week | actual high turnover + new dependent/rescue expense | `merit score` |
| J02 Claims | claims data genuinely obtained | undiscovered creditors |
| J04 Buyback | Juan claim actually tradeable + market price | creditor private reservation price |
| J11 Restructure | real claim transfers | claims not held by visible parties |
| D03 Proxy fee | Animal legal exclusion + Dima access | Dima universal knowledge |
| D04 Enforcement | Dima owns/brokered claim + missed payment | off-network consequences he cannot cause |
| D09 Claim value | claim face/due/risk known to Dima | true repayment probability |
| E02 Noon tape | public fill exists | hidden reason for Yasmin's valuation |
| M03 Aspen penalty | contractual due time + actual lateness | no personality score |
| M05 Wong volume | traceable gross inflow/outflow | private expenses not observed |
| R01 Old signature | legal-life ID discontinuity + old record | metaphysical truth of identity |
| R02 Old debt | old claim + current form + Dima willing to consider informal enforcement | soul-level liability |
| F01–F07 | player actually owns living Sunflower + objective switched to Go home | what the player feels / what the flower `means` |

---

# 7. Montage composition rules

The first bank over-relies on dialogue in several sections.

Future revision should prefer a changing ratio depending on context, but as an editorial test:

> if five consecutive scenes could be staged as two people standing still and exchanging clever lines, the sequence is too verbal.

Use more:

- receipts;
- wrong quantities;
- objects reappearing;
- hands stopping during Sun Moment;
- altered seating;
- missing chairs;
- a different creditor name on the same IOU;
- fish purchased at a changed price;
- a schedule with one line moved;
- a clean tracksuit at a formal event;
- a family transfer appearing in a Bar ledger;
- a toad box that changes hands;
- the same item with different provenance papers;
- the same player habit recognised after rebirth;
- public tape beside private consequences.

The craft references are most useful when **material recurrence carries what dialogue would otherwise explain**.

---

# 8. Hard guardrails before runtime integration

1. Do not implement all 134 scenes at once.
2. Do not create an LLM dialogue generator.
3. Do not randomise authored scenelets as flavour barks.
4. Do not make scene selection another independent story-state database.
5. Do not infer player love, grief, belief, enlightenment, or motive.
6. Do not let a scene reveal engine truth unavailable to participants.
7. Do not give every NPC equal knowledge of public and private events.
8. Do not use scenelets to compensate for economic state that does not exist.
9. Do not hard-code unresolved Bar ownership, Plant agency, Animal legal reform, or final karmic resolution merely because a draft scene mentions them.
10. Do not preserve a line merely because it is funny if it flattens the character into a trope.

First runtime narrative slice should be approximately 18–24 scenelets tied to mechanics that are already real or one implementation batch away.

Recommended first slice:

- A01, A02, A03, A04, A10, A12;
- S01, S04, S05, S08/S09 one branch, S11;
- Y01, Y05/Y06, Y09;
- W01, W09, W12;
- J01, J04, J07/J08;
- D02, D03, D09, D12;
- E01, E02;
- I03 or I05;
- M03, M05;
- F03/F04/F05/F06 only after sunflower acquisition.

This is enough to make the harbour feel authored without yet implementing the whole narrative corpus.

---

# 9. Editorial rule going forward

When adding or revising a scene, ask in order:

1. **What actual world state caused this scene to exist?**
2. **How does each speaker know what they say?**
3. **Could the same scene happen if these characters had different names?** If yes, voices are too generic.
4. **Is there a physical object, record, time cost, body action, or market consequence that can replace one explanatory line?**
5. **Does the final line explain the point?** If yes, cut it and test again.
6. **Does the scene secretly make a moral judgement?** If yes, return the judgement to consequences.
7. **Would the scene still work if the player felt the opposite of what the author expects?** If no, rewrite player interiority.

The target is not literary prestige.

The target is a harbour in which economic action, social memory, material recurrence, and rebirth keep generating scenes that remain legible without exposition.
