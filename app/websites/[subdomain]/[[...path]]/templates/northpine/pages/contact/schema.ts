import { z } from "zod";

export const NorthpineContactContentSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  kicker: z.string(),
  role: z.string(),
  formTitle: z.string(),
  mapLabel: z.string(),
});

export type NorthpineContactContent = z.infer<typeof NorthpineContactContentSchema>;

export const northpineContactDefaultContent: NorthpineContactContent = {
  heroTitle: "Contact Us",
  heroSubtitle: "Tell us what you're considering. We'll help you figure out the next useful step.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/eb/ebb292405b3c64bb747542a8f58083e39c131b83e29e54b41d4799920bdaaefc.avif",
  kicker: "NORTHPINE REALTY",
  role: "Mountain & lake real estate advisor",
  formTitle: "Send a message",
  mapLabel: "NORTHPINE\nBLUE RIDGE",
};
