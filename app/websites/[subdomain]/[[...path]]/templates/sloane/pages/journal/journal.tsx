import type { TemplatePageProps } from "../../../types";
import { toSloanePost } from "../../../blog-post-adapters";
import { SloaneChrome } from "../../components/sloane-chrome";
import type { SloaneSettings } from "../../settings";

import type { SloaneJournalContent } from "./schema";

export function SloaneJournalPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<SloaneJournalContent, SloaneSettings>) {
  const posts = blogPosts.map(toSloanePost);

  return (
    <SloaneChrome site={site} settings={settings}>
      <section className="page-hero">
        <div className="inner">
          <div className="eyebrow">{content.eyebrow}</div>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </div>
      </section>
      <section className="section-pad wide">
        {posts.length ? (
          <div className="journal-grid">
            {posts.map((post) => (
              <a className="journal-card" href={`/journal/${post.slug}`} key={post.slug}>
                {post.image ? <img src={post.image} alt="" /> : null}
                <div className="meta">
                  {post.category} · {post.date}
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </a>
            ))}
          </div>
        ) : (
          <p className="muted">No posts published yet.</p>
        )}
      </section>
      <section className="newsletter-band">
        <div>
          <div className="eyebrow">{content.newsletterEyebrow}</div>
          <h2>{content.newsletterTitle}</h2>
        </div>
        <div>
          <p>{content.newsletterBody}</p>
          <form className="newsletter-form">
            <input aria-label="Email address" type="email" placeholder="Email address" />
            <button className="text-button" type="button">
              {content.newsletterCta} <span>↗</span>
            </button>
          </form>
        </div>
      </section>
    </SloaneChrome>
  );
}
