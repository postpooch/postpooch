"use client";

import { useState } from "react";

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <div className="formSuccess">
        <span>Thank you.</span>
        <p>This demo form does not send email. Connect it to your CRM or inbox.</p>
      </div>
    );
  }
  return (
    <form
      className={compact ? "contactForm compact" : "contactForm"}
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <label>
        Full Name
        <input required name="name" placeholder="Your name" />
      </label>
      <label>
        Email
        <input required type="email" name="email" placeholder="you@example.com" />
      </label>
      <label>
        Phone
        <input name="phone" placeholder="(000) 000-0000" />
      </label>
      <label>
        Interest
        <select name="interest" defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          <option>Buying</option>
          <option>Selling</option>
          <option>Leasing</option>
          <option>General Inquiry</option>
        </select>
      </label>
      {compact ? null : (
        <label className="full">
          Message
          <textarea name="message" rows={4} placeholder="How can we help?" />
        </label>
      )}
      <button className="darkButton" type="submit">
        Submit
      </button>
    </form>
  );
}
