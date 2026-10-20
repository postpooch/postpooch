"use client";

import { useState, type FormEvent } from "react";

import { ArrowRight } from "./icons";

type ContactFormProps = {
  kind?: "contact" | "searcher";
};

export function ContactForm({ kind = "contact" }: ContactFormProps) {
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="form-success" role="status">
        <span>Thank you.</span>
        <h3>Your message is ready.</h3>
        <p>
          This is a demo form. In production, connect it to your CRM, email service, or
          form provider.
        </p>
        <button className="text-link" type="button" onClick={() => setSent(false)}>
          Send another message <ArrowRight />
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row">
        <label>
          First name
          <input required name="firstName" placeholder="Your first name" />
        </label>
        <label>
          Last name
          <input required name="lastName" placeholder="Your last name" />
        </label>
      </div>
      <div className="form-row">
        <label>
          Email
          <input required type="email" name="email" placeholder="name@email.com" />
        </label>
        <label>
          Phone
          <input type="tel" name="phone" placeholder="+31 6 12 34 56 78" />
        </label>
      </div>
      {kind === "searcher" ? (
        <>
          <div className="form-row">
            <label>
              Preferred area
              <input name="region" placeholder="e.g. Utrecht East" />
            </label>
            <label>
              Budget up to
              <input name="budget" placeholder="e.g. € 750.000" />
            </label>
          </div>
          <label>
            What are you looking for?
            <textarea
              name="message"
              rows={5}
              placeholder="Tell us about home type, rooms, outdoor space, and timing."
            />
          </label>
        </>
      ) : (
        <>
          <label>
            How can Mila help you?
            <select name="subject" defaultValue="">
              <option value="" disabled>
                Choose a topic
              </option>
              <option>Sell my home</option>
              <option>Buy a home</option>
              <option>Valuation</option>
              <option>Interest in a listing</option>
              <option>Something else</option>
            </select>
          </label>
          <label>
            Briefly tell us what is going on
            <textarea
              name="message"
              rows={5}
              placeholder="Your plans, question, or situation..."
            />
          </label>
        </>
      )}
      <label className="check">
        <input required type="checkbox" />{" "}
        <span>
          I agree that my details may be used to get in touch with me.
        </span>
      </label>
      <button className="button button-dark" type="submit">
        Send request <ArrowRight />
      </button>
    </form>
  );
}
