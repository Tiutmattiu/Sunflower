# Sunflower — Art Direction & Asset Prompt Source of Truth

> Status: current working visual source of truth for Sunflower.
>
> This file centralises visual analysis, asset-production rules, generation prompts, scene composition, storyboard grammar and UI/comic integration. Do **not** scatter character prompts across chat, extra MDs or implementation notes.
>
> The visual direction is derived from the **user-selected Rutu Modan reference pages** plus the interaction/theatrical framing the user likes in **Death and Taxes**. The target is not generic “indie comic” and absolutely not Japanese/Korean beautified manga.

---

## 1. Reference extraction — what the selected Rutu Modan pages actually do

### 1.1 Line

The selected pages use a controlled, hand-drawn ink contour rather than glossy digital line art.

Observed characteristics:

- outer contours are clear and persistent;
- line weight is medium, sometimes slightly heavier around foreground silhouettes;
- interior facial lines are thinner but still visible;
- pressure variation exists, but it is restrained rather than calligraphic;
- lines are not vector-perfect: tiny wobble and human irregularity remain;
- there is little decorative hatching; form comes mainly from contour and flat colour;
- texture lines are used selectively for hair, water, foliage, brick, cloth, wrinkles and printed matter.

The scans do **not** prove the exact physical pen/nib/brush used, so do not claim a specific original tool. For digital production, emulate the observed result with a dry ink / technical-pen brush.

Recommended digital equivalent at ~2000–2400 px image height:

- major outer contour: ~4–7 px;
- interior body/clothing line: ~3–5 px;
- facial feature / wrinkle line: ~2–4 px;
- very small environmental texture: ~1.5–3 px;
- opacity: essentially solid ink, not translucent sketching;
- taper: low-to-moderate;
- smoothing: low enough to preserve hand irregularity.

The correct feeling is **drawn, printed, controlled, slightly dry**.

Never use:

- razor-thin polished manga line;
- glossy vector contour;
- heavy brush-calligraphy variation;
- airbrushed edge softness;
- eyelashes as decorative line clusters.

### 1.2 Faces

Faces are specific without being beautified.

Observed rules:

- eyes are small-to-medium relative to the head;
- pupils/irises are simple and do not sparkle;
- eye highlights are absent or negligible;
- eyelids, eye bags and wrinkles are allowed to carry age;
- noses are structural and visible, often more important than the eyes;
- mouths are compact and graphic;
- lips may be coloured when character-specific, but they are flat shapes, not glossy 3D lips;
- asymmetry, sagging, large noses, compressed mouths, odd jaw shapes and ordinary proportions are kept;
- older faces are genuinely old rather than “young face + wrinkle overlay.”

The face is built from **a few decisive marks**, not rendered anatomy.

Do not beautify through:

- enlarged eyes;
- tiny pointed noses;
- V-shaped chins;
- porcelain-smooth skin;
- perfectly symmetrical features;
- glamour contouring;
- anime blush/highlight language.

### 1.3 Volume, light and highlights

The selected pages are fundamentally planar.

- skin is mostly one flat local colour;
- clothes are mostly one flat colour;
- shadows are sparse, simplified colour shapes;
- there is very little soft gradient modelling;
- there is almost no glossy specular highlight;
- dimensional depth comes from overlap, perspective, panel composition and local colour contrast rather than rendered light.

For Sunflower:

- no shiny cheekbones;
- no glossy lips except a character-specific flat lipstick colour;
- no cinematic rim light as default;
- no shiny anime hair bands;
- no volumetric light haze;
- no beauty-rendering skin gradients.

### 1.4 Hair

Hair is treated as graphic mass first, strand information second.

Observed rules:

- silhouette matters strongly;
- dark hair often reads as a nearly solid shape;
- a small number of directional marks explain curl, wave or parting;
- grey/white hair can use sparse contour/texture lines;
- hair never becomes thousands of polished strands;
- highlights, if any, are broad graphic separation rather than glossy ribbons.

Sunflower production rule:

> Describe hairstyle clearly, render it as **one or a few printed masses**, then add only enough line texture to establish structure.

### 1.5 Bodies, posture and clothes

The selected figures are ordinary bodies occupying social space.

- age and body weight are visible;
- people can be stocky, thin, tired, slouched, awkward or stiff;
- proportions are believable but not fashion-illustration idealised;
- gestures are mundane: standing, waiting, reaching, leaning, sitting, carrying, talking;
- clothing reads by silhouette and functional seams rather than fashion rendering;
- wrinkles in clothing are sparse and purposeful.

The character should look like someone who **has a life and a job**, not someone posing for a character sheet.

### 1.6 Colour

The selected pages use high-impact colour that still feels printed/matte rather than luminous-screen glossy.

Recurring palette relationships include:

- cyan / sky blue / lake blue;
- turquoise and blue-green;
- mustard / ochre / old yellow;
- brick red / tomato red / rust;
- olive / bottle green / muted dark green;
- dusty pink / salmon / pale rose;
- warm beige / old paper / cream;
- mauve-grey / concrete grey / dark brown / charcoal.

Important distinction:

- colours can be saturated;
- they are **not translucent, candy-like or neon-glossy**;
- they feel constrained by ink and paper;
- warm and cool flat shapes do a lot of compositional work.

Sunflower should use a strong dark-saturated harbour palette with occasional clean, bright printed accents.

### 1.7 Print surface

The selected references retain the physical sense of a comic page.

Useful production effects:

- subtle paper tooth;
- mild ink grain;
- slightly uneven colour density;
- extremely subtle registration imperfection where appropriate;
- printed black rather than infinite digital black;
- no artificial “vintage filter” covering everything.

Texture must remain subordinate to drawing clarity.

### 1.8 Backgrounds and environments

Backgrounds are not empty decorative gradients.

Observed strengths:

- rooms have real doors, chairs, windows, tables, wall divisions and clutter;
- cities have signs, façades, cars, pavements, trees and institutional architecture;
- natural scenes can use enormous simple colour fields plus selective line texture;
- crowds contain many distinct bodies without turning into anonymous blobs;
- environmental perspective is clear, but volume is still planar.

Objects matter because they locate people socially and narratively.

For Sunflower, every major environment should reveal its economic function through objects before exposition does.

### 1.9 Composition

The selected pages move comfortably between:

- a large establishing panel;
- tight facial inserts;
- mundane medium shots;
- object close-ups;
- crowd tableaux;
- large negative-space panels;
- sequences where very little “action” occurs but time is palpable.

Important:

> The comic does not need every panel to be dramatic. Ordinary posture and silence carry narrative weight.

### 1.10 Tone

The visual tone is observant, social, dry and unsentimental.

Avoid visual pleading for emotion.

Do not make a sad scene prettier because it is sad.
Do not make a rich character glamorous because she is rich.
Do not make a nonhuman character cute because it is nonhuman.

---

## 2. Sunflower visual synthesis

Sunflower combines:

- **Rutu Modan-derived flat narrative drawing** for people, places and comic storytelling;
- **Death and Taxes-derived desk/theatre interaction grammar** for the playable present;
- high-saturation retro/postmodern print colour;
- physical paper, IOUs, ledgers, orders, receipts, invitations, goods and evidence as interface objects;
- a world that becomes visually denser through accumulated consequences.

The final game should feel like an **interactive printed graphic novel laid across a desk**, not a card dashboard and not a visual novel portrait box.

---

# PART A — ASSET PRODUCTION STANDARD

## 3. Asset families

Keep the asset system small and reusable.

### 3.1 Character master asset

Per major character, produce:

1. full-body neutral/working pose;
2. waist-up/half-body scene portrait;
3. one alternate working pose if mechanically useful;
4. 3–6 important prop overlays or nearby objects;
5. no giant emotion-sprite library.

Character state should usually be conveyed through:

- posture;
- current prop;
- location;
- paper/object on desk;
- dialogue;
- who else is present.

### 3.2 Location master asset

Each major location needs:

- one establishing background;
- one closer interaction crop;
- 5–10 reusable prop/object layers;
- optional lighting/weather variant only if narratively/mechanically meaningful.

Primary locations:

- Aspen berth / workshop;
- Joel's Bar;
- Yasmin's receiving room / auction table;
- Wong's dock pile / salvage area;
- Juan's greenhouse / growing room;
- Dima's informal office / back room;
- Octopus Clearing desk, visually distinct from any finite personal seafood stock;
- general public harbour / Noon clearing space.

### 3.3 Object assets

Objects should look hand-drawn and materially specific.

Priority classes:

- goods;
- money/tins;
- order slips;
- public tape receipts;
- IOUs/claims;
- collateral;
- provenance papers;
- invitations;
- tools;
- seeds/plants;
- route objects;
- Sunflower.

Do not reduce every item to a generic emoji in final art.

### 3.4 Comic panel assets

For important consequence sequences, produce scene panels rather than a separate cinematic pipeline.

Reuse:

- location backgrounds;
- character masters;
- object inserts;
- changed crops/poses;
- panel borders and speech bubbles.

This keeps comic narrative production affordable.

---

## 4. Technical composition targets

These are production targets, not engine requirements.

### Character masters

- full body: 4:5 or 3:4 portrait composition;
- half body: 4:5 portrait;
- leave breathing room around silhouette for cropping;
- neutral flat background or transparent cutout if production pipeline supports it.

### Scene backgrounds

- desktop target: approximately 16:10 or 4:3 depending location;
- compose important action away from UI-safe margins;
- include foreground/midground/background separations through colour/overlap, not blur.

### Comic panels

Use a small grammar:

- **WIDE** — environment / collective state / silence;
- **MEDIUM** — two or three people / transaction;
- **CLOSE** — face / hand / object consequence;
- **INSERT** — receipt, fish, seed, watch, claim, bottle, key;
- **CROWD** — public-market/social event;
- **VOID/SPACE** — Sun Moment / absence / interruption.

Do not invent dozens of cinematic camera types.

---

## 5. Master style prefix for generation

Use this at the beginning of every generated visual asset prompt:

```text
SUNFLOWER MASTER VISUAL LANGUAGE:
Create a flat hand-drawn narrative-comic illustration based on the visual properties extracted from the user's selected Rutu Modan reference pages, combined with the desk-theatre interaction grammar of Death and Taxes.

Use controlled medium-weight hand-inked contours with slight human irregularity; thinner but still visible facial/internal lines; flat opaque colour blocks; almost no soft modelling; sparse simplified shadow shapes; no glossy highlights; graphic hair masses with only a few structural strands; socially believable adult bodies; specific non-beautified faces with natural noses, small-to-medium eyes, ordinary jaws, age lines and asymmetry where appropriate; clear material environments; subtle paper tooth and ink grain; high-saturation but matte print colours such as cyan, teal, mustard, ochre, rust, tomato red, olive, dusty pink, warm cream, mauve-grey, charcoal and dark brown.

The result should read like a printed independent graphic-novel panel: observational, socially specific, dry, slightly awkward, materially grounded and narrative-first.

ABSOLUTE NEGATIVES:
No Japanese/Korean beautified manga or webtoon look. No anime eyes. No bishounen. No K-pop-idol face. No V-shaped beauty chin. No porcelain skin. No glossy lips or hair. No airbrushed gradients. No cinematic concept-art lighting. No fashionable game splash art. No Disney/Pixar cuteness. No furry mascot treatment. No fantasy-RPG glamour. Do not make characters younger, prettier, thinner, smoother or more symmetrical than specified.
```

---

# PART B — CENTRAL GENERATION PROMPTS

## 6. Yasmin

```text
[MASTER STYLE PREFIX]

YASMIN — mature Indian capital allocator and elite social operator.
Clearly Indian facial structure, not East Asian. Mature adult woman. Mocha-brown hair with silver streaks, arranged in a long pinned updo. Large but realistically proportioned green eyes, natural crow's-feet, distinct beauty mark near the mouth, refined flat lipstick colour, gold jewellery. Mature, elegant, controlled, socially practised, expensive without fantasy aristocracy. Dark saturated clothing palette. She hosts, allocates capital, handles provenance and private deals, and spends real effort maintaining advantageous social relations. There is faint weariness underneath the composure.

Do not make her look Japanese, Korean, youthful, doll-like, princely, palace-like or fashion-editorial. Keep age lines and adult facial weight.

Suggested props: invitation cards, provenance paper, ledger, sealed note, understated gold jewellery, drink glass, auction lot.
```

## 7. Juan

```text
[MASTER STYLE PREFIX]

JUAN — South American / Indigenous Latin American botanist, grower and distressed-finance operator.
Thin but energetic older man, full white straight hair to shoulder length, black eyes, wrinkles, alert posture, mentally quick and physically wiry rather than frail. His face should feel specific and lived-in. He manages seeds, biological maturity, productive plants and debt/claims. He can appear eccentric or slightly unhinged without becoming a mystical stereotype.

No fantasy druid, no wizard, no generic shaman, no anime old man, no saintly glow.

Suggested props: seed packets, cuttings, labelled jars, roots, immature plant, claim/IOU paper, notebook, greenhouse tool.
```

## 8. Dima

```text
[MASTER STYLE PREFIX]

DIMA — Eastern European / Slavic-Jewish-looking informal broker and settlement guarantor.
Blond short crop / close cut / short slicked hair, grey-brown eyes, hooked nose, sturdy compact slightly heavy build. Cautious, calculating, observant and capable of being ruthless. His threat should come from realism and restraint, not villain posing. He understands proxies, claim transfer, enforcement and the places where formal systems fail.

No comic mafia parody, no action villain, no anime gangster glamour.

Suggested props: folded claim paper, keys, document pouch, manifest, small calculator/ledger, coat, sealed envelope.
```

## 9. Wong

```text
[MASTER STYLE PREFIX]

WONG — current provisional Dog presentation. Whippet-like build, copper coat, green eyes. Lean, fast, practical, alert, visibly overworked. He supports many dependents, bargains hard, scavenges/salvages, accepts dirty small jobs and operates high-turnover low-margin commerce. Treat him as a full social/economic actor, not a mascot. The creator has reopened the species decision; keep this asset direction for current continuity without treating Dog as irreversible final canon.

For the current asset pass, keep him unmistakably canine. No human face, no furry-anime body, no Disney dog, no plush-toy cuteness.

Suggested props: salvage bundle, fish bones, small ledger, rope, household food, reused bottle, scrap/tool pouch.
```

## 10. Joel

```text
[MASTER STYLE PREFIX]

JOEL — very light-skinned Black young man, tall and slim, younger-looking than earlier drafts, no glasses. Carefully groomed copper/ginger hair, possibly short waves; brown eyes. Slightly nerdy, sensitive, privileged, curious, socially magnetic, highly receptive to sensory experiences and new ideas. His body should be lanky rather than broad. He is not deeply attached to ordinary wealth and can learn frighteningly quickly.

Do not make him middle-aged, businesslike, K-pop/idol pretty or bishounen. No glasses.

Suggested props: drink, tab book, odd experimental ingredient, note, small sensory object, bar towel/glass.
```

## 11. Aspen

```text
[MASTER STYLE PREFIX]

ASPEN — Japanese adult woman, disciplined sailor/mechanic/operator. Black bob or pixie cut. Pale natural skin, but NOT geisha-white and not porcelain. NO lipstick. Mature rather than youthful. Compact, durable, weather-aware, time-aware, physically competent, reserved and hard-working without looking rustic. Her life is organised around schedules, maintenance, provisioning and dependable low-variance work.

Do not make her cute, doll-like, girlish, glamorous, geisha-coded, extremely white or softly fragile. Keep adult facial weight and subtle labour/tension in posture.

Suggested props: watch, weather slip, maintenance list, compact tool, bundled supplies, departure timetable.
```

## 12. Octopus

```text
[MASTER STYLE PREFIX]

OCTOPUS — a real octopus economic actor, not a humanised mascot, operating the harbour's public clearing institution. Physically handles order slips, settlement papers/tins and public-tape records with multiple arms; limited personal marine stock may appear separately. Clever, practical, slightly uncanny and faintly comic only because the world itself accepts the situation as ordinary. Octopus Clearing, Octopus personal inventory and background marine supply must remain visually distinct.

Do not give it a cute children's-cartoon face. No kawaii octopus, no Pixar expression, no humanoid body in a costume.

Suggested props: fish crates, sea urchin basket, ice, seaweed bundle, scales, clearing slips, sardine tins, receipt printer/stamp, ropes.
```

---

## 13. Character lineup prompt

```text
[MASTER STYLE PREFIX]

Create one unified Sunflower cast tableau containing Aspen, Joel, Yasmin, Wong, Juan, Dima and the Octopus operator. Preserve each character's exact design from this file. Do not equalise their age, beauty, body or ethnicity. Arrange them as people/animals occupying one harbour economy rather than fashion models lined up for a franchise poster.

Include a few economically meaningful props around each figure. Use a printed-comic ensemble composition with social awkwardness and material specificity. For the current asset pass, Wong is clearly a copper whippet-like dog. Octopus is clearly an octopus. The human faces must stay non-beautified and specific.
```

---

# 14. Location generation prompts

## Aspen berth/workshop

```text
[MASTER STYLE PREFIX]
A compact harbour berth/workshop organised obsessively around time and maintenance: weather notices, tools, coiled rope, labelled supplies, a narrow bunk, departure schedule, practical storage, mechanical parts. Aspen belongs naturally in the space. It should feel used, clean but not decorative, and slightly constrained by routine.
```

## Joel's Bar

```text
[MASTER STYLE PREFIX]
A cross-form harbour bar: ordinary worn furniture, glasses, ice box, bottles, tabs/IOUs, one or two strange objects customers left behind, room for humans and animals without turning it into fantasy tavern décor. Warm saturated printed colours. Socially porous, slightly messy, sensorial and alive.
```

## Yasmin receiving room / auction table

```text
[MASTER STYLE PREFIX]
A modern mature private receiving room used for provenance-heavy deals and small auctions: dark saturated walls/objects, invitation cards, flowers, papers, discreet gold/green accents, carefully chosen furniture, evidence of hosting and repeated social maintenance. Elegant but not palace-like, luxurious but administratively functional.
```

## Wong dock/salvage area

```text
[MASTER STYLE PREFIX]
A working dock edge filled with salvage, tied bundles, reused bottles, fish bones, scrap, ropes, sacks and household/rescue supplies. Busy, practical, low-margin material circulation. Nothing cute or picturesque. The space should look like stopping work would immediately cost money.
```

## Juan greenhouse

```text
[MASTER STYLE PREFIX]
A productive greenhouse/growing room rather than mystical jungle: seed packets, propagation trays, labelled jars, cuttings, growing plants at different maturity stages, improvised equipment, a few financial/claim papers mixed into botanical work. Slightly unruly but economically legible. No fantasy-drug-lab cliché.
```

## Dima back room

```text
[MASTER STYLE PREFIX]
A small informal office/back room near the harbour: ordinary desk, claim papers, keys, envelopes, transport notices, cheap furniture, evidence of people entering and leaving. Functional, cautious, not cinematic gangster décor. Private settlement and access are the real subject.
```

## Octopus Clearing desk

```text
[MASTER STYLE PREFIX]
A wet harbour public settlement counter: sardine tins, public order/clearing slips, scales, stamps and receipts, with nearby marine lots visibly belonging to small boats, wharf sellers, visitors or limited Octopus-owned stock. The absurdity is treated as normal. Client settlement papers, settlement float, Octopus personal inventory and background supply must be visually distinguishable.
```

---

# 15. Comic storyboard grammar — the game scrolls like a comic

## 15.1 Core presentation

Sunflower should not alternate between “game UI” and separate cinematic cutscenes.

The **playable present** is a Death-and-Taxes-like desk/scene tableau.

When an action produces a meaningful consequence, the interface grows downward into a **Rutu-Modan-like comic sequence**. Panels are appended beneath the current scene and the page automatically scrolls downward in controlled steps.

The player experiences:

> interactive scene → commitment → comic consequence → next interactive scene

without changing visual language.

## 15.2 Auto-scroll behaviour

- never dump a whole cutscene at once;
- append/reveal one panel or one small panel row at a time;
- auto-scroll just enough to place the new panel comfortably in view;
- pause on speech/important image until click/short timing threshold;
- user can always manually scroll back upward;
- important choices stop auto-scroll completely;
- no uncontrolled cinematic camera movement;
- no full-screen dialogue box covering the art.

On mobile, panels become a single vertical reading stream.

## 15.3 Panel rhythm

Typical consequence sequence: **2–6 panels**.

Small economic consequence:

1. INSERT — receipt/object;
2. MEDIUM — counterparty reaction/action;
3. WIDE or CLOSE — result.

Important social/economic scene:

1. WIDE establishing;
2. MEDIUM transaction;
3. CLOSE hand/face/object;
4. reaction panel;
5. object/receipt consequence;
6. optional silent exit/space panel.

Do not force six panels when two are enough.

## 15.4 Rutu-Modan-derived montage rules

Use:

- mundane movement between major events;
- visual repetition with one changed detail;
- close-ups of paper/objects/hands;
- long environment panels with little dialogue;
- crowd panels where social pressure is visible spatially;
- ordinary awkward body language;
- silent reaction beats;
- direct cuts rather than lyrical transition prose.

Avoid:

- poetic narration explaining the image;
- anime reaction faces;
- visual-novel talking-head ping-pong for every conversation;
- cinematic depth-of-field clichés;
- symbolic dream montage unless the world event actually warrants it.

---

# 16. Storyboard rules by game event

## 16.1 Public Noon clearing

Default small sequence:

1. WIDE — Octopus clearing/public harbour, everyone briefly located;
2. INSERT — order slip / sardine tins / physical good;
3. MEDIUM — goods/cash move;
4. INSERT — public tape line prints/appears.

Routine trades can collapse to 1–2 panels after familiarity.

## 16.2 Sun Moment

Do not use mystical glow.

Preferred grammar:

1. WIDE panel with unusually large negative space;
2. ordinary bodies stop mid-task;
3. tiny environmental movement remains: water, hanging paper, plant leaf, light, ice melt;
4. little or no dialogue.

If contextual resistance becomes available:

- the world remains visually paused;
- the player's active order/paper is the only element that continues;
- no enlightenment iconography;
- if the player keeps working, show the late edit materially, not as spiritual special effect.

## 16.3 Rebirth / form change

Use repeated composition rather than fantasy transformation spectacle.

Example grammar:

1. familiar location composition from prior life;
2. cut to same composition with player absent;
3. object/estate paper remains;
4. new-body POV/scale enters later;
5. formerly ordinary object is now inaccessible / enormous / unusable / newly useful.

The point is changed economic position, not magical fireworks.

## 16.4 Juan claim / fire sale

Possible sequence:

1. INSERT — IOU face value;
2. CLOSE — immature plant / growing stage;
3. MEDIUM — creditor/holder decision;
4. INSERT — liquidation/transfer price;
5. WIDE — greenhouse after asset removal;
6. later repeated panel showing what would have matured / what remains.

## 16.5 Yasmin auction

1. WIDE — room/attendees and lot;
2. INSERT — lot detail;
3. optional clue INSERT;
4. silent bid papers/hands;
5. reveal/settlement;
6. later resale/provenance consequence panel.

No casino spectacle.

## 16.6 Relationship / Joel scenes

Do not deliberately stage romance.

Use physical attention and conversational drift:

- person stays after transaction is done;
- another paper is left untouched;
- drink/hand/object changes position;
- panel count quietly increases because the player kept talking.

The system can record attention allocation; the art should not announce romance.

## 16.7 Total Commodification

Visual transformation should move toward **cleaner** administration, not horror grime.

Early/mid game:

- people occupy scenes;
- papers are irregular;
- goods are physical and awkward.

Capstone drift:

- papers standardise;
- labels align;
- exposures/claims become more compact;
- fewer messy physical traces are needed;
- characters are increasingly framed through contract/claim/yield/access representations.

The scene may become beautifully legible.

Do not label it “bad ending.”

---

# 17. Scene/UI architecture

## Desktop

Approximate composition:

- top 8–10%: day / phase / cash / actions / objective;
- left ~35–40%: current place + active person/body;
- centre/right ~40–48%: active paper/object/transaction;
- narrow object rail: Notebook / Public Tape / Inventory / IOUs / invitations;
- bottom: one current line/result + contextual actions.

After a consequential action, comic panels append **below** this active tableau and the page scrolls downward.

The next interactive tableau appears after the consequence sequence.

## Mobile ~390 px

- compact top status;
- location/person panel;
- active paper;
- contextual choice sheet;
- then vertical comic consequence panels;
- horizontal object rail or drawer;
- no fixed overlay covering text/art.

---

# 18. Information hierarchy

**NOW**

- one current scene;
- one current fact/result;
- immediate choices.

**ON THE DESK**

- active order;
- claim;
- object;
- invitation;
- current public record.

**ARCHIVE**

- Notebook;
- old tape;
- settled contracts;
- old claims;
- realised cases.

Never render the same paragraph simultaneously in scene, field note and Notebook.

---

# 19. Asset naming and consistency

Recommended stable naming:

- `char_aspen_full_v01`
- `char_aspen_half_v01`
- `loc_aspen_berth_wide_v01`
- `prop_aspen_watch_v01`
- `panel_sunmoment_harbour_wide_v01`
- `prop_claim_juan_sterling_v01`

Do not encode temporary emotional labels like `happy`, `sad`, `angry` into the core asset taxonomy unless a final scene truly requires a unique drawing.

---

# 20. Art acceptance checklist

Reject an asset if any of these are true:

- first impression is anime/manhwa rather than printed narrative comic;
- face has large sparkling eyes or beauty-filter anatomy;
- character is noticeably younger/prettier than specification;
- hair is glossy and rendered strand-by-strand;
- skin uses soft airbrush gradients;
- lighting is more prominent than line/colour composition;
- body is fashion-model idealised without character reason;
- animal becomes mascot/cute;
- environment has generic decorative clutter instead of economic/social function;
- scene could belong to any fantasy/indie game without Sunflower's objects/institutions;
- comic panel explains emotion with melodramatic pose instead of situation;
- UI shows all systems simultaneously;
- consequential narrative is delivered mainly through prose rather than panels/objects/action.

Accept only when the picture feels **drawn, printed, socially specific, materially useful and slightly unflattering in the productive sense**.
