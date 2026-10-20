import type { CSSProperties, ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { HarborSettings } from "../settings";
import { HARBOR_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type HarborChromeProps = {
  site: WebsiteSite;
  settings: HarborSettings;
  children: ReactNode;
};

/**
 * Shared chrome for the Harbor template.
 * Injects brand CSS variables, scoped CSS, header, and footer.
 */
export function HarborChrome({ site: _site, settings, children }: HarborChromeProps) {
  const { brand } = settings;

  const brandStyle = {
    "--ink": brand.ink,
    "--paper": brand.paper,
    "--paper-2": brand.paper2,
    "--white": brand.white,
    "--olive": brand.olive,
    "--line": brand.line,
    "--light-line": brand.lightLine,
    "--serif": brand.serif,
    "--sans": brand.sans,
  } as CSSProperties;

  return (
    <div className="harbor-site" style={brandStyle}>
      <style>{HARBOR_CSS}</style>
      <SiteHeader settings={settings} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
