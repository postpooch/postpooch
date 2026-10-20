import type { TemplatePageProps } from "../../../types";
import { ArdenChrome } from "../../components/arden-chrome";
import { SplitFeature } from "../../components/ui";
import type { ArdenSettings } from "../../settings";

import type { ArdenBrokerageContent } from "./schema";

export function ArdenBrokeragePage({
  site,
  settings,
  content,
}: TemplatePageProps<ArdenBrokerageContent, ArdenSettings>) {
  return (
    <ArdenChrome site={site} settings={settings}>
      <section className="brokerageHero">
        <div>
          <p className="eyebrow lightText">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </div>
      </section>
      <div className="marquee">
        {content.cities.map((city) => (
          <span key={city}>{city}</span>
        ))}
      </div>
      <SplitFeature image={content.splitImage} eyebrow={content.splitEyebrow} title={content.splitTitle}>
        {content.splitCopy.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </SplitFeature>
    </ArdenChrome>
  );
}
