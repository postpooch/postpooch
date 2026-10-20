import type { CSSProperties, ReactNode } from "react";

import type { WebsiteSite } from "../../types";
import type { NorthpineSettings } from "../settings";
import { NORTHPINE_CSS } from "../styles";

import { Breadcrumb, PageHero } from "./ui";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type NorthpineChromeProps = {
  site: WebsiteSite;
  settings: NorthpineSettings;
  children: ReactNode;
  overlay?: boolean;
};

function brandStyle(settings: NorthpineSettings): CSSProperties {
  const brand = settings.brand;
  return {
    "--ink": brand.ink,
    "--ink2": brand.ink2,
    "--cream": brand.cream,
    "--paper": brand.paper,
    "--sage": brand.sage,
    "--bronze": brand.bronze,
    "--line": brand.line,
    "--white": brand.white,
    "--serif": brand.serif,
    "--sans": brand.sans,
  } as CSSProperties;
}

/**
 * Shared chrome for the Northpine template.
 * Injects scoped CSS; overlay mode is used by the homepage hero.
 */
export function NorthpineChrome({
  settings,
  children,
  overlay = false,
}: NorthpineChromeProps) {
  return (
    <div className="northpine-site" style={brandStyle(settings)}>
      <style>{NORTHPINE_CSS}</style>
      {!overlay ? <SiteHeader settings={settings} dark /> : null}
      {children}
      <SiteFooter settings={settings} />
    </div>
  );
}

export function NorthpineInnerPage({
  site,
  settings,
  title,
  subtitle,
  image,
  eyebrow,
  current,
  children,
}: NorthpineChromeProps & {
  title: string;
  subtitle?: string;
  image: string;
  eyebrow?: string;
  current?: string;
}) {
  return (
    <NorthpineChrome site={site} settings={settings}>
      <PageHero title={title} subtitle={subtitle} image={image} eyebrow={eyebrow} />
      <Breadcrumb current={current ?? title} />
      {children}
    </NorthpineChrome>
  );
}
