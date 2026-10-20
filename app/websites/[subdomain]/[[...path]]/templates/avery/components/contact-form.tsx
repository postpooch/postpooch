"use client";

import { useState } from "react";

type ContactFormProps = {
  valuation?: boolean;
};

export function ContactForm({ valuation = false }: ContactFormProps) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="form-success">
        <p className="eyebrow">Thank you</p>
        <h3>Your note has been received.</h3>
        <p className="prose">This form is intentionally local and does not send data.</p>
      </div>
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
      {valuation ? (
        <div className="field full">
          <label htmlFor="avery-address">Property address</label>
          <input id="avery-address" name="address" placeholder="Street address, city, state" />
        </div>
      ) : null}
      <div className="field">
        <label htmlFor="avery-name">Full name</label>
        <input id="avery-name" name="name" required placeholder="Jane Smith" />
      </div>
      <div className="field">
        <label htmlFor="avery-email">Email</label>
        <input
          id="avery-email"
          name="email"
          required
          type="email"
          placeholder="jane@example.com"
        />
      </div>
      <div className="field">
        <label htmlFor="avery-phone">Phone</label>
        <input id="avery-phone" name="phone" placeholder="(212) 555-0123" />
      </div>
      <div className="field">
        <label htmlFor="avery-interest">Interest</label>
        <select id="avery-interest" name="interest" defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          <option>Buying</option>
          <option>Selling</option>
          <option>Buying &amp; Selling</option>
          <option>Market advice</option>
        </select>
      </div>
      <div className="field full">
        <label htmlFor="avery-message">Message</label>
        <textarea
          id="avery-message"
          name="message"
          rows={5}
          placeholder="Tell us a little about what you have in mind."
        />
      </div>
      <button className="button dark-button full" type="submit">
        Send inquiry <span>↗</span>
      </button>
    </form>
  );
}
