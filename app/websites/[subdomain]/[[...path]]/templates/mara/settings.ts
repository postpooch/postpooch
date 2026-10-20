import { z } from "zod";

import {
  articles as defaultArticles,
  condos as defaultCondos,
  neighborhoods as defaultNeighborhoods,
  properties as defaultProperties,
  testimonials as defaultTestimonials,
} from "./catalog-defaults";

const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const PropertySchema = z.object({
  slug: z.string(),
  status: z.string(),
  address: z.string(),
  neighborhood: z.string(),
  price: z.string(),
  beds: z.number(),
  baths: z.number(),
  sqft: z.string(),
  image: z.string(),
  summary: z.string(),
  gallery: z.array(z.string()).min(1),
});

const NeighborhoodSchema = z.object({
  slug: z.string(),
  name: z.string(),
  kicker: z.string(),
  image: z.string(),
  copy: z.string(),
  stats: z.array(z.string()),
});

const CondoSchema = z.object({
  slug: z.string(),
  name: z.string(),
  area: z.string(),
  image: z.string(),
  copy: z.string(),
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

const TestimonialSchema = z.object({
  quote: z.string(),
  name: z.string(),
  type: z.string(),
});

const defaultAgent = {
  name: "Mara Vale",
  monogram: "MV",
  title: "Broker & Private Client Advisor",
  phone: "+1 416 555 0148",
  email: "hello@maravale.ca",
  city: "Toronto, Ontario",
  office: "18 Hazelton Avenue · Toronto, ON",
  wordmarkLine1: "MARA VALE",
  wordmarkLine2: "REAL ESTATE",
};

const defaultBrand = {
  ink: "#171713",
  paper: "#f3f0e8",
  cream: "#e8e1d3",
  sage: "#7e8776",
  rust: "#8e5137",
  line: "rgba(23,23,19,.18)",
};

const defaultNavItems = [
  { label: "Properties", href: "/properties" },
  { label: "Neighborhoods", href: "/neighborhoods" },
  { label: "Buy", href: "/buy" },
  { label: "Sell", href: "/sell" },
  { label: "Condo Collection", href: "/condos" },
  { label: "Journal", href: "/journal" },
  { label: "About Mara", href: "/about" },
  { label: "Client Stories", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

const defaultImages = {
  hero: "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/a0/a07773240285f007db39db4ad273311c1962e5be681a165f4e3f31bc9e78b3c4.avif",
  portrait:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/6f/6fb3d6fe2445c3d4a1b6f7e0f112798c95083343f0c0edd0c56a768e72e5021e.avif",
  interior:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/37/374ad529872a02f0232148ef0383c1c1e3d47e99c33aa7d4e014d2f7aab206d2.avif",
  kitchen:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/d7/d752179c6afd8c91ccc8ea1883d2775c5d6b87072c413840bfb3da31cf1f1dee.avif",
  city: "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/f8/f88c39c2912b690798827bf01e24ba90b2f9d19baee485d255573b81a164c996.avif",
  lake: "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/bb/bbbb2c44160cf8e61b57946762db41362a1c2ca666f9fd7ad0b6e05dfbd00c7d.avif",
};

const defaultCatalog = {
  properties: [...defaultProperties],
  neighborhoods: [...defaultNeighborhoods],
  condos: [...defaultCondos],
  articles: [...defaultArticles],
  testimonials: [...defaultTestimonials],
};

/**
 * Website-wide Mara branding + catalog.
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const MaraSettingsSchema = z.object({
  agent: z
    .object({
      name: z.string(),
      monogram: z.string(),
      title: z.string(),
      phone: z.string(),
      email: z.string(),
      city: z.string(),
      office: z.string(),
      wordmarkLine1: z.string(),
      wordmarkLine2: z.string(),
    })
    .default(defaultAgent),
  brand: z
    .object({
      ink: z.string(),
      paper: z.string(),
      cream: z.string(),
      sage: z.string(),
      rust: z.string(),
      line: z.string(),
    })
    .default(defaultBrand),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  images: z
    .object({
      hero: z.string(),
      portrait: z.string(),
      interior: z.string(),
      kitchen: z.string(),
      city: z.string(),
      lake: z.string(),
    })
    .default(defaultImages),
  catalog: z
    .object({
      properties: z.array(PropertySchema),
      neighborhoods: z.array(NeighborhoodSchema),
      condos: z.array(CondoSchema),
      articles: z.array(ArticleSchema),
      testimonials: z.array(TestimonialSchema),
    })
    .default(defaultCatalog),
});

export type MaraSettings = z.infer<typeof MaraSettingsSchema>;
export type MaraProperty = z.infer<typeof PropertySchema>;
export type MaraNeighborhood = z.infer<typeof NeighborhoodSchema>;
export type MaraCondo = z.infer<typeof CondoSchema>;
export type MaraArticle = z.infer<typeof ArticleSchema>;
export type MaraTestimonial = z.infer<typeof TestimonialSchema>;
export type MaraNavItem = z.infer<typeof NavItemSchema>;
