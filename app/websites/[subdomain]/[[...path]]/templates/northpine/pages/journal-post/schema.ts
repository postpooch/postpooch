import { z } from "zod";

export const NorthpineJournalPostContentSchema = z.object({
  readTime: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
});

export type NorthpineJournalPostContent = z.infer<
  typeof NorthpineJournalPostContentSchema
>;

export const northpineJournalPostDefaultContent: NorthpineJournalPostContent = {
  readTime: "6 MIN READ",
  ctaLabel: "Explore Communities",
  ctaHref: "/communities",
};
