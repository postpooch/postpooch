import { z } from "zod";

export const LuxuryNeighborhoodContentSchema = z.object({
  dataNote: z.string(),
});

export type LuxuryNeighborhoodContent = z.infer<
  typeof LuxuryNeighborhoodContentSchema
>;

export const luxuryNeighborhoodDefaultContent: LuxuryNeighborhoodContent = {
  dataNote:
    "Example data only. Connect this section to verified census, market, school, walkability, or internal neighborhood data.",
};
