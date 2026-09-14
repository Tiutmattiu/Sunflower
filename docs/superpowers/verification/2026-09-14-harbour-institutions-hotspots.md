# Harbour Institutions + Live Hotspots Verification — 2026-09-14

## Scope

This checkpoint extends the unified 2000×1200 harbour tableau so existing gameplay institutions remain visible inside the neighbourhood and crowd density begins to reflect real social/economic state.

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

## Structural guards

New/expanded diagnostics:

- `scripts/harbour-institutions-check.mjs`
  - requires gallery, cinema, Dima apartment block, nursery, kitchen and clearing landmarks,
  - requires visual renderer tokens for those institutions,
  - prevents the main map from regressing to `/art/harbour-working.png`,
  - protects seagull / tropical-fish / squirrel presence and gameplay-toad integration.
- `scripts/harbour-hotspot-check.mjs`
  - requires real preview/auction, bar, Wong workload, market-order and toad-circle state to alter visible crowd/district state.
- `package.json`
  - `build` now runs `test:harbour` before `vite build`.

## Deployment evidence

- Commit `7752836613f5756ae810bb86341a98c353fba66b` intentionally failed after the new institution contract was wired into the build while the renderer still lacked the required institutions. This was the RED phase.
- Commit `e3231270400c45466f5152a926817ce1ad966bd0` passed the `Vercel – sunflower` deployment after the institution renderer and live crowd hotspot implementation were present. `sunflower-cgtb` was blocked by Vercel build-rate limits, not a code failure.
- Later commit `ebf562fee9b677f19964ec6c049058a57a104e21` adds only district-level live hotspot flags/sign emphasis. Both Vercel deployments were blocked by build-rate limits, so this exact final SHA has **not** received a fresh deployment proof yet.

## Not browser-verified here

Still requires real browser inspection at 1440×1000 and 390×844:

- whether the new gallery / cinema / apartment / nursery / kitchen / clearing visually collide with surrounding landmarks,
- whether named actors remain discoverable inside the denser crowd,
- whether local occlusion hides actors naturally rather than unfairly,
- whether labels/signage become too busy at default zoom,
- whether crowd silhouettes and named-character atlas still feel like one clarity family,
- whether mobile panning/focus lands on the intended institution,
- whether toads are sufficiently scan-fun rather than just tiny static targets.

## Known next-step issue

The tableau now has institution-level density and state-driven hotspots, but background NPC movement is still mostly short CSS loops around fixed authored positions. The next checkpoint should add **bounded within-zone motion / path loops** and browser-tuned collision/visibility rules without turning background NPCs into full simulation agents.
