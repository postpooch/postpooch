import { z } from "zod";

import {
  communities as defaultCommunities,
  images as defaultImages,
  posts as defaultPosts,
  press as defaultPress,
  properties as defaultProperties,
  team as defaultTeam,
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
  lot: z.string(),
  year: z.number(),
  image: z.string(),
  summary: z.string(),
  description: z.string(),
});

const CommunitySchema = z.object({
  slug: z.string(),
  name: z.string(),
  image: z.string(),
  blurb: z.string(),
  highlights: z.array(z.string()),
});

const TestimonialSchema = z.object({
  quote: z.string(),
  name: z.string(),
  type: z.string(),
});

const PressSchema = z.object({
  outlet: z.string(),
  title: z.string(),
  year: z.string(),
});

const PostSchema = z.object({
  slug: z.string(),
  category: z.string(),
  title: z.string(),
  excerpt: z.string(),
  image: z.string(),
  date: z.string(),
  body: z.array(z.string()).min(1),
});

const TeamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  image: z.string(),
  details: z.string(),
  text: z.string(),
});

const defaultAgent = {
  name: "Sloane Reed",
  monogram: "SR",
  title: "Luxury Real Estate Advisor",
  phone: "310.555.0148",
  officePhone: "310.555.0100",
  email: "hello@sloanereed.com",
  address: "9600 Wilshire Boulevard, Beverly Hills, CA 90212",
  license: "DRE# 02147833",
  instagram: "@sloanereedhomes",
};

const defaultBrand = {
  ink: "#171715",
  paper: "#f3f0e9",
  white: "#fff",
  line: "rgba(23,23,21,.18)",
  muted: "#777369",
  accent: "#9b9177",
  soft: "#ded8ca",
  serif: "Georgia, 'Times New Roman', serif",
  sans: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const defaultNavItems = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Sloane", href: "/about" },
      { label: "Meet the Team", href: "/team" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    label: "Properties",
    href: "/properties",
    children: [
      { label: "Exclusive Listings", href: "/properties/exclusive" },
      { label: "For Lease", href: "/properties/lease" },
      { label: "Sold", href: "/properties/sold" },
      { label: "All Properties", href: "/properties" },
      { label: "Property Search", href: "/properties/search" },
    ],
  },
  {
    label: "Communities",
    href: "/communities",
    children: [
      ...defaultCommunities.slice(0, 5).map((community) => ({
        label: community.name,
        href: `/communities/${community.slug}`,
      })),
      { label: "View All", href: "/communities" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Buying", href: "/resources/buying" },
      { label: "Selling", href: "/resources/selling" },
      { label: "Financing", href: "/resources/financing" },
      { label: "Property Valuation", href: "/resources/valuation" },
    ],
  },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

const defaultCatalog = {
  properties: [...defaultProperties],
  communities: [...defaultCommunities],
  testimonials: [...defaultTestimonials],
  press: [...defaultPress],
  posts: [...defaultPosts],
  team: [...defaultTeam],
};

/**
 * Website-wide Sloane branding + catalog.
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const SloaneSettingsSchema = z.object({
  agent: z
    .object({
      name: z.string(),
      monogram: z.string(),
      title: z.string(),
      phone: z.string(),
      officePhone: z.string(),
      email: z.string(),
      address: z.string(),
      license: z.string(),
      instagram: z.string(),
    })
    .default(defaultAgent),
  brand: z
    .object({
      ink: z.string(),
      paper: z.string(),
      white: z.string(),
      line: z.string(),
      muted: z.string(),
      accent: z.string(),
      soft: z.string(),
      serif: z.string(),
      sans: z.string(),
    })
    .default(defaultBrand),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  images: z
    .object({
      palm: z.string(),
      interior: z.string(),
      house1: z.string(),
      house2: z.string(),
      house3: z.string(),
      house4: z.string(),
      house5: z.string(),
      house6: z.string(),
      pool: z.string(),
      agent: z.string(),
      agent2: z.string(),
    })
    .default(defaultImages),
  catalog: z
    .object({
      properties: z.array(PropertySchema),
      communities: z.array(CommunitySchema),
      testimonials: z.array(TestimonialSchema),
      press: z.array(PressSchema),
      posts: z.array(PostSchema),
      team: z.array(TeamMemberSchema),
    })
    .default(defaultCatalog),
});

export type SloaneSettings = z.infer<typeof SloaneSettingsSchema>;
export type SloaneProperty = z.infer<typeof PropertySchema>;
export type SloaneCommunity = z.infer<typeof CommunitySchema>;
export type SloaneTestimonial = z.infer<typeof TestimonialSchema>;
export type SloanePressItem = z.infer<typeof PressSchema>;
export type SloanePost = z.infer<typeof PostSchema>;
export type SloaneTeamMember = z.infer<typeof TeamMemberSchema>;
export type SloaneNavItem = z.infer<typeof NavItemSchema>;
