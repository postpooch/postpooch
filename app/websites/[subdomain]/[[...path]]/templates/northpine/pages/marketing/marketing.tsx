import type { TemplatePageProps } from "../../../types";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import { SectionHeading } from "../../components/ui";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineMarketingContent } from "./schema";

export function NorthpineMarketingPage({
  site,
  settings,
  content,
}: TemplatePageProps<NorthpineMarketingContent, NorthpineSettings>) {
  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <section className="section-pad container wide">
        <div className="two-col">
          <div>
            <SectionHeading kicker={content.kicker} title={content.title} />
            <p className="lead">{content.lead}</p>
            <p>{content.body}</p>
          </div>
          <div className="editorial-image">
            <img src={settings.images.interior} alt="Luxury interior" />
          </div>
        </div>
        <div className="marketing-grid">
          {settings.catalog.marketingItems.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </NorthpineInnerPage>
  );
}
