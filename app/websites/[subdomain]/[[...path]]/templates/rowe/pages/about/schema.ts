import { z } from "zod";

const ValueSchema = z.object({
  number: z.string(),
  title: z.string(),
  body: z.string(),
});

export const RoweAboutContentSchema = z.object({
  label: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  heroImage: z.string(),
  heroImageAlt: z.string(),
  storyLabel: z.string(),
  storyTitle: z.string(),
  storyBody1: z.string(),
  storyBody2: z.string(),
  values: z.array(ValueSchema).min(1),
  ctaLabel: z.string(),
  ctaHref: z.string(),
});

export type RoweAboutContent = z.infer<typeof RoweAboutContentSchema>;

export const roweAboutDefaultContent: RoweAboutContent = {
  label: "About / The practice",
  titleLine1: "Personal by design.",
  titleEmphasis: "Precise by habit.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/b0/b01e7c5c9e03b6858c21893e1342c1eabc0911081fd8132e737e036a77f50c51.avif",
  heroImageAlt: "Architectural interior",
  storyLabel: "The point of view",
  storyTitle:
    "There should be less distance between the person you hire and the person doing the work.",
  storyBody1:
    "This demo positions the agent as a focused independent advisor: one senior point of contact from the first conversation to the final signature. That model is especially effective for a personal brand where judgment, relationships, and trust are the product.",
  storyBody2:
    "The visual identity borrows the confidence of luxury editorial design — large typography, patient spacing, warm neutrals, and image-led storytelling — while giving real estate a stronger role than the reference site through dedicated listing and property-detail templates.",
  values: [
    {
      number: "01",
      title: "Evidence before urgency",
      body: "Decisions are framed with market context, comparables, and scenario thinking.",
    },
    {
      number: "02",
      title: "Presentation with purpose",
      body: "Creative direction is used to make the property clearer, not simply louder.",
    },
    {
      number: "03",
      title: "Selective workload",
      body: "Fewer simultaneous clients means faster access and deeper involvement.",
    },
  ],
  ctaLabel: "Start a conversation",
  ctaHref: "/contact",
};
