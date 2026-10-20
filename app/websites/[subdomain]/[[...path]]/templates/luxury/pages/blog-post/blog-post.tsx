import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toLuxuryPost } from "../../../blog-post-adapters";
import { LuxuryChrome } from "../../components/luxury-chrome";
import type { LuxurySettings } from "../../settings";

import type { LuxuryBlogPostContent } from "./schema";

export function LuxuryBlogPostPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<LuxuryBlogPostContent, LuxurySettings>) {
  const post = blogPosts.map(toLuxuryPost).find((item) => item.slug === params.slug);
  if (!post) notFound();

  return (
    <LuxuryChrome site={site} settings={settings}>
      <article className="article-page">
        <header>
          <p className="eyebrow">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="article-excerpt">{post.excerpt}</p>
          <div>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
            <span>By {settings.realtor.name}</span>
          </div>
        </header>
        {post.image ? (
          <img className="article-hero" src={post.image} alt={post.title} />
        ) : null}
        <div className="article-body">
          {post.body.map((section) => (
            <section key={section.heading}>
              {section.heading ? <h2>{section.heading}</h2> : null}
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
          <div className="article-cta">
            <h2>{content.ctaTitle}</h2>
            <p>{content.ctaText}</p>
            <a className="button" href="/contact">
              {content.ctaLabel}
            </a>
          </div>
        </div>
      </article>
    </LuxuryChrome>
  );
}
