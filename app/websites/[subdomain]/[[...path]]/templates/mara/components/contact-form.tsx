"use client";

import { type FormEvent, useState } from "react";

type ContactFormProps = {
  compact?: boolean;
  title?: string;
};

export function ContactForm({
  compact = false,
  title = "Tell me what you’re considering.",
}: ContactFormProps) {
  const [sent, setSent] = useState(false);

  return (
    <div className={`contactFormWrap ${compact ? "compact" : ""}`}>
      {!compact ? (
        <>
          <p className="eyebrow">Private consultation</p>
          <h2>{title}</h2>
        </>
      ) : null}
      <form
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <div className="fieldRow">
          <label>
            <span>Name</span>
            <input required name="name" placeholder="Your name" />
          </label>
          <label>
            <span>Email</span>
            <input required type="email" name="email" placeholder="you@email.com" />
          </label>
        </div>
        <div className="fieldRow">
          <label>
            <span>Phone</span>
            <input name="phone" placeholder="Optional" />
          </label>
          <label>
            <span>I’m interested in</span>
            <select name="interest" defaultValue="">
              <option value="" disabled>
                Select one
              </option>
              <option>Buying</option>
              <option>Selling</option>
              <option>Both</option>
              <option>Market advice</option>
            </select>
          </label>
        </div>
        <label>
          <span>Tell me a little more</span>
          <textarea
            name="message"
            rows={compact ? 3 : 5}
            placeholder="Timing, location, property, priorities…"
          />
        </label>
        <button className="button dark" type="submit">
          {sent ? "Thank you — message noted" : "Request a conversation"}
        </button>
        <p className="formNote">
          Demo form only. Connect this form to your CRM, email provider, or form
          endpoint before launch.
        </p>
      </form>
    </div>
  );
}
