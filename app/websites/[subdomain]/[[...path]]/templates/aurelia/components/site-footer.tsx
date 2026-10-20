import type { WebsiteSite } from "../../types";
import type { AureliaSettings } from "../settings";

import { NewsletterForm } from "./newsletter-form";

type SiteFooterProps = {
  site: WebsiteSite;
  settings: AureliaSettings;
};

export function SiteFooter({ site, settings }: SiteFooterProps) {
  const { agent } = settings;
  const telHref = `tel:${agent.phone.replace(/\D/g, "")}`;

  return (
    <footer className="footer">
      <section className="footer-cta section-pad">
        <div>
          <p className="kicker light">Private representation</p>
          <h2>Let&apos;s talk about what&apos;s next.</h2>
        </div>
        <a className="circle-link light-ring" href="/contact">
          <span>Connect</span>
          <span>↗</span>
        </a>
      </section>
      <section className="footer-main section-pad">
        <div className="footer-brand">
          <div className="footer-monogram">{agent.monogram}</div>
          <h3>{agent.brand}</h3>
          <p>{agent.license}</p>
        </div>
        <div className="footer-contact">
          <p className="footer-label">Contact</p>
          <a href={telHref}>{agent.phone}</a>
          <a href={`mailto:${agent.email}`}>{agent.email}</a>
          <p>{agent.address}</p>
        </div>
        <div className="footer-nav">
          <p className="footer-label">Explore</p>
          {site.propertiesEnabled ? <a href="/properties">Properties</a> : null}
          <a href="/communities">Communities</a>
          <a href="/about">About</a>
          <a href="/journal">Journal</a>
          <a href="/press">Press</a>
        </div>
        <div className="footer-newsletter">
          <p className="footer-label">Private List</p>
          <p>Receive new listings, market notes and selected opportunities.</p>
          <NewsletterForm />
        </div>
      </section>
      <div className="footer-legal section-pad">
        <span>© 2026 {agent.brand}</span>
        <span>Equal Housing Opportunity · Fictional demonstration content</span>
        <span>Privacy</span>
      </div>
    </footer>
  );
}
