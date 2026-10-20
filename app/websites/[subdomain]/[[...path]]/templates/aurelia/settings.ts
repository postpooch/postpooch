import { z } from "zod";

import {
  articles as defaultArticles,
  communities as defaultCommunities,
  globalProperties as defaultGlobalProperties,
  images as defaultImages,
  networkCities as defaultNetworkCities,
  press as defaultPress,
  properties as defaultProperties,
  testimonials as defaultTestimonials,
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
  status: z.string(),
  address: z.string(),
  city: z.string(),
  price: z.string(),
  beds: z.string(),
  baths: z.string(),
  sqft: z.string(),
  image: z.string(),
  image2: z.string(),
  image3: z.string(),
  featured: z.boolean(),
  type: z.string(),
  description: z.string(),
  lot: z.string(),
  year: z.string(),
  garage: z.string(),
});

const GlobalPropertySchema = z.object({
  place: z.string(),
  price: z.string(),
  image: z.string(),
});

const CommunitySchema = z.object({
  slug: z.string(),
  name: z.string(),
  image: z.string(),
  tagline: z.string(),
  intro: z.string(),
  population: z.string(),
  medianAge: z.string(),
  avgIncome: z.string(),
  walk: z.string(),
  details: z.array(z.string()),
});

const PressItemSchema = z.object({
  title: z.string(),
  outlet: z.string(),
  date: z.string(),
  description: z.string(),
});

const ArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  date: z.string(),
  category: z.string(),
  image: z.string(),
  excerpt: z.string(),
  body: z.array(z.string()).min(1),
});

const TestimonialSchema = z.object({
  name: z.string(),
  quote: z.string(),
});

const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const defaultAgent = {
  name: "Avery Morgan",
  brand: "Aurelia Estates",
  monogram: "AE",
  eyebrow: "Luxury Representation · Los Angeles",
  heroTitle: "Exceptional homes.\nQuietly represented.",
  heroSubtitle:
    "Private representation for remarkable properties across Los Angeles and beyond.",
  phone: "310.555.0148",
  email: "hello@aureliaestates.com",
  license: "CA DRE #01234567",
  address: "9450 Wilshire Blvd, Suite 420, Beverly Hills, CA 90212",
  instagram: "@aureliaestates",
  brandTag: "Private Real Estate Advisory",
  connectLabel: "Let's Connect",
};

const defaultBrand = {
  ink: "#171714",
  paper: "#f4f0e9",
  cream: "#e9e2d7",
  accent: "#8d775d",
  muted: "#6d6a64",
  white: "#fff",
};

const defaultNavItems = [
  { label: "About", href: "/about" },
  { label: "Home Search", href: "/home-search" },
  { label: "Press", href: "/press" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
  {
    label: "Properties",
    href: "#properties",
    children: [
      { label: "Exclusive Listings", href: "/properties" },
      { label: "Featured Leases", href: "/properties/leases" },
      { label: "Sold Portfolio", href: "/properties/sold" },
      { label: "Global Collection", href: "/properties/global" },
      { label: "Private Network", href: "/international-luxury-alliance" },
    ],
  },
  {
    label: "Communities",
    href: "#communities",
    children: [
      { label: "Beverly Hills", href: "/communities/beverly-hills" },
      { label: "Bel Air", href: "/communities/bel-air" },
      { label: "Holmby Hills", href: "/communities/holmby-hills" },
      { label: "Malibu", href: "/communities/malibu" },
      { label: "View All", href: "/communities" },
    ],
  },
];

const defaultCatalog = () => ({
  images: { ...defaultImages },
  properties: [...defaultProperties],
  globalProperties: [...defaultGlobalProperties],
  communities: [...defaultCommunities],
  press: [...defaultPress],
  articles: [...defaultArticles],
  testimonials: [...defaultTestimonials],
  networkCities: [...defaultNetworkCities],
  stats: [
    { value: "$3.4B+", label: "Career sales" },
    { value: "22", label: "Years in luxury real estate" },
    { value: "41", label: "Record-setting transactions" },
    { value: "17", label: "Countries represented" },
  ],
});

/**
 * Website-wide Aurelia branding + catalog.
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const AureliaSettingsSchema = z.object({
  agent: z
    .object({
      name: z.string(),
      brand: z.string(),
      monogram: z.string(),
      eyebrow: z.string(),
      heroTitle: z.string(),
      heroSubtitle: z.string(),
      phone: z.string(),
      email: z.string(),
      license: z.string(),
      address: z.string(),
      instagram: z.string(),
      brandTag: z.string(),
      connectLabel: z.string(),
    })
    .default(defaultAgent),
  brand: z
    .object({
      ink: z.string(),
      paper: z.string(),
      cream: z.string(),
      accent: z.string(),
      muted: z.string(),
      white: z.string(),
    })
    .default(defaultBrand),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  catalog: z
    .object({
      images: z.object({
        hero: z.string(),
        portrait: z.string(),
        home1: z.string(),
        home2: z.string(),
        home3: z.string(),
        home4: z.string(),
        home5: z.string(),
        interior1: z.string(),
        interior2: z.string(),
        city: z.string(),
        coast: z.string(),
        palms: z.string(),
      }),
      properties: z.array(PropertySchema),
      globalProperties: z.array(GlobalPropertySchema),
      communities: z.array(CommunitySchema),
      press: z.array(PressItemSchema),
      articles: z.array(ArticleSchema),
      testimonials: z.array(TestimonialSchema),
      networkCities: z.array(z.string()),
      stats: z.array(StatSchema),
    })
    .default(defaultCatalog),
});

export type AureliaSettings = z.infer<typeof AureliaSettingsSchema>;
export type AureliaProperty = z.infer<typeof PropertySchema>;
export type AureliaCommunity = z.infer<typeof CommunitySchema>;
export type AureliaArticle = z.infer<typeof ArticleSchema>;
export type AureliaNavItem = z.infer<typeof NavItemSchema>;
