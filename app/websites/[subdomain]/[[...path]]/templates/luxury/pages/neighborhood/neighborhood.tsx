import { propertiesInPlace } from "@/lib/websites/property";
import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { LuxuryChrome } from "../../components/luxury-chrome";
import { PropertyCard } from "../../components/property-card";
import { PageHero, SectionHeading } from "../../components/ui";
import type { LuxurySettings } from "../../settings";

import type { LuxuryNeighborhoodContent } from "./schema";
import { toLuxuryProperty } from "../../../property-adapters";

export function LuxuryNeighborhoodPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<LuxuryNeighborhoodContent, LuxurySettings>) {
  const c = settings.catalog.communities.find((x) => x.slug === params.slug);
  if (!c) notFound();

  const nearby = propertiesInPlace(properties, c.name).slice(0, 3);

  return (
    <LuxuryChrome site={site} settings={settings}>
      <PageHero
        eyebrow="COMMUNITY GUIDE"
        title={c.name}
        subtitle={c.tagline}
        image={c.image}
      />
      <section className="community-lede section-pad">
        <div>
          <p className="eyebrow">WELCOME TO {c.name.toUpperCase()}</p>
          <h2>{c.tagline}</h2>
        </div>
        <div>
          <p>{c.intro}</p>
          <p>{c.market}</p>
        </div>
      </section>
      <section className="community-highlights">
        <div
          className="image-cover"
          style={{ backgroundImage: `url(${c.image})` }}
        />
        <div>
          <p className="eyebrow">WHAT TO LOVE</p>
          <h2>Life in {c.name}</h2>
          <p>{c.lifestyle}</p>
          <ul>
            {c.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="community-stats section-pad">
        <SectionHeading
          eyebrow="AT A GLANCE"
          title={`${c.name} overview.`}
          align="center"
        />
        <div className="stats-grid">
          {c.stats.map((s) => (
            <div key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <p className="data-note">{content.dataNote}</p>
      </section>
      {nearby.length ? <section className="section-pad">
        <SectionHeading
          eyebrow={`HOMES IN ${c.name.toUpperCase()}`}
          title="Browse properties in the area."
        />
        <div className="property-grid">
          {nearby.map(toLuxuryProperty).map((p) => (
            <PropertyCard key={p.slug} property={p} />
          ))}
        </div>
      </section> : null}
    </LuxuryChrome>
  );
}
