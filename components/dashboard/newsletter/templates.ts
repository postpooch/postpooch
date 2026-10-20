export type NewsletterTemplateCategory =
  | "all"
  | "market"
  | "listing"
  | "sold"
  | "nurture"
  | "seasonal";

export const NEWSLETTER_CATEGORIES: {
  id: NewsletterTemplateCategory;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "market", label: "Market" },
  { id: "listing", label: "Listings" },
  { id: "sold", label: "Just sold" },
  { id: "nurture", label: "Nurture" },
  { id: "seasonal", label: "Seasonal" },
];
