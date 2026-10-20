import type { MilaRegioContent } from "../pages/regio/schema";
import type { MilaArea, MilaProperty } from "../settings";

import { ArrowUpRight } from "./icons";
import { PropertyCard } from "./property-card";

type AreaDetailProps = {
  area: MilaArea;
  properties: MilaProperty[];
  content: MilaRegioContent;
};

export function AreaDetail({ area, properties, content }: AreaDetailProps) {
  const local = properties.filter((p) => p.city === area.city).slice(0, 3);

  return (
    <>
      <section className="area-hero">
        <img src={area.image} alt={`${area.city} area`} />
        <div className="area-overlay shell">
          <span className="eyebrow light">
            {content.heroEyebrowPrefix} {area.city}
          </span>
          <h1>
            {area.city}
            <br />
            <em>{area.label}</em>
          </h1>
          <p>{area.intro}</p>
        </div>
      </section>
      <section className="section shell area-story">
        <div className="sticky-label">
          <span className="eyebrow">{content.storyEyebrow}</span>
        </div>
        <div>
          <h2>
            {content.storyTitlePrefix} {area.city} {content.storyTitleSuffix}
          </h2>
          <p className="lead">{area.body}</p>
          <div className="area-points">
            {area.points.map((p, i) => (
              <span key={p}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>
      {local.length > 0 && (
        <section className="section shell">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">{content.listingsEyebrow}</span>
              <h2>
                {content.listingsTitlePrefix} {area.city}
              </h2>
            </div>
            <a href="/aanbod" className="text-link">
              {content.listingsCta} <ArrowUpRight />
            </a>
          </div>
          <div className="listing-grid">
            {local.map((p) => (
              <PropertyCard property={p} key={p.slug} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
