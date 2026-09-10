# Sunflower — Dated Prototype Verification

## Continuous-map working checkpoint — 2026-09-10

This pass continues `codex/living-harbour`; it does not restart from `main`. The player renderer is `AppCore.jsx` / `HarbourMap.jsx`, with developer Scene Lab isolated behind a development-only flag.

Verified locally:

- `npm run build`: passed, 48 modules. `npm run test:production`: passed after reservation-safe production payments. `node scripts/harbour-interface-check.mjs`: passed acquaintance/route entry, absent counterparties, atomic failures, dates, unique deliveries, pledged stock, contextual knowledge, idempotent intra-day settlement and debt release checks.
- `npm run test:browser`: actual installed Edge input, fresh saves, desktop 1440×1000 and mobile 390×844. Both completed discovery, phone/newspaper, remembered route instructions, four physical part purchases, assembly, cliff and final reflection. These route pages had no page errors or horizontal overflow.
- Additional mobile browser flow bought a real public-market fish, previewed the bowl, borrowed eight tins, saw the nine-tin obligation and repaid it. Another flow exhausted available time through posted offers, declined tomorrow, continued looking, then chose the next day.
- Inspected local arrival/reflection screenshots. Captures are in OS temporary directories and are not committed. Enlarged figures and separate grounded actor anchors correct the earlier water/table placements. Gallery actor hit interception was reproduced with real clicks and corrected by separating the standing position from the bowl.
- Dialogue displays one sentence at a time and closes when no response remains. Tests click through spoken lines, rather than invoking engine methods. The whole-market time refusal now supplies the same tomorrow/keep-looking prompt as person actions.
- Reserved cash is excluded from fines and production payments. An unfunded private payout takes no fee. Dedicated assertions reproduce both cases. Cliff comic no longer inserts Juan when he is absent.

Earlier interactive play in this working session reached Auction and Supper (including the special fresh catch), Toad circle and repeated Juan/Dima Bar encounters. Those paths have not all been rerun since the latest figure positioning changes: do not infer complete browser acceptance from engine checks.

Still open: background detail resolution and meaningful scene layers; remaining atlas edge quality; wider repeated encounters and route diversity; cargo/incident variability; fuller novice guidance and goods presentation; rerun Auction/Supper/Toad/private-sanction flows on the latest visual build. Approved cast identities remain unchanged. The background is working art, not final visual acceptance.

The historical evidence below describes the retired interface and must not be treated as current player UI.

> **Historical prototype evidence: 2026-09-04.** The executable contracts and observed checks below retain that scope. They do not verify the 2026-09-07 frozen gameplay constitution in `GAME_DESIGN.md` §5. No runtime checks were repeated by the canon/documentation pass. Git history carries superseded implementation archaeology.
>
> Keep verification small: production build, the two direct smoke scripts, and focused browser checks. Do not add a test framework or CI without a demonstrated need.

## Verified pass — 2026-09-04

Observed locally on Node 24.12.0 and Vite 5.4.21:

- `npm run build` — passed; 34 modules transformed.
- `node scripts/noon-smoke.mjs` — passed.
- `node scripts/living-smoke.mjs` — passed.
- `git diff --check` — passed after documentation formatting was corrected.
- Local browser at `http://127.0.0.1:5173/` — entered Day 1, switched Learn → Trade, wrote a 5🥫 public order, locked and settled Noon, saw the player receipt and three-entry public tape, gave an item in Afternoon, and opened the resulting optional Notebook `?` concept.
- Responsive browser check at 390 × 844 — controls remained usable and `documentElement.scrollWidth` did not exceed `window.innerWidth` (375 vs 390). No browser warnings or errors were captured.

This is local runtime evidence, not proof of public GitHub Pages or StackBlitz deployment.

## Authoritative module ownership

- `gameData.js` owns facts and configuration: items, starting state, NPC profiles, recipes and venue rules.
- `npcAI.js` owns bounded actor knowledge, valuation, planning and public listing generation.
- `gameEngine.js` owns authoritative state transitions, market settlement, production, world consequences and structured evidence.
- `livingGame.js` is a compatibility re-export only.
- `AppCore.jsx` renders the player flow and delegates rule changes to the engine.

## Verified runtime contracts

### Noon market

- Player and already-committed NPC orders enter one batch; resolution never reruns planning.
- Competition is grouped by seller and physical item copy.
- Seller-valued offers below ask are rejected; higher eligible value wins and exact ties rotate deterministically by day.
- Only opening cash and inventory can fund orders. Receipts cannot be reused during the same Noon.
- Invalid, self, inaccessible, unknown-holding, stale-stock, unfunded, below-ask, resource-used and outbid player orders fail with structured reason codes.
- Actual fills, including NPC-to-NPC fills and barter ownership, append to the public tape.
- Accepted inbound player commitments survive later Morning replanning and settle through the same batch path.

### Autonomous world consequences

- NPC-to-NPC acquisition can advance world threads without player attribution or player statistics.
- Route threads progress through signal, contest, outcome and aftermath state.
- Bar production requires and consumes one physical copy of Rum, Lime, Orange Curaçao and Orgeat, then creates one Mai Tai.
- Sailor production requires and consumes the four configured bicycle parts, preserves the durable torque wrench, and creates one Built Onewheel.
- Vale's completed screening consumes the acquired Sperm Whale Oil.
- In the deterministic no-action smoke, Vale completes the screening and Sailor completes the onewheel chain without waiting for the player.
- Missing the Whale Oil trade does not delete the later auction route once its independent screening, access, marble and capital conditions exist.

### Information and evidence

- Information objects preserve claim, source, precision, confidence, freshness, personal verification, known actors, diffusion count and resale state.
- Selling or sharing teaches only the named recipient. Private information does not become global knowledge.
- Relevant recipients may resell through an established bilateral relationship; cash, bounded buyer memory and a structured resale record update together.
- Information prices decay with diffusion and age; stale leads cannot be sold.
- The append-only `decisionEvidence` ledger records decisions and outcomes separately, including information available at commitment, opening resources, public/private channel, competition result, obligations, relationship conversion, world consequences and realised reference result.
- The ledger deliberately does not assign final diagnosis, badge or archetype scores in this batch.

### Time, copies and feedback

- Perishable same-name copies have separate ages; transferring a copy preserves its age and consuming or selling it removes that copy's age record.
- Sunset settles sustenance, overdue obligations, perishability, business consumption/revenue, screening, information resale and arrivals before the next day's plan.
- The public receipt/tape, Harbour notes and world-thread messages expose causal results without exposing hidden NPC reasoning.
- Concept explanations appear after relevant consequences as optional `?` entries in the persistent Notebook.
- Acquiring a sunflower consumes the configured route stakes, changes the objective to **Go home**, and does not end the run.

## Not verified by this pass

- Public deployment or cache freshness.
- Full human playthrough of every sunflower route.
- Final badge, case, diagnosis or archetype scoring; intentionally deferred.
- Final visual UI/art; intentionally deferred.
