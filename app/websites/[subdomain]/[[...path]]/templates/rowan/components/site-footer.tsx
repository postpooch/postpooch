import type { RowanSettings } from "../settings";

type SiteFooterProps = {
  settings: RowanSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const { agent } = settings;
  const year = new Date().getFullYear();
  const phoneHref = `tel:${agent.phone.replace(/\s/g, "")}`;

  return (
    <footer className="footer">
      <div className="footer__top">
        <div>
          <p className="eyebrow">Private real estate</p>
          <h2>{agent.name}</h2>
          <p>{agent.role}</p>
        </div>
        <div className="footer__links">
          <a href="/#projects">Projects</a>
          <a href="/listings">Residences</a>
          <a href="/#buy">Buy</a>
          <a href="/#sell">Sell</a>
          <a href="/journal">Journal</a>
          <a href="/#about">About</a>
          <a href="/#contact">Contact</a>
        </div>
        <div className="footer__contact">
          <a href={phoneHref}>{agent.phone}</a>
          <a href={`mailto:${agent.email}`}>{agent.email}</a>
          <span>{agent.license}</span>
        </div>
      </div>
      <div className="footer__bottom">
        <span>
          © {year} {agent.name}
        </span>
        <a href="/privacy-policy">Privacy policy</a>
        <span>Concept website — replace demo content before launch</span>
      </div>
    </footer>
  );
}
