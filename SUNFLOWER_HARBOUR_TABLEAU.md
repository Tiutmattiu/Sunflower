# Sunflower Harbour Tableau v1.3

## Status
Current-authority scene/world brief for the **crowded harbour tableau** direction.
This document is intended to guide implementation, art, layout, crowd logic, and lightweight animation.

---

## 0. Core Goal

Sunflower should feel like **a crowded, socially legible harbour-quarter tableau**, not a decorative postcard harbour and not a flat map with a few floating NPCs.

The player should feel:
- this place is **busy, mixed, alive, funny, slightly dirty, socially layered**;
- they must **scan the scene** to find people, activities, and opportunities;
- the harbour is a **living neighbourhood**, not just a mission board;
- there is sea, labour, leisure, faith, vice, inequality, absurdity, and daily life all in the same frame.

Inspirational blend:
- Morocco / Egypt street life
- Haifa slope + sea + mixed neighbourhood texture
- New York underground / immigrant street-block density
- coastal life + black humour + occasional surreal mutation

---

## 1. Non-Negotiable Scene Principles

### 1.1 Bustle first
The harbour must read as **熙熙攘攘 / bustling**.
That does **not** mean random clutter.
It means:
- many people present;
- multiple small activities visible at once;
- different social groups occupying different pockets;
- enough density that finding a target person can be mildly difficult and funny.

### 1.2 Social information beats decoration
Cut decorative elements that do not communicate anything meaningful.
Every major scene element should help answer at least one of:
- what kind of place is this?
- who spends time here?
- what work happens here?
- is this place rich, poor, shady, holy, relaxed, loud, family-oriented, risky?
- where might I find the person I need?

### 1.3 Similar clarity across the whole image
**All major scene elements should be kept at roughly the same clarity/detail level.**
Avoid a strong mismatch where:
- characters are crisp but background is blurry, or
- foreground objects are highly rendered while crowd/environment is muddy.

Goal:
- no obvious "characters on top of a painting" feeling;
- no obvious "layer A is sharp / layer B is fuzzy" feeling;
- visual cohesion across NPCs, props, and environment.

### 1.4 Avoid obvious layer seams
Do use internal rendering layers for implementation, but the final result should **not look obviously layered**.
The player should not feel:
- "background sheet + floating NPC cutouts";
- "foreground sticker + middle sticker + skybox".

Desired outcome:
- a single readable scene with depth,
- but without ugly separation lines or obvious compositing.

### 1.5 Harder to find people is a feature
It is acceptable and desirable that the player sometimes has to visually search for an NPC.
This should feel like:
- scanning a lively street scene,
- pushing through crowd logic mentally,
- spotting someone near their usual zone.

It should **not** feel like:
- random hiding,
- unfair disappearance,
- identical silhouettes everywhere.

---

## 2. World Structure

The harbour should read as one large tableau containing multiple connected zones.
Not eight isolated rooms.

Recommended high-level zones:
1. **Sea / Shore**
2. **Berth / Cargo / Fish**
3. **Wong Services Strip**
4. **Food / Shisha / Social Strip**
5. **Park / Basketball / Chess**
6. **Faith / Vice / Suspicion Strip**
7. **Craft / Oddity Strip**
8. **Cliff / Edge**

These may partially overlap visually.

---

## 3. Zone-by-Zone Production Sheet

## Zone A — Sea / Shore

### Must convey
- open sea presence
- coastal air / wind / leisure / exposure
- not just labour: also people using the coast recreationally

### Must include
- visible sea
- some swimmable / usable shore edge (stone, sand, or mixed)
- swimmers
- sunbathers
- seagulls
- visible tropical fish in water
- ropes / floats / wet stone / minor shore debris

### Typical people
- swimmer
- sunbather
- person staring at sea
- couple
- drifter / idler
- occasional kid or fisher-type figure

### Lightweight loops
- wave motion
- fish gliding
- seagull movement
- swimmer bobbing
- distant boat rocking

### Interactivity
Mostly non-interactive.
Can occasionally host tiny scan surprises.

---

## Zone B — Berth / Cargo / Fish

### Must convey
- goods movement
- labour
- waiting for cargo
- practical harbour economy

### Must include
- boats and mooring area
- fish crates / produce crates / sacks / rope / tool clutter
- handcart / cargo piles
- damp edge / worn surfaces

### Typical people
- labourers
- small traders
- watchers / buyers
- Aspen often nearby
- suspicious lingerers

### Lightweight loops
- carrying crate
- counting/checking goods
- short conversation gestures
- boat rocking

### Interactivity
Only selected route or trade objects should be interactive.
Most cargo is informational background.

---

## Zone C — Wong Services Strip

### Identity
Wong should be the head of a chaotic multi-service empire.
This is funny, plausible, slightly suspicious, and socially useful.

### Wong Empire may include
- parcel / courier
- luggage storage
- laundry / laundromat
- tiny pharmacy / daily supplies
- SIM / top-up / convenience items
- Bitcoin ATM
- weird payment / small financial service
- frozen treats / ice cream supply point or truck stop
- snacks / drinks

### Must convey
- hyper-practical immigrant hustle
- "you can do almost anything here"
- slightly uncanny expansion energy

### Typical people
- parcel customers
- laundry waiters
- ATM lingerers
- errand-runners
- people buying small items
- Wong himself

### Lightweight loops
- entering/exiting storefront
- waiting in short line
- using machine
- gesturing at counter

### Interactivity
Wong and core logistics/transaction hooks may be interactive.
Most sub-services remain environmental.

---

## Zone D — Food / Shisha / Social Strip

This is the social heart of the quarter.

### D1. Joel's Bar + Live Music

#### Must convey
- social centre
- gossip / betting / congregation
- nighttime intensification

#### Must include
- semi-open bar frontage
- drinkers
- stand-and-talk crowd
- visible music setup or live corner

#### Typical people
- Joel
- regulars
- occasional musicians
- bettors / watchers

#### Lightweight loops
- sipping / arm gesture / tapping foot / instrument motion

---

### D2. Shisha Place

#### Must convey
- long-stay sociality
- mixed-age, mixed-background sitting culture
- people lingering, watching, talking, wasting time

#### Must include
- seated patrons
- hookah / tea / low table rhythm
- slow, dense social atmosphere

#### Typical people
- older men / mixed neighbourhood regulars / idlers / listeners

#### Lightweight loops
- smoking gesture
- head turns
- hand movement while talking

---

### D3. Deli / Pizza / Small Food

#### Must convey
- everyday food economy
- residential neighbourhood feeling
- youth / families / workers grabbing food

#### Must include
- pizza signal
- deli or takeaway counter
- food signage / pickup activity

#### Typical people
- workers eating
- families
- teenagers
- date-ish pairings

---

## Zone E — Park / Basketball / Chess

This zone prevents the quarter from feeling like pure commerce.

### E1. Grass / park pocket

#### Must convey
- rest / pause / public space
- people existing without buying or selling

#### Must include
- grass patch
- benches or informal sitting edge
- park squirrels

#### Typical people
- resting residents
- someone lying down
- someone eating outside
- elders / couples / casual sitters

#### Lightweight loops
- squirrel darting
- small body shifts
- page reading / snack eating

---

### E2. Basketball court

#### Must convey
- youth presence
- local neighbourhood energy
- rhythm and noise

#### Must include
- small street court feeling
- active players or waiting players
- one or two watchers

#### Lightweight loops
- dribble / shot / pass / bounce

#### Interactivity
Mostly ambient, unless later used as a social clue location.

---

### E3. Chess / board table

#### Must convey
- elders / regulars / non-commercial public life
- spectatorship and argument

#### Must include
- chess table or similar table-game setup
- two players
- one or more watchers

#### Lightweight loops
- moving piece
- leaning in
- pointing gesture

---

## Zone F — Faith / Vice / Suspicion Strip

### F1. Synagogue / Shabbat traces

#### Must convey
- religious life as living rhythm, not tourist iconography
- timing changes across days

#### May include
- recognisable observant figures
- pre-Shabbat preparation traces
- earlier shop closures
- family return flow
- challah / candles / domestic cues where appropriate

#### Important
Keep subtle and lived-in.

---

### F2. Peep show / vice corner

#### Must convey
- adult underside of the district
- not wholesome postcard urbanism

#### Must include
- edge-of-block or tucked-away presence
- slightly seedier visual tone

#### Interactivity
Mainly environmental; may support mood and world logic.

---

### F3. Suspicious figures / hustlers / homeless margin

#### Must convey
- risk
- informal / illicit economy
- social precarity and decline

#### May include
- loiterers watching others
- quick exchange pairings
- trash picker
- drunk / collapsed figure
- rough sleeper
- ATM hoverer

#### Lightweight loops
- pacing a few steps
- rummaging
- smoking
- slumping / shifting

---

### F4. Octopus Bank

#### Identity
Semi-formal, semi-absurd financial node.
A good visual anchor for obligations, payments, and money anxiety.

#### Must include
- octopus-like visual identity
- ATM / small-window service feel
- queue or anxious waiting behaviour

#### Must convey
- money flows are part of the street
- finance is tangible and a little ominous

---

## Zone G — Craft / Oddity Strip

### G1. Exotic pet shop

#### Must convey
- weird charm
- animal presence beyond basic birds/cats
- slightly dubious fascination

#### May include
- unusual fish / birds / reptiles / rodents / cage silhouettes

#### Interactivity
Mostly environmental.

---

### G2. Glassblower

#### Must convey
- artisan labour
- heat / fire / making rather than only selling

#### Must include
- flame source
- workbench
- glass pieces / tools

#### Lightweight loops
- turning / blowing / flame flicker

---

### G3. Snake charmer / street performer

#### Must convey
- spectacle
- tourist bait / scam ambiguity
- North African / Egyptian street energy

#### Typical support
- small watching semicircle

---

## Zone H — Cliff / Edge

### Must convey
- the world opens and thins out here
- wind / edge / danger / privacy / transition

### Must include
- visible path or upward/edge route
- occasional smoker / lookout / couple / solitary figure

### Important
Do not make this look like a pure teleport gate.
It should exist as part of the quarter's geography.

---

## 4. Crowd Taxonomy

### 4.1 Named actors
These must remain easy enough to recognise:
- Joel
- Juan
- Aspen
- Wong
- Yasmin
- Dima
- Sonya

Requirements:
- distinct silhouette
- distinct colour logic
- plausible zone habits
- not too easy, but not impossible to locate

### 4.2 Functional crowd
These people have role meaning but no full story route:
- labourers
- shisha regulars
- pizza/deli workers
- laundry waiters
- ATM lurkers
- chess elders
- basketball youth
- family members
- suspicious middlemen
- homeless / trash picker / drunk
- park sitters
- swimmers / sunbathers
- glassblower viewers
- pet-shop browsers

### 4.3 Ambient crowd
- passing pedestrians
- wall-leaners
- sea-watchers
- casual talkers
- idle sitters

### 4.4 Small creature layer
- toads
- squirrels
- seagulls
- tropical fish
- pet-shop animals

These provide scan fun and life.

---

## 5. Interaction Philosophy

### General rule
- a few people are truly interactive;
- a few props/stations are truly interactive;
- most people and most objects are there to make the place legible and alive.

### Therefore
Do **not** try to make every stall item clickable.
Do **not** try to make every background NPC interactive.
Do **not** confuse presence with clickability.

### Player experience target
The player reads the world first, then interacts selectively.

---

## 6. Animation Philosophy

### Keep animation cheap and simple
Do not require sophisticated character animation.
Use short loops:
- stand sway
- step cycle
- talking gesture
- smoking gesture
- carrying gesture
- dribble / shot loop
- swimmer bob
- seagull hop / flap
- squirrel dash
- fish glide
- flame flicker
- laundry flap / curtain sway / sea motion

### Key principle
The world should feel alive through **many tiny loops**, not through a few complex cinematic animations.

---

## 7. Weather / Day-State System

### Important
The quarter should change by day and weather.
Not every person needs bespoke animation; instead the scene composition can change.

### Recommended common day types
- cargo-heavy day
- hot beach day
- rain day
- Shabbat eve
- auction day
- music night
- thin crowd day
- rough-after-incident day

### These states should alter
- which zones are crowded
- which shops are open / quieter
- where target NPCs are more likely to be
- where danger / vice intensifies
- whether swimmers / sunbathers appear
- whether live music is active
- whether faith/family presence is stronger

### Rare surreal mutation states
Can exist at low frequency:
- leaf-hands day
- cat day
- mushroom day
- other absurd transformations

These are optional spice, not the daily norm.
They must not destroy readability.

---

## 8. Visual Cleanup Directives

## Remove / reduce
- excessive decorative flowers with no social meaning
- too many pretty still-life props
- decorative paintings that do not help world reading
- overly tidy "Mediterranean postcard" clutter
- empty cuteness

## Add / strengthen
- crowd density
- class difference
- visible labour
- vice / homelessness / risk
- faith traces
- neighbourhood services
- animals
- sea leisure
- sports and table games
- oddity / craft
- weather
- scan-worthy motion

---

## 9. Rendering Directives

These are implementation-facing directives.

### 9.1 Unified clarity
Keep environment, crowd, props, and named actors at approximately one clarity family.
Do not let any one layer look obviously imported from a different resolution world.

### 9.2 Soft depth, not sticker layers
Depth can exist through:
- overlap,
- scale shifts,
- anchor placement,
- crowd placement,
- object blocking,
- environmental occlusion.

But avoid final results that look like:
- obvious paper-cutout compositing,
- blurry backdrop + sharp sprite mismatch,
- separate mini-worlds stacked without cohesion.

### 9.3 Grounding
No floating people.
No walking on water.
No standing on tabletops unless intentionally comedic.
Every crowd/NPC slot must have believable footing.

---

## 10. Production Priorities

### Priority 1
Rebuild the scene composition away from decorative clutter toward socially readable bustle.

### Priority 2
Unify clarity / remove obvious layer mismatch / fix grounding.

### Priority 3
Introduce crowd slots and simple loops across the major zones.

### Priority 4
Add day/weather state variation.

### Priority 5
Add scan-fun creature layer and optional surreal mutation layer.

---

## 11. Final One-Sentence Direction

**Sunflower should look and feel like a crowded harbour-quarter scroll where sea, labour, leisure, faith, vice, service hustle, animals, and black-humoured social life all coexist in one coherent, equally clear, bustling scene.**