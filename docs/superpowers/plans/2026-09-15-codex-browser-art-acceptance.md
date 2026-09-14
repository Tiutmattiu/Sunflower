# Codex Browser + Art Acceptance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove the current canonical Sunflower route in real browsers, eliminate the known pointer/hitbox regressions, salvage and integrate useful unpublished ambient-art work, and turn native-scale visual acceptance into reproducible evidence rather than code-only claims.

**Architecture:** `CURRENT_GAME.md` remains the design authority. Gameplay truth stays in the existing engine/state modules; browser tests must drive the visible UI from a fresh save and may inspect saved/runtime state only after an action to verify what the UI just did, never to unlock a route or mutate progress. Ambient-art work stays noninteractive and uses the existing tableau/district layering and depth/occlusion pipeline instead of creating a second world renderer.

**Tech Stack:** React 18, Vite, Node 20, Playwright, SVG/PNG assets, existing `scripts/*.mjs` checks, GitHub Actions.

**Spec:** `CURRENT_GAME.md`

## Global Constraints

- Read `CURRENT_GAME.md` first. If older docs, old local work, or existing code conflict with it, `CURRENT_GAME.md` wins.
- The repo currently uses a single-writer rule on `main`. When Codex begins writing, ChatGPT becomes read-only reviewer until Codex pushes a coherent checkpoint or explicitly hands write ownership back.
- **Before pulling/switching/resetting anything, preserve useful unpublished local work.** Previous Codex work may include shisha/social-background figures and transparency fixes that were never pushed.
- Never force-push or rewrite published `main` history. Use `git pull --ff-only` after preservation.
- Do not count an internal callable action as route acceptance. The fresh player must discover and execute the action through visible UI.
- Do not mutate localStorage/world state to skip route gates in acceptance tests. Reading state after visible actions is allowed for assertions.
- Desktop acceptance viewport: **1440×1000**. Mobile acceptance viewport: **390×844**.
- Keep screenshots local unless the creator explicitly asks to commit them.
- Ambient crowd/background art is noninteractive: it must not steal pointer events from gameplay targets.
- Preserve the approved named cast identities in `CURRENT_GAME.md`; Dima is a finish/style reference, not a face/body/clothing template for incidental people.
- Incidental people must not be recoloured copies of Aspen/Joel/Juan/Yasmin/Dima/Wong/Sonya.
- Do not update `CODEX_VERIFICATION.md` with a claim unless the exact behavior was actually observed in the current build.

---

### Task 1: Preserve unpublished local work and establish the exact baseline

**Files:**
- Inspect only before preservation: working tree, untracked assets, local commits.
- May create a local salvage branch/commit if useful unpublished work exists.
- Do not edit product files in this task.

**Interfaces:**
- Consumes: local checkout and remote `main`.
- Produces: a clean, known baseline on latest `main`, plus a recoverable reference to every useful unpublished asset/change.

- [ ] **Step 1: Audit local state before any destructive Git command**

Run:
```bash
git status --short --branch
git log --oneline --decorate -12
git branch -vv
git diff --stat
git diff --name-only
find public src -type f \( -iname '*shisha*' -o -iname '*crowd*' -o -iname '*social*' -o -iname '*background*' \) -print | sort
```

Record in the session which files/commits are local-only. Specifically inspect any previously generated shisha/social-background figures and checkerboard/transparency fixes.

- [ ] **Step 2: Preserve useful local-only work**

If useful unpublished changes exist, create a recoverable branch and commit them before changing branches:
```bash
git switch -c codex-salvage-ambient-$(date +%Y%m%d-%H%M)
git add <only the useful unpublished files>
git commit -m "salvage: preserve unpublished ambient art work"
```

If the changes are not coherent enough to commit, copy them to a clearly named local salvage directory outside the repo and record the path. Do not silently discard anything.

- [ ] **Step 3: Return to current main without rewriting history**

Run:
```bash
git switch main
git fetch origin
git pull --ff-only origin main
git status --short --branch
git log -1 --oneline
```

Expected: clean or intentionally documented working tree, and `main` at current remote head.

- [ ] **Step 4: Run the code-level baseline**

Run:
```bash
npm ci
npm run test:harbour
npm run test:production
npm run test:visual
npm run build
```

Expected: PASS. If baseline is red, stop product work and diagnose that failure first.

- [ ] **Step 5: Commit only if Task 1 itself required a repo-visible preservation fix**

Do not make an empty checkpoint commit. If preservation required a legitimate repo change, commit it separately with a `salvage:` message.

---

### Task 2: Add a current-route real-browser acceptance harness

**Files:**
- Create: `scripts/browser-current-route-proof.mjs`
- Modify only if needed: `package.json`
- Reuse: `scripts/browser-production-proof.mjs`

**Interfaces:**
- Consumes: public UI and deterministic fresh save.
- Produces: a browser script that can run at desktop/mobile viewports, clears the saved visit, performs visible clicks only, and fails on console/page errors.

- [ ] **Step 1: Write the harness skeleton with fresh-save and error capture**

Create `scripts/browser-current-route-proof.mjs` with helpers equivalent to:
```js
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

async function freshPage(browser, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  return { page, errors };
}
```

The script may read `localStorage` after a visible action for assertions, but must never write route knowledge, locations, inventory, race state, or cash.

- [ ] **Step 2: Make the test fail if the UI route cannot be started visibly**

From a fresh page, assert the broad initial goal is visible and that no player-facing text contains unearned Juan-route solution vocabulary such as `one-wheel`, `race`, `sunflower field`, or a parts list before the relevant gates.

Run the dev/preview server and then:
```bash
node scripts/browser-current-route-proof.mjs
```

Expected before completing the harness: FAIL at the first unimplemented traversal step, not because the harness mutates state.

- [ ] **Step 3: Add reusable visible-interaction helpers**

Implement helpers that locate map targets by accessible labels/data attributes, click the target, wait for `SpokenLine`, choose visible response text, close comics explicitly, use `Next day`, and pan/zoom only through pointer/wheel/touch APIs.

Do not add a debug route-skip button to production UI.

- [ ] **Step 4: Add the desktop viewport run**

Use exactly:
```js
{ width: 1440, height: 1000 }
```

At completion, assert no collected browser errors and keep local screenshots under a gitignored/local path such as `/tmp/sunflower-browser-proof/desktop/`.

- [ ] **Step 5: Add the mobile viewport run**

Use exactly:
```js
{ width: 390, height: 844 }
```

Repeat the same fresh-save entry checks; do not reuse desktop localStorage/session.

- [ ] **Step 6: Add an npm entry only if it is useful locally**

If adding one, use a distinct script such as:
```json
"test:browser:current": "node scripts/browser-current-route-proof.mjs"
```

Do not silently replace the older browser proof.

- [ ] **Step 7: Run and commit the harness checkpoint**

Run:
```bash
npm run build
node scripts/browser-current-route-proof.mjs
```

Commit only once the harness itself works as intended:
```bash
git add scripts/browser-current-route-proof.mjs package.json
git commit -m "test: add current route browser acceptance harness"
git push origin main
```

---

### Task 3: Prove the negative information gates before proving the happy route

**Files:**
- Modify: `scripts/browser-current-route-proof.mjs`

**Interfaces:**
- Consumes: Task 2 harness.
- Produces: browser-level proof that the player cannot learn/see route answers before earning them.

- [ ] **Step 1: Add fresh-save Juan leak assertions**

Before fixing Joel's Mai Tai, interact with Juan wherever he is visibly available. Assert the conversation/action UI does **not** expose:
- sunflower field/cliff-route solution,
- Onewheel/unicycle construction,
- race wager,
- component checklist.

- [ ] **Step 2: Add pre-inference Orgeat assertions**

At Joel's Bar, before tasting/inspecting enough to infer the ingredient, assert the actionable UI does not say that Orgeat is the missing answer or offer a pre-known `buy Orgeat` quest.

- [ ] **Step 3: Add prop/world-layer leak checks**

Visit the nursery before `onewheel_plan` is learned. Confirm no visible prop/action labels expose `onewheel parts` as meaningful route information.

- [ ] **Step 4: Run desktop and mobile negative paths**

Run:
```bash
node scripts/browser-current-route-proof.mjs
```

Expected: both viewport variants pass all negative-gating assertions.

- [ ] **Step 5: Commit the negative-gating checkpoint**

```bash
git add scripts/browser-current-route-proof.mjs
git commit -m "test: prove current route information gates in browser"
git push origin main
```

---

### Task 4: Walk the full canonical Juan route from a fresh visible UI

**Files:**
- Modify: `scripts/browser-current-route-proof.mjs`
- Fix product files only when a browser-observed defect blocks the canonical route.

**Interfaces:**
- Consumes: Tasks 2–3 harness and `CURRENT_GAME.md` route.
- Produces: visible fresh-save proof of Mai Tai → social gate → one-wheel preparation → race → Juan field trip.

- [ ] **Step 1: Discover the Mai Tai problem visibly**

Through the UI:
1. meet/interact with Joel at the Bar,
2. taste the Mai Tai,
3. inspect the bar/shelf when the UI makes that meaningful,
4. verify Orgeat becomes identifiable only after that inference.

After the visible inference, read saved state only to assert `mai_tai_ingredient` was actually learned.

- [ ] **Step 2: Source and transfer the physical Orgeat bottle**

Use visible navigation and purchase UI. Verify the bottle appears in player inventory, then leaves player inventory and reaches Joel when supplied.

- [ ] **Step 3: Wait for real Joel/Juan co-presence**

Use `Next day` / normal visible activity as needed. Do not teleport Juan or Joel by writing state. When both are really at the Bar, visibly let Joel serve Juan the corrected drink.

Assert after the action that the saved/runtime state records `juan_bar_drink`.

- [ ] **Step 4: Unlock the wager through conversation**

Visibly choose the player line that explains the goal, then the follow-up that lets Juan explain his way/wager. Assert the player did not ask a pre-known cliff/race question before the gate.

- [ ] **Step 5: Complete the honest lime relationship condition**

Through visible UI:
1. accept the lime job,
2. inspect/count the crate,
3. disclose the short count,
4. deliver/settle it on honest terms.

Assert the player does not receive silent forgiveness/free goods and that the state records the honest representation path.

- [ ] **Step 6: Discover and build the Onewheel through Aspen**

Show Aspen the actual race problem; only then source the compatible real parts through visible cargo/purchase UI. Confirm no reserved/pledged component is consumed. Ask Aspen—not Wong—to assemble it.

- [ ] **Step 7: Prove both preparation modes**

On one fresh-save run, use practice and verify displayed race chance rises. On another fresh-save run or later eligible state, create the toad-circle opportunity; if Aspen actually attends, return to the berth and use her earned adjustment favor. Verify the displayed odds rise and do not become 100%.

Do not mutate `upgrades` or `practice` directly.

- [ ] **Step 8: Race with a real bar scene**

Only race when Joel and Juan are physically present. Record which named people are visibly/co-present at the Bar immediately before the wager.

After the visible race action, read `playerGame.routes.juan.lastBetting` and assert:
- every displayed bettor was in `lastBetting.present`,
- no absent named character appears in betting copy,
- displayed stakes equal the settled ledger,
- no console errors occurred.

- [ ] **Step 9: Prove the loss consequence at least once**

On a deterministic/fresh run that loses naturally, verify the player pays what free cash can cover and any remainder becomes an actual race-drinks commitment. Do not force the race outcome by editing state.

Advance time and verify the debt remains a real obligation until paid/breached under the existing rules.

- [ ] **Step 10: Prove the win does not directly mint the flower**

On a naturally winning run, after the race assert the UI/state is at `won` and there is still no sunflower. Then visibly select `Go with Juan`; only that action should move the scene to the field/cliff staging and grant the flower.

- [ ] **Step 11: Repeat critical route on mobile**

At minimum re-run the discovery gates, Joel/Juan co-presence interaction, Aspen build/adjustment action, race modal/comic, and `Go with Juan` at 390×844.

- [ ] **Step 12: Fix only browser-observed blockers, with regression first**

For each blocker:
1. capture a minimal browser or engine regression,
2. verify RED,
3. make the smallest product fix,
4. rerun the affected browser path and normal suites.

- [ ] **Step 13: Commit the full-route browser checkpoint**

Run:
```bash
npm run test:harbour
npm run test:production
npm run test:visual
npm run build
node scripts/browser-current-route-proof.mjs
```

Then:
```bash
git add scripts src package.json
git commit -m "test: prove canonical Juan route in real browser"
git push origin main
```

---

### Task 5: Reproduce and permanently guard the Yasmin/bowl pointer bug

**Files:**
- Modify: `scripts/browser-current-route-proof.mjs` or create focused `scripts/browser-hitbox-proof.mjs`
- Product files only if the bug reproduces: likely `src/HarbourMap.jsx`, `src/harbourTableau.css`, or cast/target geometry.

**Interfaces:**
- Consumes: current gallery scene.
- Produces: browser proof that visible character art/transparent sprite bounds cannot prevent the bowl from being selected.

- [ ] **Step 1: Navigate visibly to the gallery at a time the bowl is active**

Use the normal UI and pan/zoom controls. Do not call `onFocus` from page JS.

- [ ] **Step 2: Click the visible bowl at its rendered center and edge**

Assert the resulting focused interaction is the bowl/gallery object, not Yasmin and not the world drag layer.

Also inspect with browser APIs only for diagnosis:
```js
await page.evaluate(({x,y}) => document.elementFromPoint(x,y)?.outerHTML, point)
```

Do not use `elementFromPoint` to trigger the interaction.

- [ ] **Step 3: Verify Yasmin herself remains clickable where visibly drawn**

Click a clearly visible part of Yasmin that does not overlap the bowl. Assert Yasmin opens.

- [ ] **Step 4: If RED, fix event geometry rather than moving the bowl arbitrarily**

Named cast image internals should remain `pointerEvents="none"`; the intended named-actor target group may receive clicks, but transparent atlas pixels must not become a giant invisible blocker.

- [ ] **Step 5: Repeat at desktop and 390×844 mobile**

The same semantic target must win at both sizes after pan/zoom.

- [ ] **Step 6: Commit only after real pointer proof passes**

Use a focused commit such as:
```bash
git commit -m "fix: keep gallery cast hitbox off the bowl"
```

---

### Task 6: Reproduce and guard mobile atlas/transparent-hit-region interception

**Files:**
- Test: `scripts/browser-hitbox-proof.mjs` or current browser harness
- Modify only if reproduced: `src/HarbourMap.jsx`, relevant CSS, cast atlas usage.

**Interfaces:**
- Consumes: multiple named actors/nearby props on mobile.
- Produces: proof that transparent atlas rectangles never steal taps from visible world objects.

- [ ] **Step 1: At 390×844, test at least three named-cast/prop overlaps**

Include:
- Yasmin/bowl,
- Joel/bar glass or bottle,
- Aspen/berth cargo or lime crate.

At each, tap a prop where the image bounding rectangle could overlap but visible character pixels do not.

- [ ] **Step 2: Assert the correct target opens**

Record the `aria-label` / focused title after each tap. A transparent sprite rectangle intercepting the target is a failure.

- [ ] **Step 3: Test after pan and zoom**

Repeat one overlap after dragging and one after pinch/wheel zoom. Coordinate transforms must not recreate the interception.

- [ ] **Step 4: Fix root cause if reproduced**

Prefer pointer-event geometry/target-layer corrections. Do not simply shrink character art until the bug is hidden.

- [ ] **Step 5: Commit and rerun both browser suites**

```bash
npm run build
node scripts/browser-current-route-proof.mjs
node scripts/browser-hitbox-proof.mjs
```

---

### Task 7: Prove continuous-world camera semantics in real browser

**Files:**
- Test: browser proof script
- Modify only if RED: `src/harbourCamera.js`, `src/HarbourMap.jsx`, `src/harbour.css`

**Interfaces:**
- Consumes: existing cover/pan camera.
- Produces: real-browser evidence for no outside-world gutters, bounded panning, and desktop/mobile navigation.

- [ ] **Step 1: Desktop initial viewport proof**

At 1440×1000, screenshot the initial world and assert the map covers the world viewport. No teal/non-world gutter may appear because of aspect ratio.

- [ ] **Step 2: Desktop pan proof**

Drag far enough to produce a changed world transform/camera position. Verify desktop is genuinely pannable when the authored world exceeds viewport.

- [ ] **Step 3: Camera-bound proof**

Attempt extreme pans in all four directions. Screenshot each bound; no outside-world area may become visible.

- [ ] **Step 4: Mobile pan/pinch proof**

At 390×844, pan and zoom to at least the gallery, Bar and berth. Verify targets remain reachable and no large permanent UI strip reduces the world to a fitted illustration.

- [ ] **Step 5: Commit only if a product correction was actually required**

Browser evidence alone should be recorded in verification docs, not in fabricated code changes.

---

### Task 8: Salvage, clean and evaluate ambient crowd/shisha assets at native render scale

**Files:**
- Inspect salvage branch/files from Task 1.
- Possible assets: `public/art/...`
- Possible manifest/docs: existing art manifest/pipeline files.
- Possible renderer integration: `src/HarbourTableauLayer.jsx`, `src/harbourTableau.js`, `src/HarbourDistrictLayer.jsx`

**Interfaces:**
- Consumes: current explicit crowd dimensions (`complexion`, `hairStyle`, `headwear`, `build`, `ageGroup`) and any useful unpublished assets.
- Produces: transparent, noninteractive ambient art that is visually distinct from named cast and survives native-scale screenshot review.

- [ ] **Step 1: Compare salvage assets before generating replacements**

For every candidate asset, record:
- pixel dimensions,
- alpha-channel presence,
- whether checkerboard/white matte is baked into RGB,
- whether any figure visibly resembles a named cast member,
- intended zone and approximate in-game pixel height.

Use available image inspection tools; do not assume a checker pattern is transparency just because it looks like one.

- [ ] **Step 2: Reject or repair baked checkerboards/mattes**

A usable ambient PNG must have a true alpha channel where background should be empty. Verify by compositing it over at least two contrasting temporary backgrounds locally.

- [ ] **Step 3: Enforce incidental-person distinctness**

The ambient groups should include varied complexion, age, build, hair and head covering. The creator specifically wants the neighbourhood to plausibly include fictional people drawing visual cues from multiple communities, including Sephardic/Hasidic Jewish, Amazigh/Berber, Jamaican, Indian and Ethiopian neighbours, without turning those identities into caricature costume tokens.

Do not copy named-cast faces, hair/clothes silhouettes, or the Dima tracksuit/purple-sunglasses identity. Use Dima only as the linework/flat-colour/contrast/finish standard.

- [ ] **Step 4: Avoid the “all young fashionable light-skinned people” failure**

At minimum the integrated ambient set must visibly include:
- young, adult and elder people,
- multiple body builds,
- deep/dark/brown/olive/tan/light complexions across the broader crowd,
- several hair silhouettes,
- several headwear/head-covering silhouettes,
- ordinary working/service/leisure clothing, not only styled/fashion-forward outfits.

- [ ] **Step 5: Integrate as ambient noninteractive layers**

Use the existing tableau/depth pipeline. Do not create new buttons or a duplicate hotspot system. Ensure the rendered group or image has `pointer-events: none` / equivalent noninteractive behavior.

- [ ] **Step 6: Check depth/occlusion at native game scale**

Place people behind/in front of the relevant bar counter, shisha screen, nursery fence, railings, etc. using existing feet-Y/depth/occluder logic. Do not judge only from opening the asset at full resolution.

- [ ] **Step 7: Screenshot desktop and mobile native-scale scenes**

Capture at least:
- shisha/social strip,
- faith/vice street,
- berth/work area,
- park/civic area.

Review for duplicate faces, main-cast lookalikes, baked backgrounds, over-fashionable homogeneity, unreadably tiny details, or figures visually floating above the ground.

- [ ] **Step 8: Run art/code checks and commit the ambient-art checkpoint**

```bash
npm run test:harbour
npm run test:visual
npm run build
```

Commit only the selected final assets and integration code; do not commit discarded generations or screenshot dumps.

---

### Task 9: Verify one-line dialogue lifecycle and interaction anchoring in browser

**Files:**
- Browser proof script
- Product files only if RED: `src/SpokenLine.jsx`, `src/AppCore.jsx`, CSS.

**Interfaces:**
- Consumes: ordinary interactions and comics.
- Produces: real-browser proof that dialogue does not autoplay, does not continue after leaving, and closes when complete.

- [ ] **Step 1: Open a no-choice conversation**

Observe one short spoken line. Wait longer than the historical autoplay interval (>3 seconds) without clicking.

Assert the next line/action did not advance on its own.

- [ ] **Step 2: Complete a no-choice conversation**

Advance explicitly until no meaningful response remains. Assert the conversation closes rather than leaving a dead empty panel.

- [ ] **Step 3: Close/leave mid-interaction**

Close a dialogue/comic before completing it, wait >3 seconds, and assert no hidden autoplay or later UI mutation occurs.

- [ ] **Step 4: Check mobile anchoring**

At 390×844, open conversations at Bar, berth and gallery. Verify speech/response controls remain reachable and do not jump to unrelated screen positions as lines advance.

- [ ] **Step 5: Commit only if a real defect required code changes**

---

### Task 10: Verify exhausted-time UX through visible UI

**Files:**
- Browser proof script
- Product files only if RED.

**Interfaces:**
- Consumes: limited attention/time system.
- Produces: proof of `Start tomorrow` vs `Keep looking around` rather than silent failure/auto-advance.

- [ ] **Step 1: Consume the day's meaningful action budget visibly**

Use normal travel/interactions until the next meaningful action is blocked by attention.

- [ ] **Step 2: Attempt one more meaningful action**

Assert a visible choice appears with both:
- `Start tomorrow.`
- `Keep looking around.`

- [ ] **Step 3: Choose `Keep looking around`**

Assert the day does not auto-advance and map inspection remains possible.

- [ ] **Step 4: Re-trigger and choose `Start tomorrow`**

Assert the day advances exactly once.

---

### Task 11: Full regression, evidence audit and handoff

**Files:**
- Modify: `CODEX_VERIFICATION.md` only for facts actually re-tested in this pass.
- Do not mark untested art/browser claims as complete.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: clean main checkpoint plus exact tested/unverified split for ChatGPT review.

- [ ] **Step 1: Run all code suites fresh**

```bash
npm run test:harbour
npm run test:production
npm run test:visual
npm run build
```

Expected: all PASS.

- [ ] **Step 2: Run both browser suites fresh**

```bash
node scripts/browser-production-proof.mjs
node scripts/browser-current-route-proof.mjs
```

If a focused hitbox proof exists, run it too.

- [ ] **Step 3: Recheck legacy economic routes that must not regress**

Through existing scripts/browser coverage, verify at least:
- Auction preview/inspection/bid/walk and secured finance/repayment,
- Sonya supper commitment,
- toad collect/use/circle,
- public cash/unit reservations,
- Dima private settlement transfers a real object rather than minting guaranteed profit,
- race loss drinks debt,
- Juan win → separate field trip → flower,
- legacy save missing `raceBets` does not crash.

- [ ] **Step 4: Update `CODEX_VERIFICATION.md` conservatively**

For each newly documented statement, include:
- exact viewport if visual/browser-specific,
- whether fresh save was used,
- route/path exercised,
- whether the claim is engine-tested, browser-tested, or visually inspected.

Do not write “verified” based only on code inspection.

- [ ] **Step 5: Check repository cleanliness and push**

```bash
git status --short --branch
git log --oneline -8
git push origin main
```

Expected: no accidental screenshot dumps, discarded generations, or unrelated local files committed.

- [ ] **Step 6: Handoff to ChatGPT for read-only audit**

Provide:
- final main SHA,
- the meaningful checkpoint SHAs,
- exact commands that passed,
- browser viewports tested,
- local screenshot paths (do not commit them unless requested),
- any remaining failures/uncertain visual judgments,
- any salvaged asset branch/path not merged.

ChatGPT should then audit the pushed diff against `CURRENT_GAME.md` before taking write ownership back.
