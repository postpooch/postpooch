import type { TemplatePageProps } from "../../../types";
import { toArdenPost } from "../../../blog-post-adapters";
import { images } from "../../catalog-defaults";
import { ArdenChrome } from "../../components/arden-chrome";
import { Hero } from "../../components/ui";
import type { ArdenSettings } from "../../settings";

import type { ArdenJournalContent } from "./schema";

export function ArdenJournalPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<ArdenJournalContent, ArdenSettings>) {
  const posts = blogPosts.map(toArdenPost);

  return (
    <ArdenChrome site={site} settings={settings}>
      <Hero
        height="medium"
        image={content.heroImage ?? images.pool}
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />
      <section className="section">
        {posts.length ? (
          <div className="journalGrid">
            {posts.map((post) => (
              <a className="postCard" href={`/blog/${post.slug}`} key={post.slug}>
                {post.image ? (
                  <div className="image">
                    <img src={post.image} alt="" />
                  </div>
                ) : null}
                <p className="postMeta">
                  {post.category} · {post.date}
                </p>
                <h2>{post.title}</h2>
                <p>{post.dek}</p>
              </a>
            ))}
          </div>
        ) : (
          <div className="emptyState">No posts published yet.</div>
        )}
      </section>
    </ArdenChrome>
  );
}
