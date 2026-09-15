# Codex Local World Integration Pass

> **Owner:** Codex owns the single-writer window on `main` for this pass. ChatGPT is read-only reviewer until Codex pushes a coherent handoff checkpoint.
>
> **Purpose of this file:** save Codex from re-reading the whole project. This is the working brief. Read the short authority set below, preserve your local unpublished work, then execute. Do not spend a long session reconstructing old design history.

## 0. Exact baseline and what has already been solved

Remote `main` baseline when this handoff was written:

`92f030457f7bf08d86231cfaca3a566870440d4c`

GitHub Verification for that exact SHA completed successfully.

Recent engine work already on `main` that you must preserve rather than rediscover or revert:

- Juan route is Mai Tai → inference of Orgeat → real Joel/Juan co-presence → Aspen Onewheel route → practice/modification → social race → separate field trip.
- Onewheel parts are now finite physical cargo arrivals. Buying transfers existing unreserved/unpledged units; it must not mint a part at click time.
- Aspen is the current assembler/modifier, not Wong.
- Aspen has a second relational favor path: player may distract nosy Wong during a private Aspen parcel situation; this costs Wong relationship/suspicion and creates one consumable Aspen favor.
- Seed/propagule economy exists: multiple seed packets/cuttings/divisions are physical units; planting consumes the unit and creates a living asset.
- Aspen route distance matters: short routes skew fresh/near goods, medium routes include living cuttings/divisions, outer routes include dry seeds/durable/provenance goods.
- Wong enterprise expansion, rent to Dima, productive assets, Juan crop economics, secured claims, Dima guarantees/workouts, route-source progression, and Yasmin Whale Oil access mechanics exist in engine form.
- Yasmin old fixed Day 2/3/4/6 access shortcut is blocked. Earned invitation + settlement capacity now controls access; approval opens a relative auction window.
- Sonya's invitation fish is a finite small-boat unit, not purchase-time minting.
- Main cast identities in `CURRENT_GAME.md` are authoritative. Sonya remains supporting/background, not a seventh primary economic actor.

Do **not** use old historical docs to restore retired Juan cliff shortcuts, Wong-as-Onewheel-builder, Dima-as-seagull, multiple Octopus institutions, or fixed auction-day shortcuts.

## 1. Read only this authority set first

Read these before coding, in this order:

1. `CURRENT_GAME.md` — current gameplay/canon authority.
2. `ART_DIRECTION.md` — current visual authority.
3. `docs/CURRENT_GAME_CONFORMANCE.md` — useful audit map, but it is slightly behind the newest engine work listed above; do not use it to delete newer mechanics.
4. This file.

Only open deeper design docs when a concrete implementation question requires them. Do not begin by rereading the entire repository.

For code orientation, start with these files only:

- `src/HarbourMap.jsx`
- `src/HarbourTableauLayer.jsx`
- `src/HarbourDistrictLayer.jsx`
- `src/harbourTableau.js`
- `src/harbourDistrict.js`
- `src/harbourCamera.js`
- `public/art/manifest.json`

Then follow imports only as needed.

## 2. Your comparative advantage in this pass

This is **not** a QA-only assignment.

You have the local checkout, the completed/unpublished named-character artwork, real browser iteration, screenshots, local image inspection, and the ability to refactor several presentation files while immediately seeing native-scale results. Use that advantage to finish a coherent **World Presentation Integration** rather than merely clicking through existing UI.

The most important fact ChatGPT cannot see from remote `main`: **the primary character assets are already completed locally.** Remote `public/art/characters/` is effectively empty and `HarbourMap.Figure` still crops the old `public/art/cast-working.png` atlas. Your first job is therefore not to redesign characters; it is to preserve and integrate the approved local character work correctly.

## 3. Non-negotiable Git preflight

Before any pull/reset/switch/rebase/delete:

```bash
git status --short --branch
git log --oneline --decorate -15
git branch -vv
git diff --stat
git diff --name-only
find public src -type f \( -iname '*aspen*' -o -iname '*joel*' -o -iname '*juan*' -o -iname '*yasmin*' -o -iname '*dima*' -o -iname '*wong*' -o -iname '*sonya*' -o -iname '*shisha*' -o -iname '*crowd*' -o -iname '*social*' \) -print | sort
```

Preserve every useful local-only character/ambient/transparency asset before synchronizing. A salvage branch/commit or external salvage directory is acceptable. Nothing useful gets silently discarded.

Then return to `main` and use:

```bash
git fetch origin
git pull --ff-only origin main
```

No force push. Product implementation goes directly to `main` once the local work is preserved.

## 4. Mission: replace the prototype cast renderer with the finished cast system

### Current problem

`HarbourMap.jsx` still contains a hard-coded `CAST` crop table and renders most named people out of `public/art/cast-working.png`. This was a prototype seam. It prevents the finished local character assets from becoming the actual game cast and mixes visual crop geometry with interaction geometry.

### Required architecture

Create one focused named-character presentation authority, for example `src/characterPresentation.js` (name may differ if an existing equivalent is better). It should own data such as:

- asset path / state variant,
- intrinsic pixel dimensions,
- feet/ground anchor,
- intended world-space standing height or scale,
- visual offset,
- optional local occlusion/depth offset,
- a **separate interaction hull** or compact target geometry.

Do not keep per-character magic crop coordinates embedded in `HarbourMap.jsx` once the new system is working.

The actual character artwork must have `pointer-events: none`. The interaction target is a separate semantic geometry around the visible person, not the transparent rectangular bounds of a PNG/atlas.

### Character scale constraints

Preserve the approved identities rather than reinterpreting them:

- Joel is the tallest named human.
- Juan is the shortest named human.
- Aspen: black updo, cream floral clothing.
- Yasmin: long dark hair, black-and-gold dress.
- Dima: human, blond/stubble, navy tracksuit, purple sunglasses.
- Wong: whippet.
- Sonya: supporting penguin grandmother.

Dima is a finish/linework reference, not a body/face/clothing template for everyone else.

If the local finished assets already encode these correctly, **do not regenerate or redesign them**. Integrate them.

### Asset placement

Prefer real files under `public/art/characters/` rather than one giant working atlas unless the local completed art is intentionally delivered as an atlas and atlas use remains demonstrably better. Update `public/art/manifest.json` to the actual final paths used by the renderer.

Do not commit obsolete duplicate generations merely because they exist locally. Keep only the approved useful assets plus any source assets the current art pipeline intentionally retains.

## 5. Build proper actor interaction geometry, not transparent-image hitboxes

This is implementation work, not just a browser test.

The renderer currently depth-sorts crowd, creatures, occluders, named actors, props and toads by feet-Y. Preserve that useful architecture. Improve the named-actor/prop hit layer so visual art and click geometry are independent.

Required behavior:

- transparent pixels in a character image never steal a click from a bowl, parcel, crate, bottle, plant, etc.;
- clicking a clearly visible part of the named character still works;
- hit geometry remains correct after camera pan/zoom and at both target viewports;
- keyboard semantics (`role`, `tabIndex`, accessible label, Enter activation) remain available;
- do not fix overlap bugs by arbitrarily moving important props away from the character composition.

At minimum solve and browser-prove these overlap classes:

- Yasmin vs gallery bowl/photograph;
- Joel vs bar bottle/glass/packing objects;
- Aspen vs berth crate/cargo;
- Wong vs parcel-counter objects.

A good result is a reusable actor-target system. Four one-off CSS hacks are not.

## 6. Integrate the completed cast into actual scene composition

Do not merely swap images in place and stop. Use the finished cast to correct native-scale composition in the continuous world.

Audit and improve these zones as coherent scenes:

### Berth / Aspen

- Aspen must read clearly at normal game scale without dominating the berth.
- Her boat/cargo/route state should remain visually legible.
- Real cargo and Onewheel-part presence should have space to exist without being hidden by her target geometry.
- When Aspen is away, the composition should visibly feel different rather than leaving a character-shaped hole.

### Joel's Bar

- Joel should stand naturally behind/in relation to the counter rather than floating above all furniture.
- Use existing occlusion/depth machinery so bar foreground objects can correctly cover lower body regions where appropriate.
- Juan/other actual co-present named actors and ambient patrons must be able to occupy the bar without creating an unreadable pile.

### Wong enterprise

- Wong is a whippet and should remain visually readable as such at native scale.
- Parcel/custody/service objects must stay selectable.
- Where the world already exposes `wongBusiness.stage` (`counter`, `storage`, `laundry`, `frontage`), make the frontage subtly but visibly evolve from existing state rather than remaining visually static. Do not invent new economic rules; consume the engine state that already exists.
- If the local asset work includes storage/laundry/shop material, salvage and integrate it.

### Juan nursery

- Juan must remain the shortest named human without looking accidentally child-scaled.
- Living plants/propagules should read as a working growing yard, not a decorative florist display.
- If feasible from existing state, show small noninteractive visual differences for crop species/stage/health without turning every plant into a button.

### Yasmin gallery / Old Hall relation

- Yasmin and the bowl must both remain usable.
- The gallery/viewing/auction activities are one Yasmin institution, not separate buildings.
- Old Hall remains the cinema/screening venue.
- Do not visually merge Octopus into Yasmin's institution.

### Dima building context

- Dima's `back_room` belongs inside the visible apartment-building context.
- Preserve Dima as human.
- If you already have useful local visual work for his vehicle/ice-cream-truck concept, preserve it, but **do not invent rent/financial mechanics in this pass**. A visual asset may be prepared/integrated only where existing world state can honestly drive it; otherwise leave it salvaged for the later economic pass rather than fabricating a permanent always-there prop.

## 7. Salvage and finish ambient world art around the completed cast

You previously had local shisha/social-background/transparency work. Inspect that work before generating replacements.

The goal is not “more random people.” The goal is that the finished named cast inhabit a credible harbour district.

Use the existing noninteractive tableau/depth pipeline. Ambient people remain noninteractive and must not steal pointer events.

Native-scale requirements:

- visibly mixed young/adult/elder age groups;
- multiple builds;
- deep/dark/brown/olive/tan/light complexions across the broader crowd;
- multiple hair silhouettes;
- several headwear/head-covering silhouettes;
- ordinary work/service/leisure clothing, not a street full of young fashionable models;
- no incidental person should look like a recoloured Aspen/Joel/Juan/Yasmin/Dima/Wong/Sonya.

The creator wants a fictional diverse neighbourhood that can plausibly contain visual cues from several communities without costume-caricature treatment. Use ordinary people first; identity should not be reduced to token outfits.

Inspect every salvaged raster for real alpha. Checkerboard pixels are not transparency. Composite suspect assets over two temporary contrasting backgrounds locally before integration.

## 8. Make existing economic state visibly inhabit the world

This task is deliberately presentation-side. Do not redesign the economy, but stop hiding important already-real state entirely in ledgers.

Where it can be done without leaking future route answers, add subtle world cues for existing state:

- Aspen away / returned / cargo present;
- Wong business stage changes;
- Juan living crop density/stage;
- real parcel/custody activity at Wong;
- Yasmin film-night/private-delivery aftermath **after the player has legitimately learned enough for the cue not to be a spoiler**;
- race/bar gathering density based on real co-presence rather than decorative fake participants.

Follow `CURRENT_GAME.md` information gating: the renderer must not reveal “Onewheel parts,” “Whale Oil quest,” “sunflower field,” etc. merely because the engine knows them.

Prefer world evidence over floating labels. Example: actual cargo stacks change when cargo is present; do not put `ASPEN HAS CARGO` text over her head.

## 9. Finish the camera/world-window feel while doing the integration

The current camera already aims for cover + bounded pan. Keep that model.

As the final assets change composition, adjust camera/world presentation only where browser evidence requires it:

- no non-world gutters at 1440×1000 or 390×844;
- desktop can pan when world exceeds the viewport;
- mobile can pan/zoom without permanently losing controls;
- UI overlays the world rather than shrinking it into a centered illustration;
- named characters remain findable without always being artificially centered;
- no character/prop becomes impossible to reach because the finished art changed visual footprint.

Do not replace the continuous harbour with location pages.

## 10. Build browser proof as part of implementation, not as the whole assignment

Use real browser feedback continuously while implementing the above. At the end, leave reproducible proof.

Exact required viewports:

- desktop: `1440×1000`
- mobile: `390×844`

At minimum automate/prove:

1. fresh save loads with no console/page errors;
2. finished named cast render rather than old atlas/fallback figures;
3. Yasmin/bowl, Joel/bar props, Aspen/cargo, Wong/parcel target competition works;
4. pan/zoom does not break target geometry;
5. world never exposes outside gutters;
6. dialogue does not autoplay after >3s and closes correctly;
7. `Start tomorrow` vs `Keep looking around` remains reachable after exhausting time;
8. at least one fresh-save traversal far enough into the current Juan route to prove that the new visual integration did not reintroduce information leaks or block Onewheel/Bar interactions.

If you already have a useful local Playwright harness, extend it rather than rewriting it from scratch.

Screenshots stay local unless explicitly requested. Record paths in the handoff.

## 11. Things you may refactor aggressively in this pass

You have permission to make substantial presentation-side changes when they serve the above mission:

- split `HarbourMap.jsx` if character rendering / hit geometry / depth entry rendering is too entangled;
- replace hard-coded CAST atlas geometry;
- create a data-driven character presentation module;
- improve art manifest usage;
- improve named actor target geometry;
- improve occluder/depth composition;
- reorganize ambient asset loading;
- add focused browser harnesses;
- fix CSS/layout/pointer architecture exposed by native-scale use;
- integrate the completed local named-character assets and useful local ambient assets.

Do not preserve a bad presentation seam merely because it currently has tests. Update stale presentation tests to exercise the intended architecture.

## 12. Things deliberately NOT owned by this pass

Do not spend your local context budget redesigning these unless a presentation blocker makes a tiny compatibility fix unavoidable:

- macroeconomics / DOGE / barter / short selling;
- Yasmin source-order economics;
- Wong rent/finance balance;
- Juan finance balance;
- Dima guarantee/claim semantics;
- seed economics rules;
- Aspen route-source prices;
- auction economic design;
- race probability tuning;
- authority/police/court system.

ChatGPT is continuing the design/engine audit for those. If you discover an engine defect while doing the presentation work, write a minimal reproduction note in the handoff rather than spending hours inventing economic rules.

A small engine fix is allowed only when all three are true:

1. the bug is directly blocking the presentation/browser work;
2. the correct behavior is already unambiguous in `CURRENT_GAME.md` or existing tested state;
3. you add a focused regression first.

## 13. Commit structure

Use meaningful checkpoints, not one giant final dump. A good sequence is approximately:

1. `salvage:` preserve local final cast/ambient work if needed;
2. `feat:` integrate final named cast presentation authority;
3. `fix:` separate actor art from hit geometry;
4. `feat:` integrate world/ambient composition and stage-aware scene cues;
5. `fix:` camera/native-scale issues found by real browser;
6. `test:` browser proof for final world integration;
7. final verification/docs checkpoint.

Push coherent checkpoints directly to `main`. Never force-push/rewrite history.

At each meaningful product checkpoint run the relevant subset; at final handoff run:

```bash
npm run test:harbour
npm run test:production
npm run test:visual
npm run build
```

plus the real browser proof(s).

## 14. Definition of done

This pass is done only when all of the following are true:

- the locally completed named-character art is preserved and actually used by the live game;
- remote `main` no longer depends on the old hard-coded `cast-working.png` crop table for the finished named cast;
- character visual bounds and interaction geometry are separate;
- the four major prop/character overlap classes above work in real browser on desktop and mobile;
- named characters sit naturally inside counters/plants/railings/foregrounds using the existing depth/occlusion model;
- useful local shisha/social ambient work is either integrated or explicitly rejected with a reason, not silently lost;
- scene diversity is convincing at native game scale rather than only when images are opened full-size;
- existing live economic/world states visibly affect the environment where safe, without leaking future route solutions;
- continuous-world camera remains cover/pan/bounded with no outside gutters;
- all code suites pass;
- browser proof passes at both exact viewports;
- no local final character assets or useful unpublished art remain stranded without a recorded salvage location.

## 15. Final handoff format to ChatGPT

When finished, provide exactly:

- final `main` SHA;
- meaningful checkpoint SHAs;
- local salvage branch/path, if any;
- which final named-character files were integrated;
- which ambient/shisha assets were integrated/rejected and why;
- exact test commands and results;
- browser viewports tested;
- local screenshot paths;
- any visual judgment still uncertain;
- any engine/design defect discovered but deliberately left for ChatGPT;
- whether any local unpublished useful asset still exists outside `main`.

Do not make ChatGPT reconstruct the pass from git history. Give the summary directly.
