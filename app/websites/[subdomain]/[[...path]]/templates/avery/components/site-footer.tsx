import type { WebsiteSite } from "../../types";
import type { AverySettings } from "../settings";

import { NewsletterInlineForm } from "./newsletter-form";

type SiteFooterProps = {
  site: WebsiteSite;
  settings: AverySettings;
};

export function SiteFooter({ site, settings }: SiteFooterProps) {
  const { agent, catalog } = settings;
  const telHref = `tel:${agent.phone.replace(/\D/g, "")}`;

  return (
    <footer className="footer">
      <section
        className="footer-cta image-cover"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(15,15,13,.78),rgba(15,15,13,.32)),url('${catalog.images.city1}')`,
        }}
      >
        <div>
          <p className="eyebrow light-text">A thoughtful next move</p>
          <h2>Work with {agent.firstName}</h2>
          <p>
            Whether you are buying, selling, or simply deciding what comes next, begin
            with a clear point of view.
          </p>
          <a className="button light-button" href="/contact">
            Let&apos;s connect <span>↗</span>
          </a>
        </div>
      </section>
      <div className="footer-main shell">
        <div className="footer-brand">
          <div className="brand inverse">
            <span>{agent.brandFirst}</span>
            <span>{agent.brandLast}</span>
          </div>
          <p>{agent.title}</p>
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <a href={`mailto:${agent.email}`}>{agent.email}</a>
          <a href={telHref}>{agent.phone}</a>
          <p>{agent.address}</p>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          {site.propertiesEnabled ? <a href="/properties">Properties</a> : null}
          <a href="/neighborhoods">Neighborhoods</a>
          <a href="/insights">Insights</a>
          <a href="/contact">Contact</a>
        </div>
        <div>
          <p className="eyebrow">Private updates</p>
          <p className="muted">
            Market notes, new listings, and occasional off-market opportunities.
          </p>
          <NewsletterInlineForm />
        </div>
      </div>
      <div className="footer-legal shell">
        <p>© 2026 {agent.name}. Template demo content.</p>
        <p>Equal Housing Opportunity · Privacy · Accessibility</p>
      </div>
    </footer>
  );
}
