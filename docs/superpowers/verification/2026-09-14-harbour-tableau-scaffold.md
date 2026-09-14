# Harbour Tableau Scaffold Verification — 2026-09-14

## Scope

This checkpoint implements the first code scaffold for the crowded harbour tableau direction in `SUNFLOWER_HARBOUR_TABLEAU.md` without changing the unfinished Mai Tai gameplay flow.

## Implemented

- `src/harbourTableau.js`
  - presentation-only legal ground/water zones;
  - deterministic ambient crowd placement;
  - swimmers and tropical fish restricted to water;
  - sunbathers and ordinary crowd restricted to ground zones;
  - functional crowd roles for berth labour, Wong services, Octopus Bank, live music, shisha, pizza/deli, basketball, chess, faith/vice, homelessness, exotic pets, glassblowing and snake-charmer activity;
  - seagulls, squirrels and tropical fish;
  - named actor points derived from legal location slots instead of the old inline feet table;
  - storm filtering reduces dry beach activity;
  - day changes shift ambient placements deterministically without mutating game state.

- `src/HarbourTableauLayer.jsx`
  - lightweight SVG crowd silhouettes;
  - seated chess/shisha poses;
  - swimmers and sunbathers;
  - simple activity props such as basketball, carried box, instrument and glassblowing pipe;
  - small-creature drawings;
  - compact visual scene signals for Wong services, Octopus Bank, shisha, pizza, basketball/chess and craft activity.

- `src/harbourTableau.css`
  - continuous low-cost idle/walk/work/swim/basketball/chess/shisha/seagull/squirrel/fish loops;
  - motion does not depend on player clicks;
  - `prefers-reduced-motion` disables the loops.

- `src/HarbourMap.jsx`
  - consumes the new tableau model;
  - renders ambient crowd and creatures as non-interactive presentation;
  - keeps hidden toads interactive;
  - feet-Y sorts ambient crowd, creatures and named actors together to reduce obvious sticker-layer separation;
  - uses `namedActorPoint()` rather than the previous inline feet map.

## Verification actually performed

- TDD red phase confirmed the tableau module was initially missing.
- A local Node mirror of `scripts/harbour-tableau-check.mjs` passes the pure model contract after implementation:
  - 8+ zones;
  - ground/water legality;
  - 18+ visible ambient people;
  - basketball, chess, shisha and swimming activity present;
  - non-swimmers on ground and swimmers in water;
  - seagull, squirrel and tropical fish present;
  - named actor points finite;
  - storm reduces shore leisure;
  - requested first-pass semantic tags present.
- `HarbourTableauLayer.jsx` was parsed with the installed TypeScript compiler API: no JSX syntax diagnostics.
- The new depth-sorted `HarbourMap.jsx` render expression was parsed separately with the TypeScript compiler API: no JSX syntax diagnostics.
- Current `main` commit `e5627acce9a2eea6be755f108d160ebad49d42a8` has successful Vercel statuses for both configured deployments.

## Visual acceptance still required in a real browser

Do not treat this scaffold as final visual acceptance until a local browser pass verifies all of the following at 1440×1000 and 390×844:

- crowd moves without player clicks;
- no ordinary ambient person appears in water;
- swimmers/fish remain visually inside actual water in the current background;
- named actors are grounded and do not hover;
- crowd makes named NPCs mildly harder to find without making them indistinguishable;
- hidden toad remains clickable;
- storm visibly changes crowd distribution;
- no new ambient figure becomes clickable or mutates economy/routes;
- no horizontal overflow or interaction regression;
- reduced-motion stops ambient loops.

## Known limitation

The old flattened `harbour-working.png` remains the temporary substrate. This checkpoint creates the crowd/grounding/motion architecture; it does **not** solve the final background-art problem. A later pass still needs the larger cohesive harbour-quarter painting/layout with sea, park, service strip, faith/vice/craft zones and similar clarity across environment and characters. Do not add more decorative flower clutter to compensate for missing social scene content.
