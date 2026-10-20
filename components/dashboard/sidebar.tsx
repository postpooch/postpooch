"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import {
  CloseIcon,
  MenuIcon,
  NavIcon,
  PanelCollapseIcon,
  PanelExpandIcon,
} from "./icons";
import { AccountMenu } from "./account-menu";
import { DASHBOARD_NAV } from "./nav-config";

const AVATAR_SRC =
  "/postpooch_web_mascot_assets/avatar/postpooch-avatar-cream-512.webp";

const STORAGE_KEY = "pp-sidebar-collapsed";

function subscribeCollapsed(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("pp-sidebar-collapsed", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("pp-sidebar-collapsed", onStoreChange);
  };
}

function getCollapsedSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function getCollapsedServerSnapshot() {
  return false;
}

function setCollapsedPreference(collapsed: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  } catch {
    // Ignore storage access errors.
  }
  window.dispatchEvent(new Event("pp-sidebar-collapsed"));
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function BrandLockup({
  collapsed,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  if (collapsed) {
    return (
      <Link
        href="/dashboard/overview"
        onClick={onNavigate}
        aria-label="postpooch overview"
        className="inline-flex w-full min-w-0 flex-col items-center gap-1 overflow-hidden rounded-control py-1 outline-offset-4 focus-visible:outline-2 focus-visible:outline-pp-teal"
      >
        <Image
          src={AVATAR_SRC}
          alt=""
          width={36}
          height={36}
          className="size-9 shrink-0 rounded-full"
          priority
        />
        <span className="w-full min-w-0 overflow-hidden px-0.5 text-center text-[10px] font-semibold leading-tight text-pp-ink break-words line-clamp-2">
          postpooch
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard/overview"
      onClick={onNavigate}
      aria-label="postpooch overview"
      className="inline-flex items-center gap-2.5 rounded-control outline-offset-4 focus-visible:outline-2 focus-visible:outline-pp-teal"
    >
      <Image
        src={AVATAR_SRC}
        alt=""
        width={36}
        height={36}
        className="size-9 shrink-0 rounded-full"
        priority
      />
      <span className="font-display text-[22px] font-bold lowercase leading-none tracking-tight text-pp-ink">
        postpooch
      </span>
    </Link>
  );
}

function NavList({
  pathname,
  collapsed,
  onNavigate,
}: {
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav
      aria-label="Dashboard"
      className={[
        "flex flex-1 flex-col",
        collapsed ? "items-center gap-1" : "gap-1",
      ].join(" ")}
    >
      {DASHBOARD_NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={[
              "group relative flex rounded-control font-medium transition-colors duration-200 ease-out",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
              collapsed
                ? "w-full flex-col items-center gap-1 px-1 py-1.5 text-center"
                : "items-center gap-3 px-3 py-2.5 text-sm",
              !collapsed &&
                (active
                  ? "bg-pp-teal/10 text-pp-ink"
                  : "text-pp-stone hover:bg-pp-white/80 hover:text-pp-ink"),
              collapsed && (active ? "text-pp-teal" : "text-pp-stone"),
            ].join(" ")}
          >
            {!collapsed ? (
              <span
                className={[
                  "absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full transition-colors duration-200 ease-out",
                  active ? "bg-pp-teal" : "bg-transparent",
                ].join(" ")}
                aria-hidden
              />
            ) : null}
            {collapsed ? (
              <>
                <span
                  className={[
                    "flex items-center justify-center rounded-control p-2 transition-colors duration-200 ease-out",
                    active
                      ? "bg-pp-teal/10 text-pp-teal ring-1 ring-pp-teal/25"
                      : "text-pp-stone group-hover:bg-pp-white/80 group-hover:text-pp-ink",
                  ].join(" ")}
                >
                  <NavIcon id={item.id} className="size-6 shrink-0" />
                </span>
                <span className="w-full min-w-0 overflow-hidden px-0.5 text-center text-[10px] leading-tight font-medium break-words line-clamp-2">
                  {item.label}
                </span>
              </>
            ) : (
              <>
                <NavIcon
                  id={item.id}
                  className={[
                    "size-[18px] shrink-0",
                    active
                      ? "text-pp-teal"
                      : "text-pp-stone group-hover:text-pp-ink",
                  ].join(" ")}
                />
                <span className="truncate">{item.label}</span>
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function CollapseToggle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={!collapsed}
      aria-controls="dashboard-sidebar"
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={[
        "inline-flex size-9 items-center justify-center rounded-control text-pp-stone transition-colors duration-200 ease-out",
        "hover:bg-pp-white hover:text-pp-ink",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
      ].join(" ")}
    >
      {collapsed ? (
        <PanelExpandIcon className="size-[18px]" />
      ) : (
        <PanelCollapseIcon className="size-[18px]" />
      )}
      <span className="sr-only">
        {collapsed ? "Expand sidebar" : "Collapse sidebar"}
      </span>
    </button>
  );
}

function DesktopSidebarChrome({
  pathname,
  collapsed,
  onToggle,
  userEmail,
}: {
  pathname: string;
  collapsed: boolean;
  onToggle: () => void;
  userEmail: string | null;
}) {
  return (
    <div
      className={[
        "flex h-full flex-col py-5 transition-[padding] duration-200 ease-out",
        collapsed ? "gap-4 px-1.5" : "gap-8 px-4",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center",
          collapsed ? "flex-col gap-2" : "justify-between gap-2",
        ].join(" ")}
      >
        {collapsed ? (
          <CollapseToggle collapsed={collapsed} onToggle={onToggle} />
        ) : (
          <>
            <BrandLockup collapsed={collapsed} />
            <CollapseToggle collapsed={collapsed} onToggle={onToggle} />
          </>
        )}
      </div>
      {collapsed ? <BrandLockup collapsed={collapsed} /> : null}
      <NavList pathname={pathname} collapsed={collapsed} />
      <AccountMenu collapsed={collapsed} userEmail={userEmail} />
    </div>
  );
}

function MobileSidebarChrome({
  pathname,
  onNavigate,
  userEmail,
}: {
  pathname: string;
  onNavigate?: () => void;
  userEmail: string | null;
}) {
  return (
    <div className="flex h-full flex-col gap-8 px-4 py-6">
      <BrandLockup onNavigate={onNavigate} />
      <NavList pathname={pathname} onNavigate={onNavigate} />
      <AccountMenu onNavigate={onNavigate} userEmail={userEmail} />
    </div>
  );
}

type SidebarProps = {
  userEmail?: string | null;
};

export function Sidebar({ userEmail = null }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    getCollapsedSnapshot,
    getCollapsedServerSnapshot,
  );
  const panelId = useId();

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop rail — retractable */}
      <aside
        id="dashboard-sidebar"
        className={[
          "sticky top-0 z-30 hidden h-dvh shrink-0 border-r border-pp-sand bg-pp-mist/70 transition-[width] duration-200 ease-out lg:block",
          collapsed ? "w-[88px] overflow-x-hidden" : "w-[256px]",
        ].join(" ")}
      >
        <DesktopSidebarChrome
          pathname={pathname}
          collapsed={collapsed}
          onToggle={() => setCollapsedPreference(!collapsed)}
          userEmail={userEmail}
        />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-pp-sand bg-pp-cream/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <BrandLockup />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          aria-controls={panelId}
          className="inline-flex size-10 items-center justify-center rounded-control text-pp-ink transition-colors duration-200 ease-out hover:bg-pp-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
        >
          <MenuIcon className="size-5" />
          <span className="sr-only">Open navigation</span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={[
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen
            ? "pointer-events-auto visible"
            : "pointer-events-none invisible",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          tabIndex={mobileOpen ? 0 : -1}
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
          className={[
            "absolute inset-0 bg-pp-ink/30 transition-opacity duration-200 ease-out",
            mobileOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
        <aside
          id={panelId}
          inert={mobileOpen ? undefined : true}
          className={[
            "absolute inset-y-0 left-0 flex w-[min(100%,288px)] flex-col border-r border-pp-sand bg-pp-mist shadow-card-lg transition-transform duration-200 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-end px-3 pt-3">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex size-10 items-center justify-center rounded-control text-pp-ink transition-colors duration-200 ease-out hover:bg-pp-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
            >
              <CloseIcon className="size-5" />
              <span className="sr-only">Close navigation</span>
            </button>
          </div>
          <MobileSidebarChrome
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
            userEmail={userEmail}
          />
        </aside>
      </div>
    </>
  );
}
