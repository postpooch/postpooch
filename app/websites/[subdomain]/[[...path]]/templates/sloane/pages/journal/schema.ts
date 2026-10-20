import { z } from "zod";

export const SloaneJournalContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  newsletterEyebrow: z.string(),
  newsletterTitle: z.string(),
  newsletterBody: z.string(),
  newsletterCta: z.string(),
});

export type SloaneJournalContent = z.infer<typeof SloaneJournalContentSchema>;

export const sloaneJournalDefaultContent: SloaneJournalContent = {
  eyebrow: "Journal",
  title: "Market intelligence with a point of view.",
  intro:
    "Notes on neighborhoods, design, preparation, and the details that shape residential value across Los Angeles.",
  newsletterEyebrow: "Private notes",
  newsletterTitle: "Useful market context, occasionally.",
  newsletterBody:
    "A concise email for clients who want thoughtful market observations without a crowded inbox.",
  newsletterCta: "Subscribe",
};
