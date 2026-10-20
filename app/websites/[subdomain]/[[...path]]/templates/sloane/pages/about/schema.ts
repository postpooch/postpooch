import { z } from "zod";

const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const SloaneAboutContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  backgroundEyebrow: z.string(),
  backgroundTitle: z.string(),
  backgroundParagraphs: z.array(z.string()).min(1),
  backgroundCta: z.string(),
  stats: z.array(StatSchema).min(1),
  testimonialEyebrow: z.string(),
  testimonialSide: z.string(),
  testimonialCta: z.string(),
  povEyebrow: z.string(),
  povTitle: z.string(),
  povBody: z.string(),
  povCta: z.string(),
});

export type SloaneAboutContent = z.infer<typeof SloaneAboutContentSchema>;

export const sloaneAboutDefaultContent: SloaneAboutContent = {
  eyebrow: "About",
  title: "Experience with an editorial eye.",
  intro:
    "Sloane Reed combines market fluency, disciplined negotiation, and design literacy to help clients make better real estate decisions across Los Angeles.",
  backgroundEyebrow: "Background",
  backgroundTitle: "Real estate, seen from every angle.",
  backgroundParagraphs: [
    "Before building her residential practice, Sloane worked across design, editorial, and brand strategy—fields that sharpened her sense of presentation and taught her to ask better questions. That background now informs how she evaluates homes, prepares listings, and communicates value.",
    "Her business is built around long-term relationships with buyers, sellers, architects, builders, attorneys, and other agents. The result is a network that creates access, solves problems quickly, and keeps transactions moving when the path is not obvious.",
    "She represents primary residences, architectural properties, investment opportunities, and discreet off-market transactions throughout greater Los Angeles and coastal California.",
  ],
  backgroundCta: "Work with Sloane",
  stats: [
    { value: "18+", label: "Years advising clients" },
    { value: "$1.2B", label: "Career volume" },
    { value: "42", label: "Neighborhoods served" },
    { value: "Top 1%", label: "Regional production" },
  ],
  testimonialEyebrow: "Client perspective",
  testimonialSide:
    "Sloane’s practice is intentionally high-touch. Strategy is built around each client’s timing, risk tolerance, goals, and appetite for the public market.",
  testimonialCta: "More testimonials",
  povEyebrow: "Point of view",
  povTitle: "Preparation changes outcomes.",
  povBody:
    "A strong result is rarely improvised. For sellers, that means knowing what to edit, what to repair, what to leave alone, and how to create the right launch sequence. For buyers, it means understanding value before the offer—not after the inspection.",
  povCta: "Explore client resources",
};
