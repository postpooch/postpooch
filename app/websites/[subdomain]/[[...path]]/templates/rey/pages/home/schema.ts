import { z } from "zod";

import { images } from "../../catalog-defaults";

const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const ReyHomeContentSchema = z.object({
  heroImage: z.string(),
  heroTitleLine1: z.string(),
  heroTitleEmphasis: z.string(),
  heroCtaLabel: z.string(),
  heroCtaHref: z.string(),
  aboutImage: z.string(),
  aboutEyebrow: z.string(),
  aboutTitleLine1: z.string(),
  aboutTitleEmphasis: z.string(),
  aboutBody: z.string(),
  aboutCtaLabel: z.string(),
  aboutCtaHref: z.string(),
  stats: z.array(StatSchema).min(1),
  propertiesEyebrow: z.string(),
  propertiesTitleLine1: z.string(),
  propertiesTitleEmphasis: z.string(),
  propertiesDeck: z.string(),
  propertiesCtaLabel: z.string(),
  propertiesCtaHref: z.string(),
  quote: z.string(),
  quoteName: z.string(),
  quoteRole: z.string(),
  communitiesEyebrow: z.string(),
  communitiesTitleLine1: z.string(),
  communitiesTitleEmphasis: z.string(),
  communitiesDeck: z.string(),
  communitiesCtaLabel: z.string(),
  communitiesCtaHref: z.string(),
  teamImage: z.string(),
  teamEyebrow: z.string(),
  teamTitleLine1: z.string(),
  teamTitleEmphasis: z.string(),
  teamBody: z.string(),
  teamCtaLabel: z.string(),
  teamCtaHref: z.string(),
});

export type ReyHomeContent = z.infer<typeof ReyHomeContentSchema>;

export const reyHomeDefaultContent: ReyHomeContent = {
  heroImage: images.crestline,
  heroTitleLine1: "Global perspective.",
  heroTitleEmphasis: "California instinct.",
  heroCtaLabel: "View exceptional homes",
  heroCtaHref: "/properties",
  aboutImage: images.portrait,
  aboutEyebrow: "A career built on trust",
  aboutTitleLine1: "Meet",
  aboutTitleEmphasis: "Elena Vale.",
  aboutBody:
    "For more than three decades, Elena has represented exceptional residences across Southern California with a rare combination of market intelligence, discretion, and personal attention.",
  aboutCtaLabel: "Discover Elena's story",
  aboutCtaHref: "/about",
  stats: [
    { value: "$3.2B+", label: "Career sales" },
    { value: "30+", label: "Years advising clients" },
  ],
  propertiesEyebrow: "Homes that inspire",
  propertiesTitleLine1: "Current",
  propertiesTitleEmphasis: "residences.",
  propertiesDeck:
    "A considered collection of architectural homes, private estates, and coastal retreats across Southern California.",
  propertiesCtaLabel: "View all properties",
  propertiesCtaHref: "/properties",
  quote:
    "We never felt pushed. We felt advised. The team's knowledge of the market, the homes, and the people involved changed the outcome for us.",
  quoteName: "Private Client",
  quoteRole: "Bel Air",
  communitiesEyebrow: "Lifestyles of Southern California",
  communitiesTitleLine1: "Places with",
  communitiesTitleEmphasis: "a point of view.",
  communitiesDeck:
    "From Beverly Hills estate streets to the Pacific edge of Malibu, each market carries a distinct architectural and cultural identity.",
  communitiesCtaLabel: "Explore communities",
  communitiesCtaHref: "/communities",
  teamImage: images.team,
  teamEyebrow: "The Elena Vale Group",
  teamTitleLine1: "Personal service.",
  teamTitleEmphasis: "Collective expertise.",
  teamBody:
    "A tightly integrated team brings strategy, presentation, negotiation, and client care together under one standard.",
  teamCtaLabel: "Meet the team",
  teamCtaHref: "/team",
};
