import { z } from "zod";

export const AureliaHomeSearchContentSchema = z.object({
  kicker: z.string(),
  title: z.string(),
  aside: z.string(),
  searchPlaceholder: z.string(),
});

export type AureliaHomeSearchContent = z.infer<typeof AureliaHomeSearchContentSchema>;

export const aureliaHomeSearchDefaultContent: AureliaHomeSearchContent = {
  kicker: "Property search",
  title: "Find a home",
  aside: "Search · Saved homes · Private opportunities",
  searchPlaceholder: "Address, city or neighborhood",
};
