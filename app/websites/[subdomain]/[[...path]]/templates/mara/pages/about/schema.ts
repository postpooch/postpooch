import { z } from "zod";

export const MaraAboutContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleLine2: z.string(),
  titleLine3: z.string(),
  intro: z.string(),
  portraitImage: z.string(),
  fact1Value: z.string(),
  fact1Label: z.string(),
  fact2Value: z.string(),
  fact2Label: z.string(),
  fact3Value: z.string(),
  fact3Label: z.string(),
  whyEyebrow: z.string(),
  whyTitle: z.string(),
  whyParagraphs: z.array(z.string()).min(1),
  attentionImage: z.string(),
  attentionEyebrow: z.string(),
  attentionTitle: z.string(),
  attentionBody: z.string(),
  attentionCta: z.string(),
  helpEyebrow: z.string(),
  buyingTitle: z.string(),
  buyingBody: z.string(),
  buyingCta: z.string(),
  sellingTitle: z.string(),
  sellingBody: z.string(),
  sellingCta: z.string(),
  advisoryTitle: z.string(),
  advisoryBody: z.string(),
  advisoryCta: z.string(),
});

export type MaraAboutContent = z.infer<typeof MaraAboutContentSchema>;

export const maraAboutDefaultContent: MaraAboutContent = {
  eyebrow: "Meet Mara",
  titleLine1: "Clear advice.",
  titleLine2: "Good eyes.",
  titleLine3: "No theatre.",
  intro:
    "I’m a Toronto broker and private client advisor focused on architecturally interesting homes and highly personal representation.",
  portraitImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/6f/6fb3d6fe2445c3d4a1b6f7e0f112798c95083343f0c0edd0c56a768e72e5021e.avif",
  fact1Value: "12+",
  fact1Label: "Years advising clients",
  fact2Value: "1:1",
  fact2Label: "Direct agent representation",
  fact3Value: "24",
  fact3Label: "Neighbourhoods closely tracked",
  whyEyebrow: "Why this practice exists",
  whyTitle:
    "I believe good representation should sharpen your judgment, not replace it.",
  whyParagraphs: [
    "Real estate can become noisy very quickly. My work is to make it legible: what matters about a property, what the market is actually saying, where the risk sits, and which details are worth caring about.",
    "I’m drawn to homes with proportion, material integrity and a strong relationship to place. That does not always mean the newest or most expensive property. Often, the best opportunity is the one with a point of view and enough flexibility to become deeply yours.",
    "Clients work directly with me from the first conversation through closing. No hand-offs, no rotating team, no pressure to make a transaction happen before it makes sense.",
  ],
  attentionImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/5b/5b322cd2dc3ac44bcf6e09ea144e43ed4a6510ef01f0874bbaa1f9ec384a2091.avif",
  attentionEyebrow: "What I pay attention to",
  attentionTitle: "Design literacy can change a real estate decision.",
  attentionBody:
    "A room can be renovated. Proportion, orientation, context and planning constraints are harder to change. I help buyers and sellers see the difference—and understand how those factors influence both experience and value.",
  attentionCta: "Start a conversation",
  helpEyebrow: "How I can help",
  buyingTitle: "Buying",
  buyingBody:
    "Search strategy, private opportunities, property analysis and negotiation.",
  buyingCta: "Explore buying",
  sellingTitle: "Selling",
  sellingBody:
    "Positioning, preparation, creative direction, launch strategy and negotiation.",
  sellingCta: "Explore selling",
  advisoryTitle: "Advisory",
  advisoryBody:
    "Valuation, timing, renovation perspective and long-view portfolio conversations.",
  advisoryCta: "Request advice",
};
