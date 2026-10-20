/** Default catalog and imagery for the Arden Wine Country template. */

export const images = {
  hero: "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/5c/5c7c67af0b23d6d1932a869d0ac510bcd13f2fed0e79bafb046bfc5e17594636.jpg",
  landscape:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/e2/e2edb52297054ad21d41b92f43731be14905fc7d46ba4abad34c9568aca3cfe2.jpg",
  pool: "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/ea/ea247bacdec1b6722e3974bdf828872551a5cd7e0c48771a21e8701c77d1ba8a.jpg",
  modern:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/1e/1ed143b314190d566fc936af54e34305b949c364538c861405dbfe2617b8e287.jpg",
  dusk: "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/d2/d2126a1c761d6bbafe001f2787952b5e5a5b69a4fbb9fb0b69d245a41977a08f.jpg",
  agent:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/5c/5c8cbc4e8201ead445361b0c1cb937e12f10039bf1a6a8cfd9edcd4b64a5a688.jpg",
  agent2:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/bd/bd4148b64f87fc0597573aee54b2dccea1c87f740067820cb12866aa65e548b2.jpg",
  agent3:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/5d/5d1618976e0f7e4f5c654e6946ef39855ce1af3a0b8d42233c5fe2d8dbc650ed.jpg",
};

export const properties = [
  {
    slug: "glass-house-overlook",
    title: "Glass House Overlook",
    location: "St. Helena, California",
    price: "$18,750,000",
    status: "For Sale",
    beds: 6,
    baths: 8,
    sqft: "9,240",
    acres: "14.2",
    image: images.modern,
    gallery: [images.modern, images.hero, images.landscape, images.pool],
    excerpt:
      "A private modern compound above the valley floor with broad vineyard views and gallery-like interiors.",
    description: [
      "Set above a quiet ribbon of vineyards, Glass House Overlook balances architectural clarity with the warmth of Wine Country living. Floor-to-ceiling glass frames layered ridgelines while limestone, oak, and hand-finished plaster create a calm, tactile interior.",
      "The main residence opens to a long terrace, pool, outdoor kitchen, and intimate garden rooms. A detached guest pavilion, private office, temperature-controlled wine room, and generous entertaining spaces make the property equally suited to weekends or full-time living.",
    ],
    features: [
      "Infinity-edge pool",
      "Detached guest pavilion",
      "Wine cellar",
      "Outdoor kitchen",
      "3-car garage",
      "Vineyard views",
    ],
  },
  {
    slug: "oak-knoll-courtyard-estate",
    title: "Oak Knoll Courtyard Estate",
    location: "Napa, California",
    price: "$13,900,000",
    status: "For Sale",
    beds: 5,
    baths: 7,
    sqft: "7,180",
    acres: "3.8",
    image: images.pool,
    gallery: [images.pool, images.dusk, images.modern, images.landscape],
    excerpt:
      "A serene courtyard residence pairing old-world materials with a crisp, contemporary plan.",
    description: [
      "Designed around a series of protected courtyards, this estate is defined by privacy, proportion, and effortless indoor-outdoor flow. Mature olives and clipped hedges soften the architecture while broad openings connect nearly every room to garden or terrace.",
      "A chef's kitchen, fireside great room, library, pool house, and guest suite compose an inviting retreat moments from Napa's restaurants and wineries.",
    ],
    features: [
      "Pool house",
      "Library",
      "Chef's kitchen",
      "Guest suite",
      "Mature gardens",
      "Gated entry",
    ],
  },
  {
    slug: "yountville-vineyard-residence",
    title: "Yountville Vineyard Residence",
    location: "Yountville, California",
    price: "$11,500,000",
    status: "Private",
    beds: 4,
    baths: 5,
    sqft: "5,980",
    acres: "2.1",
    image: images.landscape,
    gallery: [images.landscape, images.hero, images.pool, images.modern],
    excerpt:
      "A discreet vineyard-edge residence within minutes of Yountville's celebrated dining scene.",
    description: [
      "Hidden behind a quiet country lane, this warm modern residence offers a rare combination of privacy and proximity. Vineyard rows stretch beyond the rear lawn, creating a changing seasonal backdrop from nearly every living space.",
      "The home's relaxed material palette and restrained architecture keep attention on the landscape, while resort-like amenities make extended stays exceptionally comfortable.",
    ],
    features: [
      "Vineyard frontage",
      "Heated pool",
      "Outdoor fireplace",
      "Media room",
      "Guest casita",
      "Walkable location",
    ],
  },
  {
    slug: "sonoma-ridge-retreat",
    title: "Sonoma Ridge Retreat",
    location: "Sonoma, California",
    price: "$7,950,000",
    status: "For Sale",
    beds: 4,
    baths: 5,
    sqft: "5,420",
    acres: "8.4",
    image: images.dusk,
    gallery: [images.dusk, images.pool, images.landscape, images.modern],
    excerpt:
      "A relaxed hillside retreat with dramatic sunset views, layered gardens, and a resort-style pool terrace.",
    description: [
      "This ridge-top residence was conceived as a sequence of quiet spaces connected to the outdoors. The scale is generous without feeling formal, and the landscaping creates a sense of seclusion from every angle.",
      "Multiple terraces, a pool and spa, outdoor dining court, orchard, and guest accommodations create a private Wine Country base with easy access to Sonoma Plaza.",
    ],
    features: [
      "Sunset views",
      "Pool and spa",
      "Orchard",
      "Guest quarters",
      "Outdoor dining",
      "Private drive",
    ],
  },
  {
    slug: "rutherford-farmhouse-lease",
    title: "Rutherford Farmhouse",
    location: "Rutherford, California",
    price: "$42,000/mo",
    status: "For Lease",
    beds: 5,
    baths: 5,
    sqft: "5,310",
    acres: "4.0",
    image: images.hero,
    gallery: [images.hero, images.landscape, images.pool, images.modern],
    excerpt:
      "A furnished seasonal lease with vineyard views, broad lawns, and a pool set behind mature trees.",
    description: [
      "Available furnished, this gracious farmhouse places guests in the center of the valley while maintaining a rare feeling of quiet. Interiors are bright, comfortable, and tailored for long stays.",
      "The grounds include a pool, lawn, dining terrace, and walking paths through a small vineyard block.",
    ],
    features: [
      "Furnished",
      "Pool",
      "Vineyard views",
      "Weekly housekeeping available",
      "Outdoor dining",
      "Private setting",
    ],
  },
  {
    slug: "calistoga-garden-house",
    title: "Calistoga Garden House",
    location: "Calistoga, California",
    price: "$8,200,000",
    status: "Sold",
    beds: 4,
    baths: 4,
    sqft: "4,860",
    acres: "5.7",
    image: images.modern,
    gallery: [images.modern, images.dusk, images.pool, images.landscape],
    excerpt:
      "A refined garden estate at the northern end of Napa Valley, sold after a discreet international campaign.",
    description: [
      "A serene residence surrounded by established gardens, mountain views, and a small olive grove.",
    ],
    features: [
      "Mountain views",
      "Olive grove",
      "Pool",
      "Guest cottage",
      "Garden pavilion",
      "Private well",
    ],
  },
];

export const agents = [
  {
    slug: "alexandra-vale",
    name: "Alexandra Vale",
    role: "Founder · Luxury Real Estate Advisor",
    image: images.agent,
    phone: "707.555.0148",
    email: "alexandra@ardenvale.com",
    license: "CA DRE# 01234567",
    intro:
      "$2.1B+ in career sales with a focus on architecturally significant homes, vineyards, and legacy estates.",
    bio: [
      "Alexandra founded Arden Vale + Co. after two decades representing discerning buyers and sellers throughout Northern California. Her work is grounded in careful preparation, sharp market positioning, and a belief that exceptional homes deserve exceptional storytelling.",
      "Her clients include founders, collectors, vintners, and multigenerational families seeking both privacy and reach. Alexandra's network extends from San Francisco and Silicon Valley to key international markets, giving clients access to opportunities that often never reach the public market.",
      "Outside of real estate, she supports local arts, land preservation, and community food programs across Napa and Sonoma counties.",
    ],
  },
  {
    slug: "julian-reed",
    name: "Julian Reed",
    role: "Partner · Real Estate Advisor",
    image: images.agent2,
    phone: "707.555.0193",
    email: "julian@ardenvale.com",
    license: "CA DRE# 02345678",
    intro:
      "A fifth-generation North Bay native combining deep local knowledge with modern marketing and negotiation strategy.",
    bio: [
      "Julian grew up between Sonoma and Napa and brings a practical knowledge of the region's neighborhoods, back roads, vineyards, and development patterns to every assignment.",
      "Before real estate, he led guest experience and brand teams for several acclaimed hospitality groups. That background now informs an unusually service-focused approach to real estate and a strong eye for presentation.",
    ],
  },
  {
    slug: "maya-bennet",
    name: "Maya Bennet",
    role: "Real Estate Advisor",
    image: images.agent3,
    phone: "415.555.0172",
    email: "maya@ardenvale.com",
    license: "CA DRE# 03456789",
    intro:
      "A detail-driven advisor specializing in design-conscious homes and second residences across Wine Country.",
    bio: [
      "Maya pairs a design background with rigorous market analysis, helping clients understand both the emotional and long-term value of a property.",
      "Her practice is focused on Napa, Yountville, St. Helena, Sonoma, and the surrounding countryside.",
    ],
  },
];

export const neighborhoods = [
  {
    slug: "st-helena",
    name: "St. Helena",
    image: images.hero,
    tagline: "A refined small town at the center of Napa Valley life.",
    about:
      "St. Helena pairs a walkable historic core with some of the valley's most coveted country properties. Restaurants, galleries, independent shops, and renowned wineries make daily life feel polished without losing its small-town rhythm.",
  },
  {
    slug: "yountville",
    name: "Yountville",
    image: images.landscape,
    tagline:
      "Culinary culture, vineyard views, and an unusually walkable Wine Country lifestyle.",
    about:
      "Compact and beautifully maintained, Yountville is prized for its restaurants, tasting rooms, public art, and immediate access to vineyards. Homes range from in-town cottages to private estates just beyond the village grid.",
  },
  {
    slug: "napa",
    name: "Napa",
    image: images.pool,
    tagline: "A vibrant city with riverfront energy and quick access to the entire valley.",
    about:
      "Napa offers the broadest mix of neighborhoods in the region, from historic homes near downtown to contemporary estates in the surrounding hills and vineyard districts.",
  },
  {
    slug: "rutherford",
    name: "Rutherford",
    image: images.modern,
    tagline: "Quiet country roads and legendary vineyard land in the heart of the valley.",
    about:
      "Rutherford is understated and rural, defined by vineyard acreage, destination wineries, and a small collection of distinctive estates positioned between Yountville and St. Helena.",
  },
  {
    slug: "sonoma",
    name: "Sonoma",
    image: images.dusk,
    tagline: "Historic California character with an easy, relaxed pace.",
    about:
      "Centered on its landmark plaza, Sonoma blends deep history with a lively food and wine culture. The surrounding valley offers ranches, vineyard estates, and hillside retreats in every direction.",
  },
  {
    slug: "glen-ellen",
    name: "Glen Ellen",
    image: images.hero,
    tagline: "Wooded lanes, intimate vineyards, and a quiet village atmosphere.",
    about:
      "Glen Ellen has a secluded, romantic quality with small restaurants, creeks, trails, and homes tucked into the landscape. Buyers come for privacy without being far from Sonoma.",
  },
  {
    slug: "kenwood",
    name: "Kenwood",
    image: images.landscape,
    tagline: "Open countryside beneath Sugarloaf Ridge and Bennett Mountain.",
    about:
      "Kenwood is known for vineyard views, resorts, and country properties with a stronger sense of space. It is an ideal base for buyers seeking acreage and access to outdoor recreation.",
  },
  {
    slug: "calistoga",
    name: "Calistoga",
    image: images.pool,
    tagline: "Hot springs, mountain scenery, and an independent northern-valley spirit.",
    about:
      "Calistoga feels distinctly its own, with historic architecture, spa culture, mountain views, and a slower rhythm than the valley's more central towns.",
  },
  {
    slug: "healdsburg",
    name: "Healdsburg",
    image: images.dusk,
    tagline: "A sophisticated plaza town surrounded by three celebrated wine regions.",
    about:
      "Healdsburg combines a polished town center with quick access to Dry Creek, Russian River, and Alexander Valley. Its mix of design, restaurants, and countryside has made it one of Northern California's most desirable second-home markets.",
  },
];

export const posts = [
  {
    slug: "buying-a-wine-country-home",
    title: "Buying a Wine Country Home: What Matters Beyond the View",
    dek: "A practical framework for evaluating land, privacy, access, and long-term value.",
    date: "August 12, 2026",
    image: images.hero,
    category: "Buyer Guide",
    body: [
      "A memorable view may be what draws you to a Wine Country property, but the best purchases hold up under a much more detailed review.",
      "Start with the land. Water, access, slope, drainage, vegetation management, and future use can matter as much as the house itself. In rural Napa and Sonoma, two properties that look similar on paper may have very different maintenance profiles and long-term flexibility.",
      "Then consider how you actually want to live. Some buyers want absolute privacy; others discover that being ten minutes closer to town changes how often they use a second home. The right choice is rarely about maximizing every feature. It is about understanding which tradeoffs fit your life.",
    ],
  },
  {
    slug: "preparing-an-estate-for-market",
    title: "Preparing a Luxury Estate for Market",
    dek: "Why positioning begins months before photography and launch day.",
    date: "July 29, 2026",
    image: images.modern,
    category: "Seller Strategy",
    body: [
      "The most successful luxury launches are designed well before a property is publicly listed.",
      "Preparation may include selective landscape work, lighting, painting, editing furnishings, repairing visual distractions, and documenting systems that sophisticated buyers will want to understand. Each improvement should support the same market position rather than simply making the house look newer.",
      "Once the property is ready, photography, film, editorial copy, and broker outreach should tell one coherent story. In the upper end of the market, consistency creates confidence.",
    ],
  },
  {
    slug: "a-weekend-in-st-helena",
    title: "A Quiet Weekend in St. Helena",
    dek: "Where to eat, wander, and slow down between appointments.",
    date: "July 10, 2026",
    image: images.landscape,
    category: "Lifestyle",
    body: [
      "St. Helena is compact enough to experience without an itinerary, which is part of its appeal.",
      "Begin with coffee and a walk through town, spend the middle of the day at a winery or on a shaded trail, and leave the evening open for a long dinner. The best weekends here tend to have just one or two anchors and plenty of room between them.",
      "For buyers considering the area, that rhythm is useful to experience firsthand. The appeal of St. Helena is not only what is available; it is how easily daily life flows from one thing to the next.",
    ],
  },
  {
    slug: "sonoma-vs-napa",
    title: "Sonoma or Napa: Two Distinct Wine Country Lifestyles",
    dek: "A useful comparison for second-home buyers deciding where to focus.",
    date: "June 22, 2026",
    image: images.dusk,
    category: "Market Notes",
    body: [
      "Napa and Sonoma are often grouped together, but they feel different in ways that matter to buyers.",
      "Napa is linear, polished, and concentrated around a relatively narrow valley. Sonoma is broader and more varied, with multiple town centers and a looser relationship between vineyards, countryside, and coast.",
      "Neither is categorically better. The more useful question is which rhythm, geography, and housing stock fit the way you want to spend time.",
    ],
  },
];

export const press = [
  {
    publication: "Architectural Digest",
    title: "Inside a Restored Stone Estate Above the Napa Valley",
    copy: "A sensitive renovation brings contemporary restraint to a century-old property.",
  },
  {
    publication: "Mansion Global",
    title: "Wine Country Buyers Return to Privacy and Land",
    copy: "Large parcels and thoughtful outdoor spaces shape the newest luxury demand.",
  },
  {
    publication: "The Wall Street Journal",
    title: "A Modern Compound Rises Above St. Helena",
    copy: "A design-forward home pairs panoramic vineyard views with gallery-like interiors.",
  },
  {
    publication: "Forbes",
    title: "The New Playbook for Marketing Legacy Estates",
    copy: "Why global distribution and private networks matter at the top of the market.",
  },
  {
    publication: "Robb Report",
    title: "A Sonoma Retreat Designed Around the Golden Hour",
    copy: "Indoor-outdoor rooms make the most of a dramatic west-facing ridge.",
  },
  {
    publication: "Financial Times",
    title: "California Wine Country's Enduring Global Appeal",
    copy: "International buyers continue to treat Napa and Sonoma as long-term lifestyle markets.",
  },
];

export const films = [
  {
    image: images.hero,
    title: "Presenting Glass House Overlook",
    copy: "A modern St. Helena estate above the valley floor.",
  },
  {
    image: images.dusk,
    title: "A Ridge Above Sonoma",
    copy: "An evening tour of a private hillside retreat.",
  },
  {
    image: images.landscape,
    title: "The Yountville Edge",
    copy: "Vineyard frontage moments from the center of town.",
  },
  {
    image: images.pool,
    title: "Courtyard Living in Oak Knoll",
    copy: "Old-world materials meet a clean contemporary plan.",
  },
];

export const testimonials = [
  {
    quote:
      "Arden Vale understood that our home needed a very specific buyer. The launch was thoughtful, calm, and beautifully executed from beginning to end.",
    cite: "M + R · St. Helena",
  },
  {
    quote:
      "We came in thinking we wanted Napa and ended up in Sonoma. The team's local perspective saved us months of looking in the wrong places.",
    cite: "C + J · Sonoma",
  },
  {
    quote:
      "Every detail was handled. We always knew what was happening, why it mattered, and what the next decision would be.",
    cite: "A. K. · Yountville",
  },
  {
    quote:
      "Their network was the difference. The eventual buyer first heard about the property privately, before we ever went to market.",
    cite: "D. S. · Napa",
  },
];
