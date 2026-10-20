"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import type { ValeNavItem } from "../settings";

type SiteHeaderProps = {
  wordmarkLeft: string;
  wordmarkRight: string;
  agentName: string;
  market: string;
  email: string;
  navItems: ValeNavItem[];
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || /\/websites\/[^/]+\/?$/.test(pathname);
  }
  return pathname === href || pathname.endsWith(href);
}

export function SiteHeader({
  wordmarkLeft,
  wordmarkRight,
  agentName,
  market,
  email,
  navItems,
}: SiteHeaderProps) {
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
    <header className="site-header">
      <a href="/" className="wordmark" aria-label={`${agentName} home`}>
        <span>{wordmarkLeft}</span>
        <i />
        <span>{wordmarkRight}</span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a
            className={isActivePath(pathname, item.href) ? "active" : ""}
            href={item.href}
            key={item.href}
          >
            <span>•</span>
            {item.label}
          </a>
        ))}
      </nav>
      <button
        className="menu-button"
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Toggle menu"
      >
        <span>{open ? "Close" : "Menu"}</span>
      </button>
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <nav>
          {navItems.map((item, i) => (
            <a href={item.href} key={item.href}>
              <small>0{i + 1}</small>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mobile-menu-meta">
          <p>{market}</p>
          <p>{email}</p>
        </div>
      </div>
    </header>
  );
}
