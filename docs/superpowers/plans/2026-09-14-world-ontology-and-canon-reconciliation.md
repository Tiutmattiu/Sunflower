# World Ontology and Canon Reconciliation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent Sunflower from accidentally splitting one canon institution into multiple places, collapsing distinct places/events into one, or letting stale active docs contradict the current game authority.

**Architecture:** Add a small canonical ontology registry for current institutions/places and a build-time audit that checks the map, player-facing labels and active design docs against it. Preserve legacy runtime location IDs where changing them would risk the economy; normalize presentation and district landmarks around canonical identities. Reconcile the specific active-doc contradictions already superseded by `CURRENT_GAME.md`.

**Tech Stack:** React 18, SVG, JavaScript ES modules, Node assertion diagnostics, Markdown canon docs, Vite/Vercel.

**Spec:** `CURRENT_GAME.md`, `WORLD_CANON.md`, `SUNFLOWER_HARBOUR_TABLEAU.md`

## Global Constraints

- Work only on `main`; no development branches.
- `CURRENT_GAME.md` is the highest-priority active authority when older docs conflict.
- Octopus is **one institution**: clearing + payment + local market data. It is not a separate bank plus a separate clearing house and is not an ordinary NPC.
- Internal runtime IDs such as `public_clearing` may remain for compatibility, but player-facing ontology must be canonical.
- Yasmin's gallery / viewing room / auction are one institution/place with multiple activities, not three separate businesses.
- Dima's `back_room` is a private room inside his apartment-building context, not a second invisible Dima institution.
- Wong's parcel counter and expanded multi-service shop are one Wong enterprise.
- Pizza shop and deli are separate businesses unless later explicitly merged by the creator.
- A live music festival is a distinct street/event phenomenon; Joel's Bar may have music, but the festival must not be silently collapsed into the Bar.
- Preserve seagulls, tropical fish, squirrels and gameplay toads as distinct small-life systems.
- Preserve economic conservation and existing runtime IDs unless a migration is explicitly tested.

---

### Task 1: Canonical ontology registry and failing audit

**Files:**
- Create: `src/worldOntology.js`
- Create: `scripts/world-ontology-check.mjs`
- Modify: `package.json`

**Interfaces:**
- `WORLD_ONTOLOGY`: canonical current institutions/places and permitted runtime aliases.
- `canonicalPlaceForRuntime(locationId)`: returns the canonical ontology id for a runtime location.
- Build-time audit rejects duplicate Octopus landmarks, banned player-facing duplicate names and accidental conflation of pizza/deli or festival/Bar.

- [ ] Write the audit first so current `Octopus Bank` + `Octopus Clearing` state fails.
- [ ] Define canonical entries for Octopus, Yasmin gallery, Dima apartments/back room, Wong services, Joel's Bar, Old Hall, Juan nursery, Sonya kitchen, pizza shop, deli and live festival.
- [ ] Wire `world-ontology-check.mjs` into `test:harbour`.

### Task 2: Merge Octopus presentation into one institution

**Files:**
- Modify: `src/harbourDistrict.js`
- Modify: `src/HarbourDistrictLayer.jsx`
- Modify: `src/harbourDistrict.css`
- Modify: `src/presentationCopy.js`
- Modify: `src/playerGame.js` only where safe/current full-file editing is available; otherwise record the remaining runtime copy in verification.

**Interfaces:**
- Exactly one map landmark carries `ontologyId:'octopus'` and `locationId:'public_clearing'`.
- Player-facing name is `Octopus`.
- Visual language communicates clearing/payment/local-market-data, not a generic retail bank.
- Wong's Bitcoin ATM remains Wong's separate service and is not confused with Octopus.

- [ ] Remove the separate `octopus-bank` landmark/signal.
- [ ] Convert the public clearing architecture into the single Octopus institution.
- [ ] Rename crowd tags/IDs that imply a second Octopus bank.
- [ ] Preserve internal `public_clearing` and `octopus_clearing` compatibility where they are engine identifiers, not player-facing ontology.

### Task 3: Undo accidental scene conflations

**Files:**
- Modify: `src/harbourDistrict.js`
- Modify: `src/HarbourDistrictLayer.jsx`
- Modify: `src/harbourDistrict.css`
- Modify: `src/harbourTableau.js`
- Modify: `SUNFLOWER_HARBOUR_TABLEAU.md`

- [ ] Split the current combined `pizza-deli` landmark into adjacent but distinct pizza and deli businesses.
- [ ] Keep their crowd signals separate enough that one can be busy while the other is not in future state logic.
- [ ] Add a distinct intermittent street/live-festival stage or festival pocket instead of treating Joel's Bar as the festival itself.
- [ ] Keep ordinary Bar music possible without conflating it with the festival.

### Task 4: Reconcile active canon docs with current authority

**Files:**
- Modify: `GAME_DESIGN.md`
- Modify: `WORLD_CANON.md`
- Modify: `NPC_CHARACTER_BIBLE.md`
- Modify: `CURRENT_GAME.md`

- [ ] Remove/replace current-active wording that still calls Dima a Seagull.
- [ ] Replace current-active wording that leaves Wong's approved presentation merely `Dog/Open` with the current whippet presentation while preserving economic identity.
- [ ] Reconcile the old `Aspen is not assigned Onewheel repair/workshop` wording with `CURRENT_GAME.md`: Aspen is the current Juan-route assembler/modifier, without redefining her primary economic identity as generic mechanic.
- [ ] Add an explicit Octopus ontology note to `CURRENT_GAME.md` so future scene work cannot recreate `Bank + Clearing` duplicates.

### Task 5: Broader current-game mismatch audit

**Files:**
- Create: `docs/superpowers/verification/2026-09-14-world-ontology-canon-audit.md`
- Create or modify diagnostics as evidence supports.

- [ ] Audit current source for known `CURRENT_GAME.md` mismatches beyond UI: old direct Juan route, Wong assembler, premature Orgeat/parts copy, stale actor/species references, invisible/duplicate place concepts.
- [ ] Fix small low-risk mismatches in this checkpoint.
- [ ] Do not fake-complete the full Juan/Mai-Tai/race rewrite if it cannot be safely implemented here; list exact remaining files/behaviours for the next checkpoint/Codex.
- [ ] Re-run harbour diagnostics and record deployment/browser limitations honestly.

### Task 6: Design the next gameplay checkpoint from findings

**Files:**
- Create: `docs/superpowers/plans/2026-09-14-current-game-causal-route-rebuild.md`

- [ ] Turn the remaining highest-impact non-visual mismatch into the next executable plan, prioritising actual causal gameplay over more decorative UI work.
