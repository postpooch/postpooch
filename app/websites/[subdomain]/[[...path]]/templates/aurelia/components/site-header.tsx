"use client";

import { useEffect, useState } from "react";

import type { AureliaNavItem, AureliaSettings } from "../settings";

type SiteHeaderProps = {
  settings: AureliaSettings;
  headerOnLight?: boolean;
};

export function SiteHeader({ settings, headerOnLight = false }: SiteHeaderProps) {
  const { agent, navItems } = settings;
  const [open, setOpen] = useState(false);
  const primary = navItems.filter((item) => !item.children?.length);
  const groups = navItems.filter((item) => (item.children?.length ?? 0) > 0);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`site-header ${headerOnLight ? "header-on-light" : ""}`}>
        <button
          className="menu-button"
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
        </button>
        <a href="/" className="brand-lockup" aria-label={`${agent.brand} home`}>
          <span className="brand-name">{agent.brand}</span>
          <span className="brand-tag">{agent.brandTag}</span>
        </a>
        <a href="/contact" className="header-connect">
          {agent.connectLabel}
        </a>
      </header>
      <div className={`menu-panel ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="menu-top">
          <span className="menu-wordmark">{agent.brand}</span>
          <button
            className="menu-close"
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <div className="menu-inner">
          <nav className="menu-primary" aria-label="Primary">
            {primary.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="menu-groups">
            {groups.map((group) => (
              <div className="menu-group" key={group.label}>
                <p>{group.label}</p>
                {group.children?.map((child: AureliaNavItem) => (
                  <a key={child.href} href={child.href} onClick={() => setOpen(false)}>
                    {child.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="menu-bottom">
          <span>{agent.phone}</span>
          <span>{agent.email}</span>
          <span>{agent.instagram}</span>
        </div>
      </div>
    </>
  );
}
