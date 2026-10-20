import type { CSSProperties, ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { MaraSettings } from "../settings";
import { MARA_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type MaraChromeProps = {
  site: WebsiteSite;
  settings: MaraSettings;
  children: ReactNode;
};

/**
 * Shared chrome for the Mara template.
 * Injects brand CSS variables, scoped CSS, header, and footer.
 */
export function MaraChrome({ settings, children }: MaraChromeProps) {
  const { agent, brand, navItems } = settings;

  const brandStyle = {
    "--ink": brand.ink,
    "--paper": brand.paper,
    "--cream": brand.cream,
    "--sage": brand.sage,
    "--rust": brand.rust,
    "--line": brand.line,
  } as CSSProperties;

  return (
    <div className="mara-site" style={brandStyle}>
      <style>{MARA_CSS}</style>
      <SiteHeader
        monogram={agent.monogram}
        wordmarkLine1={agent.wordmarkLine1}
        wordmarkLine2={agent.wordmarkLine2}
        agentName={agent.name}
        phone={agent.phone}
        email={agent.email}
        menuIndex="Toronto · Private residential advisory"
        consultationLabel="Private consultation"
        navItems={navItems}
      />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
