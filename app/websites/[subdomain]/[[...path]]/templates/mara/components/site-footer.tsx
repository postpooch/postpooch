import type { MaraSettings } from "../settings";

import { Instagram } from "./icons";

type SiteFooterProps = {
  settings: MaraSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const { agent } = settings;
  const telHref = `tel:${agent.phone.replace(/\s+/g, "")}`;

  return (
    <footer className="footer">
      <section className="footerCta">
        <p className="eyebrow light">A considered next move</p>
        <h2>Good real estate advice should feel personal.</h2>
        <a href="/contact" className="textLink light">
          Start a conversation <span>→</span>
        </a>
      </section>
      <div className="footerMain">
        <div className="footerBrand">
          <div className="monogram">{agent.monogram}</div>
          <p>
            Independent perspective.
            <br />
            Exceptional homes.
            <br />
            Toronto, considered.
          </p>
        </div>
        <div>
          <p className="footerLabel">Explore</p>
          <a href="/properties">Properties</a>
          <a href="/neighborhoods">Neighborhoods</a>
          <a href="/journal">Journal</a>
          <a href="/about">About Mara</a>
        </div>
        <div>
          <p className="footerLabel">Services</p>
          <a href="/buy">Buying</a>
          <a href="/sell">Selling</a>
          <a href="/valuation">Valuation</a>
          <a href="/condos">Condo collection</a>
        </div>
        <div>
          <p className="footerLabel">Connect</p>
          <a href={telHref}>{agent.phone}</a>
          <a href={`mailto:${agent.email}`}>{agent.email}</a>
          <span>{agent.office}</span>
          <a href="#" className="social">
            <Instagram /> Instagram
          </a>
        </div>
      </div>
      <div className="footerBottom">
        <span>© 2026 {agent.name} Real Estate</span>
        <span>Fictional demo content · Replace before launch</span>
        <a href="/privacy">Privacy</a>
      </div>
    </footer>
  );
}
