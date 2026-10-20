"use client";

import { type FormEvent, useState } from "react";

type LeadFormProps = {
  compact?: boolean;
  label?: string;
};

export function LeadForm({
  compact = false,
  label = "Send inquiry",
}: LeadFormProps) {
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="form-success">
        Thanks — your note is ready for the agent’s CRM integration.
      </div>
    );
  }

  return (
    <form
      className={`lead-form ${compact ? "compact" : ""}`}
      onSubmit={submit}
    >
      <label>
        <span>Name</span>
        <input required name="name" placeholder="Your name" />
      </label>
      <label>
        <span>Email</span>
        <input required name="email" type="email" placeholder="you@email.com" />
      </label>
      {!compact && (
        <label>
          <span>Phone</span>
          <input name="phone" type="tel" placeholder="(416) 555-0123" />
        </label>
      )}
      <label className={compact ? "" : "full"}>
        <span>{compact ? "What can I help with?" : "Message"}</span>
        <textarea
          required
          name="message"
          rows={compact ? 1 : 4}
          placeholder="Tell me a little about your move…"
        />
      </label>
      <button className="button button-light" type="submit">
        {label} <span>↗</span>
      </button>
    </form>
  );
}
