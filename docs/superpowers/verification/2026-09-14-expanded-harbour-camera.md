# Expanded Harbour Camera Verification — 2026-09-14

## Scope

Checkpoint implementing the next crowded-tableau step after the initial crowd scaffold:
- authored world expanded from the 1400×900 prototype to a data-driven 2000×1200 world;
- current 1400×900 bitmap retained at original pixel dimensions as a temporary legacy district plate;
- broad presentation-only sea / shore / cliff / park / upper-street underlay added around it;
- cover scaling replaces contain scaling;
- camera panning/zooming/focus is clamped to the authored world;
- UI no longer reserves the old 55px/85px map strips;
- exported legacy `PLACES` coordinates remain unchanged for existing comic framing, while the world renderer uses shifted internal coordinates;
- crowd, creatures, props, named actors, toads, labels, and signals are shifted into the expanded world without changing route/economy state.

## Fresh local verification

The following checks were run against the checkpoint implementation in a local minimal verification workspace:

```text
PASS: harbour cover camera, bounds, reset, zoom, focus and legacy geometry
PASS: expanded tableau coordinates stay inside authored world
PASS: HarbourMap uses expanded bounded cover camera without breaking legacy PLACES API
PASS: HarbourMap.jsx JSX parses
PASS: HarbourTableauLayer.jsx JSX parses
```

The camera regression check verifies:
- cover scale fills both viewport axes;
- reset camera is bounded;
- extreme pan is clamped;
- zoom around a pivot remains bounded;
- focus near the far world edge remains bounded;
- the 1400×900 legacy artwork is not stretched to become the new world;
- stale contain/gutter camera math is absent from `HarbourMap.jsx`;
- exported `PLACES` remains in legacy coordinates for existing comics.

The tableau check verifies:
- all zones are inside 2000×1200 authored bounds;
- non-swimming crowd remains on ground zones;
- swimmers remain in water zones;
- creatures and named actor anchors remain inside authored bounds.

## Build verification

Final code/style checkpoint `4db57b1e62062e97194de0637938c40000456c59`:
- Vercel `sunflower`: **success**
- Vercel `sunflower-cgtb`: **success**

Earlier camera integration checkpoint `a1610ba3dc6a7f6f1b2986b83b0be8ea5a9b7098` also built successfully on both deployments.

## Not yet visually accepted

No claim is made that the expanded perimeter is final art. The broad SVG underlay is a transitional authored-world scaffold so the camera and crowd systems have real space to inhabit without teal outside-world gutters.

Real-browser visual acceptance is still required at minimum:
- desktop 1440×1000;
- mobile 390×844;
- drag/pinch/wheel/keyboard pan boundaries;
- named NPC grounding and discoverability;
- confirm the legacy district plate does not read too strongly as a pasted rectangle;
- confirm expanded sea/shore crowd positions do not visually intersect legacy architecture;
- check UI overlays do not hide critical interaction targets.
