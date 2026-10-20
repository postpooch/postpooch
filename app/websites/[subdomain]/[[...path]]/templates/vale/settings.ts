import { z } from "zod";

import {
  articles as defaultArticles,
  properties as defaultProperties,
  services as defaultServices,
} from "./catalog-defaults";

const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const PropertySchema = z.object({
  slug: z.string(),
  title: z.string(),
  location: z.string(),
  price: z.string(),
  beds: z.string(),
  baths: z.string(),
  sqft: z.string(),
  status: z.string(),
  image: z.string(),
  gallery: z.array(z.string()).min(1),
  intro: z.string(),
  details: z.string(),
});

const ServiceSchema = z.object({
  number: z.string(),
  title: z.string(),
  text: z.string(),
});

const ArticleSchema = z.object({
  slug: z.string(),
  category: z.string(),
  date: z.string(),
  title: z.string(),
  excerpt: z.string(),
  image: z.string(),
  body: z.array(z.string()).min(1),
});

const defaultAgent = {
  name: "Mara Vale",
  wordmarkLeft: "MARA",
  wordmarkRight: "VALE",
  title: "Residential Real Estate Advisor",
  market: "Coastal California",
  phone: "(760) 555-0148",
  email: "hello@maravale.com",
  instagram: "@maravalehomes",
  basedIn: "North County San Diego",
  serving: "Serving coastal California",
};

const defaultNavItems = [
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

const defaultCatalog = {
  properties: [...defaultProperties],
  services: [...defaultServices],
  articles: [...defaultArticles],
};

/**
 * Website-wide Vale branding + catalog.
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const ValeSettingsSchema = z.object({
  agent: z
    .object({
      name: z.string(),
      wordmarkLeft: z.string(),
      wordmarkRight: z.string(),
      title: z.string(),
      market: z.string(),
      phone: z.string(),
      email: z.string(),
      instagram: z.string(),
      basedIn: z.string(),
      serving: z.string(),
    })
    .default(defaultAgent),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  catalog: z
    .object({
      properties: z.array(PropertySchema),
      services: z.array(ServiceSchema),
      articles: z.array(ArticleSchema),
    })
    .default(defaultCatalog),
});

export type ValeSettings = z.infer<typeof ValeSettingsSchema>;
export type ValeProperty = z.infer<typeof PropertySchema>;
export type ValeService = z.infer<typeof ServiceSchema>;
export type ValeArticle = z.infer<typeof ArticleSchema>;
export type ValeNavItem = z.infer<typeof NavItemSchema>;
