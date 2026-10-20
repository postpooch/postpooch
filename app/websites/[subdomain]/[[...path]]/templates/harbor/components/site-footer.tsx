import type { HarborSettings } from "../settings";

import { LeadForm } from "./lead-form";

type SiteFooterProps = {
  settings: HarborSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const { agent } = settings;

  return (
    <footer className="footer">
      <section className="footer-cta shell">
        <div>
          <p className="kicker">A good move starts with a conversation.</p>
          <h2>
            What are you thinking <em>about next?</em>
          </h2>
        </div>
        <LeadForm compact />
      </section>
      <section className="footer-bottom shell">
        <div className="footer-identity">
          <div className="monogram">{agent.monogram}</div>
          <div>
            <strong>{agent.name}</strong>
            <span>{agent.title}</span>
          </div>
        </div>
        <div className="footer-links">
          <div>
            <span>Contact</span>
            <a href={`tel:${agent.phoneHref}`}>{agent.phone}</a>
            <a href={`mailto:${agent.email}`}>{agent.email}</a>
          </div>
          <div>
            <span>Navigate</span>
            <a href="/listings">Properties</a>
            <a href="/sell">Sell</a>
            <a href="/buy">Buy</a>
            <a href="/about">About</a>
          </div>
          <div>
            <span>Resources</span>
            <a href="/journal">Journal</a>
            <a href="/home-value">Home value</a>
            <a href="/market-report">Market report</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
            <a href="/ai-disclosure">AI disclosure</a>
          </div>
        </div>
      </section>
      <div className="legal shell">
        <span>© 2026 {agent.name}. Concept demo.</span>
        <span>
          {agent.brokerage} · {agent.address}
        </span>
        <span>Photography placeholders via Unsplash.</span>
      </div>
    </footer>
  );
}
