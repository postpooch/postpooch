import type { TemplatePageProps } from "../../../types";
import { toLuxuryPost } from "../../../blog-post-adapters";
import { LuxuryChrome } from "../../components/luxury-chrome";
import { PageHero, SectionHeading } from "../../components/ui";
import type { LuxurySettings } from "../../settings";

import type { LuxuryBlogContent } from "./schema";

export function LuxuryBlogPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<LuxuryBlogContent, LuxurySettings>) {
  const posts = blogPosts.map(toLuxuryPost);
  const [featured, ...rest] = posts;
  const heroImage = featured?.image || settings.hero.image;

  return (
    <LuxuryChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={heroImage}
      />
      <section className="section-pad">
        <SectionHeading
          eyebrow={content.sectionEyebrow}
          title={content.sectionTitle}
        />
        {featured ? (
          <article className="featured-post">
            {featured.image ? (
              <img src={featured.image} alt={featured.title} />
            ) : null}
            <div>
              <p className="eyebrow">
                {featured.category} · {featured.date}
              </p>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <a className="button" href={`/blog/${featured.slug}`}>
                Read Article
              </a>
            </div>
          </article>
        ) : (
          <p>No posts published yet.</p>
        )}
        {rest.length ? (
          <div className="post-grid blog-index">
            {rest.map((post) => (
              <article key={post.slug}>
                {post.image ? (
                  <a href={`/blog/${post.slug}`}>
                    <img src={post.image} alt={post.title} />
                  </a>
                ) : null}
                <p className="eyebrow">{post.category}</p>
                <h3>
                  <a href={`/blog/${post.slug}`}>{post.title}</a>
                </h3>
                <p>{post.excerpt}</p>
                <a className="text-link" href={`/blog/${post.slug}`}>
                  Read More
                </a>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </LuxuryChrome>
  );
}
