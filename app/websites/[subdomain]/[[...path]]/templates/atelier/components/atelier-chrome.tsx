import type { CSSProperties, ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { AtelierSettings } from "../settings";
import { ATELIER_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type AtelierChromeProps = {
  site: WebsiteSite;
  settings: AtelierSettings;
  children: ReactNode;
};

/**
 * Shared chrome for the Atelier template.
 * Brand CSS variables and catalog-driven header/footer come from settings.
 */
export function AtelierChrome({ site, settings, children }: AtelierChromeProps) {
  const c = settings.brand.colors;
  const t = settings.brand.typography;

  const brandStyle = {
    "--ink": c.ink,
    "--paper": c.paper,
    "--paper-2": c.paper2,
    "--stone": c.stone,
    "--muted": c.muted,
    "--line": c.line,
    "--white": c.white,
    "--serif": t.serif,
    "--sans": t.sans,
  } as CSSProperties;

  return (
    <div className="atelier-site" style={brandStyle}>
      <style>{ATELIER_CSS}</style>
      <SiteHeader
        wordmarkTop={settings.brand.wordmarkTop}
        wordmarkBottom={settings.brand.wordmarkBottom}
        navItems={settings.navItems}
        mobileNavItems={settings.mobileNavItems}
        phone={settings.agent.phone}
        email={settings.agent.email}
        market={settings.agent.market}
        propertiesEnabled={site.propertiesEnabled}
      />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
