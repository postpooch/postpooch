import { z } from "zod";

import {
  communities as defaultCommunities,
  developments as defaultDevelopments,
  posts as defaultPosts,
  press as defaultPress,
  properties as defaultProperties,
  recentSales as defaultRecentSales,
  team as defaultTeam,
  videos as defaultVideos,
} from "./catalog-defaults";

const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

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
  name: z.string(),
  address: z.string(),
  beds: z.number(),
  baths: z.number(),
  sqft: z.string(),
  acres: z.string().nullable(),
  description: z.string(),
  image: z.string(),
  gallery: z.array(z.string()),
});

const CommunitySchema = z.object({
  slug: z.string(),
  name: z.string(),
  tagline: z.string(),
  image: z.string(),
  intro: z.string(),
  lifestyle: z.string(),
  market: z.string(),
  highlights: z.array(z.string()),
  stats: z.array(StatSchema),
});

const TeamMemberSchema = z.object({
  slug: z.string(),
  name: z.string(),
  role: z.string(),
  image: z.string(),
  bio: z.string(),
});

const PressItemSchema = z.object({
  publication: z.string(),
  title: z.string(),
  year: z.string(),
});

const DevelopmentSectionSchema = z.object({
  title: z.string(),
  text: z.string(),
  image: z.string(),
});

const DevelopmentSchema = z.object({
  slug: z.string(),
  name: z.string(),
  location: z.string(),
  status: z.string(),
  image: z.string(),
  secondaryImage: z.string(),
  summary: z.string(),
  sections: z.array(DevelopmentSectionSchema),
});

const PostBodySchema = z.object({
  heading: z.string(),
  paragraphs: z.array(z.string()),
});

const PostSchema = z.object({
  slug: z.string(),
  category: z.string(),
  title: z.string(),
  excerpt: z.string(),
  date: z.string(),
  readTime: z.string(),
  image: z.string(),
  body: z.array(PostBodySchema),
});

const VideoSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  duration: z.string(),
});

const defaultBrand = {
  siteName: "YOUR NAME | REAL ESTATE",
  logoTextTop: "YOUR NAME",
  logoTextBottom: "REAL ESTATE",
  monogram: "YN",
  colors: {
    ink: "#18201d",
    paper: "#f3f0e9",
    surface: "#ffffff",
    accent: "#9b7b50",
    accentDark: "#6f5738",
    muted: "#70756f",
    line: "#d8d4cb",
    overlay: "rgba(8, 14, 12, .42)",
  },
  typography: {
    display: "Georgia, 'Times New Roman', serif",
    body: "Arial, Helvetica, sans-serif",
    letterSpacing: ".16em",
  },
};

const defaultRealtor = {
  name: "YOUR NAME",
  firstName: "YOUR",
  title: "Luxury Real Estate Advisor",
  market: "Your City",
  region: "Your State",
  phone: "(555) 555-0123",
  email: "hello@yourdomain.com",
  license: "License #00000000",
  yearsExperience: "20+",
  shortBio:
    "A trusted advisor for exceptional homes, offering thoughtful guidance, local expertise, and a private, highly personal client experience.",
  longBio: [
    "Add the realtor’s primary biography here. This first paragraph should establish experience, specialties, market knowledge, and the kind of clients the realtor serves.",
    "Use the second paragraph for awards, sales achievements, professional memberships, and differentiators. Keep every claim factual and easy to update from your database.",
    "Use the final paragraph for education, community involvement, personal interests, and a warm detail that helps prospective clients understand the person behind the business.",
  ],
  headshot:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/08/08e2a796ec5ca813aac8d53ae940a2e186ec378b245043f1119e507aa5115979.avif",
  lifestyleImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/ad/ad31c1527e1bfa95841b1f0f42ae2280e13c27a6794dd9979568da769fde059b.avif",
};

const defaultBrokerage = {
  name: "YOUR BROKERAGE",
  officePhone: "(555) 555-0100",
  addressLine1: "123 Market Street, Suite 100",
  addressLine2: "Your City, ST 00000",
  equalHousingText:
    "This office supports the principles of the Fair Housing Act and Equal Opportunity Act. Each office is independently owned and operated.",
  disclaimer:
    "Replace this placeholder with all brokerage, licensing, MLS, state commission, and consent disclosures required in the realtor’s jurisdiction.",
};

const defaultSeo = {
  title: "Luxury Real Estate in Your City | Your Name",
  description:
    "Discover exceptional homes, neighborhoods, market insight, and personal real estate representation in Your City.",
};

const defaultSocial = {
  instagram: "https://instagram.com/",
  linkedin: "https://linkedin.com/",
  youtube: "https://youtube.com/",
};

const defaultHero = {
  eyebrow: "YOUR CITY’S LUXURY REAL ESTATE ADVISOR",
  title: "Extraordinary homes.\nThoughtfully represented.",
  subtitle:
    "A refined real estate experience shaped around your goals, your timing, and the life you want to live.",
  image:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/52/52aba5f4710514944ee55a83fba3ebd63ef9bfbaacdf630044cdbd1105a478d0.avif",
};

const defaultResults = [
  { value: "$1B+", label: "Career Sales" },
  { value: "#1", label: "Replace With Ranking" },
  { value: "$250M", label: "Recent Annual Sales" },
  { value: "20+", label: "Years of Experience" },
];

const defaultCallsToAction = {
  workWithTitle: "Work With Your Name",
  workWithSubtitle: "Local Expertise. Global Reach. Personal Representation.",
  newsletterTitle: "Stay Informed",
  newsletterText:
    "Receive curated listings, neighborhood notes, and useful market perspective.",
};

const defaultNavItems = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Meet the Realtor", href: "/about" },
      { label: "Meet the Team", href: "/meet-the-support-staff" },
      { label: "As Seen In", href: "/press" },
      { label: "Bespoke Marketing", href: "/bespoke-marketing" },
    ],
  },
  {
    label: "Properties",
    href: "/exclusive-listings",
    children: [
      { label: "Exclusive Listings", href: "/exclusive-listings" },
      { label: "Notable Recent Sales", href: "/recent-sales" },
      { label: "Search All Homes", href: "/home-search" },
    ],
  },
  { label: "Developments", href: "/new-developments" },
  { label: "Communities", href: "/neighborhoods" },
  {
    label: "Resources",
    href: "/blog",
    children: [
      { label: "Home Valuation", href: "/home-valuation" },
      { label: "Video Gallery", href: "/video-gallery" },
      { label: "The Journal", href: "/blog" },
    ],
  },
];

const defaultCatalog = {
  properties: defaultProperties,
  recentSales: defaultRecentSales,
  communities: defaultCommunities,
  team: defaultTeam,
  press: defaultPress,
  developments: defaultDevelopments,
  posts: defaultPosts,
  videos: defaultVideos,
};

/**
 * Website-wide Luxury branding + catalog.
 * Omitted fields fall back via Zod defaults so `websites.settings = {}` still works.
 */
export const LuxurySettingsSchema = z.object({
  brand: z
    .object({
      siteName: z.string(),
      logoTextTop: z.string(),
      logoTextBottom: z.string(),
      monogram: z.string(),
      colors: z.object({
        ink: z.string(),
        paper: z.string(),
        surface: z.string(),
        accent: z.string(),
        accentDark: z.string(),
        muted: z.string(),
        line: z.string(),
        overlay: z.string(),
      }),
      typography: z.object({
        display: z.string(),
        body: z.string(),
        letterSpacing: z.string(),
      }),
    })
    .default(defaultBrand),
  realtor: z
    .object({
      name: z.string(),
      firstName: z.string(),
      title: z.string(),
      market: z.string(),
      region: z.string(),
      phone: z.string(),
      email: z.string(),
      license: z.string(),
      yearsExperience: z.string(),
      shortBio: z.string(),
      longBio: z.array(z.string()),
      headshot: z.string(),
      lifestyleImage: z.string(),
    })
    .default(defaultRealtor),
  brokerage: z
    .object({
      name: z.string(),
      officePhone: z.string(),
      addressLine1: z.string(),
      addressLine2: z.string(),
      equalHousingText: z.string(),
      disclaimer: z.string(),
    })
    .default(defaultBrokerage),
  seo: z
    .object({
      title: z.string(),
      description: z.string(),
    })
    .default(defaultSeo),
  social: z
    .object({
      instagram: z.string(),
      linkedin: z.string(),
      youtube: z.string(),
    })
    .default(defaultSocial),
  hero: z
    .object({
      eyebrow: z.string(),
      title: z.string(),
      subtitle: z.string(),
      image: z.string(),
    })
    .default(defaultHero),
  results: z.array(StatSchema).default(defaultResults),
  callsToAction: z
    .object({
      workWithTitle: z.string(),
      workWithSubtitle: z.string(),
      newsletterTitle: z.string(),
      newsletterText: z.string(),
    })
    .default(defaultCallsToAction),
  navItems: z.array(NavItemSchema).default(defaultNavItems),
  catalog: z
    .object({
      properties: z.array(PropertySchema),
      recentSales: z.array(PropertySchema),
      communities: z.array(CommunitySchema),
      team: z.array(TeamMemberSchema),
      press: z.array(PressItemSchema),
      developments: z.array(DevelopmentSchema),
      posts: z.array(PostSchema),
      videos: z.array(VideoSchema),
    })
    .default(defaultCatalog),
});

export type LuxurySettings = z.infer<typeof LuxurySettingsSchema>;
export type LuxuryProperty = z.infer<typeof PropertySchema>;
export type LuxuryCommunity = z.infer<typeof CommunitySchema>;
export type LuxuryDevelopment = z.infer<typeof DevelopmentSchema>;
export type LuxuryPost = z.infer<typeof PostSchema>;
export type LuxuryNavItem = z.infer<typeof NavItemSchema>;
