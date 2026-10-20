import type { ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { ValeSettings } from "../settings";
import { VALE_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type ValeChromeProps = {
  site: WebsiteSite;
  settings: ValeSettings;
  children: ReactNode;
};

/**
 * Shared chrome for the Vale template.
 * Injects fonts + scoped CSS; header/footer read agent identity from settings.
 */
export function ValeChrome({ settings, children }: ValeChromeProps) {
  const { agent, navItems } = settings;

  return (
    <div className="vale-site">
      <style>{VALE_CSS}</style>
      <SiteHeader
        wordmarkLeft={agent.wordmarkLeft}
        wordmarkRight={agent.wordmarkRight}
        agentName={agent.name}
        market={agent.market}
        email={agent.email}
        navItems={navItems}
      />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
