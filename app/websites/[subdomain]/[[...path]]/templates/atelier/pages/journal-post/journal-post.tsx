import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toAtelierPost } from "../../../blog-post-adapters";
import { AtelierChrome } from "../../components/atelier-chrome";
import type { AtelierSettings } from "../../settings";

import type { AtelierJournalPostContent } from "./schema";

export function AtelierJournalPostPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<AtelierJournalPostContent, AtelierSettings>) {
  const article = blogPosts.map(toAtelierPost).find((item) => item.slug === params.slug);
  if (!article) notFound();

  return (
    <AtelierChrome site={site} settings={settings}>
      <article className="articlePage">
        <header className="articleHeader shell">
          <p className="kicker">
            {article.category} · {article.date}
          </p>
          <h1>{article.title}</h1>
          <p className="articleDek">{article.excerpt}</p>
        </header>
        {article.image ? (
        <div
          className="articleHero"
          style={{ backgroundImage: `url("${article.image}")` }}
        />
        ) : null}
        <div className="articleBody">
          {article.body.map((section, index) => (
            <section key={`${section.heading}-${index}`}>
              {section.heading ? <h2>{section.heading}</h2> : null}
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p
                  key={paragraph}
                  className={index === 0 && paragraphIndex === 0 ? "dropcap" : undefined}
                >
                  {paragraph}
                </p>
              ))}
              {index === 1 && article.quote ? (
                <blockquote>{article.quote}</blockquote>
              ) : null}
            </section>
          ))}
          <div className="articleEnd">
            <span>{settings.brand.siteName} · The Edit</span>
            <a href="/journal">{content.backLabel}</a>
          </div>
        </div>
      </article>
    </AtelierChrome>
  );
}
