"use client";

import { useState, type FormEvent } from "react";

type LeadFormProps = {
  compact?: boolean;
};

export function LeadForm({ compact = false }: LeadFormProps) {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className={`form-success ${compact ? "form-success--compact" : ""}`}>
        <span>Thank you.</span>
        <p>
          This demo form is working on the front end. Connect it to your CRM,
          email provider or API route before launch.
        </p>
        <button
          type="button"
          className="text-link"
          onClick={() => setSent(false)}
        >
          Send another message ↗
        </button>
      </div>
    );
  }

  if (compact) {
    return (
      <form className="newsletter-form" onSubmit={submit}>
        <label>
          <span>Email address</span>
          <input required type="email" placeholder="you@example.com" />
        </label>
        <label>
          <span>Price range</span>
          <select defaultValue="">
            <option value="" disabled>
              Select range
            </option>
            <option>$750k – $1.5M</option>
            <option>$1.5M – $3M</option>
            <option>$3M – $5M</option>
            <option>$5M+</option>
          </select>
        </label>
        <button className="button button--dark" type="submit">
          Keep me informed ↗
        </button>
      </form>
    );
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <div className="lead-form__grid">
        <label>
          <span>Full name*</span>
          <input required name="name" placeholder="Your name" />
        </label>
        <label>
          <span>Email*</span>
          <input
            required
            type="email"
            name="email"
            placeholder="you@example.com"
          />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" placeholder="(555) 555-5555" />
        </label>
        <label>
          <span>I am looking to</span>
          <select name="subject" defaultValue="Buy">
            <option>Buy</option>
            <option>Sell</option>
            <option>Discuss a project</option>
            <option>Other</option>
          </select>
        </label>
      </div>
      <label className="lead-form__message">
        <span>Tell me a little about what you have in mind*</span>
        <textarea
          required
          rows={5}
          name="message"
          placeholder="Property, timing, location, priorities…"
        />
      </label>
      <button className="button button--light" type="submit">
        Send message ↗
      </button>
    </form>
  );
}
