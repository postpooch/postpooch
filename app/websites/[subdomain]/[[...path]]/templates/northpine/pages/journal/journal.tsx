import type { TemplatePageProps } from "../../../types";
import { toNorthpinePost } from "../../../blog-post-adapters";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import { PostCard } from "../../components/ui";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineJournalContent } from "./schema";

export function NorthpineJournalPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<NorthpineJournalContent, NorthpineSettings>) {
  const posts = blogPosts.map(toNorthpinePost);

  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <section className="section-pad container wide">
        {posts.length ? (
          <div className="post-grid large">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p>No posts published yet.</p>
        )}
      </section>
    </NorthpineInnerPage>
  );
}
