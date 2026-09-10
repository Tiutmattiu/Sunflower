# Sunflower

A browser-based single-player harbour game about people, objects, promises and finding a sunflower.

## Current continuous-map build — 2026-09-10

The `codex/living-harbour` working implementation uses one continuous illustrated map. People follow actual simulation locations; dialogue is contextual and read one line at a time. Phone and newspaper are edge drawers, objects sit along the bottom, and money and remembered instructions live in the pocketbook. There is no player home or location-page navigation. The older prototype description below is historical.

Run `npm run dev -- --host 127.0.0.1 --port 5174`, then `npm run test:browser` for real desktop and 390×844 browser input. The browser check covers discovery, phone/newspaper, four part purchases, assembly, cliff and reflection; it does not claim every route is browser-verified. Run `node scripts/harbour-interface-check.mjs`, `npm run test:production` and `npm run build` for simulation/regression checks.

Working art remains under revision: background resolution/layers and domestic world details are not finished. Character identities are approved, with Joel tallest and Juan shortest. See `.agents/skills/sunflower-player-interface/SKILL.md` before changing the player presentation.

## Historical prototype / migration source

**Design status, 2026-09-07:** `GAME_DESIGN.md` §5 owns the frozen gameplay constitution. The existing runtime is an economic test harness and migration source, not acceptance of the workbench/location/event game. The list below records the dated prototype, not new runtime verification. `DESIGN_WORKBOOK.md` Chapter 33 owns migration debt and Open decisions.

- React 18 + Vite 5
- Browser-only; no backend or accounts
- One public market clearing per in-game day at noon
- Morning / afternoon actions for investigation, relationships, credit and positioning
- NPCs act on bounded information rather than omniscient inventory access
- Goods have reference prices, while private utility, urgency and liquidity can change actual willingness to trade
- Information has separate precision and confidence
- Private information can be sold, shared as a favour, and resold through established NPC relationships
- NPC-held ingredients and parts can trigger production and route consequences without player attribution
- Food, perishability, credit, legal identity / form access and market proxies are partially implemented
- Acquiring a sunflower no longer ends the game: the objective changes to **Go home**

The current 14-day limit is prototype pacing, not final lore or final run length.

## Playtest in a browser

Because this is a public Vite repository, StackBlitz can import the current `main` branch and run the `dev` script without a local Node setup:

https://stackblitz.com/github/Tiutmattiu/Sunflower?startScript=dev

The repository is the source of truth, so refresh/reopen the StackBlitz import after new commits if it is showing an older version.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Targeted engine checks:

```bash
node scripts/noon-smoke.mjs
node scripts/living-smoke.mjs
```

## Code ownership

- `src/gameData.js` — facts and configuration: items, starting state, profiles, recipes and venue rules
- `src/npcAI.js` — bounded NPC knowledge, valuation, planning and public listings
- `src/gameEngine.js` — authoritative state transitions, settlement, production, consequences and structured evidence
- `src/livingGame.js` — compatibility re-export only
- `src/AppCore.jsx` — player-facing React flow; it calls the engine rather than owning game rules

## Important design docs

- `GAME_DESIGN.md` — frozen gameplay constitution (§5) and supporting design
- `DAY_LOOP_MARKET_STRUCTURE.md` — historical phase/Noon model, not future player-flow authority
- `INFORMATION_DISCOVERY_MODEL.md` — information asymmetry and staged discovery
- `ITEM_ECONOMY.md` — item roles and price philosophy
- `NPC_CHARACTER_BIBLE.md` — NPC identity / behavior direction
- `WORLD_CANON.md` — current world canon and Sun Moment ontology
- `CODEX_VERIFICATION.md` — dated prototype results, not constitution acceptance
- `DESIGN_WORKBOOK.md` — Open research and current migration/dependency register (Chapter 33)

## Verification status

On 2026-09-04 the production build, both engine smoke scripts, a Day 1 browser order/settlement/notebook flow, and a 390 × 844 responsive check passed locally. See `CODEX_VERIFICATION.md` for that snapshot's contracts and unverified boundaries. Public deployment is not verified.

## Scope

This is intentionally a small game project. Avoid enterprise architecture, large automated test suites, unnecessary services, or duplicate data systems unless the game actually needs them.
