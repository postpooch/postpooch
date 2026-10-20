import type { ReySettings } from "../settings";

import { ContactForm } from "./contact-form";

type SiteFooterProps = {
  settings: ReySettings;
  propertiesEnabled?: boolean;
};

export function ContactBand({ settings }: SiteFooterProps) {
  const band = settings.contactBand;

  return (
    <section className="contact-band">
      <div className="contact-band__intro">
        <span className="eyebrow eyebrow--light">{band.eyebrow}</span>
        <h2>
          {band.titleLine1}
          <br />
          <em>{band.titleEmphasis}</em>
        </h2>
        <p>{band.body}</p>
      </div>
      <ContactForm submitLabel={band.submitLabel} light />
    </section>
  );
}

export function SiteFooter({
  settings,
  propertiesEnabled = true,
}: SiteFooterProps) {
  const { agent } = settings;
  const telHref = `tel:${agent.phone.replace(/\D/g, "")}`;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="brand-script">{agent.firstName}</span>
          <span className="brand-name">{agent.lastName.toUpperCase()}</span>
          <p>{agent.tagline}</p>
        </div>
        <div className="footer-column">
          <span className="footer-label">Contact</span>
          <p>{agent.address}</p>
          <a href={telHref}>{agent.phone}</a>
          <a href={`mailto:${agent.email}`}>{agent.email}</a>
        </div>
        <div className="footer-column footer-links">
          <span className="footer-label">Explore</span>
          {propertiesEnabled ? <a href="/properties">Properties</a> : null}
          <a href="/communities">Communities</a>
          <a href="/team">Team</a>
          <a href="/contact">Contact</a>
        </div>
        <div className="footer-column footer-links">
          <span className="footer-label">Follow</span>
          <a href="#">{agent.instagram}</a>
          <a href="#">{agent.youtube}</a>
          <a href="#">{agent.linkedin}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © {year} {agent.fullName}. All rights reserved.
        </p>
        <p>{agent.license}</p>
        <p>Equal Housing Opportunity</p>
      </div>
    </footer>
  );
}
