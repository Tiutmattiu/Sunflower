# Expanded Harbour Camera Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the authored harbour world beyond the cramped 1400×900 prototype and replace contain-style framing with cover + bounded pan without touching Mai Tai/gameplay logic.

**Architecture:** Introduce a pure world-geometry module and a pure camera-math module. Keep the current 1400×900 harbour artwork as a temporary legacy district plate inside a larger 2000×1200 world, add a simple continuous underlay around it, shift presentation coordinates through one legacy-origin transform, and let `HarbourMap` use cover scaling with camera positions clamped strictly inside the authored world.

**Tech Stack:** React 18, SVG, CSS, Node assertion scripts, Vite/Vercel build.

**Spec:** `SUNFLOWER_HARBOUR_TABLEAU.md`

## Global Constraints

- Work directly on `main`; do not create another development branch.
- Do not touch Mai Tai / Juan route gameplay implementation in this checkpoint.
- UI overlays the world; do not reserve large teal gutters above or below it.
- The camera must never show space outside the authored world.
- Do not stretch the old 1400×900 bitmap to pretend it is higher resolution.
- The legacy bitmap is temporary; new world dimensions must be data-driven so future authored art can replace it without camera rewrites.
- Keep crowd/NPC/prop coordinates valid after the world expands.

---

### Task 1: Pure world and camera geometry

**Files:**
- Create: `src/harbourWorld.js`
- Create: `src/harbourCamera.js`
- Create: `scripts/harbour-camera-check.mjs`

**Interfaces:**
- `HARBOUR_WORLD`: `{width:2000,height:1200,legacy:{x,y,width,height}}`
- `legacyPoint(x,y) -> {x,y}`
- `legacyBounds(bounds) -> [x1,y1,x2,y2]`
- `coverScale(viewport, world) -> number`
- `clampCamera(camera, viewport, world) -> camera`
- `centeredCamera(viewport, world, z=1) -> camera`
- `zoomCamera(camera, factor, pivot, viewport, world) -> camera`
- `focusCamera(point, viewport, world, z=2.15) -> camera`

- [ ] Write a failing Node assertion script proving cover scale fills both viewport axes, clamp never exposes outside-world space, center/reset is bounded, and zoom/focus remain bounded.
- [ ] Run the script and confirm failure because the modules do not exist.
- [ ] Add minimal pure geometry modules.
- [ ] Re-run the script and confirm all assertions pass.

### Task 2: Put the legacy district inside the expanded authored world

**Files:**
- Modify: `src/harbourTableau.js`
- Modify: `src/HarbourTableauLayer.jsx`
- Modify: `scripts/harbour-tableau-check.mjs`

**Interfaces:**
- Existing crowd/creature/named actor APIs remain unchanged.
- All old map coordinates are shifted by `HARBOUR_WORLD.legacy` rather than rewritten ad hoc.
- `ExpandedWorldBackdrop` draws only broad ground/sea/cliff/park geometry; it is presentation-only.

- [ ] Extend the tableau assertion script to verify every crowd/creature/named actor point is inside `HARBOUR_WORLD` and that water-only activities remain in water zones.
- [ ] Run the assertion script and confirm the old 1400×900 assumptions fail the new bounds/transform assertions.
- [ ] Shift legacy zones and named actor slots through shared helpers; allow new sea/perimeter space without stretching the bitmap.
- [ ] Add a simple broad SVG underlay around the legacy art so panning reveals world, not teal outside-world gutters.
- [ ] Re-run tableau assertions.

### Task 3: Replace contain camera with cover + bounded pan

**Files:**
- Modify: `src/HarbourMap.jsx`
- Modify: `src/harbour.css`

**Interfaces:**
- `HarbourMap` consumes camera helpers from `harbourCamera.js` and dimensions from `harbourWorld.js`.
- The SVG uses `HARBOUR_WORLD.width/height` for width/height/viewBox.
- Reset control recenters at `z=1`; it no longer claims to show the whole harbour.

- [ ] Update `HarbourMap` to compute the base scale with `coverScale`, initialize/reset with `centeredCamera`, clamp every pan, use bounded zoom/focus helpers, and render the 2000×1200 world.
- [ ] Make the legacy harbour image render at its original 1400×900 pixel dimensions at the legacy origin.
- [ ] Remove camera math that reserves 55px/85px strips; UI remains overlay.
- [ ] Ensure pointer drag, wheel pan/zoom, keyboard pan, pinch zoom, and focus all use the same clamp path.
- [ ] Change the ↔ control aria-label to `Reset harbour view`.

### Task 4: Verification and handoff

**Files:**
- Create: `docs/superpowers/verification/2026-09-14-expanded-harbour-camera.md`

- [ ] Run `node scripts/harbour-camera-check.mjs`.
- [ ] Run `node scripts/harbour-tableau-check.mjs` in an environment with the repo available, or record if connector-only execution prevents it.
- [ ] Confirm Vercel/Vite build status for the final commit.
- [ ] Record exactly what was verified and explicitly leave desktop/mobile visual acceptance open if no browser is available.
