import type { ArdenSettings } from "../settings";

import { IconArrow } from "./icons";

export function SiteFooter({ settings }: { settings: ArdenSettings }) {
  return (
    <footer className="footer">
      <div className="footerTop">
        <div>
          <p className="eyebrow">A private, connected approach</p>
          <h2>{settings.brand.name}</h2>
          <p className="footerLead">
            Strategic representation for distinctive homes, vineyards, and estates throughout Napa
            and Sonoma.
          </p>
          <a className="textLink light" href="/sell-your-home">
            Inquire <IconArrow />
          </a>
        </div>
        <div className="footerContact">
          <span>Contact</span>
          <p>{settings.contact.phone}</p>
          <p>{settings.contact.email}</p>
          <span>Office</span>
          <p>{settings.contact.address}</p>
        </div>
      </div>
      <div className="footerBottom">
        <span>{settings.contact.license}</span>
        <span>Equal Housing Opportunity</span>
        <span>© 2026 {settings.brand.name}. All rights reserved.</span>
      </div>
    </footer>
  );
}
