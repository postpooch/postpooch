import { z } from "zod";

export const ElenaHomeContentSchema = z.object({
  heroKicker: z.string(),
  heroTitleLine1: z.string(),
  heroTitleEmphasis: z.string(),
  heroTitleLine3: z.string(),
  heroSubtext: z.string(),
  heroImage: z.string(),
  heroImageLabel: z.string(),
  heroCaption: z.string(),
  statsNote: z.string(),
  aboutLabel: z.string(),
  aboutPortrait: z.string(),
  aboutPortraitLabel: z.string(),
  aboutEyebrow: z.string(),
  aboutTitle: z.string(),
  aboutBodyLeft: z.string(),
  aboutBodyRight: z.string(),
  aboutCtaLabel: z.string(),
  aboutCtaHref: z.string(),
  manifestoEyebrow: z.string(),
  manifestoQuote: z.string(),
  manifestoSignature: z.string(),
  manifestoImage: z.string(),
  expertiseLabel: z.string(),
  expertiseTitle: z.string(),
  expertiseSubtext: z.string(),
  residencesLabel: z.string(),
  residencesEyebrow: z.string(),
  residencesTitle: z.string(),
  residencesCtaLabel: z.string(),
  residencesCtaHref: z.string(),
  residencesDisclaimer: z.string(),
  listingStatus: z.string(),
  processLabel: z.string(),
  processEyebrow: z.string(),
  processTitle: z.string(),
  journalLabel: z.string(),
  journalTitle: z.string(),
  journalSubtext: z.string(),
  contactEyebrow: z.string(),
  contactTitle: z.string(),
  contactBody: z.string(),
  contactImage: z.string(),
  footerCopyright: z.string(),
  footerLegal: z.string(),
});

export type ElenaHomeContent = z.infer<typeof ElenaHomeContentSchema>;

export const elenaHomeDefaultContent: ElenaHomeContent = {
  heroKicker: "Independent advice for consequential real estate decisions",
  heroTitleLine1: "A considered way",
  heroTitleEmphasis: "move through",
  heroTitleLine3: "New York.",
  heroSubtext:
    "Elena Hart represents buyers and sellers across Manhattan and Brooklyn with a calm, highly personal approach to strategy, access, and negotiation.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/a8/a87949a1c6adf6342ffc16d885a576dc06b38aaa2195be957fffa5e17156bdad.avif",
  heroImageLabel: "Warm modern luxury residence",
  heroCaption: "Selected residence · Downtown Manhattan",
  statsNote: "Measured experience. Personal attention.",
  aboutLabel: "01 / About",
  aboutPortrait:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/ae/ae48082498eebb4d98ebe016900e442f09f8358198fef54b5080a190f5701ace.avif",
  aboutPortraitLabel: "Portrait of Elena Hart",
  aboutEyebrow: "A relationship-first practice",
  aboutTitle: "Clear thinking, close listening, and no unnecessary theater.",
  aboutBodyLeft:
    "Real estate can be emotional, technical, and fast-moving all at once. Elena’s role is to reduce the noise: understand the real objective, surface the right options, and make each decision feel grounded.",
  aboutBodyRight:
    "Her practice is intentionally personal. Clients work directly with Elena from initial strategy through closing, supported by a trusted network of attorneys, lenders, designers, contractors, and local specialists.",
  aboutCtaLabel: "Meet Elena",
  aboutCtaHref: "#contact",
  manifestoEyebrow: "New York, at human scale",
  manifestoQuote:
    "“The best outcome is not simply a transaction. It’s the feeling that you made the right move, for the right reasons.”",
  manifestoSignature: "— Elena",
  manifestoImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/b4/b460677727cc3d57ba010e132e1b4ca94143ea5a423008bb1b9db854797f712c.avif",
  expertiseLabel: "02 / Expertise",
  expertiseTitle: "Advice that adapts to the move.",
  expertiseSubtext:
    "Every engagement starts with context, not a preset process. The work changes depending on what you’re trying to protect, unlock, or understand.",
  residencesLabel: "03 / Residences",
  residencesEyebrow: "A current edit",
  residencesTitle: "Homes with a point of view.",
  residencesCtaLabel: "Request the private list",
  residencesCtaHref: "#contact",
  residencesDisclaimer:
    "Illustrative sample listings and photography for demonstration only.",
  listingStatus: "For sale",
  processLabel: "04 / Approach",
  processEyebrow: "From first conversation to final signature",
  processTitle: "Quietly thorough.",
  journalLabel: "05 / Journal",
  journalTitle: "Notes from the market.",
  journalSubtext:
    "Short reads on pricing, place, and making better real estate decisions in New York.",
  contactEyebrow: "Begin with a conversation",
  contactTitle: "Thinking about a move?",
  contactBody:
    "Whether your timeline is two weeks or two years, a useful first conversation should leave you with more clarity than you started with.",
  contactImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/4f/4fb5faf4c291ba886ae120de66d4ac2d32843280b483e7ed278daa14ede57ec9.avif",
  footerCopyright: "© 2026 Elena Hart. Sample concept.",
  footerLegal: "Equal Housing Opportunity · Fair Housing Notice",
};
