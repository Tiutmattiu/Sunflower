# Crowded Harbour Tableau Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current flat harbour renderer into a data-driven crowded tableau scaffold with valid ground slots, ambient crowds, small-creature motion, and day/weather composition changes without touching the unfinished Mai Tai gameplay flow.

**Architecture:** Keep `HarbourMap.jsx` as the interaction shell, but move scene composition rules into a pure `harbourTableau.js` module. The pure module owns legal ground zones, ambient crowd definitions, day/weather variants, and deterministic placement; `HarbourMap.jsx` renders those data as lightweight SVG actors/creatures with CSS loops. Existing named actors continue to use the approved cast atlas, but their positions are snapped to legal named-actor slots instead of raw hard-coded feet points.

**Tech Stack:** React 18, SVG, CSS animation, plain ES modules, Node assertion scripts, Vite.

**Spec:** `SUNFLOWER_HARBOUR_TABLEAU.md`

## Global Constraints

- Work directly on `main`; do not create a development branch.
- Do not modify `src/playerGame.js`, `src/AppCore.jsx`, or the unfinished Mai Tai route logic in this checkpoint.
- Preserve current named-character identities and the approved cast atlas.
- Functional crowd and ambient props are presentation-only: they do not mutate economy, inventory, route state, or rewards.
- Crowd placement must stay on declared legal ground/water zones; no people walking on water and no floating actors.
- World motion must continue independently of player clicks through CSS/time-based animation loops.
- Keep major scene elements in one clarity family; avoid an obvious sharp-sprite/blurry-background hierarchy.
- Respect `prefers-reduced-motion`.

---

### Task 1: Pure tableau model and failing contract test

**Files:**
- Create: `src/harbourTableau.js`
- Create: `scripts/harbour-tableau-check.mjs`

**Interfaces:**
- Produces: `TABLEAU_ZONES`, `NAMED_ACTOR_SLOTS`, `crowdForWorld(world)`, `creaturesForWorld(world)`, `namedActorPoint(world, actorId)`.
- Consumes: only lightweight `world` fields such as `day`, `weather`, actor locations, and existing route-independent presentation state.

- [ ] **Step 1: Write the failing test**

Create `scripts/harbour-tableau-check.mjs` that imports the new API and asserts:

```js
import assert from 'node:assert/strict';
import {
  TABLEAU_ZONES,
  NAMED_ACTOR_SLOTS,
  crowdForWorld,
  creaturesForWorld,
  namedActorPoint,
} from '../src/harbourTableau.js';

assert(TABLEAU_ZONES.length >= 8);
for (const zone of TABLEAU_ZONES) {
  assert(zone.id);
  assert(zone.kind === 'ground' || zone.kind === 'water');
  assert(zone.bounds && zone.bounds.length === 4);
}

const world = {
  day: 2,
  weather: 'clear',
  actors: {
    joel: {location: 'joels_bar'},
    juan: {location: 'nursery'},
    aspen: {location: 'harbour_berth'},
    wong: {location: 'parcel_counter'},
    yasmin: {location: 'viewing_room'},
    dima: {location: 'back_room'},
  },
};

const crowd = crowdForWorld(world);
assert(crowd.length >= 18, 'crowd should visibly populate the tableau');
assert(crowd.some(x => x.activity === 'basketball'));
assert(crowd.some(x => x.activity === 'chess'));
assert(crowd.some(x => x.activity === 'shisha'));
assert(crowd.some(x => x.activity === 'swim'));

for (const person of crowd.filter(x => x.kind === 'person')) {
  assert.equal(person.zoneKind, 'ground');
}
for (const swimmer of crowd.filter(x => x.activity === 'swim')) {
  assert.equal(swimmer.zoneKind, 'water');
}

const creatures = creaturesForWorld(world);
assert(creatures.some(x => x.species === 'seagull'));
assert(creatures.some(x => x.species === 'squirrel'));
assert(creatures.some(x => x.species === 'tropical-fish'));

for (const id of Object.keys(NAMED_ACTOR_SLOTS)) {
  const point = namedActorPoint(world, id);
  assert(point && Number.isFinite(point.x) && Number.isFinite(point.y));
}

const rainy = crowdForWorld({...world, weather:'storm'});
assert(rainy.filter(x => x.zoneId === 'sea-shore').length < crowd.filter(x => x.zoneId === 'sea-shore').length);

console.log('PASS: harbour tableau zones, crowd, creatures and legal actor slots');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/harbour-tableau-check.mjs`
Expected: FAIL because `src/harbourTableau.js` does not exist.

- [ ] **Step 3: Implement minimal pure model**

Create `src/harbourTableau.js` with:
- eight or more declared zones, each with explicit ground/water bounds;
- deterministic crowd templates for sea/shore, berth, Wong strip, social strip, park/basketball/chess, faith/vice, craft/oddity, cliff edge;
- weather/day filters that reduce beach leisure during storm and vary crowd composition by day;
- legal named-actor slots mapped by actor location;
- deterministic placement from stable ids (no `Math.random()`).

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/harbour-tableau-check.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `feat: add harbour tableau crowd model`

---

### Task 2: Render ambient crowd and small creatures

**Files:**
- Modify: `src/HarbourMap.jsx`
- Modify: `src/harbour.css`
- Modify: `scripts/harbour-tableau-check.mjs`

**Interfaces:**
- Consumes: `crowdForWorld(world)`, `creaturesForWorld(world)`, `namedActorPoint(world, actorId)`.
- Produces: visible non-interactive crowd/creature SVG groups with stable `data-*` attributes for browser verification.

- [ ] **Step 1: Extend the failing test**

Add source-contract assertions to `scripts/harbour-tableau-check.mjs` by reading `src/HarbourMap.jsx` and asserting it contains:

```js
import fs from 'node:fs';
const mapSource = fs.readFileSync(new URL('../src/HarbourMap.jsx', import.meta.url), 'utf8');
assert(mapSource.includes('crowdForWorld'));
assert(mapSource.includes('creaturesForWorld'));
assert(mapSource.includes('namedActorPoint'));
assert(mapSource.includes('data-crowd-id'));
assert(mapSource.includes('data-creature-id'));
```

Expected before implementation: FAIL.

- [ ] **Step 2: Run test and confirm the expected failure**

Run: `node scripts/harbour-tableau-check.mjs`
Expected: FAIL on missing renderer integration markers.

- [ ] **Step 3: Implement renderer integration**

In `HarbourMap.jsx`:
- import the pure tableau helpers;
- render functional/ambient crowd before named actors;
- render simple SVG person silhouettes at roughly the same visual sharpness as other map graphics;
- render swimmers only in water slots;
- render seagulls, squirrels, tropical fish as non-interactive ambient groups;
- keep existing hidden toads interactive;
- replace hard-coded named actor `feet` coordinates with `namedActorPoint` results;
- keep crowd groups `aria-hidden="true"` and `pointerEvents="none"`.

In `harbour.css`:
- add low-cost loop classes for walk/idle/work/swim/basketball/chess/shisha/seagull/squirrel/fish;
- make durations intentionally varied;
- disable animation under `prefers-reduced-motion`.

- [ ] **Step 4: Run test**

Run: `node scripts/harbour-tableau-check.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `feat: render continuous harbour crowd loops`

---

### Task 3: Add presentation-only scene signals for requested neighbourhood life

**Files:**
- Modify: `src/harbourTableau.js`
- Modify: `src/HarbourMap.jsx`
- Modify: `scripts/harbour-tableau-check.mjs`

**Interfaces:**
- Produces: presentation markers for Wong multi-service strip, Octopus Bank, live music, pizza/deli, shisha, basketball/chess, synagogue/Shabbat traces, exotic pet/glassblower/snake-charmer/vice pockets, cliff edge, and sea leisure.

- [ ] **Step 1: Add failing semantic coverage assertions**

Assert the model exposes at least one scene marker or crowd role for each requested category:

```js
const tags = new Set(crowdForWorld(world).flatMap(x => x.tags || []));
for (const tag of [
  'wong-services','octopus-bank','live-music','pizza-deli','shisha',
  'basketball','chess','faith','vice','exotic-pet','glassblower',
  'snake-charmer','homeless','sea-leisure'
]) assert(tags.has(tag), `missing tableau tag: ${tag}`);
```

Expected before implementation: FAIL for missing categories.

- [ ] **Step 2: Run test and verify failure**

Run: `node scripts/harbour-tableau-check.mjs`
Expected: FAIL on missing requested semantic tags.

- [ ] **Step 3: Add minimal visible scene signals**

Add compact non-interactive SVG marks/signage/fixtures only where needed to make zones readable. Avoid filling the map with decorative flowers or unrelated still-life clutter. Use the existing background as temporary substrate; do not attempt a full new painted background in this checkpoint.

- [ ] **Step 4: Run test**

Run: `node scripts/harbour-tableau-check.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `feat: add harbour neighbourhood scene signals`

---

### Task 4: Integration verification without touching route logic

**Files:**
- Modify: `CODEX_VERIFICATION.md`

**Interfaces:**
- Consumes: all prior tasks.
- Produces: explicit verification record distinguishing automated structural checks from browser checks not performed in this connector-only environment.

- [ ] **Step 1: Run pure tableau check**

Run: `node scripts/harbour-tableau-check.mjs`
Expected: PASS.

- [ ] **Step 2: Run existing non-browser diagnostics available in a full checkout**

Run when a local checkout is available:
- `npm run build`
- `npm run test:production`
- `node scripts/harbour-interface-check.mjs`

If this ChatGPT connector environment cannot execute a full checkout, do **not** claim these ran; record them as required follow-up verification for Codex/local desktop.

- [ ] **Step 3: Browser acceptance checklist for local Codex/desktop**

At 1440×1000 and 390×844 verify:
- crowd visibly moves without player clicks;
- no ambient person stands in water;
- swimmers remain in water;
- named actors are visually grounded;
- target NPCs are somewhat harder to find but recognizable;
- storm reduces beach leisure and changes crowd distribution;
- hidden toad remains clickable;
- no new ambient crowd becomes interactive or alters economy/route state;
- no horizontal overflow regression;
- reduced-motion mode stops the loops.

- [ ] **Step 4: Update verification truthfully**

Document only checks actually run here, plus the explicit remaining browser/full-build checks.

- [ ] **Step 5: Commit**

Commit message: `docs: record harbour tableau scaffold verification`
