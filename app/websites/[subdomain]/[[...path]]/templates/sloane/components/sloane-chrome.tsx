import type { CSSProperties, ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { SloaneSettings } from "../settings";
import { SLOANE_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type SloaneChromeProps = {
  site: WebsiteSite;
  settings: SloaneSettings;
  children: ReactNode;
};

/**
 * Shared chrome for the Sloane template.
 * Injects brand CSS variables, scoped CSS, header, and footer.
 */
export function SloaneChrome({ site, settings, children }: SloaneChromeProps) {
  const { brand } = settings;
  const brandStyle = {
    "--ink": brand.ink,
    "--paper": brand.paper,
    "--white": brand.white,
    "--line": brand.line,
    "--muted": brand.muted,
    "--accent": brand.accent,
    "--soft": brand.soft,
    "--serif": brand.serif,
    "--sans": brand.sans,
  } as CSSProperties;

  return (
    <div className="sloane-site" style={brandStyle}>
      <style>{SLOANE_CSS}</style>
      <SiteHeader settings={settings} />
      <main>{children}</main>
      <SiteFooter settings={settings} propertiesEnabled={site.propertiesEnabled} />
    </div>
  );
}
