/** Default catalog data from the Maison Avery source template. */

export const images = {
  hero: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2200&q=88",
  agent:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=88",
  agent2:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=88",
  city1:
    "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1800&q=88",
  city2:
    "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1800&q=88",
  city3:
    "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1800&q=88",
  interior:
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=88",
  kitchen:
    "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1800&q=88",
  bedroom:
    "https://images.unsplash.com/photo-1615529162924-f8605388461d?auto=format&fit=crop&w=1800&q=88",
  footer:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=88",
};

const insightBody = [
  "The best real estate decisions rarely come from one dramatic insight. They come from a sequence of smaller, well-timed decisions made with the right context.",
  "In New York, a home is simultaneously a place to live, a financial asset, a design object, and a negotiation. The challenge is knowing which lens should lead at which moment.",
  "Start with position, not prediction. Markets move, but the job is not to forecast every headline. It is to understand the property's position inside its immediate competitive set: what buyers can choose instead, how those alternatives are presenting, and where this home is meaningfully different.",
  "That framework makes pricing and negotiation more disciplined. It also keeps emotion from becoming strategy.",
  "Photography cannot rescue a confused room, and staging cannot fix a bad floor plan. But thoughtful preparation can help buyers understand scale, function, and atmosphere immediately. The goal is never to disguise the home. It is to make the best version of the truth obvious.",
  "Good representation is a process of reducing uncertainty. Before launch, before an offer, before a board package, and before closing, the next step should already be anticipated. That is what turns a complicated transaction into a manageable one.",
];

export const properties = [
  {
    slug: "park-avenue-residence",
    status: "For Sale",
    price: "$4,850,000",
    address: "860 Park Avenue, Residence 9B",
    city: "Upper East Side, New York",
    beds: 3,
    baths: 3.5,
    sqft: "2,420",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=88",
    image2: images.kitchen,
    image3: images.bedroom,
    blurb:
      "A luminous prewar residence with gracious proportions, custom millwork, and a quietly modern renovation.",
    description:
      "Thoughtful proportions, natural light, and a refined material palette define this residence. The living spaces are designed for both quiet daily life and generous entertaining, with custom details that reveal themselves gradually rather than compete for attention.",
    featured: true,
  },
  {
    slug: "tribeca-loft",
    status: "For Sale",
    price: "$3,995,000",
    address: "77 Hudson Street, Loft 6",
    city: "Tribeca, New York",
    beds: 2,
    baths: 2.5,
    sqft: "2,115",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=88",
    image2: images.interior,
    image3: images.kitchen,
    blurb:
      "Original loft character meets a restrained palette, oversized windows, and exceptional entertaining space.",
    description:
      "Original loft character meets a restrained palette, oversized windows, and exceptional entertaining space. The kitchen is tailored and architectural, balancing integrated storage with durable natural surfaces.",
    featured: true,
  },
  {
    slug: "brooklyn-heights-townhouse",
    status: "In Contract",
    price: "$6,250,000",
    address: "18 Willow Place",
    city: "Brooklyn Heights, Brooklyn",
    beds: 5,
    baths: 4.5,
    sqft: "4,780",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=88",
    image2: images.city3,
    image3: images.bedroom,
    blurb:
      "A four-story brownstone reimagined for contemporary family life, moments from the Promenade.",
    description:
      "A four-story brownstone reimagined for contemporary family life, moments from the Promenade. Private quarters are calm and well separated, with considered lighting, substantial closets, and spa-like baths.",
    featured: false,
  },
  {
    slug: "west-village-penthouse",
    status: "For Sale",
    price: "$8,900,000",
    address: "140 Charles Street, Penthouse",
    city: "West Village, New York",
    beds: 4,
    baths: 4.5,
    sqft: "3,540",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88",
    image2: images.kitchen,
    image3: images.interior,
    blurb:
      "Indoor-outdoor living above the Village with sculptural interiors and skyline terraces.",
    description:
      "Indoor-outdoor living above the Village with sculptural interiors and skyline terraces. Throughout, the home pairs New York character with a more contemporary sense of ease.",
    featured: true,
  },
  {
    slug: "flatiron-corner-loft",
    status: "For Sale",
    price: "$2,750,000",
    address: "12 East 22nd Street, 8A",
    city: "Flatiron, New York",
    beds: 2,
    baths: 2,
    sqft: "1,760",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=88",
    image2: images.bedroom,
    image3: images.kitchen,
    blurb:
      "A sun-washed corner loft with tall ceilings and an architectural kitchen made for long dinners.",
    description:
      "A sun-washed corner loft with tall ceilings and an architectural kitchen made for long dinners. The living spaces are designed for both quiet daily life and generous entertaining.",
    featured: false,
  },
  {
    slug: "soho-cast-iron-loft",
    status: "Private Exclusive",
    price: "$5,600,000",
    address: "96 Greene Street, 4E",
    city: "SoHo, New York",
    beds: 3,
    baths: 3,
    sqft: "2,980",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=88",
    image2: images.hero,
    image3: images.bedroom,
    blurb:
      "Cast-iron romance, gallery scale rooms, and a discreet renovation in one of downtown's most storied blocks.",
    description:
      "Cast-iron romance, gallery scale rooms, and a discreet renovation in one of downtown's most storied blocks. Custom details reveal themselves gradually rather than compete for attention.",
    featured: true,
  },
];

export const neighborhoods = [
  {
    slug: "west-village",
    name: "West Village",
    coords: "40.7358° N, 74.0036° W",
    image: images.city1,
    intro:
      "Tree-lined streets, intimate townhouses, and an enduringly village-scale rhythm.",
  },
  {
    slug: "tribeca",
    name: "Tribeca",
    coords: "40.7163° N, 74.0086° W",
    image:
      "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1600&q=86",
    intro:
      "Monumental lofts, cobblestone blocks, and waterfront calm at downtown scale.",
  },
  {
    slug: "brooklyn-heights",
    name: "Brooklyn Heights",
    coords: "40.6960° N, 73.9933° W",
    image: images.city3,
    intro:
      "Historic brownstones, leafy streets, and Manhattan views from the Promenade.",
  },
  {
    slug: "upper-east-side",
    name: "Upper East Side",
    coords: "40.7736° N, 73.9566° W",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=86",
    intro:
      "Museum Mile, elegant prewar architecture, and polished residential avenues.",
  },
  {
    slug: "flatiron",
    name: "Flatiron",
    coords: "40.7411° N, 73.9897° W",
    image: images.city2,
    intro:
      "Architectural landmarks, loft living, and immediate access to downtown energy.",
  },
  {
    slug: "soho",
    name: "SoHo",
    coords: "40.7233° N, 74.0030° W",
    image:
      "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=1600&q=86",
    intro:
      "Cast-iron façades, gallery-scale lofts, and fashion's downtown flagship district.",
  },
];

export const insights = [
  {
    slug: "the-art-of-pricing",
    title: "The Art of Pricing a Singular Home",
    date: "August 14, 2026",
    category: "Selling",
    image: images.interior,
    excerpt:
      "Why the best pricing strategy starts with positioning, not a price-per-square-foot spreadsheet.",
    body: insightBody,
  },
  {
    slug: "co-op-interview",
    title: "The Co-op Interview, Without the Theater",
    date: "July 28, 2026",
    category: "Buying",
    image: images.city1,
    excerpt:
      "A calmer framework for preparing, presenting, and knowing what not to over-explain.",
    body: insightBody,
  },
  {
    slug: "renovate-or-refresh",
    title: "Renovate, Refresh, or Leave It Alone?",
    date: "June 19, 2026",
    category: "Selling",
    image: images.kitchen,
    excerpt:
      "Where presentation dollars tend to matter most before a New York listing goes live.",
    body: insightBody,
  },
  {
    slug: "downtown-family-home",
    title: "Finding a Family Home Downtown",
    date: "May 30, 2026",
    category: "Buying",
    image: images.city3,
    excerpt:
      "The tradeoffs between loft scale, townhouse privacy, school commutes, and neighborhood texture.",
    body: insightBody,
  },
  {
    slug: "quiet-luxury",
    title: "Quiet Luxury Has Always Been a Real Estate Strategy",
    date: "April 22, 2026",
    category: "Design",
    image: images.bedroom,
    excerpt:
      "Timeless materials, good light, and the details buyers feel before they can name them.",
    body: insightBody,
  },
  {
    slug: "first-week",
    title: "Why the First Week on Market Matters",
    date: "March 08, 2026",
    category: "Selling",
    image: images.hero,
    excerpt:
      "Launch strategy is not about creating noise. It is about concentrating the right attention.",
    body: insightBody,
  },
];

export const testimonials = [
  {
    initials: "JM",
    role: "Seller · West Village",
    quote:
      "Avery was strategic without ever making the process feel transactional. Every detail had a reason, every conversation moved us forward, and the final result exceeded our expectations.",
  },
  {
    initials: "RK",
    role: "Buyer · Tribeca",
    quote:
      "We had a complicated wish list and very little patience for generic advice. Avery understood the assignment immediately and found the one home that actually made sense.",
  },
  {
    initials: "EL",
    role: "Seller & Buyer · Brooklyn",
    quote:
      "The rare advisor who is equally strong on design, numbers, negotiation, and people. We have now worked together three times and would not consider anyone else.",
  },
  {
    initials: "PS",
    role: "Buyer · Upper East Side",
    quote:
      "Clear, unflappable, and incredibly well prepared. The board process felt manageable because we always knew what was coming next.",
  },
];

export const beforeAfterCases = [
  {
    title: "West Village Loft",
    copy: "A lighter palette, edited furnishings, and a more architectural lighting plan clarified the scale of a sprawling loft.",
    before: images.interior,
    after: images.kitchen,
  },
  {
    title: "Brooklyn Brownstone",
    copy: "We retained the character, simplified the rooms, and made the garden level read as true living space.",
    before: images.kitchen,
    after: images.interior,
  },
  {
    title: "Upper East Side Classic Six",
    copy: "Cosmetic changes focused attention on the gracious layout rather than dated finishes.",
    before: images.bedroom,
    after: images.hero,
  },
];

export const resources = [
  {
    title: "Manhattan Market Brief",
    kicker: "Q2 2026",
    copy: "A concise view of contract activity, pricing, inventory, and negotiating leverage.",
  },
  {
    title: "Brooklyn Market Brief",
    kicker: "Q2 2026",
    copy: "Brownstone and condo trends across prime northwest Brooklyn.",
  },
  {
    title: "Luxury Contract Report",
    kicker: "August 2026",
    copy: "A weekly read on signed contracts above $4 million.",
  },
  {
    title: "Closing Cost Guide",
    kicker: "Buyer + Seller",
    copy: "Typical New York transaction costs and when they are paid.",
  },
  {
    title: "Renovation Primer",
    kicker: "Co-op + Condo",
    copy: "What to ask before buying a home that needs work.",
  },
  {
    title: "Board Package Checklist",
    kicker: "Co-op buyers",
    copy: "A practical framework for presenting a clean, complete application.",
  },
];

export const buyerSteps = [
  {
    title: "Define the brief",
    copy: "Clarify budget, financing, location, building type, timing, and which tradeoffs are real versus theoretical.",
  },
  {
    title: "Build the search",
    copy: "We monitor public inventory, broker networks, private exclusives, and buildings where the right home may emerge.",
  },
  {
    title: "Evaluate the home",
    copy: "Condition, building financials, comps, resale, light, noise, renovation, and board culture all belong in the analysis.",
  },
  {
    title: "Structure the offer",
    copy: "Price is only one term. Timing, financing confidence, contingencies, and presentation can all matter.",
  },
  {
    title: "Due diligence",
    copy: "Attorney review, building documents, inspection where relevant, and lender underwriting move in parallel.",
  },
  {
    title: "Board & closing",
    copy: "For co-ops, the package and interview matter. For every purchase, we stay close through final walkthrough and closing.",
  },
];

export const conciergeSteps = [
  {
    title: "Assess",
    copy: "We identify the changes most likely to affect perception, marketability, and price.",
  },
  {
    title: "Scope",
    copy: "We create a practical plan, budget, timeline, and clear ownership for each moving piece.",
  },
  {
    title: "Prepare",
    copy: "Trusted vendors execute while we manage the visual and strategic through-line.",
  },
  {
    title: "Launch",
    copy: "Photography, copy, media, broker outreach, and showings arrive as one coordinated story.",
  },
];
