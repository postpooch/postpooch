import type { ReactElement, SVGProps } from "react";
import type { DashboardNavId } from "./nav-config";

type IconProps = SVGProps<SVGSVGElement>;
type BrandIconProps = IconProps & { branded?: boolean };

const FACEBOOK_BLUE = "#1877F2";
const INSTAGRAM_GRADIENT_ID = "pp-instagram-brand-gradient";

function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function OverviewIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5V6M12 18v2.5M3.5 12H6M18 12h2.5" />
    </svg>
  );
}

export function SocialMediaIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function VideoCenterIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="6" width="13" height="12" rx="2" />
      <path d="m16.5 10 4-2.5v9L16.5 14" />
    </svg>
  );
}

export function InstagramIcon({ branded, ...props }: BrandIconProps) {
  const paint = branded ? `url(#${INSTAGRAM_GRADIENT_ID})` : undefined;

  return (
    <svg {...base({ ...props, ...(paint ? { stroke: paint } : {}) })}>
      {branded ? (
        <defs>
          <linearGradient
            id={INSTAGRAM_GRADIENT_ID}
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#FFDC80" />
            <stop offset="25%" stopColor="#F77737" />
            <stop offset="50%" stopColor="#E1306C" />
            <stop offset="75%" stopColor="#C13584" />
            <stop offset="100%" stopColor="#833AB4" />
          </linearGradient>
        </defs>
      ) : null}
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.4"
        cy="6.6"
        r="1.05"
        fill={paint ?? "currentColor"}
        stroke="none"
      />
    </svg>
  );
}

export function FacebookIcon({ branded, ...props }: BrandIconProps) {
  const paint = branded ? FACEBOOK_BLUE : undefined;

  return (
    <svg {...base({ ...props, ...(paint ? { stroke: paint } : {}) })}>
      <path
        fill={paint ?? "currentColor"}
        stroke="none"
        d="M10.4 21V9.85c0-2.12 1.28-3.4 3.52-3.4.58 0 1.22.05 1.78.16v2.22h-1.22c-.88 0-1.18.42-1.18 1.1v1.52h2.28l-.3 2.28h-1.98V21H10.4Z"
      />
      <rect x="3" y="3" width="18" height="18" rx="4" />
    </svg>
  );
}

export function WebsiteIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <path d="M3.5 9h17" />
      <circle cx="6.2" cy="7" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="8.4" cy="7" r="0.7" fill="currentColor" stroke="none" />
      <path d="M8 13h8M8 16h5" />
    </svg>
  );
}

export function GoogleBusinessIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5 5.5 9v10.5a1 1 0 0 0 1 1H10v-5h4v5h3.5a1 1 0 0 0 1-1V9L12 3.5Z" />
      <path d="M9.5 12.5h5" />
    </svg>
  );
}

export function NewsletterIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 8 7.5 5.5L19.5 8" />
    </svg>
  );
}

export function CrmIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.8 19c.5-3.4 2.3-5.2 5.2-5.2s4.7 1.8 5.2 5.2" />
      <path d="M15.5 7.5h4.2M15.5 11h4.2M16.5 14.5h3.2" />
    </svg>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m14.5 5.5 4 4L8 20H4v-4L14.5 5.5Z" />
      <path d="m12.5 7.5 4 4" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="5.5" width="16" height="15" rx="3" />
      <path d="M4 10h16" />
      <path d="M8.5 3.5v4M15.5 3.5v4" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 7h15M4.5 12h15M4.5 17h15" />
    </svg>
  );
}

export function PanelCollapseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M9.5 4.5v15" />
      <path d="m14.5 9.5-2.5 2.5 2.5 2.5" />
    </svg>
  );
}

export function PanelExpandIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M9.5 4.5v15" />
      <path d="m12 9.5 2.5 2.5L12 14.5" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronUpIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6.5 14.5 5.5-5.5 5.5 5.5" />
    </svg>
  );
}

export function LogOutIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 12h10" />
      <path d="m16.5 8.5 3.5 3.5-3.5 3.5" />
      <path d="M13 5.5H7.5A2.5 2.5 0 0 0 5 8v8a2.5 2.5 0 0 0 2.5 2.5H13" />
    </svg>
  );
}

export function HelpIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.8 9.4a2.3 2.3 0 0 1 4.4.8c0 1.5-2.2 2-2.2 3.3" />
      <path d="M12 16.8h.01" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </svg>
  );
}

const NAV_ICONS: Record<
  DashboardNavId,
  (props: IconProps) => ReactElement
> = {
  overview: OverviewIcon,
  crm: CrmIcon,
  "social-media": SocialMediaIcon,
  "video-center": VideoCenterIcon,
  website: WebsiteIcon,
  newsletter: NewsletterIcon,
  "google-business": GoogleBusinessIcon,
};

export function NavIcon({
  id,
  ...props
}: IconProps & { id: DashboardNavId }) {
  const Icon = NAV_ICONS[id];
  return <Icon {...props} />;
}
