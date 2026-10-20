import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toNorthpinePost } from "../../../blog-post-adapters";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineJournalPostContent } from "./schema";

export function NorthpineJournalPostPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<NorthpineJournalPostContent, NorthpineSettings>) {
  const post = blogPosts.map(toNorthpinePost).find((item) => item.slug === params.slug);
  if (!post) notFound();

  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={post.title}
      subtitle={post.excerpt}
      image={post.image || settings.images.cabin}
      current={post.title}
    >
      <article className="section-pad container article">
        <span className="eyebrow">
          {post.date} · {content.readTime}
        </span>
        <p className="lead">{post.lead}</p>
        {post.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {post.sections.map((section) => (
          <div key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </div>
        ))}
        <a href={content.ctaHref} className="btn btn-dark">
          {content.ctaLabel}
        </a>
      </article>
    </NorthpineInnerPage>
  );
}
