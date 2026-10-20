import type { TemplatePageProps } from "../../../types";
import { AveryChrome } from "../../components/avery-chrome";
import { ContactForm } from "../../components/contact-form";
import { PageHero } from "../../components/page-hero";
import type { AverySettings } from "../../settings";

import type { AveryValuationContent } from "./schema";

export function AveryValuationPage({
  site,
  settings,
  content,
}: TemplatePageProps<AveryValuationContent, AverySettings>) {
  return (
    <AveryChrome site={site} settings={settings}>
      <PageHero
        kicker={content.heroKicker}
        title={content.heroTitle}
        sub={content.heroSub}
        image={content.heroImage}
      />
      <section className="content-section shell">
        <div className="valuation-box">
          <p className="eyebrow">{content.boxKicker}</p>
          <h2>{content.boxTitle}</h2>
          <p className="prose">{content.boxBody}</p>
          <ContactForm valuation />
        </div>
      </section>
      <section className="content-section shell">
        <div className="section-title">
          <div>
            <p className="eyebrow">{content.contextKicker}</p>
            <h2>{content.contextTitle}</h2>
          </div>
          <p>{content.contextNote}</p>
        </div>
        <div className="three-col">
          {content.columns.map((column) => (
            <div className="prose" key={column.title}>
              <h3>{column.title}</h3>
              <p>{column.body}</p>
            </div>
          ))}
        </div>
      </section>
    </AveryChrome>
  );
}
