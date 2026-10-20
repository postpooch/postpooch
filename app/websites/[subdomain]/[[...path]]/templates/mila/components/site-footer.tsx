import type { MilaNavItem, MilaSettings } from "../settings";

import { ArrowUpRight } from "./icons";

type SiteFooterProps = {
  agent: MilaSettings["agent"];
  navItems: MilaNavItem[];
};

export function SiteFooter({ agent, navItems }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-top shell">
        <div className="footer-statement">
          <span className="eyebrow light">Shall we get acquainted?</span>
          <h2>A good home plan starts with a good conversation.</h2>
          <a href="/contact" className="button button-light">
            Schedule a conversation <ArrowUpRight />
          </a>
        </div>
        <div className="footer-details">
          <div>
            <span>Call</span>
            <a href={`tel:${agent.phoneHref}`}>{agent.phoneDisplay}</a>
          </div>
          <div>
            <span>Email</span>
            <a href={`mailto:${agent.email}`}>{agent.email}</a>
          </div>
          <div>
            <span>Visit</span>
            <p>{agent.address}</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom shell">
        <div className="footer-brand">
          <span className="brand-mark inverse">{agent.brandMark}</span>
          <div>
            <strong>
              {agent.brandName} {agent.brandTag}
            </strong>
            <small>personal brokerage</small>
          </div>
        </div>
        <div className="footer-links">
          {navItems.slice(0, 5).map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="footer-meta">
          <a href="/privacy">Privacy</a>
          <span>
            © {new Date().getFullYear()} {agent.brandName} {agent.brandTag}
          </span>
        </div>
      </div>
    </footer>
  );
}
