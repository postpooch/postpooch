"use client";

import { type FormEvent, useState } from "react";

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
      <div className="formSuccess">
        <span>Thank you.</span>
        <p>Your request has been received. We’ll follow up shortly.</p>
      </div>
    );
  }

  return (
    <form className={`leadForm ${compact ? "compact" : ""}`} onSubmit={submit}>
      <div className="fieldRow">
        <input required placeholder="First name" name="firstName" />
        <input required placeholder="Last name" name="lastName" />
      </div>
      <div className="fieldRow">
        <input required type="email" placeholder="Email" name="email" />
        <input placeholder="Phone" name="phone" />
      </div>
      {!compact ? <textarea placeholder="How can we help?" rows={5} name="message" /> : null}
      <button className="button buttonLight" type="submit">
        Send Request <span>→</span>
      </button>
    </form>
  );
}
