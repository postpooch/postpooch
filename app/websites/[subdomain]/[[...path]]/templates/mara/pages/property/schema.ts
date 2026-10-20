import { z } from "zod";

export const MaraPropertyContentSchema = z.object({
  residenceEyebrow: z.string(),
  residenceBody: z.string(),
  showingEyebrow: z.string(),
  showingTitle: z.string(),
  showingBody: z.string(),
  showingImage: z.string(),
  showingCta: z.string(),
  formTitlePrefix: z.string(),
});

export type MaraPropertyContent = z.infer<typeof MaraPropertyContentSchema>;

export const maraPropertyDefaultContent: MaraPropertyContent = {
  residenceEyebrow: "The residence",
  residenceBody:
    "This demo property page is structured like a high-end listing presentation: strong opening imagery, an editorial property story, essential details, a visual gallery and a direct route to the agent. Replace the placeholder facts and imagery with MLS-compliant content before launch.",
  showingEyebrow: "Private showing",
  showingTitle: "See the property in context.",
  showingBody:
    "A good showing is more than a walk-through. I’ll help you understand the home, the street, comparable value and the practical questions that should shape your decision.",
  showingImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/94/9411009fd86d6a0c2020728eb325d724772e425fbeee059937b5115abd45f0d8.avif",
  showingCta: "Arrange a conversation",
  formTitlePrefix: "Ask about",
};
