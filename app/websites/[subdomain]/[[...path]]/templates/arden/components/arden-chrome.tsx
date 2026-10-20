import type { CSSProperties, ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { ArdenSettings } from "../settings";
import { ARDEN_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type ArdenChromeProps = {
  site: WebsiteSite;
  settings: ArdenSettings;
  children: ReactNode;
};

/**
 * Shared chrome for the Arden template.
 * Brand CSS variables and catalog-driven header/footer come from settings.
 */
export function ArdenChrome({ site, settings, children }: ArdenChromeProps) {
  const brandStyle = {
    "--ink": settings.colors.ink,
    "--cream": settings.colors.cream,
    "--sage": settings.colors.sage,
    "--paper": settings.colors.paper,
    "--line": settings.colors.line,
    "--muted": settings.colors.muted,
  } as CSSProperties;

  return (
    <div className="arden-site" style={brandStyle}>
      <style>{ARDEN_CSS}</style>
      <SiteHeader
        brandName={settings.brand.shortName}
        tagline={settings.brand.tagline}
        phone={settings.contact.phone}
        email={settings.contact.email}
        address={settings.contact.address}
        navItems={settings.navItems}
        searchHref={settings.searchHref}
        propertiesEnabled={site.propertiesEnabled}
      />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
