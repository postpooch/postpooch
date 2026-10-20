import { isSoldListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toArdenProperty } from "../../../property-adapters";
import { images } from "../../catalog-defaults";
import { ArdenChrome } from "../../components/arden-chrome";
import { EditorialCta, Hero, PropertyGrid, SectionHeading } from "../../components/ui";
import type { ArdenSettings } from "../../settings";

import type { ArdenAboutContent } from "./schema";

export function ArdenAboutPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<ArdenAboutContent, ArdenSettings>) {
  const sold = properties.filter(isSoldListing).map(toArdenProperty);

  return (
    <ArdenChrome site={site} settings={settings}>
      <Hero
        image={content.heroImage ?? images.landscape}
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />
      <section className="introPanel">
        <h2>{content.bodyTitle}</h2>
        <div className="copy">
          {content.bodyCopy?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <section className="section">
        <SectionHeading eyebrow="Our Team" title="Personal, connected representation" />
        <div className="agentGrid">
          {settings.catalog.agents.map((agent) => (
            <a className="agentCard" href={`/agents/${agent.slug}`} key={agent.slug}>
              <div className="photo">
                <img src={agent.image} alt={agent.name} />
              </div>
              <h3>{agent.name}</h3>
              <p>{agent.role}</p>
            </a>
          ))}
        </div>
      </section>
      <section className="ctaGrid">
        <EditorialCta
          image={images.pool}
          title="Our Properties"
          copy="Explore our current collection of private and publicly marketed homes."
          href="/properties/sale"
          label="View Properties"
        />
        <EditorialCta
          image={images.modern}
          title="Sell With Us"
          copy="Discover the strategy behind an Arden Vale property launch."
          href="/sell-your-home"
          label="Seller Services"
        />
      </section>
      <section className="section">
        <SectionHeading eyebrow="Selected Results" title="Recent Sales" />
        <PropertyGrid items={sold.slice(0, 3)} />
        <a className="textLink" href="/properties/sold">
          Notable Sales ↗
        </a>
      </section>
    </ArdenChrome>
  );
}
