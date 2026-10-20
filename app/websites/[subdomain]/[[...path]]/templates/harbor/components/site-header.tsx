"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import type { HarborSettings } from "../settings";

type SiteHeaderProps = {
  settings: HarborSettings;
};

export function SiteHeader({ settings }: SiteHeaderProps) {
  const { agent, navItems, menuExtras, menuSecondary } = settings;
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

  const menuPrimary = [...navItems, ...menuExtras];

  return (
    <>
      <header className="site-header">
        <a href="/" className="brand" aria-label={`${agent.name} home`}>
          <span className="brand-mark">{agent.monogram}</span>
          <span className="brand-name">{agent.name}</span>
          <span className="brand-sub">REAL ESTATE</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="text-link desktop-contact" href="/contact">
            Let’s talk <span>↗</span>
          </a>
          <button
            className="menu-button"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </header>

      <div
        className={`menu-panel ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="menu-top">
          <a
            href="/"
            className="brand brand-light"
            onClick={() => setOpen(false)}
          >
            <span className="brand-mark">{agent.monogram}</span>
            <span className="brand-name">{agent.name}</span>
            <span className="brand-sub">REAL ESTATE</span>
          </a>
          <button
            className="menu-close"
            type="button"
            onClick={() => setOpen(false)}
          >
            Close ×
          </button>
        </div>
        <div className="menu-grid">
          <div className="menu-primary">
            {menuPrimary.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                <span>0{i + 1}</span>
                {item.label}
                <b>↗</b>
              </a>
            ))}
          </div>
          <div className="menu-secondary">
            <p className="kicker muted">Start here</p>
            {menuSecondary.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="menu-contact">
              <a href={`tel:${agent.phoneHref}`}>{agent.phone}</a>
              <a href={`mailto:${agent.email}`}>{agent.email}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
