import type { HarborTestimonial } from "../settings";

type TestimonialStripProps = {
  testimonials: HarborTestimonial[];
  kicker?: string;
  title?: string;
  italic?: string;
};

export function TestimonialStrip({
  testimonials,
  kicker = "Client notes",
  title = "Good advice should feel",
  italic = "personal.",
}: TestimonialStripProps) {
  const featured = testimonials.slice(0, 3);

  return (
    <section className="testimonials section-pad">
      <div className="shell">
        <div className="section-head">
          <p className="kicker">{kicker}</p>
          <h2>
            {title} <em>{italic}</em>
          </h2>
        </div>
        <div className="testimonial-grid">
          {featured.map((t, i) => (
            <article key={t.name} className="testimonial-card">
              <span className="quote-mark">“</span>
              <p>{t.quote}</p>
              <div>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
              <small>0{i + 1}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
