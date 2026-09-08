# Codex Handoff — Build Sunflower's Extensible Comic Scene System

Continue from the strongest current implementation lineage (currently reported as `63bcc4ae9536dd086b4f3e5425be998baa34e4ed`) and reconcile the latest `main` design documents into that tree. Do **not** restart from old `main` code just because the implementation commit is local to the Codex task.

Before coding, read:

1. `ART_DIRECTION.md`
2. `VISUAL_REFERENCE_INDEX.md`
3. `VISUAL_PRODUCTION_SPEC.md`
4. current canonical game/world/NPC documents

Then build the presentation system completely enough that final art can be added incrementally without rewriting gameplay UI.

## Mission

Sunflower must stop looking or behaving like a web text adventure.

The intended player loop is:

> illustrated scene → notice person/object/trace → direct interaction → meaningful decision → comic consequence → return to living scene

The scene itself is the main interactive surface.

Do not ship toward:
- pixel art;
- cute mascot/cartoon UI;
- anime/webtoon beauty style;
- visual-novel portrait boxes;
- card-dashboard menus;
- prose-first Twine/ChoiceScript presentation;
- repeated Continue/Confirm clicking.

## Engineering ownership

You may refactor presentation architecture aggressively.
Do not preserve current React component boundaries if they obstruct a coherent reusable scene engine.
Do not rebuild accepted economic/world logic merely for UI convenience.

Build reusable primitives, not one-off Joel/Yasmin screens.

## Required production architecture

### 1. Manifest-driven scene composition
Support:
- WIDE and WORK views;
- location backgrounds;
- actor cutouts;
- props;
- paper/document layers;
- local traces;
- weather/light/state overlays;
- semantic anchors;
- normalized desktop coordinates;
- mobile reflow metadata;
- z/occlusion;
- compatible pose/object classes;
- safe fallback assets.

A new final image should normally require `asset + manifest/presentation data`, not JSX rewrites.

### 2. Asset registry + provenance
Stable semantic IDs independent of filenames.
Track provenance/license/source metadata.
Never use third-party reference screenshots as runtime assets.

### 3. Interaction grammar
Normal flow:
`select object/person → legal targets/actions → one meaningful choice → resolve`.

Use 1–9, Esc, keyboard hotspot navigation, mouse and touch equivalence.
Hidden toads remain excluded from normal Tab/action discovery.

Remove redundant Confirm/Continue/OK/Close chains.

### 4. Live tableau + comic consequence stream
Do not create a separate cutscene renderer.
Use the same semantic asset registry for:
- Level 0 micro results;
- Level 1 1–2 panel consequences;
- Level 2 3–6 panel major cases.

Previous panels remain scrollable.
Manual scroll pauses auto-follow and provides `Latest ↓` to resume.

### 5. Diegetic workbench
Newspaper, Phone, Notebook and Ledger may remain semantic accessible components under the hood, but visually behave as handled objects/surfaces rather than generic SPA tabs.

### 6. Scene density
Build support for mechanically active entities, informative traces and non-utility life in the same scene.
Do not generate fake quest clues for every detail.
The scene should remain interesting after the player already understands the current actionable objects.

### 7. Scene Lab — required, not optional polish
Provide a developer-only authoring mode, e.g. `?sceneLab=1`.

Must support:
- choose location/runtime snapshot;
- WIDE/WORK;
- desktop/390px preview;
- drag/reposition presentation entities or anchors;
- normalized x/y;
- scale;
- z;
- mirror;
- asset variant;
- mobile group/order;
- hotspot bounds;
- anchor names;
- safe-area overlay;
- layer visibility;
- fallback preview;
- validation;
- export/copy stable scene JSON.

Scene Lab changes presentation metadata only, never simulation truth.

### 8. Art coverage tooling
Use scripted/observed gameplay exposure to produce P0/P1/P2 asset priorities with:
- semantic asset ID;
- fallback used;
- location/event usage;
- exposure/frequency;
- dependent anchors;
- estimated visual impact.

The creator should be able to replace roughly the top 15 assets and improve a large fraction of the visible game immediately.

### 9. Real browser proof
If system Chrome is absent, attempt Playwright Chromium installation if package installation is available.
Verify at least 1440×1000 and 390×844.

Acceptance scenes:
- Joel's Bar with 3+ autonomous named people;
- Aspen with social/leave trace;
- Wong custody scene;
- Yasmin acquisition/auction;
- Dima back-room route after sanction;
- Octopus institutional resource handling;
- Juan nursery/Onewheel;
- hidden toad;
- Toad-circle scene;
- Grandma supper;
- Short Crate;
- Sun Moment.

## Final acceptance

Do not call this done because placeholders render.

Prove:
- the same location background supports multiple NPC combinations;
- characters/props move among semantic anchors without JSX changes;
- final asset replacement does not require gameplay-code change;
- the scene remains readable with most text temporarily hidden;
- mobile reflows rather than miniaturizes;
- mouse/keyboard/touch reach equivalent consequential actions;
- hidden toads remain genuinely visual discoveries;
- consequence panels reuse the live-scene asset system;
- Scene Lab can author layout safely;
- the art coverage report tells the creator what to draw next;
- representative interactions have far fewer navigation/confirmation clicks than meaningful decisions.

Do not generate final artwork.
Build the stage, authoring tools and runtime composition so the creator can supply final art later.