import type { VossSettings } from "../settings";

import { Logo } from "./logo";

type SiteFooterProps = {
  settings: VossSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const { agent } = settings;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__cta">
        <p className="eyebrow">A more considered move</p>
        <h2>
          Let&apos;s find the address
          <br />
          <em>worth changing yours for.</em>
        </h2>
        <a href="/contact" className="circle-link">
          Start a conversation <span>↗</span>
        </a>
      </div>
      <div className="footer__bottom">
        <Logo
          light
          logoName={agent.logoName}
          logoSub={agent.logoSub}
          agentName={agent.fullName}
        />
        <div className="footer__links">
          <a href="/properties">Properties</a>
          <a href="/services">Services</a>
          <a href="/new-developments">New Development</a>
          <a href="/press">Press</a>
          <a href="/neighborhoods">Neighborhoods</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
        <div className="footer__legal">
          <span>
            © {year} {agent.fullName}
          </span>
          <span>Fair Housing Notice</span>
          <span>{agent.license}</span>
        </div>
      </div>
    </footer>
  );
}
