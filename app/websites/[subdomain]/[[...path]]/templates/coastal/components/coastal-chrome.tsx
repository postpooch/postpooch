import type { CSSProperties, ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { CoastalSettings } from "../settings";
import { COASTAL_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type CoastalChromeProps = {
  site: WebsiteSite;
  settings: CoastalSettings;
  children: ReactNode;
};

/**
 * Shared chrome for the Coastal template.
 * Injects brand CSS variables, scoped CSS, header, and footer.
 */
export function CoastalChrome({ site, settings, children }: CoastalChromeProps) {
  const { brand } = settings;
  const brandStyle = {
    "--ink": brand.ink,
    "--paper": brand.paper,
    "--accent": brand.accent,
    "--muted": brand.muted,
  } as CSSProperties;

  return (
    <div className="coastal-site" style={brandStyle}>
      <style>{COASTAL_CSS}</style>
      <SiteHeader settings={settings} />
      <main>{children}</main>
      <SiteFooter settings={settings} propertiesEnabled={site.propertiesEnabled} />
    </div>
  );
}
