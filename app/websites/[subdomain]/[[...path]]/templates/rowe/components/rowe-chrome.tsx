import type { CSSProperties, ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { RoweSettings } from "../settings";
import { ROWE_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type RoweChromeProps = {
  site: WebsiteSite;
  settings: RoweSettings;
  children: ReactNode;
};

/**
 * Shared chrome for the Avery Rowe (estate-agent-site) template.
 * Injects brand CSS variables, scoped CSS, header, and footer.
 */
export function RoweChrome({ settings, children }: RoweChromeProps) {
  const { agent, brand, navItems, menuNote } = settings;

  const brandStyle = {
    "--paper": brand.paper,
    "--paper-2": brand.paper2,
    "--ink": brand.ink,
    "--muted": brand.muted,
    "--line": brand.line,
    "--soft-line": brand.softLine,
    "--black": brand.black,
    "--cream": brand.cream,
  } as CSSProperties;

  return (
    <div className="rowe-site" style={brandStyle}>
      <style>{ROWE_CSS}</style>
      <SiteHeader
        wordmark={agent.wordmark}
        wordmarkSub={agent.wordmarkSub}
        contactCtaLabel={agent.contactCtaLabel}
        menuNote={menuNote}
        marketNote={agent.marketNote}
        email={agent.email}
        phone={agent.phone}
        navItems={navItems}
      />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
