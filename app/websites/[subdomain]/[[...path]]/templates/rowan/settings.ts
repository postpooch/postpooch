import { z } from "zod";

import {
  listings as defaultListings,
  projects as defaultProjects,
  testimonials as defaultTestimonials,
} from "./catalog-defaults";

const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const ProjectSchema = z.object({
  slug: z.string(),
  name: z.string(),
  location: z.string(),
  price: z.string(),
  image: z.string(),
  eyebrow: z.string(),
  facts: z.array(z.string()).min(1),
  intro: z.string(),
  body: z.array(z.string()).min(1),
});

const ListingSchema = z.object({
  slug: z.string(),
  address: z.string(),
  location: z.string(),
  price: z.string(),
  status: z.string(),
  type: z.string(),
  image: z.string(),
  beds: z.number(),
  baths: z.number(),
  sqft: z.string(),
  acres: z.string(),
  intro: z.string(),
});

const TestimonialSchema = z.object({
  quote: z.string(),
  name: z.string(),
  role: z.string(),
});

const defaultAgent = {
  name: "Avery Rowan",
  role: "Private Real Estate Advisor",
  phone: "+1 555 014 7820",
  email: "hello@averyrowan.com",
  license: "Demo license #000000",
  wordmarkSub: "PRIVATE REAL ESTATE",
};

const defaultNavItems = [
  { label: "Projects", href: "/#projects" },
  { label: "Buy", href: "/#buy" },
  { label: "Sell", href: "/#sell" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const defaultCatalog = {
  projects: [...defaultProjects],
  listings: [...defaultListings],
  testimonials: [...defaultTestimonials],
};

/**
 * Website-wide Rowan branding + catalog.
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const RowanSettingsSchema = z.object({
  agent: z
    .object({
      name: z.string(),
      role: z.string(),
      phone: z.string(),
      email: z.string(),
      license: z.string(),
      wordmarkSub: z.string(),
    })
    .default(defaultAgent),
  region: z.string().default("Mountain, lake & architectural properties"),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  catalog: z
    .object({
      projects: z.array(ProjectSchema),
      listings: z.array(ListingSchema),
      testimonials: z.array(TestimonialSchema),
    })
    .default(defaultCatalog),
});

export type RowanSettings = z.infer<typeof RowanSettingsSchema>;
export type RowanProject = z.infer<typeof ProjectSchema>;
export type RowanListing = z.infer<typeof ListingSchema>;
export type RowanTestimonial = z.infer<typeof TestimonialSchema>;
export type RowanNavItem = z.infer<typeof NavItemSchema>;
