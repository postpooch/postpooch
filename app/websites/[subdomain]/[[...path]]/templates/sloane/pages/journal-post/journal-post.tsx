import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toSloanePost } from "../../../blog-post-adapters";
import { SloaneChrome } from "../../components/sloane-chrome";
import type { SloaneSettings } from "../../settings";

import type { SloaneJournalPostContent } from "./schema";

export function SloaneJournalPostPage({
  site,
  settings,
  params,
  blogPosts,
}: TemplatePageProps<SloaneJournalPostContent, SloaneSettings>) {
  const post = blogPosts.map(toSloanePost).find((item) => item.slug === params.slug);
  if (!post) notFound();

  return (
    <SloaneChrome site={site} settings={settings}>
      <article>
        <div className="article-shell">
          <div className="article-meta">
            {post.category} · {post.date}
          </div>
          <h1>{post.title}</h1>
          <p className="lead">{post.excerpt}</p>
        </div>
        {post.image ? <img className="article-image" src={post.image} alt="" /> : null}
        <div className="article-shell article-body">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </SloaneChrome>
  );
}
