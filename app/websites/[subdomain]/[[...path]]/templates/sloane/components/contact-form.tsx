"use client";

import { useState, type FormEvent } from "react";

type ContactFormProps = {
  compact?: boolean;
  title?: string;
};

export function ContactForm({ compact = false, title = "Start a conversation" }: ContactFormProps) {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="form-success">
        <span>Thank you.</span>
        <p>Your inquiry has been received. This demo form does not send data.</p>
      </div>
    );
  }

  return (
    <form className={`contact-form ${compact ? "compact" : ""}`} onSubmit={submit}>
      {title ? <h3>{title}</h3> : null}
      <div className="form-grid">
        <label>
          <span>Name</span>
          <input required name="name" />
        </label>
        <label>
          <span>Email</span>
          <input required type="email" name="email" />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" />
        </label>
        {compact ? null : (
          <label>
            <span>Property / Area</span>
            <input name="property" />
          </label>
        )}
      </div>
      {compact ? null : (
        <label className="full-field">
          <span>Message</span>
          <textarea name="message" rows={5} />
        </label>
      )}
      <label className="consent">
        <input type="checkbox" />
        <span>I agree to be contacted about real estate services. Message and data rates may apply.</span>
      </label>
      <button className="text-button" type="submit">
        Send Inquiry <span>↗</span>
      </button>
    </form>
  );
}
