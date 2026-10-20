import { z } from "zod";

export const HarborHomeValueContentSchema = z.object({
  image: z.string(),
  imageAlt: z.string(),
  kicker: z.string(),
  titleBefore: z.string(),
  titleItalic: z.string(),
  body: z.string(),
  formLabel: z.string(),
  note: z.string(),
});

export type HarborHomeValueContent = z.infer<
  typeof HarborHomeValueContentSchema
>;

export const harborHomeValueDefaultContent: HarborHomeValueContent = {
  image:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/b0/b0dee176bf9f7198d9697ae3bf0649d1710b39529e62a5890d1c14eda98d9e3b.avif",
  imageAlt: "Beautiful detached home",
  kicker: "Home value review",
  titleBefore: "What could your home sell for",
  titleItalic: "right now?",
  body: "Online estimates miss the details that actually shape a sale: condition, micro-location, renovation quality, lot, layout, competing inventory, and current buyer behaviour. Send a few details and I’ll prepare a more thoughtful starting point.",
  formLabel: "Request my review",
  note: "No automated valuation. This demo form is front-end only until connected to your CRM or email service.",
};
