"use client";

import { useState } from "react";

import type { NorthpineSettings } from "../settings";
import { NORTHPINE_LOGO_SRC } from "./logo";

type SiteFooterProps = {
  settings: NorthpineSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const { agent, catalog } = settings;
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="contact-section">
        <div className="contact-copy">
          <span className="eyebrow light">START A CONVERSATION</span>
          <h2>Let&apos;s make the mountains feel like home.</h2>
          <p>
            Buying, selling, investing or simply exploring? Tell us where you are
            in the process and we&apos;ll help you find the next useful step.
          </p>
        </div>
        <form
          className="contact-form"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <div className="field-row">
            <label>
              Name
              <input required placeholder="Your name" />
            </label>
            <label>
              Email
              <input required type="email" placeholder="you@example.com" />
            </label>
          </div>
          <div className="field-row">
            <label>
              Phone
              <input placeholder="(555) 555-5555" />
            </label>
            <label>
              I&apos;m interested in
              <select>
                {catalog.inquiryInterests.map((interest) => (
                  <option key={interest}>{interest}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Message
            <textarea rows={4} placeholder="How can we help?" />
          </label>
          <button className="btn btn-light" type="submit">
            {sent ? "Message received ✓" : "Send Message"}
          </button>
        </form>
      </section>
      <footer className="footer">
        <div className="footer-brand">
          <img src={NORTHPINE_LOGO_SRC} alt={agent.company} />
          <p>{agent.tagline}</p>
        </div>
        <div>
          <h4>Office</h4>
          <p>{agent.address}</p>
          <p>
            <a href={`tel:${agent.phone}`}>{agent.phone}</a>
            <br />
            <a href={`mailto:${agent.email}`}>{agent.email}</a>
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <p>
            <a href="/about-us">About</a>
            <br />
            <a href="/homes-for-sale-featured">Properties</a>
            <br />
            <a href="/communities">Communities</a>
            <br />
            <a href="/category/blog">Journal</a>
          </p>
        </div>
        <div>
          <h4>Start Here</h4>
          <p>
            <a href="/home-worth">What&apos;s My Home Worth?</a>
            <br />
            <a href="/dream-home">Find My Dream Home</a>
            <br />
            <a href="/relocate">Plan My Move</a>
          </p>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {agent.company}. Demo template.</span>
          <span>Fair Housing Opportunity · Privacy · Accessibility</span>
        </div>
      </footer>
    </>
  );
}
