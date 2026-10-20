import { z } from "zod";

export const RowanJournalContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  titleEmphasis: z.string(),
  meta: z.string(),
  emptyLabel: z.string(),
});

export type RowanJournalContent = z.infer<typeof RowanJournalContentSchema>;

export const rowanJournalDefaultContent: RowanJournalContent = {
  eyebrow: "Journal",
  title: "Notes on",
  titleEmphasis: "place.",
  meta: "Field notes, market perspective, and the work of representing distinctive homes.",
  emptyLabel: "No posts published yet.",
};

export const RowanJournalPostContentSchema = z.object({
  backLabel: z.string(),
});

export type RowanJournalPostContent = z.infer<typeof RowanJournalPostContentSchema>;

export const rowanJournalPostDefaultContent: RowanJournalPostContent = {
  backLabel: "All notes ↗",
};
