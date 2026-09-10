---
name: sunflower-player-interface
description: Implement and browser-test Sunflower player interactions, dialogue, continuous-map staging, and character assets while preserving the existing simulation.
---

# Sunflower player interface

Continue the current worktree and branch. Preserve uncommitted work. The accepted architecture is `src/HarbourMap.jsx` inside `src/AppCore.jsx`: one pan/zoom map, shared map/comic figures, edge phone/newspaper, bottom object strip, and a collapsed pocketbook. Do not restore location pages, tabs, card grids, contact encyclopedias, action-button forests, or a player home/workbench. Scene Lab is development-only.

Read the current user direction before older art/canon prose. Approved cast: Joel is a dark-skinned Black man and tallest; Juan is the older braided man and shortest; Aspen wears cream florals; Yasmin wears black and gold; Dima is human, with a navy tracksuit and purple sunglasses. Wong is a whippet; Sonya is the supporting penguin grandmother, never a normal contact. Preserve approved identities. Dima's linework/colour is a finish reference, not permission to redesign others.

## Interaction and information

- People appear once, at their actual actor location. Encounter capacity, knowledge and decisions belong to the existing relational scheduler. Per-location figure scale and destination appearance are acceptable; decorative duplicate named actors are not.
- A meaningful successful intervention advances the shared clock once. Reading, looking, failed actions and duplicate execution do not. Intra-day clearing, spoilage and due payments may run as time crosses their thresholds; never repeat daily production or settlement wholesale.
- Use authored `dialogueContent.js`, `presentationCopy.js` and `worldLifeContent.js`; choose dialogue from actual location, co-presence, acquaintance, obligations and recent events. Do not reveal unobserved plans, valuations or route requirements.
- Show one short spoken line at a time. Meaningful responses follow as understated text. Close a completed conversation with no choices. Comics share world assets, keep prior panels readable and block underlying controls.
- Teach each unfamiliar transaction at the moment it matters: what leaves the player's hand, what they receive, when, and what can go wrong. Explain before commitment. No opening tutorial wall or unexplained financial terms.
- Contacts require a credible contact event. Unknown identities must remain unknown in labels, dialogue, phone, newspaper and notes.
- An exhausted-time action offers tomorrow or continued looking. Do not silently fail or automatically skip unread consequences.

## Presentation

The harbour is a dense illustrated tableau, not a neat architectural room grid. Depth comes from overlap, scale and cropping. Use flat colour, necessary contours and ordinary bodies; no gradients, gloss, 3D lighting, hatching or repeated microtexture. Match background and figure detail at playable zoom. Most ambient objects are noninteractive. Interactive props must have a current meaningful consequence, with placement making their purpose visible.

No final-art dependency: finish and test the interaction with working assets, clearly recording remaining visual gaps. Crop figures without neighbouring silhouettes; preserve Joel/ Juan height ordering. Do not publish reference images as game assets.

Incidental people must not reuse main-cast faces. The user requests culturally varied harbour neighbours, including Hasidic/Sephardic Jewish, Amazigh/Berber, Jamaican, Indian and Ethiopian people, with varied skin tones, age, build, hair and everyday clothing/head coverings. Dima defines their graphic finish, not their identities. Preserve ordinary social staging rather than a costume lineup.

## Verification

After each meaningful slice, run the app and use real browser input. Test desktop and 390×844 CSS pixels, inspecting screenshots locally. Never commit screenshots. Engine-method tests alone do not prove reachable UI.

Current runnable checks:

```sh
node scripts/harbour-interface-check.mjs
npm run test:production
npm run build
# With Vite serving on port 5174:
npm run test:browser
git diff --check
```

Browser proof must distinguish tested routes from outstanding ones. Cover first discovery, dialogue completion, object use, buying and held cash, actor departure, phone/newspaper, comics, next day and reflection. Keep conservation and Scars evidence in the engine; render concrete experiences to the player. Update existing verification/art documents with actual results, not intended acceptance.
