import { z } from "zod";

import {
  buyerSteps as defaultBuyerSteps,
  communities as defaultCommunities,
  financingSteps as defaultFinancingSteps,
  images as defaultImages,
  mediaItems as defaultMediaItems,
  posts as defaultPosts,
  properties as defaultProperties,
  sellerSteps as defaultSellerSteps,
  team as defaultTeam,
  testimonials as defaultTestimonials,
  videos as defaultVideos,
} from "./catalog-defaults";

const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const PropertySchema = z.object({
  slug: z.string(),
  price: z.string(),
  address: z.string(),
  city: z.string(),
  beds: z.number(),
  baths: z.number(),
  sqft: z.string(),
  status: z.string(),
  image: z.string(),
  blurb: z.string(),
});

const HighlightSchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
});

const CommunitySchema = z.object({
  slug: z.string(),
  name: z.string(),
  eyebrow: z.string(),
  image: z.string(),
  intro: z.string(),
  highlights: z.array(HighlightSchema),
});

const TestimonialSchema = z.object({
  name: z.string(),
  quote: z.string(),
});

const PostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  date: z.string(),
  excerpt: z.string(),
  image: z.string(),
  body: z.array(z.string()).min(1),
});

const GuideStepSchema = z.object({
  slug: z.string(),
  title: z.string(),
  intro: z.string(),
});

const TeamMemberSchema = z.object({
  name: z.string(),
  title: z.string(),
  image: z.string(),
});

const MediaItemSchema = z.object({
  source: z.string(),
  title: z.string(),
  type: z.string(),
});

const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const defaultAgent = {
  firstName: "Alexandra",
  lastName: "Vale",
  name: "Alexandra Vale",
  monogram: "AV",
  title: "Luxury Real Estate Advisor",
  brokerage: "Vale Coastal Estates",
  license: "CA DRE #01234567",
  phone: "949.555.0148",
  phoneHref: "+19495550148",
  email: "hello@valecoastal.com",
  address: "2200 Harbor Boulevard, Suite 410, Newport Beach, CA",
  shortBio:
    "A private, design-led real estate practice for buyers and sellers who expect sharp strategy, discretion, and an exceptional presentation.",
  longBio:
    "Alexandra Vale advises clients across Southern California's most sought-after coastal neighborhoods. Her approach combines market intelligence, editorial-quality marketing, careful negotiation, and a service model built around long-term relationships. From first conversation through closing, every detail is managed with calm precision.",
  instagram: "@valecoastal",
};

const defaultBrand = {
  ink: "#111315",
  paper: "#f4f0e9",
  accent: "#bda476",
  muted: "#74736f",
};

const defaultNavItems = [
  { label: "About", href: "/about" },
  { label: "Properties", href: "/listings" },
  { label: "Communities", href: "/communities" },
  { label: "Buy", href: "/buy" },
  { label: "Sell", href: "/sell" },
  { label: "Media", href: "/media" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const defaultCatalog = () => ({
  images: { ...defaultImages },
  properties: [...defaultProperties],
  communities: [...defaultCommunities],
  testimonials: [...defaultTestimonials],
  posts: [...defaultPosts],
  buyerSteps: [...defaultBuyerSteps],
  sellerSteps: [...defaultSellerSteps],
  financingSteps: [...defaultFinancingSteps],
  team: [...defaultTeam],
  videos: [...defaultVideos],
  mediaItems: [...defaultMediaItems],
  stats: [
    { value: "$860M+", label: "Career sales" },
    { value: "18", label: "Years advising clients" },
    { value: "240+", label: "Luxury transactions" },
  ],
  social: ["Instagram", "YouTube", "LinkedIn", "Facebook"],
});

/**
 * Website-wide Coastal branding + catalog (from coastal-estate-template).
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const CoastalSettingsSchema = z.object({
  agent: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      name: z.string(),
      monogram: z.string(),
      title: z.string(),
      brokerage: z.string(),
      license: z.string(),
      phone: z.string(),
      phoneHref: z.string(),
      email: z.string(),
      address: z.string(),
      shortBio: z.string(),
      longBio: z.string(),
      instagram: z.string(),
    })
    .default(defaultAgent),
  brand: z
    .object({
      ink: z.string(),
      paper: z.string(),
      accent: z.string(),
      muted: z.string(),
    })
    .default(defaultBrand),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  catalog: z
    .object({
      images: z.object({
        hero1: z.string(),
        hero2: z.string(),
        hero3: z.string(),
        lido: z.string(),
        pelican: z.string(),
        emerald: z.string(),
        beach: z.string(),
        laguna: z.string(),
        newportCoast: z.string(),
        interior: z.string(),
        street: z.string(),
        landscape: z.string(),
        map: z.string(),
        media: z.string(),
        portrait: z.string(),
        social3: z.string(),
        social4: z.string(),
        associate: z.string(),
        client: z.string(),
        team: z.string(),
        video: z.string(),
        press: z.string(),
        journal: z.string(),
      }),
      properties: z.array(PropertySchema),
      communities: z.array(CommunitySchema),
      testimonials: z.array(TestimonialSchema),
      posts: z.array(PostSchema),
      buyerSteps: z.array(GuideStepSchema),
      sellerSteps: z.array(GuideStepSchema),
      financingSteps: z.array(GuideStepSchema),
      team: z.array(TeamMemberSchema),
      videos: z.array(z.string()),
      mediaItems: z.array(MediaItemSchema),
      stats: z.array(StatSchema),
      social: z.array(z.string()),
    })
    .default(defaultCatalog),
});

export type CoastalSettings = z.infer<typeof CoastalSettingsSchema>;
export type CoastalProperty = z.infer<typeof PropertySchema>;
export type CoastalCommunity = z.infer<typeof CommunitySchema>;
export type CoastalPost = z.infer<typeof PostSchema>;
export type CoastalGuideStep = z.infer<typeof GuideStepSchema>;
