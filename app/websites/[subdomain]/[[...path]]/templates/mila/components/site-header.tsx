"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import type { MilaNavItem, MilaSettings } from "../settings";

import { ArrowUpRight, CloseIcon, MenuIcon } from "./icons";

type SiteHeaderProps = {
  agent: MilaSettings["agent"];
  navItems: MilaNavItem[];
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || /\/websites\/[^/]+\/?$/.test(pathname);
  }
  return (
    pathname === href ||
    pathname.endsWith(href) ||
    pathname.includes(href + "/")
  );
}

export function SiteHeader({ agent, navItems }: SiteHeaderProps) {
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

  return (
    <>
      <header className="site-header">
        <a href="/" className="brand" aria-label={`${agent.brandName} ${agent.brandTag} home`}>
          <span className="brand-mark">{agent.brandMark}</span>
          <span className="brand-type">
            <strong>{agent.brandName}</strong>
            <small>{agent.brandTag}</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={isActivePath(pathname, item.href) ? "active" : ""}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a href={`tel:${agent.phoneHref}`} className="header-phone">
            {agent.phoneDisplay}
          </a>
          <a href="/contact" className="button button-small">
            Book a call <ArrowUpRight size={16} />
          </a>
          <button
            className="menu-button"
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>
      <div className={`mobile-panel ${open ? "open" : ""}`} aria-hidden={!open}>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item, i) => (
            <a key={item.href} href={item.href}>
              <span>0{i + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mobile-contact">
          <small>Direct contact</small>
          <a href={`tel:${agent.phoneHref}`}>{agent.phoneDisplay}</a>
          <a href={`mailto:${agent.email}`}>{agent.email}</a>
        </div>
      </div>
    </>
  );
}
