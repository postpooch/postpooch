import { z } from "zod";

export const AveryListingsContentSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroSub: z.string(),
  heroImage: z.string().optional(),
  filter: z.enum(["active", "sale", "sold"]),
  noteKicker: z.string().optional(),
  noteTitle: z.string().optional(),
  note: z.string().optional(),
  filters: z.array(z.string()).optional(),
});

export type AveryListingsContent = z.infer<typeof AveryListingsContentSchema>;

export const averyPropertiesDefaultContent: AveryListingsContent = {
  heroKicker: "Portfolio",
  heroTitle: "Current listings",
  heroSub: "A selective portfolio of homes across Manhattan and Brooklyn.",
  filter: "active",
};

export const averySaleDefaultContent: AveryListingsContent = {
  ...averyPropertiesDefaultContent,
  heroTitle: "Homes for sale",
  filter: "sale",
  filters: undefined,
};

export const averySoldDefaultContent: AveryListingsContent = {
  heroKicker: "Selected history",
  heroTitle: "Notable sales",
  heroSub: "A record built one carefully positioned property at a time.",
  heroImage: "",
  filter: "sold",
  noteKicker: "Past transactions",
  noteTitle: "Representative results",
};
