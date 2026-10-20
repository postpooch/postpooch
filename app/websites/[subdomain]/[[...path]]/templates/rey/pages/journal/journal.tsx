import type { TemplatePageProps } from "../../../types";
import { toReyPost } from "../../../blog-post-adapters";
import { ReyChrome } from "../../components/rey-chrome";
import { ContactBand } from "../../components/site-footer";
import { PageHero } from "../../components/ui";
import type { ReySettings } from "../../settings";

import type { ReyJournalContent } from "./schema";

export function ReyJournalPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<ReyJournalContent, ReySettings>) {
  const posts = blogPosts.map(toReyPost);

  return (
    <ReyChrome site={site} settings={settings}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} />
      <section className="journal-index">
        {posts.length ? (
          posts.map((post) => (
            <a className="journal-row" href={`/journal/${post.slug}`} key={post.slug}>
              <span className="journal-row__date">{post.date}</span>
              <div>
                <h3>{post.title}</h3>
                {post.excerpt ? <p>{post.excerpt}</p> : null}
              </div>
              <span className="journal-row__arrow">↗</span>
            </a>
          ))
        ) : (
          <p className="journal-empty">{content.emptyLabel}</p>
        )}
      </section>
      <ContactBand settings={settings} />
    </ReyChrome>
  );
}
