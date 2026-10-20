import { z } from "zod";

export const SloaneListingsContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
});

export type SloaneListingsContent = z.infer<typeof SloaneListingsContentSchema>;

export const sloanePropertiesDefaultContent: SloaneListingsContent = {
  eyebrow: "Properties",
  title: "Current, private, and recently represented.",
  intro:
    "Browse a curated collection of luxury residential properties. In production this grid is connected to your live inventory.",
};

export const sloaneExclusiveDefaultContent: SloaneListingsContent = {
  eyebrow: "Properties",
  title: "Exclusive listings.",
  intro: "Active and privately marketed homes represented by Sloane Reed.",
};

export const sloaneLeaseDefaultContent: SloaneListingsContent = {
  eyebrow: "Properties",
  title: "For lease.",
  intro: "Selected long-term and furnished luxury leasing opportunities.",
};

export const sloaneSoldDefaultContent: SloaneListingsContent = {
  eyebrow: "Track record",
  title: "Recently sold.",
  intro: "A snapshot of selected transactions and the range of properties represented by the team.",
};

export const sloaneSearchDefaultContent: SloaneListingsContent = {
  eyebrow: "Property search",
  title: "Find the right fit.",
  intro:
    "An interactive front-end search experience ready to be wired to an IDX or your own inventory API.",
};
