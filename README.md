# Sunflower

A browser-based single-player trading game prototype about information asymmetry, private value, relationships, liquidity, obligations and a sunflower that is supposed to take you home.

## Current prototype

- React 18 + Vite 5
- Browser-only; no backend or accounts
- One public market clearing per in-game day at noon
- Morning / afternoon actions for investigation, relationships, credit and positioning
- NPCs act on bounded information rather than omniscient inventory access
- Goods have reference prices, while private utility, urgency and liquidity can change actual willingness to trade
- Information has separate precision and confidence
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

## Important design docs

- `GAME_DESIGN.md` — overall design direction
- `DAY_LOOP_MARKET_STRUCTURE.md` — solar day and noon market structure
- `INFORMATION_DISCOVERY_MODEL.md` — information asymmetry and staged discovery
- `ITEM_ECONOMY.md` — item roles and price philosophy
- `NPC_CHARACTER_BIBLE.md` — NPC identity / behavior direction
- `REBIRTH_FORM_SYSTEM.md` — form, legal identity and rebirth hypotheses
- `WORLD_LORE_SUN_MOMENT.md` — current Sun Moment metaphysics
- `CODEX_VERIFICATION.md` — verified results, clearing rules, and remaining checks

## Verification status

On 2026-09-04, the local production build, `node scripts/noon-smoke.mjs`, and desktop/narrow-screen browser checks passed. Noon now batches player and NPC bids with seller-side valuation and daily rotating equal-bid priority. The StackBlitz import above remains available as a browser playtest path, but was not verified in this local pass. See `CODEX_VERIFICATION.md` for exact coverage and remaining limits. Public deployment is not verified; reloading still loses the current run.

## Scope

This is intentionally a small game project. Avoid enterprise architecture, large automated test suites, unnecessary services, or duplicate data systems unless the game actually needs them.
