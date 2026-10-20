import { z } from "zod";

export const AveryInsightContentSchema = z.object({
  lede: z.string(),
  contactLabel: z.string(),
});

export type AveryInsightContent = z.infer<typeof AveryInsightContentSchema>;

export const averyInsightDefaultContent: AveryInsightContent = {
  lede: "The best real estate decisions rarely come from one dramatic insight. They come from a sequence of smaller, well-timed decisions made with the right context.",
  contactLabel: "get in touch",
};
