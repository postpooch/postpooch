import type { CSSProperties, ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { ElenaSettings } from "../settings";
import { ELENA_CSS } from "../styles";

import { Navigation } from "./navigation";

type ElenaChromeProps = {
  site: WebsiteSite;
  settings: ElenaSettings;
  children: ReactNode;
};

/**
 * Shared chrome for the Elena template.
 * Injects brand CSS variables, scoped CSS, and interactive navigation.
 */
export function ElenaChrome({ settings, children }: ElenaChromeProps) {
  const { agent, brand, navItems, catalog } = settings;

  const brandStyle = {
    "--ink": brand.ink,
    "--ink-soft": brand.inkSoft,
    "--paper": brand.paper,
    "--paper-deep": brand.paperDeep,
    "--line": brand.line,
    "--night": brand.night,
    "--cream": brand.cream,
  } as CSSProperties;

  const agentName = `${agent.firstName} ${agent.lastName}`.trim();

  return (
    <div className="elena-site" style={brandStyle}>
      <style>{ELENA_CSS}</style>
      <Navigation
        wordmarkLeft={agent.wordmarkLeft}
        wordmarkRight={agent.wordmarkRight}
        agentName={agentName}
        headerCenter={agent.headerCenter}
        menuBrand={agent.menuBrand}
        menuIntro={agent.menuIntro}
        menuMeta={agent.menuMeta}
        email={agent.email}
        phone={agent.phone}
        navItems={navItems}
        inquiryInterests={catalog.inquiryInterests}
      />
      {children}
    </div>
  );
}
