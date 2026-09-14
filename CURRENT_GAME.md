# Sunflower — Current Game Canon and Implementation Authority

> Status: **CURRENT** as of 2026-09-14.
>
> This file is the short-form authority layer for active development. When older design, handoff, verification, or historical prototype documents conflict with this file, **this file wins**. Deeper documents remain useful for detail, but they do not override later user direction recorded here.

## 1. Current implementation baseline

`main` currently contains the merged continuous-harbour checkpoint from PR #5. Keep the continuous map, shared map/comic figures, edge phone/newspaper, bottom object strip, collapsed pocketbook, contextual dialogue system, bounded intra-day time, and the simulation/economic conservation work already verified there.

The checkpoint is **not** final design acceptance. In particular, the current Juan route, flattened 1400×900 world presentation, novice legibility, dialogue quality, social density, and background layering remain subject to the corrections below.

## 2. Non-negotiable player-information rule

The player may only be offered dialogue or actions for concepts they have plausibly learned.

- Do not expose quest vocabulary merely because the engine knows it.
- A first meeting with Juan must not reveal the sunflower, cliff route, Onewheel requirement, race, or any equivalent shortcut.
- Do not offer `Ask Juan about the cliff` or similar knowledge-leaking copy before the route has been earned.
- Unknown identities remain unknown until a credible contact event.
- Transaction copy may explain immediate consequences, but must not reveal future route requirements.

This rule applies to visible actions, dialogue responses, phone, newspaper, remembered instructions, tooltips, comics, and accessibility labels.

## 3. Canonical Juan route causal chain

The current direct `meet Juan -> cliff plan -> buy parts -> Wong assembles -> cliff -> sunflower` path is **superseded**.

The intended chain is:

1. The player reaches Joel's Bar through ordinary exploration.
2. The player agrees to taste Joel's Mai Tai.
3. Joel is inexperienced. After tasting, he says the drink seems to be missing something; he does not hand the player a shopping-list quest.
4. The player infers the missing ingredient from contextual clues, finds a real source, and supplies/sells it to Joel.
5. For this implementation pass, preserve the existing concrete Orgeat good rather than inventing a new ingredient canon. The important correction is **discovery and information gating**: the UI must not name Orgeat as the answer before the player has earned/inferred it. The ingredient should remain data-driven so it can be swapped later without rewriting route logic.
6. Joel successfully makes the drink and later serves/offers Juan one in a real co-present social scene.
7. That event unlocks a special Juan conversation. The player proactively explains what they are trying to find/do.
8. Juan then says he may know a way and asks whether the player can ride a one-wheel/unicycle.
9. If the player cannot, Juan tells them to practice and eventually bring the machine for a race.
10. Juan's wager: if the player wins, Juan takes the player to the sunflower field. If the player loses, the player covers drinks for everyone at the bar that day.
11. The first race should be difficult. Repeated practice can improve win probability.
12. The player may alternatively improve the machine through modifications, using black-market or other world opportunities to obtain relevant tools/components and Aspen to perform modifications.
13. Aspen's help is relational and material, not a generic vending action. Assembly/modification requires an earned condition involving honest lime supply/delivery and may also use character-specific favors.
14. Possible Aspen favors include distracting or verbally sparring with Wong, creating a diversion so Wong stops prying into Aspen's affairs, helping with toads, or similarly grounded tasks. These are examples of the required flavor: contextual favors, not interchangeable currency buttons.
15. Each successful modification may improve race odds up to a cap; exact balance belongs in tunable data, not dialogue text.
16. Winning the race is what unlocks Juan taking the player to the sunflower field.

The route should feel causally discovered rather than presented as a checklist.

## 4. Onewheel / Aspen correction

The current Wong-bench assembly gate is not the intended final route.

- The player must discover how to obtain/build the one-wheel rather than receiving the full parts checklist immediately.
- Physical components still matter and must remain real inventory objects subject to reservation/pledge/commitment rules.
- Aspen is the intended assembler/modifier for the Juan route.
- Aspen requires honest lime provision/supply as an earned condition. If the player comes up short, that must have a real consequence, debt, obligation, or tradeoff; do not silently forgive the shortfall.
- Do not destroy the existing lime honesty/short-crate mechanics if they can be reused; reconcile them with Aspen's assembly relationship instead of creating a second unrelated lime system.
- Modifications should be optional alternate preparation, not a mandatory checklist if practice can also produce a viable win chance.

## 5. Race and bar betting

The Juan race is a social event, not an isolated probability button.

- People in/around Joel's Bar can form a betting scene based on their expectations.
- Bets/reactions should use actual co-presence and current relationships; absent characters do not speak or bet.
- The player's loss condition has a concrete economic consequence: covering drinks for the bar that day.
- Practice and modifications should visibly change the player's preparation and win probability.
- Race probability and upgrade increments belong in tunable game state/data and must have a cap.
- Do not guarantee the first win.
- Do not make repeated races a free reroll: time, money, favors, social obligations, or other real costs must remain meaningful.

## 6. Dialogue and novice experience

The current game has technical dialogue infrastructure, but its authored experience needs substantial improvement.

- One short spoken line at a time.
- A completed conversation with no remaining meaningful response closes automatically.
- No autoplay that continues after the player has effectively left the interaction.
- Speech and response UI must remain spatially predictable and anchored to the active interaction.
- Characters should sound like distinct ordinary people with motives, humor, awkwardness, habits, class/background, and situational context. Do not make every character speak in cryptic, poetic, portentous fragments.
- Surreal or poetic lines are allowed selectively when earned by character and situation.
- Generic transaction responses such as `I'll take 6` must not be reused across unrelated people. Name the object, quantity, price, or immediate consequence where needed, and keep transactional UI visually/semantically distinct from character speech.
- Do not begin with a tutorial wall. Teach the world incrementally when the player first encounters a mechanic.
- At each unfamiliar commitment, make clear what leaves the player's hand, what they receive, when it happens, and what can go wrong.
- The player needs enough grounding to understand their broad goal and what kinds of actions are possible, without leaking route solutions.
- When available activity/time is exhausted and the player tries another meaningful action, offer `tomorrow` versus `keep looking` rather than silently failing or auto-advancing.

## 7. Living-world timing and NPC movement

NPCs do not move once per player click.

- Player interventions and NPC schedules use the shared world clock, but each NPC follows their own activity logic and cadence.
- Weather, cargo, incidents, arrivals, spoilage, availability, and similar world conditions may vary.
- NPC responses to those conditions should be reasonably predictable from character, role, resources, relationships, commitments, and current location.
- Expand repeated encounters and route diversity so characters do not merely shuttle between one or two scripted anchors.
- Preserve conservation and commitment rules while increasing social and situational variety.

## 8. Continuous-world renderer correction

The accepted product idea is a continuous harbour world, but the current renderer is still a working prototype.

The final presentation must not behave like a webpage surrounding a single fitted illustration.

### Camera

- The camera should remain inside the authored world.
- Prefer **cover + pan** semantics over `contain` gutters; do not reveal non-world teal margins because the viewport aspect ratio differs from the map.
- UI overlays the world rather than reserving large permanent strips that shrink the world into a central picture.
- Camera bounds prevent seeing outside the authored world.
- Desktop should be pannable when the world exceeds the viewport, not only mobile/zoomed states.
- The world may be a large authored map rather than procedurally infinite. The requirement is that the screen feels like a window into a larger place.

### Layering and depth

A flattened background with every NPC rendered above it is insufficient. The scene graph should support at least:

1. base terrain/water/architecture,
2. furniture and static environment,
3. ambient life,
4. dynamic actors and moving goods,
5. local foreground occlusion layers,
6. weather/tiny-life overlays where appropriate.

People must be able to stand behind counters, plants, tables, railings, curtains, boats, and other foreground structures where composition requires it. Use feet-Y/depth ordering where appropriate instead of one fixed cast render order.

### Resolution and assets

- The current background is lower-detail than the character atlas; CSS enlargement cannot fix missing source detail.
- Replace or extend the world with sufficiently high-resolution authored material and aligned layers.
- Remove crude decorative overlays and dead hotspots that do not produce a current meaningful interaction.
- Most ambient details are noninteractive.
- Shisha, tea, fruit, repairs, domestic/social gatherings, and other life details belong in visible world layers without automatically becoming buttons.
- Incidental people must have identities distinct from the main cast. Preserve the approved cultural/skin-tone/age/body/hair/head-covering diversity direction in `ART_DIRECTION.md`.

## 9. Approved cast / art constraints

Preserve the approved identities. Style unification is allowed; redesign is not.

- Joel: tallest; dark-skinned Black man, copper curls, round glasses, broad ordinary face, mustard waistcoat, teal trousers.
- Juan: shortest human; older braided man, plants/olive jacket.
- Aspen: black updo, cream floral clothing.
- Yasmin: long dark hair, black-and-gold dress.
- Dima: human, blond/stubble, navy tracksuit, purple sunglasses.
- Wong: whippet.
- Sonya: supporting penguin grandmother.

Dima is the reference for linework, flat colour, contrast, proportions, and finish. This does not authorize copying his face/body/clothes onto other characters.

## 10. Development and verification policy

The next pass may be one large integration branch/PR because route state, information gating, tutorial copy, NPC timing, economic consequences, and renderer presentation affect each other.

The requirement is **structured checkpoints, not artificial PR boundaries**.

Recommended checkpoint sequence:

1. information gates + Joel/Mai Tai discovery,
2. Juan social unlock + race contract,
3. Onewheel/Aspen/lime/practice/upgrade loop,
4. betting and race resolution,
5. continuous-world camera/layer renderer,
6. world density / incidents / repeated encounters,
7. full browser acceptance and regression pass.

Each checkpoint should be a meaningful commit (or small coherent series), pushed to the same integration branch so it can be reviewed without waiting for the final PR.

For every meaningful gameplay checkpoint:

- run engine/regression checks,
- run the real browser,
- use fresh saves,
- test desktop 1440×1000 and mobile 390×844 where UI is affected,
- test both happy paths and information-gating failures,
- keep screenshots local unless specifically requested,
- distinguish actually browser-tested routes from merely unit/engine-tested routes.

A route is not accepted merely because an internal action can be invoked. The player must be able to discover and complete it through the visible UI without prior knowledge.

## 11. Historical-status warning

Documents and code describing the old dashboard, location-page navigation, 14-day/noon-clearing assumptions, direct Juan cliff prompt, Wong-as-final-assembler shortcut, or flattened-map implementation as final visual acceptance are historical/current-implementation evidence, not higher-priority design authority.

When unsure, preserve working economic invariants and existing tested infrastructure, but follow the causal, information, dialogue, and presentation rules in this file.
