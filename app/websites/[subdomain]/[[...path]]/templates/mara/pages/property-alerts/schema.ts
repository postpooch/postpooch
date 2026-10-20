import { z } from "zod";

export const MaraPropertyAlertsContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroCopy: z.string(),
  heroImage: z.string(),
  introEyebrow: z.string(),
  introTitle: z.string(),
  introBody: z.string(),
  formEyebrow: z.string(),
});

export type MaraPropertyAlertsContent = z.infer<
  typeof MaraPropertyAlertsContentSchema
>;

export const maraPropertyAlertsDefaultContent: MaraPropertyAlertsContent = {
  heroEyebrow: "Private property search",
  heroTitle: "See the right homes—not every home.",
  heroCopy:
    "Share what matters and receive a more selective stream of opportunities, including relevant public listings and suitable private inventory.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/52/52aba5f4710514944ee55a83fba3ebd63ef9bfbaacdf630044cdbd1105a478d0.avif",
  introEyebrow: "Your search brief",
  introTitle:
    "A useful alert should understand more than beds, baths and price.",
  introBody:
    "Tell me the neighbourhoods, architecture, lifestyle and tradeoffs that matter to you. I’ll use that context to make the search narrower, more useful and more human than a generic portal notification.",
  formEyebrow: "Create your brief",
};
