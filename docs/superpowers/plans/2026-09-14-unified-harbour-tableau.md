# Unified Harbour Tableau Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current "legacy illustration in the middle + sparse perimeter" presentation with a single socially legible 2000×1200 harbour-quarter tableau while preserving gameplay state, named-cast identity, camera behavior, and legacy comic compatibility.

**Architecture:** Keep `HARBOUR_WORLD` and the cover/bounded camera. Move the map renderer toward a code-authored district scene: base terrain/architecture and static neighbourhood landmarks render from focused presentation components; functional crowd/creatures remain data-driven; named actors and local occluders participate in one Y-depth stream. The old `harbour-working.png` remains available to legacy comics but is no longer required as the dominant map background.

**Tech Stack:** React 18, SVG, CSS animation, pure JavaScript presentation models, Node assertion diagnostics, Vite/Vercel build.

**Spec:** `SUNFLOWER_HARBOUR_TABLEAU.md` and `CURRENT_GAME.md`

## Global Constraints

- Work directly on `main`; do not create a development branch.
- Presentation code must not mutate route/economy/inventory state.
- Preserve `PLACES` legacy coordinates for comic compatibility.
- Maintain the approved named-character identities and atlas.
- Most ambient people/objects are noninteractive.
- No floating people, ordinary crowd on water, or dead decorative hotspots.
- Use simple continuous loops; do not make NPC movement dependent on player clicks.
- Aim for one clarity/detail family across background, crowd, landmarks, and actors; avoid an obvious sticker-on-painting seam.

---

### Task 1: Define the unified district scene contract

**Files:**
- Create: `src/harbourDistrict.js`
- Create: `scripts/harbour-district-check.mjs`

**Interfaces:**
- Produces `DISTRICT_LANDMARKS`, `districtStateForWorld(world)`, `districtOccluders(world)`, and `districtSignals(world)`.
- All positions are authored 2000×1200 world coordinates.

- [ ] Write a failing diagnostic requiring all major tableau domains: sea/shore, berth, Wong services, Octopus Bank, Joel/live music, shisha, pizza/deli, barber, massage, park/grass, basketball, chess, faith house, vice/night venue, exotic pets, glassblower, snake performer, cliff.
- [ ] Require at least four local occluders with valid world coordinates and Y-depth values.
- [ ] Require storm/day/Shabbat-like scene state to change visible signals without mutating `world`.
- [ ] Implement the pure district model and rerun the diagnostic.

### Task 2: Replace the dominant legacy map image with a unified vector district

**Files:**
- Create: `src/HarbourDistrictLayer.jsx`
- Create: `src/harbourDistrict.css`
- Modify: `src/HarbourMap.jsx`
- Modify: `src/HarbourTableauLayer.jsx`

**Interfaces:**
- `HarbourDistrictBase({world})` renders terrain, sea, streets, architecture, and static landmarks.
- `DistrictOccluder({item})` renders foreground structures within the Y-depth stream.
- `HarbourMap` renders district base, then a common depth stream containing crowd, creatures, named actors, and occluders.

- [ ] Add a renderer-source diagnostic proving the main map no longer depends on `/art/harbour-working.png` as its base.
- [ ] Render a low-detail but socially explicit district across the full 2000×1200 map.
- [ ] Keep `harbour-working.png` available to comics in `AppCore.jsx` only.
- [ ] Make neighbourhood identity readable through architecture/signage rather than decorative flowers/still-life clutter.
- [ ] Add local foreground occlusion for at least bar counter, Wong counter/awning, shisha screen/planter, and dock railing/cargo.

### Task 3: Increase bustle and make crowd composition react to the world

**Files:**
- Modify: `src/harbourTableau.js`
- Modify: `src/HarbourTableauLayer.jsx`
- Modify: `src/harbourTableau.css`
- Modify: `scripts/harbour-tableau-check.mjs`

**Interfaces:**
- `crowdForWorld(world)` remains deterministic and presentation-only.
- Functional crowd gains density/visibility rules driven by day/weather and existing social/economic facts where available.

- [ ] Require visibly higher population density than the first scaffold while retaining valid ground/water classification.
- [ ] Add everyday roles that make the district read as inhabited: park rest, service customers, food customers, worship flow, vice watchers, working poor/rough sleeper, court/chess users, shore leisure, craft observers.
- [ ] Make storm suppress shore leisure and redirect some people toward covered social/service zones.
- [ ] Make Shabbat-like day strengthen faith/family-return cues and reduce selected commercial signals without turning religion into a quest marker.
- [ ] Preserve named NPC discoverability through silhouette/labels at near zoom.

### Task 4: Add weather and small-life integration without extra UI clutter

**Files:**
- Modify: `src/HarbourDistrictLayer.jsx`
- Modify: `src/HarbourTableauLayer.jsx`
- Modify: `src/harbourTableau.css`

- [ ] Add visible but restrained wind/rain/sea-state cues.
- [ ] Keep tropical fish in water, squirrels in park, seagulls around shore/berth.
- [ ] Ensure weather/tiny-life are pointer-inert and never become dead hotspots.

### Task 5: Regression and handoff audit

**Files:**
- Modify: `scripts/harbour-tableau-check.mjs`
- Create: `scripts/harbour-unified-scene-check.mjs`
- Create: `docs/superpowers/verification/2026-09-14-unified-harbour-tableau.md`

- [ ] Verify district/tableau pure-data diagnostics.
- [ ] Parse modified JSX files with the available parser/build pipeline.
- [ ] Run the repo's production diagnostics that are available without browser access.
- [ ] Verify Vercel build status for the final code checkpoint.
- [ ] Record exactly what was not browser-verified and list the next Codex/browser tasks: desktop 1440×1000, mobile 390×844, hitboxes, visual crowd collisions, local occlusion quality, and any final art replacement needs.
