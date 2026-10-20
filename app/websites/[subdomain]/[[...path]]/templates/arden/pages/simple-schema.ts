import { z } from "zod";

export const SimpleHeroContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string().optional(),
  bodyTitle: z.string().optional(),
  bodyCopy: z.array(z.string()).optional(),
});

export type SimpleHeroContent = z.infer<typeof SimpleHeroContentSchema>;
