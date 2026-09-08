# Sunflower scene-art pipeline

The runtime composes each harbour scene from a location background, character cutouts, props, state overlays and FX. `public/art/manifest.json` is the integration contract: authored files belong in the matching `public/art/*` directory and are referenced by URL in the manifest. Adding a pose or prop should not require editing React.

Each asset declares an id, file, kind, aspect, anchor, z layer, state variant, optional hotspot geometry, fallback, and mobile behaviour. Scene entries provide reusable anchor slots. Null files deliberately invoke restrained CSS fallbacks while production art is incomplete.

Run `node scripts/validate-art-manifest.mjs` before committing art. It rejects duplicate IDs, invalid kinds, missing anchors/layers/fallbacks, and scene references to unknown backgrounds. The report also lists placeholder assets still awaiting files. Asset production priority is: nine location backgrounds; six neutral character cutouts; route-critical props (Orgeat, invitation fish, auction lot, Onewheel parts); then social variants and FX.
