import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toVossPost } from "../../../blog-post-adapters";
import { VossChrome } from "../../components/voss-chrome";
import type { VossSettings } from "../../settings";

import type { VossJournalPostContent } from "./schema";

export function VossJournalPostPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<VossJournalPostContent, VossSettings>) {
  const post = blogPosts.map(toVossPost).find((item) => item.slug === params.slug);
  if (!post) notFound();

  return (
    <VossChrome site={site} settings={settings}>
      <main>
        <article className="journal-article">
          <header className="journal-article__header section-pad">
            <p className="eyebrow">
              {post.category} · {post.date}
            </p>
            <h1>{post.title}</h1>
            {post.excerpt ? <p className="journal-article__dek">{post.excerpt}</p> : null}
          </header>
          {post.image ? (
            <div className="journal-article__image">
              <img src={post.image} alt="" />
            </div>
          ) : null}
          <div className="journal-article__body section-pad">
            {post.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
            <a href="/journal" className="line-link">
              {content.backLabel} <span>↗</span>
            </a>
          </div>
        </article>
      </main>
    </VossChrome>
  );
}
