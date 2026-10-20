import { z } from "zod";

const PillarSchema = z.object({
  number: z.string(),
  title: z.string(),
  text: z.string(),
});

export const AtelierMarketingContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  splitEyebrow: z.string(),
  splitTitle: z.string(),
  paragraphs: z.array(z.string()),
  pillars: z.array(PillarSchema),
  image1: z.string(),
  image2: z.string(),
});

export type AtelierMarketingContent = z.infer<typeof AtelierMarketingContentSchema>;

export const atelierMarketingDefaultContent: AtelierMarketingContent = {
  heroEyebrow: "Seller services",
  heroTitle: "Marketing that begins with strategy.",
  heroSubtitle:
    "The goal is not maximum noise. It is precise attention from the people most likely to act.",
  heroImage:
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=90",
  splitEyebrow: "Our approach",
  splitTitle: "A bespoke launch for every home.",
  paragraphs: [
    "Luxury marketing is most effective when it feels specific. We avoid generic listing packages in favor of a campaign built around the property’s architecture, setting, audience, and timing.",
    "Our team coordinates narrative, photography, motion, print, digital distribution, private network outreach, events, and media strategy. Every touchpoint is designed to feel consistent and considered.",
  ],
  pillars: [
    {
      number: "01",
      title: "Positioning",
      text: "We define the property’s most compelling story, likely buyer, pricing posture, and launch sequence before creative begins.",
    },
    {
      number: "02",
      title: "Editorial",
      text: "Architecture-led photography, film, copy, print, and digital assets are art-directed as one coherent campaign.",
    },
    {
      number: "03",
      title: "Distribution",
      text: "Private network outreach, targeted digital campaigns, media relations, and broker-to-broker introductions expand qualified reach.",
    },
    {
      number: "04",
      title: "Conversion",
      text: "Showings, feedback, buyer signals, and negotiation strategy are managed with speed and discretion.",
    },
  ],
  image1:
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=88",
  image2:
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=88",
};
