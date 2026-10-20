"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return <p>You&apos;re on the private list.</p>;
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <input aria-label="Email" placeholder="Email address" type="email" required />
      <button aria-label="Submit" type="submit">
        →
      </button>
    </form>
  );
}
