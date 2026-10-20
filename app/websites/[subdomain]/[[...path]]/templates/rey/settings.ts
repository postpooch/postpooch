import { z } from "zod";

import {
  communities as defaultCommunities,
  press as defaultPress,
  properties as defaultProperties,
  team as defaultTeam,
  testimonials as defaultTestimonials,
} from "./catalog-defaults";

const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const PropertySchema = z.object({
  slug: z.string(),
  address: z.string(),
  city: z.string(),
  price: z.string(),
  status: z.string().optional(),
  beds: z.number(),
  baths: z.number(),
  sqft: z.string(),
  lot: z.string().optional(),
  image: z.string(),
  gallery: z.array(z.string()).min(1),
  description: z.array(z.string()).min(1),
});

const CommunityStatSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const CommunitySchema = z.object({
  slug: z.string(),
  name: z.string(),
  tagline: z.string(),
  image: z.string(),
  intro: z.string(),
  stats: z.array(CommunityStatSchema).min(1),
});

const TeamMemberSchema = z.object({
  slug: z.string(),
  name: z.string(),
  role: z.string(),
  license: z.string(),
  phone: z.string(),
  email: z.string(),
  image: z.string(),
  bio: z.array(z.string()).min(1),
});

const TestimonialSchema = z.object({
  title: z.string(),
  quote: z.string(),
  name: z.string(),
  role: z.string(),
});

const PressItemSchema = z.object({
  source: z.string(),
  title: z.string(),
  year: z.string(),
});

const defaultAgent = {
  firstName: "Elena",
  lastName: "Vale",
  fullName: "Elena Vale",
  monogram: "EV",
  tagline: "Southern California Estates",
  eyebrow: "Over $3.2 Billion in Career Sales",
  phone: "310.555.0148",
  email: "hello@elenavale.com",
  address: "9454 Wilshire Boulevard, Beverly Hills, CA 90212",
  license: "CalDRE #01234567",
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};

const defaultBrand = {
  ink: "#11110f",
  paper: "#f6f3ed",
  white: "#fff",
  warm: "#d9d1c4",
  line: "rgba(17,17,15,.19)",
};

const defaultNavItems = [
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Properties", href: "/properties" },
  { label: "Communities", href: "/communities" },
  { label: "Journal", href: "/journal" },
  { label: "Press", href: "/press" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

const defaultContactBand = {
  eyebrow: "Private Representation",
  titleLine1: "Let's begin a",
  titleEmphasis: "conversation.",
  body: "Whether you are considering a sale, searching for a distinctive home, or simply want a clearer view of the market, we would be pleased to speak with you.",
  submitLabel: "Send inquiry",
};

const defaultCatalog = {
  properties: [...defaultProperties],
  communities: [...defaultCommunities],
  team: [...defaultTeam],
  testimonials: [...defaultTestimonials],
  press: [...defaultPress],
};

/**
 * Website-wide Rey branding + catalog (from rey-inspired-template).
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const ReySettingsSchema = z.object({
  agent: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      fullName: z.string(),
      monogram: z.string(),
      tagline: z.string(),
      eyebrow: z.string(),
      phone: z.string(),
      email: z.string(),
      address: z.string(),
      license: z.string(),
      instagram: z.string(),
      youtube: z.string(),
      linkedin: z.string(),
    })
    .default(defaultAgent),
  brand: z
    .object({
      ink: z.string(),
      paper: z.string(),
      white: z.string(),
      warm: z.string(),
      line: z.string(),
    })
    .default(defaultBrand),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  contactBand: z
    .object({
      eyebrow: z.string(),
      titleLine1: z.string(),
      titleEmphasis: z.string(),
      body: z.string(),
      submitLabel: z.string(),
    })
    .default(defaultContactBand),
  catalog: z
    .object({
      properties: z.array(PropertySchema),
      communities: z.array(CommunitySchema),
      team: z.array(TeamMemberSchema),
      testimonials: z.array(TestimonialSchema),
      press: z.array(PressItemSchema),
    })
    .default(defaultCatalog),
});

export type ReySettings = z.infer<typeof ReySettingsSchema>;
export type ReyProperty = z.infer<typeof PropertySchema>;
export type ReyCommunity = z.infer<typeof CommunitySchema>;
export type ReyTeamMember = z.infer<typeof TeamMemberSchema>;
export type ReyTestimonial = z.infer<typeof TestimonialSchema>;
export type ReyPressItem = z.infer<typeof PressItemSchema>;
export type ReyNavItem = z.infer<typeof NavItemSchema>;
