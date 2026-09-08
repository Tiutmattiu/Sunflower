# Sunflower scene-art pipeline

The runtime composes each harbour scene from a location background, character cutouts, props, state overlays and FX. `public/art/manifest.json` is the integration contract: authored files belong in the matching `public/art/*` directory and are referenced by URL in the manifest. Adding a pose or prop should not require editing React.

Each asset declares an id, file, kind, aspect, anchor, z layer, state variant, optional hotspot geometry, fallback, and mobile behaviour. Scene entries provide reusable anchor slots. Null files deliberately invoke restrained CSS fallbacks while production art is incomplete.

Run `node scripts/validate-art-manifest.mjs` before committing art. It rejects duplicate IDs, invalid kinds, missing anchors/layers/fallbacks, and scene references to unknown backgrounds. The report also lists placeholder assets still awaiting files. Asset production priority is: nine location backgrounds; six neutral character cutouts; route-critical props (Orgeat, invitation fish, auction lot, Onewheel parts); then social variants and FX.


## Scene Lab

Run the app and open `?sceneLab=1`. The lab reads a live scene snapshot but edits only a cloned presentation record. It provides WIDE/WORK and desktop/390 previews, named anchors, drag placement, normalized coordinates, scale, z layer, mirroring, mobile order, safe-area and hotspot visualization, layer visibility, fallback preview, compatibility validation, and clipboard JSON export. Commit reviewed metadata to `public/art/manifest.json`; no gameplay React change is needed.

`node scripts/art-coverage-report.mjs` plays 100 harbour days and ranks missing semantic assets by observed exposure and scene impact so the highest-value replacements can be authored first.
