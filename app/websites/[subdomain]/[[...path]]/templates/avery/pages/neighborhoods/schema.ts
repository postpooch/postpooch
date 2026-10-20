import { z } from "zod";

export const AveryNeighborhoodsContentSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroSub: z.string(),
});

export type AveryNeighborhoodsContent = z.infer<typeof AveryNeighborhoodsContentSchema>;

export const averyNeighborhoodsDefaultContent: AveryNeighborhoodsContent = {
  heroKicker: "Local knowledge",
  heroTitle: "Neighborhoods",
  heroSub:
    "New York is not one market. It is hundreds of tiny ones, often separated by a few blocks.",
};
