# Sunflower — Codex Verification Runbook

> Purpose: record checks that could not be executed in the current ChatGPT environment and give a future Codex/code-running pass a concise verification list.
>
> **Do not turn this into a large automated test suite unless explicitly requested.** The project is intentionally small. Prefer build checks, direct smoke scripts and short manual playthroughs.

## Current environment blocker

### 2026-09-03

Repeated attempt:

```bash
git clone --depth 1 https://github.com/Tiutmattiu/Sunflower.git
```

Result:

```text
fatal: unable to access 'https://github.com/Tiutmattiu/Sunflower.git/': Could not resolve host: github.com
```

Therefore the latest `main` has **not** been verified here with a local `npm run build`, Vite dev server, or browser playthrough. GitHub connector reads/writes succeeded, but that is not equivalent to runtime verification.

The repo is structurally a Vite/React app (`npm run dev`, `npm run build`, `npm run preview`). `vite.config.js` now uses `base: "./"` so built asset paths are safer for static/project-page hosting, but deployment itself still needs a real check.

A repository check on 2026-09-03 found **no `.github/workflows` directory**, so there is currently no repository Actions workflow proving or automatically deploying the build. This does not rule out a manually configured Pages branch, but no live Pages deployment has been verified.

## Next Codex pass — run these first

1. `npm install` if dependencies are absent.
2. `npm run build`.
3. Start the Vite app.
4. Do one desktop and one narrow/mobile manual run.
5. If there is any syntax/runtime error, fix it directly before adding features.
6. Do not add CI / Playwright / Jest unless specifically asked.

---

# Smoke cases that matter now

## A. Day / market integrity

- Start Day 1.
- Confirm NPC noon intentions exist before clearing.
- Clear noon.
- Confirm clearing uses the exact same committed intentions and does not reroll them.
- Confirm public transaction tape reflects actual cash and inventory movement.
- Confirm information discovered/sold during Morning can causally change a plan before noon, but Resolve itself never rerolls.

### Important current clearing caveat

The prototype still executes player orders before NPC plans. That gives the player priority when both target the same unit. This is **not final market design**; a future pass should likely batch competing orders for the same public unit instead of giving hero priority. Do not silently preserve this as canon simply because it currently works.

## B. Information asymmetry + staged precision

Player must not see every true inventory item.

`precision` and `confidence` are separate fields.

### Bar sequence

1. first investigation → Apprentice is learning a Mai Tai and one ingredient is missing;
2. second → rum / lime / orange curaçao are confirmed present, still no explicit Orgeat name;
3. third → exact Orgeat need is revealed.

A player with cocktail knowledge should be able to infer Orgeat before step 3; the game should not require a quiz.

### Sailor sequence

1. selective cargo / approaching departure context;
2. oily / medicinal hidden-cargo hint;
3. exact Sperm Whale Oil holding.

Also confirm:

- exact `holding` information becomes targetable known stock;
- broad/specific need clues do not reveal hidden inventory;
- selling a relevant holding lead during Morning changes the buyer's beliefs and can change noon positioning;
- UI does not expose `knowledgeBasis` or hidden NPC reasoning;
- broad NPC market interests do **not** scan hidden inventories.

## C. No invisible substitutes

The hidden-substitute experiment was removed.

Verify:

- no Dried Citrus Peel / Almond Paste secret partial-credit behavior remains;
- NPC needs are exact unless a future category/alternative is explicitly made legible;
- engine does not award designer-only substitute credit.

## D. 68-item catalogue reachability

Confirm all current `ITEMS` definitions resolve without `undefined` references.

Spot-check requested/high-priority goods:

- Chia Seeds
- Two Octopus Tentacles
- Glasses Wipe
- Presta Inner Tube
- Chain Quick-Link
- Brake Cable
- Handlebar Tape
- Tiny Torque Wrench
- Bicycle Bell
- Hawthorne Strainer
- 30/45 Jigger
- Long Bar Spoon
- Fine Mesh Strainer
- Hand Citrus Press
- Lewis Bag
- Orange Curaçao
- Demerara Syrup

Static design intent:

- most goods begin in some inventory;
- Dog/Fishmonger/Sailor cycles introduce recurring goods;
- Pocket Match is no longer a dead definition;
- Mai Tai, Built Onewheel, auction lots, spoilage and Sunflower are rule/event outputs.

Runtime check:

- every kept item should have a path into play;
- no item should silently disappear because of a spelling mismatch;
- the larger catalogue must not force all 68 items onto the player at once.

## E. Stable market interests

Current broad interests:

- Dog → Scavenged / Animal-network / Tiny Utility / Container;
- Fishmonger → Food Commodity / Cold-chain / Harbour;
- Sailor → Bicycle / Repair / Tool / Durable;
- Vale → Prestige / Collectible / Story / Information-bearing / Scarce Curio / Mystery;
- Clown → Speculative / Vehicle / Bicycle / Mystery / Story;
- Bar → Cocktail Ingredient / Bar Tool / Barware / Container.

Verify:

1. these interests create some trades beyond exact quest needs;
2. they only act on public stock / tape / purchased-known holdings;
3. they do not reveal hidden inventory;
4. each NPC still commits at most one best noon plan in the current prototype;
5. Day 1 does not become an over-efficient explosion of six perfect trades;
6. market remains explainable after several days.

## F. Public sell-side listings

The market UI now shows two different public surfaces:

- **For sale** — current public stock with seller ask and item reference price;
- **Committed buy bids** — NPC purchase intentions committed before noon.

Verify:

- only `publicStock` actually still held by that seller appears in sell listings;
- hidden holdings never leak into this list;
- an item disappears from the listing after it is sold / consumed;
- newly arrived cycle goods appear only when they are part of that trader's declared public stock;
- displayed ask matches `sellerAsk()` at the current state;
- long listing names remain usable on mobile;
- the board is not so long that the actual trade controls become unusable;
- public listings become targetable through the player's order dropdown because public stock is known stock.

## G. Player barter valuation — exploit check

Current intended ordinary rule:

```text
payment value = reference value of offered item
              + target NPC private utility for that item
              + offered sardines
```

That combined seller-side valuation must meet the current ask.

For the explicit **Bad Tangerine** deception route, the Sailor temporarily values the tangerine as if it satisfied the Lime need, but the resulting mistaken valuation **still has to meet the ask**. Deception changes beliefs; it does not provide an unlimited free-item bypass.

Verify especially:

- a cheap object that merely matches a broad market interest cannot be swapped for an expensive asset for free;
- an exact high-utility good can command a real premium without becoming an unconditional quest key;
- private utility changes willingness to trade rather than bypassing price entirely;
- Bad Tangerine cannot buy an arbitrarily expensive Sailor asset;
- successful Bad Tangerine deception still sets the cheated flag / reputation consequence;
- failed-order UI does not reveal the target's exact hidden private utility number.

## H. First coordinated price rebase

Current reference values are no longer the old 1–16 compressed scale.

Current rough bands:

- waste / tiny junk: 1–3🥫;
- small everyday/scavenged: 2–6🥫;
- common food: 4–9🥫;
- cocktail ingredient / ordinary part: 5–14🥫;
- professional durable: 7–18🥫;
- scarce input / collateral-like durable: 12–20🥫;
- prestige / collectible / special situation: roughly 9–22+🥫;
- vehicles: ~28–30+🥫;
- Auction Sunflower reference/lot placeholder: 52🥫;
- living `Sunflower`: **unpriced (`value: null`)**.

Starting cash:

- Player 18🥫
- Dog 18🥫
- Fishmonger 30🥫
- Sailor 26🥫
- Vale 52🥫
- Clown 22🥫
- Bar 34🥫

Still small by design:

- nightly sustenance = 1 food unit or 1🥫;
- information lead base price = 2🥫;
- Bar proxy fee = 2🥫.

Run several days and record:

- trades/day;
- percentage spreads;
- how often cash constraints block otherwise rational trades;
- time to first liquidity shortage;
- whether Vale dominates simply because of starting cash;
- whether Dog actually behaves like a dealer;
- whether Bar can afford both recurring inputs and tool upgrades;
- whether expensive tools transact at all;
- whether prestige/speculative goods become permanent dead inventory;
- whether player 18🥫 allows meaningful positioning without trivialising sustenance.

Do not rebase again from intuition alone; use the smallest numerical changes that explain observed problems.

## I. Recurring business life

Run several days with minimal player action.

Confirm:

- Bar consumes Ice Block after service;
- Dock Dog consumes Fresh Mackerel for cats;
- Fishmonger, Dock Dog and Sailor receive deterministic rotating arrivals;
- Sailor imports stop refreshing at/after provisional departure;
- market does not freeze permanently after Day 1–2 simply because exact goals were acquired.

## J. Perishables

Check:

- Ice Block disappears quickly;
- Fresh Mackerel lasts longer than Ice but not indefinitely;
- Two Octopus Tentacles are short-lived;
- Salted Cod lasts substantially longer;
- owner changes do not accidentally preserve/duplicate old perish timers;
- player spoilage logs make sense.

**Legacy duplicate caveat:** transfer/consumption now removes one matching copy rather than every same-name copy. However, perish timers are still keyed by `traderId:itemName`, not unique item instance. If true duplicate perishables become common, migrate perishability to per-instance ages or an age-bucket/count model instead of pretending the current timer is instance-safe.

## K. Nightly sustenance

Test all branches:

1. edible inventory → cheapest edible is consumed;
2. no food but cash → 1🥫 is opened as food;
3. no food/cash, relationship >=2 with Bar or Dog → meal credit creates an obligation;
4. no food/cash/credit relationship → player wakes in Animal form.

After transformation:

- prior cash/items move to estate;
- new animal cannot directly claim them;
- legal identity becomes unrecognised;
- old-life open obligations become estate obligations;
- empty player inventory does not crash UI/market.

## L. Obligations

- meal credit records amount / creditor / due day / current life identity;
- repayment consumes one free-time action and transfers sardines;
- repayment improves relationship by 1;
- unpaid current-life obligation becomes overdue once;
- relationship is damaged once rather than every subsequent frame/day;
- old-life estate obligations do not default against new life.

## M. Animal proxy route

Force/obtain Animal form.

- Bar stays accessible;
- Formal Market is not directly accessible;
- familiarity with Apprentice >=2 enables proxy request;
- with **2🥫**, proxy grants formal-market access for that day;
- with 0🥫 and familiarity >=3, proxy can become a 2🥫 credit obligation;
- access expires next day;
- noon player orders clear while active proxy exists.

## N. Sunflower acquisition is no longer game over

Test each current acquisition route if reachable:

- Grandma Supper;
- Vale Auction;
- Cliff route.

After acquiring the living Sunflower:

- it enters player inventory;
- it displays as **unpriced**, not `0` or `99`;
- `game.ended` remains false;
- `flags.sunflowerAcquired` becomes true;
- objective changes from `Get a sunflower` to `Go home`;
- UI displays `Nothing happens. You are still here.`;
- other sunflower acquisition routes should not immediately retrigger;
- ordinary market/day progression continues.

Current provisional rebased route numbers:

- Vale invitation NW threshold: 70🥫 clean / 90🥫 cheated;
- Vale reserve: 52🥫 clean / 68🥫 cheated;
- invitation now additionally requires enough liquid sardines to meet the current reserve, because auction financing is not implemented yet;
- Cliff simple pre-race NW threshold: 60🥫.

These need playtesting; they are not canon.

At the prototype life cap, a player who already has the flower should receive the specific text that it did not take them home.

## O. Item/UI sanity

- item chips/dropdowns show `ref X🥫`, not an implied intrinsic value;
- living Sunflower shows `unpriced`;
- long names wrap on mobile;
- Bar's large true inventory is not fully exposed by default;
- hidden inventory does not leak through dropdowns;
- Information Book shows both precision and confidence;
- fee labels match engine constants (info 2🥫, proxy 2🥫);
- current Objective is visible;
- post-flower callout does not block ongoing play.

## P. Static hosting / deployment

`vite.config.js` now uses:

```js
base: "./"
```

Verify built assets load correctly when served:

- at `/`;
- and, if used, from a project subpath such as `/Sunflower/`.

No `.github/workflows` directory was present when checked on 2026-09-03. Do not assume GitHub Pages is configured merely because the repo is public.

## Q. Legacy pre-rewrite Codex audit regression checklist

A much older read-only Codex audit from before the engine/world rewrite is useful as a regression list. Current static status:

### Resolved / structurally replaced

- visible NPC intention rerolled at resolve → **resolved**; plans are committed before clearing;
- event branches bypassed the 14-round cap → **resolved** by central phase/day advancement;
- spoiled fish vanished because filter/push logic discarded replacement → **resolved** by current `nextInventory` settlement;
- race wealth was calculated after consuming route items → **resolved**; current race checks pre-race net worth;
- NPC trades moved items silently → **resolved**; NPC and player trades enter the public tape;
- one 860-line `App.jsx` held engine/data/AI/UI → **resolved** into `gameData.js`, `npcAI.js`, `gameEngine.js`, `App.jsx`;
- `Pocket Match` was unreachable → **resolved**; it is now Dog stock/cycle;
- full inventory omniscience → **replaced** by public stock + tape + information discovery;
- acquiring canonical Sunflower immediately ended the game → **deliberately replaced**; objective becomes `Go home` and play continues.

### Fixed in the legacy-regression pass

- transferring/consuming one item removed every same-name copy → **fixed for ordinary transfers/consumption with `removeOne()`**;
- auction invitation could appear with insufficient liquid cash → **fixed provisionally** by requiring current reserve cash until financing exists;
- no-action run defaulted to `The Clean Knife` → **fixed** with `The Bystander`;
- production crash page exposed stack trace → **stack now shown only in Vite DEV**;
- redundant stylesheet link in `index.html` → **removed**;
- README was effectively empty → **rewritten with current architecture/run/docs status**.

### Still open / intentionally provisional

- **player-order-first priority:** player currently gets first execution against contested inventory; needs batch competition;
- **route priority:** `buildEvents()` still returns only the first eligible route (`events.slice(0, 1)`); decide whether multiple actionable routes should coexist in UI;
- **Auction Sunflower legacy definition:** no longer spawned as a normal Vale inventory reward, but the catalogue still contains the old auction-lot placeholder and should be cleaned/repurposed when auction design is rewritten;
- **perishable duplicates:** timer key is still per trader + item name, not item instance;
- **persistence:** reload still loses run state; decide later whether this matters for intended session length;
- **deterministic replay seed:** current core AI is mostly deterministic, but there is still no formal seeded-run/persistence format;
- **CSS import duplication:** CSS is still imported by both `main.jsx` and `App.jsx`; Vite normally deduplicates it, but one import can be removed next time `App.jsx` is touched;
- **route/UI single-source-of-truth:** much improved because route conditions live in engine, but current event presentation still only consumes the first pending event.

---

# Known provisional rules — do not over-polish yet

- 14-day prototype cap only; not cosmology.
- 2 Morning + 2 Afternoon actions.
- nightly sustenance = 1 food unit or 1🥫.
- info sale base = 2🥫.
- Apprentice is currently the only implemented formal-market proxy.
- proxy fee = 2🥫.
- hunger-without-credit currently produces generic Animal form; exact animal/karma mapping is unresolved.
- obligation enforcement currently mainly affects relationships rather than collateral seizure.
- former estate reclaim mechanics are not implemented.
- all item `value`s are reference prices, not intrinsic value.
- living Sunflower is unpriced.
- acquiring Sunflower is only the first objective reveal, not victory.
- the deeper `Go home` / rebirth game is not implemented yet.
- player-order-first clearing remains a provisional implementation detail and should be replaced by fair batch competition once runtime is available to test it safely.

## Update rule

Whenever ChatGPT makes code changes that cannot be locally executed, update this file instead of claiming a build/runtime result that was not observed.
