"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import type { MaraNavItem } from "../settings";

import { MenuIcon } from "./icons";

type SiteHeaderProps = {
  monogram: string;
  wordmarkLine1: string;
  wordmarkLine2: string;
  agentName: string;
  phone: string;
  email: string;
  menuIndex: string;
  consultationLabel: string;
  navItems: MaraNavItem[];
};

export function SiteHeader({
  monogram,
  wordmarkLine1,
  wordmarkLine2,
  agentName,
  phone,
  email,
  menuIndex,
  consultationLabel,
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

  const telHref = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <>
      <header className="siteHeader">
        <a href="/" className="brand" aria-label={`${agentName} home`}>
          <span>{monogram}</span>
          <div>
            {wordmarkLine1}
            <small>{wordmarkLine2}</small>
          </div>
        </a>
        <div className="headerRight">
          <a className="headerContact" href="/contact">
            {consultationLabel}
          </a>
          <button
            className="menuButton"
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </header>
      <div
        className={`menuOverlay ${open ? "isOpen" : ""}`}
        aria-hidden={!open}
      >
        <div className="menuBackdrop" />
        <div className="menuInner">
          <div className="menuIndex">{menuIndex}</div>
          <nav>
            {navItems.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                <span>0{i + 1}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="menuMeta">
            <a href={telHref}>{phone}</a>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        </div>
      </div>
    </>
  );
}
