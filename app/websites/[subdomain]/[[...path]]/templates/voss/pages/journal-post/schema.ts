import { z } from "zod";

export const VossJournalPostContentSchema = z.object({
  backLabel: z.string(),
});

export type VossJournalPostContent = z.infer<typeof VossJournalPostContentSchema>;

export const vossJournalPostDefaultContent: VossJournalPostContent = {
  backLabel: "All notes",
};
