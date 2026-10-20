import { z } from "zod";

export const ReyJournalContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  emptyLabel: z.string(),
});

export type ReyJournalContent = z.infer<typeof ReyJournalContentSchema>;

export const reyJournalDefaultContent: ReyJournalContent = {
  heroEyebrow: "Journal",
  heroTitle: "Notes on market and place.",
  emptyLabel: "No posts published yet.",
};

export const ReyJournalPostContentSchema = z.object({
  backLabel: z.string(),
});

export type ReyJournalPostContent = z.infer<typeof ReyJournalPostContentSchema>;

export const reyJournalPostDefaultContent: ReyJournalPostContent = {
  backLabel: "All notes",
};
