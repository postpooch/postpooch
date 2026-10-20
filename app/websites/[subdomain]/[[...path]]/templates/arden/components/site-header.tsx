"use client";

import { useState } from "react";

import type { ArdenNavItem } from "../settings";

import { ContactForm } from "./forms";
import { IconClose, IconMenu, IconSearch } from "./icons";

type SiteHeaderProps = {
  brandName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  navItems: ArdenNavItem[];
  searchHref: string;
  propertiesEnabled: boolean;
};

export function SiteHeader({
  brandName,
  tagline,
  phone,
  email,
  address,
  navItems,
  searchHref,
  propertiesEnabled,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState(false);

  return (
    <>
      <header className="header">
        <button
          className="menuButton"
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <IconMenu />
          <span>Menu</span>
        </button>
        <a href="/" className="brandMark">
          <span>{brandName}</span>
          <small>{tagline}</small>
        </a>
        <div className="headerActions">
          {propertiesEnabled ? (
            <a href={searchHref} className="searchLink">
              <IconSearch />
              <span>Search</span>
            </a>
          ) : null}
          <button className="connectButton" type="button" onClick={() => setContact(true)}>
            Let&apos;s Connect
          </button>
        </div>
      </header>
      {open ? (
        <div className="drawerOverlay">
          <aside className="drawer">
            <button className="drawerClose" type="button" onClick={() => setOpen(false)}>
              <IconClose />
              <span>Close</span>
            </button>
            <a href="/" className="drawerHome" onClick={() => setOpen(false)}>
              Home
            </a>
            <div className="drawerGrid">
              {navItems.map((group) => (
                <div key={group.label} className="drawerGroup">
                  <h4>{group.label}</h4>
                  {(group.children ?? [{ label: group.label, href: group.href }]).map((item) => (
                    <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                      {item.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>
            <div className="drawerContact">
              <p>{phone}</p>
              <p>{email}</p>
              <p>{address}</p>
            </div>
          </aside>
          <button
            aria-label="Close menu"
            className="overlayClose"
            type="button"
            onClick={() => setOpen(false)}
          />
        </div>
      ) : null}
      {contact ? (
        <div className="modalBackdrop">
          <div className="contactModal">
            <button className="modalClose" type="button" onClick={() => setContact(false)}>
              <IconClose />
            </button>
            <p className="eyebrow">Private consultation</p>
            <h2>Let&apos;s talk about what&apos;s next.</h2>
            <p>Tell us a little about your plans and our team will be in touch.</p>
            <ContactForm compact />
          </div>
        </div>
      ) : null}
    </>
  );
}
