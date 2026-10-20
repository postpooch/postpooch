/**
 * Seed catalog for the Rey (Elena Vale) template.
 * Listing data is legacy — tenant properties live in `public.properties`.
 */

const img = {
  crestline:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/8e/8e8405903cd67d9a146012feb32c68eb048c0a6e49a3f0e052f55cc9723defb5.webp",
  oakInterior:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/61/610e7e2b46e98d1c9c08a4bff1ddec5698978ce8fb7349035e2e7834c5ed4cf7.webp",
  glassPool:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/16/167db1211761df5ef92cd22ff8d2c895165db6afd9a2db33d49eb72424b9366b.webp",
  canyon:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/b3/b3e1bd022b2a11d9f37b7417997093bfc2c8e232c80cd22be5a87122534b64aa.webp",
  modernHouse:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/74/74258fd5415869b37c20d06a9ec82c66bc715c832f638a40ec96a0435f46829a.webp",
  livingRoom:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/80/8068c3fb50668b3a57fd1268df6247a7089718c794c47a1d4a352d9ffca0f1f0.webp",
  pacific:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/5a/5af419de974698a6fea227dd616202b74acc4bd3c644d8385060ce6840f65324.webp",
  bedroom:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/dd/dd4011fcf5dc48fdcf28cc439c88037ba7570e11c845cb83313a749484cd2485.webp",
  interiorStone:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/cf/cfd64e70d112ac64952afd2e7c9e771f3c2c6700cd0b3bae0e5d44f34da1b063.webp",
  montecito:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/45/4581a9b837ee4e181b3b653ebeaf90e23e527435fd7f89199e3edaf4696e19fb.webp",
  kitchen:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/e3/e34ef1499c3249be6a2885effeff65d67bd779bff4a4634cc76ff71fdbd10ef2.webp",
  lounge:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/03/03095408828339e108aaf797e70f90ac2190c6dae834502b762bca51244e43f5.webp",
  trousdale:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/9b/9b8b218b1969a6338e5a4983ae63b159df1ac481709bd6554066b5cfbdddd517.webp",
  courtyard:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/8f/8f917973a6279348624b86f7821e55874318ee04c114741c3591b4f3668ce35f.webp",
  penthouse:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/a3/a378039ba67b80ec774674108d450e980551960c382ff6adc7debcf706dde705.webp",
  penthouseInterior:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/32/329c86201513133e745759540ea460794de7be0cc28ce8c3e0a1df19e0f53d6d.webp",
  beverlyHills:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/8c/8c017b984f065081f7153095985d72b35dcc38a38c615cd7fd4bbc9c6a4f9a82.webp",
  belAir:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/96/9675b1a69b0066dd40a7597ba68317c45f7e211c314c748f4d39830f71425f72.webp",
  malibu:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/e2/e23a031c993c9e9fc27a79c73196465e1810aa409de078e283ed00f4acc3ca48.webp",
  palisades:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/dd/dd9df3c3a5f42394145e13b7ca5ff5579a7d3e83a6bf5a73eee36d020845ab36.webp",
  portrait:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/f5/f57e696ba69324025b9208b077fd953ee467f86d4f3ea1f08ff42d1935ff7bdf.webp",
  james:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/61/61d79e0d4f2219fd1363744b010148bfe11c4818acaca346dadfb87ae5865a8b.webp",
  sophia:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/3b/3b3de3f6441e7b7d34571840b5483e16c27577dba9f43d03fda7b1bd9ef9cf9e.webp",
  marcus:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/1c/1ccfd0c534af9e427b5ad1757846c1209341f642c1ab94d1c88c678022670cc6.webp",
  claire:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/00/00c9cd4d447be774fbd250a8388e1c73bda61e0a0d5c4b3012622c697c722846.webp",
  oliver:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/d8/d878f753260257fbdfb4272a9b71052900833dbf478df49494a6b08110608cb9.webp",
  team:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/6f/6f04e5907dc0640fb3266391f5adde6f71d9d8bdd710700d34a1416805238b40.webp",
  communitiesHero:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/6e/6e8a757ad0a53b8cb4e6bcc291d432c9815634a2d44b04305e435738e3cf1a1e.webp",
  testimonials:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/10/10347dae849a937359001f92bf2d16ce80cd883d509907b8c2465136953429a4.webp",
} as const;

export const images = img;

export const properties = [
  {
    slug: "crestline-modern",
    address: "1420 Crestline Drive",
    city: "Beverly Hills, California",
    price: "$31,500,000",
    beds: 6,
    baths: 9,
    sqft: "11,420",
    lot: "0.83 ac",
    image: img.crestline,
    gallery: [img.crestline, img.oakInterior, img.glassPool],
    description: [
      "A sculptural contemporary residence set above the city, Crestline pairs monumental architecture with a serene, highly livable interior. Walls of glass frame layered views while warm stone, pale oak, and hand-finished plaster soften the modern geometry.",
      "The main level is composed for effortless entertaining with a formal salon, dining gallery, chef's kitchen, temperature-controlled wine room, and expansive terraces that open to a horizon-edge pool. The private primary wing includes dual dressing rooms, a spa bath, and a secluded garden court.",
      "A screening room, wellness studio, guest suites, staff quarters, and six-car gallery complete a home designed for both privacy and large-scale hospitality.",
    ],
  },
  {
    slug: "canyon-house",
    address: "880 Canyon View Road",
    city: "Bel Air, California",
    price: "$24,750,000",
    beds: 5,
    baths: 7,
    sqft: "9,860",
    image: img.canyon,
    gallery: [img.canyon, img.modernHouse, img.livingRoom],
    description: [
      "Hidden behind mature olive trees, this quietly dramatic Bel Air estate is arranged around courtyards, water, and gardens. The architecture emphasizes proportion and natural light rather than spectacle.",
      "A double-height entry leads to formal and informal living spaces, a library, chef's kitchen, and a primary suite opening directly to the garden. Outdoor rooms include a covered dining pavilion, fire lounge, pool, and broad lawn.",
      "The property offers five bedroom suites, a gym, media room, detached guest studio, and discreet service access.",
    ],
  },
  {
    slug: "pacific-house",
    address: "24700 Pacific Coast Highway",
    city: "Malibu, California",
    price: "$19,995,000",
    beds: 4,
    baths: 6,
    sqft: "5,740",
    image: img.pacific,
    gallery: [img.pacific, img.bedroom, img.interiorStone],
    description: [
      "An intimate oceanfront residence where every principal room turns toward the Pacific. Soft limestone, natural timber, and hand-troweled plaster create a restrained palette that lets the view remain the focus.",
      "Retractable glass connects the great room to a broad ocean terrace with spa and fire feature. The primary suite occupies its own level with an office, dressing room, and private deck.",
      "Direct beach access, a media lounge, guest suites, and a two-car garage make this a rare turnkey retreat on one of Malibu's most coveted stretches of coastline.",
    ],
  },
  {
    slug: "montecito-grove",
    address: "121 East Valley Lane",
    city: "Montecito, California",
    price: "$16,800,000",
    beds: 7,
    baths: 8,
    sqft: "8,210",
    image: img.montecito,
    gallery: [img.montecito, img.kitchen, img.lounge],
    description: [
      "A romantic Montecito compound set amid citrus, ancient oaks, and clipped gardens. The residence draws from classic Mediterranean forms while the interiors are calm, contemporary, and highly edited.",
      "French doors open from the principal rooms to loggias and terraces. A guest house, pool pavilion, library, chef's kitchen, and detached studio create flexibility for extended stays and multigenerational living.",
      "The property balances privacy and proximity, just minutes from the Upper Village and coast.",
    ],
  },
  {
    slug: "trousdale-pavilion",
    address: "560 Carla Ridge",
    city: "Trousdale Estates, California",
    price: "$14,900,000",
    beds: 4,
    baths: 6,
    sqft: "6,320",
    image: img.trousdale,
    gallery: [img.trousdale, img.courtyard, img.kitchen],
    description: [
      "A single-level architectural pavilion with uninterrupted city views and a focus on indoor-outdoor living. The home is organized around a series of courtyards and reflective pools.",
      "Custom millwork, stone floors, gallery walls, and expansive glazing create an elegant setting for art and entertaining. The primary suite is positioned for complete privacy with its own terrace and outdoor shower.",
      "A screening room, gym, office, and full outdoor kitchen round out the program.",
    ],
  },
  {
    slug: "ocean-avenue-penthouse",
    address: "101 Ocean Avenue, Penthouse",
    city: "Santa Monica, California",
    price: "$11,250,000",
    beds: 3,
    baths: 4,
    sqft: "4,180",
    image: img.penthouse,
    gallery: [img.penthouse, img.lounge, img.penthouseInterior],
    description: [
      "An expansive penthouse above Ocean Avenue with cinematic coastline views and a private elevator entry. The interiors combine richly veined stone, oak, bronze, and soft neutral textiles.",
      "The open living and dining spaces connect to a wraparound terrace, while the primary suite enjoys a private sitting room and dual baths. A library and media room provide quiet counterpoints to the central entertaining spaces.",
      "Full-service building amenities include valet, security, fitness, pool, and concierge.",
    ],
  },
];

export const communities = [
  {
    slug: "beverly-hills",
    name: "Beverly Hills",
    tagline: "Legacy estates and iconic California glamour",
    image: img.beverlyHills,
    intro:
      "Beverly Hills offers a rare combination of privacy, architectural pedigree, world-class dining, and a remarkably intimate neighborhood scale. From the Flats to Trousdale, each pocket has its own rhythm and point of view.",
    stats: [
      { label: "Typical luxury range", value: "$6M–$35M+" },
      { label: "Known for", value: "Estate streets" },
      { label: "Lifestyle", value: "Polished & private" },
    ],
  },
  {
    slug: "bel-air",
    name: "Bel Air",
    tagline: "Secluded compounds above the city",
    image: img.belAir,
    intro:
      "Bel Air is defined by privacy, scale, and a sense of removal from the city below. Winding roads reveal architectural compounds, gated gardens, and panoramic views in one of Los Angeles' most enduring estate enclaves.",
    stats: [
      { label: "Typical luxury range", value: "$8M–$50M+" },
      { label: "Known for", value: "Large compounds" },
      { label: "Lifestyle", value: "Private & serene" },
    ],
  },
  {
    slug: "malibu",
    name: "Malibu",
    tagline: "Oceanfront architecture and effortless living",
    image: img.malibu,
    intro:
      "Malibu's luxury market is shaped by the Pacific itself—from intimate beach houses to blufftop estates with sweeping coastline views. The result is a lifestyle that feels both elevated and relaxed.",
    stats: [
      { label: "Typical luxury range", value: "$5M–$30M+" },
      { label: "Known for", value: "Beachfront homes" },
      { label: "Lifestyle", value: "Coastal & relaxed" },
    ],
  },
  {
    slug: "montecito",
    name: "Montecito",
    tagline: "Gardens, privacy, and understated grandeur",
    image: img.montecito,
    intro:
      "Montecito blends resort-like calm with exceptional architecture and acreage. Historic estates, new compounds, mature gardens, and proximity to the coast create an environment of quiet refinement.",
    stats: [
      { label: "Typical luxury range", value: "$7M–$40M+" },
      { label: "Known for", value: "Garden estates" },
      { label: "Lifestyle", value: "Quiet luxury" },
    ],
  },
  {
    slug: "pacific-palisades",
    name: "Pacific Palisades",
    tagline: "Village life between mountains and sea",
    image: img.palisades,
    intro:
      "Pacific Palisades is prized for its strong neighborhood identity, coastal light, canyon streets, and a sophisticated village center. Homes range from classic traditional residences to striking contemporary builds.",
    stats: [
      { label: "Typical luxury range", value: "$4M–$20M+" },
      { label: "Known for", value: "Coastal canyons" },
      { label: "Lifestyle", value: "Village & outdoors" },
    ],
  },
  {
    slug: "brentwood",
    name: "Brentwood",
    tagline: "Refined Westside living with room to breathe",
    image: img.oakInterior,
    intro:
      "Brentwood pairs broad residential streets and substantial homes with easy access to dining, culture, schools, and the coast. It is one of the Westside's most consistently desirable luxury markets.",
    stats: [
      { label: "Typical luxury range", value: "$4M–$18M+" },
      { label: "Known for", value: "Tree-lined streets" },
      { label: "Lifestyle", value: "Connected & calm" },
    ],
  },
];

export const team = [
  {
    slug: "elena-vale",
    name: "Elena Vale",
    role: "Founder & Luxury Estate Advisor",
    license: "CalDRE #01234567",
    phone: "310.555.0148",
    email: "elena@elenavale.com",
    image: img.portrait,
    bio: [
      "For more than three decades, Elena Vale has represented exceptional homes and discerning clients throughout Southern California. Her practice is built around discretion, rigorous market knowledge, and a highly personal style of representation.",
      "Elena is known for guiding complex transactions with composure and exacting attention to detail. Her business spans landmark estates, architectural properties, coastal residences, and confidential off-market opportunities.",
      "Beyond real estate, Elena supports arts education and housing initiatives across Los Angeles and mentors the next generation of luxury advisors.",
    ],
  },
  {
    slug: "james-carter",
    name: "James Carter",
    role: "Estate Director",
    license: "CalDRE #02014562",
    phone: "310.555.0181",
    email: "james@elenavale.com",
    image: img.james,
    bio: [
      "James brings a measured, analytical approach to complex residential transactions across Beverly Hills, Bel Air, and the Westside.",
      "His background in development and architecture gives clients a practical perspective on value, renovation potential, and long-term positioning.",
    ],
  },
  {
    slug: "sophia-bennett",
    name: "Sophia Bennett",
    role: "Luxury Property Specialist",
    license: "CalDRE #02133418",
    phone: "310.555.0113",
    email: "sophia@elenavale.com",
    image: img.sophia,
    bio: [
      "Sophia specializes in design-forward homes and coastal properties, working closely with clients who value architecture, privacy, and a strong sense of place.",
      "Her calm communication and thoughtful preparation have made her a trusted advisor to both first-time luxury buyers and seasoned collectors.",
    ],
  },
  {
    slug: "marcus-lee",
    name: "Marcus Lee",
    role: "Senior Sales Associate",
    license: "CalDRE #01988421",
    phone: "310.555.0162",
    email: "marcus@elenavale.com",
    image: img.marcus,
    bio: [
      "Marcus combines deep neighborhood fluency with a strong negotiation background and an international network of buyers.",
      "He focuses on Beverly Hills, Hollywood Hills, and architecturally significant homes throughout Los Angeles.",
    ],
  },
  {
    slug: "claire-morgan",
    name: "Claire Morgan",
    role: "Client Strategy",
    license: "CalDRE #02201477",
    phone: "310.555.0194",
    email: "claire@elenavale.com",
    image: img.claire,
    bio: [
      "Claire leads client strategy and launch planning for the team's most complex listings, coordinating presentation, editorial, digital, and private outreach.",
      "Her approach is built on clarity, consistency, and meticulous execution from preparation through closing.",
    ],
  },
  {
    slug: "oliver-grant",
    name: "Oliver Grant",
    role: "Buyer Advisory",
    license: "CalDRE #02191802",
    phone: "310.555.0177",
    email: "oliver@elenavale.com",
    image: img.oliver,
    bio: [
      "Oliver advises buyers across Southern California's most competitive luxury submarkets with a focus on access, valuation, and long-horizon decision making.",
      "He is especially experienced with relocations, confidential inventory, and complex multi-property searches.",
    ],
  },
];

export const testimonials = [
  {
    title: "A remarkable level of care",
    quote:
      "Elena understood that the sale was both a financial decision and a deeply personal one. Every detail was handled calmly, privately, and with exceptional judgment.",
    name: "Private Client",
    role: "Beverly Hills",
  },
  {
    title: "Measured and deeply informed",
    quote:
      "We never felt pushed. We felt advised. The team's knowledge of the market, the homes, and the people involved changed the outcome for us.",
    name: "D. & M. H.",
    role: "Bel Air",
  },
  {
    title: "Presentation at the highest level",
    quote:
      "From the first creative review to the final negotiation, the process felt bespoke. The marketing was beautiful, but more importantly it was strategic.",
    name: "Estate Seller",
    role: "Montecito",
  },
  {
    title: "Access we could not find elsewhere",
    quote:
      "Our search depended on seeing opportunities before they reached the broader market. Elena's relationships opened doors without ever compromising discretion.",
    name: "International Buyer",
    role: "Los Angeles",
  },
  {
    title: "Composed under pressure",
    quote:
      "There were several difficult turns in escrow. The team remained steady, protected our priorities, and kept everyone moving toward the same result.",
    name: "A. R.",
    role: "Pacific Palisades",
  },
  {
    title: "The standard for representation",
    quote:
      "This was our third transaction together. The consistency is what stands out—thoughtful advice, prompt communication, and excellent instincts every single time.",
    name: "Repeat Client",
    role: "Southern California",
  },
];

export const press = [
  {
    source: "Architectural Digest",
    title: "Inside the New Generation of California Estate Design",
    year: "2026",
  },
  {
    source: "The Wall Street Journal",
    title: "A Quiet Shift at the Very Top of Los Angeles Luxury",
    year: "2026",
  },
  {
    source: "Robb Report",
    title: "Five Homes Redefining Indoor-Outdoor Living",
    year: "2025",
  },
  {
    source: "Forbes",
    title: "What Global Buyers Want From Southern California Now",
    year: "2025",
  },
  {
    source: "Mansion Global",
    title: "Why Privacy Is the New Premium in High-End Real Estate",
    year: "2025",
  },
  {
    source: "Los Angeles Times",
    title: "The Return of the Classic California Estate",
    year: "2024",
  },
  {
    source: "Financial Times",
    title: "Design, Land and Legacy Drive West Coast Trophy Sales",
    year: "2024",
  },
  {
    source: "Departures",
    title: "The Advisors Behind California's Most Coveted Addresses",
    year: "2024",
  },
];
