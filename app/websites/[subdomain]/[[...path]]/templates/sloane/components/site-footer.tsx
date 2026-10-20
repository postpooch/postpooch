import type { SloaneSettings } from "../settings";

import { ContactForm } from "./contact-form";

type SiteFooterProps = {
  settings: SloaneSettings;
  propertiesEnabled: boolean;
};

function digits(value: string) {
  return value.replace(/\D/g, "");
}

export function SiteFooter({ settings, propertiesEnabled }: SiteFooterProps) {
  const { agent } = settings;

  return (
    <footer className="site-footer">
      <section className="footer-cta section-pad">
        <div className="eyebrow">Get in touch</div>
        <div className="footer-cta-grid">
          <div>
            <h2>Thinking of buying or selling?</h2>
            <p>
              Tell us what you’re considering. We’ll respond with a clear next step, whether you’re
              ready now or simply starting to explore.
            </p>
          </div>
          <ContactForm compact title="" />
        </div>
      </section>
      <section className="footer-main section-pad">
        <div className="footer-brand">
          <div className="footer-monogram">{agent.monogram}</div>
          <h3>{agent.name}</h3>
          <p>{agent.title}</p>
        </div>
        <div className="footer-columns">
          <div>
            <span className="footer-label">Contact</span>
            <a href={`tel:${digits(agent.phone)}`}>{agent.phone}</a>
            <a href={`mailto:${agent.email}`}>{agent.email}</a>
            <p>{agent.address}</p>
            <p>{agent.license}</p>
          </div>
          <div>
            <span className="footer-label">Navigate</span>
            <a href="/about">About</a>
            {propertiesEnabled ? <a href="/properties">Properties</a> : null}
            <a href="/communities">Communities</a>
            <a href="/resources">Resources</a>
            <a href="/journal">Journal</a>
            <a href="/contact">Contact</a>
          </div>
          <div>
            <span className="footer-label">Follow</span>
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">Newsletter</a>
          </div>
        </div>
        <div className="legal-copy">
          <p>
            © 2026 {agent.name} Real Estate. All property information is presented for illustrative
            template purposes only and should be independently verified. Equal Housing Opportunity.
          </p>
          <p>
            This demo uses fictional agent, brokerage, property, and client information. Photography
            should be replaced or licensed appropriately before commercial deployment.
          </p>
        </div>
      </section>
    </footer>
  );
}
