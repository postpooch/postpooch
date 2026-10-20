export type DashboardNavId =
  | "overview"
  | "crm"
  | "social-media"
  | "video-center"
  | "website"
  | "newsletter"
  | "google-business";

export type DashboardNavItem = {
  id: DashboardNavId;
  href: string;
  label: string;
  /** Short reason shown on the Overview map */
  mapWhy: string;
  /** Shown on placeholder destination pages */
  description: string;
  /** Suggested next CTA label on placeholders */
  ctaLabel: string;
  ctaHref: string;
};

/** Full sidebar order (includes Overview). */
export const DASHBOARD_NAV: DashboardNavItem[] = [
  {
    id: "overview",
    href: "/dashboard/overview",
    label: "Overview",
    mapWhy: "See your presence path",
    description: "Your calm home base for what needs attention next.",
    ctaLabel: "View presence path",
    ctaHref: "/dashboard/overview",
  },
  {
    id: "crm",
    href: "/dashboard/crm",
    label: "CRM",
    mapWhy: "Nurture your relationships",
    description:
      "Manage contacts, properties, transactions, tasks, and trusted partners in one real estate workspace.",
    ctaLabel: "Open CRM",
    ctaHref: "/dashboard/crm",
  },
  {
    id: "social-media",
    href: "/dashboard/social-media",
    label: "Social media",
    mapWhy: "Connect your accounts",
    description:
      "Connect accounts, refine posts in the editor, and keep your week scheduled.",
    ctaLabel: "Open social workspace",
    ctaHref: "/dashboard/social-media",
  },
 
  {
    id: "website",
    href: "/dashboard/website",
    label: "Website",
    mapWhy: "Build your agent site",
    description:
      "Choose a template, publish your subdomain, and keep your site in sync with your brand and listings.",
    ctaLabel: "Back to overview",
    ctaHref: "/dashboard/overview",
  },
  {
    id: "newsletter",
    href: "/dashboard/newsletter",
    label: "Newsletter",
    mapWhy: "Email your sphere",
    description:
      "Choose a template, draft campaigns, and grow a list that opens your market updates.",
    ctaLabel: "Open newsletter",
    ctaHref: "/dashboard/newsletter",
  },

  {
    id: "video-center",
    href: "/dashboard/video_center",
    label: "Video Center",
    mapWhy: "Edit listing videos",
    description:
      "Create and edit property videos with the built-in OpenCut Classic timeline editor.",
    ctaLabel: "Open Video Center",
    ctaHref: "/dashboard/video_center",
  },

  
  {
    id: "google-business",
    href: "/dashboard/google_business",
    label: "Google Business",
    mapWhy: "Claim your local listing",
    description:
      "Connect Google Business Profile so search and Maps stay accurate and ready for posts.",
    ctaLabel: "Back to overview",
    ctaHref: "/dashboard/overview",
  },
];

/** Presence journey on Overview (Overview itself is not a map node). */
export const PRESENCE_MAP_ORDER: DashboardNavId[] = [
  "crm",
  "social-media",
  "video-center",
  "website",
  "google-business",
];

/** Suggested “next” step highlighted on the map. */
export const SUGGESTED_NEXT_ID: DashboardNavId = "crm";

export function getNavItem(id: DashboardNavId): DashboardNavItem {
  const item = DASHBOARD_NAV.find((entry) => entry.id === id);
  if (!item) {
    throw new Error(`Unknown dashboard nav id: ${id}`);
  }
  return item;
}

export function getPresenceMapItems(): DashboardNavItem[] {
  return PRESENCE_MAP_ORDER.map(getNavItem);
}
