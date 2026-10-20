"use client";

import { useState } from "react";

type ContactFormProps = {
  successTitle: string;
  successBody: string;
  submitLabel: string;
  formNote: string;
};

export function ContactForm({
  successTitle,
  successBody,
  submitLabel,
  formNote,
}: ContactFormProps) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="form-success">
        <span>01</span>
        <h2>{successTitle}</h2>
        <p>{successBody}</p>
      </div>
    );
  }

  return (
    <form
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <label>
        <span>YOUR NAME</span>
        <input required name="name" placeholder="First and last name" />
      </label>
      <div className="form-pair">
        <label>
          <span>EMAIL</span>
          <input
            required
            type="email"
            name="email"
            placeholder="you@example.com"
          />
        </label>
        <label>
          <span>PHONE</span>
          <input name="phone" placeholder="+1 212 555 0000" />
        </label>
      </div>
      <label>
        <span>I&apos;M INTERESTED IN</span>
        <select name="intent" defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          <option>Buying</option>
          <option>Selling</option>
          <option>Private / off-market opportunities</option>
          <option>Market valuation</option>
          <option>Press / partnership</option>
        </select>
      </label>
      <label>
        <span>TELL US A LITTLE MORE</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Property, neighborhood, timing, or anything else that would be useful."
        />
      </label>
      <button className="pill dark" type="submit">
        {submitLabel} <span>↗</span>
      </button>
      <p className="form-note">{formNote}</p>
    </form>
  );
}
