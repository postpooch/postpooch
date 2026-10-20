import type { TemplatePageProps } from "../../../types";
import { EditorialHero } from "../../components/editorial-hero";
import { MaraChrome } from "../../components/mara-chrome";
import type { MaraSettings } from "../../settings";

import type { MaraReviewsContent } from "./schema";

export function MaraReviewsPage({
  site,
  settings,
  content,
}: TemplatePageProps<MaraReviewsContent, MaraSettings>) {
  const { testimonials } = settings.catalog;
  const cards = [...testimonials, ...testimonials];

  return (
    <MaraChrome site={site} settings={settings}>
      <EditorialHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        copy={content.heroCopy}
        image={content.heroImage}
      />
      <section className="section">
        <div className="reviewGrid">
          {cards.map((t, i) => (
            <article className="reviewCard" key={`${t.name}-${i}`}>
              <blockquote>“{t.quote}”</blockquote>
              <p>
                {t.name}
                <br />
                {t.type}
              </p>
            </article>
          ))}
        </div>
      </section>
    </MaraChrome>
  );
}
