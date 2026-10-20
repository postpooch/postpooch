"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import type { RowanSettings } from "../settings";

type SiteHeaderProps = {
  settings: RowanSettings;
  dark?: boolean;
};

export function SiteHeader({ settings, dark = false }: SiteHeaderProps) {
  const { agent, region, navItems } = settings;
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const phoneHref = `tel:${agent.phone.replace(/\s/g, "")}`;

  return (
    <header
      className={`site-header ${dark ? "site-header--dark" : ""} ${scrolled ? "is-scrolled" : ""}`}
    >
      <div className="site-header__bar">
        <a className="wordmark" href="/" aria-label={`${agent.name} home`}>
          <span>{agent.name}</span>
          <small>{agent.wordmarkSub}</small>
        </a>

        <div className="site-header__center">
          <a href={phoneHref}>{agent.phone}</a>
          <a href="/#contact">Contact</a>
        </div>

        <button
          type="button"
          className={`menu-button ${open ? "is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`menu-panel ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="menu-panel__inner">
          <p className="eyebrow">Navigate</p>
          <nav>
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                <span className="menu-panel__index">0{index + 1}</span>
                <span>{item.label}</span>
                <span className="menu-panel__arrow">↗</span>
              </a>
            ))}
          </nav>
          <div className="menu-panel__meta">
            <a href={`mailto:${agent.email}`}>{agent.email}</a>
            <span>{region}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
