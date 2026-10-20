import { z } from "zod";

export const AtelierJournalContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
});

export type AtelierJournalContent = z.infer<typeof AtelierJournalContentSchema>;

export const atelierJournalDefaultContent: AtelierJournalContent = {
  heroEyebrow: "The Edit",
  heroTitle: "Market, design & place.",
  heroSubtitle:
    "Notes for people who care about where they live and why it matters.",
};
