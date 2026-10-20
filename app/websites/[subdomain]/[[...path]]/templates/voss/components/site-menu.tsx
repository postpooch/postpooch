"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import type { VossNavItem } from "../settings";

import { Logo } from "./logo";

type SiteMenuProps = {
  transparent?: boolean;
  logoName: string;
  logoSub: string;
  agentName: string;
  market: string;
  email: string;
  phone: string;
  instagram: string;
  consultationLabel: string;
  menuAside: string;
  navItems: VossNavItem[];
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || /\/websites\/[^/]+\/?$/.test(pathname);
  }
  return pathname === href || pathname.endsWith(href);
}

export function SiteMenu({
  transparent = false,
  logoName,
  logoSub,
  agentName,
  market,
  email,
  phone,
  instagram,
  consultationLabel,
  menuAside,
  navItems,
}: SiteMenuProps) {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const telHref = `tel:${phone.replace(/\s+/g, "")}`;

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
      <header
        className={`site-header ${transparent ? "site-header--transparent" : ""}`}
      >
        <Logo
          light={transparent}
          logoName={logoName}
          logoSub={logoSub}
          agentName={agentName}
        />
        <div className="site-header__right">
          <a href="/contact" className="header-contact">
            {consultationLabel}
          </a>
          <button
            className="menu-button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            type="button"
          >
            <span /> <span />
          </button>
        </div>
      </header>
      <div
        className={`menu-overlay ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="menu-overlay__top">
          <Logo
            light
            logoName={logoName}
            logoSub={logoSub}
            agentName={agentName}
          />
          <button
            className="close-button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            type="button"
          >
            Close <span>×</span>
          </button>
        </div>
        <div className="menu-overlay__grid">
          <nav className="menu-nav" aria-label="Primary navigation">
            {navItems.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className={isActivePath(pathname, item.href) ? "active" : ""}
              >
                <span>0{i + 1}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="menu-aside">
            <p className="eyebrow">{market}</p>
            <p>{menuAside}</p>
            <div className="menu-aside__meta">
              <a href={`mailto:${email}`}>{email}</a>
              <a href={telHref}>{phone}</a>
              <a href="#">{instagram}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
