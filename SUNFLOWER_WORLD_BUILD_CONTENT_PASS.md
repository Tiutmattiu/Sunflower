# SUNFLOWER — CONTINUOUS HARBOUR WORLD BUILD / CONTENT PRODUCTION PASS

> Date: 2026-09-09  
> GitHub reference baseline for documentation: `main` at `4ad195f83693165f2865fc464f60c2a397a8a479`  
> Current implementation note: the local Codex workspace contains a newer continuous-harbour implementation that is ahead of GitHub `main`. Continue from that local implementation lineage rather than restarting from `main`.

## 0. Purpose of this pass

Sunflower has reached the point where the core systems do not need another architecture phase.

The next useful work is to **turn the existing simulation into a living illustrated world** while continuing to fix real gameplay gaps discovered through play.

This is broader than a UI pass.

You have permission to:
- refactor presentation and dialogue code when that improves coherence;
- improve world timing and intra-day relational activity;
- extend scene/world-life content;
- fix real simulation or economic substrate gaps revealed by play;
- improve how goods, opportunities, obligations and NPC movement surface to the player;
- build the large continuous harbour presentation and the asset/tile pipeline needed to support it;
- create supporting data modules when they simplify authored content;
- revise stale presentation docs when the implementation has clearly moved beyond them;
- use browser play as the primary design feedback loop rather than treating current screens as sacred.

Prefer **play → observe → change → replay** over large speculative rewrites.

The continuous-map architecture is accepted. Preserve what is already working.

---

# 1. Current accepted player experience

The accepted direction is a **single continuous illustrated harbour world**.

The player does not switch between separate RPG rooms or location cards.

Instead:
- the harbour is one pan/zoom canvas;
- all major places coexist in the same geography;
- the player drags/pans and zooms to inspect areas;
- zooming into a place is still the same world, not a scene transition;
- NPCs exist in the world and can move between areas;
- clicking/tapping people or meaningful objects opens contextual interaction;
- not every visible object is interactive;
- the phone and newspaper remain side objects/drawers;
- money, commitments and finance can remain compact at the top and collapsible;
- carried objects stay in a thin horizontal inventory strip at the bottom;
- important story consequences can expand into comic panels;
- small everyday interactions can happen directly on the map.

The current continuous-map work already achieved a much stronger interaction model than the earlier dashboard/menu UI. Continue from it.

A useful mental model is:

> SoupSoup-like spatial exploration + a living harbour simulation + Rutu-Modan-like comic consequences.

Not:

> web dashboard + illustrated cards.

---

# 2. Continue the actual unfinished work first

Before spending a long pass on new art, finish and stabilize the current playable loop.

Continue browser-playing the local build and close the real interaction gaps you encounter.

High-value coverage includes:
- first meeting / contact discovery;
- repeated meetings with every major NPC in different locations;
- Juan appearing at the Bar without repeating nursery-specific dialogue;
- multi-NPC Bar scenes;
- ordinary buying/selling;
- public market orders and reservation logic;
- loan / claim / repayment;
- Auction;
- Supper;
- Toad circle;
- route preparation toward the cliff;
- the cliff sequence;
- Sunflower acquisition / final reflection;
- phone and newspaper;
- inventory handoff;
- market sanction / private alternative;
- mobile touch targets and camera behavior.

If an interaction fails after spending money/time or partly mutates state, prefer transactional rollback or another coherent recovery.

If a route becomes impossible because a stage changed from `unseen` to `met`, a person moved, a commitment field was wrong, or a UI action references a stale condition, fix the actual causal bug rather than adding a cosmetic workaround.

---

# 3. Let the harbour move within a day

NPCs feeling alive is now a major priority.

The current one-move-per-day feeling is too static for the accepted world.

Use the existing relationship / NPC / world systems as the substrate and allow **bounded intra-day progression** when meaningful time passes.

A successful intervention may advance harbour time enough for reasonable things to happen, such as:
- NPCs moving to another area;
- a conversation cluster forming or dissolving;
- someone arriving at or leaving the Bar;
- a known appointment becoming current;
- an order matching if enough time has actually elapsed;
- a delivery becoming available;
- spoilage progressing when the relevant time threshold is crossed;
- a payment or claim settling when its due time is crossed;
- a social event starting or ending;
- an NPC acting on knowledge they already possess.

Use judgment about granularity.

It is fine for several coherent events to occur during a meaningful interval. The goal is not "exactly one NPC event per click."

Prefer:
- looking, zooming, reading and failed actions → little or no world-time cost;
- meaningful intervention / travel / work / negotiation → real elapsed time;
- full day advance → remaining daily settlement and overnight changes.

Avoid creating a second decorative NPC simulation that disagrees with the real one.

The visible world should reflect the same simulation truth that drives economy, relationships and route state.

---

# 4. Contextual dialogue, not static reaction text

Replace generic or location-blind reaction fallbacks with authored contextual dialogue.

Dialogue selection can consider:
- current location;
- who else is physically present;
- whether the player has met this person before;
- recent shared events;
- recent failed or successful transactions;
- open promises / debt / claims;
- route stage;
- what the actor actually knows;
- what the player has already asked;
- weather;
- time of day;
- current object in hand;
- social interruption;
- awkward silence;
- whether someone is busy, tired, leaving, waiting or avoiding another person.

The same character should sound different in different contexts.

Example:
- Juan in the nursery can talk about roots, cuttings, maturity or a route;
- Juan at Joel's Bar should sound like Juan at a bar, not like a nursery tooltip with soil still attached to the same canned line.

Dialogue can include:
- short talk;
- jokes;
- interruption;
- refusal;
- gossip;
- unfinished thoughts;
- silence;
- overheard lines between NPCs;
- practical explanation when the player is about to make a real commitment.

Prefer concrete language:
- "Pay 5 now. Bring the crate back in two days."
over:
- "Initiate finance action."

Important mechanics can be explained before commitment, but the game does not need to turn every interaction into a tutorial.

Keep the visible transcript short. Avoid hundreds of accumulated messages on one screen.

---

# 5. Contacts are discovered socially

The Phone should not begin as a directory of people the player has never met.

A person can become a contact after a plausible introduction / number exchange / prior relationship event.

A known person being physically absent should remain absent; the phone coordinates, it does not teleport them.

Sonya is better treated as **household route presence**, not as a normal independent relationship target.

She can exist in the world, host Supper, affect scenes and be remembered without needing a full contact / Talk / economy card.

---

# 6. One large harbour map is the preferred world structure

The approved current harbour image works best as a **Harbour Core**, not the entire final geography.

Expand outward rather than turning each location into a separate background.

A strong target is approximately 2–3× the currently visible world area, if performance and composition support it.

Suggested spatial logic:

## Upper / inland edge
- household life;
- quieter residential traces;
- Juan's real nursery / propagation area;
- beginning of the uphill route.

## Central social core
- Joel's Bar;
- shared tables;
- circulation;
- occasional screening / social residue;
- people passing through rather than "entering a menu."

## Private / controlled edge
- Yasmin's private viewing / auction space;
- Dima's settlement area;
- controlled negative space and more private seating.

## Work / goods core
- Wong's parcel / salvage handling;
- public Octopus Clearing;
- packing, storage and exchange circulation.

## Water edge
- Aspen's berth;
- boats;
- cargo;
- weather;
- exceptional catches / arrivals.

## Outer edge
- less commercial terrain;
- service path;
- broken or difficult passage;
- cliff;
- open sea;
- route continuing beyond the immediately legible harbour.

The cliff route should feel physically connected to the harbour.

The player can notice that a path exists without seeing the Sunflower destination from the starting overview.

---

# 7. Large-map rendering: use technical freedom

The player should experience one large continuous illustration.

The implementation does not need to force that world into one giant browser bitmap.

Choose whatever runtime strategy gives the cleanest mobile result.

A reasonable production direction is:
- one high-resolution authored master composition;
- overview / medium / detail resolution tiers;
- tiles or region crops where useful;
- transparent character sprites;
- transparent stateful prop layers;
- vector/normalized hotspot geometry;
- normalized world coordinates for anchors.

Possible source scale:
- around `7680 × 4800`, or
- around `8192 × 5120`,
depending on the final composition.

Possible runtime tiers:
- overview around ~2048 px wide;
- medium around ~4096 px wide;
- detail / tiled source around ~8192 px wide.

These are practical starting points, not sacred dimensions.

The key outcome is:
- no obvious pixelation when the player zooms into important details;
- mobile does not load an unnecessarily huge texture all at once;
- NPC and hotspot positions remain stable across resolution tiers.

---

# 8. Background truth vs simulation truth

The map background should show **history, use and material culture**.

It should not freeze current simulation truth.

Prefer named characters as separate movable transparent assets.

Prefer stateful gameplay objects as separate semantic layers when their presence can change:
- hidden toad;
- current Auction lot;
- rare invitation fish;
- active claim / parcel;
- carried route part;
- Sunflower;
- current special shipment.

The background can contain ordinary examples of local life and goods, but not every important current object needs to be permanently painted into the base.

This keeps NPC movement, ownership and consequences visually honest.

---

# 9. Current art direction: what is actually approved now

Use the current creator-approved visual work, not historical generative drafts, as the practical reference.

The strongest accepted visual language is:
- flat matte colour;
- clear hand-drawn contour;
- printed-comic surface;
- restrained modelling;
- socially specific bodies and faces;
- ordinary posture rather than franchise character posing;
- strong color fields;
- selective detail;
- no 3D/cel-shaded volume;
- no glossy Korean-webtoon / beauty-comic rendering;
- no cinematic concept-art lighting.

The current approved harbour-core image is a useful environment-style target.

Creator-approved character masters already exist for the characters that have been accepted in the recent art pass. Prefer those master files over older prose prompts or abandoned generated drafts.

If a historical character prompt conflicts with an accepted master:
> treat the accepted master as the useful visual source for this production pass.

Do not spend the pass redesigning already accepted characters from scratch unless the creator reopens one.

Future pose work can derive from accepted masters rather than generating a new identity every time.

---

# 10. The harbour is lived-in, not paperwork-heavy

Earlier world-building leaned too hard on files, ledgers, receipts and operational clutter.

The final harbour should feel more like a place people **live, host, trade, smoke, eat, store things, rest, argue, repair, wait and wander through**.

The visual centre of gravity is now:

> lived Mediterranean / North-African harbour world  
> + domestic hospitality  
> + material culture  
> + real trade  
> + ecological life  
> + quiet absurdity.

Paperwork still has a place when it is actually meaningful:
- one claim;
- one provenance photo;
- one order slip;
- one tab;
- one contract;
- one receipt.

But avoid filling every surface with pseudo-interactive admin objects.

A useful rule of thumb for dense areas:

- ~50% spatial structure and readable circulation;
- ~25% lived material culture / goods / food / plants;
- ~15% social and domestic residue;
- ~10% strange, funny, tender or unexplained detail.

This is a composition guide, not a counting system.

---

# 11. Material culture vocabulary

Use a coherent North-African / Mediterranean material vocabulary without turning the harbour into a souvenir shop or theme restaurant.

Useful objects include:
- handmade Moroccan / North-African teapots;
- silver or decorated serving trays;
- small painted ceramic cups;
- hand-painted ceramic candleholders;
- leather poufs;
- red / rust / cream geometric cushions;
- woven rugs;
- low tables;
- practical serving bowls;
- dark wood;
- restrained brass / copper;
- cloth and hanging textiles;
- baskets;
- reused jars;
- water vessels;
- shisha / hookah as a social object.

These objects should look integrated into life:
- used;
- set down;
- stacked;
- leaned against something;
- mixed with other domestic/work objects;
- not displayed as catalogue merchandise.

---

# 12. Food, cultivation and circulating goods

The harbour should visually remember that food and plants move through it.

Recurring motifs may include:
- pomegranate;
- barley;
- wheat;
- olives;
- dates;
- grapes;
- figs;
- herbs;
- citrus;
- seeds;
- cuttings;
- dried goods;
- baskets;
- bowls;
- bundles;
- crates.

Coral can appear sparingly as a coastal curiosity / material object / decorative relic.

Some goods may be:
- fresh;
- drying;
- partly eaten;
- stored;
- bruised;
- being packed;
- being served;
- waiting to move.

This is more interesting than clean product-display staging.

---

# 13. Home and hospitality

The harbour should have a strong sense of **home**, even outside explicitly domestic areas.

People appear to:
- eat here;
- rest here;
- receive guests;
- share tea;
- sit for long conversations;
- borrow chairs;
- leave personal objects;
- store household things;
- make useful spaces beautiful.

Useful traces:
- cushions;
- floor seating;
- tea tray;
- bowls;
- serving dishes;
- old cloth;
- folded textile;
- mismatched chairs;
- shaded resting corner;
- water jug;
- fruit plate;
- repaired household object.

This is not a separate "home system." It is world texture and social logic.

---

# 14. Shisha and women's social life

Shisha can be part of the harbour's ordinary social world.

Use:
- hookah pipes;
- bowls;
- coals / ash where appropriate;
- low seating;
- cushions;
- tea;
- small clusters of people;
- women sitting together smoking and talking.

This should feel socially normal and lived-in, not like "exotic lounge décor."

Named NPCs remain movable simulation characters.

Background social figures can be incidental and non-specific when useful, or assembled as scene/event layers.

The bar can change socially across the day rather than having the same permanent crowd.

---

# 15. Animals, insects, fungi and ecological life

The harbour should not feel sanitized.

Possible recurring life:
- free-roaming chickens;
- stray cats;
- gulls and small birds;
- a discreet snake in a plausible edge habitat;
- insects around plants, lamps, fruit or water;
- mushrooms / fungi in damp shaded corners;
- the hidden toad.

These do not all need mechanics.

Many are second-look discoveries.

A chicken walking through a serious negotiation is often more valuable than another decorative ledger.

---

# 16. Quiet absurdity

The world can be slightly strange without becoming fantasy spectacle.

Useful small absurdities:
- a toad hidden somewhere it should not immediately be noticed;
- coral among domestic objects;
- a tiny improvised shrine;
- an object somebody treasures far more than its market value;
- an animal pausing in a suspiciously formal composition;
- a cup that remains in the same place for days;
- a chair that keeps moving;
- a plant that has grown around an old label;
- a beautifully wrapped object nobody wants;
- an inexplicably specific returned item at the Clearing.

The strange layer works best when nobody explains it immediately.

---

# 17. Interactive vs non-interactive world detail

The map should contain many visible things, but not every thing needs a hotspot.

Prefer three layers:

## A. Current meaningful interactions
People / objects that can genuinely do something now.

## B. State / route traces
Objects that communicate current conditions, history, ownership or recent consequences.

## C. World life
Interesting things that may never become mechanics.

Layer C is valuable.

It makes zooming enjoyable even when the player is not solving a route.

Avoid teaching the player that every illustrated cup, cushion, cat, fruit and paper is a quest object.

---

# 18. Hidden-toad architecture

The hidden toad should normally be a conditional overlay, not permanently baked into the world master.

Author many plausible concealment geometries:
- under propagation trays;
- behind wet pots;
- beneath the dock ladder;
- behind packing paper;
- under a table;
- near a drain / pipe;
- beside a tire;
- in a crate shadow;
- behind a shisha base;
- inside plant mass;
- near stairs.

A useful large map could support 6–10+ believable concealment zones.

The scene should camouflage the toad through ordinary visual density rather than glow, label or quest marker.

---

# 19. Zone direction

## 19.1 Aspen / berth

Identity:
- movement;
- cargo;
- deadlines;
- route access;
- weather.

Useful scene material:
- boat edge;
- rope;
- wet wood/metal;
- finite cargo groups;
- tarpaulin;
- provisions;
- packing residue;
- tide/weather trace;
- one inspection surface;
- signs of arrival/departure;
- small marine / food life around the berth.

Keep it like a working harbour edge, not a clean marina or travel postcard.

Short Crate / Limes can feel naturally born from this world.

---

## 19.2 Joel / Bar

This should be the highest-density social zone.

Useful material:
- real glassware variety;
- ice;
- citrus;
- herbs;
- orgeat / syrup;
- jigger;
- strainer;
- bar spoon;
- press;
- unfinished drink;
- tab book;
- one or two meaningful receipts;
- record sleeve;
- speaker / small audio equipment;
- books;
- repaired stool;
- borrowed chair;
- tea objects;
- shisha;
- low seating;
- cushions;
- olives / figs / grapes or other small food;
- cat or incidental animal life;
- evidence somebody just left.

The Bar can contain ordinary women smoking shisha and talking, especially as dynamic social layers.

Let the room change as people arrive, leave, gather and rearrange furniture.

Avoid making it read as either:
- generic café counter;
- themed "Arabic" venue;
- nightlife luxury branding.

It should feel personally accumulated, cosmopolitan, intimate and worked-in.

---

## 19.3 Yasmin / private viewing + Auction

This is less a retail gallery and more a place where people **judge value**.

Useful material:
- one isolated current lot;
- cloth / low pedestal;
- provenance photo;
- catalogue;
- inspection light;
- invitation / envelope;
- 2–4 deliberately positioned chairs;
- one reserved empty chair;
- deep textile;
- ceramic / vessel;
- coral;
- fruit / pomegranate plate;
- strong but controlled ornament;
- meaningful negative space.

The room can be beautiful without becoming a white-cube gallery or palace.

Keep the social pressure spatial.

---

## 19.4 Wong / parcel + salvage

Useful material:
- string;
- packing paper;
- reused cartons;
- plastic crates;
- bottle crates;
- tags;
- locks;
- chargers;
- small trolley;
- odd bicycle / mobility part;
- cloth;
- baskets;
- grain sack;
- dates / dry goods;
- staged parcel;
- salvage with obvious practical reason.

Prefer "dense but usable" over random junk.

The floor and low shelves matter because handoff / packing / retrieval should read physically.

---

## 19.5 Juan / nursery

This deserves more dedicated world area than the current harbour core gives it.

Useful material:
- real propagation tables;
- shade cloth;
- seed packets;
- labelled cuttings;
- roots;
- jars;
- twine;
- pruning shears;
- old black nursery pots;
- terracotta;
- trays;
- soil / potting medium;
- water bucket;
- failed tray;
- healthy tray;
- one rare specimen;
- figs / vine / olive / herbs where plausible;
- insects;
- fungi;
- chicken;
- possible snake at an edge habitat;
- multiple natural toad concealment zones.

The nursery should look productive and intelligent, not like decorative Mediterranean landscaping or a cute flower shop.

It should connect naturally to the uphill / cliff route.

---

## 19.6 Dima / private settlement space

Use the currently accepted character presentation from the creator's art set rather than resurrecting stale drafts.

Spatial feeling:
- close to public life but suddenly private;
- quieter;
- fewer objects;
- procedural;
- awkward seating distances.

Useful material:
- one old desk;
- keys;
- envelope;
- number tags;
- cheap calculator;
- bag;
- transport note;
- one claim folder;
- 2–3 chairs;
- curtain / screen / alcove.

Avoid overfilling it with "crime office" clichés.

Private access and settlement should be the subject.

---

## 19.7 Octopus Clearing

Treat Octopus primarily as an institution / public settlement mechanism in the world.

Its zone benefits from:
- repeatable slots;
- standard trays;
- owner tags;
- receipts;
- stamped slips;
- returned pile;
- reserved pile;
- cleared pile;
- queue geometry;
- physical separation between client goods and general harbour stock.

It should look institutionally different from Wong's dense, personal handling area.

A little absurdity is welcome.

Avoid relying on a cute mascot presentation to explain the institution.

---

## 19.8 Sonya household edge

This is world-life first, route scene second.

Useful material:
- small kitchen / household edge;
- borrowed chairs;
- old tablecloth;
- mismatched dishes;
- fish-preparation tools;
- tea / serving items;
- ordinary storage;
- cushions;
- household clutter with emotional specificity.

It does not need to announce itself as "Sonya's Kitchen."

Before the Supper route activates, it can simply be part of the residential world.

When the invitation matters, the same area can become an authored comic/event tableau.

---

## 19.9 Cliff / sea

This should be much sparser than the harbour core.

Useful material:
- rock;
- sea;
- wind;
- broken route edge;
- narrow path;
- old post / rail;
- one human-made repair;
- one abandoned or forgotten object;
- large quiet colour fields;
- dramatic scale through composition rather than lighting.

The route should not look like a tourist attraction.

Do not reveal the Sunflower destination too early.

The final reveal can use a conditional layer / comic panel / newly visible world state when the player truly reaches it.

---

# 20. NPC placement and movement

A busy map needs empty space.

Leave approximately one quarter to one third of many active zones available as:
- walking path;
- standing space;
- crouching space;
- two-person conversation space;
- small group cluster space.

Create multiple anchors rather than one "NPC spot" per area.

Useful anchor families:
- passing;
- working;
- waiting;
- seated;
- counter customer;
- behind counter;
- doorway;
- window;
- floor/low interaction;
- private conversation;
- group cluster;
- exit / arrival;
- route transition.

NPC movement should look like movement through a shared world, not teleporting between labelled cards.

---

# 21. Comic consequence grammar

Important events should still be allowed to become short comics.

Prefer:
- 2–6 panels;
- 3–4 visible panels in a screenful when practical;
- player response options below the final current panel;
- the same character/location/object assets reused in different crops;
- ordinary body language;
- object inserts;
- silence;
- short direct dialogue.

Small interactions can stay on the map.

Large moments that benefit from comics:
- Short Crate;
- Auction;
- Supper;
- Toad circle;
- public sanction / clearing;
- major relationship beat;
- cliff / Sunflower reveal;
- a severe financial consequence.

Avoid returning to visual-novel portrait ping-pong or giant dialogue boxes that cover the world.

---

# 22. Gameplay health beyond UI

While world-building, continue watching for systemic problems rather than treating presentation as separate from design.

You have permission to improve missing economic substrate when real play demonstrates it.

Useful questions:

## Opportunities
A player should usually have several meaningful things they could pursue on a harbour day.

It is fine if:
- Finance is not available every day;
- Investing waits on maturity;
- speculation is episodic;
- one strategy has dry spells.

But 20+ days of "nothing to do" for a whole economic class is a sign worth investigating.

The game does not need six equally profitable careers.

It does benefit from enough cross-system opportunities that a normal player naturally mixes:
- trade;
- operating work;
- investment;
- finance;
- intermediation;
- speculation;
- social / route decisions.

## Goods
Audit goods as you encounter them.

Every persistent SKU should ideally have at least one legitimate:
- source;
- sink;
- use;
- contract role;
- route role;
- social gift/use;
- transformation;
- resale possibility.

If a good exists only because an old prototype list still contains it, consider pruning it or giving it a real life.

## Badges / Scars / events
Across many possible runs, each intended badge/event/scar should remain reachable through legitimate causal play.

They do not need to light up in one run.

Rare paths can stay rare.

The important distinction is:
- rare because the world conditions are uncommon;
vs
- unreachable because no player-facing path exists.

## Endings / diagnosis
Different styles of trade, trust, leverage, verification, commitment, liquidity, speculation and social allocation should be capable of shaping the final profile.

Do not force equal outcomes.

Do keep the game open enough that more than one behavioral quadrant can genuinely emerge.

## Named NPC economy
Named cast should remain the primary source of strategically interesting choices.

Background actors are useful for:
- market depth;
- recurrence;
- settlement support;
- believable demand.

They should not silently become the only way the game economy works.

---

# 23. Player-facing information

The player should see the world, not the engine.

Prefer:
- names after discovery;
- concrete price;
- concrete deadline;
- visible ownership;
- source and freshness of information;
- physical promise / object / claim;
- short human explanation.

Avoid exposing:
- internal action IDs;
- Scar causal-type names;
- simulation enum labels;
- implementation locations like `Yasmin's viewing room`;
- every hidden relationship stage;
- test evidence IDs;
- debug counters;
- huge raw tape archives unless intentionally opened.

Location identity should usually be visible through art.

If a label is useful after zoom, prefer neutral/world-facing names rather than NPC-owned menu-card names.

---

# 24. Interaction friction

Most player intentions should take one meaningful choice after context is clear.

Prefer direct interaction:
- tap person;
- tap object;
- choose one sentence / price / action;
- see consequence.

Reserve explicit confirmation for:
- large or irreversible commitment;
- borrowing / collateral;
- destructive sale;
- restart / overwrite;
- major route commitment where the cost would otherwise be surprising.

Avoid stacking:
- Open → Continue → Confirm → OK → Close.

Do not make "Next day" a prose performance.

If the day ends manually, a short unobtrusive affordance is enough.

If the current world timing supports a more natural automatic/soft transition, explore it through play.

---

# 25. Mobile quality bar

The continuous harbour should be genuinely playable around `390 × 844` CSS pixels.

Test:
- drag;
- pinch / zoom;
- tap targets;
- selecting a person beside a small object;
- drawers;
- inventory strip;
- comic panels;
- close / Escape/back interactions;
- no horizontal page overflow;
- no giant modal trap;
- no tiny unreachable hotspot;
- no camera getting stranded over empty sea;
- stable asset sharpness while zooming.

The map itself can be larger than the phone.

The player should feel like they are holding a window onto the harbour, not looking at a shrunk desktop page.

---

# 26. Browser-driven production loop

Use the browser repeatedly.

Suggested loop:
1. start a fresh save;
2. play Day 1–2;
3. zoom / move / meet someone;
4. complete at least one real transaction;
5. advance time;
6. follow NPC movement;
7. deliberately revisit the same NPC elsewhere;
8. try one route;
9. inspect phone/newspaper/inventory;
10. observe what feels confusing, dead, repetitive or visually false;
11. fix it;
12. replay.

Then extend to:
- Auction;
- Supper;
- Toad circle;
- cliff route;
- sanction/private settlement;
- late commitments;
- end reflection.

When a weird interaction appears, treat it as useful design evidence.

---

# 27. What is currently less useful

Unless playtesting gives a strong reason, deprioritize:
- separate location screens;
- card-grid navigation;
- NPC directory UI;
- long stacked transaction logs;
- large admin dashboards;
- excessive paperwork as environmental filler;
- every prop being clickable;
- permanent crowds baked into backgrounds;
- one static canned line per character;
- NPCs moving only once at day rollover;
- glossy 3D / cel-shaded / webtoon rendering;
- huge low-resolution background images enlarged beyond useful scale;
- theme-restaurant Orientalist shorthand;
- another architecture phase before the current world is actually played.

These are not forbidden technologies. They are simply weaker fits for the current game than the accepted direction.

---

# 28. Autonomy

Use your judgment.

You can:
- restructure modules;
- add content data files;
- improve current dialogue selection;
- adjust harbour beat timing;
- fix simulation bugs surfaced by presentation;
- rebalance a missing source/sink/opportunity if real play proves one is absent;
- change camera / tile / asset-loader architecture if the experience improves;
- create new world-life details;
- simplify UI;
- add small audio cues;
- improve comic sequencing;
- prune obsolete prototype clutter;
- update stale docs;
- add regression tests for the bugs you actually find.

Prefer preserving the strongest current implementation rather than redoing finished work.

When the current local branch contains newer accepted work than GitHub `main`, continue from the local branch.

---

# 29. Suggested completion target for the next Codex run

A strong next run would leave us with:

1. the current continuous-map build fully playable through its existing routes;
2. contextual dialogue working across repeated locations;
3. intra-day NPC movement / world beats that make the harbour feel alive;
4. no obvious stale contact / location / engine-language leakage;
5. real mobile playability;
6. a larger or technically prepared continuous harbour world topology;
7. accepted character art integrated where available;
8. the harbour-core environment preserved as visual direction;
9. nursery / cliff / household / institution expansion specified or implemented coherently;
10. world-life detail richer and less paperwork-heavy;
11. real economic dead ends fixed where play exposed them;
12. tests and browser proof updated without committing generated screenshots;
13. a clean commit on the current working branch and, when practical, a PR against `main`.

The aim is not to "finish all art."

The aim is to make Sunflower feel like **one living comic harbour whose economy, people, objects and stories actually inhabit the same place.**
