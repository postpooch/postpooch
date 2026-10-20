import { z } from "zod";

export const NathanPropertiesContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  deck: z.string(),
});

export type NathanPropertiesContent = z.infer<
  typeof NathanPropertiesContentSchema
>;

export const nathanPropertiesDefaultContent: NathanPropertiesContent = {
  eyebrow: "CURRENT COLLECTION",
  title: "Properties.",
  deck: "A selective portfolio of public and private opportunities across Manhattan, Brooklyn, and the Hamptons.",
};
