import type { HarborProcessStep } from "../settings";

type ProcessProps = {
  title: string;
  italic: string;
  items: HarborProcessStep[];
  kicker?: string;
  intro?: string;
};

export function Process({
  title,
  italic,
  items,
  kicker = "The approach",
  intro = "Clear milestones, thoughtful preparation, and experienced representation from the first conversation through closing day.",
}: ProcessProps) {
  return (
    <section className="process section-pad shell">
      <div className="section-head split">
        <div>
          <p className="kicker">{kicker}</p>
          <h2>
            {title} <em>{italic}</em>
          </h2>
        </div>
        <p>{intro}</p>
      </div>
      <div className="process-list">
        {items.map((item) => (
          <article key={item.n}>
            <span>{item.n}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
