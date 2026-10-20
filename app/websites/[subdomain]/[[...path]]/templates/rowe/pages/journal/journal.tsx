import type { TemplatePageProps } from "../../../types";
import { toRoweEntry } from "../../../blog-post-adapters";
import { RoweChrome } from "../../components/rowe-chrome";
import type { RoweSettings } from "../../settings";

import type { RoweJournalContent } from "./schema";

export function RoweJournalPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<RoweJournalContent, RoweSettings>) {
  const entries = blogPosts.map(toRoweEntry);

  return (
    <RoweChrome site={site} settings={settings}>
      <section className="page-hero">
        <div className="page-hero-label">{content.label}</div>
        <h1>
          {content.titleLine1}
          <br />
          <em>{content.titleEmphasis}</em>
        </h1>
        <p>{content.deck}</p>
      </section>
      <section className="journal-index section-pad">
        {entries.length ? (
          entries.map((item, index) => (
            <a
              className={`journal-row ${index === 0 ? "lead" : ""}`}
              key={item.slug}
              href={`/journal/${item.slug}`}
            >
              {item.image ? (
                <div className="journal-row-image">
                  <img src={item.image} alt={content.imageAlt} />
                </div>
              ) : null}
              <div className="journal-row-meta">
                <span>{item.category}</span>
                <span>{item.date}</span>
              </div>
              <div className="journal-row-copy">
                <h2>{item.title}</h2>
                <p>{item.dek}</p>
              </div>
              <span className="journal-arrow">↗</span>
            </a>
          ))
        ) : (
          <p>No posts published yet.</p>
        )}
      </section>
    </RoweChrome>
  );
}
