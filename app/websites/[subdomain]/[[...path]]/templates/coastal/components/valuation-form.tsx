"use client";

import { type FormEvent, useState } from "react";

type ValuationFormProps = {
  continueLabel: string;
  submitLabel: string;
};

export function ValuationForm({ continueLabel, submitLabel }: ValuationFormProps) {
  const [step, setStep] = useState(1);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStep((current) => Math.min(3, current + 1));
  }

  return (
    <section className="valuationWrap section cream">
      <div className="valuationSteps">
        <span className={step >= 1 ? "active" : ""}>01 Address</span>
        <span className={step >= 2 ? "active" : ""}>02 Property</span>
        <span className={step >= 3 ? "active" : ""}>03 Contact</span>
      </div>
      <form className="valuationCard" onSubmit={submit}>
        {step === 1 ? (
          <>
            <p className="eyebrow">Step One</p>
            <h2>Where is the property?</h2>
            <input required placeholder="Street address" name="address" />
            <div className="fieldRow">
              <input required placeholder="City" name="city" />
              <input required placeholder="ZIP code" name="zip" />
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <p className="eyebrow">Step Two</p>
            <h2>Tell us about the home.</h2>
            <div className="fieldRow">
              <input placeholder="Bedrooms" name="beds" />
              <input placeholder="Bathrooms" name="baths" />
            </div>
            <div className="fieldRow">
              <input placeholder="Approx. square feet" name="sqft" />
              <input placeholder="Year built" name="year" />
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <p className="eyebrow">Final Step</p>
            <h2>Where should we send your report?</h2>
            <input required placeholder="Name" name="name" />
            <div className="fieldRow">
              <input required type="email" placeholder="Email" name="email" />
              <input placeholder="Phone" name="phone" />
            </div>
          </>
        ) : null}
        <button className="button buttonDark" type="submit">
          {step < 3 ? continueLabel : submitLabel}
        </button>
      </form>
    </section>
  );
}
