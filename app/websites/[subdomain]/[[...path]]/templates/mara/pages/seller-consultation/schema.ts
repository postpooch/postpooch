import { z } from "zod";

export const MaraSellerConsultationContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  lead: z.string(),
  body: z.string(),
});

export type MaraSellerConsultationContent = z.infer<
  typeof MaraSellerConsultationContentSchema
>;

export const maraSellerConsultationDefaultContent: MaraSellerConsultationContent =
  {
    eyebrow: "Seller consultation",
    title: "Start with the property, not the pitch.",
    lead: "We’ll talk through your home, your timing, what buyers are responding to, and whether preparation is likely to change the result. You’ll leave with a clearer sense of options before making any commitment.",
    body: "For distinctive properties, the best launch strategy is often built weeks before the listing goes live.",
  };
