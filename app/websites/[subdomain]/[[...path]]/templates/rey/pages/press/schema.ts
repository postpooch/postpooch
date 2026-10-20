import { z } from "zod";

export const ReyPressContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
});

export type ReyPressContent = z.infer<typeof ReyPressContentSchema>;

export const reyPressDefaultContent: ReyPressContent = {
  heroEyebrow: "Editorial & recognition",
  heroTitle: "In the press.",
};
