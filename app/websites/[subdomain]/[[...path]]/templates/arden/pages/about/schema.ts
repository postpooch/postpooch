import { images } from "../../catalog-defaults";
import { SimpleHeroContentSchema } from "../simple-schema";

export const ArdenAboutContentSchema = SimpleHeroContentSchema;
export type ArdenAboutContent = import("../simple-schema").SimpleHeroContent;

export const ardenAboutDefaultContent: ArdenAboutContent = {
  heroEyebrow: "Our Story",
  heroTitle: "Who We Are",
  heroSubtitle: "A boutique real estate team for exceptional Wine Country property.",
  heroImage: images.landscape,
  bodyTitle: "Built for the upper end of the market.",
  bodyCopy: [
    "Arden Vale + Co. was created around a simple idea: the finest properties deserve an unusually considered level of representation.",
    "We combine local history, modern marketing, direct broker relationships, and a global referral network to position each home with precision.",
  ],
};
