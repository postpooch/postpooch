import { z } from "zod";

export const ElenaResidenceContentSchema = z.object({
  backLabel: z.string(),
  inquiryLabel: z.string(),
});

export type ElenaResidenceContent = z.infer<typeof ElenaResidenceContentSchema>;

export const elenaResidenceDefaultContent: ElenaResidenceContent = {
  backLabel: "All residences",
  inquiryLabel: "Request details",
};
