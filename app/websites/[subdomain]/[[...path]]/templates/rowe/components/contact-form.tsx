"use client";

import { type FormEvent, useState } from "react";

const DEFAULT_INTENTS = [
  "Buying",
  "Selling",
  "Private listing",
  "Portfolio advice",
  "New development",
  "Other",
];

type ContactFormProps = {
  intents?: string[];
  intentLabel?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
  successNote?: string;
};

export function ContactForm({
  intents = DEFAULT_INTENTS,
  intentLabel = "I’m interested in",
  messagePlaceholder = "Timing, neighborhood, property, price range, or just the question you’re trying to solve.",
  submitLabel = "Send inquiry",
  successNote = "Thanks — this demo form is working on the front end. Connect it to your CRM, Formspree, HubSpot, or server action before launch.",
}: ContactFormProps) {
  const [intent, setIntent] = useState(intents[0] ?? "Buying");
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-intents">
        <span className="field-label">{intentLabel}</span>
        <div className="intent-list">
          {intents.map((item) => (
            <button
              key={item}
              type="button"
              className={intent === item ? "active" : ""}
              onClick={() => setIntent(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="form-row">
        <label>
          First name
          <input required name="firstName" />
        </label>
        <label>
          Last name
          <input required name="lastName" />
        </label>
      </div>
      <div className="form-row">
        <label>
          Email
          <input required name="email" type="email" />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" />
        </label>
      </div>
      <label>
        What should I know?
        <textarea
          name="message"
          rows={5}
          placeholder={messagePlaceholder}
        />
      </label>
      <input type="hidden" name="intent" value={intent} />
      <button className="submit-button" type="submit">
        {submitLabel} <span>↗</span>
      </button>
      {sent && <p className="success-note">{successNote}</p>}
    </form>
  );
}
