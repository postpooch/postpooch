"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import type { NathanNavItem } from "../settings";

type SiteHeaderProps = {
  firstName: string;
  lastName: string;
  agentName: string;
  market: string;
  email: string;
  phone: string;
  contactCtaLabel: string;
  menuIndex: string;
  navItems: NathanNavItem[];
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || /\/websites\/[^/]+\/?$/.test(pathname);
  }
  return pathname === href || pathname.endsWith(href);
}

export function SiteHeader({
  firstName,
  lastName,
  agentName,
  market,
  email,
  phone,
  contactCtaLabel,
  menuIndex,
  navItems,
}: SiteHeaderProps) {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const desktopNav = navItems.slice(0, 4);
  const telHref = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <>
      <header className="site-header">
        <a href="/" className="wordmark" aria-label={`${agentName} home`}>
          <span>{firstName}</span>
          <span>
            {lastName}
            <b>.</b>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {desktopNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={isActivePath(pathname, item.href) ? "active" : ""}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-contact" href="/contact">
            {contactCtaLabel}
          </a>
          <button
            className="menu-button"
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <span>{open ? "Close" : "Menu"}</span>
            <i />
            <i />
          </button>
        </div>
      </header>

      <div
        className={`menu-overlay ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="menu-grid">
          <div className="menu-index">{menuIndex}</div>
          <nav className="menu-links" aria-label="Expanded navigation">
            {navItems.map((item, index) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <em>0{index + 1}</em>
                {item.label}
              </a>
            ))}
            <a href="/contact" onClick={() => setOpen(false)}>
              <em>0{navItems.length + 1}</em>
              Contact
            </a>
          </nav>
          <div className="menu-meta">
            <p>{market}</p>
            <a href={`mailto:${email}`}>{email}</a>
            <a href={telHref}>{phone}</a>
          </div>
        </div>
      </div>
    </>
  );
}
