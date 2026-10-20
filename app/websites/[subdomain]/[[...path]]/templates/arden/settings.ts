import { z } from "zod";

import {
  agents as defaultAgents,
  films as defaultFilms,
  images,
  neighborhoods as defaultNeighborhoods,
  posts as defaultPosts,
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
  title: z.string(),
  location: z.string(),
  price: z.string(),
  status: z.string(),
  beds: z.number().optional(),
  baths: z.number().optional(),
  sqft: z.string().optional(),
  acres: z.string().optional(),
  image: z.string(),
  gallery: z.array(z.string()),
  excerpt: z.string(),
  description: z.array(z.string()),
  features: z.array(z.string()),
});

const AgentSchema = z.object({
  slug: z.string(),
  name: z.string(),
  role: z.string(),
  image: z.string(),
  phone: z.string(),
  email: z.string(),
  license: z.string(),
  intro: z.string(),
  bio: z.array(z.string()),
});

const NeighborhoodSchema = z.object({
  slug: z.string(),
  name: z.string(),
  image: z.string(),
  tagline: z.string(),
  about: z.string(),
});

const PostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  dek: z.string(),
  date: z.string(),
  image: z.string(),
  category: z.string(),
  body: z.array(z.string()),
});

const PressSchema = z.object({
  publication: z.string(),
  title: z.string(),
  copy: z.string(),
});

const FilmSchema = z.object({
  image: z.string(),
  title: z.string(),
  copy: z.string(),
});

const TestimonialSchema = z.object({
  quote: z.string(),
  cite: z.string(),
});

const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const defaultBrand = {
  name: "Arden Vale + Co",
  shortName: "Arden Vale",
  tagline: "Wine Country Estates",
  eyebrow: "Wine Country representation",
};

const defaultContact = {
  phone: "707.555.0148",
  email: "hello@ardenvale.com",
  address: "1347 Main Street, St. Helena, CA 94574",
  license: "CA DRE# 01234567",
};

const defaultColors = {
  ink: "#151515",
  cream: "#f3f0e8",
  sage: "#72796a",
  paper: "#fbfaf7",
  line: "#d7d4cc",
  muted: "#716f69",
};

const defaultHero = {
  eyebrow: "Napa Valley · Sonoma Valley",
  title: "Wine Country, Exceptionally Represented",
  subtitle:
    "A private real estate advisory for distinctive homes, vineyards, and legacy estates.",
  image: images.hero,
};

const defaultResults = [
  { value: "$2.1B+", label: "Career Sales" },
  { value: "24", label: "Years in Wine Country" },
  { value: "Top 1%", label: "Nationwide Network" },
  { value: "38", label: "Countries Reached" },
];

const defaultNavItems = [
  {
    label: "Find a Home",
    href: "/properties/sale",
    children: [
      { label: "Exclusive Listings", href: "/properties/sale" },
      { label: "Exclusive Leases", href: "/properties/leases" },
    ],
  },
  {
    label: "Sell Your Home",
    href: "/sell-your-home",
    children: [
      { label: "Home Valuation", href: "/sell-your-home" },
      { label: "Notable Sales", href: "/properties/sold" },
    ],
  },
  {
    label: "Home Search",
    href: "/napa-valley-real-estate",
    children: [
      { label: "Napa Valley Real Estate", href: "/napa-valley-real-estate" },
      { label: "Sonoma Valley Real Estate", href: "/sonoma-valley-real-estate" },
      { label: "View All Listings", href: "/home-search/listings" },
    ],
  },
  {
    label: "Who We Are",
    href: "/about",
    children: [
      { label: "Our Story", href: "/about" },
      { label: "Alexandra Vale", href: "/agents/alexandra-vale" },
      { label: "The Brokerage", href: "/the-brokerage" },
      { label: "Client Portal", href: "/presence-copilot" },
    ],
  },
  {
    label: "The Lifestyle",
    href: "/blog",
    children: [
      { label: "Journal", href: "/blog" },
      { label: "Communities", href: "/neighborhoods" },
      { label: "Testimonials", href: "/testimonials" },
    ],
  },
  {
    label: "Press & Media",
    href: "/press",
    children: [
      { label: "Press", href: "/press" },
      { label: "Films", href: "/videos" },
      { label: "Global Collection", href: "/properties/worldwide" },
    ],
  },
];

const defaultCatalog = {
  properties: defaultProperties,
  agents: defaultAgents,
  neighborhoods: defaultNeighborhoods,
  posts: defaultPosts,
  press: defaultPress,
  films: defaultFilms,
  testimonials: defaultTestimonials,
};

export const ArdenSettingsSchema = z.object({
  brand: z
    .object({
      name: z.string(),
      shortName: z.string(),
      tagline: z.string(),
      eyebrow: z.string(),
    })
    .default(defaultBrand),
  contact: z
    .object({
      phone: z.string(),
      email: z.string(),
      address: z.string(),
      license: z.string(),
    })
    .default(defaultContact),
  colors: z
    .object({
      ink: z.string(),
      cream: z.string(),
      sage: z.string(),
      paper: z.string(),
      line: z.string(),
      muted: z.string(),
    })
    .default(defaultColors),
  hero: z
    .object({
      eyebrow: z.string(),
      title: z.string(),
      subtitle: z.string(),
      image: z.string(),
    })
    .default(defaultHero),
  results: z.array(StatSchema).default(defaultResults),
  searchHref: z.string().default("/home-search/listings"),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  catalog: z
    .object({
      properties: z.array(PropertySchema),
      agents: z.array(AgentSchema),
      neighborhoods: z.array(NeighborhoodSchema),
      posts: z.array(PostSchema),
      press: z.array(PressSchema),
      films: z.array(FilmSchema),
      testimonials: z.array(TestimonialSchema),
    })
    .default(defaultCatalog),
});

export type ArdenSettings = z.infer<typeof ArdenSettingsSchema>;
export type ArdenProperty = z.infer<typeof PropertySchema>;
export type ArdenAgent = z.infer<typeof AgentSchema>;
export type ArdenNeighborhood = z.infer<typeof NeighborhoodSchema>;
export type ArdenPost = z.infer<typeof PostSchema>;
export type ArdenNavItem = z.infer<typeof NavItemSchema>;
