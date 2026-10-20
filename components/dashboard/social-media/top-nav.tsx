"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  isSocialMediaNavActive,
  SOCIAL_MEDIA_NAV,
} from "./nav-config";

function isBareSocialMediaPage(pathname: string) {
  return (
    pathname === "/dashboard/social-media/studio" ||
    pathname.includes("/social-editor/canvas") ||
    pathname.includes("/connect/callback")
  );
}

function currentSocialMediaItem(pathname: string) {
  return (
    SOCIAL_MEDIA_NAV.find((item) => isSocialMediaNavActive(pathname, item)) ??
    SOCIAL_MEDIA_NAV[0]
  );
}

/**
 * Website-style discovery chrome: quiet hero, teal eyebrow, pill section switcher.
 */
export function SocialMediaPageHeader() {
  const pathname = usePathname();
  const current = currentSocialMediaItem(pathname);

  return (
    <header className="relative overflow-hidden rounded-[30px] border border-pp-sand/70 bg-gradient-to-br from-pp-white via-pp-white to-pp-mist/65 px-6 py-8 shadow-[0_20px_70px_rgba(36,25,20,0.08)] sm:px-9 sm:py-10">
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-pp-teal/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-pp-sand/45 blur-3xl" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pp-teal-dark/90">
          Social media
        </p>
        <h1 className="mt-3 max-w-3xl text-[31px] font-semibold leading-[1.05] tracking-[-0.03em] text-pp-ink sm:text-[45px]">
          {current.headline}
        </h1>
        <p className="mt-4 max-w-2xl text-[16px] leading-7 tracking-[-0.01em] text-pp-stone">
          {current.detail}
        </p>

        <div className="mt-7 rounded-[999px] border border-pp-sand/80 bg-pp-white/95 p-2 shadow-[0_8px_28px_rgba(36,25,20,0.09)] backdrop-blur-sm">
          <nav
            aria-label="Social media"
            className="flex flex-wrap items-center gap-2 sm:flex-nowrap"
          >
            {SOCIAL_MEDIA_NAV.map((item) => {
              const active = isSocialMediaNavActive(pathname, item);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  title={item.description}
                  className={[
                    "rounded-full px-4 py-3 text-[13px] tracking-[-0.01em] transition-[background-color,color,transform] duration-200 ease-out sm:px-5",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
                    "active:scale-[0.98]",
                    active
                      ? "border border-transparent bg-pp-teal font-semibold text-pp-white"
                      : "border border-pp-sand/90 font-medium text-pp-stone hover:text-pp-ink",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="hidden min-w-0 flex-1 rounded-full bg-pp-cream px-4 py-3 text-[14px] font-medium tracking-[-0.01em] text-pp-ink sm:block">
              {current.label === "Studio"
                ? "Your creative direction"
                : current.label === "Editor"
                ? "Explore templates"
                : current.label === "Schedule"
                  ? "Weekly times"
                  : "Your channels"}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function SocialMediaShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (isBareSocialMediaPage(pathname)) {
    return children;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <SocialMediaPageHeader />
      <div className="mt-10">{children}</div>
    </div>
  );
}
