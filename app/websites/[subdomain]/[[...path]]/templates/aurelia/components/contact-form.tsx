"use client";

import { useState } from "react";

type ContactFormProps = {
  dark?: boolean;
};

export function ContactForm({ dark = false }: ContactFormProps) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className={`form-success ${dark ? "dark" : ""}`}>
        <p className="kicker">Thank you</p>
        <h3>Your note has been received.</h3>
        <p>This form is intentionally local and does not send data.</p>
      </div>
    );
  }

  return (
    <form
      className={`contact-form ${dark ? "dark" : ""}`}
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <label>
        <span>Name</span>
        <input required placeholder="Your name" name="name" />
      </label>
      <div className="form-row">
        <label>
          <span>Email</span>
          <input required type="email" placeholder="you@example.com" name="email" />
        </label>
        <label>
          <span>Phone</span>
          <input type="tel" placeholder="(310) 555-0000" name="phone" />
        </label>
      </div>
      <label>
        <span>I&apos;m interested in</span>
        <select name="intent" defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          <option>Buying</option>
          <option>Selling</option>
          <option>Leasing</option>
          <option>Private opportunity</option>
        </select>
      </label>
      <label>
        <span>Message</span>
        <textarea rows={4} placeholder="Tell us a little about what you're looking for." name="message" />
      </label>
      <label className="consent">
        <input type="checkbox" name="consent" />
        <span>I agree to receive communications related to my real estate inquiry.</span>
      </label>
      <button className="text-button" type="submit">
        Send inquiry <span>→</span>
      </button>
    </form>
  );
}
