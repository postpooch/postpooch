import { z } from "zod";

export const HarborSellContentSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroItalic: z.string(),
  heroText: z.string(),
  heroImage: z.string(),
  heroImageAlt: z.string(),
  heroCta: z.string(),
  processTitle: z.string(),
  processItalic: z.string(),
  presentationImage: z.string(),
  presentationImageAlt: z.string(),
  presentationKicker: z.string(),
  presentationTitleBefore: z.string(),
  presentationTitleItalic: z.string(),
  presentationBody: z.string(),
  presentationCta: z.string(),
  salesKicker: z.string(),
  salesTitleBefore: z.string(),
  salesTitleItalic: z.string(),
  salesCta: z.string(),
  softKicker: z.string(),
  softTitleBefore: z.string(),
  softTitleItalic: z.string(),
  softBody: z.string(),
  softCta: z.string(),
});

export type HarborSellContent = z.infer<typeof HarborSellContentSchema>;

export const harborSellDefaultContent: HarborSellContent = {
  heroKicker: "Selling in Toronto West",
  heroTitle: "A better sale starts before",
  heroItalic: "the sign goes up.",
  heroText:
    "Preparation, pricing, positioning, and negotiation are built into one clear plan for your home—not pulled from a generic checklist.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/86/86d3f36b9a5e5738657b24e80244042e1a846c769b8e578546a091346797ac7a.avif",
  heroImageAlt: "Contemporary luxury home",
  heroCta: "Book a seller consult",
  processTitle: "Every sale needs",
  processItalic: "a sequence.",
  presentationImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/75/75d7ae755a3e82dec5a6c27da650ac72e81701f2059728793975350781926741.avif",
  presentationImageAlt: "Styled living room",
  presentationKicker: "Presentation matters",
  presentationTitleBefore: "Make the first impression feel",
  presentationTitleItalic: "inevitable.",
  presentationBody:
    "Before buyers ever walk through the door, they’ve already formed an opinion. I coordinate the visual story—from edits and staging through photo, film, floor plans, launch creative, and digital distribution.",
  presentationCta: "See the marketing plan",
  salesKicker: "Recent sales",
  salesTitleBefore: "Strategy, then",
  salesTitleItalic: "execution.",
  salesCta: "View all properties ↗",
  softKicker: "Wondering where to begin?",
  softTitleBefore: "Start with a realistic view of",
  softTitleItalic: "your home’s market.",
  softBody:
    "I’ll look at recent sales, active competition, the condition of your property, and what buyers are responding to now.",
  softCta: "Request a home value review ↗",
};
