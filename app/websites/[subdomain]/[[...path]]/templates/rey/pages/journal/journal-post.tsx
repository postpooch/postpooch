import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toReyPost } from "../../../blog-post-adapters";
import { ReyChrome } from "../../components/rey-chrome";
import { ContactBand } from "../../components/site-footer";
import { ArrowLink } from "../../components/ui";
import type { ReySettings } from "../../settings";

import type { ReyJournalPostContent } from "./schema";

export function ReyJournalPostPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<ReyJournalPostContent, ReySettings>) {
  const post = blogPosts.map(toReyPost).find((item) => item.slug === params.slug);
  if (!post) notFound();

  return (
    <ReyChrome site={site} settings={settings}>
      <article className="journal-article">
        <header className="journal-article__hero">
          <span className="eyebrow">{post.date}</span>
          <h1>{post.title}</h1>
          {post.excerpt ? <p>{post.excerpt}</p> : null}
        </header>
        <div className="journal-article__body">
          {post.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
          <ArrowLink href="/journal">{content.backLabel}</ArrowLink>
        </div>
      </article>
      <ContactBand settings={settings} />
    </ReyChrome>
  );
}
