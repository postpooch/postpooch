import { z } from "zod";

export const AtelierJournalPostContentSchema = z.object({
  backLabel: z.string(),
});

export type AtelierJournalPostContent = z.infer<
  typeof AtelierJournalPostContentSchema
>;

export const atelierJournalPostDefaultContent: AtelierJournalPostContent = {
  backLabel: "Back to journal ↗",
};
