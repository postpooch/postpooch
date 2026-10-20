"use client";

import { useState } from "react";

type InquiryFormProps = {
  compact?: boolean;
};

export function InquiryForm({ compact = false }: InquiryFormProps) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="form-success">
        <p className="eyebrow">Received</p>
        <h3>Thank you.</h3>
        <p>
          This demo form is ready to connect to your CRM, email provider, or
          server action.
        </p>
      </div>
    );
  }

  return (
    <form
      className={`inquiry-form ${compact ? "compact" : ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="field-row">
        <label>
          <span>First name</span>
          <input name="firstName" required />
        </label>
        <label>
          <span>Last name</span>
          <input name="lastName" required />
        </label>
      </div>
      <div className="field-row">
        <label>
          <span>Email</span>
          <input name="email" type="email" required />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" type="tel" />
        </label>
      </div>
      {!compact && (
        <label>
          <span>What can I help with?</span>
          <select defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            <option>Buying a home</option>
            <option>Selling a home</option>
            <option>Private advisory</option>
            <option>General inquiry</option>
          </select>
        </label>
      )}
      <label>
        <span>Message</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Tell me a little about your plans."
        />
      </label>
      <button className="text-button" type="submit">
        Send inquiry <b>↗</b>
      </button>
    </form>
  );
}
