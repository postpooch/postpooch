import { z } from "zod";

import {
  areas as defaultAreas,
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
  address: z.string(),
  city: z.string(),
  area: z.string(),
  price: z.string(),
  status: z.string(),
  type: z.string(),
  year: z.number(),
  living: z.number(),
  plot: z.number(),
  bedrooms: z.number(),
  energy: z.string(),
  hero: z.string(),
  images: z.array(z.string()).min(1),
  blurb: z.string(),
  description: z.string(),
  features: z.array(z.string()),
});

const ServiceStepSchema = z.tuple([z.string(), z.string()]);

const ServiceSchema = z.object({
  slug: z.string(),
  number: z.string(),
  eyebrow: z.string(),
  title: z.string(),
  short: z.string(),
  intro: z.string(),
  image: z.string(),
  steps: z.array(ServiceStepSchema).min(1),
});

const AreaSchema = z.object({
  slug: z.string(),
  city: z.string(),
  label: z.string(),
  image: z.string(),
  intro: z.string(),
  body: z.string(),
  points: z.array(z.string()),
});

const ArticleSectionSchema = z.tuple([z.string(), z.string()]);

const ArticleSchema = z.object({
  slug: z.string(),
  category: z.string(),
  date: z.string(),
  title: z.string(),
  intro: z.string(),
  image: z.string(),
  sections: z.array(ArticleSectionSchema).min(1),
});

const defaultAgent = {
  name: "Mila van den Berg",
  shortName: "Mila",
  role: "Licensed Broker & Appraiser",
  phoneDisplay: "030 204 18 90",
  phoneHref: "+31302041890",
  email: "hello@milawonen.nl",
  address: "Maliesingel 38, 3581 BK Utrecht",
  instagram: "@milawonen",
  rating: "9.7",
  reviews: "86",
  experience: "12+",
  homes: "240+",
  brandMark: "M",
  brandName: "MILA",
  brandTag: "wonen",
  portrait:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/ae/ae48082498eebb4d98ebe016900e442f09f8358198fef54b5080a190f5701ace.avif",
};

const defaultNavItems = [
  { href: "/diensten", label: "Services" },
  { href: "/aanbod", label: "Listings" },
  { href: "/regios", label: "Areas" },
  { href: "/over-mila", label: "About Mila" },
  { href: "/insights", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

const defaultCatalog = {
  properties: [...defaultProperties],
  services: [...defaultServices],
  areas: [...defaultAreas],
  articles: [...defaultArticles],
};

/**
 * Website-wide Mila branding + catalog.
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const MilaSettingsSchema = z.object({
  agent: z
    .object({
      name: z.string(),
      shortName: z.string(),
      role: z.string(),
      phoneDisplay: z.string(),
      phoneHref: z.string(),
      email: z.string(),
      address: z.string(),
      instagram: z.string(),
      rating: z.string(),
      reviews: z.string(),
      experience: z.string(),
      homes: z.string(),
      brandMark: z.string(),
      brandName: z.string(),
      brandTag: z.string(),
      portrait: z.string(),
    })
    .default(defaultAgent),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  catalog: z
    .object({
      properties: z.array(PropertySchema),
      services: z.array(ServiceSchema),
      areas: z.array(AreaSchema),
      articles: z.array(ArticleSchema),
    })
    .default(defaultCatalog),
});

export type MilaSettings = z.infer<typeof MilaSettingsSchema>;
export type MilaProperty = z.infer<typeof PropertySchema>;
export type MilaService = z.infer<typeof ServiceSchema>;
export type MilaArea = z.infer<typeof AreaSchema>;
export type MilaArticle = z.infer<typeof ArticleSchema>;
export type MilaNavItem = z.infer<typeof NavItemSchema>;
