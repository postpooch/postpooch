import { z } from "zod";

const PrincipleSchema = z.object({
  number: z.string(),
  title: z.string(),
  text: z.string(),
});

const CredentialSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const NathanAboutContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  bigLede: z.string(),
  heroAside: z.string(),
  portraitImage: z.string(),
  portraitLabel: z.string(),
  storyIndex: z.string(),
  storyTitleLine1: z.string(),
  storyTitleLine2: z.string(),
  storyColumns: z.array(z.string()).min(1),
  principlesEyebrow: z.string(),
  principles: z.array(PrincipleSchema).min(1),
  pairImageLeftIndex: z.number().int().nonnegative(),
  pairImageRightIndex: z.number().int().nonnegative(),
  credentialsEyebrow: z.string(),
  credentials: z.array(CredentialSchema).min(1),
  includeEmailCredential: z.boolean(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
});

export type NathanAboutContent = z.infer<typeof NathanAboutContentSchema>;

export const nathanAboutDefaultContent: NathanAboutContent = {
  eyebrow: "ABOUT NATHAN VALE",
  titleLine1: "High-touch representation.",
  titleEmphasis: "Low-ego process.",
  bigLede:
    "For seventeen years, Nathan has advised New York buyers and sellers at the intersection of real estate, design, and private client service.",
  heroAside:
    "His practice is intentionally focused: a small client roster, direct senior-level attention, and a strategy built around each property's real competitive set rather than a generic launch formula.",
  portraitImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/04/04737f1ee948fa5635c9a9b3be06e16abae23352840a08de4eb6842f26ad5247.avif",
  portraitLabel: "NEW YORK / 2009—NOW",
  storyIndex: "02",
  storyTitleLine1: "A quieter version",
  storyTitleLine2: "of full service.",
  storyColumns: [
    "Nathan began his career in the aftermath of the financial crisis, learning the business in a market where buyers scrutinized every assumption and sellers had little patience for theater. That environment shaped a durable approach: know the numbers, know the building, and make the complicated parts feel simple.",
    "Today, he represents primary residences, design-driven apartments, townhouses, and select East End estates. His network includes attorneys, architects, designers, lenders, family offices, and private wealth advisors — coordinated only when they add genuine value.",
  ],
  principlesEyebrow: "WORKING PRINCIPLES",
  principles: [
    {
      number: "01",
      title: "Tell the truth early.",
      text: "Clear pricing, clear tradeoffs, clear expectations. Good advice should make decisions easier, not prettier.",
    },
    {
      number: "02",
      title: "Make fewer things better.",
      text: "Every image, showing, conversation, and follow-up should have a reason to exist.",
    },
    {
      number: "03",
      title: "Protect optionality.",
      text: "Private outreach, public launch, timing, and negotiation are tools — not defaults.",
    },
  ],
  pairImageLeftIndex: 0,
  pairImageRightIndex: 1,
  credentialsEyebrow: "AT A GLANCE",
  credentials: [
    { value: "$640M+", label: "Career closed volume" },
    { value: "17 yrs", label: "New York market experience" },
    { value: "NYC + East End", label: "Primary markets" },
  ],
  includeEmailCredential: true,
  ctaLabel: "Work with Nathan",
  ctaHref: "/contact",
};
