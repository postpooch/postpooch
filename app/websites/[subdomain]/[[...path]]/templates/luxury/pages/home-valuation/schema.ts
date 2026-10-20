import { z } from "zod";

export const LuxuryValuationContentSchema = z.object({
  backgroundImage: z.string(),
});

export type LuxuryValuationContent = z.infer<
  typeof LuxuryValuationContentSchema
>;

export const luxuryValuationDefaultContent: LuxuryValuationContent = {
  backgroundImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/53/53369841e12d8e80736c610ec214be3df97ff255abbc61747aa64daea4ce9e31.avif",
};
