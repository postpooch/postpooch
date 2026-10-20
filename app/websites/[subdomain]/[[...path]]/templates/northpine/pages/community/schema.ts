import { z } from "zod";

export const NorthpineCommunityContentSchema = z.object({
  overviewKicker: z.string(),
  overviewTitlePrefix: z.string(),
  lead: z.string(),
  bodyOne: z.string(),
  bodyTwo: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  factsTitle: z.string(),
  nearbyKicker: z.string(),
  nearbyTitlePrefix: z.string(),
});

export type NorthpineCommunityContent = z.infer<typeof NorthpineCommunityContentSchema>;

export const northpineCommunityDefaultContent: NorthpineCommunityContent = {
  overviewKicker: "AREA OVERVIEW",
  overviewTitlePrefix: "Living in",
  lead: "The best community is the one that fits your routine, not just your weekend impression.",
  bodyOne:
    "offers its own blend of access, scenery and property types. Buyers here often prioritize the setting first—privacy, water, views, trails or convenience—then refine by architecture and amenities.",
  bodyTwo:
    "We help clients compare drive times, road quality, internet, rental rules, nearby services and the less obvious characteristics that shape day-to-day ownership.",
  ctaLabel: "Search This Area",
  ctaHref: "/dream-home",
  factsTitle: "At a glance",
  nearbyKicker: "CURRENT OPPORTUNITIES",
  nearbyTitlePrefix: "Homes near",
};
