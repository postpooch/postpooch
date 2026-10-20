"use client";

import { useEffect, useState } from "react";

import type { CoastalSettings } from "../settings";

type SiteHeaderProps = {
  settings: CoastalSettings;
};

export function SiteHeader({ settings }: SiteHeaderProps) {
  const { agent, navItems } = settings;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="siteHeader">
        <div className="topStrip">
          <span>{agent.phone}</span>
          <span className="topStripDesktop">{agent.email}</span>
          <span className="topStripDesktop">{agent.license}</span>
        </div>
        <div className="navBar">
          <a href="/" className="brand" aria-label="Home">
            <span className="brandMonogram">{agent.monogram}</span>
            <span className="brandText">
              <b>
                {agent.firstName} {agent.lastName}
              </b>
              <small>Coastal Estates</small>
            </span>
          </a>
          <nav className="desktopNav" aria-label="Primary">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <button
            className="menuButton"
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <span className="menuIcon" aria-hidden>
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>
      <div className={`menuDrawer ${open ? "isOpen" : ""}`} aria-hidden={!open}>
        <button
          className="menuClose"
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          ×
        </button>
        <div className="menuDrawerInner">
          <p className="eyebrow">Navigate</p>
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <div className="menuMeta">
            <span>{agent.phone}</span>
            <span>{agent.email}</span>
          </div>
        </div>
      </div>
    </>
  );
}
