import { z } from "zod";

export const ValeJournalPostContentSchema = z.object({
  backLabel: z.string(),
});

export type ValeJournalPostContent = z.infer<typeof ValeJournalPostContentSchema>;

export const valeJournalPostDefaultContent: ValeJournalPostContent = {
  backLabel: "← Back to journal",
};
