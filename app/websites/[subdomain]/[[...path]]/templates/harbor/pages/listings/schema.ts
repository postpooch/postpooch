import { z } from "zod";

export const HarborListingsContentSchema = z.object({
  heroKicker: z.string(),
  heroTitleLine1: z.string(),
  heroTitleItalic: z.string(),
  heroBody: z.string(),
});

export type HarborListingsContent = z.infer<typeof HarborListingsContentSchema>;

export const harborListingsDefaultContent: HarborListingsContent = {
  heroKicker: "Properties",
  heroTitleLine1: "Selected homes,",
  heroTitleItalic: "past and present.",
  heroBody:
    "Current listings, upcoming opportunities, and a sample of recently sold properties across Toronto West.",
};
