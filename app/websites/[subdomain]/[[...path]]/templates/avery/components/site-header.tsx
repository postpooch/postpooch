"use client";

import { useEffect, useState } from "react";

import type { AverySettings } from "../settings";

type SiteHeaderProps = {
  settings: AverySettings;
};

export function SiteHeader({ settings }: SiteHeaderProps) {
  const { agent, navItems, desktopNavHrefs } = settings;
  const [open, setOpen] = useState(false);
  const desktop = navItems.filter((item) => desktopNavHrefs.includes(item.href));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <a href="/" className="brand" aria-label={`${agent.name} home`}>
          <span>{agent.brandFirst}</span>
          <span>{agent.brandLast}</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary">
          {desktop.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="menu-button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <span>Menu</span>
          <i />
          <i />
        </button>
      </header>
      <div className={`menu-overlay ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="menu-top">
          <div className="brand inverse">
            <span>{agent.brandFirst}</span>
            <span>{agent.brandLast}</span>
          </div>
          <button
            type="button"
            className="close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            Close ×
          </button>
        </div>
        <div className="menu-grid">
          <div className="menu-links">
            {navItems.map((item, index) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                {item.label}
              </a>
            ))}
          </div>
          <div className="menu-contact">
            <p className="eyebrow">Get in touch</p>
            <a href={`mailto:${agent.email}`}>{agent.email}</a>
            <a href={`tel:${agent.phone.replace(/\D/g, "")}`}>{agent.phone}</a>
            <p>{agent.address}</p>
          </div>
        </div>
      </div>
    </>
  );
}
