import { z } from "zod";

import {
  journal as defaultJournal,
  properties as defaultProperties,
  services as defaultServices,
} from "./catalog-defaults";

const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const SocialSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const ServiceSchema = z.object({
  slug: z.string(),
  number: z.string(),
  title: z.string(),
  short: z.string(),
  intro: z.string(),
  format: z.string(),
  duration: z.string(),
  bestFor: z.string(),
  fee: z.string(),
  body: z.array(z.string()).min(1),
  includes: z.array(z.string()).min(1),
  note: z.string(),
  image: z.string(),
});

const PropertySchema = z.object({
  slug: z.string(),
  name: z.string(),
  location: z.string(),
  price: z.string(),
  status: z.string(),
  beds: z.string(),
  baths: z.string(),
  area: z.string(),
  summary: z.string(),
  description: z.array(z.string()).min(1),
  image: z.string(),
  image2: z.string(),
  image3: z.string(),
  details: z.array(z.string()).min(1),
});

const JournalEntrySchema = z.object({
  slug: z.string(),
  category: z.string(),
  date: z.string(),
  title: z.string(),
  dek: z.string(),
  image: z.string(),
  body: z.array(z.string()).min(1),
});

const defaultAgent = {
  name: "Avery Rowe",
  wordmark: "AVERY ROWE",
  wordmarkSub: "PRIVATE REAL ESTATE",
  role: "Private Real Estate Advisor",
  email: "hello@averyrowe.com",
  phone: "+1 310 555 0148",
  license: "Lic. #0000000",
  marketNote: "Based in your market • Available by referral",
  locationLine: "Based in your market",
  availabilityLine: "Working by appointment & referral",
  contactCtaLabel: "Start a conversation ↗",
  verticalNote: "AVERY ROWE / PRIVATE REAL ESTATE",
};

const defaultBrand = {
  paper: "#eeeae2",
  paper2: "#e6e0d6",
  ink: "#11110f",
  muted: "#6b675f",
  line: "rgba(17,17,15,.18)",
  softLine: "rgba(255,255,255,.18)",
  black: "#10100f",
  cream: "#f3efe7",
};

const defaultNavItems = [
  { label: "Properties", href: "/properties" },
  { label: "Services", href: "/services" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
];

const defaultCatalog = {
  services: [...defaultServices],
  properties: [...defaultProperties],
  journal: [...defaultJournal],
};

const defaultSocials = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "YouTube", href: "#" },
];

const defaultFooter = {
  kicker: "Private real estate, represented personally.",
  headline: "Considering",
  headlineEm: "a move?",
  ctaLabel: "Tell me what you’re thinking",
  tagline: "Homes, architecture, market intelligence, and considered representation.",
  newsletterLabel: "Monthly field notes",
  copyright: "© 2026 Avery Rowe. Demo content.",
};

/**
 * Website-wide Avery Rowe branding + catalog (from estate-agent-site).
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const RoweSettingsSchema = z.object({
  agent: z
    .object({
      name: z.string(),
      wordmark: z.string(),
      wordmarkSub: z.string(),
      role: z.string(),
      email: z.string(),
      phone: z.string(),
      license: z.string(),
      marketNote: z.string(),
      locationLine: z.string(),
      availabilityLine: z.string(),
      contactCtaLabel: z.string(),
      verticalNote: z.string(),
    })
    .default(defaultAgent),
  brand: z
    .object({
      paper: z.string(),
      paper2: z.string(),
      ink: z.string(),
      muted: z.string(),
      line: z.string(),
      softLine: z.string(),
      black: z.string(),
      cream: z.string(),
    })
    .default(defaultBrand),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  catalog: z
    .object({
      services: z.array(ServiceSchema),
      properties: z.array(PropertySchema),
      journal: z.array(JournalEntrySchema),
    })
    .default(defaultCatalog),
  socials: z.array(SocialSchema).default(defaultSocials),
  menuNote: z
    .string()
    .default(
      "Representation for remarkable homes and the people making consequential moves.",
    ),
  footer: z
    .object({
      kicker: z.string(),
      headline: z.string(),
      headlineEm: z.string(),
      ctaLabel: z.string(),
      tagline: z.string(),
      newsletterLabel: z.string(),
      copyright: z.string(),
    })
    .default(defaultFooter),
});

export type RoweSettings = z.infer<typeof RoweSettingsSchema>;
export type RoweNavItem = z.infer<typeof NavItemSchema>;
export type RoweSocial = z.infer<typeof SocialSchema>;
export type RoweCatalogService = z.infer<typeof ServiceSchema>;
export type RoweCatalogProperty = z.infer<typeof PropertySchema>;
export type RoweCatalogJournalEntry = z.infer<typeof JournalEntrySchema>;
