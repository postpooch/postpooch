import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AveryAboutContentSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroSub: z.string(),
  leadKicker: z.string(),
  leadTitle: z.string(),
  leadBody: z.array(z.string()).min(1),
  portrait: z.string(),
  interior: z.string(),
  styleKicker: z.string(),
  styleTitle: z.string(),
  styleBody: z.array(z.string()).min(1),
  stats: z.array(z.object({ value: z.string(), label: z.string() })).min(1),
});

export type AveryAboutContent = z.infer<typeof AveryAboutContentSchema>;

export const averyAboutDefaultContent: AveryAboutContent = {
  heroKicker: "About",
  heroTitle: "Avery Laurent",
  heroSub: "A clear-eyed advisor for complex New York decisions.",
  leadKicker: "Point of view",
  leadTitle: "Personal service should feel personal.",
  leadBody: [
    "Avery built a practice around a simple idea: clients deserve advice that is as thoughtful as the homes they are buying and selling. That means doing the homework, seeing around corners, and never confusing urgency with pressure.",
    "Her work spans architecturally significant downtown lofts, classic prewar apartments, family townhouses, and discreet off-market transactions across Manhattan and Brooklyn.",
    "Before real estate, Avery worked in brand strategy and residential development. That dual background sharpened an instinct for positioning, presentation, and the emotional mechanics behind major purchases.",
  ],
  portrait: images.agent2,
  interior: images.interior,
  styleKicker: "Working style",
  styleTitle: "Prepared, candid, and very hard to rattle.",
  styleBody: [
    "Some clients want the full data set. Others want the five facts that actually matter. Avery calibrates the process around the people in it, while keeping strategy precise and communication unusually clear.",
    "For sellers, the work begins before photography: pricing, preparation, design direction, narrative, launch timing, and a plan for every likely response. For buyers, it means helping a home make sense beyond the listing sheet—building quality, board culture, resale, renovation risk, block dynamics, and deal structure.",
  ],
  stats: [
    { value: "$640M+", label: "Career sales" },
    { value: "14 Years", label: "New York market experience" },
    { value: "Top 1%", label: "Production, citywide peer group" },
  ],
};
