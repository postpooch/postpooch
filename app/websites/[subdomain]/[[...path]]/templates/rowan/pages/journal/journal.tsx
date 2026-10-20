import type { TemplatePageProps } from "../../../types";
import { toRowanPost } from "../../../blog-post-adapters";
import { RowanChrome } from "../../components/rowan-chrome";
import type { RowanSettings } from "../../settings";

import type { RowanJournalContent } from "./schema";

export function RowanJournalPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<RowanJournalContent, RowanSettings>) {
  const posts = blogPosts.map(toRowanPost);

  return (
    <RowanChrome site={site} settings={settings} darkHeader>
      <section className="listings-hero">
        <div className="shell listings-hero__inner">
          <p className="eyebrow eyebrow--light">{content.eyebrow}</p>
          <h1>
            {content.title} <em>{content.titleEmphasis}</em>
          </h1>
          <div className="listings-hero__meta">
            <p>{content.meta}</p>
            <span>{String(posts.length).padStart(2, "0")} notes</span>
          </div>
        </div>
      </section>
      <section className="journal-index section-pad">
        <div className="shell">
          {posts.length ? (
            posts.map((post, index) => (
              <a className="journal-row" href={`/journal/${post.slug}`} key={post.slug}>
                <span>0{index + 1}</span>
                <div>
                  <small>{post.date}</small>
                  <h2>{post.title}</h2>
                  {post.excerpt ? <p>{post.excerpt}</p> : null}
                </div>
                <b>↗</b>
              </a>
            ))
          ) : (
            <p>{content.emptyLabel}</p>
          )}
        </div>
      </section>
    </RowanChrome>
  );
}
