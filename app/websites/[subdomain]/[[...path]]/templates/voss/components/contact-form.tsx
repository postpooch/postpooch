"use client";

import { useState, type FormEvent } from "react";

type ContactFormProps = {
  firstName: string;
};

export function ContactForm({ firstName }: ContactFormProps) {
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="form-success">
        <p className="eyebrow">Received</p>
        <h3>
          Thank you. {firstName}&apos;s office will be in touch shortly.
        </h3>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="text-link"
        >
          Send another note ↗
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        <span>Name</span>
        <input required name="name" placeholder="Your name" />
      </label>
      <label>
        <span>Email</span>
        <input
          required
          type="email"
          name="email"
          placeholder="you@example.com"
        />
      </label>
      <label>
        <span>Phone</span>
        <input name="phone" placeholder="(212) 555-0123" />
      </label>
      <label>
        <span>I&apos;m interested in</span>
        <select name="interest" defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          <option>Buying a home</option>
          <option>Selling a home</option>
          <option>Private / off-market opportunities</option>
          <option>Market advice</option>
        </select>
      </label>
      <label className="form-full">
        <span>Tell me a little more</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Neighborhoods, timing, price range, or anything useful..."
        />
      </label>
      <button className="submit-button" type="submit">
        Send inquiry <span>↗</span>
      </button>
      <p className="form-note">
        Demo form UI — connect this handler to your CRM, Formspree, HubSpot, or
        server action before launch.
      </p>
    </form>
  );
}
