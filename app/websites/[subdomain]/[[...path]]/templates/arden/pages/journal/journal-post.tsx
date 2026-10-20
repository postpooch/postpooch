import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toArdenPost } from "../../../blog-post-adapters";
import { ArdenChrome } from "../../components/arden-chrome";
import type { ArdenSettings } from "../../settings";

import type { ArdenJournalPostContent } from "./schema";

export function ArdenJournalPostPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<ArdenJournalPostContent, ArdenSettings>) {
  const post = blogPosts.map(toArdenPost).find((item) => item.slug === params.slug);
  if (!post) notFound();

  return (
    <ArdenChrome site={site} settings={settings}>
      <article>
        <header className="articleHero">
          <p className="eyebrow">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="dek">{post.dek}</p>
          <p className="postMeta">
            {content.byline} · {post.date}
          </p>
        </header>
        {post.image ? (
          <div className="articleImage">
            <img src={post.image} alt="" />
          </div>
        ) : null}
        <div className="articleBody">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </ArdenChrome>
  );
}
