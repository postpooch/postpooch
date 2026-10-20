import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AveryContactContentSchema = z.object({
  kicker: z.string(),
  title: z.string(),
  body: z.string(),
  portrait: z.string(),
});

export type AveryContactContent = z.infer<typeof AveryContactContentSchema>;

export const averyContactDefaultContent: AveryContactContent = {
  kicker: "Let’s connect",
  title: "What are you thinking about?",
  body: "Buying, selling, planning ahead, or just trying to understand the market more clearly—start here.",
  portrait: images.agent2,
};
