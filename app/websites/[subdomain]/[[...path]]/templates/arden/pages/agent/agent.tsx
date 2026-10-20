import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toArdenProperty } from "../../../property-adapters";
import { ArdenChrome } from "../../components/arden-chrome";
import { PropertyGrid, SectionHeading } from "../../components/ui";
import type { ArdenSettings } from "../../settings";

import type { ArdenAgentContent } from "./schema";

export function ArdenAgentPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<ArdenAgentContent, ArdenSettings>) {
  const agent = settings.catalog.agents.find((item) => item.slug === params.slug);
  if (!agent) notFound();

  return (
    <ArdenChrome site={site} settings={settings}>
      <section className="agentBioHero">
        <div className="portrait">
          <img src={agent.image} alt={agent.name} />
        </div>
        <div className="agentBioCopy">
          <p className="eyebrow">Meet</p>
          <h1>{agent.name}</h1>
          <p className="intro">{agent.intro}</p>
          <div className="contacts">
            <span>{agent.role}</span>
            <span>{agent.phone}</span>
            <span>{agent.email}</span>
            <span>{agent.license}</span>
          </div>
        </div>
      </section>
      <section className="longCopy">
        <h2>{agent.name}</h2>
        {agent.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
      {properties.length ? (
      <section className="section">
        <SectionHeading eyebrow={content.portfolioEyebrow} title={content.portfolioTitle} />
        <PropertyGrid items={properties.map(toArdenProperty).slice(0, 4)} />
      </section>
      ) : null}
    </ArdenChrome>
  );
}
