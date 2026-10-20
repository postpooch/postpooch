import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/contact-form";
import { EditorialHero } from "../../components/editorial-hero";
import { MaraChrome } from "../../components/mara-chrome";
import type { MaraSettings } from "../../settings";

import type { MaraValuationContent } from "./schema";

export function MaraValuationPage({
  site,
  settings,
  content,
}: TemplatePageProps<MaraValuationContent, MaraSettings>) {
  return (
    <MaraChrome site={site} settings={settings}>
      <EditorialHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        copy={content.heroCopy}
        image={content.heroImage}
      />
      <section className="introSplit section">
        <p className="eyebrow">{content.introEyebrow}</p>
        <div>
          <h2>{content.introTitle}</h2>
          <p>{content.introBody}</p>
        </div>
      </section>
      <section className="process section">
        {content.blocks.map((b) => (
          <article key={b.number}>
            <span>{b.number}</span>
            <h3>{b.title}</h3>
            <p>{b.copy}</p>
          </article>
        ))}
      </section>
      <section className="formSection section">
        <ContactForm title={content.formTitle} />
      </section>
    </MaraChrome>
  );
}
