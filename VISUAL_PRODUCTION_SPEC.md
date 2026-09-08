# Sunflower — Visual & Interaction Production Specification

> Status: production specification for implementation. Read together with `ART_DIRECTION.md` and `VISUAL_REFERENCE_INDEX.md`.
>
> Goal: make Sunflower feel like an **interactive printed comic world** rather than a web text adventure. The player should spend attention on *looking, comparing, deciding and handling things*, not on traversing menus or repeatedly clicking Continue.
>
> This document defines the presentation system Codex should build so final art can be added incrementally without redesigning gameplay code.

---

# 1. Product feeling

The target experience combines three independent strengths:

1. **Narrative-comic social observation** — flat, specific adult people; ordinary gestures; strong scene palettes; environments that explain work/class/relationships.
2. **Tactile diegetic interaction** — papers, goods, receipts, claims, phones, ledgers, parcels and tools occupy a persistent physical work surface or scene instead of generic UI cards.
3. **Illustration-first exploration** — locations are visually rich enough that looking at them is enjoyable even before the player knows what is useful.

The player should feel:

> I entered a place.
> People were already doing things.
> I noticed something.
> I touched / moved / offered / inspected / asked about something.
> The world answered.

Not:

> I opened NPC tab.
> I selected Action.
> I confirmed.
> I clicked Continue six times.

---

# 2. Absolute presentation bans

Do not ship toward any of these:

- pixel art;
- cute/chibi default character treatment;
- cozy-kawaii game framing;
- anime or beautified webtoon faces;
- visual-novel portrait-over-background layout;
- generic card-dashboard UI;
- text-adventure page with most of the screen occupied by prose/buttons;
- realistic 3D or photoreal cinematic art;
- polished startup-vector illustration;
- RPG skill icons over characters;
- floating heart/reputation meters;
- quest exclamation marks;
- giant glowing outlines around ordinary clickable things;
- every object explained by tooltip before the player looks at it;
- every social scene reduced to a dialogue tree.

---

# 3. Core screen grammar

Sunflower uses a persistent **live tableau** plus an accumulating **comic consequence stream**.

## 3.1 Desktop composition

Approximate layout intent, not fixed pixels:

```text
┌──────────────────────────────────────────────────────────────┐
│ compact day / cash / attention / urgent commitment status   │
├──────────────────────────────┬───────────────────────────────┤
│                              │                               │
│       LIVE SCENE             │      ACTIVE OBJECT / PAPER    │
│                              │                               │
│ people                       │ claim / parcel / order slip    │
│ environmental objects        │ invitation / evidence         │
│ local traces                 │ dialogue / transaction         │
│ subtle background life       │                               │
│                              │                               │
├──────────────────────────────┴───────────────────────────────┤
│ compact contextual actions / target resolution              │
└──────────────────────────────────────────────────────────────┘

                         ↓ consequence ↓

┌──────────────────── comic panel ─────────────────────────────┐
└──────────────────────────────────────────────────────────────┘
┌────────────── panel ─────────────┐ ┌──── panel ──────────────┐
└──────────────────────────────────┘ └──────────────────────────┘
```

The player remains on one continuous page. Consequences grow below the present scene rather than replacing it with a separate cutscene mode.

## 3.2 Mobile composition

390px is a reflow, not a shrunken desktop.

Preferred order:

```text
STATUS
SCENE CROP / FOCAL AREA
ACTIVE OBJECT / PAPER
CHOICE
COMIC CONSEQUENCE
COMIC CONSEQUENCE
```

If many NPCs are present, show a readable focal composition and secondary-presence indicators rather than shrinking six people into tiny unreadable figures.

---

# 4. Scene content has three layers

Every major location must contain all three.

## Layer A — mechanically active
People/objects currently usable:
- present NPC;
- active parcel;
- auction lot;
- claim;
- bench;
- cargo;
- rare fish;
- current order slip.

## Layer B — informative traces
Objects that teach the world without becoming buttons:
- half-empty drink;
- chalked price;
- wet coat;
- packing scraps;
- yesterday's receipt;
- crossed-out appointment;
- plant labels;
- open crate;
- chair pulled away;
- second glass for someone absent.

These help the player predict people and reconstruct events.

## Layer C — non-utility life
Objects/figures that are interesting but not route keys:
- background customer;
- gull stealing something;
- crooked sign;
- bucket catching a leak;
- someone arguing off to the side;
- harmless clutter;
- visual joke;
- hidden toad.

**Requirement:** no major location should look like a clean room containing only currently actionable objects.

This is the most important lesson from illustration-first hidden-object scenes: density should reward looking without turning every detail into a quest clue.

---

# 5. Perspective and spatial style

Do not require strict photographic perspective.

The scene should be spatially coherent enough for interaction, but composition may exaggerate scale and angle to make social information readable.

Allowed:
- oversized foreground person/prop;
- compressed depth;
- cutaway theatre walls;
- one object drawn larger because it matters;
- background micro-scenes;
- strange but readable spatial joins;
- establishing scene containing several seconds/minutes of social information rather than one frozen photographic instant.

Avoid:
- impossible click-target overlap that makes interaction ambiguous;
- cinematic depth-of-field blur;
- perspective complexity that reduces object readability.

---

# 6. Location master-view system

Each major location should support two main view classes.

## WIDE
Use for:
- arriving;
- multi-person autonomous activity;
- hidden-object discovery;
- social event;
- auction crowd;
- Sun Moment;
- reading environmental traces.

## WORK
Use for:
- inspecting goods;
- handling a claim;
- private transaction;
- paperwork;
- two-person negotiation;
- assembly/service work;
- close object manipulation.

Comic panels may crop/reframe these assets into:
- MEDIUM;
- CLOSE;
- INSERT;
- CROWD;
- VOID/SPACE.

Do not make every event demand a new full-scene illustration.

---

# 7. Scene composition must be data-driven

The renderer must not hard-code each location in JSX.

A runtime scene is:

```text
scene identity
+ current entities
+ semantic anchors
+ asset variants
+ props
+ traces
+ overlays
+ interaction state
```

not a pre-rendered screenshot.

Example semantic structure:

```js
{
  sceneId: 'joels_bar',
  view: 'wide',
  people: [
    { actorId: 'joel', pose: 'bar_work', anchor: 'counter_inside' },
    { actorId: 'aspen', pose: 'seated_social', anchor: 'window_a' }
  ],
  props: [
    { assetId: 'prop_drink_half_full', anchor: 'window_table_1' },
    { assetId: 'prop_route_note', anchor: 'window_table_2' }
  ],
  traces: ['chair_recently_moved'],
  overlays: ['rain_window']
}
```

Final artwork should be replaceable without touching game logic.

---

# 8. Anchor system

Every location defines named anchors with normalized coordinates and compatibility rules.

Example for Joel's Bar:

- `counter_inside_left`
- `counter_inside_right`
- `counter_customer`
- `window_a`
- `window_b`
- `back_table_a`
- `back_table_b`
- `door_wait`
- `floor_near_counter`
- `perch_back`
- `counter_prop_1`
- `counter_prop_2`
- `table_prop_1`
- `table_prop_2`

Anchor metadata should include:

```js
{
  id,
  desktop: { x, y, scale },
  mobile: { group, order, scale },
  z,
  mirrorAllowed,
  allowedKinds,
  safeArea
}
```

Do not center every person by default.

Nonhuman current presentations require suitable anchors:
- Wong: floor/low platform/counter-adjacent;
- Dima: perch/desk/railing where current Seagull continuity is used.

---

# 9. Character production model

Do not create huge expression libraries.

For each major NPC initial production target:

1. `neutral_full`
2. `work_half`
3. one mechanically important work pose
4. one social pose

Optional later:
- rare high-stakes pose;
- one tired/altered pose if repeatedly useful.

State is communicated through:
- posture;
- facing direction;
- current object;
- distance from another person;
- unfinished drink/food;
- clothing/gear relevant to work;
- scene position;
- dialogue.

A player should understand `Aspen is about to leave` from body orientation + watch + untouched drink before reading a state label.

---

# 10. Props are first-class narrative assets

When choosing between another facial expression and a meaningful object, prefer the object.

P0/P1 prop families should include:

- tins/cash;
- public order slip;
- clearing receipt;
- tab / IOU;
- claim paper;
- collateral tag;
- parcel;
- wrapped gift;
- invitation;
- auction catalogue;
- provenance photo/document;
- Lime crate;
- rare fresh fish;
- Steel Rim;
- Onewheel part bundle;
- Built Onewheel;
- Sunflower;
- toad;
- drink glass;
- Aspen route/watch papers;
- Wong packing materials;
- Juan plant labels;
- Yasmin lot labels;
- Dima settlement envelope.

Not all 80+ physical goods need bespoke art. Ordinary goods may initially use family-level containers/bundles until they become mechanically or narratively prominent.

---

# 11. Hotspot behavior

## 11.1 Normal objects

Visible shape may be small; hit target may be larger.

Mouse/touch:
- no permanent outline;
- hover/tap may add restrained ink/print emphasis;
- selection reveals legal target relations.

Keyboard:
- Tab/arrow focus provides a small printed outline/number marker;
- no neon glow.

## 11.2 Hidden toads

Toads intentionally break normal discoverability rules.

Default:
- not listed in action panel;
- not in normal keyboard Tab order;
- no number label;
- no sparkle;
- no glow;
- no `TOAD NEARBY` text;
- collection costs no attention after reaching scene.

Accessibility option:
- `Reduced hidden-object difficulty` may allow a delayed subtle cue (tiny movement, environmental sound, slight contrast shift) after the player has remained in the scene for a while.

Never convert the toad into a routine collectible marker.

---

# 12. Interaction grammar: one intention, one real decision

Default interaction shape:

```text
select person/object
→ legal targets/actions become available
→ choose one meaningful action
→ world resolves
→ consequence shown
```

Avoid chains such as:

```text
Select object
Confirm
Select person
Confirm
Select bench
Confirm
Assemble
Confirm
Continue
Close
```

Example:

```text
Steel Rim selected
→ Wong's bench becomes valid
→ [1] Assemble  [2] Ask Wong first
→ player chooses
→ montage resolves
```

Material commitments may deserve one explicit confirmation if accidental execution would be costly (large bid, pledge collateral, irreversible misrepresentation). Routine actions should not.

---

# 13. Keyboard and touch

Required shortcuts:
- `1–9`: current meaningful choices;
- `Esc`: clear focus/back;
- `Tab` / arrows: navigate normal hotspots;
- dedicated shortcuts for Notebook / Newspaper / Phone / Ledger.

Mouse, keyboard and touch must expose equivalent decisions.

The interface should be fully playable without precision mouse movement except hidden-toad discovery by design.

---

# 14. Dialogue / montage system

Sunflower is not a visual novel.

Ordinary dialogue beats auto-progress until a real decision or deliberate reading point.

Stop auto-progression only for:
- player decision;
- evidence/object inspection;
- material commitment;
- unusually important short text.

Do not require Enter/click after every sentence.

## Auto-follow behavior

Comic/dialogue history remains scrollable.

If player manually scrolls:
- suspend auto-follow;
- show small `Latest ↓` affordance;
- resume only when player requests it.

Never yank the viewport away while the player is reading old information.

---

# 15. Consequence panel weight

Not every action deserves a comic sequence.

## Level 0 — micro
Examples:
- repeat simple purchase;
- routine phone follow-up;
- ordinary small settlement.

Presentation:
- live scene changes;
- one compact result line or object state change.

## Level 1 — meaningful routine
Examples:
- Wong accepts custody;
- Aspen buys luxury gift;
- player sells actionable lead;
- claim gets rolled.

Presentation:
- 1–2 comic panels.

## Level 2 — major case/event
Examples:
- Short Crate;
- Auction;
- Grandma supper;
- Toad circle;
- guarantee called;
- Fire Sale;
- public-market suspension;
- Sun Moment.

Presentation:
- typically 3–6 panels.

Repeated familiar sequences should visually compress after the player has already seen the expanded form.

---

# 16. Diegetic workbench surfaces

Newspaper, Phone, Notebook and Ledger remain always accessible but should eventually feel like handled objects, not SaaS tabs.

Conceptual behavior:
- Newspaper is pulled/opened into active-object area;
- Phone sits on/near work surface and can be brought forward;
- Notebook opens physically and retains marks/clippings;
- Ledger/claims feel more administrative and rigid;
- Octopus slips/receipts can physically overlap Notebook or Ledger context.

The implementation may still use accessible semantic HTML under the hood; visual presentation must remain object-based.

---

# 17. Octopus visual language

Octopus must read as an **institution**, not another merchant counter.

Visual vocabulary:
- standardized forms;
- numbered receipts;
- owner tags;
- trays / slots / cages / deposit areas;
- visible separation between committed client resources and institution equipment;
- cleared/returned piles;
- public tape/record;
- stamps or mechanical processing marks;
- neutral procedural layout.

The visual system must never imply:
- client float belongs to Octopus;
- physical goods cease to have individual owners before settlement;
- the institution's room is equivalent to privately owned marine stock.

---

# 18. Scene density guidelines

Sunflower should feel **observably busy**, not visually noisy.

A WIDE scene should usually contain:
- 2–5 major readable focal masses;
- 3–8 mid-level informational props/traces;
- 6–20 small incidental details/micro-stories where the location supports it.

The exact count is not a rule. The goal is:

> after the player has learned every current action, the scene still contains things worth looking at.

Use large flat colour masses to organize detail.
Use contour/silhouette separation to prevent soup-like clutter.

---

# 19. Colour system

Do not force one global palette onto every location.

Use a **scene palette family** per place/time, while maintaining common print logic.

Global material character:
- matte;
- opaque;
- printed rather than luminous;
- strong flat colour relationships;
- subtle paper tooth/ink variance.

Suggested recurring family:
- teal / harbour blue;
- mustard / old yellow;
- rust / tomato;
- bottle/olive green;
- dusty rose;
- warm paper/cream;
- mauve/concrete grey;
- charcoal/brown.

But locations should differ:

### Joel's Bar
warm rust / teal / bottle green / old cream; dark but socially readable.

### Aspen berth
cool harbour blue / rusted orange / rope beige / weather grey.

### Yasmin
deep green / wine / old cream / silver-grey / controlled brighter accent.

### Wong
cheap mixed materials, faded packaging, rust, blue-green, dirty cream; not whimsical junk-shop rainbow.

### Juan
plant green / soil brown / faded labels / warm plastic / occasional synthetic colour.

### Dima
dry grey / off-white / tobacco / oxidized metal / one restrained signal colour.

### Octopus
procedural cream/grey/ink with one institutional accent distinct from any individual NPC.

Colour should also guide *reading order*, not just mood.

---

# 20. Typography

Typography should support print/comic materiality without reducing legibility.

Use roles:

- body text: highly readable, compact;
- labels/forms: utilitarian institutional or typewriter-like family;
- handwritten/annotated marks: sparingly, only when diegetic;
- newspaper: editorial hierarchy;
- comic speech: readable print/comic lettering, not novelty font everywhere.

Avoid:
- tiny handwriting for critical gameplay;
- overusing distressed typefaces;
- making every subsystem use a different decorative font.

---

# 21. Animation and motion

Keep interaction simple.

Most scenes need only small, low-cost loops:
- blink;
- drink lifted once;
- paper moved;
- gull hops;
- plant shifts;
- rain;
- ceiling fan;
- somebody checks watch;
- phone vibrates;
- toad makes one tiny motion.

Avoid constant idle animation that makes the whole scene twitch.

Motion is valuable when it communicates state.

---

# 22. Sun Moment presentation

No mystical glow, magic particles or spiritual UI.

When Sun Moment occurs:
- ambient human movement stops;
- ordinary interface remains materially present;
- sound/motion thins;
- only selected environmental processes continue (water, paper edge, leaf, melting ice, etc.);
- negative space becomes perceptually stronger;
- if a late action exists, only the relevant hand/paper/object continues visibly.

Do not implement plant transformation from the current proposal unless separately authorised.

---

# 23. Scene-specific visual storytelling examples

## Aspen leaving Joel's Bar
Do not show `URGENT` icon.
Show:
- body angled toward exit;
- watch/route note visible;
- drink relatively untouched;
- coat/bag already in hand;
- next panel may show chair empty.

## Juan owes Joel money
Do not show `DEBT -2` floating text.
Show:
- tab/IOU physically nearer Juan;
- Joel's tab book open;
- later claim/settlement can appear in Ledger.

## Dima handling a private settlement
Do not give him a black-market badge.
Show:
- sealed envelope;
- folded claim;
- private back-room geometry;
- whoever is waiting keeps distance;
- fewer standardized labels than Octopus.

## Yasmin hosting Auction
Do not draw everyone automatically.
Show conditional attendance.
Empty chair, proxy paper, or absent coat can carry information.

## Hidden toad
Place it where it is plausible but visually camouflaged:
- among bottles/crates;
- next to damp plant pot;
- below stair/pipe;
- against patterned packing paper.

It should be discoverable by attention, not by random pixel tapping.

---

# 24. Asset registry architecture

Use stable semantic IDs independent of physical filename.

Example:

```js
characters: {
  aspen: {
    neutral: 'char_aspen_neutral_v01',
    work: 'char_aspen_route_v01',
    cargo: 'char_aspen_cargo_v01',
    social: 'char_aspen_social_v01'
  }
}
```

Location:

```js
locations: {
  joels_bar: {
    wide: 'loc_joels_bar_wide_v01',
    work: 'loc_joels_bar_work_v01',
    anchors: [...]
  }
}
```

Props:

```js
props: {
  bar_tab: 'prop_bar_tab_v01',
  wrapped_gift: 'prop_wrapped_gift_v01',
  rare_fish: 'prop_rare_fish_v01'
}
```

Missing final assets must fall back safely to restrained placeholders.

Adding/replacing art should normally require:

> add file + update manifest

not gameplay React edits.

---

# 25. Asset provenance fields

Every authored asset registry entry should support:

- `assetId`
- `file`
- `author/source`
- `license/provenance note`
- `version`
- `type`
- `defaultAnchorCompatibility`
- `mobileBehavior`
- `transparentBackground`
- `fallbackId`
- optional `notes`

Do not mix third-party reference screenshots into runtime assets.

---

# 26. Scene Lab — required production tool

Build a developer-only Scene Lab.

Recommended access:
- explicit dev route or `?sceneLab=1`.

Capabilities:

### Scene
- choose location;
- choose WIDE/WORK;
- load real runtime snapshot;
- choose desktop / 390px.

### Layers
- background;
- actors;
- props;
- traces;
- overlays;
- interaction state.

### Authoring
- drag entity to compatible anchor;
- edit normalized x/y;
- scale;
- z;
- mirror;
- select asset variant;
- mobile order/group;
- show safe areas;
- show hotspot geometry;
- edit hotspot rect/polygon;
- show anchor names;
- validate incompatible pose/anchor pairing.

### Output
- copy/export presentation JSON;
- persist stable scene metadata;
- validate manifest;
- report missing assets;
- never mutate simulation truth.

Moving Yasmin in Scene Lab must not change her simulated location.

---

# 27. Art coverage report

Build tooling that ranks which assets should be authored next using actual game exposure.

Output:

```text
P0
asset semantic id
fallback used
locations/events
observed exposure count
estimated share of player-visible scenes
impact

P1
...
```

The creator should be able to make the first ~15 high-value final assets and significantly transform the game before completing the full library.

---

# 28. Initial production priority

Do not begin by drawing every inventory item.

Suggested first visual tranche:

## P0 locations
1. Joel's Bar WIDE
2. Workbench / desk
3. Harbour berth WIDE
4. Octopus Clearing WIDE/WORK

## P0 characters
5. Joel work
6. Aspen neutral/work
7. Juan neutral/work
8. Yasmin neutral/host
9. Wong current neutral
10. Dima current neutral

## P0 props
11. tins/cash
12. parcel
13. order slip / clearing receipt
14. claim / IOU
15. drink

Next tranche should be selected by coverage report, not intuition alone.

---

# 29. Web/interaction implementation rule

The technical implementation may use React/HTML/CSS, but it must not visually reveal its web-app skeleton.

Allowed under-the-hood:
- semantic buttons;
- accessible focus;
- DOM layers;
- responsive CSS;
- ARIA labels.

Not acceptable visually:
- grid of cards as the primary world representation;
- generic `<select>`-heavy market interface as final presentation;
- rows of rectangular CTA buttons dominating the screen;
- component-library dashboard aesthetics.

Accessibility and semantic HTML should be preserved while visual treatment remains scene-first.

---

# 30. Acceptance scenes

Before final art production, the placeholder engine must prove these with the same scene system:

1. Joel's Bar with 3+ autonomous named people.
2. Aspen alone vs Aspen with a second-seat trace.
3. Wong counter with parcel custody.
4. Yasmin private acquisition + separate delivery path.
5. Auction with conditional attendance.
6. Dima back room after public sanction.
7. Octopus committed goods/cash + returned resources.
8. Juan nursery with Onewheel parts.
9. Hidden toad discovery without action-list hint.
10. Toad circle social event.
11. Grandma supper.
12. Short Crate consequence sequence.
13. Sun Moment.

For each, verify desktop and 390px.

---

# 31. Interaction-friction acceptance

Measure representative tasks by:

- meaningful decisions;
- navigation clicks;
- confirmation clicks;
- Continue/close clicks.

The target is not an exact numeric ratio, but a typical intention should require very little interface overhead after the player has selected the relevant person/object.

Examples:

### Inspect Auction lot
Good:
`lot → inspect`

Bad:
`Yasmin tab → Auction card → Inspect menu → Confirm → Continue`.

### Give rare fish to Joel / supper
Good:
`fish → Joel / invitation scene → commit`

Bad:
`Inventory → Fish card → Use → NPC list → Joel → Confirm → Quest Complete`.

---

# 32. Final design test

The final presentation passes if a screenshot with all text temporarily hidden still communicates:

- where the player is;
- who is present;
- what kind of work happens there;
- at least one relationship or economic tension;
- at least one thing worth looking at;
- enough visual hierarchy to know where to look first.

If removing text makes the game unintelligible, the scene is still functioning as a text adventure wearing illustrations.

---

# 33. Codex implementation directive

Codex should use this document as a **production-system contract**, not a list of one-off scenes.

Build reusable primitives that make future expansion cheap:

- manifest-driven scene composition;
- semantic anchors;
- asset registry;
- layered props/actors/traces;
- shared consequence-panel renderer;
- input abstraction for keyboard/mouse/touch;
- Scene Lab;
- art coverage tooling;
- mobile reflow;
- safe fallbacks;
- provenance-aware asset metadata.

Do not hard-code final artwork.
Do not generate final images.
Do not rebuild the economic engine to satisfy visual work.

The desired result is that future production can add a new location, character pose or prop by supplying art + manifest/presentation data, with minimal or no new gameplay UI code.