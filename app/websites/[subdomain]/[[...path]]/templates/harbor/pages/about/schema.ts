import { z } from "zod";

export const HarborAboutContentSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroItalic: z.string(),
  heroText: z.string(),
  heroImage: z.string(),
  heroImageAlt: z.string(),
  heroCta: z.string(),
  styleKicker: z.string(),
  styleTitleBefore: z.string(),
  styleTitleItalic: z.string(),
  styleBody1: z.string(),
  styleBody2: z.string(),
  styleCta: z.string(),
  stats: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
  whyImage: z.string(),
  whyImageAlt: z.string(),
  whyKicker: z.string(),
  whyTitleBefore: z.string(),
  whyTitleItalic: z.string(),
  whyBody1: z.string(),
  whyBody2: z.string(),
  whyCta: z.string(),
});

export type HarborAboutContent = z.infer<typeof HarborAboutContentSchema>;

export const harborAboutDefaultContent: HarborAboutContent = {
  heroKicker: "About Avery",
  heroTitle: "Experienced enough to know what matters.",
  heroItalic: "Independent enough to care.",
  heroText:
    "I’m a full-time Toronto real estate broker focused on thoughtful advice, polished presentation, and direct one-to-one service.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/e3/e301f7f20dcb44a7b3e8f14333e5983fe8898605144dfacbea678dcd6373914b.avif",
  heroImageAlt: "Placeholder portrait of a professional woman",
  heroCta: "Work with me",
  styleKicker: "The working style",
  styleTitleBefore: "No handoffs. No mystery.",
  styleTitleItalic: "No pressure.",
  styleBody1:
    "I believe the best agent-client relationship feels collaborative. I’ll tell you what I see, explain why I think it matters, and give you room to make the call. You’ll work with me directly throughout the process—not a rotating team or junior agent.",
  styleBody2:
    "After two decades around Toronto homes and transactions, I’ve learned that the details rarely stay small. Pricing language, showing feedback, inspection findings, possession dates, presentation choices, and negotiation tone all shape the result.",
  styleCta: "Read client notes",
  stats: [
    { value: "20+", label: "Years in residential real estate" },
    { value: "1:1", label: "Direct agent representation" },
    { value: "West", label: "Toronto market specialization" },
    { value: "100%", label: "Custom marketing plans" },
  ],
  whyImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/7a/7ab75b7fa46346a12af38e2a86dc693cda4dc5e55d67d7e7ad831b9923f9666b.avif",
  whyImageAlt: "Beautiful neutral interior",
  whyKicker: "Why this work",
  whyTitleBefore: "Homes are emotional. Decisions should still be",
  whyTitleItalic: "well informed.",
  whyBody1:
    "I like the combination of strategy and people. One day is numbers, positioning, and negotiation. The next is helping someone decide whether a particular street, house, or timing really fits the life they want.",
  whyBody2:
    "That mix is why I still love the work—and why I keep my practice intentionally personal.",
  whyCta: "Start a conversation",
};
