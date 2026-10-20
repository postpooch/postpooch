import type { CoastalSettings } from "../settings";

import { LeadForm } from "./lead-form";

type SiteFooterProps = {
  settings: CoastalSettings;
  propertiesEnabled?: boolean;
};

export function SiteFooter({
  settings,
  propertiesEnabled = true,
}: SiteFooterProps) {
  const { agent, catalog } = settings;

  return (
    <footer>
      <section className="footerLead">
        <div className="footerLeadCopy">
          <p className="eyebrow light">Private Consultation</p>
          <h2>Considering your next move?</h2>
          <p>
            Share a few details and we’ll follow up with a focused plan for your
            property or search.
          </p>
        </div>
        <LeadForm compact />
      </section>
      <section className="footerMain">
        <div className="footerBrand">
          <div className="footerMonogram">{agent.monogram}</div>
          <h3>
            {agent.firstName} {agent.lastName}
          </h3>
          <p>{agent.title}</p>
        </div>
        <div className="footerContact">
          <p>{agent.license}</p>
          <p>{agent.phone}</p>
          <p>{agent.email}</p>
          <p>{agent.address}</p>
        </div>
        <div className="footerLinks">
          <a href="/about">About</a>
          <a href="/communities">Communities</a>
          <a href="/media">Media</a>
          {propertiesEnabled ? <a href="/listings">Properties</a> : null}
          <a href="/contact">Contact</a>
        </div>
        <div className="footerSocial">
          {catalog.social.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>
      <div className="footerLegal">
        © 2026 {agent.brokerage}. Demo template content. Equal Housing Opportunity.
      </div>
    </footer>
  );
}
