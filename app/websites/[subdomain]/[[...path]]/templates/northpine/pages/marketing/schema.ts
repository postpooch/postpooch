import { z } from "zod";

export const NorthpineMarketingContentSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  kicker: z.string(),
  title: z.string(),
  lead: z.string(),
  body: z.string(),
});

export type NorthpineMarketingContent = z.infer<typeof NorthpineMarketingContentSchema>;

export const northpineMarketingDefaultContent: NorthpineMarketingContent = {
  heroTitle: "Our Marketing",
  heroSubtitle: "A property should enter the market looking intentional.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/3d/3d3b1c895df50d8dfc8f97e8098e00293b7d5711d6cd0857d7cae6cadeeeaf05.avif",
  kicker: "PRESENTATION IS STRATEGY",
  title: "We market the feeling of the property, not just the facts.",
  lead: "Great marketing creates context before a buyer ever steps through the door.",
  body: "We build each launch around the setting, architecture, strongest emotional moments and most likely buyer. The result is cohesive—from photography and copy to digital distribution and showing experience.",
};
