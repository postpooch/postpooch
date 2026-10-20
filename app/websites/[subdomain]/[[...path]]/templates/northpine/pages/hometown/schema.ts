import { z } from "zod";

export const NorthpineHometownContentSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  lead: z.string(),
  bodyOne: z.string(),
  bodyTwo: z.string(),
  sectionTitle: z.string(),
  sectionBody: z.string(),
});

export type NorthpineHometownContent = z.infer<typeof NorthpineHometownContentSchema>;

export const northpineHometownDefaultContent: NorthpineHometownContent = {
  heroTitle: "About Our Hometown",
  heroSubtitle:
    "Blue Ridge is equal parts mountain town, outdoor playground and easy weekend escape.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/61/61e4795a98c262ec429a4e9fc02bbf6de30eeb0c6213297a202eea4d4e9284fb.avif",
  lead: "There is a reason people arrive for a weekend and start looking at property before they leave.",
  bodyOne:
    "Downtown Blue Ridge is compact and walkable, with restaurants, galleries, coffee shops and the scenic railway. A few minutes away, the landscape opens into Lake Blue Ridge, the Toccoa River and wooded roads that climb toward long-range views.",
  bodyTwo:
    "The area works for many kinds of ownership: full-time living, weekend cabins, lake homes, investment properties and future retirement homes. The key is matching the location to how you actually plan to use it.",
  sectionTitle: "What makes the area special",
  sectionBody:
    "Access to trails and water is a major draw, but the community itself matters just as much. Blue Ridge has enough year-round activity to feel connected without losing its small-town scale.",
};
