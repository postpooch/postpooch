import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toRowanPost } from "../../../blog-post-adapters";
import { RowanChrome } from "../../components/rowan-chrome";
import type { RowanSettings } from "../../settings";

import type { RowanJournalPostContent } from "./schema";

export function RowanJournalPostPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<RowanJournalPostContent, RowanSettings>) {
  const post = blogPosts.map(toRowanPost).find((item) => item.slug === params.slug);
  if (!post) notFound();

  return (
    <RowanChrome site={site} settings={settings} darkHeader>
      <article className="journal-article">
        <header className="legal-hero">
          <div className="shell">
            <p className="eyebrow">{post.date}</p>
            <h1>{post.title}</h1>
            {post.excerpt ? <p>{post.excerpt}</p> : null}
          </div>
        </header>
        <section className="legal-content section-pad">
          <div className="shell legal-content__inner">
            <aside>
              <p>{settings.agent.name}</p>
              <a className="text-link" href="/journal">
                {content.backLabel}
              </a>
            </aside>
            <div>
              {post.body.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      </article>
    </RowanChrome>
  );
}
