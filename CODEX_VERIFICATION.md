# Sunflower — Codex Verification Runbook

> Purpose: record checks that could not be executed in the current ChatGPT environment and give a future Codex/code-running pass a concise verification list.
>
> **Do not turn this into a large automated test suite unless explicitly requested.** The project is intentionally small. Prefer build checks, direct smoke scripts and short manual playthroughs.

## Current environment blocker

### 2026-09-03

Attempted:

```bash
git clone --depth 1 https://github.com/Tiutmattiu/Sunflower.git
```

Result:

```text
fatal: unable to access 'https://github.com/Tiutmattiu/Sunflower.git/': Could not resolve host: github.com
```

Therefore the latest commits were **not** verified here with a local `npm run build` or browser run. GitHub file writes succeeded through the connected GitHub tool, but that is not equivalent to a Vite build.

## Next Codex pass — run these first

1. `npm install` if dependencies are absent.
2. `npm run build`.
3. Start the Vite app and do one mobile-width manual run.
4. If there is a syntax/runtime error, fix it directly before adding features.

## Smoke cases that matter now

### A. Day / market integrity

- Start Day 1.
- Confirm NPC noon intentions are generated before clearing.
- Clear noon.
- Confirm clearing uses the same committed intentions and does not reroll them.
- Confirm public transaction tape reflects actual inventory movement.

### B. Information asymmetry

- Player should not see every true inventory item.
- Investigating a trader should reveal a real information object.
- Selling a relevant holding lead during Morning should alter the buyer's noon plan because the buyer's belief changed.
- The UI must not expose `knowledgeBasis` or other private NPC reasoning.

### C. Substitute goods

Verify at least these:

- Sailor can value Dried Citrus Peel below Lime Crate.
- Bar can value Almond Paste Jar below Orgeat Bottle.
- Dock Dog can value Smoked Eel / Sea Lettuce as food substitutes.
- A buyer who already owns an acceptable substitute should not simultaneously behave as though the need is completely unmet.

### D. Recurring business life

Run several days with minimal player action.

Confirm:

- Bar consumes Ice Block after service, creating recurring demand.
- Dock Dog consumes cat food.
- Fishmonger, Dock Dog and Sailor receive deterministic rotating arrivals.
- Sailor's imports stop refreshing at / after the provisional departure window.
- Market does not freeze permanently after Day 1–2 simply because everyone acquired one quest item.

### E. Perishables

Check multiple shelf lives:

- Ice Block disappears quickly.
- Fresh Mackerel lasts longer than Ice but not indefinitely.
- Salted Cod lasts substantially longer.
- Player-facing spoilage logs are coherent.
- Perishable timers do not continue aging an item after it has changed owner incorrectly.

### F. Nightly sustenance

Test all branches:

1. Player has an edible inventory item → cheapest available food is consumed.
2. No food, but player has sardines → 1🥫 is consumed as food.
3. No food/cash, relationship >=2 with Bar or Dog → meal credit creates an obligation.
4. No food/cash/credit relationship → player wakes in Animal form.

After form change confirm:

- prior inventory and sardines move to an estate;
- animal has no direct claim to those assets;
- current legal identity is unrecognised;
- previous-life open obligations become estate obligations rather than silently disappearing;
- the game does not crash when the player's inventory becomes empty.

### G. Obligations

- Meal credit creates amount, creditor, due day and current-life identity.
- Repayment consumes one free-time action and moves sardines to creditor.
- Repayment improves relationship by 1.
- An unpaid current-life obligation becomes overdue only once and damages relationship only once.
- Old-life estate obligations do not repeatedly default against the new animal life.

### H. Animal proxy route

Create / force Animal form.

- Bar remains accessible.
- Formal Market is inaccessible directly.
- Build familiarity with Bar Apprentice to >=2.
- With 1🥫, requesting a proxy should grant formal-market access for that day only.
- With 0🥫 and familiarity >=3, proxy service can become a credit obligation.
- Proxy access should expire by the next day.
- Noon player orders should clear through active proxy access.

### I. Item/UI sanity

- New items render without missing icons / `undefined` values.
- Trader cards do not become unusably long on mobile.
- The larger inventory pool does not accidentally reveal hidden stock through dropdowns.
- `Tonight` sustenance copy matches actual settlement behaviour.

## Known provisional rules — do not over-polish yet

These are deliberately simple and may change after playtesting:

- 14-day prototype cap.
- 2 Morning + 2 Afternoon actions.
- nightly sustenance = 1 food unit or 1🥫.
- information sale price = 1🥫.
- Bar Apprentice is the only implemented formal-market proxy.
- proxy fee = 1🥫.
- hunger-without-credit currently shifts the player to generic Animal form; specific animal / causal transformation mapping is not designed yet.
- obligation enforcement currently damages relationships rather than seizing collateral.
- player estate exists but reclaim mechanics are not implemented.

## Update rule

Whenever ChatGPT makes code changes that cannot be locally run, append the new relevant smoke case or blocker here instead of claiming the build is verified.
