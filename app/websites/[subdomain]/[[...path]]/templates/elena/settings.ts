import { z } from "zod";

const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const ServiceSchema = z.object({
  number: z.string(),
  title: z.string(),
  text: z.string(),
});

const ListingSchema = z.object({
  neighborhood: z.string(),
  title: z.string(),
  price: z.string(),
  detail: z.string(),
  image: z.string(),
});

const JournalEntrySchema = z.object({
  date: z.string(),
  title: z.string(),
  text: z.string(),
});

const ProcessStepSchema = z.object({
  title: z.string(),
  text: z.string(),
});

const defaultAgent = {
  firstName: "Elena",
  lastName: "Hart",
  initials: "EH",
  title: "Licensed Associate Real Estate Broker",
  location: "New York City",
  email: "hello@elenahart.com",
  phone: "+1 212 555 0147",
  instagram: "@elenahart.nyc",
  wordmarkLeft: "ELENA",
  wordmarkRight: "HART",
  headerCenter: "Private Real Estate · New York",
  menuBrand: "EH / NYC",
  menuIntro:
    "Thoughtful representation for people making important moves.",
  menuMeta: "Manhattan · Brooklyn · Select referrals",
  footerTagline: "Private Real Estate · New York City",
};

const defaultBrand = {
  ink: "#171714",
  inkSoft: "#3f3f39",
  paper: "#f3f0e9",
  paperDeep: "#e9e4da",
  line: "rgba(23, 23, 20, 0.22)",
  night: "#1e231f",
  cream: "#f5f0e5",
};

const defaultNavItems = [
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Residences", href: "/#residences" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "#contact" },
];

const defaultCatalog = {
  stats: [
    { value: "$420M+", label: "Career Sales" },
    { value: "16", label: "Years Advising" },
    { value: "74%", label: "Referral & Repeat Business" },
  ],
  services: [
    {
      number: "01",
      title: "Purchase Advisory",
      text: "A disciplined search process built around access, neighborhood fluency, and clear decision-making from first tour through closing.",
    },
    {
      number: "02",
      title: "Sale Representation",
      text: "Positioning, presentation, and negotiation designed to create demand while protecting the details that matter to you.",
    },
    {
      number: "03",
      title: "Private Opportunities",
      text: "Discreet sourcing and off-market conversations for clients who value privacy, timing, and a wider field of possibilities.",
    },
    {
      number: "04",
      title: "Portfolio Strategy",
      text: "Long-horizon guidance for pied-a-terres, investment properties, estate transitions, and multi-property decisions.",
    },
  ],
  listings: [
    {
      neighborhood: "West Village",
      title: "Hudson Street Townhouse",
      price: "$12,950,000",
      detail: "5 beds · 5.5 baths · private garden",
      image:
        "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/d7/d752179c6afd8c91ccc8ea1883d2775c5d6b87072c413840bfb3da31cf1f1dee.avif",
    },
    {
      neighborhood: "Tribeca",
      title: "Franklin Street Loft",
      price: "$7,850,000",
      detail: "3 beds · 3.5 baths · 3,280 sq ft",
      image:
        "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/37/374ad529872a02f0232148ef0383c1c1e3d47e99c33aa7d4e014d2f7aab206d2.avif",
    },
    {
      neighborhood: "Brooklyn Heights",
      title: "Promenade Residence",
      price: "$5,975,000",
      detail: "4 beds · 3 baths · harbor views",
      image:
        "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/86/86d3f36b9a5e5738657b24e80244042e1a846c769b8e578546a091346797ac7a.avif",
    },
  ],
  journal: [
    {
      date: "Market Note · Spring 2026",
      title: "Why well-priced homes are still moving first",
      text: "A practical look at velocity, buyer confidence, and what premium positioning means in a selective market.",
    },
    {
      date: "Neighborhood Guide",
      title: "A quieter side of downtown living",
      text: "Five blocks, three bakeries, two pocket parks—and the small rituals that make a neighborhood feel like home.",
    },
    {
      date: "Seller Strategy",
      title: "The first ten days of a listing",
      text: "How photography, launch cadence, showing feedback, and early price signals shape the rest of a campaign.",
    },
  ],
  processSteps: [
    {
      title: "Listen",
      text: "Define the decision, constraints, timing, and what a successful outcome actually looks like.",
    },
    {
      title: "Frame",
      text: "Build a point of view on value, leverage, and the alternatives worth pursuing.",
    },
    {
      title: "Act",
      text: "Move decisively when the moment is right—without creating pressure where none is needed.",
    },
    {
      title: "Stay close",
      text: "Coordinate the details, anticipate friction, and remain available long after closing.",
    },
  ],
  inquiryInterests: ["Buying", "Selling", "Off-market", "Advisory"],
};

/**
 * Website-wide Elena branding + catalog.
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const ElenaSettingsSchema = z.object({
  agent: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      initials: z.string(),
      title: z.string(),
      location: z.string(),
      email: z.string(),
      phone: z.string(),
      instagram: z.string(),
      wordmarkLeft: z.string(),
      wordmarkRight: z.string(),
      headerCenter: z.string(),
      menuBrand: z.string(),
      menuIntro: z.string(),
      menuMeta: z.string(),
      footerTagline: z.string(),
    })
    .default(defaultAgent),
  brand: z
    .object({
      ink: z.string(),
      inkSoft: z.string(),
      paper: z.string(),
      paperDeep: z.string(),
      line: z.string(),
      night: z.string(),
      cream: z.string(),
    })
    .default(defaultBrand),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  catalog: z
    .object({
      stats: z.array(StatSchema),
      services: z.array(ServiceSchema),
      listings: z.array(ListingSchema),
      journal: z.array(JournalEntrySchema),
      processSteps: z.array(ProcessStepSchema),
      inquiryInterests: z.array(z.string()),
    })
    .default(defaultCatalog),
});

export type ElenaSettings = z.infer<typeof ElenaSettingsSchema>;
export type ElenaNavItem = z.infer<typeof NavItemSchema>;
export type ElenaStat = z.infer<typeof StatSchema>;
export type ElenaService = z.infer<typeof ServiceSchema>;
export type ElenaListing = z.infer<typeof ListingSchema>;
export type ElenaJournalEntry = z.infer<typeof JournalEntrySchema>;
export type ElenaProcessStep = z.infer<typeof ProcessStepSchema>;
