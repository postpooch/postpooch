import { z } from "zod";

import { images } from "../../catalog-defaults";

export const CoastalTeamContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
  headingEyebrow: z.string(),
  headingTitle: z.string(),
  headingText: z.string(),
  connectLabel: z.string(),
});

export type CoastalTeamContent = z.infer<typeof CoastalTeamContentSchema>;

export const coastalTeamDefaultContent: CoastalTeamContent = {
  heroEyebrow: "About",
  heroTitle: "Meet the Team",
  heroImage: images.team,
  headingEyebrow: "A Focused Practice",
  headingTitle: "Small by design. Highly involved by choice.",
  headingText:
    "Every client works with a senior member of the team, supported by specialists in marketing, operations, and transaction management.",
  connectLabel: "Connect →",
};
