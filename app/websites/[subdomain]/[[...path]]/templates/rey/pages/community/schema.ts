import { z } from "zod";

const GuideBlockSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  body: z.string(),
});

export const ReyCommunityContentSchema = z.object({
  heroEyebrow: z.string(),
  livingTitlePrefix: z.string(),
  livingBody: z.string(),
  askCtaPrefix: z.string(),
  askCtaHref: z.string(),
  guides: z.array(GuideBlockSchema).min(1),
  nearbyEyebrow: z.string(),
  nearbyTitlePrefix: z.string(),
});

export type ReyCommunityContent = z.infer<typeof ReyCommunityContentSchema>;

export const reyCommunityDefaultContent: ReyCommunityContent = {
  heroEyebrow: "Community guide",
  livingTitlePrefix: "Living in",
  livingBody:
    "For buyers at the top of the market, the distinctions between adjacent streets can be as meaningful as the differences between neighborhoods. Our work begins by clarifying the lifestyle, architecture, privacy, and long-term value that matter most to you.",
  askCtaPrefix: "Ask about",
  askCtaHref: "/contact",
  guides: [
    {
      eyebrow: "Architecture",
      title: "Homes with identity",
      body: "Expect a mix of notable original residences, carefully renovated classics, and ambitious new construction. The strongest properties balance architectural character with modern systems, privacy, and effortless indoor-outdoor flow.",
    },
    {
      eyebrow: "Lifestyle",
      title: "Beyond the front gate",
      body: "Luxury here is shaped by what surrounds the home: restaurants, landscape, coastline or canyon access, neighborhood culture, and the ease of reaching the places that anchor daily life.",
    },
    {
      eyebrow: "Market",
      title: "Nuance matters",
      body: "Price per square foot only tells part of the story. View corridors, lot orientation, pedigree, privacy, renovation quality, and even the side of the street can materially affect value at the high end.",
    },
    {
      eyebrow: "Representation",
      title: "Access and discretion",
      body: "Many of the most compelling opportunities are shared quietly. Experienced representation can provide earlier access, stronger context, and a more informed view of both public and private inventory.",
    },
  ],
  nearbyEyebrow: "Selected properties",
  nearbyTitlePrefix: "Homes near",
};
