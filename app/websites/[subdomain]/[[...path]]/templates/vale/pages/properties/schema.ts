import { z } from "zod";

export const ValePropertiesContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  introCopy: z.string(),
});

export type ValePropertiesContent = z.infer<typeof ValePropertiesContentSchema>;

export const valePropertiesDefaultContent: ValePropertiesContent = {
  eyebrow: "Properties",
  titleLine1: "Places worth",
  titleEmphasis: "coming home to.",
  introCopy:
    "A selection of current offerings and recently represented homes. The portfolio is intentionally varied; the common thread is a sense of place.",
};
