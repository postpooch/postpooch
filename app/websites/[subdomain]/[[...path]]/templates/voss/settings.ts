import { z } from "zod";

import {
  developments as defaultDevelopments,
  journal as defaultJournal,
  neighborhoods as defaultNeighborhoods,
  press as defaultPress,
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
  neighborhood: z.string(),
  price: z.string(),
  beds: z.number(),
  baths: z.number(),
  sqft: z.string(),
  status: z.string(),
  type: z.string(),
  image: z.string(),
  gallery: z.array(z.string()),
  summary: z.string(),
  details: z.array(z.string()),
});

const NeighborhoodSchema = z.object({
  slug: z.string(),
  name: z.string(),
  kicker: z.string(),
  image: z.string(),
  text: z.string(),
});

const JournalPostSchema = z.object({
  title: z.string(),
  category: z.string(),
  date: z.string(),
  image: z.string(),
});

const ServiceSchema = z.object({
  n: z.string(),
  title: z.string(),
  copy: z.string(),
});

const DevelopmentSchema = z.object({
  name: z.string(),
  area: z.string(),
  stage: z.string(),
  image: z.string(),
});

const PressItemSchema = z.object({
  outlet: z.string(),
  title: z.string(),
  note: z.string(),
});

const defaultAgent = {
  firstName: "Mara",
  lastName: "Voss",
  fullName: "Mara Voss",
  monogram: "MV",
  email: "hello@maravoss.com",
  pressEmail: "press@maravoss.com",
  phone: "+1 212 555 0184",
  market: "Manhattan · Brooklyn",
  location: "New York, NY",
  license: "NY RE Lic. #00000000",
  instagram: "Instagram ↗",
  logoName: "MARA VOSS",
  logoSub: "NEW YORK REAL ESTATE",
  consultationLabel: "Private Consultation",
};

const defaultBrand = {
  ink: "#171714",
  paper: "#f2efe8",
  paper2: "#e8e3d9",
  white: "#fcfaf5",
  copper: "#9b5d43",
  line: "rgba(23,23,20,.2)",
  accentLight: "#d9b5a5",
};

const defaultNavItems = [
  { label: "Properties", href: "/properties" },
  { label: "Services", href: "/services" },
  { label: "Neighborhoods", href: "/neighborhoods" },
  { label: "About Mara", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

const defaultCatalog = {
  properties: [...defaultProperties],
  neighborhoods: [...defaultNeighborhoods],
  journal: [...defaultJournal],
  services: [...defaultServices],
  developments: [...defaultDevelopments],
  press: [...defaultPress],
};

/**
 * Website-wide Voss branding + catalog (from mara-voss-real-estate).
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const VossSettingsSchema = z.object({
  agent: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      fullName: z.string(),
      monogram: z.string(),
      email: z.string(),
      pressEmail: z.string(),
      phone: z.string(),
      market: z.string(),
      location: z.string(),
      license: z.string(),
      instagram: z.string(),
      logoName: z.string(),
      logoSub: z.string(),
      consultationLabel: z.string(),
    })
    .default(defaultAgent),
  brand: z
    .object({
      ink: z.string(),
      paper: z.string(),
      paper2: z.string(),
      white: z.string(),
      copper: z.string(),
      line: z.string(),
      accentLight: z.string(),
    })
    .default(defaultBrand),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  catalog: z
    .object({
      properties: z.array(PropertySchema),
      neighborhoods: z.array(NeighborhoodSchema),
      journal: z.array(JournalPostSchema),
      services: z.array(ServiceSchema),
      developments: z.array(DevelopmentSchema),
      press: z.array(PressItemSchema),
    })
    .default(defaultCatalog),
});

export type VossSettings = z.infer<typeof VossSettingsSchema>;
export type VossProperty = z.infer<typeof PropertySchema>;
export type VossNeighborhood = z.infer<typeof NeighborhoodSchema>;
export type VossJournalPost = z.infer<typeof JournalPostSchema>;
export type VossService = z.infer<typeof ServiceSchema>;
export type VossDevelopment = z.infer<typeof DevelopmentSchema>;
export type VossPressItem = z.infer<typeof PressItemSchema>;
export type VossNavItem = z.infer<typeof NavItemSchema>;
