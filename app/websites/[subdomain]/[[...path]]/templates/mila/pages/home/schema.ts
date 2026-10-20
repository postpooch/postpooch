import { z } from "zod";

export const MilaHomeContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitleLine1: z.string(),
  heroTitleEmphasis: z.string(),
  heroBody: z.string(),
  heroCtaLabel: z.string(),
  heroCtaHref: z.string(),
  heroSecondaryLabel: z.string(),
  heroSecondaryHref: z.string(),
  heroCollageTall: z.string(),
  heroCollageTop: z.string(),
  heroCollageBottom: z.string(),
  heroStampLabel: z.string(),
  heroStampSub: z.string(),
  servicesEyebrow: z.string(),
  servicesTitle: z.string(),
  servicesIntro: z.string(),
  featuredEyebrow: z.string(),
  featuredTitle: z.string(),
  featuredCtaLabel: z.string(),
  agentEyebrow: z.string(),
  agentTitle: z.string(),
  agentLead: z.string(),
  agentValues: z.array(z.string()).min(1),
  agentCtaLabel: z.string(),
  regionsEyebrow: z.string(),
  regionsTitle: z.string(),
  regionsIntro: z.string(),
  testimonialQuote: z.string(),
  testimonialName: z.string(),
  testimonialMeta: z.string(),
  journalEyebrow: z.string(),
  journalTitle: z.string(),
  journalCtaLabel: z.string(),
});

export type MilaHomeContent = z.infer<typeof MilaHomeContentSchema>;

export const milaHomeDefaultContent: MilaHomeContent = {
  heroEyebrow: "Broker for the Utrecht region",
  heroTitleLine1: "Room for your",
  heroTitleEmphasis: "next chapter.",
  heroBody:
    "Selling, buying, or simply knowing where you stand. Personally guided by one broker who knows the market — and your story.",
  heroCtaLabel: "Tell me your plans",
  heroCtaHref: "/contact",
  heroSecondaryLabel: "View homes",
  heroSecondaryHref: "/aanbod",
  heroCollageTall:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/e6/e6b493a3076e4573ee4aae95d12e1c56f021e4c80c1352c75e8e12c8a3301ce8.avif",
  heroCollageTop:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/17/170e73b83c79b90505d6214c6a52a5ef482b0faa72f2fd86e6111403163d3d85.avif",
  heroCollageBottom:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/04/0400072ba0ba04db93b8ec80002200e796ffc67f7a30d8f25cc97fd482a5c546.avif",
  heroStampLabel: "mila",
  heroStampSub: "personal\nbrokerage",
  servicesEyebrow: "Where are you now?",
  servicesTitle: "Three moments I stand beside you.",
  servicesIntro:
    "Clear guidance for major housing decisions. No unnecessary layers — just a strong plan and direct contact.",
  featuredEyebrow: "Featured listings",
  featuredTitle: "Homes with a story of their own.",
  featuredCtaLabel: "View all",
  agentEyebrow: "Pleased to meet you — Mila",
  agentTitle:
    "Small enough to stay personal. Experienced enough for the full journey.",
  agentLead:
    "Your home is not a case number. That is why you work directly with me: from first valuation and photography through to the final signature at the notary.",
  agentValues: [
    "Strategically sharp",
    "Calm in communication",
    "Strong local network",
    "Attention to presentation",
  ],
  agentCtaLabel: "Get to know Mila",
  regionsEyebrow: "My region",
  regionsTitle: "From city canals to woodland edge.",
  regionsIntro:
    "I work deliberately in a compact area. That way I know not only the numbers, but also the differences between neighborhoods, streets, and buyer groups.",
  testimonialQuote:
    "“Mila kept the whole process small and clear. We always knew where we stood, without ever feeling pressured.”",
  testimonialName: "Eva & Thomas",
  testimonialMeta: "sale + purchase · Utrecht",
  journalEyebrow: "Journal",
  journalTitle: "Knowing what is going on helps you decide better.",
  journalCtaLabel: "All articles",
};
