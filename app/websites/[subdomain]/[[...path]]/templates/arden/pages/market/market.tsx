import { propertiesInPlace } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toArdenProperty } from "../../../property-adapters";
import { ArdenChrome } from "../../components/arden-chrome";
import { Hero, PropertyGrid, SectionHeading } from "../../components/ui";
import type { ArdenSettings } from "../../settings";

import type { ArdenMarketContent } from "./schema";

export function ArdenMarketPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<ArdenMarketContent, ArdenSettings>) {
  const nearby = propertiesInPlace(properties, content.title)
    .slice(0, 3)
    .map(toArdenProperty);

  return (
    <ArdenChrome site={site} settings={settings}>
      <Hero
        image={content.image}
        eyebrow={content.eyebrow}
        title={content.title}
        subtitle={content.subtitle}
      />
      <section className="longCopy">
        <h2>{content.aboutTitle}</h2>
        {content.aboutCopy.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <h2>{content.marketTitle}</h2>
        {content.marketCopy.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
      {nearby.length ? (
      <section className="section">
        <SectionHeading eyebrow={content.listingsEyebrow} title={content.listingsTitle} />
        <PropertyGrid items={nearby} />
      </section>
      ) : null}
    </ArdenChrome>
  );
}
