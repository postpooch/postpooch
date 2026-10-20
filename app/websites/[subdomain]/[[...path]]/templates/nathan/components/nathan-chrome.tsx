import type { CSSProperties, ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { NathanSettings } from "../settings";
import { NATHAN_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type NathanChromeProps = {
  site: WebsiteSite;
  settings: NathanSettings;
  children: ReactNode;
};

/**
 * Shared chrome for the Nathan (vale-estate) template.
 * Injects brand CSS variables, scoped CSS, header, and footer.
 */
export function NathanChrome({ settings, children }: NathanChromeProps) {
  const { agent, brand, navItems } = settings;

  const brandStyle = {
    "--ink": brand.ink,
    "--paper": brand.paper,
    "--white": brand.white,
    "--line": brand.line,
    "--cobalt": brand.cobalt,
    "--muted": brand.muted,
  } as CSSProperties;

  return (
    <div className="nathan-site" style={brandStyle}>
      <style>{NATHAN_CSS}</style>
      <SiteHeader
        firstName={agent.firstName}
        lastName={agent.lastName}
        agentName={agent.fullName}
        market={agent.market}
        email={agent.email}
        phone={agent.phone}
        contactCtaLabel={agent.contactCtaLabel}
        menuIndex="NV / 01—07"
        navItems={navItems}
      />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
