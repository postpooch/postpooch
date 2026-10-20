export type NewsletterNavId = "templates" | "campaigns" | "audience";

export type NewsletterNavItem = {
  id: NewsletterNavId;
  href: string;
  label: string;
  description: string;
  headline: string;
  detail: string;
  hint: string;
};

/** Mini-app sections inside /dashboard/newsletter */
export const NEWSLETTER_NAV: NewsletterNavItem[] = [
  {
    id: "templates",
    href: "/dashboard/newsletter",
    label: "Templates",
    description: "Choose a layout and start your next email.",
    headline: "Find the right starting point for your next email",
    detail:
      "Start with a layout you love, then customize every detail for your list.",
    hint: "Explore templates",
  },
  {
    id: "campaigns",
    href: "/dashboard/newsletter/campaigns",
    label: "Campaigns",
    description: "Drafts, scheduled sends, and past newsletters.",
    headline: "Keep every send in one calm place",
    detail:
      "Draft market updates, listing launches, and follow-ups — then send when ready.",
    hint: "Your campaigns",
  },
  {
    id: "audience",
    href: "/dashboard/newsletter/audience",
    label: "Audience",
    description: "Subscribers and list health at a glance.",
    headline: "Know who is waiting to hear from you",
    detail:
      "Grow a list of clients and prospects who want your market notes in their inbox.",
    hint: "Your list",
  },
];

export function getNewsletterNavItem(id: NewsletterNavId): NewsletterNavItem {
  const item = NEWSLETTER_NAV.find((entry) => entry.id === id);
  if (!item) {
    throw new Error(`Unknown newsletter nav id: ${id}`);
  }
  return item;
}

export function isNewsletterNavActive(
  pathname: string,
  item: NewsletterNavItem,
): boolean {
  if (item.id === "templates") {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
