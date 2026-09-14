# Sunflower — Current Game Conformance Matrix

> Status: current working audit companion to `CURRENT_GAME.md`.
>
> `CURRENT_GAME.md` remains the design authority. This file does **not** override it. Its purpose is to distinguish implemented state logic from presentation wiring, real-browser proof, visual acceptance, and work that is still genuinely missing.
>
> Evidence labels used below:
>
> - **ENGINE VERIFIED** — covered by current automated state/regression checks and GitHub Actions.
> - **PRESENTATION WIRED** — the visible React/presentation layer reads the canonical state, but real-browser acceptance may still be pending.
> - **BROWSER REQUIRED** — code inspection/CI is insufficient; prove through visible UI on a fresh save.
> - **VISUAL REQUIRED** — requires native-scale screenshot/art judgment, not merely DOM/state checks.
> - **PARTIAL / NEXT** — meaningful implementation exists, but the current canon asks for more.

## 1. Player-information rule

| Requirement | Current evidence | Status / next proof |
| --- | --- | --- |
| First Juan meeting does not expose sunflower/cliff/Onewheel/race | `current-route-presentation-check`, `dialogue-route-gating-check` | **ENGINE VERIFIED**; **BROWSER REQUIRED** on fresh save at both target viewports |
| Orgeat answer is hidden before player inference | `current-game-causal-route-check`, presentation gating, `scene-knowledge-gating-check` | **ENGINE VERIFIED**; **BROWSER REQUIRED** for action labels, dialogue, world props and accessibility text |
| Nursery/world layer does not leak Onewheel parts before plan | `scene-knowledge-gating-check` | **ENGINE VERIFIED**; **BROWSER REQUIRED** for actual rendered labels/targets |
| Unknown identities remain unknown until contact | `dialogueContent.UNKNOWN_PEOPLE`, contact-gated `personName` | **PRESENTATION WIRED**; **BROWSER REQUIRED** |
| Phone/newspaper/comics/accessibility obey learned knowledge | route/dialogue checks cover major current route vocabulary | **PARTIAL / NEXT**: Codex browser negative-path audit must explicitly inspect these surfaces |

## 2. Joel → Mai Tai → Juan social gate

| Requirement | Current evidence | Status / next proof |
| --- | --- | --- |
| Player tastes Mai Tai before diagnosis | `mai_tai_taste` gate | **ENGINE VERIFIED** |
| Joel does not hand out shopping-list quest | current route copy/state checks | **ENGINE VERIFIED**; **BROWSER REQUIRED** for novice feel |
| Player infers Orgeat contextually | `mai_tai_check_shelf` → `mai_tai_ingredient` | **ENGINE VERIFIED** |
| Physical Orgeat must be sourced/transferred | inventory/conservation route checks | **ENGINE VERIFIED**; **BROWSER REQUIRED** for visible inventory handoff |
| Joel and Juan must be physically co-present for corrected drink | `joel_serve_juan` gate | **ENGINE VERIFIED**; **BROWSER REQUIRED** to prove waiting/discovery through normal world time |
| Player proactively explains goal | `juan_explain_goal` knowledge gate | **ENGINE VERIFIED**; **BROWSER REQUIRED** |

## 3. Onewheel / Aspen / lime preparation

| Requirement | Current evidence | Status / next proof |
| --- | --- | --- |
| Full parts list not available before build problem is learned | knowledge gating + scene checks | **ENGINE VERIFIED**; **BROWSER REQUIRED** |
| Parts are real units subject to reservation/pledge rules | `current-route-invariants-check` | **ENGINE VERIFIED** |
| Aspen, not Wong, is current Juan-route assembler | route checks + `assemble_onewheel` counterparty | **ENGINE VERIFIED**; **BROWSER REQUIRED** |
| Honest lime shortfall is an earned relationship condition | short-crate route + assembly gate | **ENGINE VERIFIED**; **BROWSER REQUIRED** for understandable consequence/copy |
| Practice raises odds without guaranteeing win | `juanRaceChance` + route checks | **ENGINE VERIFIED** |
| Aspen modification is relational/material, not a vending purchase | `aspen-onewheel-modification-check` | **ENGINE VERIFIED** |
| Toad-circle favor only exists if Aspen actually attended | `production.toadChat.members` gating | **ENGINE VERIFIED** |
| Aspen uses a real durable tool | physical `Tiny Torque Wrench`, favor regression | **ENGINE VERIFIED** |
| Favor/tool cannot be farmed into repeated free upgrades | `toadFavorUsed`, regression | **ENGINE VERIFIED** |
| Modifications are optional beside practice | both paths independently affect chance | **ENGINE VERIFIED**; **BROWSER REQUIRED** for discoverability |
| More contextual Aspen favor types exist | only the toad-circle favor is currently playable | **PARTIAL / NEXT**: Wong diversion/sparring or another grounded favor can be added after browser acceptance if route still feels too narrow |
| Black-market/other world opportunities can supply modification components/tools | current route has real cargo parts and Aspen's wrench, but no broader modification-component opportunity ecology | **PARTIAL / NEXT** |

## 4. Juan race, betting and field trip

| Requirement | Current evidence | Status / next proof |
| --- | --- | --- |
| First race is difficult | current base chance = 0.32 | **ENGINE VERIFIED**, but final balance is not visually/play-feel accepted |
| Practice/modifications increase chance with cap | current formula and regressions | **ENGINE VERIFIED** |
| No free same-day reroll | route state gate | **ENGINE VERIFIED**; **BROWSER REQUIRED** |
| Loss covers drinks for people actually at Bar | race route + debt/commitment logic | **ENGINE VERIFIED**; **BROWSER REQUIRED** for visible terms/debt UX |
| Betting participants come only from actual co-presence | `juan-race-betting-check` | **ENGINE VERIFIED** |
| Betting expectations respond to chance and current relationship | `RACE_BET_PROFILES` + relationship lean | **ENGINE VERIFIED** |
| Side bets conserve real cash and respect cash reservations | betting regression | **ENGINE VERIFIED** |
| Presentation reads settled betting ledger rather than inventing bettors | `racePresentation.js`, presentation regression | **PRESENTATION WIRED**; **BROWSER REQUIRED** |
| Legacy saves without `raceBets` do not crash | `legacy-race-betting-save-check` | **ENGINE VERIFIED** |
| Win does not directly mint flower | field-trip regression | **ENGINE VERIFIED** |
| Juan physically leads player after win, then flower is granted | `juan_field_trip` | **ENGINE VERIFIED / PRESENTATION WIRED**; **BROWSER REQUIRED** |
| Race tuning values live in tunable game data rather than hardcoded formula | current `juanRaceChance` still hardcodes base/practice/upgrade/cap values | **PARTIAL / NEXT**: extract after browser play-feel evidence, unless a browser blocker requires it sooner |

## 5. Dialogue and novice experience

| Requirement | Current evidence | Status / next proof |
| --- | --- | --- |
| One short spoken line at a time | `SpokenLine`, lifecycle checks | **ENGINE/STATIC VERIFIED**; **BROWSER REQUIRED** |
| No autoplay | no timer in `SpokenLine`, explicit-click checks | **ENGINE/STATIC VERIFIED**; **BROWSER REQUIRED** by waiting >3s |
| Completed no-choice conversation closes | `onDone()` path | **PRESENTATION WIRED**; **BROWSER REQUIRED** |
| Leaving an interaction stops progression | component structure suggests yes | **BROWSER REQUIRED** |
| Speech/response anchoring is predictable | CSS/DOM alone insufficient | **BROWSER REQUIRED** desktop/mobile |
| Distinct ordinary voices | route-critical dialogue now character-specific and mostly mundane | **PARTIAL / VISUAL-LANGUAGE REVIEW**: some ambient Juan lines remain aphoristic; not a current route blocker |
| Transaction copy explains concrete terms | `presentationCopy` terms for commitments | **PRESENTATION WIRED**; **BROWSER REQUIRED** at first encounter |
| No tutorial wall | current broad guide is incremental | **PRESENTATION WIRED**; **BROWSER REQUIRED** novice pass |
| Exhausted time offers tomorrow vs keep looking | `AppCore` `restOffer` | **PRESENTATION WIRED**; **BROWSER REQUIRED** |

## 6. Living-world timing

| Requirement | Current evidence | Status / next proof |
| --- | --- | --- |
| NPCs do not move once per player click | `npc-cadence-check` | **ENGINE VERIFIED** |
| Shared world clock + independent NPC intraday windows | relational cadence implementation | **ENGINE VERIFIED** |
| Weather/cargo/incidents/availability vary | existing district/world state and route schedules | **ENGINE VERIFIED** at systems level; **BROWSER/VISUAL REQUIRED** for felt variety |
| Repeated encounters are not limited to one scripted anchor | relational candidate graph is broad and location-aware | **PARTIAL**: meaningful variety exists, but more situational authored encounters remain desirable |
| Conservation/commitments survive added social life | current regression suites | **ENGINE VERIFIED** |

## 7. Continuous-world renderer

| Requirement | Current evidence | Status / next proof |
| --- | --- | --- |
| Main map uses cover + bounded pan rather than contain gutters | current camera implementation/checks | **STATIC/ENGINE VERIFIED**; **BROWSER REQUIRED** for actual no-gutter proof |
| Desktop can pan when authored world exceeds viewport | camera code supports it | **BROWSER REQUIRED** |
| UI overlays rather than permanently shrinking world | current layout | **BROWSER/VISUAL REQUIRED** |
| Base/static/ambient/dynamic/occluder/weather layers exist | district/tableau/HarbourMap pipeline | **ENGINE/STATIC VERIFIED** |
| Feet-Y/depth sorting includes named actors, crowd, props and occluders | `HarbourMap` unified `depth` array sorted by `y` | **STATIC VERIFIED**; **VISUAL REQUIRED** for compositions |
| Named cast sprite interiors do not themselves steal pointer events | `Figure` has `pointerEvents="none"` | **STATIC VERIFIED**; **BROWSER REQUIRED** for enclosing actor hit-target geometry |
| Old raster is not used for main map or comics | `comic-current-world-check` + vector district comic | **ENGINE/STATIC VERIFIED** |
| Yasmin figure does not block bowl | historical bug; source inspection alone cannot prove rendered hit target | **BROWSER REQUIRED** |
| Mobile transparent atlas regions do not steal taps | historical bug; source inspection alone insufficient | **BROWSER REQUIRED** |
| Camera never exposes outside-world gutters | camera math/checks exist | **BROWSER/VISUAL REQUIRED** at exact viewports |

## 8. Ambient world and crowd art

| Requirement | Current evidence | Status / next proof |
| --- | --- | --- |
| Ambient social/labour/faith/park/shisha/cinema life exists | `harbourTableau` roles/zones | **ENGINE/STATIC VERIFIED** |
| Ambient crowd remains noninteractive | `CrowdFigure pointerEvents="none"` | **ENGINE/STATIC VERIFIED**; browser hitbox pass should ensure no wrapper regression |
| Crowd has explicit complexion/hair/headwear/build/age dimensions | `crowd-identity-diversity-check` | **ENGINE VERIFIED** |
| Renderer visibly consumes those dimensions | `HarbourTableauLayer` | **STATIC VERIFIED** |
| Ambient figures are distinct from named cast identities | data ids separate; no cast atlas reuse | **STATIC VERIFIED** |
| Specific authored cultural diversity direction is convincing at native scale | structural support now exists, but authored visual-quality judgment is not complete | **VISUAL REQUIRED**: Codex asset salvage/native screenshots |
| Previous shisha/social generated assets are salvaged before replacement | unknown local Codex state | **CODEX PREFLIGHT REQUIRED** |
| No baked checkerboard/matte remains | cannot be guaranteed by source metadata | **CODEX ASSET INSPECTION REQUIRED** |

## 9. Approved cast and ontology

| Requirement | Current evidence | Status / next proof |
| --- | --- | --- |
| Named cast identities remain canonical | current cast asset/canon checks | **STATIC VERIFIED**; visual identity acceptance remains creator-facing |
| Dima remains human | current cast/runtime | **VERIFIED** |
| Wong remains whippet | current runtime/copy | **VERIFIED** |
| Octopus is one institution | ontology checks + district renderer | **ENGINE/STATIC VERIFIED** |
| Yasmin/Dima/Wong places remain single canonical institutions | ontology checks | **ENGINE VERIFIED** |
| Pizza and deli remain distinct | district/ontology | **ENGINE/STATIC VERIFIED** |
| Street festival remains distinct from Joel's ordinary live music | district/world state | **ENGINE/STATIC VERIFIED** |
| Old Hall remains cinema | ontology/district | **ENGINE/STATIC VERIFIED** |
| Small-life species/systems remain distinct | world/crowd/creature checks | **ENGINE VERIFIED** |

## 10. Immediate next ownership split

### Codex should own the next write window

Execute `docs/superpowers/plans/2026-09-15-codex-browser-art-acceptance.md` task-by-task. Its comparative advantages are:

- real Playwright/browser interaction,
- desktop/mobile pointer geometry and hitbox debugging,
- fresh-save route traversal through visible UI,
- local screenshots and native-scale visual comparison,
- asset salvage, alpha/checkerboard inspection and integration,
- iterating on generated/authored ambient assets with actual browser composition feedback.

During that write window, ChatGPT should be read-only reviewer under the single-writer rule.

### ChatGPT's next engine/design pass after Codex handoff

Use Codex's browser evidence before changing balance. Highest-value likely follow-ups are:

1. extract Juan race base/practice/upgrade/cap values into explicit tunable data after observing actual play feel;
2. decide whether the route needs another grounded Aspen favor (for example a Wong diversion) rather than adding generic favor currency;
3. add a broader modification-component / grey-market opportunity only if the browser route still feels too linear;
4. expand repeated/situational encounters where Codex's screenshots/route logs show dead stretches;
5. do a surgical ambient-dialogue voice pass only where ordinary-character readability is still weak.

Do not start these by assumption while Codex is testing the current route; browser evidence should choose which of them is actually needed first.
