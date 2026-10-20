"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  GOOGLE_BUSINESS_ADD_LOCATION_URL,
  GOOGLE_BUSINESS_ADD_RESUME_KEY,
  googleBusinessConnectNotice,
  issueFromStartResponse,
  type GoogleBusinessConnectIssue,
  type GoogleBusinessConnectNotice,
} from "@/lib/google-business/connect-issues";

const MASCOT = "/postpooch_web_mascot_assets/responsive/with-shadow/webp/postpooch-mascot-with-shadow-256w.webp";

function ConnectNotice({ notice }: { notice: GoogleBusinessConnectNotice }) {
  return (
    <div
      role="alert"
      className="rounded-[18px] bg-pp-cream px-4 py-3.5 text-left ring-1 ring-pp-sand/90"
    >
      <div className="flex gap-3">
        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-pp-coral/10 text-pp-coral">
          <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 6.25v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="13.35" r=".9" fill="currentColor" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight text-pp-ink">{notice.title}</p>
          <p className="mt-1 text-[13px] leading-5 text-pp-stone">{notice.detail}</p>
        </div>
      </div>
    </div>
  );
}

function Hint({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[18px] bg-pp-cream px-4 py-3.5 ring-1 ring-pp-sand/90">
      <div className="flex gap-3">
        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-pp-teal/10 text-pp-teal">
          <svg viewBox="0 0 20 20" className="size-3.5" fill="none" aria-hidden="true">
            <path d="M7 13 13 7M8 7h5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight text-pp-ink">{title}</p>
          <p className="mt-1 text-[13px] leading-5 text-pp-stone">{detail}</p>
        </div>
      </div>
    </div>
  );
}

export function GoogleBusinessConnectScreen({
  issue = null,
}: {
  issue?: GoogleBusinessConnectIssue | null;
}) {
  const addLocationFlow = issue === "no_locations";
  const [connecting, setConnecting] = useState(false);
  const [waitingOnGoogle, setWaitingOnGoogle] = useState(false);
  const [notice, setNotice] = useState<GoogleBusinessConnectNotice | null>(() => {
    if (!issue || issue === "no_locations") return null;
    return googleBusinessConnectNotice(issue);
  });
  const connectInFlight = useRef(false);
  const leftForGoogleAt = useRef(0);
  const autoResumed = useRef(false);

  const startConnect = useCallback(async () => {
    if (connectInFlight.current) return;
    connectInFlight.current = true;
    setConnecting(true);
    setNotice(null);
    try {
      const response = await fetch("/api/google_business/connect", { method: "POST" });
      if (response.status === 401) {
        window.location.assign("/auth/login");
        return;
      }
      const payload = (await response.json()) as { authUrl?: string; error?: string };
      if (!response.ok || !payload.authUrl) {
        setNotice(googleBusinessConnectNotice(issueFromStartResponse(response.status, payload.error)));
        setConnecting(false);
        connectInFlight.current = false;
        return;
      }
      sessionStorage.removeItem(GOOGLE_BUSINESS_ADD_RESUME_KEY);
      window.location.assign(payload.authUrl);
    } catch {
      setNotice(googleBusinessConnectNotice("start_failed"));
      setConnecting(false);
      connectInFlight.current = false;
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(GOOGLE_BUSINESS_ADD_RESUME_KEY) !== "1") return;
    sessionStorage.removeItem(GOOGLE_BUSINESS_ADD_RESUME_KEY);
    setWaitingOnGoogle(true);
    void startConnect();
  }, [startConnect]);

  useEffect(() => {
    if (!waitingOnGoogle) return;

    function markHidden() {
      if (document.visibilityState === "hidden") leftForGoogleAt.current = Date.now();
    }

    function resumeIfReturned() {
      if (document.visibilityState !== "visible" || connecting || autoResumed.current) return;
      if (!leftForGoogleAt.current || Date.now() - leftForGoogleAt.current < 2500) return;
      autoResumed.current = true;
      void startConnect();
    }

    document.addEventListener("visibilitychange", markHidden);
    document.addEventListener("visibilitychange", resumeIfReturned);
    window.addEventListener("focus", resumeIfReturned);
    window.addEventListener("pageshow", resumeIfReturned);
    return () => {
      document.removeEventListener("visibilitychange", markHidden);
      document.removeEventListener("visibilitychange", resumeIfReturned);
      window.removeEventListener("focus", resumeIfReturned);
      window.removeEventListener("pageshow", resumeIfReturned);
    };
  }, [connecting, startConnect, waitingOnGoogle]);

  function continueOnGoogle() {
    sessionStorage.setItem(GOOGLE_BUSINESS_ADD_RESUME_KEY, "1");
    setWaitingOnGoogle(true);
    setNotice(null);
    leftForGoogleAt.current = Date.now();
  }

  if (addLocationFlow || waitingOnGoogle) {
    const heading = connecting
      ? "Finishing your connection…"
      : waitingOnGoogle
        ? "Finish in Google, then come back"
        : "Add your business on Google";
    const body = connecting
      ? "Google authorization is opening now. We’ll bring your listing into PostPooch as soon as it’s ready."
      : waitingOnGoogle
        ? "When your listing is added or claimed, return to this tab. We’ll pick up the connection from here."
        : "This Google account doesn’t have a listing yet. Continue on Google to add or claim it. We’ll keep this page ready and finish connecting when you come back.";

    return (
      <div className="grid min-h-[calc(100dvh-3.75rem)] place-items-center px-5 py-12 lg:min-h-dvh">
        <section className="w-full max-w-xl overflow-hidden rounded-[30px] bg-white text-center shadow-[0_24px_70px_rgba(36,25,20,.12)] ring-1 ring-pp-sand/80">
          <div className="bg-[radial-gradient(circle_at_50%_-20%,rgba(246,177,119,.42),transparent_58%)] px-7 pb-9 pt-10 sm:px-12 sm:pt-12">
            <Image src={MASCOT} alt="" width={96} height={96} className="mx-auto" priority />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-pp-teal">One more step</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-.035em] text-pp-ink sm:text-[38px]">{heading}</h1>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-7 text-pp-stone">{body}</p>
          </div>
          <div className="border-t border-pp-sand/70 px-7 py-7 text-left sm:px-12">
            {connecting ? (
              <div className="flex items-center justify-center gap-3 py-1">
                <span className="size-5 animate-spin rounded-full border-2 border-pp-sand border-t-pp-teal" />
                <p className="text-sm font-medium text-pp-ink">Opening secure connection…</p>
              </div>
            ) : (
              <>
                <Hint
                  title="Use the same Google account"
                  detail="Add or claim your listing, then return here. Stay signed in with the account you just used."
                />
                {notice ? <div className="mt-4"><ConnectNotice notice={notice} /></div> : null}
                {waitingOnGoogle ? (
                  <>
                    <button
                      type="button"
                      onClick={() => void startConnect()}
                      className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-pp-teal px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-pp-teal-dark"
                    >
                      I’ve added it — finish connecting
                    </button>
                    <a
                      href={GOOGLE_BUSINESS_ADD_LOCATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={continueOnGoogle}
                      className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-2xl px-6 text-sm font-semibold text-pp-teal transition hover:bg-pp-teal/10"
                    >
                      Open Google again
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href={GOOGLE_BUSINESS_ADD_LOCATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={continueOnGoogle}
                      className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-pp-teal px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-pp-teal-dark"
                    >
                      Continue on Google
                    </a>
                    <button
                      type="button"
                      onClick={() => void startConnect()}
                      className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-2xl px-6 text-sm font-semibold text-pp-teal transition hover:bg-pp-teal/10"
                    >
                      I already added it — finish connecting
                    </button>
                  </>
                )}
              </>
            )}
            <p className="mt-5 text-center text-xs leading-5 text-pp-stone">
              Google’s official add-business page will open. PostPooch never sees your Google password.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="grid min-h-[calc(100dvh-3.75rem)] place-items-center px-5 py-12 lg:min-h-dvh">
      <section className="w-full max-w-xl overflow-hidden rounded-[30px] bg-white text-center shadow-[0_24px_70px_rgba(36,25,20,.12)] ring-1 ring-pp-sand/80">
        <div className="bg-[radial-gradient(circle_at_50%_-20%,rgba(246,177,119,.42),transparent_58%)] px-7 pb-9 pt-10 sm:px-12 sm:pt-12">
          <Image src={MASCOT} alt="" width={96} height={96} className="mx-auto" priority />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-pp-teal">Local presence</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-.035em] text-pp-ink sm:text-[38px]">
            Bring your business profile home.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-7 text-pp-stone">
            Connect your Google Business Profile to keep contact details, hours, reviews, and local performance together in PostPooch.
          </p>
        </div>
        <div className="border-t border-pp-sand/70 px-7 py-7 sm:px-12">
          {notice ? <div className="mb-5"><ConnectNotice notice={notice} /></div> : null}
          <button
            type="button"
            onClick={() => void startConnect()}
            disabled={connecting}
            className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-pp-teal px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-pp-teal-dark disabled:cursor-wait disabled:opacity-70"
          >
            <span className="grid size-6 place-items-center rounded-full bg-white text-sm font-bold text-[#4285f4]">G</span>
            {connecting ? "Opening secure connection…" : notice ? "Try Again" : "Connect Google Business"}
          </button>
          <p className="mt-5 text-xs leading-5 text-pp-stone">
            You’ll continue through Zernio’s secure Google authorization flow. PostPooch never sees your Google password.
          </p>
        </div>
      </section>
    </div>
  );
}
