import { z } from "zod";

import {
  communities as defaultCommunities,
  developments as defaultDevelopments,
  posts as defaultPosts,
  press as defaultPress,
  pressLogos as defaultPressLogos,
  properties as defaultProperties,
  team as defaultTeam,
  videos as defaultVideos,
} from "./catalog-defaults";

const NavChildSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  children: z.array(NavChildSchema).optional(),
});

const PropertySchema = z.object({
  slug: z.string(),
  title: z.string(),
  location: z.string(),
  price: z.string(),
  beds: z.string(),
  baths: z.string(),
  area: z.string(),
  status: z.string(),
  image: z.string(),
  image2: z.string(),
  image3: z.string(),
  description: z.string(),
});

const CommunitySchema = z.object({
  slug: z.string(),
  name: z.string(),
  eyebrow: z.string(),
  image: z.string(),
  blurb: z.string(),
  intro: z.string(),
  bullets: z.array(z.string()),
});

const MetricSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const DevelopmentSchema = z.object({
  slug: z.string(),
  name: z.string(),
  location: z.string(),
  image: z.string(),
  image2: z.string(),
  image3: z.string(),
  text: z.string(),
  metrics: z.array(MetricSchema),
});

const PostBodySchema = z.object({
  heading: z.string(),
  paragraphs: z.array(z.string()),
});

const PostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  date: z.string(),
  category: z.string(),
  image: z.string(),
  excerpt: z.string(),
  quote: z.string(),
  body: z.array(PostBodySchema),
});

const TeamMemberSchema = z.object({
  slug: z.string(),
  name: z.string(),
  role: z.string(),
  image: z.string(),
});

const PressItemSchema = z.object({
  year: z.string(),
  title: z.string(),
  publication: z.string(),
});

const VideoSchema = z.object({
  title: z.string(),
  category: z.string(),
  image: z.string(),
});

const defaultBrand = {
  siteName: "Atelier North",
  wordmarkTop: "ATELIER",
  wordmarkBottom: "NORTH",
  colors: {
    ink: "#11110f",
    paper: "#f3f0e9",
    paper2: "#e9e4da",
    stone: "#cfc7b9",
    muted: "#777168",
    line: "rgba(17,17,15,.16)",
    white: "#fff",
  },
  typography: {
    serif: "\"Iowan Old Style\", \"Palatino Linotype\", Palatino, Baskerville, Georgia, serif",
    sans: "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
  },
};

const defaultAgent = {
  name: "Elena Marlowe",
  firstName: "Elena",
  title: "Luxury Real Estate Advisor",
  market: "Austin & the Texas Hill Country",
  phone: "(512) 555-0148",
  email: "hello@ateliernorth.example",
  address: "1601 West Avenue, Suite 400 · Austin, TX 78701",
  instagram: "@ateliernorthrealty",
  headshot:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=88",
};

const defaultHero = {
  eyebrow: "Austin & the Texas Hill Country",
  indexLabel: "EST. 2008 / AUSTIN",
  title: "Real estate,",
  titleEmphasis: "artfully represented.",
  subtitle:
    "Private advisory for exceptional homes, design-led properties, and clients who value discretion as much as results.",
  image:
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90",
  ctaLabel: "View properties",
  ctaHref: "/properties",
};

const defaultStats = [
  { value: "$1.4B+", label: "Career sales represented" },
  { value: "18", label: "Years advising Austin clients" },
  { value: "92%", label: "Referral & repeat business" },
  { value: "24", label: "Countries in partner network" },
];

const defaultNavItems = [
  { label: "About", href: "/about" },
  {
    label: "Properties",
    href: "/properties",
    children: [
      { label: "Search", href: "/search" },
      { label: "Notable sales", href: "/sales" },
    ],
  },
  { label: "Developments", href: "/developments" },
  { label: "Communities", href: "/communities" },
  { label: "Journal", href: "/journal" },
];

const defaultMobileNavItems = [
  { label: "Valuation", href: "/valuation" },
  { label: "Search", href: "/search" },
  { label: "Videos", href: "/videos" },
  { label: "Press", href: "/press" },
  { label: "Contact", href: "/contact" },
];

const defaultCatalog = {
  properties: defaultProperties,
  communities: defaultCommunities,
  developments: defaultDevelopments,
  posts: defaultPosts,
  team: defaultTeam,
  pressLogos: defaultPressLogos,
  press: defaultPress,
  videos: defaultVideos,
};

/**
 * Website-wide Atelier branding + catalog.
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const AtelierSettingsSchema = z.object({
  brand: z
    .object({
      siteName: z.string(),
      wordmarkTop: z.string(),
      wordmarkBottom: z.string(),
      colors: z.object({
        ink: z.string(),
        paper: z.string(),
        paper2: z.string(),
        stone: z.string(),
        muted: z.string(),
        line: z.string(),
        white: z.string(),
      }),
      typography: z.object({
        serif: z.string(),
        sans: z.string(),
      }),
    })
    .default(defaultBrand),
  agent: z
    .object({
      name: z.string(),
      firstName: z.string(),
      title: z.string(),
      market: z.string(),
      phone: z.string(),
      email: z.string(),
      address: z.string(),
      instagram: z.string(),
      headshot: z.string(),
    })
    .default(defaultAgent),
  hero: z
    .object({
      eyebrow: z.string(),
      indexLabel: z.string(),
      title: z.string(),
      titleEmphasis: z.string(),
      subtitle: z.string(),
      image: z.string(),
      ctaLabel: z.string(),
      ctaHref: z.string(),
    })
    .default(defaultHero),
  stats: z.array(MetricSchema).default(defaultStats),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  mobileNavItems: z.array(NavChildSchema).default(defaultMobileNavItems),
  catalog: z
    .object({
      properties: z.array(PropertySchema),
      communities: z.array(CommunitySchema),
      developments: z.array(DevelopmentSchema),
      posts: z.array(PostSchema),
      team: z.array(TeamMemberSchema),
      pressLogos: z.array(z.string()),
      press: z.array(PressItemSchema),
      videos: z.array(VideoSchema),
    })
    .default(defaultCatalog),
});

export type AtelierSettings = z.infer<typeof AtelierSettingsSchema>;
export type AtelierProperty = z.infer<typeof PropertySchema>;
export type AtelierCommunity = z.infer<typeof CommunitySchema>;
export type AtelierDevelopment = z.infer<typeof DevelopmentSchema>;
export type AtelierPost = z.infer<typeof PostSchema>;
export type AtelierNavItem = z.infer<typeof NavItemSchema>;
export type AtelierNavChild = z.infer<typeof NavChildSchema>;
