export const images = {
  hero: "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/17/175251b772adc174ba9d78b9b9863a953fbfa973b6c4004a8d3cd60332f493bb.jpg",
  portrait:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/c6/c679a84fa707aa3a4b8742afa6733282871bbf175380632522092a1bb743fa1b.jpg",
  home1:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/51/51b670c95ee0cc9f1fded0c049cf58a720ad414062fa35f639a7dec8df8f55a3.jpg",
  home2:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/1c/1cc61be2519d575a9c5cf1917fab7fc0d8ef4db0c1703a48bb7018a81f167ed6.jpg",
  home3:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/85/85f9f8b8138626c97fabd43798e6d57c61aa6c4e26457d3cb780d67d8e7579ab.jpg",
  home4:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/f5/f55ffb085f9b200104f72c471af98892e14e915bbf0478ede6022480292e0319.jpg",
  home5:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/33/33d2b9d09dc72af229282980a1b4c6c55741be59e740b5dece13e45e229bbb3f.jpg",
  interior1:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/90/90353760f09de535879f1ae1d49b2c2cafe7944b592cdf0e13e18258f3c4a807.jpg",
  interior2:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/bc/bc4457ae9793e1af8cf9a99ee48031ff9d0e24c5b838bc958cb98554c54748b6.jpg",
  city: "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/92/92b7b54bf2b88da09cd977f23d47b8f8345b5e43e2c37e017580709ad243d121.jpg",
  coast:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/57/57781622a253941597a3de389d94cbd1f090323839ba0fe54ba8642e3062d639.jpg",
  palms:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/18/18d83e30ec7b5cb6993561610161438e7c56a5a9c41942d4c1a4b90e070ff514.jpg",
};

export const properties = [
  {
    slug: "crestline-residence",
    status: "For Sale",
    address: "1248 Crestline Drive",
    city: "Beverly Hills, CA",
    price: "$38,500,000",
    beds: "7",
    baths: "10",
    sqft: "12,840",
    image: images.home1,
    image2: images.interior1,
    image3: images.interior2,
    featured: true,
    type: "sale",
    description:
      "A contemporary Beverly Hills estate shaped around light, privacy and indoor-outdoor living. Floor-to-ceiling glass opens to terraces, a pool pavilion and sweeping city views.",
    lot: "0.81 Acres",
    year: "2024",
    garage: "6 Cars",
  },
  {
    slug: "stone-canyon-estate",
    status: "For Sale",
    address: "809 Stone Canyon Road",
    city: "Bel Air, CA",
    price: "$27,900,000",
    beds: "6",
    baths: "9",
    sqft: "10,420",
    image: images.home2,
    image2: images.interior1,
    image3: images.interior2,
    featured: true,
    type: "sale",
    description:
      "A composed Bel Air retreat with gallery-scale entertaining rooms, warm natural materials and private resort grounds tucked behind mature landscaping.",
    lot: "1.14 Acres",
    year: "2022",
    garage: "5 Cars",
  },
  {
    slug: "cielo-house",
    status: "For Sale",
    address: "1610 Cielo Lane",
    city: "Los Angeles, CA",
    price: "$18,750,000",
    beds: "5",
    baths: "7",
    sqft: "8,690",
    image: images.home3,
    image2: images.interior1,
    image3: images.interior2,
    featured: true,
    type: "sale",
    description:
      "Architectural lines, dramatic volume and a serene pool terrace define this hillside residence above the city.",
    lot: "0.63 Acres",
    year: "2021",
    garage: "4 Cars",
  },
  {
    slug: "ocean-house",
    status: "For Lease",
    address: "27148 Pacific Coast Highway",
    city: "Malibu, CA",
    price: "$95,000/mo",
    beds: "5",
    baths: "6",
    sqft: "6,320",
    image: images.coast,
    image2: images.interior1,
    image3: images.interior2,
    featured: true,
    type: "lease",
    description:
      "A private oceanfront residence where expansive glazing, broad decks and a quiet material palette frame uninterrupted Pacific views.",
    lot: "0.42 Acres",
    year: "2019",
    garage: "3 Cars",
  },
  {
    slug: "north-canon-villa",
    status: "For Lease",
    address: "728 North Canon Drive",
    city: "Beverly Hills, CA",
    price: "$62,000/mo",
    beds: "6",
    baths: "8",
    sqft: "7,980",
    image: images.home5,
    image2: images.interior1,
    image3: images.interior2,
    featured: false,
    type: "lease",
    description:
      "A refined European-inspired villa moments from the heart of Beverly Hills, with gracious formal rooms and secluded gardens.",
    lot: "0.49 Acres",
    year: "2018",
    garage: "4 Cars",
  },
  {
    slug: "ridge-house",
    status: "Sold",
    address: "1134 Ridge Terrace",
    city: "Beverly Hills, CA",
    price: "$31,200,000",
    beds: "6",
    baths: "9",
    sqft: "11,250",
    image: images.home4,
    image2: images.interior1,
    image3: images.interior2,
    featured: false,
    type: "sold",
    description:
      "A record-setting modern residence balancing cinematic views with intimate, meticulously detailed living spaces.",
    lot: "0.71 Acres",
    year: "2020",
    garage: "5 Cars",
  },
  {
    slug: "mapleton-manor",
    status: "Sold",
    address: "412 Mapleton Drive",
    city: "Holmby Hills, CA",
    price: "$42,750,000",
    beds: "8",
    baths: "11",
    sqft: "15,600",
    image: images.interior2,
    image2: images.interior1,
    image3: images.home4,
    featured: false,
    type: "sold",
    description:
      "A grand estate set on expansive grounds with formal gardens, guest accommodations and an exceptional entertaining program.",
    lot: "1.52 Acres",
    year: "2017",
    garage: "8 Cars",
  },
  {
    slug: "bird-streets-pavilion",
    status: "Sold",
    address: "1440 Oriole Way",
    city: "Los Angeles, CA",
    price: "$22,850,000",
    beds: "5",
    baths: "7",
    sqft: "7,430",
    image: images.interior1,
    image2: images.interior2,
    image3: images.home3,
    featured: false,
    type: "sold",
    description:
      "A glass pavilion above the Sunset Strip with a disappearing-edge pool and panoramic city-to-ocean views.",
    lot: "0.44 Acres",
    year: "2023",
    garage: "4 Cars",
  },
];

export const globalProperties = [
  { place: "Palm Beach, Florida", price: "$72,000,000", image: images.home2 },
  { place: "Cap d’Antibes, France", price: "€39,500,000", image: images.coast },
  { place: "London, United Kingdom", price: "£28,000,000", image: images.interior1 },
  { place: "Aspen, Colorado", price: "$24,750,000", image: images.home4 },
  { place: "Mallorca, Spain", price: "€18,900,000", image: images.palms },
  { place: "New York, New York", price: "$16,500,000", image: images.city },
];

export const communities = [
  {
    slug: "beverly-hills",
    name: "Beverly Hills",
    image: images.home1,
    tagline: "Iconic avenues, architectural pedigree and enduring prestige.",
    intro:
      "Beverly Hills is defined by a rare balance of privacy, culture and proximity. From stately residences north of Sunset to polished contemporary homes closer to the city center, the market rewards quality, provenance and exceptional positioning.",
    population: "31,900",
    medianAge: "47",
    avgIncome: "$113K",
    walk: "66",
    details: [
      "The Flats & central Beverly Hills",
      "Trousdale-adjacent hillside properties",
      "Private estates north of Sunset",
      "World-renowned dining and retail",
    ],
  },
  {
    slug: "bel-air",
    name: "Bel Air",
    image: images.home2,
    tagline: "Secluded estates set among canyons, gates and mature landscapes.",
    intro:
      "Bel Air offers some of Los Angeles' most private residential environments. Winding roads, deep lots and architecturally significant homes create a market where discretion matters as much as square footage.",
    population: "7,800",
    medianAge: "48",
    avgIncome: "$142K",
    walk: "22",
    details: [
      "East Gate & West Gate",
      "Stone Canyon estates",
      "Large-scale gated compounds",
      "Minutes to Beverly Hills and UCLA",
    ],
  },
  {
    slug: "holmby-hills",
    name: "Holmby Hills",
    image: images.home4,
    tagline: "Monumental lots and legacy residences in the heart of the Platinum Triangle.",
    intro:
      "Holmby Hills is small, discreet and extraordinarily valuable. Its broad streets and estate-scale parcels have long attracted buyers who prioritize land, privacy and architectural legacy.",
    population: "3,200",
    medianAge: "50",
    avgIncome: "$159K",
    walk: "31",
    details: [
      "Estate-scale parcels",
      "Historic architecture",
      "Quiet tree-lined streets",
      "Central Westside location",
    ],
  },
  {
    slug: "malibu",
    name: "Malibu",
    image: images.coast,
    tagline: "A coastal market where architecture, access and ocean frontage define value.",
    intro:
      "Malibu combines a relaxed rhythm with one of the most specialized luxury markets in the country. Beachfront, bluff-top and gated canyon properties each offer a distinct interpretation of privacy and coastal living.",
    population: "10,600",
    medianAge: "50",
    avgIncome: "$118K",
    walk: "26",
    details: [
      "Broad Beach & Malibu Road",
      "Point Dume",
      "Carbon Beach",
      "Gated canyon enclaves",
    ],
  },
  {
    slug: "brentwood",
    name: "Brentwood",
    image: images.palms,
    tagline: "Understated sophistication at the meeting point of city and coast.",
    intro:
      "Brentwood pairs polished neighborhood life with access to Santa Monica, Pacific Palisades and central Los Angeles. The best homes feel residential and private while remaining connected to the Westside.",
    population: "33,000",
    medianAge: "42",
    avgIncome: "$105K",
    walk: "58",
    details: [
      "North of Sunset estates",
      "Brentwood Park",
      "Walkable village amenities",
      "Westside school access",
    ],
  },
  {
    slug: "sunset-strip",
    name: "Sunset Strip",
    image: images.city,
    tagline: "Architectural hillside homes with dramatic city-to-ocean outlooks.",
    intro:
      "Above Sunset Boulevard, winding residential streets rise into some of Los Angeles' most cinematic viewpoints. The market is design-forward, privacy-conscious and closely tied to the city's creative culture.",
    population: "19,000",
    medianAge: "39",
    avgIncome: "$96K",
    walk: "71",
    details: [
      "Bird Streets",
      "Hollywood Hills West",
      "Jetliner views",
      "Design-led contemporary homes",
    ],
  },
];

export const press = [
  {
    title: "A New Benchmark for Beverly Hills Representation",
    outlet: "Architectural Digest",
    date: "July 18, 2026",
    description: "A conversation on architecture, discretion and the new luxury buyer.",
  },
  {
    title: "The Agents Behind Los Angeles’ Quietest Deals",
    outlet: "The Real Deal",
    date: "May 26, 2026",
    description: "Inside the private networks shaping ultra-prime residential sales.",
  },
  {
    title: "Inside a $38.5M Contemporary Estate",
    outlet: "Mansion Global",
    date: "March 11, 2026",
    description: "A closer look at one of the year's most considered Beverly Hills listings.",
  },
  {
    title: "Luxury Market Leaders to Watch",
    outlet: "Los Angeles Business Journal",
    date: "November 4, 2025",
    description: "Recognizing a new generation of high-touch residential advisors.",
  },
  {
    title: "Why Privacy Is the New Amenity",
    outlet: "Robb Report",
    date: "September 16, 2025",
    description: "How sophisticated buyers are redefining what makes a trophy home.",
  },
  {
    title: "The Return of Warm Modernism",
    outlet: "Dwell",
    date: "June 8, 2025",
    description: "Natural material palettes and livable architecture are reshaping the market.",
  },
];

export const articles = [
  {
    slug: "buying-a-legacy-estate",
    title: "What Makes a Los Angeles Home a Legacy Estate?",
    date: "August 18, 2026",
    category: "Market Notes",
    image: images.home4,
    excerpt:
      "Scale alone does not create a legacy property. The rarest homes combine land, architecture, privacy and a sense of permanence.",
    body: [
      "In Los Angeles, the word estate is used freely. But the homes that hold value across generations tend to share a much narrower set of qualities: exceptional land, privacy that cannot be easily replicated, architecture with conviction, and an address that carries meaning beyond a single market cycle.",
      "The most important quality is often the one buyers notice last: composure. A true legacy estate feels resolved. Arrival, landscaping, room proportions, views and service spaces work together without asking for attention.",
      "When evaluating these properties, we look beyond finishes and recent renovation. Replacement cost matters, but so do parcel shape, setbacks, neighboring context, architectural authorship and the long-term scarcity of the site itself.",
    ],
  },
  {
    slug: "the-new-language-of-privacy",
    title: "The New Language of Privacy in Luxury Real Estate",
    date: "August 2, 2026",
    category: "Perspective",
    image: images.home2,
    excerpt:
      "Privacy is no longer one feature among many. For a growing share of buyers, it is the framework for every other decision.",
    body: [
      "Privacy in the luxury market has become more layered. A gate is only the beginning. Buyers now think in terms of arrival sequences, sight lines, acoustic separation, staff circulation and the ability to host without sacrificing the private life of the home.",
      "This is especially visible in Bel Air and Holmby Hills, where properties with deep setbacks, mature landscaping and controlled approaches often outperform homes with more obvious spectacle but less separation from the street.",
      "The result is a more sophisticated conversation: not simply whether a home is private, but how privacy feels throughout a normal day.",
    ],
  },
  {
    slug: "malibu-micro-markets",
    title: "Malibu: Beachfront, Bluff-Top or Gated Canyon?",
    date: "July 14, 2026",
    category: "Neighborhood Guide",
    image: images.coast,
    excerpt:
      "Three Malibu property types can sit minutes apart while offering radically different versions of coastal living.",
    body: [
      "Malibu is not one market. Beachfront properties trade on direct access and irreplaceability. Bluff-top homes often deliver broader views, more land and a stronger sense of separation. Gated canyon communities shift the emphasis toward privacy, acreage and a quieter relationship with the coast.",
      "The right choice depends on how you want to live. A buyer who wants to hear the ocean from every room may accept tighter lots and marine exposure. Another may prefer acreage, guest space and a more protected setting a few minutes inland.",
      "Understanding those tradeoffs before touring makes the search materially more efficient and helps buyers compare homes on the right terms.",
    ],
  },
  {
    slug: "design-that-holds-value",
    title: "Design Decisions That Hold Value Beyond the Trend Cycle",
    date: "June 26, 2026",
    category: "Design",
    image: images.interior1,
    excerpt: "The best luxury renovations feel specific without becoming dated.",
    body: [
      "Luxury buyers notice restraint. Natural stone, well-proportioned millwork, consistent hardware and thoughtful lighting often age more gracefully than louder material statements.",
      "That does not mean neutral or anonymous. The strongest homes have character, but the character comes from architecture, craftsmanship and scale rather than a collection of short-lived visual trends.",
      "For sellers considering a renovation before market, the goal is rarely to make the home look new. It is to make the home feel complete.",
    ],
  },
  {
    slug: "how-private-sales-work",
    title: "How Private Sales Actually Work at the Top of the Market",
    date: "May 30, 2026",
    category: "Advisory",
    image: images.city,
    excerpt: "Off-market does not mean invisible. It means the audience is intentionally narrow.",
    body: [
      "At the highest price points, a public launch is not always the first or best step. Some sellers prefer a controlled introduction to a small network of qualified buyers and advisors.",
      "The process depends on relationships, accurate pricing and trust. A private offering that is poorly positioned can still linger. A disciplined one can protect confidentiality while creating meaningful competition.",
      "The central question is not whether a property should be public or private. It is which strategy best supports the seller's priorities.",
    ],
  },
  {
    slug: "beverly-hills-street-by-street",
    title: "Why Beverly Hills Must Be Understood Street by Street",
    date: "April 19, 2026",
    category: "Neighborhood Guide",
    image: images.palms,
    excerpt:
      "A few blocks can change lot character, views, traffic, architecture and ultimately value.",
    body: [
      "Beverly Hills is compact, but it is not uniform. The Flats, the hillside streets, Trousdale-adjacent pockets and the areas north of Sunset each behave differently.",
      "Two homes with similar square footage can appeal to entirely different buyers because of street width, topography, privacy, school access or proximity to commercial corridors.",
      "This is why neighborhood expertise at the luxury level becomes unusually granular. Good guidance starts with the map, but it ends at the curb.",
    ],
  },
];

export const testimonials = [
  {
    name: "Private Seller",
    quote:
      "Avery brought discipline to a complicated sale. Every decision felt deliberate, communication was exact, and our privacy was protected from the first conversation through closing.",
  },
  {
    name: "Beverly Hills Buyer",
    quote:
      "The value was not simply access to homes. It was knowing which opportunities deserved our attention and which did not.",
  },
  {
    name: "Family Office Advisor",
    quote:
      "A rare combination of market fluency and discretion. The process was calm even when the transaction itself was complex.",
  },
  {
    name: "Malibu Seller",
    quote:
      "The positioning was thoughtful, the presentation was beautiful, and the buyer pool was qualified before they ever entered the property.",
  },
  {
    name: "Architectural Client",
    quote:
      "Avery understood the house as architecture, not just inventory. That changed the way the property was discussed and ultimately valued.",
  },
  {
    name: "International Buyer",
    quote:
      "We were able to make decisions from abroad with confidence because every detail was organized and every tradeoff was explained clearly.",
  },
];

export const networkCities = [
  "Los Angeles",
  "New York",
  "Palm Beach",
  "London",
  "Paris",
  "Madrid",
  "Milan",
  "Dubai",
  "Sydney",
  "Mexico City",
  "Vancouver",
  "Aspen",
];
