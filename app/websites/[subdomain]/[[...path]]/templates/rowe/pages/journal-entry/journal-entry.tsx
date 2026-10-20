import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toRoweEntry } from "../../../blog-post-adapters";
import { RoweChrome } from "../../components/rowe-chrome";
import type { RoweSettings } from "../../settings";

import type { RoweJournalEntryContent } from "./schema";

export function RoweJournalEntryPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<RoweJournalEntryContent, RoweSettings>) {
  const item = blogPosts.map(toRoweEntry).find((entry) => entry.slug === params.slug);
  if (!item) notFound();

  return (
    <RoweChrome site={site} settings={settings}>
      <article className="article">
        <header>
          <div className="page-hero-label">
            {item.category} / {item.date}
          </div>
          <h1>{item.title}</h1>
          <p>{item.dek}</p>
        </header>
        {item.image ? (
          <div className="article-image">
            <img src={item.image} alt={content.imageAlt} />
          </div>
        ) : null}
        <div className="article-body">
          <div className="article-aside">
            <span>{content.writtenByLabel}</span>
            <strong>{settings.agent.name}</strong>
            <span>{settings.agent.role}</span>
          </div>
          <div className="article-copy">
            {item.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <div className="article-rule" />
            <p className="article-note">{content.editorialNote}</p>
            <a href={content.backHref} className="text-arrow">
              {content.backLabel} <span>↗</span>
            </a>
          </div>
        </div>
      </article>
    </RoweChrome>
  );
}
