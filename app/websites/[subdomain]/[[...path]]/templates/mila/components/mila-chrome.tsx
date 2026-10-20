import type { ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { MilaSettings } from "../settings";
import { MILA_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type MilaChromeProps = {
  site: WebsiteSite;
  settings: MilaSettings;
  children: ReactNode;
};

/**
 * Shared chrome for the Mila template.
 * Injects fonts + scoped CSS; header/footer read agent identity from settings.
 */
export function MilaChrome({ settings, children }: MilaChromeProps) {
  const { agent, navItems } = settings;

  return (
    <div className="mila-site">
      <style>{MILA_CSS}</style>
      <SiteHeader agent={agent} navItems={navItems} />
      <main>{children}</main>
      <SiteFooter agent={agent} navItems={navItems} />
    </div>
  );
}
