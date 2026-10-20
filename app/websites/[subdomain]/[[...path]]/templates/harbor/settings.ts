import { z } from "zod";

import {
  buildings as defaultBuildings,
  listings as defaultListings,
  neighbourhoods as defaultNeighbourhoods,
  posts as defaultPosts,
  processBuy as defaultProcessBuy,
  processSell as defaultProcessSell,
  testimonials as defaultTestimonials,
} from "./catalog-defaults";

const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const ListingSchema = z.object({
  slug: z.string(),
  status: z.enum([
    "For Sale",
    "Sold",
    "Coming Soon",
    "Pending",
    "For Rent",
    "Rented",
    "Off Market",
  ]),
  eyebrow: z.string(),
  address: z.string(),
  neighbourhood: z.string(),
  price: z.string(),
  beds: z.string(),
  baths: z.string(),
  image: z.string(),
  alt: z.string(),
  blurb: z.string(),
  gallery: z.array(z.string()).optional(),
});

const TestimonialSchema = z.object({
  quote: z.string(),
  name: z.string(),
  role: z.string(),
});

const PostSchema = z.object({
  slug: z.string(),
  category: z.string(),
  date: z.string(),
  title: z.string(),
  dek: z.string(),
  image: z.string(),
  body: z.array(z.string()).optional(),
});

const BuildingSchema = z.object({
  name: z.string(),
  area: z.string(),
  note: z.string(),
});

const ProcessStepSchema = z.object({
  n: z.string(),
  title: z.string(),
  body: z.string(),
});

const defaultAgent = {
  name: "Avery Rowan",
  firstName: "Avery",
  monogram: "AR",
  title: "Broker · Residential Real Estate",
  phone: "(416) 555-0147",
  phoneHref: "+14165550147",
  email: "hello@averyrowan.ca",
  area: "Toronto West",
  brokerage: "North & Lake Realty, Brokerage",
  address: "Toronto, Ontario",
  instagram: "@averyrowanrealestate",
};

const defaultBrand = {
  ink: "#171713",
  paper: "#f3f0e9",
  paper2: "#e8e3d8",
  white: "#fcfbf7",
  olive: "#4e5446",
  line: "rgba(23,23,19,.18)",
  lightLine: "rgba(255,255,255,.2)",
  serif: "Georgia,'Times New Roman',serif",
  sans: "Arial,Helvetica,sans-serif",
};

const defaultNavItems = [
  { label: "Properties", href: "/listings" },
  { label: "Sell", href: "/sell" },
  { label: "Buy", href: "/buy" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
];

const defaultMenuExtras = [
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

const defaultMenuSecondary = [
  { label: "What could my home sell for?", href: "/home-value" },
  { label: "Get the market report", href: "/market-report" },
  { label: "Explore the condo guide", href: "/condo-guide" },
];

const defaultCatalog = {
  listings: [...defaultListings],
  testimonials: [...defaultTestimonials],
  neighbourhoods: [...defaultNeighbourhoods],
  posts: [...defaultPosts],
  buildings: [...defaultBuildings],
  processSell: [...defaultProcessSell],
  processBuy: [...defaultProcessBuy],
};

/**
 * Website-wide Harbor branding + catalog (from harbor-house-realty).
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const HarborSettingsSchema = z.object({
  agent: z
    .object({
      name: z.string(),
      firstName: z.string(),
      monogram: z.string(),
      title: z.string(),
      phone: z.string(),
      phoneHref: z.string(),
      email: z.string(),
      area: z.string(),
      brokerage: z.string(),
      address: z.string(),
      instagram: z.string(),
    })
    .default(defaultAgent),
  brand: z
    .object({
      ink: z.string(),
      paper: z.string(),
      paper2: z.string(),
      white: z.string(),
      olive: z.string(),
      line: z.string(),
      lightLine: z.string(),
      serif: z.string(),
      sans: z.string(),
    })
    .default(defaultBrand),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  menuExtras: z.array(NavItemSchema).default(defaultMenuExtras),
  menuSecondary: z.array(NavItemSchema).default(defaultMenuSecondary),
  catalog: z
    .object({
      listings: z.array(ListingSchema),
      testimonials: z.array(TestimonialSchema),
      neighbourhoods: z.array(z.string()),
      posts: z.array(PostSchema),
      buildings: z.array(BuildingSchema),
      processSell: z.array(ProcessStepSchema),
      processBuy: z.array(ProcessStepSchema),
    })
    .default(defaultCatalog),
});

export type HarborSettings = z.infer<typeof HarborSettingsSchema>;
export type HarborNavItem = z.infer<typeof NavItemSchema>;
export type HarborListing = z.infer<typeof ListingSchema>;
export type HarborTestimonial = z.infer<typeof TestimonialSchema>;
export type HarborPost = z.infer<typeof PostSchema>;
export type HarborBuilding = z.infer<typeof BuildingSchema>;
export type HarborProcessStep = z.infer<typeof ProcessStepSchema>;
