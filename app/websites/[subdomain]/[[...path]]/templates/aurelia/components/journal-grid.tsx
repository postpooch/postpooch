import type { AureliaArticle } from "../settings";

type JournalGridProps = {
  items: readonly AureliaArticle[];
};

export function JournalGrid({ items }: JournalGridProps) {
  return (
    <div className="journal-grid">
      {items.map((article, index) => (
        <a
          className={index === 0 ? "journal-card featured-journal" : "journal-card"}
          href={`/journal/${article.slug}`}
          key={article.slug}
        >
          {article.image ? <img src={article.image} alt="" /> : null}
          <div className="journal-card-copy">
            <div className="journal-meta">
              <span>{article.category}</span>
              <span>{article.date}</span>
            </div>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <span className="read-link">Read article →</span>
          </div>
        </a>
      ))}
    </div>
  );
}
