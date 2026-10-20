import type { TemplatePageProps } from "../../../types";
import { toCoastalPost } from "../../../blog-post-adapters";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PageHero } from "../../components/page-hero";
import type { CoastalSettings } from "../../settings";

import type { CoastalJournalContent } from "./schema";

export function CoastalJournalPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<CoastalJournalContent, CoastalSettings>) {
  const posts = blogPosts.map(toCoastalPost);

  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} image={content.heroImage} />
      <section className="section cream journalGrid">
        {posts.length ? (
          posts.map((post) => (
            <article key={post.slug}>
              {post.image ? (
                <a
                  href={`/blog/${post.slug}`}
                  className="journalImage"
                  style={{ backgroundImage: `url(${post.image})` }}
                />
              ) : null}
              <p>{post.date}</p>
              <h2>
                <a href={`/blog/${post.slug}`}>{post.title}</a>
              </h2>
              <p>{post.excerpt}</p>
              <a href={`/blog/${post.slug}`} className="textLink">
                {content.readLabel}
              </a>
            </article>
          ))
        ) : (
          <p>No posts published yet.</p>
        )}
      </section>
    </CoastalChrome>
  );
}
