import { z } from "zod";

export const AtelierValuationContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  stepLabel: z.string(),
  formTitle: z.string(),
  finePrint: z.string(),
});

export type AtelierValuationContent = z.infer<typeof AtelierValuationContentSchema>;

export const atelierValuationDefaultContent: AtelierValuationContent = {
  heroEyebrow: "Private market review",
  heroTitle: "What is your home worth today?",
  heroSubtitle:
    "Receive a thoughtful pricing analysis informed by recent sales, active competition, buyer behavior, and the unique character of your property.",
  heroImage:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=88",
  stepLabel: "Step 01 of 02",
  formTitle: "Tell us about the property.",
  finePrint:
    "Your information stays private and is used only to prepare your valuation.",
};
