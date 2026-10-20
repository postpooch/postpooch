import { z } from "zod";

import { images } from "../../catalog-defaults";
import { SimpleHeroContentSchema } from "../simple-schema";

export const ArdenPressContentSchema = SimpleHeroContentSchema.extend({
  body: z.string(),
});
export type ArdenPressContent = z.infer<typeof ArdenPressContentSchema>;
export const ardenPressDefaultContent: ArdenPressContent = {
  heroEyebrow: "In The Media",
  heroTitle: "Press",
  heroSubtitle: "Selected coverage of our work, our market, and the properties we represent.",
  heroImage: images.modern,
  body: "For press inquiries, interviews, or photography requests, please contact the brokerage.",
};

export const ArdenFilmsContentSchema = SimpleHeroContentSchema;
export type ArdenFilmsContent = import("../simple-schema").SimpleHeroContent;
export const ardenFilmsDefaultContent: ArdenFilmsContent = {
  heroEyebrow: "Property Films",
  heroTitle: "A closer look at the land, the architecture, and the feeling of place.",
  heroSubtitle: "Cinematic portraits of selected properties and landscapes.",
  heroImage: images.dusk,
};

export const ArdenTestimonialsContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
});
export type ArdenTestimonialsContent = z.infer<typeof ArdenTestimonialsContentSchema>;
export const ardenTestimonialsDefaultContent: ArdenTestimonialsContent = {
  eyebrow: "Client Stories",
  title: "What our clients say",
  intro: "Confidential relationships, measured by trust and results.",
};

export const ArdenContactContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  hours: z.string(),
});
export type ArdenContactContent = z.infer<typeof ArdenContactContentSchema>;
export const ardenContactDefaultContent: ArdenContactContent = {
  eyebrow: "Get in Touch",
  title: "Contact",
  intro: "We welcome conversations about buying, selling, leasing, and private representation.",
  hours: "By appointment",
};

export const ArdenCopilotContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  features: z.array(z.object({ title: z.string(), copy: z.string() })),
});
export type ArdenCopilotContent = z.infer<typeof ArdenCopilotContentSchema>;
export const ardenCopilotDefaultContent: ArdenCopilotContent = {
  eyebrow: "Client Access",
  title: "Your Private Property Search",
  intro:
    "A more private way to follow the market, review saved homes, and stay close to the search without living inside a public listing feed.",
  features: [
    {
      title: "Saved Homes",
      copy: "Keep a private shortlist of properties, notes, and next steps.",
    },
    {
      title: "Market Updates",
      copy: "Receive curated updates rather than an unfiltered stream of inventory.",
    },
    {
      title: "Private Messaging",
      copy: "Stay in conversation with your advisor as the search evolves.",
    },
    {
      title: "Tour Planning",
      copy: "Organize showings, timing, and follow-up in one place.",
    },
  ],
};

export const ArdenSearchContentSchema = z.object({
  title: z.string(),
  intro: z.string(),
});
export type ArdenSearchContent = z.infer<typeof ArdenSearchContentSchema>;
export const ardenSearchDefaultContent: ArdenSearchContent = {
  title: "Home Search",
  intro: "Browse current inventory by community, price, and property type.",
};
