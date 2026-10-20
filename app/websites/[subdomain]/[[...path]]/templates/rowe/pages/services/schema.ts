import { z } from "zod";

export const RoweServicesContentSchema = z.object({
  label: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  deck: z.string(),
  cardExploreLabel: z.string(),
  ctaLabel: z.string(),
  ctaTitle: z.string(),
  ctaButtonLabel: z.string(),
  ctaHref: z.string(),
});

export type RoweServicesContent = z.infer<typeof RoweServicesContentSchema>;

export const roweServicesDefaultContent: RoweServicesContent = {
  label: "Services / Private representation",
  titleLine1: "Clear advice for",
  titleEmphasis: "consequential moves.",
  deck: "From a one-off acquisition to a multi-year property plan, the work stays personal, selective, and grounded in the market.",
  cardExploreLabel: "Explore ↗",
  ctaLabel: "Not sure where to start?",
  ctaTitle: "The first conversation is about the decision, not the service menu.",
  ctaButtonLabel: "Talk through the brief",
  ctaHref: "/contact",
};
