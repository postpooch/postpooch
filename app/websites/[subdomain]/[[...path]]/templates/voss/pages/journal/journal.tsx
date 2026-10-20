import type { TemplatePageProps } from "../../../types";
import { toVossPost } from "../../../blog-post-adapters";
import { VossChrome } from "../../components/voss-chrome";
import type { VossSettings } from "../../settings";

import type { VossJournalContent } from "./schema";

export function VossJournalPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<VossJournalContent, VossSettings>) {
  const posts = blogPosts.map(toVossPost);

  return (
    <VossChrome site={site} settings={settings}>
      <main>
        <section className="page-hero page-hero--journal">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>
            {content.titleLine1}
            <br />
            <em>{content.titleEmphasis}</em>
          </h1>
        </section>
        <section className="journal-list section-pad section-pad--topless">
          {posts.length ? (
            posts.map((post, index) => (
              <a className="journal-card" href={`/journal/${post.slug}`} key={post.slug}>
                {post.image ? (
                  <div className="journal-card__image">
                    <img src={post.image} alt="" loading="lazy" />
                    <span>0{index + 1}</span>
                  </div>
                ) : (
                  <div className="journal-card__image journal-card__image--plain">
                    <span>0{index + 1}</span>
                  </div>
                )}
                <div className="journal-card__copy">
                  <div>
                    <span>{post.category}</span>
                    <span>{post.date}</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt || content.cardExcerpt}</p>
                  <span className="line-link">
                    {content.readLabel} <span>↗</span>
                  </span>
                </div>
              </a>
            ))
          ) : (
            <p>No posts published yet.</p>
          )}
        </section>
      </main>
    </VossChrome>
  );
}
