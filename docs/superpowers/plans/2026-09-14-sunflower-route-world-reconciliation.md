# Sunflower Route + World Reconciliation Plan

**Spec:** `CURRENT_GAME.md`

Latest user direction: preserve unpublished work first, then implement and push meaningful checkpoint commits directly on `main`. Do not create development branches, force-push, or rewrite published history.

## Checkpoint 1 — Knowledge gates
Add explicit player knowledge state. Remove the early Juan cliff prompt and prove a fresh player cannot learn sunflower/cliff/Onewheel/race vocabulary before the Joel gate. Audit actions, dialogue, phone, newspaper, notes, guide text, tooltips and accessibility copy.

## Checkpoint 2 — Mai Tai discovery
Replace the direct Orgeat shopping-list quest with taste → notice a problem → infer/identify ingredient → source a real unit → supply Joel → completed drink. Retain Orgeat as the current concrete good for this pass, but keep the ingredient data-driven and hidden before identification.

## Checkpoint 3 — Juan social unlock
Require Joel and Juan to be genuinely co-present and Joel to serve/offer the completed drink. Only then unlock a special conversation where the player proactively explains their goal and Juan introduces the one-wheel race wager.

## Checkpoint 4 — Aspen/Onewheel preparation
Supersede Wong as final assembler. Reuse the existing lime honesty/short-crate system as Aspen's earned assembly condition. Do not show a complete parts checklist before the player knows what they are building. Assembly consumes only real unreserved/unpledged components. Honest shortfall creates a real obligation or tradeoff.

## Checkpoint 5 — Practice, upgrades, betting, race
Add costly practice and optional Aspen modifications/favors. Race chance must start below 50%, increase monotonically with preparation, and never reach certainty; keep exact numbers in tunable data. Build bar reactions/betting from actual co-present characters. Loss means covering drinks for that day's bar; win unlocks Juan taking the player to the sunflower field. Repeated races are not free rerolls.

## Checkpoint 6 — Novice/dialogue pass
Keep one short spoken line at a time, close exhausted conversations, stop autoplay when interaction ends, separate transaction controls from speech, and teach unfamiliar mechanics only when first encountered. Run a fresh-save novice pass using only visible information.

## Checkpoint 7 — Continuous-world renderer + living-world pass
Move from fitted contain-style illustration to bounded cover+pan camera. Add explicit background/static/ambient/dynamic/foreground/weather layers, feet-Y depth where appropriate, and real foreground occlusion. Do not fake background resolution with CSS upscaling. Expand weather/cargo/incidents/repeated encounters while keeping NPC movement driven by shared time and each NPC's logic, not player clicks.

## Verification at every checkpoint
Use fresh saves and real browser input. Run engine/regression checks plus desktop 1440×1000 and mobile 390×844 whenever UI/layout changes. Test negative discovery as well as happy paths. Preserve reservation-safe cash/inventory, real settlement, commitments/defaults, and existing non-Juan routes. Keep screenshots local. Update `CODEX_VERIFICATION.md` with tested facts only.
