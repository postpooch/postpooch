import { z } from "zod";

import {
  additionalSold as defaultAdditionalSold,
  insights as defaultInsights,
  neighborhoods as defaultNeighborhoods,
  press as defaultPress,
  properties as defaultProperties,
  sold as defaultSold,
} from "./catalog-defaults";

const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const PropertySchema = z.object({
  slug: z.string(),
  status: z.string(),
  price: z.string(),
  address: z.string(),
  neighborhood: z.string(),
  type: z.string(),
  beds: z.string(),
  baths: z.string(),
  sqft: z.string(),
  image: z.string(),
  image2: z.string(),
  image3: z.string(),
  blurb: z.string(),
  description: z.string(),
});

const NeighborhoodSchema = z.object({
  name: z.string(),
  count: z.string(),
  note: z.string(),
  image: z.string(),
});

const SoldItemSchema = z.object({
  price: z.string(),
  label: z.string(),
  year: z.string(),
});

const InsightSchema = z.object({
  slug: z.string(),
  category: z.string(),
  title: z.string(),
  date: z.string(),
  excerpt: z.string(),
  image: z.string(),
  body: z.array(z.string()).min(1),
});

const PressItemSchema = z.object({
  outlet: z.string(),
  title: z.string(),
  date: z.string(),
});

const defaultAgent = {
  firstName: "NATHAN",
  lastName: "VALE",
  fullName: "Nathan Vale",
  monogram: "NV",
  email: "hello@nathanvale.com",
  phone: "+1 212 555 0186",
  market: "New York · The Hamptons",
  license: "Licensed Associate Real Estate Broker · NY",
  instagram: "@nathanvale.nyc",
  brokerageName: "Vale Private Real Estate",
  verticalWord: "VALE PRIVATE",
  contactCtaLabel: "Work with Nathan ↗",
};

const defaultBrand = {
  ink: "#111315",
  paper: "#f1eee7",
  white: "#fbfaf7",
  line: "rgba(17,19,21,.18)",
  cobalt: "#3155ff",
  muted: "#6e706f",
};

const defaultNavItems = [
  { label: "Properties", href: "/properties" },
  { label: "Neighborhoods", href: "/neighborhoods" },
  { label: "About", href: "/about" },
  { label: "Results", href: "/sold" },
  { label: "Insights", href: "/insights" },
  { label: "Press", href: "/press" },
];

const defaultCatalog = {
  properties: [...defaultProperties],
  neighborhoods: [...defaultNeighborhoods],
  sold: [...defaultSold],
  additionalSold: [...defaultAdditionalSold],
  insights: [...defaultInsights],
  press: [...defaultPress],
};

/**
 * Website-wide Nathan branding + catalog (from vale-estate).
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const NathanSettingsSchema = z.object({
  agent: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      fullName: z.string(),
      monogram: z.string(),
      email: z.string(),
      phone: z.string(),
      market: z.string(),
      license: z.string(),
      instagram: z.string(),
      brokerageName: z.string(),
      verticalWord: z.string(),
      contactCtaLabel: z.string(),
    })
    .default(defaultAgent),
  brand: z
    .object({
      ink: z.string(),
      paper: z.string(),
      white: z.string(),
      line: z.string(),
      cobalt: z.string(),
      muted: z.string(),
    })
    .default(defaultBrand),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  catalog: z
    .object({
      properties: z.array(PropertySchema),
      neighborhoods: z.array(NeighborhoodSchema),
      sold: z.array(SoldItemSchema),
      additionalSold: z.array(SoldItemSchema),
      insights: z.array(InsightSchema),
      press: z.array(PressItemSchema),
    })
    .default(defaultCatalog),
});

export type NathanSettings = z.infer<typeof NathanSettingsSchema>;
export type NathanProperty = z.infer<typeof PropertySchema>;
export type NathanNeighborhood = z.infer<typeof NeighborhoodSchema>;
export type NathanSoldItem = z.infer<typeof SoldItemSchema>;
export type NathanInsight = z.infer<typeof InsightSchema>;
export type NathanPressItem = z.infer<typeof PressItemSchema>;
export type NathanNavItem = z.infer<typeof NavItemSchema>;
