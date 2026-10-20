/**
 * Seed catalog for the Avery Rowe (estate-agent-site) template.
 * Services / properties / journal live in website settings, not per-page content.
 */

export type RoweService = {
  slug: string;
  number: string;
  title: string;
  short: string;
  intro: string;
  format: string;
  duration: string;
  bestFor: string;
  fee: string;
  body: string[];
  includes: string[];
  note: string;
  image: string;
};

export type RoweProperty = {
  slug: string;
  name: string;
  location: string;
  price: string;
  status: string;
  beds: string;
  baths: string;
  area: string;
  summary: string;
  description: string[];
  image: string;
  image2: string;
  image3: string;
  details: string[];
};

export type RoweJournalEntry = {
  slug: string;
  category: string;
  date: string;
  title: string;
  dek: string;
  image: string;
  body: string[];
};

export const services: RoweService[] = [
  {
    slug: "buyer-representation",
    number: "01",
    title: "Buyer Representation",
    short:
      "Private search, negotiation, and acquisition strategy for discerning buyers.",
    intro:
      "A focused search process built around access, context, and confident decision-making — from the first brief through closing.",
    format: "Private advisory",
    duration: "Search through closing",
    bestFor: "Primary, second-home, and investment buyers",
    fee: "By engagement",
    body: [
      "The strongest acquisitions begin before a property reaches a shortlist. I combine direct broker relationships, local pattern recognition, and a disciplined evaluation process to surface opportunities that fit both the brief and the long-term plan.",
      "When the right home emerges, the work shifts to diligence, positioning, and negotiation. Every recommendation is grounded in comparables, property-specific risk, and what the market is actually rewarding — not simply the asking price.",
    ],
    includes: [
      "Search strategy and market mapping",
      "On- and off-market sourcing",
      "Private tours and property screening",
      "Comparable analysis and offer strategy",
      "Negotiation and transaction coordination",
      "Introductions to legal, lending, and design partners",
    ],
    note: "A selective, low-volume model designed to keep the advice personal and the search precise.",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/86/86d3f36b9a5e5738657b24e80244042e1a846c769b8e578546a091346797ac7a.avif",
  },
  {
    slug: "seller-strategy",
    number: "02",
    title: "Seller Strategy",
    short:
      "Pricing, positioning, and launch direction for homes that deserve a considered market debut.",
    intro:
      "A sale plan shaped around presentation, timing, audience, and leverage — with one point of accountability from preparation to close.",
    format: "Exclusive representation",
    duration: "Preparation through closing",
    bestFor: "Design-led and luxury residential sellers",
    fee: "By agreement",
    body: [
      "A premium listing is not a commodity. The launch needs a point of view: who the buyer is, what the property means to them, and how every visual, showing, and conversation reinforces that story.",
      "I lead the full process personally, aligning price strategy with creative direction and direct outreach so the property enters the market with clarity rather than noise.",
    ],
    includes: [
      "Pricing and positioning analysis",
      "Pre-market presentation plan",
      "Photography and film creative direction",
      "Launch calendar and private outreach",
      "Showing strategy and feedback loops",
      "Offer evaluation and negotiation",
    ],
    note: "The objective is not maximum exposure at any cost. It is the right exposure, in the right sequence, to the right buyers.",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/3d/3d3b1c895df50d8dfc8f97e8098e00293b7d5711d6cd0857d7cae6cadeeeaf05.avif",
  },
  {
    slug: "portfolio-advisory",
    number: "03",
    title: "Portfolio Advisory",
    short:
      "Long-view guidance for clients making multiple residential real-estate decisions.",
    intro:
      "Ongoing counsel for households and investors balancing acquisitions, sales, hold decisions, and lifestyle changes across a portfolio.",
    format: "Ongoing advisory",
    duration: "Quarterly or annual",
    bestFor: "Multi-property owners and private clients",
    fee: "Retainer",
    body: [
      "Real estate decisions rarely exist in isolation. A sale can fund an acquisition; a hold decision can affect borrowing capacity; a second home can shift from lifestyle asset to portfolio drag.",
      "This engagement creates a single place to pressure-test those choices with current market context and clear priorities.",
    ],
    includes: [
      "Portfolio review and value ranges",
      "Buy / sell / hold scenarios",
      "Market timing guidance",
      "Capital-improvement prioritization",
      "Broker and vendor coordination",
      "Quarterly opportunity review",
    ],
    note: "Built for clients who want continuity rather than starting from zero with each transaction.",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/1b/1bda460234a4bfb867bced1abce3f0103daef21d23b7560461115fb11307a5b3.avif",
  },
  {
    slug: "development-launches",
    number: "04",
    title: "Development Launches",
    short:
      "Market-facing strategy for boutique residential projects and design-forward new construction.",
    intro:
      "Positioning and sales direction for projects where architecture, brand, and buyer experience need to move as one.",
    format: "Project representation",
    duration: "Pre-launch through sellout",
    bestFor: "Developers and boutique projects",
    fee: "Project based",
    body: [
      "New development needs more than a set of floor plans and a media budget. Buyers need to understand the design logic, the lifestyle, and why the project deserves attention now.",
      "I work with ownership and creative teams to align product narrative, pricing architecture, launch sequencing, and direct sales activity.",
    ],
    includes: [
      "Competitive market study",
      "Unit and pricing architecture",
      "Buyer profile definition",
      "Brand and launch input",
      "Broker and buyer outreach",
      "Sales feedback and pricing iteration",
    ],
    note: "Particularly suited to smaller projects that benefit from a founder-led, editorial approach rather than a large-team sales machine.",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/d0/d0974d51b69cbfd3649d7d5489a15b6b7f766d702ba6824d7fbfdcd6214b481f.avif",
  },
];

export const properties: RoweProperty[] = [
  {
    slug: "canyon-glass-house",
    name: "Canyon Glass House",
    location: "Canyon District",
    price: "$8,950,000",
    status: "Private offering",
    beds: "5 beds",
    baths: "6 baths",
    area: "6,420 sq ft",
    summary:
      "A low-slung modern residence where concrete, oak, and glass frame uninterrupted canyon views.",
    description: [
      "Designed around a sequence of courtyards, the house opens gradually from a quiet street presence to a full-width living pavilion and horizon pool. Floor-to-ceiling glazing keeps the landscape present throughout the main level.",
      "The plan balances large-scale entertaining with private daily living: a concealed prep kitchen, library, primary suite with dual dressing rooms, and a separate guest wing sit alongside generous outdoor rooms.",
    ],
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/a0/a07773240285f007db39db4ad273311c1962e5be681a165f4e3f31bc9e78b3c4.avif",
    image2:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/82/822c2e2a4119c1330edf1cc259ff21170e2b1e036a45900fac82b1f0f4d28d0f.avif",
    image3:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/37/374ad529872a02f0232148ef0383c1c1e3d47e99c33aa7d4e014d2f7aab206d2.avif",
    details: [
      "2023 construction",
      "Infinity pool",
      "Screening room",
      "4-car gallery",
      "Separate guest suite",
      "Smart-home systems",
    ],
  },
  {
    slug: "mercer-penthouse",
    name: "Mercer Penthouse",
    location: "Arts District",
    price: "$5,400,000",
    status: "For sale",
    beds: "3 beds",
    baths: "3.5 baths",
    area: "3,180 sq ft",
    summary:
      "A full-floor residence with gallery proportions, warm materiality, and private elevator arrival.",
    description: [
      "An elevator opens directly into a long, art-ready gallery that separates the entertaining rooms from the bedroom wing. Oversized steel windows bring soft city light into the main living room throughout the day.",
      "The renovation pairs hand-finished plaster, custom oak millwork, limestone, and patinated metalwork with a highly functional plan designed for quiet daily living.",
    ],
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/2b/2b454d8dbe7d185190cd98a4cece67540048a5fcdf393fa36af59d9608bb46a7.avif",
    image2:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/d7/d752179c6afd8c91ccc8ea1883d2775c5d6b87072c413840bfb3da31cf1f1dee.avif",
    image3:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/05/05792b8c0de04a1dac092bd1c1a76a0b682876fcbb7d9882e9980aa922fd4b73.avif",
    details: [
      "Full-floor layout",
      "Private elevator",
      "Custom millwork",
      "Chef's kitchen",
      "Corner exposures",
      "24-hour attended lobby",
    ],
  },
  {
    slug: "cove-residence",
    name: "Cove Residence",
    location: "Ocean District",
    price: "$12,750,000",
    status: "Coming soon",
    beds: "6 beds",
    baths: "7 baths",
    area: "7,860 sq ft",
    summary:
      "An ocean-facing retreat composed as a series of sheltered rooms, terraces, and planted courts.",
    description: [
      "The residence is organized to make the water visible without sacrificing privacy. Deep overhangs, stone walls, and a planted arrival court create a sense of compression before the main rooms open toward the horizon.",
      "A separate wellness pavilion, guest suite, and studio give the property flexibility for longer stays, work, and multigenerational living.",
    ],
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/52/52aba5f4710514944ee55a83fba3ebd63ef9bfbaacdf630044cdbd1105a478d0.avif",
    image2:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/86/86d3f36b9a5e5738657b24e80244042e1a846c769b8e578546a091346797ac7a.avif",
    image3:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/d0/d0974d51b69cbfd3649d7d5489a15b6b7f766d702ba6824d7fbfdcd6214b481f.avif",
    details: [
      "Ocean frontage",
      "Wellness pavilion",
      "50-ft pool",
      "Guest suite",
      "Studio",
      "Gated motor court",
    ],
  },
];

export const journal: RoweJournalEntry[] = [
  {
    slug: "the-case-for-quiet-listings",
    category: "Market Notes",
    date: "July 18, 2026",
    title: "The case for a quieter listing launch",
    dek: "Why some high-value homes benefit from a deliberate first act before broad market exposure.",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/86/86d3f36b9a5e5738657b24e80244042e1a846c769b8e578546a091346797ac7a.avif",
    body: [
      "The default listing playbook assumes attention is always additive. In the upper end of the market, that is not necessarily true. Early exposure without a clear narrative can create stale signals long before the right buyer has seen the property.",
      "A quieter opening period gives the agent room to test price perception, gather high-quality feedback, and introduce the home directly to people whose preferences are already understood.",
      "This is not secrecy for its own sake. It is sequencing. The broader campaign can still arrive with force — but it arrives informed, with the property positioned around what serious buyers actually responded to.",
    ],
  },
  {
    slug: "design-details-buyers-notice",
    category: "Perspective",
    date: "June 27, 2026",
    title: "The design details buyers remember",
    dek: "The most persuasive homes create coherence before they create spectacle.",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/3d/3d3b1c895df50d8dfc8f97e8098e00293b7d5711d6cd0857d7cae6cadeeeaf05.avif",
    body: [
      "Memorable property is rarely about a single expensive finish. Buyers remember the sequence: how the entry compresses, where the first long view appears, whether natural light lands where daily life actually happens.",
      "Material consistency also matters. When stone, wood, hardware, lighting, and millwork feel selected from the same point of view, even a restrained interior reads as premium.",
      "Before a sale, the best preparation is often subtraction. Clarify the architecture, remove visual interruptions, and let a few strong moments do more of the work.",
    ],
  },
  {
    slug: "pricing-the-unrepeatable-home",
    category: "Strategy",
    date: "May 9, 2026",
    title: "Pricing the home with no perfect comparable",
    dek: "A framework for thinking about value when uniqueness is the feature, not the problem.",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/1b/1bda460234a4bfb867bced1abce3f0103daef21d23b7560461115fb11307a5b3.avif",
    body: [
      "The more distinctive a property is, the less useful a single price-per-square-foot number becomes. A useful valuation starts by separating the repeatable elements from the scarce ones.",
      "Location, size, bedroom count, and condition can be benchmarked. View corridors, architectural authorship, privacy, land configuration, or a truly irreplaceable floor plan need a different treatment.",
      "The final asking strategy should reflect not only a modeled value range but the likely depth of the buyer pool and how much discovery the market will tolerate before urgency is lost.",
    ],
  },
  {
    slug: "what-off-market-actually-means",
    category: "Field Guide",
    date: "April 16, 2026",
    title: "What “off market” actually means",
    dek: "Not every private opportunity is exclusive, and not every exclusive opportunity is good.",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/d0/d0974d51b69cbfd3649d7d5489a15b6b7f766d702ba6824d7fbfdcd6214b481f.avif",
    body: [
      "Off-market inventory is often discussed as though it were a single category. In practice, it ranges from genuinely private seller conversations to stale listings temporarily removed from public portals.",
      "The value is not the label. The value is context: why the owner may sell, who controls access, what price would create action, and whether the property is likely to reach the open market anyway.",
      "For buyers, private access is most useful when it expands choice without weakening diligence. Scarcity should make the process sharper, not faster.",
    ],
  },
  {
    slug: "preparing-for-a-design-led-sale",
    category: "Seller Guide",
    date: "March 22, 2026",
    title: "Preparing a design-led home for sale",
    dek: "Protect the character of the property while making the story easier to read.",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/1a/1a077fd018433b9405495055053e8ad0950e95dac01214ec5267bf81f004b88c.avif",
    body: [
      "The goal of preparation is not to neutralize a home until it could belong to anyone. Design-led properties often command attention precisely because they have a point of view.",
      "The better approach is to identify friction: rooms with unclear use, lighting that photographs inconsistently, maintenance details that create doubt, or styling that competes with the architecture.",
      "Once those distractions are resolved, marketing can focus on the design decisions that make the property difficult to replace.",
    ],
  },
  {
    slug: "buying-with-a-five-year-horizon",
    category: "Buyer Guide",
    date: "February 11, 2026",
    title: "Buying with a five-year horizon",
    dek: "A practical way to separate the house you love from the acquisition you may later regret.",
    image:
      "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/cf/cfaaeae520a7794cb0bccdc0bbe2a283306d7f70a88842c812292caa0e35242c.avif",
    body: [
      "A home does not need to be a pure investment to benefit from investment discipline. Even when lifestyle is the first priority, exit conditions matter.",
      "The five-year test asks simple questions: Is the floor plan broadly usable? Is supply around the property likely to change? Which features are genuinely scarce? What work will a future buyer inherit?",
      "The point is not to predict a future sale price. It is to understand which parts of today’s premium are likely to remain legible to the next buyer.",
    ],
  },
];
