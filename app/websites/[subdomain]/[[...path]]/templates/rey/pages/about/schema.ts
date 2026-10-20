import { z } from "zod";

import { images } from "../../catalog-defaults";

const TimelineItemSchema = z.object({
  year: z.string(),
  title: z.string(),
  text: z.string(),
});

export const ReyAboutContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
  introTitleLine1: z.string(),
  introTitleLine2: z.string(),
  introTitleEmphasis: z.string(),
  introBodyOne: z.string(),
  introBodyTwo: z.string(),
  introCtaLabel: z.string(),
  introCtaHref: z.string(),
  imageLarge: z.string(),
  imageSmall: z.string(),
  timelineEyebrow: z.string(),
  timelineTitleLine1: z.string(),
  timelineTitleEmphasis: z.string(),
  timeline: z.array(TimelineItemSchema).min(1),
  quote: z.string(),
  quoteName: z.string(),
  quoteRole: z.string(),
});

export type ReyAboutContent = z.infer<typeof ReyAboutContentSchema>;

export const reyAboutDefaultContent: ReyAboutContent = {
  heroEyebrow: "About Elena",
  heroTitle: "A reputation built one relationship at a time.",
  heroImage: images.portrait,
  introTitleLine1: "Experience",
  introTitleLine2: "without",
  introTitleEmphasis: "complacency.",
  introBodyOne:
    "Elena Vale has spent more than three decades at the highest levels of Southern California real estate. Her career has been defined not by a single record or address, but by the trust of clients who return to her across generations and markets.",
  introBodyTwo:
    "She approaches every property as its own story and every transaction as a responsibility. That means precise preparation, direct communication, thoughtful positioning, and discretion when privacy matters most.",
  introCtaLabel: "Start a conversation",
  introCtaHref: "/contact",
  imageLarge: images.oakInterior,
  imageSmall: images.interiorStone,
  timelineEyebrow: "Selected milestones",
  timelineTitleLine1: "A career in",
  timelineTitleEmphasis: "constant motion.",
  timeline: [
    {
      year: "1994",
      title: "A private-practice beginning",
      text: "Elena launches her real estate career on the Westside, working closely with established estate brokers and learning the market property by property.",
    },
    {
      year: "2002",
      title: "A reputation for complex deals",
      text: "Her business expands into Beverly Hills and Bel Air, with a growing focus on architectural homes, discreet sales, and high-stakes negotiations.",
    },
    {
      year: "2011",
      title: "An international client base",
      text: "A referral-driven practice begins to serve buyers and sellers across Europe, Asia, and the Middle East seeking Southern California residences.",
    },
    {
      year: "2018",
      title: "The Elena Vale Group",
      text: "Elena forms a dedicated team to combine highly personal advice with best-in-class presentation, digital strategy, and transaction support.",
    },
    {
      year: "Today",
      title: "A modern luxury practice",
      text: "The group continues to represent noteworthy properties while preserving the discretion, responsiveness, and judgment on which the business was built.",
    },
  ],
  quote:
    "Luxury is not a price point. It is the quality of attention a client receives when the decisions matter.",
  quoteName: "Elena Vale",
  quoteRole: "Founder",
};
