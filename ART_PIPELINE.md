# Sunflower scene-art pipeline

## Current player renderer — 2026-09-10

`src/HarbourMap.jsx` composes one continuous 1400×900 world. `public/art/harbour-working.png` is the temporary master background; `public/art/cast-working.png` is the approved transparent cast atlas. `Figure` is shared with comics. Actors come from actual simulation locations, with per-location scale and separate object hit regions. The camera does not switch scenes. The old manifest belongs to the development Scene Lab, not the current player renderer.

Known unfinished work: the master background is only 1563×1006, while the five-person atlas is 1774×887. A character uses far more source pixels per world unit than the background, explaining the close-zoom sharpness mismatch. Browser interpolation cannot recover missing detail. Replace/extend the background with authored higher-resolution material or aligned detail layers while retaining world anchors; do not claim CSS sharpening or enlarging the PNG solves it. Domestic social layers, shisha and several stateful props still need suitable assets. The current atlas uses individual clipping boundaries to exclude neighbouring figures; inspect map and comic crops whenever changing it.

Keep world-life ambient objects noninteractive unless the simulation provides a meaningful current action. Do not reinstate crude placeholder prop drawings over the master as a fallback. Do not bake named NPC duplicates into a background. Preserve the approved cast designs, Joel/ Juan height ordering and flat-colour requirements in `ART_DIRECTION.md`.

## Legacy development manifest

The Scene Lab composes preview scenes from location backgrounds, cutouts, props, state overlays and FX. `public/art/manifest.json` remains its integration contract; this is not a requirement to reintroduce location pages in the player build.

Each asset declares an id, file, kind, aspect, anchor, z layer, state variant, optional hotspot geometry, fallback, and mobile behaviour. Scene entries provide reusable anchor slots. Null files deliberately invoke restrained CSS fallbacks while production art is incomplete.

Run `node scripts/validate-art-manifest.mjs` before committing art. It rejects duplicate IDs, invalid kinds, missing anchors/layers/fallbacks, and scene references to unknown backgrounds. The report also lists placeholder assets still awaiting files. Asset production priority is: nine location backgrounds; six neutral character cutouts; route-critical props (Orgeat, invitation fish, auction lot, Onewheel parts); then social variants and FX.


## Scene Lab

Run the app and open `?sceneLab=1`. The lab reads a live scene snapshot but edits only a cloned presentation record. It provides WIDE/WORK and desktop/390 previews, named anchors, drag placement, normalized coordinates, scale, z layer, mirroring, mobile order, safe-area and hotspot visualization, layer visibility, fallback preview, compatibility validation, and clipboard JSON export. Commit reviewed metadata to `public/art/manifest.json`; no gameplay React change is needed.

`node scripts/art-coverage-report.mjs` plays 100 harbour days and ranks missing semantic assets by observed exposure and scene impact so the highest-value replacements can be authored first.
