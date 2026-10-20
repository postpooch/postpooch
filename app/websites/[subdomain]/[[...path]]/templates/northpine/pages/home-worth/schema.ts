import { z } from "zod";

export const NorthpineLeadContentSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  kicker: z.string(),
  title: z.string(),
  lead: z.string(),
  body: z.string(),
  formTitle: z.string(),
});

export type NorthpineLeadContent = z.infer<typeof NorthpineLeadContentSchema>;

export const northpineHomeWorthDefaultContent: NorthpineLeadContent = {
  heroTitle: "What's My Home Worth?",
  heroSubtitle:
    "Get a thoughtful, local-market perspective on your property—not an automated guess.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/3d/3d3b1c895df50d8dfc8f97e8098e00293b7d5711d6cd0857d7cae6cadeeeaf05.avif",
  kicker: "PERSONALIZED GUIDANCE",
  title: "A better valuation starts with context.",
  lead:
    "We'll use your details to prepare a useful, human follow-up rather than dropping you into a generic drip campaign.",
  body: "Condition, improvements, setting, access, view, rental profile and direct competition can all shift a mountain property's value.",
  formTitle: "Tell us a little about what you need",
};

export const northpineDreamHomeDefaultContent: NorthpineLeadContent = {
  heroTitle: "Find My Dream Home",
  heroSubtitle:
    "Tell us what the ideal mountain property looks like and we'll shape a focused search.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/d8/d8c5af0d1f0348f27c2a73d5e496acb2d687fcf6d79c5441573d67078135f5a0.avif",
  kicker: "PERSONALIZED GUIDANCE",
  title: "Search around the life you want here.",
  lead:
    "We'll use your details to prepare a useful, human follow-up rather than dropping you into a generic drip campaign.",
  body: "We'll translate your wish list into the communities, roads and property types most likely to fit.",
  formTitle: "Tell us a little about what you need",
};

export const northpineRelocateDefaultContent: NorthpineLeadContent = {
  heroTitle: "Plan Your Relocation",
  heroSubtitle: "A local move plan for buyers coming to North Georgia from somewhere else.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/eb/ebb292405b3c64bb747542a8f58083e39c131b83e29e54b41d4799920bdaaefc.avif",
  kicker: "PERSONALIZED GUIDANCE",
  title: "Make the move feel less unfamiliar.",
  lead:
    "We'll use your details to prepare a useful, human follow-up rather than dropping you into a generic drip campaign.",
  body: "We can help with area orientation, home search strategy, local vendors and the practical details that come with a long-distance move.",
  formTitle: "Tell us a little about what you need",
};
