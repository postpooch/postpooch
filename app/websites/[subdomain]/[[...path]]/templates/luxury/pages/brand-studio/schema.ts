import { z } from "zod";

export const LuxuryBrandStudioContentSchema = z.object({
  note: z.string(),
});

export type LuxuryBrandStudioContent = z.infer<
  typeof LuxuryBrandStudioContentSchema
>;

export const luxuryBrandStudioDefaultContent: LuxuryBrandStudioContent = {
  note: "",
};
