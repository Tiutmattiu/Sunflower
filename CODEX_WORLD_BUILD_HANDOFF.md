# Sunflower — Codex World-Build & Production Finish Handoff

> Mission type: **production consolidation + world construction + interaction finish**.
>
> This is not a new architecture phase and not another design audit.
>
> Build the actual playable world on top of the strongest existing implementation.

---

# 0. Repository / lineage warning

The remote repository currently has a stale PR branch and a stronger local Codex implementation lineage.

Known strong local implementation from the immediately preceding Codex production task:

- `63bcc4ae9536dd086b4f3e5425be998baa34e4ed` — consolidated production implementation.

That commit was reported clean but may not yet exist on a published GitHub branch.

Remote `main` contains newer design-only commits, including:

- `da733c662a5de2c8d3120f72964c5656581a6dc2` — creator-approved economy/route/toad clarifications;
- `VISUAL_REFERENCE_INDEX.md`;
- `VISUAL_PRODUCTION_SPEC.md`;
- `CODEX_VISUAL_HANDOFF.md`;
- `WORLD_SCENE_BIBLE.md`.

Do **not** restart implementation from remote main if that would discard the stronger local runtime lineage.

If working in the same Codex task/clone that owns `63bcc4ae...`:

1. preserve that implementation tree;
2. configure/fetch `origin` if needed;
3. fetch latest `main`;
4. reconcile the new design/world-scene Markdown into the strong implementation;
5. resolve conflicts by preserving current design authority and strongest working runtime;
6. continue from the reconciled tree.

Do not waste a run narrating branch history.
Do the reconciliation, then build.

---

# 1. Read these sources before implementation

Product/canon:

- `GAME_DESIGN.md`
- `WORLD_CANON.md`
- `NPC_CHARACTER_BIBLE.md`
- `ITEM_ECONOMY.md`
- `DESIGN_WORKBOOK.md`
- `INFORMATION_DISCOVERY_MODEL.md`
- `DIALOGUE_MONTAGE_BANK.md`

Visual / interaction:

- `ART_DIRECTION.md`
- `VISUAL_REFERENCE_INDEX.md`
- `VISUAL_PRODUCTION_SPEC.md`
- `WORLD_SCENE_BIBLE.md`

The four visual files are complementary:

- `ART_DIRECTION.md` — drawing/comic language;
- `VISUAL_REFERENCE_INDEX.md` — reference decomposition;
- `VISUAL_PRODUCTION_SPEC.md` — renderer/interaction/asset rules;
- `WORLD_SCENE_BIBLE.md` — environment/world/location identity.

Do not generate final artwork.
Use production-quality placeholders and infrastructure.

---

# 2. Product target

The next playable build should no longer feel like:

> a sophisticated simulation displayed through a web app.

It should feel like:

> **an interactive illustrated harbour that happens to contain a sophisticated simulation.**

Player flow:

```text
LOOK AT SCENE
→ NOTICE PERSON / OBJECT / TRACE
→ DIRECTLY INTERACT
→ MAKE A REAL DECISION
→ SEE A COMIC CONSEQUENCE
→ RETURN TO A LIVING SCENE
```

Not:

```text
TAB
→ CARD
→ ACTION LIST
→ CONFIRM
→ CONTINUE
→ CLOSE
```

The webpage implementation must disappear behind the world.

---

# 3. Finish the existing production systems, do not replace them

Preserve and strengthen the already completed:

- Living Harbour economy;
- three Sunflower routes;
- 30/30 directed named-NPC relational candidate capability;
- named NPC autonomous interactions;
- formal Octopus standing/sanctions;
- Dima private-market route;
- six return-class player substrate;
- hidden-toad ownership/collection/social loop;
- player diagnosis;
- Market Scars;
- reusable `SceneStage` / art manifest work.

Do not rebuild these from scratch.

---

# 4. Remaining gameplay proof

## 4.1 Market Scars

Definitions are insufficient.

Final target:

- 24/24 have a genuine player-facing causal path;
- `C` missing-path count = 0;
- `D` broken count = 0.

Rare remains rare.
No fake test-only award injection.

Especially close and reproduce:

- FIRST THROUGH THE GAP;
- FIRE SALE;
- SOLD THE MAP;
- TAUGHT YOUR RIVAL;
- RUN ON YOU.

Record evidence IDs and causal chain.

## 4.2 Six specialist careers

Previous one-shot profits prove entry only.

Run sustained ~20–30 day player careers for:

- TRADE;
- OPERATE;
- INVEST;
- FINANCE;
- INTERMEDIATE;
- SPECULATE.

Aim for >=90% of realised positive return from the selected class.
Supporting procurement/travel/social actions do not count as return diversification.

Measure:

- realised gross;
- costs;
- net realised return;
- counterparties;
- repeat counterparties;
- active days;
- no-opportunity days;
- capital lock;
- worst loss/drawdown;
- failed attempts;
- recovery;
- named-vs-background dependence.

If one specialist career collapses after one authored opportunity, deepen existing economic substrate instead of faking another payout.

---

# 5. Named NPC economy must remain primary

Measure player value exchanged with:

- Aspen;
- Joel;
- Yasmin;
- Wong;
- Juan;
- Dima;

separately from anonymous/background actors.

Background demand may support depth and recurrence.
It must not quietly become the real game while named actors supply only stories.

Report both value share and transaction count share.

---

# 6. Build the world-facing scene system fully

Use `VISUAL_PRODUCTION_SPEC.md` and `WORLD_SCENE_BIBLE.md` as implementation requirements.

## Required scene semantics

Each location supports:

- WIDE tableau;
- WORK composition;
- semantic anchors;
- people layers;
- prop layers;
- document/paper layers;
- foreground/occlusion;
- weather/time overlays;
- local traces;
- active hotspots;
- non-utility life;
- consequence panels using the same asset registry.

A scene must contain all three content layers:

A. currently actionable;
B. informative traces;
C. ordinary/non-utility world life.

If a location contains only action targets it has failed.

---

# 7. Joel's Bar is the flagship world-building proof

Implement the full placeholder composition logic from `WORLD_SCENE_BIBLE.md`.

It should combine:

- Brisa-like ingredient/craft visibility;
- less commercial / less mall-polished material life;
- chic but intimate North-African / Middle-Eastern lounge geometry/material cues;
- flat comic composition;
- soupsoup-like scene richness without cute tone;
- adult social awkwardness and body language;
- real economic props/traces.

Do not build an "Arabic themed bar" skin.

Avoid:

- lantern-wall clichés;
- generic Arabian Nights;
- nightclub gold overload;
- permanent shisha branding;
- fake Arabic script decoration;
- every surface patterned.

Use:

- plaster/limewash;
- restrained arches/niches/screens;
- terracotta/cacao/rust;
- cobalt/turquoise/green accents;
- textiles;
- brass/copper details;
- low/mixed seating pockets;
- visible jars, citrus, spices, cacao, infusions and tools;
- handwritten experiments;
- repaired furniture;
- tabs, claims, parcels, route notes, invitations;
- occasional shisha as a real social object;
- micro-stories and traces.

The same Bar background/composition system must support:

- Joel alone working;
- Joel + Juan tab evening;
- Joel + Aspen brief visit/early exit;
- Joel + Yasmin + Dima social/settlement evening;
- 3+ named people with background life;
- a missed meeting trace;
- parcel/gift handoff trace;
- hidden toad;
- Sun Moment.

No new JSX per combination.

---

# 8. Make all major locations visually distinct before labels

Use `WORLD_SCENE_BIBLE.md`.

Required world identities:

- Workbench — handled documentary/economic still life;
- Harbour berth — weather/cargo/deadlines/movement;
- Joel's Bar — artistic social convergence + ingredient craft;
- Wong — dense practical storage/custody, not cute junk shop;
- Juan — greenhouse/scientific growing mess;
- Yasmin — controlled provenance/capital chamber with social pressure;
- Dima — quiet real settlement room, not gangster lair;
- Octopus — public institution, visibly distinct from merchant inventory;
- Sonya — worn domestic kitchen / non-market hospitality;
- Cliff — sparse large negative-space landscape.

If two locations could exchange labels without looking wrong, world construction is not finished.

---

# 9. Scene Lab is required production infrastructure

Build or finish a developer Scene Lab.

Suggested route/query:

`?sceneLab=1`

Must support:

- choose location;
- load actual runtime scene snapshot;
- WIDE/WORK mode;
- desktop and 390px preview;
- show anchor IDs;
- drag presentation entities;
- normalized x/y;
- scale;
- z/occlusion;
- mirror;
- mobile group/order;
- asset variant selection;
- hotspot shape/bounds;
- safe-area overlay;
- show/hide layers;
- fallback visualization;
- copy/export scene JSON;
- validation of incompatible pose/anchor combinations.

Scene Lab modifies presentation metadata only.
It must not move actors in simulation truth.

---

# 10. Art asset pipeline must make future art cheap

Goal:

> adding authored final art should usually mean DROP FILE + REGISTER/SELECT ASSET, not rewrite gameplay UI.

Maintain semantic asset IDs separate from physical filenames.

Support:

- fallback placeholder;
- missing-asset report;
- unused-asset report;
- asset dimensions/aspect validation;
- anchor compatibility;
- desktop/mobile rendering;
- P0/P1/P2 art-coverage ranking based on actual gameplay exposure.

The creator should be able to replace the first ~15 high-value assets and visually transform most early play.

---

# 11. Consequence comic system

Use the same scene/asset registry; do not build a separate cutscene art pipeline.

Presentation levels:

- LEVEL 0 — scene update + compact result;
- LEVEL 1 — 1–2 panels;
- LEVEL 2 — 3–6 panels.

Demonstrate:

- ordinary private trade;
- Wong custody/handoff;
- Short Crate;
- Auction;
- Octopus settlement/release;
- hidden-toad discovery/social invitation;
- Grandma supper;
- sanction/private-market consequence;
- Sun Moment.

Dialogue should auto-progress through non-decisions.
Manual scroll pauses auto-follow and exposes `Latest ↓`.

---

# 12. Mobile

390px is not a shrunk desktop scene.

Preferred sequence:

```text
compact status
scene/focal crop
active object/paper
meaningful choice
comic consequence stream
```

For crowded scenes:

- retain one readable focal composition;
- indicate secondary present actors without turning everyone into tiny sprites;
- allow focal switching.

Do not fall back to an action-card list because the viewport is narrow.

---

# 13. Interaction friction

Measure meaningful decisions vs navigation/confirmation actions.

Default target:

> one intention → one meaningful decision.

Remove unnecessary:

- Confirm;
- Continue;
- OK;
- Close.

Keep explicit confirmation only for genuinely costly/irreversible actions such as:

- large binding bid;
- collateral pledge;
- explicit misrepresentation;
- similarly material commitment.

---

# 14. Real browser requirement

Do not accept `command -v chromium` failure as proof that browser testing is impossible.

If environment policy permits:

- install Playwright Chromium/runtime dependencies;
- run actual browser play.

Test at least:

- 1440 × 1000;
- 390 × 844.

Walk through:

- first session;
- Bar with 3+ named actors;
- direct person/object interaction;
- hidden toad;
- Phone/Notebook/Newspaper/Ledger;
- Wong/Dima gift path;
- public sanction → Dima alternative;
- Octopus;
- Auction;
- Onewheel;
- Grandma supper;
- comic consequence stream;
- Scene Lab;
- keyboard 1–9 / Esc / shortcuts.

Fix visual/interaction failures found.

---

# 15. Audio is NOT required in this pass

`WORLD_SCENE_BIBLE.md` records the future target:

- North-African / Middle-Eastern instrumental fusion;
- jazz / neo-soul / R&B language;
- warm urban nocturnal texture;
- potential oud/qanun/ney/guembri/riq/bendir + Rhodes/bass/brushed kit/horns;
- no tourist "Arabian" loops.

Do not spend this pass sourcing BGM unless all higher-priority production work is complete.

No unlicensed audio may enter the repository.

---

# 16. Do not implement reopened plant/Bloom proposal

Still NOT accepted runtime canon.

Do not restore:

- animal form progression;
- reincarnation;
- estate inheritance;
- seed→human replay;
- automatic plant transformation.

Keep current Sun Moment only.

---

# 17. Final delivery

Work first.
Do not stop after audit, moodboard or architecture proposal.

Deliver one reconciled implementation commit and publish it to a current branch/PR if available.

Final report should include:

1. starting implementation commit;
2. latest main authority reconciled;
3. final commit;
4. 24 Scar executable table;
5. six specialist-career results;
6. named-vs-background economy share;
7. scene engine/world-building changes;
8. Joel's Bar composition proof;
9. major-location differentiation proof;
10. Scene Lab capabilities;
11. art coverage P0/P1/P2;
12. consequence-panel examples;
13. interaction-friction counts;
14. desktop/mobile browser findings;
15. remaining final-art/dialogue/audio polish only;
16. exact branch/PR publication state.

## Most important

Do not build another dashboard.
Do not build another test harness as the player's face.
Do not generate final art.

Use the existing simulation as the hidden machinery.

**Build the harbour people actually see.**