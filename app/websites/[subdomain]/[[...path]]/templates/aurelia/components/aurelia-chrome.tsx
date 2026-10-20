import type { CSSProperties, ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { AureliaSettings } from "../settings";
import { AURELIA_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type AureliaChromeProps = {
  site: WebsiteSite;
  settings: AureliaSettings;
  children: ReactNode;
  headerOnLight?: boolean;
};

/**
 * Shared chrome for the Aurelia template.
 * Injects brand CSS variables, scoped CSS, header, and footer.
 */
export function AureliaChrome({
  site,
  settings,
  children,
  headerOnLight = false,
}: AureliaChromeProps) {
  const { brand } = settings;
  const brandStyle = {
    "--ink": brand.ink,
    "--paper": brand.paper,
    "--cream": brand.cream,
    "--accent": brand.accent,
    "--muted": brand.muted,
    "--white": brand.white,
  } as CSSProperties;

  return (
    <div className="aurelia-site" style={brandStyle}>
      <style>{AURELIA_CSS}</style>
      <SiteHeader settings={settings} headerOnLight={headerOnLight} />
      <main>{children}</main>
      <SiteFooter site={site} settings={settings} />
    </div>
  );
}
