import type { TemplatePageProps } from "../../../types";
import { PropertyCard } from "../../components/property-card";
import { Reveal } from "../../components/reveal";
import { ValeChrome } from "../../components/vale-chrome";
import type { ValeSettings } from "../../settings";

import type { ValePropertiesContent } from "./schema";
import { toValeProperty } from "../../../property-adapters";

export function ValePropertiesPage({
  site,
  settings,
  content,
  properties: websiteProperties,
}: TemplatePageProps<ValePropertiesContent, ValeSettings>) {
  const properties = websiteProperties.map(toValeProperty);

  return (
    <ValeChrome site={site} settings={settings}>
      <div className="interior-page page-pad">
        <header className="page-intro">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>
            {content.titleLine1}
            <br />
            <em>{content.titleEmphasis}</em>
          </h1>
          <p className="intro-copy">{content.introCopy}</p>
        </header>
        <div className="property-grid listing-grid">
          {properties.map((property, i) => (
            <Reveal key={property.slug} delay={(i % 2) * 90}>
              <PropertyCard property={property} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </ValeChrome>
  );
}
