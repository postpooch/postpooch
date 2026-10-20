import { propertiesInPlace } from "@/lib/websites/property";
import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { MaraChrome } from "../../components/mara-chrome";
import { PropertyCard } from "../../components/property-card";
import type { MaraSettings } from "../../settings";

import type { MaraNeighborhoodContent } from "./schema";
import { toMaraProperty } from "../../../property-adapters";

export function MaraNeighborhoodPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<MaraNeighborhoodContent, MaraSettings>) {
  const neighborhood = settings.catalog.neighborhoods.find(
    (item) => item.slug === params.slug,
  );
  if (!neighborhood) notFound();

  const preview = propertiesInPlace(properties, neighborhood.name)
    .slice(0, 2)
    .map(toMaraProperty);
  const [g0, g1, g2] = content.galleryImages;

  return (
    <MaraChrome site={site} settings={settings}>
      <section className="detailHero">
        <img src={neighborhood.image} alt={neighborhood.name} />
        <div className="detailHeroText">
          <div>
            <p>{neighborhood.kicker}</p>
            <h1>{neighborhood.name}</h1>
          </div>
        </div>
      </section>
      <section className="introSplit section">
        <p className="eyebrow">{content.profileEyebrow}</p>
        <div>
          <h2>{neighborhood.copy}</h2>
          <p>{content.profileBody}</p>
        </div>
      </section>
      <section className="facts">
        {neighborhood.stats.map((s, i) => (
          <div key={s}>
            <strong>0{i + 1}</strong>
            <span>{s}</span>
          </div>
        ))}
      </section>
      <section className="section">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">{content.galleryEyebrow}</p>
            <h2>{content.galleryTitle}</h2>
          </div>
        </div>
        <div className="galleryMosaic">
          <div>
            <img src={g0} alt="Toronto streetscape" />
          </div>
          <div>
            <img src={g1} alt="Residential street" />
          </div>
          <div>
            <img src={g2} alt="City view" />
          </div>
        </div>
      </section>
      {preview.length ? <section className="section">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">{content.inventoryEyebrow}</p>
            <h2>{content.inventoryTitle}</h2>
          </div>
          <a className="textLink" href="/properties">
            {content.inventoryCta} <span>→</span>
          </a>
        </div>
        <div className="propertyGrid">
          {preview.map((p) => (
            <PropertyCard property={p} key={p.slug} />
          ))}
        </div>
      </section> : null}
    </MaraChrome>
  );
}
