import { z } from "zod";

import {
  beforeAfterCases as defaultBeforeAfterCases,
  buyerSteps as defaultBuyerSteps,
  conciergeSteps as defaultConciergeSteps,
  images as defaultImages,
  insights as defaultInsights,
  neighborhoods as defaultNeighborhoods,
  properties as defaultProperties,
  resources as defaultResources,
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
  price: z.string(),
  address: z.string(),
  city: z.string(),
  beds: z.number(),
  baths: z.number(),
  sqft: z.string(),
  image: z.string(),
  image2: z.string(),
  image3: z.string(),
  blurb: z.string(),
  description: z.string(),
  featured: z.boolean(),
});

const NeighborhoodSchema = z.object({
  slug: z.string(),
  name: z.string(),
  coords: z.string(),
  image: z.string(),
  intro: z.string(),
});

const InsightSchema = z.object({
  slug: z.string(),
  title: z.string(),
  date: z.string(),
  category: z.string(),
  image: z.string(),
  excerpt: z.string(),
  body: z.array(z.string()).min(1),
});

const TestimonialSchema = z.object({
  initials: z.string(),
  role: z.string(),
  quote: z.string(),
});

const BeforeAfterSchema = z.object({
  title: z.string(),
  copy: z.string(),
  before: z.string(),
  after: z.string(),
});

const ResourceSchema = z.object({
  title: z.string(),
  kicker: z.string(),
  copy: z.string(),
});

const StepSchema = z.object({
  title: z.string(),
  copy: z.string(),
});

const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const defaultAgent = {
  name: "Avery Laurent",
  firstName: "Avery",
  brandFirst: "AVERY",
  brandLast: "LAURENT",
  title: "New York Real Estate Advisor",
  tagline: "New York, exceptionally considered.",
  eyebrow: "Avery Laurent · New York Real Estate",
  phone: "(212) 555-0188",
  email: "hello@averylaurent.com",
  address: "41 Madison Avenue, New York, NY 10010",
  license: "Licensed Real Estate Salesperson",
};

const defaultBrand = {
  ink: "#171713",
  paper: "#f2efe8",
  white: "#fbfaf6",
  taupe: "#c7bfb3",
  muted: "#6f6c65",
};

const defaultNavItems = [
  { label: "Properties", href: "/properties" },
  { label: "Past Sales", href: "/properties/sold" },
  { label: "Search", href: "/search" },
  { label: "About", href: "/about" },
  { label: "Neighborhoods", href: "/neighborhoods" },
  { label: "Insights", href: "/insights" },
  { label: "Home Valuation", href: "/valuation" },
  { label: "Before & After", href: "/before-after" },
  { label: "Private Client Services", href: "/concierge" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Resources", href: "/resources" },
  { label: "Buyer's Guide", href: "/buyers-guide" },
  { label: "Contact", href: "/contact" },
];

const defaultDesktopNavHrefs = [
  "/properties",
  "/about",
  "/neighborhoods",
  "/insights",
];

const defaultCatalog = () => ({
  images: { ...defaultImages },
  properties: [...defaultProperties],
  neighborhoods: [...defaultNeighborhoods],
  insights: [...defaultInsights],
  testimonials: [...defaultTestimonials],
  beforeAfterCases: [...defaultBeforeAfterCases],
  resources: [...defaultResources],
  buyerSteps: [...defaultBuyerSteps],
  conciergeSteps: [...defaultConciergeSteps],
  stats: [
    { value: "$640M+", label: "Career sales" },
    { value: "14", label: "Years in New York" },
    { value: "87%", label: "Repeat & referral business" },
    { value: "24/7", label: "Detail obsession" },
  ],
});

/**
 * Website-wide Avery branding + catalog.
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const AverySettingsSchema = z.object({
  agent: z
    .object({
      name: z.string(),
      firstName: z.string(),
      brandFirst: z.string(),
      brandLast: z.string(),
      title: z.string(),
      tagline: z.string(),
      eyebrow: z.string(),
      phone: z.string(),
      email: z.string(),
      address: z.string(),
      license: z.string(),
    })
    .default(defaultAgent),
  brand: z
    .object({
      ink: z.string(),
      paper: z.string(),
      white: z.string(),
      taupe: z.string(),
      muted: z.string(),
    })
    .default(defaultBrand),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  desktopNavHrefs: z.array(z.string()).default(defaultDesktopNavHrefs),
  catalog: z
    .object({
      images: z.object({
        hero: z.string(),
        agent: z.string(),
        agent2: z.string(),
        city1: z.string(),
        city2: z.string(),
        city3: z.string(),
        interior: z.string(),
        kitchen: z.string(),
        bedroom: z.string(),
        footer: z.string(),
      }),
      properties: z.array(PropertySchema),
      neighborhoods: z.array(NeighborhoodSchema),
      insights: z.array(InsightSchema),
      testimonials: z.array(TestimonialSchema),
      beforeAfterCases: z.array(BeforeAfterSchema),
      resources: z.array(ResourceSchema),
      buyerSteps: z.array(StepSchema),
      conciergeSteps: z.array(StepSchema),
      stats: z.array(StatSchema),
    })
    .default(defaultCatalog),
});

export type AverySettings = z.infer<typeof AverySettingsSchema>;
export type AveryProperty = z.infer<typeof PropertySchema>;
export type AveryNeighborhood = z.infer<typeof NeighborhoodSchema>;
export type AveryInsight = z.infer<typeof InsightSchema>;
export type AveryNavItem = z.infer<typeof NavItemSchema>;
