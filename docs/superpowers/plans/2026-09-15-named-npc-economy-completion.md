# Named NPC Economy Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the MD-defined named-NPC economy by turning Wong, Juan, Yasmin, Dima and Aspen's existing economic identities into persistent, conserved runtime systems that interact with one another.

**Architecture:** Extend the existing Harbour Spine rather than creating parallel NPC minigames. New focused modules hold tunable economic data and state transitions; `harbourSpine.js`, `livingSystems.js`, `productionGame.js` and `relationalHarbour.js` call those modules at day/route/transaction boundaries. All physical assets remain unit objects, all debt remains claim/commitment state, and all cash moves through existing actor balances/ledgers.

**Tech Stack:** JavaScript ES modules, deterministic seeded simulation, Node regression scripts, React/Vite existing UI, GitHub Actions verification.

**Spec:** `docs/superpowers/specs/2026-09-15-named-npc-economy-completion-design.md`

## Global Constraints

- `CURRENT_GAME.md` is the highest implementation authority.
- Work directly on `main`; no development branch and no force-push.
- One writer at a time.
- Sonya remains a supporting/background household figure, not a seventh economic actor.
- Never duplicate physical units or create unexplained cash.
- Reuse existing claims, reservations, living assets, `privateTransactions`, `returnLedger`, `evidence`, and source/inventory structures.
- Do not add NFT/Web3 mechanics until the underlying capital/payment systems in this plan exist.

---

### Task 1: Shared enterprise/finance/source primitives

**Files:**
- Create: `src/npcEconomy.js`
- Create: `scripts/npc-economy-primitives-check.mjs`
- Modify: `src/harbourSpine.js`
- Modify: `package.json`

**Interfaces:**
- Produces `initializeNpcEconomy(world)`, `npcEconomyDay(world)`, `createSecuredClaim(world, terms)`, `settleSecuredClaims(world)`, `sourceState(world, good)`, `recordSourceDiscovery(world, routeId, goods)`.
- Later tasks consume `world.npcEconomy`, `world.sourceBook`, and generic secured claims.

- [ ] **Step 1: Write failing primitive regression**

Create assertions that fresh world has a source book and persistent NPC economy state; a secured claim locks one collateral unit; a second claim on the same unit fails; repayment releases collateral; default transfers collateral without duplicating it; source discovery moves a good from `UNKNOWN` to `SOURCE_LOCATED` and finite returned inventory to `LOCALLY_AVAILABLE`.

- [ ] **Step 2: Run regression and confirm RED**

Run `node scripts/npc-economy-primitives-check.mjs` and expect missing exports/state.

- [ ] **Step 3: Implement minimal shared primitives**

`src/npcEconomy.js` owns only generic economy mechanics, not NPC-specific story copy. Claims use existing actor cash and unit `pledgedTo`; source state is keyed by good and records route, discovery count, successful returns and status.

- [ ] **Step 4: Initialise and advance from Harbour Spine**

Call `initializeNpcEconomy(w)` during world creation and `npcEconomyDay(w)` at the daily settlement boundary. Keep existing `settlePlayerDebts` working.

- [ ] **Step 5: Gate build and commit**

Add the regression to `test:production`, run harbour + production checks, then commit.

---

### Task 2: Wong productive enterprise + Dima rent/equipment finance

**Files:**
- Create: `scripts/wong-enterprise-check.mjs`
- Modify: `src/npcEconomy.js`
- Modify: `src/harbourSpine.js` only if a day-boundary hook is required
- Modify: `package.json`

**Interfaces:**
- Consumes generic claim/assets from Task 1.
- Produces `world.wongBusiness` with `stage`, `fixedAssets`, `serviceCapacity`, `dailyRevenue`, `dailyCost`, `rentAmount`, `rentDueDay`, `landlordId`, `rentArrears`, `expansionHistory`.
- Produces `investWongAsset(world, assetId, financierId?)` and `runWongBusinessDay(world)`.

- [ ] **Step 1: Write failing Wong regression**

Prove: expansion spends actual Wong/Dima cash; creates one durable productive asset; raises a concrete future service capacity/revenue input; rent transfers actual cash Wong→Dima; insufficient cash creates arrears/obligation instead of negative cash; equipment finance creates a real claim/revenue-share and later settlement pays Dima from business cashflow.

- [ ] **Step 2: Confirm RED**

Run `node scripts/wong-enterprise-check.mjs`.

- [ ] **Step 3: Implement tunable Wong stages/assets**

Use data objects for `storage_racks`, `laundry_machine`, `expanded_frontage`. Each has cost, residual value, capacity/service effect and incremental operating cost. Do not create a generic `+3 capacity` upgrade without an asset.

- [ ] **Step 4: Implement Dima landlord/financier relationship**

Initial landlord is `dima`. Rent cadence is bounded and visible in ledger state. Equipment finance transfers Dima cash to Wong and creates a claim/revenue-share with real repayment exposure.

- [ ] **Step 5: Verify and commit**

Run production/harbour regressions, verify cash conservation, commit.

---

### Task 3: Juan crop economics + maturity mismatch choices

**Files:**
- Create: `scripts/juan-capital-check.mjs`
- Modify: `src/economicContent.js`
- Modify: `src/livingSystems.js`
- Modify: `src/npcEconomy.js`
- Modify: `package.json`

**Interfaces:**
- Produces crop profiles containing `maturityDays`, `inputCost`, `inputInterval`, `baseYield`, `weatherSensitivity`, `failureRisk`, `earlySaleFraction`, `matureValue`.
- Produces `earlySellLivingAsset(world, assetId, buyerId)`, `assignFutureOutput(world, assetId, buyerId, cashNow, share)`, and secured-loan compatibility with living-asset collateral.

- [ ] **Step 1: Write failing crop/finance regression**

Assert at least four Juan crop families differ on two or more economic/risk dimensions; storm affects a sensitive crop more than a hardy crop; early sale transfers the living asset and current cash but forfeits later output; future-output assignment keeps the asset with Juan but transfers an agreed share of realised harvest; secured loan keeps residual upside but creates fixed repayment/default exposure.

- [ ] **Step 2: Confirm RED**

Run `node scripts/juan-capital-check.mjs`.

- [ ] **Step 3: Add crop economics without replacing existing maturity system**

Extend existing family definitions and daily living-system advance deterministically using world seed/day; preserve existing asset IDs and harvest semantics.

- [ ] **Step 4: Implement distinct liquidity structures**

Use real cash transfers and claim/share records. Ensure early sale, output assignment and secured loan differ in ownership, upside and default consequences.

- [ ] **Step 5: Verify and commit**

Run living/economy/route checks and commit.

---

### Task 4: Yasmin general secured capital + Dima workout

**Files:**
- Create: `scripts/private-capital-workout-check.mjs`
- Modify: `src/npcEconomy.js`
- Modify: `src/productionGame.js` only to route existing player-facing actions through shared primitives where safe
- Modify: `package.json`

**Interfaces:**
- Consumes `createSecuredClaim`, Juan future-output records.
- Produces `yasminSecuredAdvance(world, borrowerId, collateralId, requestedPrincipal)`, `dimaBuyClaim(world, claimId, price)`, `dimaExtendClaim(world, claimId, fee, extraDays)`, `dimaGuaranteeClaim(world, claimId, fee)`.

- [ ] **Step 1: Write failing private-capital regression**

Prove sale ≠ pledge; haircut constrains Yasmin principal; default changes collateral ownership only after maturity/default; Dima claim purchase transfers actual cash and holder identity; extension charges fee and changes maturity without deleting face; guarantee records contingent exposure and only pays on actual default.

- [ ] **Step 2: Confirm RED**

Run `node scripts/private-capital-workout-check.mjs`.

- [ ] **Step 3: Implement shared private-capital functions**

Do not duplicate claim ledgers. Preserve current auction finance behavior by translating it to the generic secured primitive when possible.

- [ ] **Step 4: Implement Dima workout functions**

Require cash/risk capacity; never create free rescue.

- [ ] **Step 5: Verify and commit**

Run all production/harbour checks, commit.

---

### Task 5: Aspen route-source progression and named interdependence

**Files:**
- Create: `scripts/aspen-source-progression-check.mjs`
- Modify: `src/relationalHarbour.js`
- Modify: `src/npcEconomy.js`
- Modify: `src/harbourSpine.js` only if source replenishment hook is required
- Modify: `package.json`

**Interfaces:**
- Consumes source-book primitives.
- Produces finite cargo arrival transitions and establishment counters from existing `short`, `medium`, `outer` route completion.

- [ ] **Step 1: Write failing route-source regression**

Assert route choice does not unlock all goods immediately; completing a route records only its cargo/source discoveries; returned goods are finite physical units; repeated successful source visits can move a configured good to `ESTABLISHED`; bounded replenishment requires explicit cost/lead time and cannot mint unlimited stock.

- [ ] **Step 2: Confirm RED**

Run `node scripts/aspen-source-progression-check.mjs`.

- [ ] **Step 3: Connect route completion to source book**

Keep existing route cost/duration/risk logic. Add source discovery/return calls at the point cargo actually returns.

- [ ] **Step 4: Add small representative established-source replenishment**

Support only a few route goods initially; generic data model permits later expansion. Replenishment must create an authorised external flow and physical units with source provenance.

- [ ] **Step 5: Verify and commit**

Run full checks and commit.

---

### Task 6: Conformance/health audit and Codex handoff

**Files:**
- Create: `scripts/named-economy-health-check.mjs`
- Modify: `docs/CURRENT_GAME_CONFORMANCE.md`
- Create or Modify: `docs/superpowers/verification/2026-09-15-named-npc-economy.md`

**Interfaces:**
- Consumes all prior systems.
- Produces a deterministic multi-day health report and explicit browser/asset handoff.

- [ ] **Step 1: Write deterministic health simulation**

Run at least 40 days and report Wong revenue/cost/rent/arrears, Dima rent/finance income and exposure, Juan harvest/default distribution, Yasmin secured-book exposure/default recovery, Aspen source statuses, named↔named cashflow share, and any negative cash/duplicate asset/double-pledge violations.

- [ ] **Step 2: Run existing full verification**

Run `npm run test:harbour`, `npm run test:production`, `npm run test:visual`, and production build in CI/local available environment.

- [ ] **Step 3: Update conformance truthfully**

Mark only engine-proven mechanics as verified. Leave UI/browser discoverability as browser-required.

- [ ] **Step 4: Record Codex next-pass tasks**

Codex should browser-test player-visible secured finance/early sale/source availability, visualise Wong expansion and Dima rent collection, and author later Dima ice-cream-truck/payment-rail assets only after state is stable.

- [ ] **Step 5: Commit verification documentation**

Do not claim browser acceptance unless actually performed.
