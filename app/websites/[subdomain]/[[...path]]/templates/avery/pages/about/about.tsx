import type { TemplatePageProps } from "../../../types";
import { AveryChrome } from "../../components/avery-chrome";
import { PageHero } from "../../components/page-hero";
import type { AverySettings } from "../../settings";

import type { AveryAboutContent } from "./schema";

export function AveryAboutPage({
  site,
  settings,
  content,
}: TemplatePageProps<AveryAboutContent, AverySettings>) {
  return (
    <AveryChrome site={site} settings={settings}>
      <PageHero kicker={content.heroKicker} title={content.heroTitle} sub={content.heroSub} />
      <section className="content-section shell">
        <div className="about-lead">
          <div>
            <p className="eyebrow">{content.leadKicker}</p>
            <h2>{content.leadTitle}</h2>
          </div>
          <div className="prose">
            {content.leadBody.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="about-photo-grid">
          <img src={content.portrait} alt="" />
          <img src={content.interior} alt="" />
        </div>
        <div className="mini-stats">
          {content.stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="content-section shell two-col">
        <div>
          <p className="eyebrow">{content.styleKicker}</p>
          <h2>{content.styleTitle}</h2>
        </div>
        <div className="prose">
          {content.styleBody.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </section>
    </AveryChrome>
  );
}
