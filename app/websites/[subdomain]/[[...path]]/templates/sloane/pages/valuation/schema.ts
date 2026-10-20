import { z } from "zod";

export const SloaneValuationContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  requestTitle: z.string(),
  requestBody: z.string(),
  formTitle: z.string(),
});

export type SloaneValuationContent = z.infer<typeof SloaneValuationContentSchema>;

export const sloaneValuationDefaultContent: SloaneValuationContent = {
  eyebrow: "Property valuation",
  title: "What is your property worth in this market?",
  intro:
    "Automated estimates are useful for orientation. A serious opinion of value requires property-specific context, recent private and public sales, current competition, and a point of view about presentation.",
  requestTitle: "Request a private valuation.",
  requestBody:
    "Provide as much or as little detail as you have. This demo form is ready to be connected to your CRM, email automation, or lead routing system.",
  formTitle: "Property details",
};
