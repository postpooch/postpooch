import type { CSSProperties, ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { VossSettings } from "../settings";
import { VOSS_CSS } from "../styles";

import { SiteFooter } from "./site-footer";
import { SiteMenu } from "./site-menu";

type VossChromeProps = {
  site: WebsiteSite;
  settings: VossSettings;
  children: ReactNode;
  /** When false, the page owns header placement (e.g. menu inside the home hero). */
  showHeader?: boolean;
  transparentHeader?: boolean;
  showFooter?: boolean;
};

/**
 * Shared chrome for the Voss (mara-voss-real-estate) template.
 * Injects brand CSS variables, scoped CSS, overlay menu, and optional footer.
 */
export function VossChrome({
  settings,
  children,
  showHeader = true,
  transparentHeader = false,
  showFooter = true,
}: VossChromeProps) {
  const { agent, brand, navItems } = settings;

  const brandStyle = {
    "--ink": brand.ink,
    "--paper": brand.paper,
    "--paper-2": brand.paper2,
    "--white": brand.white,
    "--copper": brand.copper,
    "--line": brand.line,
    "--accent-light": brand.accentLight,
  } as CSSProperties;

  return (
    <div className="voss-site" style={brandStyle}>
      <style>{VOSS_CSS}</style>
      {showHeader ? (
        <SiteMenu
          transparent={transparentHeader}
          logoName={agent.logoName}
          logoSub={agent.logoSub}
          agentName={agent.fullName}
          market={agent.market}
          email={agent.email}
          phone={agent.phone}
          instagram={agent.instagram}
          consultationLabel={agent.consultationLabel}
          menuAside="Private representation for buyers and sellers who value clarity, discretion and a point of view."
          navItems={navItems}
        />
      ) : null}
      {children}
      {showFooter ? <SiteFooter settings={settings} /> : null}
    </div>
  );
}
