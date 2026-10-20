import type { RoweSettings } from "../settings";

type SiteFooterProps = {
  settings: RoweSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const { agent, footer, navItems, socials } = settings;
  const telHref = `tel:${agent.phone.replace(/\s+/g, "")}`;

  return (
    <footer className="footer">
      <div className="footer-main">
        <div>
          <div className="footer-kicker">{footer.kicker}</div>
          <h2>
            {footer.headline}
            <br />
            <em>{footer.headlineEm}</em>
          </h2>
          <a className="text-arrow light" href="/contact">
            {footer.ctaLabel} <span>↗</span>
          </a>
        </div>
        <div className="footer-contact">
          <span>Direct</span>
          <a href={telHref}>{agent.phone}</a>
          <a href={`mailto:${agent.email}`}>{agent.email}</a>
          <p>
            {agent.locationLine}
            <br />
            {agent.availabilityLine}
          </p>
        </div>
      </div>
      <div className="footer-grid">
        <div className="footer-tagline">{footer.tagline}</div>
        <div className="footer-links">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
        </div>
        <div className="footer-social">
          {socials.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="footer-newsletter">
          <span>{footer.newsletterLabel}</span>
          <form>
            <input
              type="email"
              placeholder="Email address"
              aria-label="Email address"
            />
            <button type="submit">Join ↗</button>
          </form>
        </div>
      </div>
      <div className="footer-legal">
        <span>{footer.copyright}</span>
        <span>Equal Housing Opportunity · {agent.license}</span>
      </div>
    </footer>
  );
}
