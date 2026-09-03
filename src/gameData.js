export const SARDINE = "🥫";
export const MAX_DAYS = 14; // Prototype pacing cap, not a final cosmological rule.
export const MORNING_ACTIONS = 2;
export const AFTERNOON_ACTIONS = 2;
export const SUSTENANCE_PER_DAY = 1;
export const PROXY_FEE = 1;

// `value` is a provisional reference price, NOT intrinsic value.
// The current price scale is intentionally still under audit.
// `foodUnits` can satisfy nightly sustenance. `shelfLife` is measured in sunsets.
export const ITEMS = {
  "Blue Glass Marble": { value: 3, icon: "🔵", type: "Scarce Curio / Access" },
  "Dead Pigeon": { value: 3, icon: "🐦", type: "Catalyst / Scavenged" },
  "Collar Tag": { value: 3, icon: "🏷️", type: "Access / Identity" },
  "Chewed Rope Toy": { value: 1, icon: "🧸", type: "Junk / Liquid" },
  "Fresh Mackerel": { value: 4, icon: "🐟", type: "Food / Commodity", foodUnits: 1, shelfLife: 2 },
  "Smoked Eel": { value: 3, icon: "🐍", type: "Food / Commodity", foodUnits: 1, shelfLife: 5 },
  "Sea Lettuce Bundle": { value: 2, icon: "🥬", type: "Food / Ingredient", foodUnits: 1, shelfLife: 2 },
  "Two Octopus Tentacles": { value: 4, icon: "🐙", type: "Food / Fish-stall Oddity", foodUnits: 1, shelfLife: 2 },
  "Ice Block": { value: 2, icon: "🧊", type: "Cold-chain Input", shelfLife: 1 },
  "Orgeat Bottle": { value: 7, icon: "🥛", type: "Cocktail Ingredient / Scarce" },
  "Orange Curaçao": { value: 5, icon: "🍊", type: "Cocktail Ingredient" },
  "Demerara Syrup": { value: 3, icon: "🟤", type: "Cocktail Ingredient" },
  "Hotel Sugar Cubes, 23 Count": { value: 2, icon: "🍬", type: "Ingredient / Scavenged Hospitality Good" },
  "Steel Rim": { value: 5, icon: "⭕", type: "Machine Part" },
  "Three Metres of Stolen Theatre Wire": { value: 4, icon: "🔌", type: "Repair Input / Dubious Provenance" },
  "Patch Cut from the Ship Mercy": { value: 3, icon: "🧵", type: "Repair Input / Provenance" },
  "Rusty Harpoon": { value: 6, icon: "🗡️", type: "Tool / Risky Asset" },
  "Sperm Whale Oil": { value: 6, icon: "🛢️", type: "Fuel / Obsolete Input" },
  "Salted Cod": { value: 4, icon: "🐡", type: "Food / Commodity", foodUnits: 1, shelfLife: 7 },
  "Hardtack Tin": { value: 2, icon: "🍞", type: "Food / Durable", foodUnits: 1 },
  "Brass Compass": { value: 5, icon: "🧭", type: "Durable / Collateral" },
  "Sealed Parcel": { value: 5, icon: "📦", type: "Mystery / Special Situation" },

  // Bicycle / mechanical goods. These are ordinary market goods first, route ingredients only when a rule says so.
  "Presta Inner Tube": { value: 4, icon: "🚲", type: "Bicycle Part / Consumable Repair" },
  "Chain Quick-Link": { value: 3, icon: "🔗", type: "Bicycle Part / Repair" },
  "Brake Cable": { value: 3, icon: "🪢", type: "Bicycle Part / Repair" },
  "Handlebar Tape": { value: 2, icon: "🎗️", type: "Bicycle Part / Cosmetic-Functional" },
  "Tiny Torque Wrench": { value: 6, icon: "🔧", type: "Bicycle Tool / Durable" },
  "Bicycle Bell": { value: 2, icon: "🔔", type: "Bicycle Part / Scavenged" },

  // Vale / prestige / story-bearing goods.
  "Valentino Still": { value: 5, icon: "🎞️", type: "Prestige" },
  "Film Canister": { value: 4, icon: "🎥", type: "Prestige / Input" },
  "Hand Mirror": { value: 3, icon: "🪞", type: "Prestige" },
  "Velvet Sleeve": { value: 2, icon: "🧤", type: "Liquid / Prestige" },
  "Bent Silver Fork": { value: 3, icon: "🍴", type: "Collateral / Liquid" },
  "One White Glove": { value: 4, icon: "🧤", type: "Prestige / Story Fragment" },
  "Numbered Funeral Ticket": { value: 5, icon: "🎫", type: "Collectible / Event-linked" },
  "Taxidermied Moth": { value: 6, icon: "🦋", type: "Collectible / Illiquid" },
  "Unsent Letter": { value: 1, icon: "✉️", type: "Sentimental / Information-bearing" },

  "Auction Sunflower": { value: 16, icon: "🌻", type: "Auction Goal" },
  "Auction Onewheel": { value: 8, icon: "🛞", type: "Vehicle" },

  // Clown / speculative junk / everyday-surreal goods.
  "Lollipop": { value: 1, icon: "🍭", type: "Treat / Liquid" },
  "Glitter Tape": { value: 2, icon: "✨", type: "Speculative Junk" },
  "Tool Roll": { value: 3, icon: "🧰", type: "Tool" },
  "Lucky Sticker": { value: 1, icon: "⭐", type: "Speculative Junk" },
  "Wax Candle Stub": { value: 1, icon: "🕯️", type: "Fuel / Scavenged" },
  "Key That Opens Nothing": { value: 2, icon: "🗝️", type: "Speculative Junk / Story" },

  // Dog / animal-network / low-value daily oddities.
  "Red Ribbon": { value: 2, icon: "🎀", type: "Social / Scavenged" },
  "Empty Green Bottle": { value: 1, icon: "🍾", type: "Container / Reusable" },
  "Glasses Wipe": { value: 1, icon: "👓", type: "Tiny Utility / Scavenged" },
  "Chia Seeds": { value: 2, icon: "🌱", type: "Dry Food / Seed / Animal-network Good", foodUnits: 1 },

  // Professional bar goods. Many are durable tools, not magical quest keys.
  "Rum Bottle": { value: 4, icon: "🥃", type: "Drink / Cocktail Ingredient" },
  "Bruised Mint": { value: 1, icon: "🌿", type: "Cocktail Ingredient", shelfLife: 2 },
  "Cracked Shaker": { value: 2, icon: "🥤", type: "Bar Tool / Liquid" },
  "Hawthorne Strainer": { value: 4, icon: "🌀", type: "Bar Tool / Durable" },
  "30/45 Jigger": { value: 4, icon: "🥃", type: "Bar Tool / Durable" },
  "Long Bar Spoon": { value: 3, icon: "🥄", type: "Bar Tool / Durable" },
  "Fine Mesh Strainer": { value: 3, icon: "🫖", type: "Bar Tool / Durable" },
  "Hand Citrus Press": { value: 5, icon: "🍋", type: "Bar Tool / Durable" },
  "Lewis Bag": { value: 3, icon: "🧺", type: "Bar Tool / Ice Preparation" },
  "Chipped Nick & Nora Glass": { value: 3, icon: "🍸", type: "Barware / Social" },
  "Lime Crate": { value: 4, icon: "🍋", type: "Citrus / Perishable Input", shelfLife: 4 },
  "Mai Tai": { value: 8, icon: "🍹", type: "Drink / Goal" },

  "Bad Tangerine": { value: 1, icon: "🍊", type: "Toxic / Misrepresentation" },
  "Old Coupon": { value: 2, icon: "🎟️", type: "Claim / Dubious" },
  "Pocket Match": { value: 1, icon: "🔥", type: "Liquid" },
  "Fish Bones": { value: 2, icon: "🦴", type: "Junk / Animal-network Good" },
  "Built Onewheel": { value: 8, icon: "🛞", type: "Vehicle" },
  "Spoiled Fish": { value: 1, icon: "🐟", type: "Waste" },
  Sunflower: { value: 99, icon: "🌻", type: "Goal / Living" },
};

export const INITIAL_TRADERS = {
  dog: {
    id: "dog", name: "Dock Dog", icon: "🐕", role: "Scavenger dealer / harbour gossip", form: "animal",
    sardines: 6,
    inventory: [
      "Blue Glass Marble", "Dead Pigeon", "Collar Tag", "Chewed Rope Toy",
      "Red Ribbon", "Glasses Wipe", "Bicycle Bell",
    ],
  },
  fishmonger: {
    id: "fishmonger", name: "Fishmonger", icon: "🐠", role: "Fish producer / steady operator", form: "human",
    sardines: 10,
    inventory: [
      "Fresh Mackerel", "Smoked Eel", "Ice Block", "Two Octopus Tentacles",
      "Orgeat Bottle", "Steel Rim", "Rusty Harpoon",
    ],
  },
  mechanic: {
    id: "mechanic", name: "Sailor", icon: "⚙️", role: "Travelling merchant / repair-capable sailor", form: "sailor",
    sardines: 5,
    inventory: [
      "Sperm Whale Oil", "Salted Cod", "Hardtack Tin", "Brass Compass", "Sealed Parcel",
      "Three Metres of Stolen Theatre Wire", "Patch Cut from the Ship Mercy",
      "Presta Inner Tube", "Chain Quick-Link", "Brake Cable", "Tiny Torque Wrench",
    ],
  },
  vale: {
    id: "vale", name: "Mirelle Vale", icon: "🎬", role: "Auctioneer / capital allocator", form: "human",
    sardines: 12,
    inventory: [
      "Valentino Still", "Film Canister", "Hand Mirror", "Velvet Sleeve", "Bent Silver Fork",
      "One White Glove", "Numbered Funeral Ticket", "Taxidermied Moth", "Unsent Letter",
    ],
  },
  clown: {
    id: "clown", name: "Onewheel Clown", icon: "🤡", role: "Speculator / racer", form: "human",
    sardines: 4,
    inventory: [
      "Lollipop", "Glitter Tape", "Tool Roll", "Lucky Sticker", "Wax Candle Stub",
      "Handlebar Tape", "Key That Opens Nothing",
    ],
  },
  bar: {
    id: "bar", name: "Bar Apprentice", icon: "🍸", role: "Relationship trader / novice investor", form: "human",
    sardines: 8,
    inventory: [
      "Rum Bottle", "Bruised Mint", "Cracked Shaker", "Lime Crate", "Orange Curaçao",
      "Demerara Syrup", "Hotel Sugar Cubes, 23 Count", "Empty Green Bottle",
      "Hawthorne Strainer", "30/45 Jigger", "Long Bar Spoon", "Fine Mesh Strainer",
      "Hand Citrus Press", "Lewis Bag", "Chipped Nick & Nora Glass",
    ],
  },
  player: {
    id: "player", name: "You", icon: "🧍", role: "Outsider", form: "human",
    sardines: 6,
    inventory: ["Fish Bones", "Bad Tangerine", "Chia Seeds", "Old Coupon"],
  },
};

export const NPC_PROFILES = {
  dog: {
    style: "High-turnover dealer",
    markup: 0,
    cashPreference: 0.35,
    informationTempo: 1,
    publicStock: ["Chewed Rope Toy", "Red Ribbon", "Glasses Wipe", "Bicycle Bell", "Empty Green Bottle"],
    goals: [
      { item: "Fresh Mackerel", utility: 4, likelySources: ["fishmonger", "bar"], reason: "Fresh fish disappears quickly around the cats." },
      { item: "Fish Bones", utility: 3, likelySources: ["fishmonger", "mechanic"], reason: "Even scraps have a use at the dock." },
    ],
    investigationStages: [
      {
        claimType: "activity", precision: "context",
        text: "Dog crosses the docks, the bar alley and animal routes before noon. Much of his edge is knowing who might know someone.",
        confidence: "high",
      },
      {
        claimType: "need", precision: "category",
        text: "The cat colony is eating through fresh food quickly enough that Dog keeps checking the fish stalls.",
        confidence: "high",
      },
    ],
    clue: "Dog sees a lot of the harbour, but does not always know what the information is worth.",
  },
  fishmonger: {
    style: "Conservative operator",
    markup: 1,
    cashPreference: 0.7,
    informationTempo: 3,
    publicStock: ["Fresh Mackerel", "Smoked Eel", "Two Octopus Tentacles", "Ice Block"],
    goals: [
      { item: "Dead Pigeon", utility: 4, likelySources: ["dog", "mechanic"], reason: "The fish stall has a strange standing use for it." },
    ],
    investigationStages: [
      {
        claimType: "activity", precision: "context",
        text: "Most things at the fish stall are exactly what they look like. The strange non-fish goods usually arrived through barter, debt or a misdelivered crate.",
        confidence: "high",
      },
      {
        claimType: "holding-hint", precision: "category",
        text: "A sealed restaurant-supply bottle is being kept below the fish counter rather than displayed with the catch.",
        confidence: "high",
      },
      {
        claimType: "holding", precision: "exact", item: "Orgeat Bottle",
        text: "Fishmonger has an Orgeat Bottle under the counter.",
        confidence: "high", sellable: true, exclusive: true,
      },
    ],
    clue: "Fishmonger understands fish far better than fashionable assets and rarely changes business just because another trade looks exciting.",
  },
  mechanic: {
    style: "Deadline merchant",
    markup: 0,
    cashPreference: 0.55,
    informationTempo: 2,
    departureDay: 8,
    publicStock: ["Hardtack Tin", "Salted Cod", "Brake Cable", "Chain Quick-Link"],
    goals: [
      { item: "Lime Crate", utility: 7, urgencyPerDay: 1.3, likelySources: ["bar", "fishmonger", "dog"], reason: "The ship must provision fresh citrus before departure." },
    ],
    investigationStages: [
      {
        claimType: "activity", precision: "context",
        text: "Sailor is unloading only the cargo he intends to sell openly. The rest stays below deck, and departure is getting closer.",
        confidence: "high",
      },
      {
        claimType: "holding-hint", precision: "category",
        text: "One undeclared cargo lot smells oily and medicinal. Vale's people have already looked toward the ship twice.",
        confidence: "medium",
      },
      {
        claimType: "holding", precision: "exact", item: "Sperm Whale Oil",
        text: "Sailor has Sperm Whale Oil below deck.",
        confidence: "high", sellable: true, exclusive: true,
      },
    ],
    clue: "The Sailor is leaving. A need that can wait today may become very expensive tomorrow.",
  },
  vale: {
    style: "Sophisticated opportunist",
    markup: 2,
    cashPreference: 0.45,
    informationTempo: 1,
    publicStock: ["Velvet Sleeve", "Film Canister", "One White Glove"],
    goals: [
      { item: "Sperm Whale Oil", utility: 9, likelySources: ["mechanic", "fishmonger", "dog"], reason: "A private screening needs an obsolete fuel." },
      { item: "Sealed Parcel", utility: 4, likelySources: ["mechanic", "dog"], reason: "Vale likes situations where provenance can be priced before contents are understood." },
      { item: "Blue Glass Marble", utility: 4, likelySources: ["dog", "fishmonger"], reason: "Vale notices objects with story and scarcity." },
    ],
    investigationStages: [
      {
        claimType: "activity", precision: "context",
        text: "Vale is preparing a private screening and quietly contacting people who deal in obsolete projection equipment and fuel.",
        confidence: "high",
      },
      {
        claimType: "need", precision: "exact", item: "Sperm Whale Oil",
        text: "Vale's screening specifically needs Sperm Whale Oil.",
        confidence: "medium",
      },
    ],
    clue: "Vale is manipulative, but settlement reliability is excellent. She is usually happy to let the other person reveal urgency first.",
  },
  clown: {
    style: "High-risk speculator",
    markup: -1,
    cashPreference: 0.15,
    informationTempo: 2,
    publicStock: ["Lollipop", "Wax Candle Stub", "Handlebar Tape", "Key That Opens Nothing"],
    goals: [
      { item: "Mai Tai", utility: 8, likelySources: ["bar"], reason: "Clown will pay irrational-looking prices for the right drink and the right night." },
      { item: "Built Onewheel", utility: 7, likelySources: ["mechanic", "vale"], reason: "A working onewheel creates wagers other people cannot take." },
      { item: "Sealed Parcel", utility: 5, likelySources: ["mechanic", "dog"], reason: "An opaque payoff distribution is exactly the sort of thing Clown cannot leave alone." },
    ],
    investigationStages: [
      {
        claimType: "activity", precision: "context",
        text: "Clown keeps asking whether the Apprentice has finally learned the old rum drink properly, then changes the subject to wheels.",
        confidence: "high",
      },
      {
        claimType: "need", precision: "exact", item: "Mai Tai",
        text: "Clown is specifically waiting for a proper Mai Tai.",
        confidence: "high",
      },
    ],
    clue: "Clown is not random. He simply values upside and extreme outcomes more than most people do.",
  },
  bar: {
    style: "Relationship-first novice",
    markup: 0,
    cashPreference: 0.25,
    informationTempo: 3,
    publicStock: ["Rum Bottle", "Bruised Mint", "Orange Curaçao", "Demerara Syrup", "Hotel Sugar Cubes, 23 Count", "Empty Green Bottle"],
    goals: [
      { item: "Orgeat Bottle", utility: 8, likelySources: ["fishmonger", "mechanic", "dog"], reason: "The Apprentice is trying to learn a proper Mai Tai but one ingredient is missing." },
      { item: "Ice Block", utility: 3, likelySources: ["fishmonger", "mechanic"], reason: "Cold drinks are a recurring operating input, not a one-time quest." },
      { item: "Lime Crate", utility: 5, likelySources: ["fishmonger", "dog"], reason: "Fresh citrus is both an input and a rarity." },
    ],
    investigationStages: [
      {
        claimType: "activity", precision: "context",
        text: "The Apprentice is learning to make a Mai Tai. The recipe keeps stalling because one ingredient is missing.",
        confidence: "high",
      },
      {
        claimType: "need-hint", precision: "specific",
        text: "Rum, fresh lime and orange curaçao are already behind the bar. Whatever is missing is not one of those.",
        confidence: "high",
      },
      {
        claimType: "need", precision: "exact", item: "Orgeat Bottle",
        text: "If you press further, the missing Mai Tai ingredient is orgeat.",
        confidence: "high",
      },
    ],
    clue: "The Apprentice is not a strong trader yet. People still like dealing with them, which is an economic advantage of its own.",
  },
};

// Deterministic recurring arrivals keep the small market alive without random loot fountains.
export const BUSINESS_CYCLES = {
  dog: ["Empty Green Bottle", "Wax Candle Stub", "Red Ribbon", "Dead Pigeon", "Glasses Wipe", "Bicycle Bell", "Chia Seeds"],
  fishmonger: ["Fresh Mackerel", "Ice Block", "Smoked Eel", "Sea Lettuce Bundle", "Two Octopus Tentacles"],
  mechanic: [
    "Sealed Parcel", "Three Metres of Stolen Theatre Wire", "Patch Cut from the Ship Mercy",
    "Presta Inner Tube", "Chain Quick-Link", "Brake Cable", "Tiny Torque Wrench",
  ],
};

export const SOCIAL_GRAPH = {
  dog: {
    fishmonger: { familiarity: 1, trust: 0, channel: "harbour" },
    mechanic: { familiarity: 1, trust: 0, channel: "dock" },
    vale: { familiarity: 1, trust: -1, channel: "street-to-elite" },
    clown: { familiarity: 1, trust: 0, channel: "bar" },
    bar: { familiarity: 2, trust: 1, channel: "animal-friendly bar" },
    seagulls: { familiarity: 2, trust: 0, channel: "animal informal network" },
    squirrels: { familiarity: 2, trust: 0, channel: "animal informal network" },
    mosquitoes: { familiarity: 1, trust: 0, channel: "animal informal network" },
  },
  vale: {
    mechanic: { familiarity: 3, trust: 2, channel: "repeat private trade" },
    dog: { familiarity: 1, trust: -1, channel: "informal information" },
  },
  mechanic: {
    vale: { familiarity: 3, trust: 2, channel: "repeat private trade" },
    dog: { familiarity: 1, trust: 1, channel: "dock" },
  },
  clown: {
    bar: { familiarity: 3, trust: 2, channel: "regular customer" },
  },
  bar: {
    clown: { familiarity: 3, trust: 1, channel: "regular customer" },
    dog: { familiarity: 2, trust: 2, channel: "animal-friendly bar" },
  },
  fishmonger: {
    dog: { familiarity: 1, trust: 0, channel: "ordinary market" },
  },
};

export const FORMS = {
  human: {
    id: "human",
    icon: "🧍",
    label: "Human",
    formalPersonhood: true,
    note: "Strong institutional access; identity and ownership are formally legible.",
  },
  animal: {
    id: "animal",
    icon: "🐾",
    label: "Animal",
    formalPersonhood: false,
    note: "Informal networks remain available, but many human institutions refuse direct recognition.",
  },
  sailor: {
    id: "sailor",
    icon: "⚓",
    label: "Sailor",
    formalPersonhood: true,
    note: "A provisional liminal form: mobile and cross-boundary, but not necessarily liberated.",
  },
  plant: {
    id: "plant",
    icon: "🌱",
    label: "Plant",
    formalPersonhood: false,
    note: "Future experimental form. Agency and value would work very differently.",
  },
};

export const VENUES = {
  bar: {
    name: "The Bar",
    allowedForms: ["human", "animal", "sailor"],
    requiresLegalIdentity: false,
    proxyable: false,
    note: "Currently the only confirmed human venue that openly allows animal people inside.",
  },
  formalMarket: {
    name: "Public Market",
    allowedForms: ["human", "sailor"],
    requiresLegalIdentity: true,
    proxyable: true,
    note: "Animal traders may need a recognised proxy rather than direct institutional access.",
  },
  valeGallery: {
    name: "Vale's Auction Rooms",
    allowedForms: ["human", "sailor"],
    requiresLegalIdentity: true,
    proxyable: true,
    note: "Elite formal access. Recognition and invitation matter as much as cash.",
  },
  blackMarket: {
    name: "Cross-form Informal Network",
    allowedForms: ["human", "animal", "sailor"],
    requiresLegalIdentity: false,
    proxyable: false,
    note: "Not one evil shop: an intermediary network between excluded animal society and formal human markets.",
  },
};

export const PLAYER_CONTEXT = {
  startingForm: "human",
  startingLegalIdentity: "recognized",
  communication: "limited-local-speech",
  canUnderstandSomeLocalLanguage: true,
  canSpeakFluently: false,
  channels: ["translation", "writing", "gesture", "structured offers", "demonstrated reliability"],
  note: "The player begins as a formally recognised outsider and cannot freely interrogate every NPC through unlimited dialogue.",
};

export const PHASES = ["sunrise", "morning", "noon", "afternoon", "sunset"];

export const PHASE_COPY = {
  sunrise: {
    icon: "🌅",
    title: "Sunrise",
    subtitle: "The harbour stops. The day has not begun trading yet.",
  },
  morning: {
    icon: "☀️",
    title: "Morning",
    subtitle: "Gather information, build relationships and prepare for the noon market.",
  },
  noon: {
    icon: "🌞",
    title: "Noon Market",
    subtitle: "The public market opens once. Goods and sardines actually change hands now.",
  },
  afternoon: {
    icon: "🌤️",
    title: "Afternoon",
    subtitle: "Interpret the tape, investigate what happened and position for tomorrow.",
  },
  sunset: {
    icon: "🌇",
    title: "Sunset",
    subtitle: "The harbour stops again. Obligations, perishables and memory settle into the next day.",
  },
};
