# Harbour Motion, Collision and Hotspot Readability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Work directly on `main`; do not create a development branch.

**Goal:** Turn the dense unified harbour from a mostly fixed tableau into a continuously moving but still readable neighbourhood, then browser-tune collisions, occlusion and target discoverability.

**Architecture:** Keep named actors and gameplay state authoritative. Background people remain presentation actors with bounded zone paths, not full economic agents. Their density continues to derive from live world facts; their local motion is deterministic, small and constrained to authored walkable zones. Small life uses the same principle. Browser review is required before accepting final positions.

**Spec:** `CURRENT_GAME.md`, `SUNFLOWER_HARBOUR_TABLEAU.md`, and `docs/superpowers/verification/2026-09-14-harbour-institutions-hotspots.md`

## Global constraints

- `main` only; no development branch.
- Do not mutate economy/route state from presentation code.
- No ordinary person may enter water; swimmers/fish are explicit exceptions.
- Named NPCs must remain findable but may be partially obscured by crowd/foreground structures.
- Background NPCs do not receive full dialogue routes or inventories.
- Movement must continue without player clicks.
- Preserve gallery/auction, cinema, Dima apartment block, nursery, kitchen, clearing, sea life, squirrels, seagulls and gameplay toads.

---

## Task 1 — Bounded within-zone crowd motion

**Files:**
- Modify: `src/harbourTableau.js`
- Modify: `src/HarbourTableauLayer.jsx`
- Modify: `src/harbourTableau.css`
- Create: `scripts/harbour-motion-check.mjs`

Requirements:
- Every moving ambient person receives a deterministic short motion vector/path derived from id/day.
- Motion bounds remain inside the person's authored zone.
- Walking/pace/carry actors may travel more than idle/talk/chess/shisha actors.
- Seated activities remain effectively stationary.
- CSS/SMIL motion must not overwrite the world-position transform.
- `prefers-reduced-motion` still disables movement.

## Task 2 — Toad scan-play motion

**Files:**
- Modify: `src/HarbourMap.jsx`
- Modify: `src/harbourTableau.css`
- Extend: `scripts/harbour-institutions-check.mjs`

Requirements:
- Hidden gameplay toads keep their existing interaction semantics.
- Their visual body performs a tiny independent hop loop inside the existing hit area; do not move the clickable target so far that pointer access becomes unfair.
- Different toads use deterministic phase/duration offsets.
- No route vocabulary is exposed through labels or accessibility text.

## Task 3 — Institution-specific crowd choreography

**Files:**
- Modify: `src/harbourTableau.js`
- Modify: `src/HarbourTableauLayer.jsx`

Requirements:
- Gallery preview: browsing/inspection cluster.
- Auction day: stronger seated/standing sale crowd around Yasmin's gallery without duplicating named actors.
- Cinema night: small arrival/queue cluster at Old Hall.
- Apartment block: residents, landlord/maintenance-like movement, occasional suspicious visitor; no new story route.
- Nursery/toad event: local ring/gathering only when actual toad-circle occurrence exists.
- Octopus Clearing: crowd intensity follows open orders.
- Wong: queue intensity follows current workload/storage.
- Joel's Bar: generic patron density follows real named bar attendance and service activity.

## Task 4 — Browser collision and occlusion audit

**Required platform:** Codex/local browser or other real-browser environment.

Test both:
- desktop 1440×1000,
- mobile 390×844.

Audit:
- named actors do not stand on water/buildings/tables,
- background people do not clip through major façades,
- foreground counters/fences/ropes occlude at believable feet-Y,
- Yasmin remains findable on preview/auction days,
- Dima remains findable at the apartment block,
- Juan remains findable inside nursery crowd/toad event,
- Joel remains findable during bar hotspot,
- no invisible overlay blocks clicking a named actor/prop/toad,
- labels/signs do not become a wall of text at default zoom,
- mobile camera focus does not put the target beneath top/bottom UI.

Record screenshots locally and make coordinate/CSS corrections directly on `main` in small commits.

## Task 5 — Clarity-family and art handoff audit

**Files:**
- Update verification doc only after browser review.

Evaluate whether the code-authored SVG district, simple crowd figures and approved named-character atlas look like one visual world. If not, do **not** solve by blurring the cast or enlarging low-resolution art. Record exact asset work needed for Codex/art generation:
- façade redraws,
- incidental crowd sprite families,
- foreground occluder assets,
- shisha/social groups,
- shoreline/sea-detail pass,
- gallery/cinema/apartment refinement.

## Task 6 — Optional later world-mutation layer

Only after ordinary harbour readability works:
- rare leaf-hand day,
- cat day,
- mushroom day,
- other whole-world mutations.

These should swap/augment presentation variants, not rewrite core economy or route state. Do not implement before normal-day browser acceptance.
