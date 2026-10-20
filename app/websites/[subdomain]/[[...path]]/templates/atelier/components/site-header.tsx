"use client";

import { useEffect, useState } from "react";

import type { AtelierNavChild, AtelierNavItem } from "../settings";

type SiteHeaderProps = {
  wordmarkTop: string;
  wordmarkBottom: string;
  navItems: AtelierNavItem[];
  mobileNavItems: AtelierNavChild[];
  phone: string;
  email: string;
  market: string;
  propertiesEnabled: boolean;
};

function isPropertyHref(href: string): boolean {
  const pathname = href.split(/[?#]/, 1)[0] ?? href;
  return (
    pathname === "/search" ||
    pathname === "/sales" ||
    pathname === "/properties" ||
    pathname.startsWith("/properties/")
  );
}

export function SiteHeader({
  wordmarkTop,
  wordmarkBottom,
  navItems,
  mobileNavItems,
  phone,
  email,
  market,
  propertiesEnabled,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const extras = propertiesEnabled
    ? mobileNavItems
    : mobileNavItems.filter((item) => !isPropertyHref(item.href));

  const mobileLinks: AtelierNavChild[] = [
    { label: "Home", href: "/" },
    ...navItems.map((item) => ({ label: item.label, href: item.href })),
    ...navItems.flatMap((item) => item.children ?? []),
    ...extras,
  ].filter(
    (item, index, list) =>
      list.findIndex((entry) => entry.href === item.href) === index,
  );

  return (
    <>
      <header className="siteHeader">
        <a href="/" className="wordmark" aria-label="Home">
          <span>{wordmarkTop}</span>
          <span>{wordmarkBottom}</span>
        </a>
        <nav className="desktopNav">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href="/contact" className="navCta">
            Connect
          </a>
        </nav>
        <button
          className="menuButton"
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <i />
          <i />
        </button>
      </header>
      <div className={`menuOverlay ${open ? "isOpen" : ""}`} aria-hidden={!open}>
        <button
          className="menuClose"
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          ×
        </button>
        <div className="menuInner">
          <p className="kicker">Explore {wordmarkTop} {wordmarkBottom}</p>
          <nav className="mobileNav">
            {mobileLinks.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="menuMeta">
            <span>{phone}</span>
            <span>{email}</span>
            <span>{market}</span>
          </div>
        </div>
      </div>
    </>
  );
}
