"use client";

import { useState } from "react";

export function LeadForm({
  title = "Tell us a little about what you need",
  kind,
}: {
  title?: string;
  kind?: "worth" | "dream" | "relocate";
}) {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="lead-form"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <h2>{title}</h2>
      <div className="field-row">
        <label>
          First name
          <input required />
        </label>
        <label>
          Last name
          <input required />
        </label>
      </div>
      <label>
        Email
        <input required type="email" />
      </label>
      <label>
        Phone
        <input />
      </label>
      {kind === "worth" ? (
        <>
          <label>
            Property address
            <input required />
          </label>
          <div className="field-row">
            <label>
              Bedrooms
              <input />
            </label>
            <label>
              Bathrooms
              <input />
            </label>
          </div>
        </>
      ) : null}
      {kind === "dream" ? (
        <>
          <label>
            Preferred area
            <input placeholder="Blue Ridge, Aska, lake..." />
          </label>
          <div className="field-row">
            <label>
              Budget
              <input />
            </label>
            <label>
              Timing
              <select>
                <option>0–3 months</option>
                <option>3–6 months</option>
                <option>6–12 months</option>
                <option>Just exploring</option>
              </select>
            </label>
          </div>
        </>
      ) : null}
      {kind === "relocate" ? (
        <>
          <label>
            Moving from
            <input />
          </label>
          <label>
            Target move date
            <input type="date" />
          </label>
        </>
      ) : null}
      <label>
        Message
        <textarea rows={5} />
      </label>
      <button className="btn btn-dark" type="submit">
        {sent ? "Thanks — we'll be in touch ✓" : "Submit"}
      </button>
    </form>
  );
}

export function LoginCard() {
  return (
    <div className="login-card">
      <h2>Welcome back</h2>
      <label>
        Email
        <input type="email" />
      </label>
      <label>
        Password
        <input type="password" />
      </label>
      <button className="btn btn-dark" type="button">
        Sign In
      </button>
      <p>
        New here? <a href="/contact">Create an account</a>
      </p>
    </div>
  );
}

export function Checklist({
  sections,
}: {
  sections: ReadonlyArray<{ title: string; items: readonly string[] }>;
}) {
  return (
    <section className="section-pad container article checklist">
      {sections.map((section) => (
        <div key={section.title}>
          <h2>{section.title}</h2>
          {section.items.map((item) => (
            <label key={item}>
              <input type="checkbox" />
              {item}
            </label>
          ))}
        </div>
      ))}
    </section>
  );
}
