import { propertiesInPlace } from "@/lib/websites/property";
import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toArdenProperty } from "../../../property-adapters";
import { images } from "../../catalog-defaults";
import { ArdenChrome } from "../../components/arden-chrome";
import { Hero, PropertyGrid, SectionHeading } from "../../components/ui";
import type { ArdenSettings } from "../../settings";

import type { ArdenNeighborhoodContent, ArdenNeighborhoodsContent } from "./schema";

export function ArdenNeighborhoodsPage({
  site,
  settings,
  content,
}: TemplatePageProps<ArdenNeighborhoodsContent, ArdenSettings>) {
  return (
    <ArdenChrome site={site} settings={settings}>
      <Hero
        height="medium"
        image={content.heroImage ?? images.landscape}
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />
      <section className="neighborhoodGrid">
        {settings.catalog.neighborhoods.map((neighborhood) => (
          <a
            href={`/neighborhoods/${neighborhood.slug}`}
            className="neighborhoodCard"
            key={neighborhood.slug}
          >
            <img src={neighborhood.image} alt={neighborhood.name} />
            <div>
              <p className="eyebrow lightText">Community Guide</p>
              <h3>{neighborhood.name}</h3>
              <p>{neighborhood.tagline}</p>
            </div>
          </a>
        ))}
      </section>
    </ArdenChrome>
  );
}

export function ArdenNeighborhoodPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<ArdenNeighborhoodContent, ArdenSettings>) {
  const neighborhood = settings.catalog.neighborhoods.find((item) => item.slug === params.slug);
  if (!neighborhood) notFound();

  const nearby = propertiesInPlace(properties, neighborhood.name)
    .slice(0, 3)
    .map(toArdenProperty);

  return (
    <ArdenChrome site={site} settings={settings}>
      <Hero
        image={neighborhood.image}
        eyebrow="Community Guide"
        title={neighborhood.name}
        subtitle={neighborhood.tagline}
      />
      <section className="longCopy">
        <h2>About {neighborhood.name}</h2>
        <p>{neighborhood.about}</p>
        <h3>{content.lifestyleTitle}</h3>
        <p>{content.lifestyleCopy}</p>
        <h3>{content.marketTitle}</h3>
        <p>{content.marketCopy}</p>
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
