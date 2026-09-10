# SUNFLOWER — WORLD LIFE CONTENT PACK

**Purpose:** cheap authoring work that can be handed to Codex so the next run spends compute on integration, browser play and state correctness instead of writing hundreds of lines from scratch.

**Repository basis checked:** `main` is still `4ad195f83693165f2865fc464f60c2a397a8a479` at the time this pack was written. That `main` still contains the old tab/card player UI. The continuous-map `HarbourMap.jsx` / `harbourPresentation.js` work shown in the current Codex run is therefore **not yet on main**. The next Codex run must continue from the current continuous-map branch or merge it first; do not restart from `main` and accidentally restore the rejected interface.

---

## 1. What already exists in main

The simulation already knows considerably more than the current player presentation uses:

- named actor locations;
- autonomous named-pair relational candidates with explicit interaction locations;
- Bar convergence;
- Yasmin preview/auction agenda;
- Aspen route planning and departures;
- obligations and claims;
- NPC cash/capacity;
- public/private transactions;
- knowledge and evidence;
- route state;
- weather;
- Toad-circle attendance;
- location-changing accepted relational interactions.

This means the next pass should **not invent a second NPC scheduler**.

The main technical problem is timing:

> most autonomous location changes are resolved inside the day-advance pipeline, so a continuous map can look frozen during the player's day.

The correct fix is to separate a bounded **relational/world beat** from full daily settlement.

Do not call full `advanceHarbourWindow()` after every player click.

---

## 2. Recommended intra-day world beat

Implement one lightweight function conceptually like:

```js
advanceHarbourBeat(world, cause)
```

It may:

- advance one bounded slice of named NPC agenda;
- resolve at most a small number of eligible relational proposals;
- update location when an accepted interaction or urgent obligation justifies it;
- form/dissolve Bar or other co-presence where appropriate;
- emit presentation traces;
- update visible ambient state.

It must NOT:

- increment the day;
- run full daily market clearing;
- mature every claim;
- regenerate background sectors;
- respawn daily goods;
- double-charge daily costs;
- reset attention;
- repeat daily auctions;
- duplicate settlement.

Suggested triggers:

- after a **meaningful attention-spending player intervention**;
- after some material transactions/commitments;
- optionally after every second significant intervention if the first beat would cause excessive movement.

Looking, zooming, opening the phone, reading the paper, checking inventory and inspecting already-known notes should not advance world time.

A busy named NPC may occupy roughly 2–4 meaningful positions over a day, but this is descriptive, not a quota.

---

## 3. Dialogue selection

Use `dialogueContent.js` as a content layer.

Priority order:

1. acute state:
   - missed promise;
   - current sanction;
   - imminent departure;
   - active route event;
   - unpaid tab / open claim;
2. co-present character;
3. location-specific line;
4. generic but character-specific quiet line.

Do not shuffle all lines randomly.

The current bug where Juan can talk about nursery soil while sitting in the Bar is specifically what this structure prevents.

A repeated line is allowed when changed context makes it mean something different.

### Knowledge guard

A line must not make an NPC know something merely because the engine knows it.

Only use:

- observed state;
- public information;
- an actual transferred fact;
- their own obligation/transaction;
- plausible co-presence.

---

## 4. Voice rules

### Aspen
Quantity → time → condition → exception.

Exact, but not a deadpan one-liner machine.

### Joel
Sensory notice → curiosity → attempt → delayed conclusion.

Can change topic because he notices something. Learns fast.

### Yasmin
Courtesy → positioning → one precise question → silence / changed access.

Her calculation is often visible through what happens to the room afterward.

### Wong
Quantity → immediate cost → interruption → bargain.

Busy, physical, practical. Avoid merchant proverbs.

### Juan
Sober: long causal chains and real technical/financial competence.

Activated/compulsive: shorter horizon, repeated measurement, another trial.

Do not make risk equal stupidity.

### Dima
Scope → enforceability → fee → next operational step.

Mundane brokerage. No movie-gangster punchline factory.

---

## 5. Cheap world richness

Use `worldLifeContent.js`.

These details are intentionally:

- not quests;
- not rewards;
- not all clickable;
- not tutorial clues;
- not required to disappear after being seen.

A SoupSoup-like map should contain three simultaneous layers:

1. mechanically actionable objects/people;
2. state traces that may matter;
3. ordinary or absurd visual life that does not pay the player.

This is one of the cheapest ways to make the harbour feel inhabited without adding another system.

---

## 6. Location naming

Player-facing close-zoom labels should be neutral.

Use:

- Berth
- Bar
- Parcel shop
- Nursery
- Gallery
- Back room
- Kitchen
- Cliff path
- Exchange

Do not use:

- Wong's Counter;
- Juan's Nursery;
- Yasmin's Viewing Room;
- Dima's Back Room;
- Sonya's Kitchen.

NPC names belong to people, not to map navigation.

The underlying engine IDs can remain unchanged.

---

## 7. Newspaper / phone

### Newspaper
Default to only 2–3 current items.

Older pages can be folded away.

One concrete headline + one short report.

Never show evidence IDs, confidence, freshness labels, route conditions or design notes.

### Phone
Contacts appear only after legitimate acquaintance/contact exchange.

Do not add Sonya as a normal contact.

Do not let calling teleport someone.

Show only a shallow recent conversation by default.

---

## 8. Comic sequences

Do not turn every interaction into a comic.

Use 3–4 panels for genuinely consequential cases:

- Short Crate;
- Auction;
- important private settlement;
- Toad circle;
- supper;
- cliff;
- serious sanction;
- Sun Moment.

Ordinary talk stays on-map.

Choice text should sound like what the player means, not an engine method name.

---

## 9. What Codex should spend the next run on

Do NOT spend the next run writing generic lines already supplied here.

Spend it on:

- integrating `dialogueContent.js`;
- integrating `presentationCopy.js`;
- integrating `worldLifeContent.js`;
- splitting intra-day world beats from full daily settlement;
- feeding actual co-presence/recent events/activity into dialogue selection;
- fixing route/action deadlocks found through browser play;
- making movement visible but cheap;
- verifying no player-facing internal terminology returns;
- playing several days on desktop and ~390px mobile.

Do not redesign the accepted continuous-map architecture again.

---

## 10. Integration target

Recommended files:

```text
src/dialogueContent.js
src/presentationCopy.js
src/worldLifeContent.js
```

The current branch's `harbourPresentation.js` should become a thin adapter around these modules instead of accumulating another giant switch statement.

Example:

```js
import { reactionText } from './dialogueContent.js';
import { actionIntent, actionResult, friendlyBlock } from './presentationCopy.js';

export function reaction(world, id) {
  return reactionText(world, id);
}
```

Map composition can pull ambient details from:

```js
import { ambienceFor, availableMicroScenes } from './worldLifeContent.js';
```

None of these content modules should mutate simulation state.
