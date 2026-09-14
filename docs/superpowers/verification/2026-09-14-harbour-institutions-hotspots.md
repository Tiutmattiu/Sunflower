# Harbour Institutions + Live Hotspots Verification — 2026-09-14

## Scope

This checkpoint extends the unified 2000×1200 harbour tableau so existing gameplay institutions remain visible inside the neighbourhood, crowd density reflects real social/economic state, and selected ambient people move continuously inside bounded authored zones.

## Implemented

- Yasmin's viewing room is now a visible gallery/auction house with display wall, auction podium and seating cues.
- Old Hall is now a visible small cinema / screening hall.
- Dima's `back_room` is presented as a private room inside a visible apartment block rather than an isolated invisible room.
- Juan's nursery/growing yard, Sonya's kitchen and Octopus Clearing have visible scene architecture.
- Main-map institution anchors no longer depend on the old 1400×900 raster coordinates.
- Seagulls, tropical fish and squirrels remain deterministic small-life actors in their appropriate zones.
- Gameplay toads remain part of `HarbourMap`'s interactive scene graph and are explicitly guarded by the harbour institution contract.
- Build now runs `npm run test:harbour` before Vite so district/tableau regressions block deployment.
- Crowd hotspots now react to live world state:
  - Yasmin preview / auction day -> gallery crowd,
  - real `relationshipEcology.barEvenings` -> Joel's Bar crowd,
  - Wong busy/storage load -> service queue,
  - open public market orders -> Octopus Clearing crowd,
  - real toad-circle occurrence -> nursery gathering,
  - cargo-rush day -> additional berth labour.
- District signals also derive live hotspot state for gallery, bar, Wong services, clearing and nursery rather than only static calendar/day styling.
- `walk`, `pace`, and `carry` ambient actors now receive deterministic short travel vectors and animate continuously without player clicks.
- Motion vectors are clamped to each actor's authored zone; seated/eating/shisha/chess figures do not wander.

## Structural guards

New/expanded diagnostics:

- `scripts/harbour-institutions-check.mjs`
  - requires gallery, cinema, Dima apartment block, nursery, kitchen and clearing landmarks,
  - requires visual renderer tokens for those institutions,
  - prevents the main map from regressing to `/art/harbour-working.png`,
  - protects seagull / tropical-fish / squirrel presence and gameplay-toad integration.
- `scripts/harbour-hotspot-check.mjs`
  - requires real preview/auction, bar, Wong workload, market-order and toad-circle state to alter visible crowd/district state.
- `scripts/harbour-motion-check.mjs`
  - requires a meaningful population of autonomous walkers,
  - checks both ends of each walk vector remain in the authored zone,
  - checks the renderer/CSS actually consume the motion vector.
- `package.json`
  - `build` now runs `test:harbour` before `vite build`.

## Deployment evidence

- Commit `7752836613f5756ae810bb86341a98c353fba66b` intentionally failed after the new institution contract was wired into the build while the renderer still lacked the required institutions. This was the RED phase.
- Commit `e3231270400c45466f5152a926817ce1ad966bd0` passed the `Vercel – sunflower` deployment after the institution renderer and live crowd hotspot implementation were present. `sunflower-cgtb` was blocked by Vercel build-rate limits, not a code failure.
- Later commits add district hotspot flags and bounded motion. Vercel subsequently returned `build-rate-limit` for both deployments, so the exact latest SHA has **not** received a fresh deployment proof yet. Do not reinterpret this quota failure as a code-pass or code-fail result.

## Not browser-verified here

Still requires real browser inspection at 1440×1000 and 390×844:

- whether the new gallery / cinema / apartment / nursery / kitchen / clearing visually collide with surrounding landmarks,
- whether named actors remain discoverable inside the denser crowd,
- whether local occlusion hides actors naturally rather than unfairly,
- whether labels/signage become too busy at default zoom,
- whether crowd silhouettes and named-character atlas still feel like one clarity family,
- whether mobile panning/focus lands on the intended institution,
- whether bounded walkers visually cross walls/counters even though their numeric endpoints remain in-zone,
- whether toads are sufficiently scan-fun rather than tiny static targets.

## Known next-step issues

1. **Browser collision tuning:** numeric zone bounds cannot detect every façade/counter collision. Codex should tune authored positions and local occlusion in a real browser.
2. **Toad motion:** gameplay toads are preserved and clickable but still need a tiny body-only hop loop that does not move the hit target unfairly.
3. **Legacy boat coordinate:** the small Aspen boat in `HarbourMap.jsx` still uses a legacy-coordinate helper and should be moved to an authored district anchor.
4. **Visual clarity family:** code-authored district, simple ambient figures and the named-character atlas still need real-browser art-direction judgment; do not solve mismatch by blurring named cast.
5. **Rare surreal day variants:** leaf-hand/cat/mushroom whole-world mutations remain deliberately deferred until normal-day readability passes.
