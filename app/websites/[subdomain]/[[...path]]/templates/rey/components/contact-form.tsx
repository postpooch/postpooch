"use client";

import { useState } from "react";

type ContactFormProps = {
  submitLabel: string;
  light?: boolean;
};

export function ContactForm({ submitLabel, light = false }: ContactFormProps) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p>
        Thank you. We will be in touch shortly.
      </p>
    );
  }

  return (
    <form
      className="contact-form"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <div className="form-row">
        <label>
          First name
          <input type="text" name="firstName" placeholder="First name" />
        </label>
        <label>
          Last name
          <input type="text" name="lastName" placeholder="Last name" />
        </label>
      </div>
      <div className="form-row">
        <label>
          Email
          <input type="email" name="email" placeholder="Email address" />
        </label>
        <label>
          Phone
          <input type="tel" name="phone" placeholder="Phone number" />
        </label>
      </div>
      <label>
        Message
        <textarea name="message" placeholder="How can we help?" rows={4} />
      </label>
      <button
        className={`button ${light ? "button--light" : ""}`}
        type="submit"
      >
        {submitLabel} <span>↗</span>
      </button>
    </form>
  );
}
