import { z } from "zod";

export const MaraJournalPostContentSchema = z.object({
  contactCta: z.string(),
});

export type MaraJournalPostContent = z.infer<
  typeof MaraJournalPostContentSchema
>;

export const maraJournalPostDefaultContent: MaraJournalPostContent = {
  contactCta: "Talk through a move",
};
