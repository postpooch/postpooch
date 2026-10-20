import type { CSSProperties, ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { LuxurySettings } from "../settings";
import { LUXURY_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type LuxuryChromeProps = {
  site: WebsiteSite;
  settings: LuxurySettings;
  children: ReactNode;
};

/**
 * Shared chrome for the luxury template.
 * Brand CSS variables and catalog-driven header/footer come from settings.
 */
export function LuxuryChrome({ settings, children }: LuxuryChromeProps) {
  const c = settings.brand.colors;
  const t = settings.brand.typography;

  const brandStyle = {
    "--ink": c.ink,
    "--paper": c.paper,
    "--surface": c.surface,
    "--accent": c.accent,
    "--accent-dark": c.accentDark,
    "--muted": c.muted,
    "--line": c.line,
    "--overlay": c.overlay,
    "--display": t.display,
    "--body": t.body,
    "--tracking": t.letterSpacing,
  } as CSSProperties;

  return (
    <div className="luxury-site" style={brandStyle}>
      <style>{LUXURY_CSS}</style>
      <SiteHeader
        siteName={settings.brand.siteName}
        logoTextTop={settings.brand.logoTextTop}
        logoTextBottom={settings.brand.logoTextBottom}
        navItems={settings.navItems}
        phone={settings.realtor.phone}
        email={settings.realtor.email}
        addressLine1={settings.brokerage.addressLine1}
        addressLine2={settings.brokerage.addressLine2}
      />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
