import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toElenaPost } from "../../../blog-post-adapters";
import { ElenaChrome } from "../../components/elena-chrome";
import type { ElenaSettings } from "../../settings";

import type { ElenaJournalPostContent } from "./schema";

export function ElenaJournalPostPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<ElenaJournalPostContent, ElenaSettings>) {
  const post = blogPosts.map(toElenaPost).find((item) => item.slug === params.slug);
  if (!post) notFound();

  return (
    <ElenaChrome site={site} settings={settings}>
      <main>
        <article className="journal-article section-shell">
          <p className="eyebrow">{post.date}</p>
          <h1>{post.title}</h1>
          {post.excerpt ? <p className="journal-article__dek">{post.excerpt}</p> : null}
          <div className="journal-article__body">
            {post.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <a className="underlined-link" href="/journal">
            {content.backLabel}
          </a>
        </article>
      </main>
    </ElenaChrome>
  );
}
