import type { ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { RowanSettings } from "../settings";
import { ROWAN_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type RowanChromeProps = {
  site: WebsiteSite;
  settings: RowanSettings;
  children: ReactNode;
  /** Match original dark header treatment on interior pages. */
  darkHeader?: boolean;
};

/**
 * Shared chrome for the Rowan template.
 * Injects scoped CSS; header/footer read agent identity from settings.
 */
export function RowanChrome({
  settings,
  children,
  darkHeader = false,
}: RowanChromeProps) {
  return (
    <div className="rowan-site">
      <style>{ROWAN_CSS}</style>
      <SiteHeader settings={settings} dark={darkHeader} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
