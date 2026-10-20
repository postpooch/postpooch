"use client";

import { useEffect, useState } from "react";

import type { RoweNavItem } from "../settings";

type SiteHeaderProps = {
  wordmark: string;
  wordmarkSub: string;
  contactCtaLabel: string;
  menuNote: string;
  marketNote: string;
  email: string;
  phone: string;
  navItems: RoweNavItem[];
};

export function SiteHeader({
  wordmark,
  wordmarkSub,
  contactCtaLabel,
  menuNote,
  marketNote,
  email,
  phone,
  navItems,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
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

  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="/" aria-label={`${wordmark} home`}>
          <span>{wordmark}</span>
          <small>{wordmarkSub}</small>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="contact-link" href="/contact">
            {contactCtaLabel}
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
        className={`menu-overlay ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="menu-top">
          <div className="brand inverted">
            <span>{wordmark}</span>
            <small>{wordmarkSub}</small>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="menu-close"
          >
            Close ×
          </button>
        </div>
        <div className="menu-grid">
          <div className="menu-note">{menuNote}</div>
          <nav className="menu-nav">
            {navItems.map((item, index) => (
              <a
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                <span>0{index + 1}</span>
                {item.label}
              </a>
            ))}
            <a href="/contact" onClick={() => setOpen(false)}>
              <span>0{navItems.length + 1}</span>
              Contact
            </a>
          </nav>
        </div>
        <div className="menu-bottom">
          <span>{marketNote}</span>
          <span>
            {email} · {phone}
          </span>
        </div>
      </div>
    </>
  );
}
