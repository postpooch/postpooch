/** Default catalog data from luxury-agent-site/lib/site.ts (+ gallery/body expansions). */

const defaultGallery = [
  "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/f5/f56082feffd2eb8a5f8a5326c6b3c26aef8ad7dbd7055afd2418a9dcdfb617c8.avif",
  "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/98/986b4395c3dfd6066f0e49e1efbf5f340006bf817023b0b69aeb6359f5d5ea08.avif",
  "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/83/833d886630ae7cf47b1ca9cd99d4a1427a50f8e04d7b1484b5434ec354634a9c.avif",
];

const defaultArticleBody = [
  "The best real estate decisions usually become clearer when you stop looking at the property as an isolated object. A home belongs to a street, a routine, a set of future choices and a particular financial context. That wider frame is where good judgment starts.",
  "## Start with how you want to live",
  "Before discussing finishes or resale value, define the ordinary week. Where do you walk? How often do you host? Is natural light more important than a larger lower level? Do you want to renovate, or are you paying a premium to avoid it? These questions filter the market more effectively than a long feature checklist.",
  "> Buy the life the home makes possible—not the photograph that made you click.",
  "## Then look at what is hard to change",
  "Orientation, lot, location, ceiling height, structural logic, planning restrictions and the relationship to neighbouring properties often matter more than cosmetic upgrades. A thoughtful renovation can transform a house. It cannot move the ravine, widen the lot or change the direction of the afternoon sun.",
  "## Keep the market in the conversation",
  "Taste matters, but so does evidence. The strongest decisions hold both at once: a home you genuinely want to live in and a price you can defend using comparable value, condition, scarcity and current buyer behaviour.",
];

export const properties = [
  {
    slug: "18-ridgewood-crescent",
    status: "For Sale",
    address: "18 Ridgewood Crescent",
    neighborhood: "Forest Hill",
    price: "$4,895,000",
    beds: 4,
    baths: 5,
    sqft: "4,120 sq ft",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/27/2789f41e2e63a84da47f8b52b91f23130ecb40b4f977054f0ec4dc4a9db0bd03.avif",
    summary:
      "A serene modern residence where limestone, oak, and garden views create a quiet sense of permanence.",
    gallery: [...defaultGallery],
  },
  {
    slug: "55-clarendon-avenue",
    status: "Private Offering",
    address: "55 Clarendon Avenue",
    neighborhood: "South Hill",
    price: "$7,250,000",
    beds: 5,
    baths: 6,
    sqft: "5,600 sq ft",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/56/56d4781eab1d9871650b578a067f833100a8c8b4097f6eeb5f92b481da330c05.avif",
    summary:
      "An architectural family home with layered terraces, a sculptural stair, and refined contemporary detailing.",
    gallery: [...defaultGallery],
  },
  {
    slug: "penthouse-9-hazelton",
    status: "For Sale",
    address: "Penthouse · 9 Hazelton",
    neighborhood: "Yorkville",
    price: "$3,675,000",
    beds: 2,
    baths: 3,
    sqft: "2,060 sq ft",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/4c/4c24dee193571293046715c379ed9783870158fd1a7aa8f1be19fd63e91b4323.avif",
    summary:
      "A composed city residence with generous entertaining rooms, soft natural light, and treetop views.",
    gallery: [...defaultGallery],
  },
  {
    slug: "112-warren-road",
    status: "Sold",
    address: "112 Warren Road",
    neighborhood: "Casa Loma",
    price: "$5,100,000",
    beds: 4,
    baths: 5,
    sqft: "4,800 sq ft",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/b0/b01e7c5c9e03b6858c21893e1342c1eabc0911081fd8132e737e036a77f50c51.avif",
    summary:
      "A restored character home balancing original craftsmanship with calm, modern interventions.",
    gallery: [...defaultGallery],
  },
  {
    slug: "42-roxborough-drive",
    status: "Sold",
    address: "42 Roxborough Drive",
    neighborhood: "Rosedale",
    price: "$6,950,000",
    beds: 5,
    baths: 6,
    sqft: "5,340 sq ft",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/5b/5b0518610e6a81493fd2b1a971e160a603b9f0ae83542f10fc9c77a505533bc1.avif",
    summary:
      "A gracious ravine-edge residence reimagined for contemporary living and discreet entertaining.",
    gallery: [...defaultGallery],
  },
  {
    slug: "7-elmsthorpe-avenue",
    status: "Sold",
    address: "7 Elmsthorpe Avenue",
    neighborhood: "Chaplin Estates",
    price: "$3,220,000",
    beds: 4,
    baths: 4,
    sqft: "3,180 sq ft",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/bc/bc9807429973a36cf03c877224206c6b4b3b9054f463f73359570bd8bf5894d5.avif",
    summary:
      "Tailored, light-filled and exceptionally practical, with a garden designed as a true outdoor room.",
    gallery: [...defaultGallery],
  },
];

export const neighborhoods = [
  {
    slug: "rosedale",
    name: "Rosedale",
    kicker: "Ravines · Heritage · Privacy",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/71/71eacf1428f65ef4f6ef2880609f2870f94d99bc2c5cbe5e3d51c5a9e0478228.avif",
    copy: "Leafy streets, landmark architecture and quick access to the city create an enduring balance of privacy and connection.",
    stats: ["Detached estates", "Ravine settings", "10 min to downtown"],
  },
  {
    slug: "forest-hill",
    name: "Forest Hill",
    kicker: "Schools · Village Life · Grand Homes",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/f3/f3028b535c800dcca55abff95b5fc913317c94a4cc83d3ceec5f5fda59c78c3d.avif",
    copy: "A polished residential enclave known for established gardens, strong schools and handsome homes across several eras.",
    stats: ["Top schools", "Village shopping", "Large lots"],
  },
  {
    slug: "yorkville",
    name: "Yorkville",
    kicker: "Design · Dining · Culture",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/fb/fb03c3c5d671c67ce5cf3ad691539fa0f52ecdb724daec5f8655b93ae57f351f.avif",
    copy: "A walkable district of galleries, restaurants, luxury retail and design-forward residences in the heart of Toronto.",
    stats: ["Luxury condos", "Walk everywhere", "Culture district"],
  },
  {
    slug: "lawrence-park",
    name: "Lawrence Park",
    kicker: "Family · Green Space · Calm",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/67/675bcfa6b13c23a82e8623875e5033aa9be4699cdb9c1bdf66d8cb59607834ea.avif",
    copy: "Quiet, tree-lined and deeply residential, with parks, schools and architectural homes set back from the city’s pace.",
    stats: ["Family oriented", "Generous lots", "Parks & trails"],
  },
  {
    slug: "summerhill",
    name: "Summerhill",
    kicker: "Village · Transit · Character",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/62/62a18b231c14fc0048298085815c02479256fa8c4fcfd2b8225c5c291d57b81e.avif",
    copy: "Character streets meet refined restaurants and effortless transit in one of central Toronto’s most intimate pockets.",
    stats: ["Historic homes", "Boutique retail", "Subway access"],
  },
  {
    slug: "the-annex",
    name: "The Annex",
    kicker: "Architecture · Campus · Energy",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/24/2408de0afa63168abf232c2be800646d2d392e0cca1e40231b926d8ef869459d.avif",
    copy: "Victorian streets, cultural institutions and an energetic independent spirit make this a neighbourhood with true texture.",
    stats: ["Victorian stock", "Culture nearby", "Independent shops"],
  },
];

export const condos = [
  {
    slug: "one-bedford",
    name: "One Bedford",
    area: "The Annex",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/80/80bf9859a5d1db42b71ff33f3329875d999b21ab48b733f6683d575ffbccbf93.avif",
    copy: "A refined limestone address where generous plans and hotel-level service meet the edge of Yorkville and the Annex.",
  },
  {
    slug: "four-seasons-residences",
    name: "Four Seasons Private Residences",
    area: "Yorkville",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/fb/fb03c3c5d671c67ce5cf3ad691539fa0f52ecdb724daec5f8655b93ae57f351f.avif",
    copy: "Full-service urban living with panoramic views, discreet arrival and some of Toronto’s most complete private amenities.",
  },
  {
    slug: "the-avenue",
    name: "The Avenue",
    area: "Forest Hill South",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/80/80bf9859a5d1db42b71ff33f3329875d999b21ab48b733f6683d575ffbccbf93.avif",
    copy: "Spacious suites, elegant common areas and a residential setting for buyers who want condo ease without giving up scale.",
  },
  {
    slug: "10-bellair",
    name: "10 Bellair",
    area: "Yorkville",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/ac/ac20c71e00a4ffa16073fa4737d96180a37528b13b1d159fa3bf539c593b80e4.avif",
    copy: "A coveted boutique-feeling address positioned for effortless access to galleries, dining and Bloor Street.",
  },
];

export const articles = [
  {
    slug: "buy-the-street-before-the-house",
    category: "Buying",
    date: "August 3, 2026",
    title: "Buy the Street Before You Buy the House",
    excerpt:
      "The right property starts with the way you want your ordinary Tuesday to feel.",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/32/325f8bc1904dfbafd1afdd09158fb51b11ca171eec5dd05e4140ea3e5d6339fc.avif",
    body: [...defaultArticleBody],
  },
  {
    slug: "quiet-luxury-at-home",
    category: "Design",
    date: "July 16, 2026",
    title: "What Quiet Luxury Looks Like at Home",
    excerpt:
      "Natural materials, good proportions and restraint age better than trend-driven spectacle.",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/d1/d106791c7df87d40d5db9cbd17af9139b09eba4e052789c95623b6eb1ddf8739.avif",
    body: [...defaultArticleBody],
  },
  {
    slug: "preparing-a-design-forward-home",
    category: "Selling",
    date: "June 28, 2026",
    title: "Preparing a Design-Forward Home for Market",
    excerpt:
      "Great presentation is not decoration. It is editing, sequencing and making value legible.",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/a4/a498abc69b36c0ea7e95183760ad00c275b54fa4a60f38e81e681c7e30435c5d.avif",
    body: [...defaultArticleBody],
  },
  {
    slug: "the-case-for-older-condos",
    category: "Condos",
    date: "June 2, 2026",
    title: "The Case for an Older Luxury Condo",
    excerpt:
      "Bigger plans, mature locations and thoughtful renovations can outperform shiny amenities.",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/b4/b48daa09eda5da3913c4609a175230555583c5642968c187eca67f42783f9f91.avif",
    body: [...defaultArticleBody],
  },
];

export const testimonials = [
  {
    quote:
      "Mara understood that we were not simply buying square footage. She translated the way we wanted to live into a shortlist that felt uncannily right.",
    name: "Elena & David",
    type: "Buyer · Rosedale",
  },
  {
    quote:
      "Every decision felt considered—from pricing and photography to the order in which buyers experienced the rooms. We sold with confidence, not chaos.",
    name: "Nadia K.",
    type: "Seller · Forest Hill",
  },
  {
    quote:
      "She can talk architecture, numbers and negotiation in the same conversation. That combination made a complicated move feel remarkably clear.",
    name: "Peter L.",
    type: "Buyer & Seller · Midtown",
  },
];

export { defaultArticleBody, defaultGallery };
