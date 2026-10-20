"use client";

import { useState } from "react";

type NewsletterProps = {
  eyebrow: string;
  description: string;
  successMessage: string;
};

export function Newsletter({
  eyebrow,
  description,
  successMessage,
}: NewsletterProps) {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="newsletter"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <p className="eyebrow">{eyebrow}</p>
      <p>{sent ? successMessage : description}</p>
      {!sent && (
        <div className="newsletter-row">
          <input
            required
            type="email"
            placeholder="Email address"
            aria-label="Email address"
          />
          <button type="submit">Join ↗</button>
        </div>
      )}
    </form>
  );
}
