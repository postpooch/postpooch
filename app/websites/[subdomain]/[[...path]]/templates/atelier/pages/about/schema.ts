import { z } from "zod";

export const AtelierAboutContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  splitEyebrow: z.string(),
  splitTitle: z.string(),
  paragraphs: z.array(z.string()),
  bleedImage: z.string(),
  bleedCaption: z.string(),
  quote: z.string(),
  featuredEyebrow: z.string(),
  featuredTitle: z.string(),
  featuredCta: z.string(),
});

export type AtelierAboutContent = z.infer<typeof AtelierAboutContentSchema>;

export const atelierAboutDefaultContent: AtelierAboutContent = {
  heroEyebrow: "About",
  heroTitle: "Representation with taste, rigor, and perspective.",
  heroSubtitle:
    "A boutique advisory built around one simple idea: exceptional service should feel personal, not performative.",
  heroImage:
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2200&q=90",
  splitEyebrow: "Elena Marlowe",
  splitTitle: "Calm counsel for high-stakes decisions.",
  paragraphs: [
    "Elena Marlowe has spent nearly two decades working at the intersection of real estate, design, and relationship-driven advisory. Her clients include founders, executives, creatives, families, and investors who value discretion, depth, and clear thinking.",
    "Her approach begins before a property hits the market or a buyer writes an offer. She studies the architecture, context, price history, competing inventory, and likely audience, then builds a strategy around what makes that specific opportunity matter.",
    "Atelier North intentionally remains boutique. Every client works directly with a senior advisor, supported by a small team across research, operations, marketing, and transaction management.",
  ],
  bleedImage:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=90",
  bleedCaption: "Architecture. Context. Timing. Story.",
  quote:
    "I want clients to feel that every choice has a reason behind it—and that no important detail is being left to chance.",
  featuredEyebrow: "Selected opportunities",
  featuredTitle: "Current collection",
  featuredCta: "View all properties",
};
