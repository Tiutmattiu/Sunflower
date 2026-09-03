export const SARDINE = "🥫";
export const MAX_DAYS = 14;
export const MORNING_ACTIONS = 2;
export const AFTERNOON_ACTIONS = 2;

export const ITEMS = {
  "Blue Glass Marble": { value: 3, icon: "🔵", type: "Blue" },
  "Dead Pigeon": { value: 3, icon: "🐦", type: "Catalyst" },
  "Collar Tag": { value: 3, icon: "🏷️", type: "Access" },
  "Chewed Rope Toy": { value: 1, icon: "🧸", type: "Liquid" },
  "Fresh Mackerel": { value: 4, icon: "🐟", type: "Soup Fish", perishable: true },
  "Orgeat Bottle": { value: 7, icon: "🥛", type: "Ingredient" },
  "Steel Rim": { value: 5, icon: "⭕", type: "Machine Part" },
  "Rusty Harpoon": { value: 6, icon: "🗡️", type: "Weapon" },
  "Sperm Whale Oil": { value: 6, icon: "🛢️", type: "Fuel" },
  "Salted Cod": { value: 4, icon: "🐡", type: "Soup Fish", perishable: true },
  "Hardtack Tin": { value: 2, icon: "🍞", type: "Liquid" },
  "Brass Compass": { value: 5, icon: "🧭", type: "High Value" },
  "Valentino Still": { value: 5, icon: "🎞️", type: "Prestige" },
  "Hand Mirror": { value: 3, icon: "🪞", type: "Prestige" },
  "Velvet Sleeve": { value: 2, icon: "🧤", type: "Liquid" },
  "Auction Sunflower": { value: 16, icon: "🌻", type: "Auction Goal" },
  "Auction Onewheel": { value: 8, icon: "🛞", type: "Vehicle" },
  "Lollipop": { value: 1, icon: "🍭", type: "Liquid" },
  "Glitter Tape": { value: 2, icon: "✨", type: "Liquid" },
  "Tool Roll": { value: 3, icon: "🧰", type: "Tool" },
  "Lucky Sticker": { value: 1, icon: "⭐", type: "Liquid" },
  "Rum Bottle": { value: 4, icon: "🍾", type: "Drink" },
  "Bruised Mint": { value: 1, icon: "🌿", type: "Liquid" },
  "Cracked Shaker": { value: 2, icon: "🥤", type: "Liquid" },
  "Lime Crate": { value: 4, icon: "🍋", type: "Citrus" },
  "Mai Tai": { value: 8, icon: "🍹", type: "Drink / Goal" },
  "Bad Tangerine": { value: 1, icon: "🍊", type: "Toxic" },
  "Tin Spoon": { value: 1, icon: "🥄", type: "Liquid" },
  "Old Coupon": { value: 2, icon: "🎟️", type: "Liquid" },
  "Pocket Match": { value: 1, icon: "🔥", type: "Liquid" },
  "Fish Bones": { value: 2, icon: "🦴", type: "Junk" },
  "Built Onewheel": { value: 8, icon: "🛞", type: "Vehicle" },
  "Spoiled Fish": { value: 1, icon: "🐟", type: "Waste" },
  Sunflower: { value: 99, icon: "🌻", type: "Goal" },
};

export const INITIAL_TRADERS = {
  dog: {
    id: "dog", name: "Dock Dog", icon: "🐕", role: "Scavenger dealer / harbour gossip",
    sardines: 6,
    inventory: ["Blue Glass Marble", "Dead Pigeon", "Collar Tag", "Chewed Rope Toy"],
  },
  fishmonger: {
    id: "fishmonger", name: "Fishmonger", icon: "🐠", role: "Fish producer / steady operator",
    sardines: 10,
    inventory: ["Fresh Mackerel", "Orgeat Bottle", "Steel Rim", "Rusty Harpoon"],
  },
  mechanic: {
    id: "mechanic", name: "Sailor", icon: "⚙️", role: "Travelling merchant / repair-capable sailor",
    sardines: 5,
    inventory: ["Sperm Whale Oil", "Salted Cod", "Hardtack Tin", "Brass Compass"],
  },
  vale: {
    id: "vale", name: "Mirelle Vale", icon: "🎬", role: "Auctioneer / capital allocator",
    sardines: 12,
    inventory: ["Valentino Still", "Hand Mirror", "Velvet Sleeve"],
  },
  clown: {
    id: "clown", name: "Onewheel Clown", icon: "🤡", role: "Speculator / racer",
    sardines: 4,
    inventory: ["Lollipop", "Glitter Tape", "Tool Roll", "Lucky Sticker"],
  },
  bar: {
    id: "bar", name: "Bar Apprentice", icon: "🍸", role: "Relationship trader / novice investor",
    sardines: 8,
    inventory: ["Rum Bottle", "Bruised Mint", "Cracked Shaker", "Lime Crate"],
  },
  player: {
    id: "player", name: "You", icon: "🧍", role: "Outsider acquisition agent",
    sardines: 6,
    inventory: ["Fish Bones", "Bad Tangerine", "Tin Spoon", "Old Coupon"],
  },
};

export const NPC_PROFILES = {
  dog: {
    style: "High-turnover dealer",
    markup: 0,
    cashPreference: 0.35,
    informationTempo: 1,
    publicStock: ["Chewed Rope Toy"],
    goals: [
      { item: "Fresh Mackerel", utility: 4, likelySources: ["fishmonger", "bar"], reason: "Food disappears quickly around the cats." },
      { item: "Fish Bones", utility: 3, likelySources: ["fishmonger", "mechanic"], reason: "Even scraps have a use at the dock." },
    ],
    clue: "Dog sees a lot of the harbour, but does not always know what the information is worth.",
  },
  fishmonger: {
    style: "Conservative operator",
    markup: 1,
    cashPreference: 0.7,
    informationTempo: 3,
    publicStock: ["Fresh Mackerel"],
    goals: [
      { item: "Dead Pigeon", utility: 4, likelySources: ["dog", "mechanic"], reason: "The fish stall has a strange standing use for it." },
    ],
    clue: "Fishmonger understands fish far better than fashionable assets and rarely changes business just because another trade looks exciting.",
  },
  mechanic: {
    style: "Deadline merchant",
    markup: 0,
    cashPreference: 0.55,
    informationTempo: 2,
    departureDay: 8,
    publicStock: ["Hardtack Tin", "Salted Cod"],
    goals: [
      { item: "Lime Crate", utility: 7, urgencyPerDay: 1.3, likelySources: ["bar", "fishmonger", "dog"], reason: "The ship must provision citrus before departure." },
    ],
    clue: "The Sailor is leaving. A need that can wait today may become very expensive tomorrow.",
  },
  vale: {
    style: "Sophisticated opportunist",
    markup: 2,
    cashPreference: 0.45,
    informationTempo: 1,
    publicStock: ["Velvet Sleeve"],
    goals: [
      { item: "Sperm Whale Oil", utility: 9, likelySources: ["mechanic", "fishmonger", "dog"], reason: "A private screening needs an obsolete fuel." },
      { item: "Blue Glass Marble", utility: 4, likelySources: ["dog", "fishmonger"], reason: "Vale notices objects with story and scarcity." },
    ],
    clue: "Vale is manipulative, but settlement reliability is excellent. She is usually happy to let the other person reveal urgency first.",
  },
  clown: {
    style: "High-risk speculator",
    markup: -1,
    cashPreference: 0.15,
    informationTempo: 2,
    publicStock: ["Lollipop"],
    goals: [
      { item: "Mai Tai", utility: 8, likelySources: ["bar"], reason: "Clown will pay irrational-looking prices for the right drink and the right night." },
      { item: "Built Onewheel", utility: 7, likelySources: ["mechanic", "vale"], reason: "A working onewheel creates wagers other people cannot take." },
    ],
    clue: "Clown is not random. He simply values upside and extreme outcomes more than most people do.",
  },
  bar: {
    style: "Relationship-first novice",
    markup: 0,
    cashPreference: 0.25,
    informationTempo: 3,
    publicStock: ["Rum Bottle", "Bruised Mint"],
    goals: [
      { item: "Orgeat Bottle", utility: 8, likelySources: ["fishmonger", "mechanic", "dog"], reason: "The bar cannot make a proper Mai Tai without it." },
      { item: "Lime Crate", utility: 5, likelySources: ["fishmonger", "dog"], reason: "Fresh citrus is both an input and a rarity." },
    ],
    clue: "The Apprentice is not a strong trader yet. People still like dealing with them, which is an economic advantage of its own.",
  },
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

export const VENUES = {
  bar: {
    name: "The Bar",
    animalAccess: "open",
    note: "Currently the only confirmed human venue that openly allows animal people inside.",
  },
  formalMarket: {
    name: "Public Market",
    animalAccess: "restricted",
    note: "Access rules are not final; discrimination against animal traders exists in this society.",
  },
};

export const PLAYER_CONTEXT = {
  communication: "limited-local-speech",
  canUnderstandSomeLocalLanguage: true,
  canSpeakFluently: false,
  channels: ["translation", "writing", "gesture", "structured offers", "demonstrated reliability"],
  note: "The player is an outsider and cannot freely interrogate every NPC through unlimited dialogue.",
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
