"use client";

import { useState } from "react";

export function NewsletterInlineForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return <p>You&apos;re on the private list.</p>;
  }

  return (
    <form
      className="inline-form"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <input type="email" placeholder="Email address" aria-label="Email address" required />
      <button type="submit" aria-label="Subscribe">
        →
      </button>
    </form>
  );
}

export function NewsletterBlock() {
  const [sent, setSent] = useState(false);

  return (
    <section className="newsletter">
      <div className="shell narrow">
        <p className="eyebrow">Stay in the know</p>
        <h2>New York, in your inbox.</h2>
        <p>
          A concise edit of meaningful listings, market shifts, and design worth noticing.
        </p>
        {sent ? (
          <p>You&apos;re on the private list.</p>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <input placeholder="Your name" aria-label="Your name" />
            <input type="email" placeholder="Email address" aria-label="Email address" required />
            <button className="button dark-button" type="submit">
              Subscribe <span>→</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
