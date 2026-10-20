import { z } from "zod";

export const ArdenAgentContentSchema = z.object({
  portfolioEyebrow: z.string(),
  portfolioTitle: z.string(),
});

export type ArdenAgentContent = z.infer<typeof ArdenAgentContentSchema>;

export const ardenAgentDefaultContent: ArdenAgentContent = {
  portfolioEyebrow: "Portfolio",
  portfolioTitle: "Selected Properties",
};
