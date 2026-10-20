import type { TemplatePageProps } from "../../../types";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineTestimonialsContent } from "./schema";

export function NorthpineTestimonialsPage({
  site,
  settings,
  content,
}: TemplatePageProps<NorthpineTestimonialsContent, NorthpineSettings>) {
  const stories = [...settings.catalog.testimonials, ...settings.catalog.testimonials];

  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <section className="section-pad container">
        <div className="testimonial-grid">
          {stories.map((story, index) => (
            <article key={`${story.name}-${index}`}>
              <div className="stars">★★★★★</div>
              <blockquote>“{story.quote}”</blockquote>
              <p>
                <b>{story.name}</b>
                <br />
                {story.detail}
              </p>
            </article>
          ))}
        </div>
      </section>
    </NorthpineInnerPage>
  );
}
