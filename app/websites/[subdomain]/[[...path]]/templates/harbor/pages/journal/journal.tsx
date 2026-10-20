import type { TemplatePageProps } from "../../../types";
import { toHarborPost } from "../../../blog-post-adapters";
import { HarborChrome } from "../../components/harbor-chrome";
import type { HarborSettings } from "../../settings";

import type { HarborJournalContent } from "./schema";

export function HarborJournalPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<HarborJournalContent, HarborSettings>) {
  const posts = blogPosts.map(toHarborPost);

  return (
    <HarborChrome site={site} settings={settings}>
      <section className="archive-hero shell">
        <p className="kicker">{content.heroKicker}</p>
        <h1>
          {content.heroTitleBefore} <em>{content.heroTitleItalic}</em>
        </h1>
        <p>{content.heroBody}</p>
      </section>
      <section className="journal-list shell section-pad">
        {posts.length ? (
          posts.map((post, index) => (
            <a
              href={`/journal/${post.slug}`}
              className="journal-row"
              key={post.slug}
            >
              <span>0{index + 1}</span>
              {post.image ? <img src={post.image} alt="" /> : null}
              <div>
                <p className="kicker">
                  {post.category} · {post.date}
                </p>
                <h2>{post.title}</h2>
                <p>{post.dek}</p>
              </div>
              <b>↗</b>
            </a>
          ))
        ) : (
          <p>No posts published yet.</p>
        )}
      </section>
    </HarborChrome>
  );
}
