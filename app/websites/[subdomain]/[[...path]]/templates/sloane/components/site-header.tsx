"use client";

import { useState } from "react";

import type { SloaneSettings } from "../settings";

type SiteHeaderProps = {
  settings: SloaneSettings;
};

function digits(value: string) {
  return value.replace(/\D/g, "");
}

export function SiteHeader({ settings }: SiteHeaderProps) {
  const { agent, navItems } = settings;
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="utility-bar">
        <a href={`tel:${digits(agent.phone)}`}>{agent.phone}</a>
        <a href={`mailto:${agent.email}`}>{agent.email}</a>
      </div>
      <div className="nav-shell">
        <a className="brand" href="/" aria-label={`${agent.name} home`}>
          <span className="brand-mark">{agent.monogram}</span>
          <span className="brand-copy">
            <strong>{agent.name}</strong>
            <em>{agent.title}</em>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) =>
            item.children?.length ? (
              <div className="nav-group" key={item.label}>
                <button type="button" className="nav-link">
                  {item.label}
                </button>
                <div className="nav-dropdown">
                  {item.children.map((child) => (
                    <a href={child.href} key={child.href}>
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a className="nav-link" href={item.href} key={item.href}>
                {item.label}
              </a>
            ),
          )}
        </nav>
        <button
          type="button"
          className={`menu-toggle ${open ? "is-open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </div>
      <div className={`mobile-menu ${open ? "is-open" : ""}`}>
        <div className="mobile-menu-inner">
          {navItems.map((item) => (
            <div className="mobile-group" key={item.label}>
              <p>{item.label}</p>
              {item.children?.length ? (
                item.children.map((child) => (
                  <a href={child.href} key={child.href} onClick={() => setOpen(false)}>
                    {child.label}
                  </a>
                ))
              ) : (
                <a href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              )}
            </div>
          ))}
          <div className="mobile-contact">
            <a href={`tel:${digits(agent.phone)}`}>{agent.phone}</a>
            <a href={`mailto:${agent.email}`}>{agent.email}</a>
          </div>
        </div>
      </div>
    </header>
  );
}
