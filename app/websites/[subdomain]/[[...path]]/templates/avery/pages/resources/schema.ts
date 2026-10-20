import { z } from "zod";

export const AveryResourcesContentSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroSub: z.string(),
  openLabel: z.string(),
});

export type AveryResourcesContent = z.infer<typeof AveryResourcesContentSchema>;

export const averyResourcesDefaultContent: AveryResourcesContent = {
  heroKicker: "Reference library",
  heroTitle: "Resources",
  heroSub: "Useful context for making informed New York real estate decisions.",
  openLabel: "Open resource",
};
