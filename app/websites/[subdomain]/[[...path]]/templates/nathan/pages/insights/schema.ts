import { z } from "zod";

export const NathanInsightsContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  deck: z.string(),
});

export type NathanInsightsContent = z.infer<typeof NathanInsightsContentSchema>;

export const nathanInsightsDefaultContent: NathanInsightsContent = {
  eyebrow: "FIELD NOTES",
  title: "Insights.",
  deck: "Short, practical notes on luxury property, positioning, negotiation, and the micro-markets that shape New York real estate.",
};
