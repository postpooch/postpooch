import type { NathanSettings } from "../settings";

import { Newsletter } from "./newsletter";

type SiteFooterProps = {
  settings: NathanSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const { agent } = settings;
  const telHref = `tel:${agent.phone.replace(/\s+/g, "")}`;

  return (
    <footer className="site-footer">
      <section className="footer-cta section-pad">
        <p className="eyebrow">PRIVATE CLIENT SERVICES</p>
        <div className="footer-cta-grid">
          <h2>Your next move deserves a sharper point of view.</h2>
          <div>
            <p>
              Buying, selling, or simply trying to understand what your property
              could command today? Start with a direct conversation.
            </p>
            <a className="pill light" href="/contact">
              Start a conversation <span>↗</span>
            </a>
          </div>
        </div>
      </section>
      <section className="footer-main section-pad">
        <div className="footer-brand">
          <div className="mega-mark">
            {agent.monogram}
            <span>.</span>
          </div>
          <p>{agent.license}</p>
        </div>
        <div className="footer-links">
          <div>
            <p className="eyebrow">EXPLORE</p>
            <a href="/properties">Properties</a>
            <a href="/neighborhoods">Neighborhoods</a>
            <a href="/sold">Results</a>
          </div>
          <div>
            <p className="eyebrow">ABOUT</p>
            <a href="/about">{agent.fullName}</a>
            <a href="/press">Press</a>
            <a href="/insights">Insights</a>
          </div>
          <div>
            <p className="eyebrow">CONTACT</p>
            <a href={`mailto:${agent.email}`}>{agent.email}</a>
            <a href={telHref}>{agent.phone}</a>
            <span>{agent.instagram}</span>
          </div>
        </div>
        <Newsletter
          eyebrow="THE PRIVATE LIST"
          description="A concise monthly note on listings, private inventory, and the New York luxury market."
          successMessage="You're on the list. Watch your inbox."
        />
      </section>
      <div className="legal-bar section-pad">
        <span>© 2026 VALE PRIVATE REAL ESTATE</span>
        <div>
          <a href="/privacy">Privacy</a>
          <span>Fair Housing / Equal Opportunity</span>
        </div>
      </div>
    </footer>
  );
}
