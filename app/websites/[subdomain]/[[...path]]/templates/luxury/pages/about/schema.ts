import { z } from "zod";

export const LuxuryAboutContentSchema = z.object({
  heroEyebrow: z.string(),
  heroSubtitle: z.string(),
  quote: z.string(),
  experienceEyebrow: z.string(),
  experienceTitle: z.string(),
  experienceParagraphs: z.array(z.string()),
  resultsEyebrow: z.string(),
  resultsTitle: z.string(),
  featuredEyebrow: z.string(),
  featuredTitle: z.string(),
});

export type LuxuryAboutContent = z.infer<typeof LuxuryAboutContentSchema>;

export const luxuryAboutDefaultContent: LuxuryAboutContent = {
  heroEyebrow: "MEET YOUR ADVISOR",
  heroSubtitle:
    "Personal service, informed strategy, and a clear point of view.",
  quote:
    "Add a concise client-centered quote here that captures the realtor’s philosophy and the feeling of working together.",
  experienceEyebrow: "THE CLIENT EXPERIENCE",
  experienceTitle: "Working with {name}",
  experienceParagraphs: [
    "Use this section to explain communication style, availability, negotiation approach, and how the realtor makes a complicated process feel organized and clear.",
    "Focus on what the client experiences rather than repeating awards or transaction totals.",
  ],
  resultsEyebrow: "SELECTED RESULTS",
  resultsTitle: "A record built one relationship at a time.",
  featuredEyebrow: "FEATURED PROPERTIES",
  featuredTitle: "Current representation.",
};
