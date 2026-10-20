/** Demo catalog defaults for the Rowan template (from rowan-estates-inspired). */

export const IMG = {
  hero: "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/e0/e04a92780277eb94e4c69be7e138efb655152e3eea003e184d445034bef15ca5.webp",
  winter: "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/79/7995f361d261ad96f70d763c9a0ca7b7680da85940b92917133bbbb0eb043643.jpg",
  estate: "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/50/50581dc08fc5a48206082ae73bdb3243eefc07ae0538395187950f33e0ffe6b8.avif",
  treehouse: "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/89/897aa9e7ab68e9bc70981467906f4e7d0fe29e1b4fd38e4514207e0d70b8c91f.avif",
  agent: "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/2f/2ffe03c92b7f42253be67e2d641e4a8e42f55a25da9de9cda546007b8f437ce3.avif",
  interior: "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/11/113f42c62d9b875df8c256a05995b0b40812379d4281de93a321da582cdf4179.avif",
  landscape: "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/b3/b31b5a901f33404dc4f9b28a24dc63160c935177df1534d5379f6402046c6ca2.avif",
} as const;

export const projects = [
  {
    slug: "cedar-veil",
    name: "Cedar Veil",
    location: "North Ridge",
    price: "From $1.4M",
    image: IMG.hero,
    eyebrow: "Architecture in the trees",
    facts: [
      "Low-impact contemporary homes",
      "Private wooded settings",
      "Large-format glazing",
    ],
    intro:
      "A quiet collection of contemporary residences shaped around light, privacy and the existing tree canopy.",
    body: [
      "Cedar Veil is imagined for buyers who want modern architecture without losing the feeling of being surrounded by nature. Each residence prioritizes long views, warm natural materials and a measured relationship between indoor and outdoor space.",
      "The design language is intentionally restrained: strong roof lines, calm interiors and carefully framed views. It is less about spectacle and more about a home that feels grounded in its setting.",
    ],
  },
  {
    slug: "north-glass",
    name: "North Glass",
    location: "Alpine District",
    price: "From $2.1M",
    image: IMG.winter,
    eyebrow: "Four-season living",
    facts: [
      "Ski-season access",
      "Expansive entertaining spaces",
      "Turn-key design options",
    ],
    intro:
      "A crisp alpine residence concept where warm interiors meet broad winter views and strong modern geometry.",
    body: [
      "North Glass takes a polished, four-season approach to mountain living. Generous glazing brings changing weather into the experience of the home, while protected terraces and layered interior zones keep the plan comfortable year-round.",
      "The result is a property suited equally to quiet weekends, extended stays and large family gatherings.",
    ],
  },
  {
    slug: "stillwater-ridge",
    name: "Stillwater Ridge",
    location: "Western Foothills",
    price: "From $3.6M",
    image: IMG.estate,
    eyebrow: "Land, privacy, horizon",
    facts: [
      "Estate-scale parcels",
      "Long-range sunset views",
      "Guest-house potential",
    ],
    intro:
      "Generous land and open horizons create a slower, more private expression of luxury living.",
    body: [
      "Stillwater Ridge is designed around space: space between neighbors, space for multigenerational living, and space to shape a property over time. The emphasis is on privacy, landscape and a strong sense of arrival.",
      "For buyers looking beyond a conventional subdivision, the project offers an estate-oriented way to live close to nature without giving up architectural ambition.",
    ],
  },
  {
    slug: "canopy-house",
    name: "Canopy House",
    location: "Forest Reserve",
    price: "By consultation",
    image: IMG.treehouse,
    eyebrow: "A home above the understory",
    facts: [
      "Highly distinctive architecture",
      "Immersive forest setting",
      "Small-footprint concept",
    ],
    intro:
      "A design-led retreat that treats the surrounding forest as the primary room of the house.",
    body: [
      "Canopy House is the most experimental concept in the collection. Elevated volumes reduce the visual footprint at ground level and give everyday rooms an unusual relationship to the surrounding trees.",
      "It is a deliberately singular property for a buyer who values experience, architecture and a sense of discovery more than convention.",
    ],
  },
];

export const listings = [
  {
    slug: "41-pine-shadow-lane",
    address: "41 Pine Shadow Lane",
    location: "North Ridge",
    price: "$1,475,000",
    status: "For sale",
    type: "Architectural residence",
    image: IMG.hero,
    beds: 4,
    baths: 3.5,
    sqft: "3,180",
    acres: "1.2",
    intro:
      "A warm modern home set into mature woodland, with long glass walls, private outdoor rooms and a quiet material palette.",
  },
  {
    slug: "8-alpine-view-court",
    address: "8 Alpine View Court",
    location: "Alpine District",
    price: "$2,240,000",
    status: "For sale",
    type: "Mountain residence",
    image: IMG.winter,
    beds: 5,
    baths: 4.5,
    sqft: "4,420",
    acres: "0.8",
    intro:
      "A four-season mountain home pairing broad views with generous gathering spaces and a restrained contemporary interior.",
  },
  {
    slug: "126-stillwater-ridge",
    address: "126 Stillwater Ridge",
    location: "Western Foothills",
    price: "$3,695,000",
    status: "For sale",
    type: "Private estate",
    image: IMG.estate,
    beds: 5,
    baths: 5,
    sqft: "5,760",
    acres: "4.6",
    intro:
      "An estate-scale property with open horizon views, layered outdoor living and room for guests, work and retreat.",
  },
  {
    slug: "17-canopy-road",
    address: "17 Canopy Road",
    location: "Forest Reserve",
    price: "$1,980,000",
    status: "Private offering",
    type: "Design-led retreat",
    image: IMG.treehouse,
    beds: 3,
    baths: 3,
    sqft: "2,640",
    acres: "2.1",
    intro:
      "A singular forest retreat whose elevated volumes bring the canopy into everyday life while keeping the ground plane remarkably light.",
  },
];

export const testimonials = [
  {
    quote:
      "Avery understood that we were not simply looking for square footage. We were looking for a place with a point of view.",
    name: "Morgan & Elise",
    role: "Buyer clients",
  },
  {
    quote:
      "The presentation was exceptional, but the real difference was the judgment behind every decision—from positioning to negotiation.",
    name: "J. Hart",
    role: "Seller client",
  },
  {
    quote:
      "Every detail felt considered. We always knew what mattered, what could wait, and what the next step was.",
    name: "Claire R.",
    role: "Relocation client",
  },
];
