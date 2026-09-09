# Sunflower continuous-world art pipeline

The current production direction is one **continuous pan/zoom harbour world**, not a set of separate player-facing location rooms.

Read this with:
- `ART_DIRECTION.md` for drawing/comic language;
- `WORLD_SCENE_BIBLE.md` for place identity and world feeling;
- `SUNFLOWER_WORLD_BUILD_CONTENT_PASS.md` for the latest continuous-harbour production handoff.

The local Codex workspace may contain a newer accepted implementation than GitHub `main`; preserve that implementation lineage when continuing the current pass.

## Runtime composition

The renderer may technically split the world into tiles, crops, LOD tiers or regional files, but the player should experience one coherent geographic illustration.

A useful runtime composition is:

1. static harbour/environment base;
2. optional environment/weather/state variants;
3. movable named-character cutouts;
4. stateful goods / route-critical props;
5. world traces and residue;
6. hidden-object layers;
7. restrained environmental motion;
8. interaction geometry.

Named characters are best kept separate from permanent backgrounds so simulation location can change without repainting the world.

Likewise, current Auction lots, hidden toads, carried route goods, rare fish, active claims/parcels and Sunflower are good candidates for semantic layers when their presence is gameplay truth.

## Large-map asset strategy

The authored world may be large enough to support close inspection. Choose technical dimensions from composition and browser performance rather than from a fixed screenshot size.

A reasonable source range is roughly `7680 × 4800` to `8192 × 5120` for a master world sheet, with runtime overview / medium / detail tiers or tiles generated from it.

The important outcomes are:
- overview remains fast;
- zoomed details stay sharp;
- mobile does not load a giant unnecessary bitmap at once;
- hotspot and NPC coordinates remain stable between image tiers.

Use normalized world coordinates where practical.

## Manifest / asset metadata

`public/art/manifest.json` remains useful as an integration contract for authored files, semantic ids, anchors, z-layers, variants, hotspot geometry, fallback behavior and mobile ordering.

The continuous-world pass may extend or refactor the manifest shape if that makes region/LOD/tile authoring cleaner. Prefer stable semantic ids over React-specific placement code.

Adding or moving a normal anchor should ideally remain a data operation rather than requiring gameplay-component edits.

## Scene Lab

`?sceneLab=1` remains valuable for:
- live runtime snapshots;
- desktop / 390px previews;
- anchor placement;
- normalized x/y;
- scale / z / mirror;
- mobile ordering;
- safe areas;
- hotspot visualization;
- layer visibility;
- compatibility checks;
- JSON export.

As the world becomes continuous, Scene Lab can evolve from "choose a room" toward "choose / focus a world region" while keeping simulation truth read-only.

## Production priority

Use runtime exposure and playtesting rather than an old fixed list of nine backgrounds.

Current high-value priorities are typically:
- accepted harbour-core world art and its sharp runtime integration;
- creator-approved character masters;
- Juan nursery / uphill route / cliff expansion;
- Joel Bar social density and props;
- Yasmin private viewing / Auction staging;
- Wong vs Octopus visual separation;
- household/Supper edge;
- route-critical props and hidden-toad layers;
- contextual comic crops/panels;
- environmental residue / world-life detail.

`node scripts/art-coverage-report.mjs` can still help rank missing semantic assets by observed exposure, but the report should be interpreted in the context of the accepted continuous map.

## Validation

Keep `node scripts/validate-art-manifest.mjs` and related visual/browser tests useful as the pipeline evolves.

Generated verification screenshots are local artifacts and should remain untracked.

The pipeline exists to make authored art replaceable and composable without forcing a gameplay rewrite.