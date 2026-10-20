import type { CSSProperties, ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { AverySettings } from "../settings";
import { AVERY_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type AveryChromeProps = {
  site: WebsiteSite;
  settings: AverySettings;
  children: ReactNode;
};

/**
 * Shared chrome for the Avery template.
 * Injects brand CSS variables, scoped CSS, header, and footer.
 */
export function AveryChrome({ site, settings, children }: AveryChromeProps) {
  const { brand } = settings;
  const brandStyle = {
    "--ink": brand.ink,
    "--paper": brand.paper,
    "--white": brand.white,
    "--taupe": brand.taupe,
    "--muted": brand.muted,
    "--line": "rgba(23,23,19,.2)",
    "--serif": "'Libre Caslon Display', Georgia, serif",
    "--sans": "'DM Sans', Arial, sans-serif",
  } as CSSProperties;

  return (
    <div className="avery-site" style={brandStyle}>
      <style>{AVERY_CSS}</style>
      <SiteHeader settings={settings} />
      <main>{children}</main>
      <SiteFooter site={site} settings={settings} />
    </div>
  );
}
