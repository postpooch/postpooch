"use client";

import { useState } from "react";

export function ContactForm({
  dark = false,
  compact = false,
  realtorName,
}: {
  dark?: boolean;
  compact?: boolean;
  realtorName: string;
}) {
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <div className={`form-success ${dark ? "dark" : ""}`}>
        <p className="eyebrow">MESSAGE RECEIVED</p>
        <h3>Thank you.</h3>
        <p>
          This demo does not send email. Connect this form to your API route, CRM,
          or form provider.
        </p>
      </div>
    );
  }
  return (
    <form
      className={`lead-form ${dark ? "dark" : ""} ${compact ? "compact" : ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="form-grid">
        <label>
          First Name
          <input required name="firstName" />
        </label>
        <label>
          Last Name
          <input required name="lastName" />
        </label>
        <label>
          Email
          <input required type="email" name="email" />
        </label>
        <label>
          Phone
          <input type="tel" name="phone" />
        </label>
      </div>
      {!compact && (
        <label>
          How can we help?
          <textarea name="message" rows={5} />
        </label>
      )}
      <label className="consent">
        <input required type="checkbox" />{" "}
        <span>
          I agree to be contacted by {realtorName} by call, email, or text
          regarding real estate services. Replace this wording with your required
          consent language.
        </span>
      </label>
      <button className={`button ${dark ? "button-light" : ""}`} type="submit">
        Submit
      </button>
    </form>
  );
}

export function ValuationForm() {
  const [step, setStep] = useState(1);
  return (
    <div className="valuation-card">
      <div className="steps">
        <span className={step >= 1 ? "active" : ""}>1</span>
        <i />
        <span className={step >= 2 ? "active" : ""}>2</span>
        <i />
        <span className={step >= 3 ? "active" : ""}>3</span>
      </div>
      {step === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
        >
          <p className="eyebrow">COMPLIMENTARY VALUATION</p>
          <h1>Curious What Your Home Is Worth?</h1>
          <label>
            Home Address
            <input required placeholder="Enter your address to begin" />
          </label>
          <button className="button" type="submit">
            Continue
          </button>
        </form>
      )}
      {step === 2 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(3);
          }}
        >
          <p className="eyebrow">TELL US ABOUT YOU</p>
          <h2>Where should we send your analysis?</h2>
          <label>
            Name
            <input required />
          </label>
          <label>
            Email
            <input required type="email" />
          </label>
          <label>
            Phone
            <input type="tel" />
          </label>
          <label>
            Timing
            <select defaultValue="">
              <option value="" disabled>
                Select a time frame
              </option>
              <option>Immediately</option>
              <option>Within 3 months</option>
              <option>Within 6 months</option>
              <option>Just researching</option>
            </select>
          </label>
          <button className="button" type="submit">
            Request Valuation
          </button>
        </form>
      )}
      {step === 3 && (
        <div className="valuation-thanks">
          <p className="eyebrow">THANK YOU</p>
          <h2>Your request has been recorded.</h2>
          <p>
            This template uses a front-end demo. Connect the submit handler to
            your database, CRM, or email workflow.
          </p>
          <button className="text-link" type="button" onClick={() => setStep(1)}>
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
