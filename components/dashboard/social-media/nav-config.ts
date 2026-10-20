export type SocialMediaNavId = "studio" | "accounts" | "editor" | "schedule";

export type SocialMediaNavItem = {
  id: SocialMediaNavId;
  href: string;
  label: string;
  description: string;
  headline: string;
  detail: string;
};

/** Mini-app sections inside /dashboard/social-media */
export const SOCIAL_MEDIA_NAV: SocialMediaNavItem[] = [
  {
    id: "studio",
    href: "/dashboard/social-media/studio",
    label: "Studio",
    description: "Guide the creative team that plans your weekly content.",
    headline: "A creative team that gets to know you",
    detail:
      "Share what feels right, what does not, and what is changing in your business. Your future posts will follow your lead.",
  },
  {
    id: "accounts",
    href: "/dashboard/social-media",
    label: "Accounts",
    description: "Connect and manage the channels you publish to.",
    headline: "Connect the channels you publish to",
    detail:
      "Link Instagram and Facebook so approved posts have somewhere to go.",
  },
  {
    id: "editor",
    href: "/dashboard/social-media/social-editor",
    label: "Editor",
    description: "Choose a template and open it in the canvas editor.",
    headline: "Find the right starting point for your next post",
    detail:
      "Start with a layout you love, then customize every detail in the editor.",
  },
  {
    id: "schedule",
    href: "/dashboard/social-media/social-schedule",
    label: "Schedule",
    description: "See when posts go out and keep your week filled.",
    headline: "Set a calm weekly posting rhythm",
    detail:
      "Choose up to four times. The same post can go to Instagram and Facebook together.",
  },
];

export function getSocialMediaNavItem(
  id: SocialMediaNavId,
): SocialMediaNavItem {
  const item = SOCIAL_MEDIA_NAV.find((entry) => entry.id === id);
  if (!item) {
    throw new Error(`Unknown social media nav id: ${id}`);
  }
  return item;
}

export function isSocialMediaNavActive(
  pathname: string,
  item: SocialMediaNavItem,
): boolean {
  if (item.id === "accounts") {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
