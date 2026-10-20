"use client";

import { useEffect, useState } from "react";

import type { ElenaNavItem } from "../settings";

type NavigationProps = {
  wordmarkLeft: string;
  wordmarkRight: string;
  agentName: string;
  headerCenter: string;
  menuBrand: string;
  menuIntro: string;
  menuMeta: string;
  email: string;
  phone: string;
  navItems: ElenaNavItem[];
  inquiryInterests: string[];
  conversationLabel?: string;
  inquiryEyebrow?: string;
  inquiryTitle?: string;
  inquiryCta?: string;
  inquiryNote?: string;
  privateInquiryLabel?: string;
};

/**
 * Elena template chrome navigation: overlay menu + inquiry drawer.
 * Hash links scroll within the single-page home route.
 */
export function Navigation({
  wordmarkLeft,
  wordmarkRight,
  agentName,
  headerCenter,
  menuBrand,
  menuIntro,
  menuMeta,
  email,
  phone,
  navItems,
  inquiryInterests,
  conversationLabel = "Start a conversation",
  inquiryEyebrow = "Private inquiry",
  inquiryTitle = "Tell me what you’re considering.",
  inquiryCta = "Send inquiry",
  inquiryNote = "Demo form only. Connect this to your CRM, email provider, or server action before launch.",
  privateInquiryLabel = "Private inquiry ↗",
}: NavigationProps) {
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setContactOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open || contactOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, contactOpen]);

  const navigate = (href: string) => {
    setOpen(false);
    if (!href.startsWith("#")) {
      window.location.href = href;
      return;
    }
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 40);
  };

  const telHref = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={`${agentName} home`}>
          <span>{wordmarkLeft}</span>
          <span>{wordmarkRight}</span>
        </a>
        <div className="header-center">{headerCenter}</div>
        <div className="header-actions">
          <button
            className="text-button desktop-contact"
            type="button"
            onClick={() => setContactOpen(true)}
          >
            {conversationLabel}
          </button>
          <button
            className="menu-button"
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={`menu-overlay ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="menu-topline">
          <div className="menu-brand">{menuBrand}</div>
          <button
            className="round-close"
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <div className="menu-grid">
          <div className="menu-intro">
            <p>{menuIntro}</p>
            <span>{menuMeta}</span>
          </div>
          <nav className="overlay-nav" aria-label="Main navigation">
            {navItems.map((item, index) => (
              <button
                key={item.href}
                type="button"
                onClick={() => navigate(item.href)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="menu-footer">
          <a href={`mailto:${email}`}>{email}</a>
          <button
            className="text-button light"
            type="button"
            onClick={() => {
              setOpen(false);
              setContactOpen(true);
            }}
          >
            {privateInquiryLabel}
          </button>
        </div>
      </div>

      <div
        className={`contact-drawer ${contactOpen ? "is-open" : ""}`}
        aria-hidden={!contactOpen}
      >
        <button
          className="drawer-scrim"
          type="button"
          onClick={() => setContactOpen(false)}
          aria-label="Close contact panel"
        />
        <aside className="drawer-panel">
          <div className="drawer-head">
            <div>
              <span className="eyebrow">{inquiryEyebrow}</span>
              <h2>{inquiryTitle}</h2>
            </div>
            <button
              className="round-close dark"
              type="button"
              onClick={() => setContactOpen(false)}
              aria-label="Close contact panel"
            >
              ×
            </button>
          </div>
          <form
            className="inquiry-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="interest-row" role="group" aria-label="I'm interested in">
              {inquiryInterests.map((label) => (
                <label className="chip" key={label}>
                  <input type="checkbox" />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <label>
              <span>Name</span>
              <input type="text" placeholder="Your full name" />
            </label>
            <label>
              <span>Email</span>
              <input type="email" placeholder="you@example.com" />
            </label>
            <label>
              <span>Phone</span>
              <input type="tel" placeholder="(212) 555-0000" />
            </label>
            <label>
              <span>What would be useful to know?</span>
              <textarea
                rows={4}
                placeholder="Timing, neighborhoods, property type, price range..."
              />
            </label>
            <button className="primary-button" type="submit">
              {inquiryCta} <span>↗</span>
            </button>
            <p className="form-note">{inquiryNote}</p>
          </form>
          <div className="drawer-direct">
            <a href={`mailto:${email}`}>{email}</a>
            <a href={telHref}>{phone}</a>
          </div>
        </aside>
      </div>
    </>
  );
}
