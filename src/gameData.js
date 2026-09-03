export const SARDINE = "🥫";
export const MAX_DAYS = 14; // Prototype pacing cap, not a final cosmological rule.
export const MORNING_ACTIONS = 2;
export const AFTERNOON_ACTIONS = 2;
export const SUSTENANCE_PER_DAY = 1;
export const PROXY_FEE = 2;
export const INFO_BASE_PRICE = 2;

// `value` is a public/reference price for first-pass arithmetic, never intrinsic value.
// Private utility, urgency, liquidity, provenance, information and relationships move actual willingness to trade.
export const ITEMS = {
  "Blue Glass Marble": { value: 12, icon: "🔵", type: "Scarce Curio / Access / Story" },
  "Dead Pigeon": { value: 6, icon: "🐦", type: "Catalyst / Scavenged / Oddity" },
  "Collar Tag": { value: 9, icon: "🏷️", type: "Access / Identity / Story" },
  "Chewed Rope Toy": { value: 2, icon: "🧸", type: "Junk / Scavenged / Animal-network" },
  "Fresh Mackerel": { value: 7, icon: "🐟", type: "Food / Commodity", foodUnits: 1, shelfLife: 2 },
  "Smoked Eel": { value: 8, icon: "🐍", type: "Food / Commodity", foodUnits: 1, shelfLife: 5 },
  "Sea Lettuce Bundle": { value: 5, icon: "🥬", type: "Food / Ingredient", foodUnits: 1, shelfLife: 2 },
  "Two Octopus Tentacles": { value: 9, icon: "🐙", type: "Food / Fish-stall Oddity", foodUnits: 1, shelfLife: 2 },
  "Ice Block": { value: 5, icon: "🧊", type: "Cold-chain Input / Bar Input", shelfLife: 1 },
  "Orgeat Bottle": { value: 14, icon: "🥛", type: "Cocktail Ingredient / Scarce" },
  "Orange Curaçao": { value: 12, icon: "🍊", type: "Cocktail Ingredient" },
  "Demerara Syrup": { value: 5, icon: "🟤", type: "Cocktail Ingredient" },
  "Hotel Sugar Cubes, 23 Count": { value: 4, icon: "🍬", type: "Ingredient / Scavenged Hospitality Good" },
  "Steel Rim": { value: 12, icon: "⭕", type: "Machine Part / Durable" },
  "Three Metres of Stolen Theatre Wire": { value: 9, icon: "🔌", type: "Repair Input / Dubious Provenance / Story" },
  "Patch Cut from the Ship Mercy": { value: 8, icon: "🧵", type: "Repair Input / Provenance / Story" },
  "Rusty Harpoon": { value: 14, icon: "🗡️", type: "Tool / Risky Asset / Harbour" },
  "Sperm Whale Oil": { value: 18, icon: "🛢️", type: "Fuel / Obsolete Input / Scarce" },
  "Salted Cod": { value: 8, icon: "🐡", type: "Food / Commodity / Durable", foodUnits: 1, shelfLife: 7 },
  "Hardtack Tin": { value: 4, icon: "🍞", type: "Food / Durable", foodUnits: 1 },
  "Brass Compass": { value: 16, icon: "🧭", type: "Durable / Collateral / Sailor" },
  "Sealed Parcel": { value: 20, icon: "📦", type: "Mystery / Special Situation / Information-bearing" },

  "Presta Inner Tube": { value: 8, icon: "🚲", type: "Bicycle Part / Consumable Repair" },
  "Chain Quick-Link": { value: 6, icon: "🔗", type: "Bicycle Part / Repair" },
  "Brake Cable": { value: 7, icon: "🪢", type: "Bicycle Part / Repair" },
  "Handlebar Tape": { value: 5, icon: "🎗️", type: "Bicycle Part / Cosmetic-Functional" },
  "Tiny Torque Wrench": { value: 18, icon: "🔧", type: "Bicycle Tool / Durable / Collateral" },
  "Bicycle Bell": { value: 4, icon: "🔔", type: "Bicycle Part / Scavenged" },

  "Valentino Still": { value: 18, icon: "🎞️", type: "Prestige / Collectible" },
  "Film Canister": { value: 14, icon: "🎥", type: "Prestige / Film Input" },
  "Hand Mirror": { value: 9, icon: "🪞", type: "Prestige / Durable" },
  "Velvet Sleeve": { value: 7, icon: "🧤", type: "Prestige / Fashion" },
  "Bent Silver Fork": { value: 10, icon: "🍴", type: "Collateral / Silver / Story" },
  "One White Glove": { value: 13, icon: "🧤", type: "Prestige / Story Fragment / Collectible" },
  "Numbered Funeral Ticket": { value: 20, icon: "🎫", type: "Collectible / Event-linked / Story" },
  "Taxidermied Moth": { value: 22, icon: "🦋", type: "Collectible / Illiquid / Story" },
  "Unsent Letter": { value: 5, icon: "✉️", type: "Sentimental / Information-bearing / Story" },
  "Auction Onewheel": { value: 28, icon: "🛞", type: "Vehicle / Auction Lot" },

  "Lollipop": { value: 2, icon: "🍭", type: "Treat / Liquid" },
  "Glitter Tape": { value: 4, icon: "✨", type: "Speculative Junk / Cosmetic" },
  "Tool Roll": { value: 10, icon: "🧰", type: "Tool / Repair / Durable" },
  "Lucky Sticker": { value: 2, icon: "⭐", type: "Speculative Junk / Story" },
  "Wax Candle Stub": { value: 2, icon: "🕯️", type: "Fuel / Scavenged" },
  "Key That Opens Nothing": { value: 3, icon: "🗝️", type: "Speculative Junk / Story / Collectible" },

  "Red Ribbon": { value: 3, icon: "🎀", type: "Social / Scavenged / Animal-network" },
  "Empty Green Bottle": { value: 2, icon: "🍾", type: "Container / Reusable / Scavenged" },
  "Glasses Wipe": { value: 2, icon: "👓", type: "Tiny Utility / Scavenged / Animal-network" },
  "Chia Seeds": { value: 4, icon: "🌱", type: "Dry Food / Seed / Animal-network", foodUnits: 1 },

  "Rum Bottle": { value: 10, icon: "🥃", type: "Drink / Cocktail Ingredient" },
  "Bruised Mint": { value: 3, icon: "🌿", type: "Cocktail Ingredient", shelfLife: 2 },
  "Cracked Shaker": { value: 5, icon: "🥤", type: "Bar Tool / Damaged" },
  "Hawthorne Strainer": { value: 9, icon: "🌀", type: "Bar Tool / Durable" },
  "30/45 Jigger": { value: 9, icon: "🥃", type: "Bar Tool / Durable" },
  "Long Bar Spoon": { value: 7, icon: "🥄", type: "Bar Tool / Durable" },
  "Fine Mesh Strainer": { value: 8, icon: "🫖", type: "Bar Tool / Durable" },
  "Hand Citrus Press": { value: 11, icon: "🍋", type: "Bar Tool / Durable" },
  "Lewis Bag": { value: 7, icon: "🧺", type: "Bar Tool / Ice Preparation" },
  "Chipped Nick & Nora Glass": { value: 6, icon: "🍸", type: "Barware / Social / Story" },
  "Lime Crate": { value: 8, icon: "🍋", type: "Cocktail Ingredient / Citrus / Perishable Input", shelfLife: 4 },
  "Mai Tai": { value: 18, icon: "🍹", type: "Drink / Cocktail / Social" },

  "Bad Tangerine": { value: 2, icon: "🍊", type: "Toxic / Misrepresentation / Food-like" },
  "Old Coupon": { value: 4, icon: "🎟️", type: "Claim / Dubious / Information-bearing" },
  "Pocket Match": { value: 2, icon: "🔥", type: "Tiny Utility / Scavenged" },
  "Fish Bones": { value: 3, icon: "🦴", type: "Junk / Animal-network / Scavenged" },
  "Built Onewheel": { value: 30, icon: "🛞", type: "Vehicle / Durable / Speculative" },
  "Spoiled Fish": { value: 1, icon: "🐟", type: "Waste / Scavenged" },
  Sunflower: { value: null, icon: "🌻", type: "Goal / Living / Unpriced" },
};

export const INITIAL_TRADERS = {
  dog: {
    id: "dog", name: "Dock Dog", icon: "🐕", role: "Scavenger dealer / harbour gossip", form: "animal", sardines: 18,
    inventory: ["Blue Glass Marble", "Dead Pigeon", "Collar Tag", "Chewed Rope Toy", "Red Ribbon", "Glasses Wipe", "Bicycle Bell", "Pocket Match"],
  },
  fishmonger: {
    id: "fishmonger", name: "Fishmonger", icon: "🐠", role: "Fish producer / steady operator", form: "human", sardines: 30,
    inventory: ["Fresh Mackerel", "Smoked Eel", "Ice Block", "Two Octopus Tentacles", "Orgeat Bottle", "Steel Rim", "Rusty Harpoon", "Hawthorne Strainer"],
  },
  mechanic: {
    id: "mechanic", name: "Sailor", icon: "⚙️", role: "Travelling merchant / repair-capable sailor", form: "sailor", sardines: 26,
    inventory: ["Sperm Whale Oil", "Salted Cod", "Hardtack Tin", "Brass Compass", "Sealed Parcel", "Three Metres of Stolen Theatre Wire", "Patch Cut from the Ship Mercy", "Presta Inner Tube", "Chain Quick-Link", "Brake Cable", "Tiny Torque Wrench", "30/45 Jigger", "Fine Mesh Strainer"],
  },
  vale: {
    id: "vale", name: "Mirelle Vale", icon: "🎬", role: "Auctioneer / capital allocator", form: "human", sardines: 52,
    inventory: ["Valentino Still", "Film Canister", "Hand Mirror", "Velvet Sleeve", "Bent Silver Fork", "One White Glove", "Numbered Funeral Ticket", "Taxidermied Moth", "Unsent Letter"],
  },
  clown: {
    id: "clown", name: "Onewheel Clown", icon: "🤡", role: "Speculator / racer", form: "human", sardines: 22,
    inventory: ["Lollipop", "Glitter Tape", "Tool Roll", "Lucky Sticker", "Wax Candle Stub", "Handlebar Tape", "Key That Opens Nothing"],
  },
  bar: {
    id: "bar", name: "Bar Apprentice", icon: "🍸", role: "Relationship trader / novice bartender", form: "human", sardines: 34,
    inventory: ["Rum Bottle", "Bruised Mint", "Cracked Shaker", "Lime Crate", "Orange Curaçao", "Demerara Syrup", "Hotel Sugar Cubes, 23 Count", "Empty Green Bottle", "Long Bar Spoon", "Hand Citrus Press", "Lewis Bag", "Chipped Nick & Nora Glass"],
  },
  player: {
    id: "player", name: "You", icon: "🧍", role: "Outsider", form: "human", sardines: 18,
    inventory: ["Fish Bones", "Bad Tangerine", "Chia Seeds", "Old Coupon"],
  },
};

const TALK = {
  dog: [
    { text: "Dog complains about gulls, names two people you did not ask about, and finally answers the question. The cats keep interrupting." },
    { text: "Dog stops treating you like a passer-by. He tells you which alley is safe for animals after dark, then pretends that was obvious.", info: { claimType: "social", precision: "context", confidence: "medium", text: "Dog moves easily between the harbour, the Bar and informal animal routes." } },
    { text: "Dog lowers his voice when wealthy people come up. He seems comfortable letting you hear things before he knows what they are worth." },
  ],
  fishmonger: [
    { text: "Fishmonger keeps cleaning the counter while you talk. The conversation stays practical, but you are no longer just another face in the queue." },
    { text: "Fishmonger remembers what you asked last time. He still does not volunteer business secrets, but he stops wasting time deciding whether to answer you." },
    { text: "Fishmonger talks while working, which seems to be his version of hospitality." },
  ],
  mechanic: [
    { text: "The Sailor talks in fragments between jobs: weather, a broken fitting, departure, somebody who still owes somebody else. You catch more rhythm than detail." },
    { text: "The Sailor now assumes you understand enough harbour shorthand to skip the polite explanations.", info: { claimType: "deadline", precision: "context", confidence: "high", text: "The Sailor treats departure as a hard constraint; unfinished provisioning will become more expensive as the ship gets closer to leaving." } },
    { text: "The Sailor gives you the kind of answer reserved for somebody expected to still be here tomorrow." },
  ],
  vale: [
    { text: "Vale asks you more questions than she answers. Somehow the exchange still ends with the sense that she has filed you under a more specific category." },
    { text: "Vale remembers your previous conversation exactly. She does not become warmer; she becomes more precise.", info: { claimType: "social", precision: "context", confidence: "high", text: "Vale can be unpleasant and still be one of the harbour's most reliable formal counterparties." } },
    { text: "Vale lets a pause run long enough that you realise she is waiting to see what you reveal without being asked." },
  ],
  clown: [
    { text: "Clown changes subjects three times and still manages to answer you. He seems delighted you came back voluntarily." },
    { text: "Clown talks about the cliff as though it were not merely a place to race. When you ask what he means, he laughs at a different joke.", info: { claimType: "lead", precision: "context", confidence: "low", text: "Clown believes the cliff matters for reasons beyond the wager itself." } },
    { text: "Clown trusts you enough to be inconsistent in front of you without trying to make it look intentional." },
  ],
  bar: [
    { text: "The Apprentice talks while wiping the same glass for too long. The conversation is slightly awkward and noticeably genuine." },
    { text: "The Apprentice mentions closing early sometimes to visit Grandma. Apparently she still cares far more about real food than the price of it.", info: { claimType: "lead", precision: "context", confidence: "high", text: "The Apprentice visits Grandma after closing; fresh food matters there more than its market price." } },
    { text: "The Apprentice asks you a question back. You are becoming a regular rather than a transaction." },
  ],
};

export const NPC_PROFILES = {
  dog: {
    style: "High-turnover dealer", markup: 1, cashPreference: 0.35, informationTempo: 1,
    publicStock: ["Chewed Rope Toy", "Glasses Wipe", "Bicycle Bell", "Pocket Match"],
    interests: [
      { typeIncludes: "Scavenged", utility: 3 }, { typeIncludes: "Animal-network", utility: 4 },
      { typeIncludes: "Tiny Utility", utility: 2 }, { typeIncludes: "Container", utility: 2 },
    ],
    goals: [
      { item: "Fresh Mackerel", utility: 9, likelySources: ["fishmonger", "bar"], reason: "Fresh fish disappears quickly around the cats." },
      { item: "Fish Bones", utility: 6, likelySources: ["fishmonger", "mechanic"], reason: "Even scraps have a use at the dock." },
    ],
    talkStages: TALK.dog,
    investigationStages: [
      { claimType: "activity", precision: "context", text: "Dog crosses the docks, the bar alley and animal routes before noon. Much of his edge is knowing who might know someone.", confidence: "high" },
      { claimType: "need", precision: "category", text: "The cat colony is eating through fresh food quickly enough that Dog keeps checking the fish stalls.", confidence: "high" },
    ],
    clue: "Dog sees a lot of the harbour, but does not always know what the information is worth.",
    business: {
      arrivals: ["Empty Green Bottle", "Wax Candle Stub", "Red Ribbon", "Dead Pigeon", "Glasses Wipe", "Bicycle Bell", "Chia Seeds", "Pocket Match"],
      arrivalCostRate: 0,
      consumeAny: ["Fresh Mackerel", "Smoked Eel", "Two Octopus Tentacles", "Salted Cod"],
      consumeText: "disappears into the cat colony by sunset",
    },
  },
  fishmonger: {
    style: "Conservative operator", markup: 2, cashPreference: 0.7, informationTempo: 3,
    publicStock: ["Fresh Mackerel", "Smoked Eel", "Two Octopus Tentacles", "Ice Block"],
    interests: [
      { typeIncludes: "Food / Commodity", utility: 3 }, { typeIncludes: "Cold-chain", utility: 4 }, { typeIncludes: "Harbour", utility: 2 },
    ],
    goals: [{ item: "Dead Pigeon", utility: 10, likelySources: ["dog", "mechanic"], reason: "The fish stall has a strange standing use for it." }],
    talkStages: TALK.fishmonger,
    investigationStages: [
      { claimType: "activity", precision: "context", text: "Most things at the fish stall are exactly what they look like. The strange non-fish goods usually arrived through barter, debt or a misdelivered crate.", confidence: "high" },
      { claimType: "holding-hint", precision: "category", text: "A sealed restaurant-supply bottle is being kept below the fish counter rather than displayed with the catch.", confidence: "high" },
      { claimType: "holding", precision: "exact", item: "Orgeat Bottle", text: "Fishmonger has an Orgeat Bottle under the counter.", confidence: "high", sellable: true, exclusive: true },
    ],
    clue: "Fishmonger understands fish far better than fashionable assets and rarely changes business just because another trade looks exciting.",
    business: {
      arrivals: ["Fresh Mackerel", "Ice Block", "Smoked Eel", "Sea Lettuce Bundle", "Two Octopus Tentacles"],
      arrivalCostRate: 0.45,
      outsideSaleAny: ["Fresh Mackerel", "Smoked Eel", "Two Octopus Tentacles", "Sea Lettuce Bundle"],
      outsideSaleRate: 0.75,
    },
  },
  mechanic: {
    style: "Deadline merchant", markup: 2, cashPreference: 0.55, informationTempo: 2, departureDay: 8,
    publicStock: ["Hardtack Tin", "Salted Cod", "Brake Cable", "Chain Quick-Link"],
    interests: [
      { typeIncludes: "Bicycle", utility: 6 }, { typeIncludes: "Repair", utility: 5 },
      { typeIncludes: "Tool", utility: 4 }, { typeIncludes: "Durable", utility: 3 },
    ],
    goals: [{ item: "Lime Crate", utility: 16, urgencyPerDay: 2, likelySources: ["bar", "fishmonger", "dog"], reason: "The ship must provision fresh citrus before departure." }],
    talkStages: TALK.mechanic,
    investigationStages: [
      { claimType: "activity", precision: "context", text: "Sailor is unloading only the cargo he intends to sell openly. The rest stays below deck, and departure is getting closer.", confidence: "high" },
      { claimType: "holding-hint", precision: "category", text: "One undeclared cargo lot smells oily and medicinal. Vale's people have already looked toward the ship twice.", confidence: "medium" },
      { claimType: "holding", precision: "exact", item: "Sperm Whale Oil", text: "Sailor has Sperm Whale Oil below deck.", confidence: "high", sellable: true, exclusive: true },
    ],
    clue: "The Sailor is leaving. A need that can wait today may become very expensive tomorrow.",
    business: {
      arrivals: ["Sealed Parcel", "Three Metres of Stolen Theatre Wire", "Patch Cut from the Ship Mercy", "Presta Inner Tube", "Chain Quick-Link", "Brake Cable", "Tiny Torque Wrench", "30/45 Jigger", "Fine Mesh Strainer"],
      arrivalCostRate: 0.55,
      stopsAtDeparture: true,
    },
  },
  vale: {
    style: "Sophisticated opportunist", markup: 5, cashPreference: 0.45, informationTempo: 1,
    publicStock: ["Velvet Sleeve", "Film Canister"],
    interests: [
      { typeIncludes: "Prestige", utility: 7 }, { typeIncludes: "Collectible", utility: 8 },
      { typeIncludes: "Story", utility: 6 }, { typeIncludes: "Information-bearing", utility: 5 },
      { typeIncludes: "Scarce Curio", utility: 7 }, { typeIncludes: "Mystery", utility: 6 },
    ],
    goals: [
      { item: "Sperm Whale Oil", utility: 22, likelySources: ["mechanic", "fishmonger", "dog"], reason: "A private screening needs an obsolete fuel." },
      { item: "Sealed Parcel", utility: 12, likelySources: ["mechanic", "dog"], reason: "Vale likes situations where provenance can be priced before contents are understood." },
      { item: "Blue Glass Marble", utility: 10, likelySources: ["dog", "fishmonger"], reason: "Vale notices objects with story and scarcity." },
    ],
    talkStages: TALK.vale,
    investigationStages: [
      { claimType: "activity", precision: "context", text: "Vale is preparing a private screening and quietly contacting people who deal in obsolete projection equipment and fuel.", confidence: "high" },
      { claimType: "need", precision: "exact", item: "Sperm Whale Oil", text: "Vale's screening specifically needs Sperm Whale Oil.", confidence: "medium" },
    ],
    clue: "Vale is manipulative, but settlement reliability is excellent. She is usually happy to let the other person reveal urgency first.",
  },
  clown: {
    style: "High-risk speculator", markup: -2, cashPreference: 0.15, informationTempo: 2,
    publicStock: ["Lollipop", "Handlebar Tape", "Key That Opens Nothing"],
    interests: [
      { typeIncludes: "Speculative", utility: 8 }, { typeIncludes: "Vehicle", utility: 9 },
      { typeIncludes: "Bicycle", utility: 5 }, { typeIncludes: "Mystery", utility: 7 }, { typeIncludes: "Story", utility: 4 },
    ],
    goals: [
      { item: "Mai Tai", utility: 20, likelySources: ["bar"], reason: "Clown will pay irrational-looking prices for the right drink and the right night." },
      { item: "Built Onewheel", utility: 20, likelySources: ["mechanic", "vale"], reason: "A working onewheel creates wagers other people cannot take." },
      { item: "Sealed Parcel", utility: 14, likelySources: ["mechanic", "dog"], reason: "An opaque payoff distribution is exactly the sort of thing Clown cannot leave alone." },
    ],
    talkStages: TALK.clown,
    investigationStages: [
      { claimType: "activity", precision: "context", text: "Clown keeps asking whether the Apprentice has finally learned the old rum drink properly, then changes the subject to wheels.", confidence: "high" },
      { claimType: "need", precision: "exact", item: "Mai Tai", text: "Clown is specifically waiting for a proper Mai Tai.", confidence: "high" },
    ],
    clue: "Clown is not random. He simply values upside and extreme outcomes more than most people do.",
  },
  bar: {
    style: "Relationship-first novice", markup: 1, cashPreference: 0.25, informationTempo: 3,
    publicStock: ["Rum Bottle", "Bruised Mint", "Orange Curaçao", "Demerara Syrup", "Hotel Sugar Cubes, 23 Count"],
    interests: [
      { typeIncludes: "Cocktail Ingredient", utility: 6 }, { typeIncludes: "Bar Tool", utility: 7 },
      { typeIncludes: "Barware", utility: 5 }, { typeIncludes: "Container", utility: 2 },
    ],
    goals: [
      { item: "Orgeat Bottle", utility: 20, likelySources: ["fishmonger", "mechanic", "dog"], reason: "The Apprentice is trying to learn a proper Mai Tai but one ingredient is missing." },
      { item: "Ice Block", utility: 8, likelySources: ["fishmonger", "mechanic"], reason: "Cold drinks are a recurring operating input, not a one-time quest." },
      { item: "Hawthorne Strainer", utility: 8, likelySources: ["fishmonger", "mechanic"], reason: "The Apprentice is replacing damaged service tools while learning professional technique." },
      { item: "30/45 Jigger", utility: 7, likelySources: ["mechanic", "fishmonger"], reason: "Accurate measures matter when the Apprentice stops free-pouring everything." },
      { item: "Fine Mesh Strainer", utility: 6, likelySources: ["mechanic", "fishmonger"], reason: "A finer strain is a technique upgrade, not a route requirement." },
    ],
    talkStages: TALK.bar,
    investigationStages: [
      { claimType: "activity", precision: "context", text: "The Apprentice is learning to make a Mai Tai. The recipe keeps stalling because one ingredient is missing.", confidence: "high" },
      { claimType: "need-hint", precision: "specific", text: "Rum, fresh lime and orange curaçao are already behind the bar. Whatever is missing is not one of those.", confidence: "high" },
      { claimType: "need", precision: "exact", item: "Orgeat Bottle", text: "If you press further, the missing Mai Tai ingredient is orgeat.", confidence: "high" },
    ],
    clue: "The Apprentice is not a strong trader yet. People still like dealing with them, which is an economic advantage of its own.",
    business: {
      consume: ["Ice Block"],
      serviceRevenueBase: 2,
      serviceRevenueWithIce: 5,
    },
  },
};

export const SOCIAL_GRAPH = {
  dog: {
    fishmonger: { familiarity: 1, trust: 0, channel: "harbour" }, mechanic: { familiarity: 1, trust: 0, channel: "dock" },
    vale: { familiarity: 1, trust: -1, channel: "street-to-elite" }, clown: { familiarity: 1, trust: 0, channel: "bar" },
    bar: { familiarity: 2, trust: 1, channel: "animal-friendly bar" }, seagulls: { familiarity: 2, trust: 0, channel: "animal informal network" },
    squirrels: { familiarity: 2, trust: 0, channel: "animal informal network" }, mosquitoes: { familiarity: 1, trust: 0, channel: "animal informal network" },
  },
  vale: { mechanic: { familiarity: 3, trust: 2, channel: "repeat private trade" }, dog: { familiarity: 1, trust: -1, channel: "informal information" } },
  mechanic: { vale: { familiarity: 3, trust: 2, channel: "repeat private trade" }, dog: { familiarity: 1, trust: 1, channel: "dock" } },
  clown: { bar: { familiarity: 3, trust: 2, channel: "regular customer" } },
  bar: { clown: { familiarity: 3, trust: 1, channel: "regular customer" }, dog: { familiarity: 2, trust: 2, channel: "animal-friendly bar" } },
  fishmonger: { dog: { familiarity: 1, trust: 0, channel: "ordinary market" } },
};

export const FORMS = {
  human: { id: "human", icon: "🧍", label: "Human", formalPersonhood: true, note: "Strong institutional access; identity and ownership are formally legible." },
  animal: { id: "animal", icon: "🐾", label: "Animal", formalPersonhood: false, note: "Informal networks remain available, but many human institutions refuse direct recognition." },
  sailor: { id: "sailor", icon: "⚓", label: "Sailor", formalPersonhood: true, note: "A provisional liminal form: mobile and cross-boundary, but not necessarily liberated." },
  plant: { id: "plant", icon: "🌱", label: "Plant", formalPersonhood: false, note: "Future experimental form. Agency and value would work very differently." },
};

export const VENUES = {
  bar: { name: "The Bar", allowedForms: ["human", "animal", "sailor"], requiresLegalIdentity: false, proxyable: false, note: "Currently the only confirmed human venue that openly allows animal people inside." },
  formalMarket: { name: "Public Market", allowedForms: ["human", "sailor"], requiresLegalIdentity: true, proxyable: true, note: "Animal traders may need a recognised proxy rather than direct institutional access." },
  valeGallery: { name: "Vale's Auction Rooms", allowedForms: ["human", "sailor"], requiresLegalIdentity: true, proxyable: true, note: "Elite formal access. Recognition and invitation matter as much as cash." },
  blackMarket: { name: "Cross-form Informal Network", allowedForms: ["human", "animal", "sailor"], requiresLegalIdentity: false, proxyable: false, note: "Not one evil shop: an intermediary network between excluded animal society and formal human markets." },
};

export const PLAYER_CONTEXT = {
  startingForm: "human",
  startingLegalIdentity: "recognized",
  communication: "limited-local-speech",
  canUnderstandSomeLocalLanguage: true,
  canSpeakFluently: false,
  channels: ["translation", "writing", "gesture", "structured offers", "demonstrated reliability"],
  note: "The player enters the harbour as a formally recognised outsider. Their deeper continuity/origin is intentionally not explained at the start.",
};

export const PHASES = ["sunrise", "morning", "noon", "afternoon", "sunset"];
export const PHASE_COPY = {
  sunrise: { icon: "🌅", title: "Sunrise", subtitle: "The harbour stops. The day has not begun trading yet." },
  morning: { icon: "☀️", title: "Morning", subtitle: "Gather information, build relationships and prepare for the noon market." },
  noon: { icon: "🌞", title: "Noon Market", subtitle: "The public market opens once. Goods and sardines actually change hands now." },
  afternoon: { icon: "🌤️", title: "Afternoon", subtitle: "Interpret the tape, investigate what happened and position for tomorrow." },
  sunset: { icon: "🌇", title: "Sunset", subtitle: "The harbour stops again. Obligations, perishables and memory settle into the next day." },
};
