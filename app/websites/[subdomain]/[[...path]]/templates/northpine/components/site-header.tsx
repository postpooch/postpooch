"use client";

import { useState } from "react";

import type { NorthpineSettings } from "../settings";
import { NORTHPINE_LOGO_SRC } from "./logo";

type SiteHeaderProps = {
  settings: NorthpineSettings;
  dark?: boolean;
};

export function SiteHeader({ settings, dark = false }: SiteHeaderProps) {
  const { agent, navItems } = settings;
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={`topbar ${dark ? "topbar-dark" : ""}`}>
        <span>{agent.phone}</span>
        <span className="dot">•</span>
        <span>{agent.email}</span>
        <span className="topbar-spacer" />
        <span>{agent.location.toUpperCase()}</span>
      </div>
      <header className={`header ${dark ? "header-solid" : "header-overlay"}`}>
        <a href="/" className="brand" aria-label={`${agent.company} home`}>
          <img src={NORTHPINE_LOGO_SRC} alt={agent.company} />
          <span className="brand-copy">
            <b>{agent.name}</b>
            <small>{agent.title.toUpperCase()}</small>
          </span>
        </a>
        <button
          className="menu-button"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`nav ${open ? "nav-open" : ""}`}>
          {navItems.map((item) => (
            <div className="nav-item" key={`${item.label}-${item.href}`}>
              <a href={item.href}>{item.label}</a>
              {item.children && item.children.length > 0 ? (
                <div className="nav-dropdown">
                  {item.children.map((child) => (
                    <a key={child.href} href={child.href}>
                      {child.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </header>
    </>
  );
}
