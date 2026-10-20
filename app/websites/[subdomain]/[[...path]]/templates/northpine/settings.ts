import { z } from "zod";

import {
  aboutDifference as defaultAboutDifference,
  attractions as defaultAttractions,
  awards as defaultAwards,
  buyerGuides as defaultBuyerGuides,
  communities as defaultCommunities,
  experiences as defaultExperiences,
  financeGuides as defaultFinanceGuides,
  images as defaultImages,
  mapLabels as defaultMapLabels,
  marketingItems as defaultMarketingItems,
  movingSections as defaultMovingSections,
  packingSections as defaultPackingSections,
  partnerGroups as defaultPartnerGroups,
  posts as defaultPosts,
  properties as defaultProperties,
  publicServices as defaultPublicServices,
  sellerGuides as defaultSellerGuides,
  sitemapGroups as defaultSitemapGroups,
  stats as defaultStats,
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
  title: z.string(),
  city: z.string(),
  price: z.string(),
  beds: z.number(),
  baths: z.string(),
  sqft: z.string(),
  status: z.string(),
  tag: z.string(),
  image: z.string(),
  description: z.string(),
});

const CommunitySchema = z.object({
  slug: z.string(),
  name: z.string(),
  image: z.string(),
  description: z.string(),
  bestFor: z.string(),
  propertyMix: z.string(),
  outdoorAccess: z.string(),
  marketFeel: z.string(),
});

const TestimonialSchema = z.object({
  quote: z.string(),
  name: z.string(),
  detail: z.string(),
});

const ArticleSectionSchema = z.object({
  title: z.string(),
  body: z.string(),
});

const PostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  date: z.string(),
  excerpt: z.string(),
  image: z.string(),
  lead: z.string(),
  paragraphs: z.array(z.string()),
  sections: z.array(ArticleSectionSchema),
});

const TeamMemberSchema = z.object({
  slug: z.string(),
  name: z.string(),
  role: z.string(),
  image: z.string(),
  quote: z.string(),
  bio: z.string(),
  approach: z.string(),
});

const GuideSchema = z.object({
  slug: z.string(),
  title: z.string(),
  intro: z.string(),
  sections: z.array(ArticleSectionSchema),
});

const AttractionSchema = z.object({
  slug: z.string(),
  title: z.string(),
  intro: z.string(),
  image: z.string(),
});

const ExperienceSchema = z.object({
  title: z.string(),
  image: z.string(),
  href: z.string(),
});

const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const MapLabelSchema = z.object({
  label: z.string(),
  className: z.string(),
});

const MarketingItemSchema = z.object({
  number: z.string(),
  title: z.string(),
  text: z.string(),
});

const ChecklistSectionSchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
});

const PublicServiceSchema = z.object({
  title: z.string(),
  lines: z.array(z.string()),
});

const PartnerItemSchema = z.object({
  name: z.string(),
  phone: z.string(),
  note: z.string(),
});

const PartnerGroupSchema = z.object({
  title: z.string(),
  items: z.array(PartnerItemSchema),
});

const SitemapLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const SitemapGroupSchema = z.object({
  title: z.string(),
  links: z.array(SitemapLinkSchema),
});

const defaultAgent = {
  name: "Avery Hart",
  firstName: "Avery",
  company: "Northpine Realty",
  title: "Real Estate Advisor",
  phone: "706.555.0188",
  email: "hello@northpinerealty.com",
  address: "18 Mountain Laurel Way, Blue Ridge, GA 30513",
  tagline: "Mountain homes. Local knowledge. Elevated service.",
  location: "Blue Ridge, Georgia",
  portrait: defaultImages.agent,
};

const defaultBrand = {
  ink: "#1d211e",
  ink2: "#2b312c",
  cream: "#f2eee5",
  paper: "#faf8f3",
  sage: "#747c6d",
  bronze: "#9b785b",
  line: "#d9d4c9",
  white: "#fff",
  serif: "Georgia,'Times New Roman',serif",
  sans: "Arial,Helvetica,sans-serif",
};

const defaultNavItems = [
  {
    label: "About",
    href: "/about-us",
    children: [
      { label: "Meet Avery", href: "/agents/avery-hart" },
      { label: "Our Hometown", href: "/about-my-hometown" },
      { label: "Testimonials", href: "/testimonials" },
    ],
  },
  {
    label: "Properties",
    href: "/homes-for-sale-featured",
    children: [
      { label: "Featured Listings", href: "/homes-for-sale-featured" },
      { label: "Recently Sold", href: "/sold-featured-listing" },
    ],
  },
  {
    label: "Communities",
    href: "/communities",
    children: defaultCommunities.slice(0, 7).map((community) => ({
      label: community.name,
      href: `/community/${community.slug}`,
    })),
  },
  {
    label: "Search",
    href: "/homes-for-sale-search-advanced",
    children: [
      { label: "Advanced Search", href: "/homes-for-sale-search-advanced" },
      { label: "Map Search", href: "/homes-for-sale-map-search" },
      { label: "Saved Homes", href: "/user-login" },
    ],
  },
  {
    label: "Sellers",
    href: "/sellers/decide-to-sell",
    children: [
      { label: "Seller Guide", href: "/sellers/decide-to-sell" },
      { label: "Our Marketing", href: "/marketing" },
      { label: "Packing Tips", href: "/packing-tips" },
      { label: "Moving Checklist", href: "/moving-checklist" },
    ],
  },
  {
    label: "Resources",
    href: "/preferred-partners",
    children: [
      { label: "Buyer Guide", href: "/buyers/deciding-to-buy" },
      { label: "Financing", href: "/financing-options/financing-options" },
      { label: "Preferred Partners", href: "/preferred-partners" },
      { label: "Public Services", href: "/public-services" },
    ],
  },
  { label: "Journal", href: "/category/blog" },
  { label: "Contact", href: "/contact" },
];

const defaultCatalog = {
  properties: [...defaultProperties],
  communities: [...defaultCommunities],
  testimonials: [...defaultTestimonials],
  posts: [...defaultPosts],
  team: [...defaultTeam],
  sellerGuides: [...defaultSellerGuides],
  buyerGuides: [...defaultBuyerGuides],
  financeGuides: [...defaultFinanceGuides],
  attractions: [...defaultAttractions],
  experiences: [...defaultExperiences],
  stats: [...defaultStats],
  awards: [...defaultAwards],
  mapLabels: [...defaultMapLabels],
  marketingItems: [...defaultMarketingItems],
  packingSections: [...defaultPackingSections],
  movingSections: [...defaultMovingSections],
  publicServices: [...defaultPublicServices],
  partnerGroups: [...defaultPartnerGroups],
  aboutDifference: [...defaultAboutDifference],
  sitemapGroups: [...defaultSitemapGroups],
  inquiryInterests: ["Buying", "Selling", "Relocating", "Investing"],
};

/**
 * Website-wide Northpine branding + catalog (from northpine-realty-template).
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const NorthpineSettingsSchema = z.object({
  agent: z
    .object({
      name: z.string(),
      firstName: z.string(),
      company: z.string(),
      title: z.string(),
      phone: z.string(),
      email: z.string(),
      address: z.string(),
      tagline: z.string(),
      location: z.string(),
      portrait: z.string(),
    })
    .default(defaultAgent),
  brand: z
    .object({
      ink: z.string(),
      ink2: z.string(),
      cream: z.string(),
      paper: z.string(),
      sage: z.string(),
      bronze: z.string(),
      line: z.string(),
      white: z.string(),
      serif: z.string(),
      sans: z.string(),
    })
    .default(defaultBrand),
  images: z
    .object({
      hero: z.string(),
      agent: z.string(),
      hometown: z.string(),
      lake: z.string(),
      trail: z.string(),
      downtown: z.string(),
      cabin: z.string(),
      interior: z.string(),
      aerial: z.string(),
      waterfall: z.string(),
      orchard: z.string(),
      river: z.string(),
    })
    .default(defaultImages),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  catalog: z
    .object({
      properties: z.array(PropertySchema),
      communities: z.array(CommunitySchema),
      testimonials: z.array(TestimonialSchema),
      posts: z.array(PostSchema),
      team: z.array(TeamMemberSchema),
      sellerGuides: z.array(GuideSchema),
      buyerGuides: z.array(GuideSchema),
      financeGuides: z.array(GuideSchema),
      attractions: z.array(AttractionSchema),
      experiences: z.array(ExperienceSchema),
      stats: z.array(StatSchema),
      awards: z.array(z.string()),
      mapLabels: z.array(MapLabelSchema),
      marketingItems: z.array(MarketingItemSchema),
      packingSections: z.array(ChecklistSectionSchema),
      movingSections: z.array(ChecklistSectionSchema),
      publicServices: z.array(PublicServiceSchema),
      partnerGroups: z.array(PartnerGroupSchema),
      aboutDifference: z.array(StatSchema),
      sitemapGroups: z.array(SitemapGroupSchema),
      inquiryInterests: z.array(z.string()),
    })
    .default(defaultCatalog),
});

export type NorthpineSettings = z.infer<typeof NorthpineSettingsSchema>;
export type NorthpineProperty = z.infer<typeof PropertySchema>;
export type NorthpineCommunity = z.infer<typeof CommunitySchema>;
export type NorthpinePost = z.infer<typeof PostSchema>;
export type NorthpineTeamMember = z.infer<typeof TeamMemberSchema>;
export type NorthpineGuide = z.infer<typeof GuideSchema>;
export type NorthpineAttraction = z.infer<typeof AttractionSchema>;
export type NorthpineNavItem = z.infer<typeof NavItemSchema>;
