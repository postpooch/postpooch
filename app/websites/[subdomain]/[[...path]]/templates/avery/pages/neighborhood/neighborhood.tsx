import { propertiesInPlace } from "@/lib/websites/property";
import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { AveryChrome } from "../../components/avery-chrome";
import { ListingGrid } from "../../components/listing-card";
import { averyActiveProperties } from "../../listings";
import type { AverySettings } from "../../settings";

import type { AveryNeighborhoodContent } from "./schema";

export function AveryNeighborhoodPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<AveryNeighborhoodContent, AverySettings>) {
  const neighborhood = settings.catalog.neighborhoods.find(
    (item) => item.slug === params.slug,
  );
  if (!neighborhood) notFound();
  const nearby = averyActiveProperties(propertiesInPlace(properties, neighborhood.name)).slice(
    0,
    4,
  );
  const shown = nearby;

  return (
    <AveryChrome site={site} settings={settings}>
      <section
        className="page-hero has-image tall"
        style={{
          backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.10),rgba(0,0,0,.58)),url('${neighborhood.image}')`,
        }}
      >
        <div className="shell page-hero-inner">
          <p className="eyebrow">
            Neighborhood guide · {neighborhood.coords}
          </p>
          <h1>{neighborhood.name}</h1>
          <p className="hero-sub">{neighborhood.intro}</p>
        </div>
      </section>
      <section className="content-section shell two-col">
        <div>
          <p className="eyebrow">{content.feelingKicker}</p>
          <h2>
            {content.feelingTitlePrefix} {neighborhood.name} itself.
          </h2>
        </div>
        <div className="prose">
          {content.feelingBody.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </section>
      {shown.length ? (
        <section className="content-section shell light-listings">
          <div className="section-title">
            <div>
              <p className="eyebrow">{content.homesKicker}</p>
              <h2>{content.homesTitle}</h2>
            </div>
            <p>{content.homesNote}</p>
          </div>
          <ListingGrid items={shown} />
        </section>
      ) : null}
      <section className="stats shell">
        {content.snapshot.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>
    </AveryChrome>
  );
}
