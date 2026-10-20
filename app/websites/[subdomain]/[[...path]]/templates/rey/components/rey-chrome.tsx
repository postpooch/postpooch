import type { CSSProperties, ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { ReySettings } from "../settings";
import { REY_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type ReyChromeProps = {
  site: WebsiteSite;
  settings: ReySettings;
  overlay?: boolean;
  children: ReactNode;
};

/**
 * Shared chrome for the Rey template.
 * Injects brand CSS variables, scoped CSS, header, and footer.
 */
export function ReyChrome({ site, settings, overlay = false, children }: ReyChromeProps) {
  const { brand } = settings;

  const brandStyle = {
    "--ink": brand.ink,
    "--paper": brand.paper,
    "--white": brand.white,
    "--warm": brand.warm,
    "--line": brand.line,
  } as CSSProperties;

  return (
    <div className="rey-site" style={brandStyle}>
      <style>{REY_CSS}</style>
      <SiteHeader settings={settings} overlay={overlay} />
      <main>{children}</main>
      <SiteFooter settings={settings} propertiesEnabled={site.propertiesEnabled} />
    </div>
  );
}
