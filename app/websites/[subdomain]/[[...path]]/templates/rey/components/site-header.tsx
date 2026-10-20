"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import type { ReySettings } from "../settings";

type SiteHeaderProps = {
  settings: ReySettings;
  overlay?: boolean;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || /\/websites\/[^/]+\/?$/.test(pathname);
  }
  return pathname === href || pathname.endsWith(href);
}

export function SiteHeader({ settings, overlay = false }: SiteHeaderProps) {
  const pathname = usePathname() ?? "/";
  const { agent, navItems } = settings;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const transparent = overlay && !scrolled;
  const telHref = `tel:${agent.phone.replace(/\D/g, "")}`;

  return (
    <>
      <header
        className={`site-header ${transparent ? "site-header--overlay" : ""}`}
      >
        <a className="brand" href="/" aria-label={`${agent.fullName} home`}>
          <span className="brand-script">{agent.firstName}</span>
          <span className="brand-name">{agent.lastName.toUpperCase()}</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              className={isActivePath(pathname, item.href) ? "active" : ""}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-phone" href={telHref}>
            {agent.phone}
          </a>
          <button
            className="menu-button"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`menu-panel ${open ? "open" : ""}`} aria-hidden={!open}>
        <button
          className="menu-close"
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          ×
        </button>
        <div className="menu-panel__inner">
          <div className="menu-eyebrow">Navigate</div>
          <nav className="menu-nav">
            <a href="/" onClick={() => setOpen(false)}>
              Home
            </a>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="menu-meta">
            <a href={telHref}>{agent.phone}</a>
            <a href={`mailto:${agent.email}`}>{agent.email}</a>
          </div>
        </div>
      </div>
    </>
  );
}
