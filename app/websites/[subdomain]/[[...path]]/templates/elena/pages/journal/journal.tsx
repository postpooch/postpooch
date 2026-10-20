import type { TemplatePageProps } from "../../../types";
import { toElenaPost } from "../../../blog-post-adapters";
import { ElenaChrome } from "../../components/elena-chrome";
import type { ElenaSettings } from "../../settings";

import type { ElenaJournalContent } from "./schema";

export function ElenaJournalPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<ElenaJournalContent, ElenaSettings>) {
  const posts = blogPosts.map(toElenaPost);

  return (
    <ElenaChrome site={site} settings={settings}>
      <main>
        <section className="journal-section journal-archive section-shell">
          <div className="journal-head">
            <div>
              <div className="section-label">{content.label}</div>
              <h2>{content.title}</h2>
            </div>
            <p>{content.subtext}</p>
          </div>
          {posts.length ? (
            <div className="journal-grid">
              {posts.map((entry, index) => (
                <a className="journal-card" href={`/journal/${entry.slug}`} key={entry.slug}>
                  <span className="journal-index">0{index + 1}</span>
                  <div>
                    <p className="eyebrow">{entry.date}</p>
                    <h3>{entry.title}</h3>
                    <p>{entry.excerpt || entry.text}</p>
                  </div>
                  <span className="journal-arrow">↗</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="journal-empty">No posts published yet.</p>
          )}
        </section>
      </main>
    </ElenaChrome>
  );
}
