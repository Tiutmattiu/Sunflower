# Sunflower — Visual Reference Index

> Status: production reference index. This file does **not** authorise copying or redistributing third-party artwork. It records what the creator likes about supplied references so engineering and future art production can reproduce the *design principles* rather than imitate a specific copyrighted image.
>
> The creator supplied screenshots/reference images in chat on 2026-09-08. Those files are not committed here because this repository is public and the images appear to include third-party game/comic material. Use the descriptions below plus official/public reference pages. If the creator later supplies owned/licensed originals, they may be added under a separate provenance-labelled reference directory.

---

## 1. Reference hierarchy

The target is **not** an average of three aesthetics. Each reference owns a different problem.

### A. Rutu Modan — people, social observation, comic grammar
Use for:
- adult bodies and faces that are specific rather than beautified;
- clear hand-drawn contour;
- flat local colour;
- ordinary clothing and posture;
- urban/social realism without photographic stiffness;
- establishing-frame → medium/close/insert comic sequencing;
- scene-specific palette as narrative information;
- dry, unsentimental humour and interpersonal awkwardness.

Do **not** request an exact imitation of Rutu Modan. The production target is the high-level visual grammar documented in `ART_DIRECTION.md`.

Official/public references:
- Drawn & Quarterly, *Exit Wounds*: https://drawnandquarterly.com/books/exit-wounds/
- The Comics Journal interview: https://www.tcj.com/rutu-modan/2/

Useful principle from the interview: illustration can create a *situation* rather than reproduce one photographic instant; scene palette guides both atmosphere and the order in which the reader perceives information. The large establishing frame can carry the location so later frames need only enough context to remain legible.

### B. Death and Taxes — tactile interaction and diegetic interface
Use for:
- the desk/work surface as a persistent playable stage;
- papers, files, tools and devices as manipulable objects rather than abstract tabs;
- a limited screen-space interaction vocabulary;
- restrained 2D drawing with visible paper/ink/watercolour texture;
- panels/rooms that feel theatrical rather than like web-dashboard cards;
- decisions embedded in handling objects and documents;
- strong institutional props: forms, stamps, folders, counters, receipts, drawers, telephones.

Do **not** copy its black/grey/yellow palette as Sunflower's palette. Borrow the *physicality and stage grammar*, not the exact UI skin.

Official/public references:
- Presskit: https://deathandtaxesgame.com/presskit
- Steam: https://store.steampowered.com/app/1166290/Death_and_Taxes/

### C. soupsoup — scene density, visual exploration, micro-stories
Use for:
- large illustration-first scenes with very little conventional UI;
- abundant small objects and micro-events that reward looking;
- multiple scales of figures/objects in one composition;
- strong silhouette separation despite high density;
- hidden-object discovery that feels like exploring an illustration rather than reading a menu;
- unusual, playful spatial composition rather than strict photographic perspective;
- different illustrators/worlds demonstrating that interaction grammar can survive style variation;
- touch-friendly direct interaction with the illustrated world.

Do **not** copy its cute tone, mascot proportions or target-strip UI. Sunflower should be older, stranger, drier, more socially grounded and less toy-like.

Official/public references:
- Steam: https://store.steampowered.com/app/4201610/soupsoup/
- App Store: https://apps.apple.com/us/app/soupsoup-magazine/id6443660171
- Google Play: https://play.google.com/store/apps/details?id=com.madkang.hotcornsoup
- hotcornsoup links: https://linktr.ee/hotcornsoup

The useful production idea is the developer's own framing: an **interactive illustration magazine** in which players enter artists' worlds. Sunflower should similarly treat the scene itself as the primary interactive surface.

### D. Hidden Folks — engineering precedent for dense interactive illustration
Secondary interaction reference, not primary style reference.

Use for:
- hand-drawn scenes built from many manually layered elements;
- large numbers of unique small interactions inside one illustration;
- mouse/keyboard/touch compatibility;
- hidden-object discovery without score/time pressure;
- environmental objects that can be clicked/poked/moved without turning the game into a button list.

Official/public reference:
- Press kit: https://hiddenfolks.com/press

The team describes the original game as hand drawn, scanned, placed, layered, animated and scripted, with hundreds of unique interactions. That production model supports Sunflower's proposed layered SceneStage/asset-manifest approach.

---

## 2. What the creator-supplied images add

### soupsoup reference set — dense vertical worlds
The supplied images show tall, almost poster-like scenes packed with dozens of small figures, creatures, architectural fragments and props. Important features:

- the eye can wander before acting;
- objects are not all the same scale;
- one giant foreground figure can coexist with tiny background activity;
- large colour masses organise the chaos;
- black/ink contour keeps crowded scenes readable;
- tiny repeated motifs create rhythm;
- strange objects are allowed to be visually funny without being explained;
- the scene contains more life than the current task requires;
- hidden targets are camouflaged by the ordinary density of the illustration, not by making the whole scene muddy.

**Sunflower translation:** each location should contain 3 layers of information:
1. mechanically active people/objects;
2. economically/socially informative environmental traces;
3. non-utility visual life.

The third layer is essential. A bar that contains only current quest objects will still feel like a menu.

### Death and Taxes reference set — desk and room as physical stage
The supplied desk video/screenshots show files physically overlapping on a persistent desk, a marker/tool that performs the consequential action, small machines/phone/calendar sharing the same world-space, and no need to open a generic web form for every decision.

The supplied room/bar screenshots show side-on theatrical spaces with clearly readable furniture, shelves, posters and character positions.

**Sunflower translation:**
- documents and goods should occupy the active work surface;
- clearing slips, claims, invitations, parcels and provenance papers should be visible objects;
- the player's action should often be `object → target` rather than `open tab → choose verb → confirm`;
- important locations can be staged like cutaway theatre sets, but should use Sunflower's colour and character language.

### Rutu Modan reference — adult social realism
The supplied *Exit Wounds* page emphasises a large ordinary body in the foreground, mundane urban infrastructure, muted but decisive flat colours and small surrounding panels. The figure is not glamourised and the environment is not decorative.

**Sunflower translation:**
- preserve age, weight, awkwardness, fatigue and mundane posture;
- allow extreme cropping/scale when it improves social point-of-view;
- backgrounds must explain class, work and location;
- a character is often most revealing while waiting, carrying, sitting, glancing or handling something.

---

## 3. Explicit negatives

Sunflower must **not** drift toward:

- pixel art;
- chibi/cute mascot game;
- kawaii/cozy visual language as the default tone;
- anime/webtoon beauty rendering;
- glossy vector startup illustration;
- 3D mobile-game character splash art;
- visual-novel portrait boxes over a background;
- Twine/ChoiceScript-like text-adventure panels;
- card-dashboard UI where places/people are represented mainly by rectangular cards;
- photoreal or cinematic concept art;
- generic 'indie hand drawn' without materially specific environments;
- a Where's-Waldo clone where every scene exists only for hidden-object hunting.

---

## 4. Reference ownership by production problem

| Production problem | Primary reference | What to borrow | What not to borrow |
|---|---|---|---|
| People / faces / bodies | Rutu Modan grammar | flat contour, ordinary adults, social specificity | exact artist imitation |
| Comic sequencing | Rutu Modan grammar | establishing frame, inserts, scene palettes, mundane beats | fixed comic-page grid |
| Persistent interaction surface | Death and Taxes | desk/theatre physicality, forms/props | monochrome/yellow identity |
| Institution presentation | Death and Taxes | forms, counters, stamped/handled objects | office-death iconography |
| Dense scene exploration | soupsoup | object-rich illustrated worlds, micro-stories | cute mascot tone, target-strip cloning |
| Hidden toads | soupsoup + Hidden Folks | camouflage through visual density, direct click/tap | generic sparkle/highlight |
| Reusable layered scene engineering | Hidden Folks precedent | draw/place/layer/script assets | monochrome style |

---

## 5. Rule for external reference material

Do not download web reference images into runtime assets.
Do not trace or reproduce exact compositions, characters or panels.
Use official links for reference and encode the observed design principle in Sunflower's own scene specification.

Final authored/generated Sunflower art must be original and should be judged against `ART_DIRECTION.md` + `VISUAL_PRODUCTION_SPEC.md`, not against pixel-level similarity to any reference.