import { z } from "zod";

export const AveryNeighborhoodContentSchema = z.object({
  feelingKicker: z.string(),
  feelingTitlePrefix: z.string(),
  feelingBody: z.array(z.string()).min(1),
  homesKicker: z.string(),
  homesTitle: z.string(),
  homesNote: z.string(),
  snapshot: z.array(z.object({ value: z.string(), label: z.string() })).min(1),
});

export type AveryNeighborhoodContent = z.infer<typeof AveryNeighborhoodContentSchema>;

export const averyNeighborhoodDefaultContent: AveryNeighborhoodContent = {
  feelingKicker: "The feeling",
  feelingTitlePrefix: "What makes",
  feelingBody: [
    "This neighborhood rewards people who pay attention. The architecture changes block by block, the best local routines are often unmarked, and value depends as much on building character and exposure as a neighborhood label.",
    "For buyers, we look beyond the obvious: transportation patterns, construction history, light, street noise, building financials, local inventory, and how the area is likely to evolve over the next several years.",
  ],
  homesKicker: "Market snapshot",
  homesTitle: "Selected homes nearby",
  homesNote: "Sample inventory shown for template purposes.",
  snapshot: [
    { value: "$2.9M", label: "Median luxury sale" },
    { value: "42", label: "Avg. days on market" },
    { value: "98.4%", label: "Sale-to-last-ask" },
    { value: "6.1%", label: "YoY inventory change" },
  ],
};
