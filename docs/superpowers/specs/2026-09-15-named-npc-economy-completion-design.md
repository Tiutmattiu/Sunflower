# Named NPC Economy Completion — Design

## Status

Approved by the creator in chat on 2026-09-15. This design implements active economic material already present in `GAME_DESIGN.md`, `NPC_CHARACTER_BIBLE.md`, `ITEM_ECONOMY.md`, `DESIGN_WORKBOOK.md`, and the current runtime, plus a small set of explicitly new creator ideas recorded below.

`CURRENT_GAME.md` remains the highest implementation authority where documents conflict. Sonya remains a supporting/background household figure and is not promoted into the primary economy graph.

## Goal

Make the harbour's six primary economic characters materially interdependent through real cash, claims, productive assets, inventory, obligations and time instead of isolated quest actions. Preserve the existing conservation/reservation/claim systems and extend them rather than creating NPC-specific currencies or minigames.

## Design principles

1. Use the existing six primitives: goods, cash, information, obligations, relationships and time.
2. Named NPC↔named NPC loops come before anonymous fallback sectors.
3. No action may create unexplained cash, duplicate a physical unit, double-pledge collateral or silently forgive a liability.
4. Productive investment changes future earning capacity; it is not a flat stat bonus.
5. Financing must state who receives cash now, who bears default risk, what is pledged/assigned, and who receives future cashflow.
6. A route/source unlock is causal: Aspen reaches a source and returns; the market does not unlock items merely because a day number passed.
7. The player may observe and participate in these systems, but the world must also continue them without player intervention.

## 1. Wong — high-turnover household enterprise

Wong keeps his existing parcel/storage/salvage identity. Add a durable `wongBusiness` operating state rather than a separate shop minigame.

### Business state

The business tracks:

- `stage`: `counter | storage | laundry | frontage`;
- `workingCapital` via Wong's actual actor cash, never a duplicated balance;
- `fixedAssets`: durable productive assets with cost, residual value and capacity effects;
- `rentDueDay`, `rentAmount`, `landlordId`;
- service capacity / throughput;
- daily service revenue and operating expense;
- retained surplus history.

Initial counter activity remains modest. Expansion must require real cash and a real asset purchase. A productive asset may increase service capacity, lower spoilage/carrying cost, or add a service stream. It must have residual value if liquidated.

### Expansion ladder

For this pass:

- `counter`: parcel/salvage/basic resale;
- `storage`: adds storage/parcel throughput and a small spoilage/carry benefit;
- `laundry`: requires equipment investment and adds recurring service demand;
- `frontage`: increases capacity and enables the Bitcoin/payment service rail as a later service, not free money.

No stage is guaranteed profitable. Rent and operating expense rise with expansion.

## 2. Dima ↔ Wong property/finance relationship

### Existing canon carried forward

Dima remains a private broker, claim buyer, guarantor and distressed-workout specialist. He does not own every illicit good.

### New creator direction

The visible apartment-building context also makes Dima Wong's landlord for the shop/frontage in this implementation pass. This is new canon added 2026-09-15, not a claim about older documents.

Dima may finance Wong's productive equipment through a real claim/revenue-share rather than a gift. Wong therefore can be simultaneously Dima's tenant, borrower/investee and service provider.

The later Bitcoin/payment rail creates the reciprocal side: Dima can become a fee-paying customer when private settlement needs conversion/payment service. The first implementation only needs the accounting/service skeleton; richer crypto/Web3 gameplay is a later task.

## 3. Juan — biological productive capital and maturity mismatch

Keep the existing living-asset system and species maturity days. Add species-specific economics instead of replacing the system.

Each supported crop family must define at least:

- maturity days;
- recurring input cost / input interval;
- base yield;
- weather sensitivity;
- failure/quality risk;
- early-sale recovery fraction;
- mature expected value.

The current named plants therefore behave differently under the same weather and liquidity conditions.

### Liquidity choices

A Juan productive asset/harvest may be financed or monetised through distinct structures:

- wait for maturity: maximum upside, no current liquidity;
- distressed early sale: current cash, ownership transfers, maturity upside sacrificed;
- future-output assignment / risk share: current cash in exchange for a percentage or bounded share of later harvest;
- Yasmin secured loan: fixed repayment, collateral lock, Juan keeps residual upside;
- Dima workout/claim purchase: discounted or risk-sharing structure with a meaningful fee/haircut.

No option may strictly dominate in all states.

## 4. Yasmin — general secured lending and private capital

Generalise the existing auction-specific collateral loan into reusable secured lending primitives.

A secured loan contains:

- principal paid now;
- face/maturity owed later;
- eligible collateral unit or living asset;
- haircut / advance rate from recovery value;
- holder and issuer;
- status;
- default recovery rule.

Collateral remains owned by the borrower while pledged and cannot be sold, reserved elsewhere or pledged twice. Repayment releases it. Default transfers or liquidates it according to the claim terms.

This is distinct from an outright sale: sale transfers ownership immediately and has no repayment obligation.

Yasmin may also continue private investment, consignment, appraisal/provenance and luxury-object sales. Existing Aspen→Yasmin luxury purchase remains a valid background loop.

## 5. Dima — private finance and workout

Extend Dima through the same claim ontology:

- buy an unwanted claim at a haircut;
- extend maturity for a fee;
- guarantee settlement for a fee and real guarantee exposure;
- acquire a share of future output rather than fixed debt;
- place a distressed object/claim privately when public access is unavailable or too slow.

Dima's value comes from access/trust/enforcement, not magical liquidity. He may refuse if his cash/network/risk capacity is insufficient.

## 6. Aspen — route reach changes market availability

Keep current `short / medium / outer` route economics and expand their result into a persistent source state.

For each route-sourced good, track a source lifecycle:

`UNKNOWN -> SOURCE_LOCATED -> LOCALLY_AVAILABLE -> ESTABLISHED`

- A route can move a good from unknown to located and bring finite cargo.
- Returned finite cargo becomes real owned inventory and may enter the market.
- Repeated successful sourcing can establish a source, permitting bounded replenishment with explicit cost/lead time.
- Weather and route duration affect arrival/risk; no day-number-only unlocks.

The initial implementation may establish only a small representative subset of goods, but the state model must be generic.

## 7. Cross-NPC flows

The following interactions should become real ledger flows when their prerequisites occur:

- Wong rent -> Dima;
- Dima equipment finance -> Wong productive asset -> repayment/revenue share back to Dima;
- Dima private settlement demand -> Wong payment-service fee once that service exists;
- Yasmin financing -> Juan productive asset / claim -> later repayment or collateral/default consequence;
- Dima future-output structure -> Juan current cash -> Dima later harvest share;
- Aspen route imports -> finite market stock;
- Aspen luxury purchase -> Yasmin, with Wong/Dima optionally providing custody/delivery where already modelled.

These transactions must enter existing `privateTransactions`, `claims`, `returnLedger`, `evidence` or equivalent canonical ledgers rather than living only in dialogue.

## 8. Explicitly deferred new ideas

NFT/Web3 gameplay is approved as a future extension but is not the first implementation dependency. It should later sit on top of the completed provenance/collateral/payment-rail systems and distinguish token ownership, underlying rights, executable liquidity, custody and conversion costs.

Dima's moving ice-cream truck / mobile rent collection is also an approved new direction for later scene/world-state work. This pass may create the landlord/rent state needed for it but does not need to author the vehicle asset or browser choreography.

## 9. Acceptance

The implementation is accepted only if regression checks prove:

- cash is conserved except for already-authorised external flows;
- physical productive assets/collateral are not duplicated;
- collateral cannot be double pledged;
- Wong expansion costs real money, creates a persistent productive asset and changes future capacity/revenue while retaining operating/rent costs;
- Wong pays Dima rent from actual cash and can breach/owe rather than going negative silently;
- Juan crop families differ in maturity/risk/yield/input economics;
- at least two distinct Juan liquidity structures produce materially different payoff/default profiles;
- Yasmin secured loan vs outright sale have different ownership and obligation consequences;
- Dima workout uses a real claim and real cash transfer;
- Aspen route completion changes source availability and finite inventory causally;
- existing Juan/Sonya/Yasmin sunflower routes and public market invariants still pass.
