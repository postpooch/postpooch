"use client";

import { useEffect, useState } from "react";

import type { LuxuryNavItem } from "../settings";

type SiteHeaderProps = {
  siteName: string;
  logoTextTop: string;
  logoTextBottom: string;
  navItems: LuxuryNavItem[];
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
};

export function SiteHeader({
  siteName,
  logoTextTop,
  logoTextBottom,
  navItems,
  phone,
  email,
  addressLine1,
  addressLine2,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
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
        <a className="brand-lockup" href="/" aria-label={siteName}>
          <span>{logoTextTop}</span>
          <small>{logoTextBottom}</small>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <div className="nav-group" key={item.href}>
              <a href={item.href}>{item.label}</a>
              {item.children && (
                <div className="nav-dropdown">
                  {item.children.map((child) => (
                    <a key={child.href} href={child.href}>
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-contact" href="/contact">
            Let&apos;s Connect
          </a>
          <button
            className="menu-button"
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`menu-overlay ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="menu-top">
          <div className="brand-lockup brand-lockup-light">
            <span>{logoTextTop}</span>
            <small>{logoTextBottom}</small>
          </div>
          <button
            className="close-button"
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            Close
          </button>
        </div>
        <div className="menu-content">
          <nav className="menu-primary">
            <a href="/" onClick={() => setOpen(false)}>
              Home
            </a>
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <a href="/contact" onClick={() => setOpen(false)}>
              Let&apos;s Connect
            </a>
          </nav>
          <div className="menu-secondary">
            {navItems.flatMap((item) => item.children || []).map((child) => (
              <a key={child.href} href={child.href} onClick={() => setOpen(false)}>
                {child.label}
              </a>
            ))}
          </div>
          <div className="menu-contact">
            <span>{phone}</span>
            <span>{email}</span>
            <span>{addressLine1}</span>
            <span>{addressLine2}</span>
          </div>
        </div>
      </div>
    </>
  );
}
