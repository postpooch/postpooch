"use client";

import { type FormEvent, useState } from "react";

export function SearchBriefForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="fieldRow">
        <label>
          <span>Name</span>
          <input required placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input type="email" required placeholder="you@email.com" />
        </label>
      </div>
      <div className="fieldRow">
        <label>
          <span>Target price range</span>
          <select defaultValue="">
            <option value="" disabled>
              Select range
            </option>
            <option>Under $1.5M</option>
            <option>$1.5M–$2.5M</option>
            <option>$2.5M–$4M</option>
            <option>$4M–$7M</option>
            <option>$7M+</option>
          </select>
        </label>
        <label>
          <span>Property type</span>
          <select defaultValue="">
            <option value="" disabled>
              Select type
            </option>
            <option>Detached</option>
            <option>Semi-detached</option>
            <option>Townhome</option>
            <option>Condo</option>
            <option>Open to several types</option>
          </select>
        </label>
      </div>
      <div className="fieldRow">
        <label>
          <span>Bedrooms</span>
          <select defaultValue="">
            <option value="" disabled>
              Minimum
            </option>
            <option>1+</option>
            <option>2+</option>
            <option>3+</option>
            <option>4+</option>
            <option>5+</option>
          </select>
        </label>
        <label>
          <span>Timing</span>
          <select defaultValue="">
            <option value="" disabled>
              Select timing
            </option>
            <option>Immediately</option>
            <option>0–3 months</option>
            <option>3–6 months</option>
            <option>6–12 months</option>
            <option>Just researching</option>
          </select>
        </label>
      </div>
      <label>
        <span>Neighbourhoods, architecture & priorities</span>
        <textarea
          rows={5}
          placeholder="Tell me what would make a property worth seeing."
        />
      </label>
      <button className="button dark" type="submit">
        {sent ? "Brief received" : "Create my private search brief"}
      </button>
      <p className="formNote">
        Demo form only. Connect this to your CRM or listing-alert workflow before
        launch.
      </p>
    </form>
  );
}
