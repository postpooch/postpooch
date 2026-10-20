"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import {
  googleBusinessConnectFailurePath,
  issueFromCallbackParams,
  issueFromCompleteResponse,
} from "@/lib/google-business/connect-issues";

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const started = useRef(false);
  const [message, setMessage] = useState("Checking your Google Business locations…");

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const connected = params.get("connected");
    const accountId = params.get("accountId")?.trim();
    if (connected !== "googlebusiness" || !accountId) {
      router.replace(googleBusinessConnectFailurePath(issueFromCallbackParams(params)));
      return;
    }

    async function complete() {
      try {
        const response = await fetch("/api/google_business/connect/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountId }),
        });
        if (response.status === 401) {
          router.replace("/auth/login");
          return;
        }
        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          router.replace(
            googleBusinessConnectFailurePath(issueFromCompleteResponse(response.status, payload?.error)),
          );
          return;
        }
        setMessage("Connected. Preparing your profile studio…");
        router.replace("/dashboard/google_business");
        router.refresh();
      } catch {
        router.replace(googleBusinessConnectFailurePath("save_failed"));
      }
    }

    void complete();
  }, [params, router]);

  return (
    <div className="grid min-h-[calc(100dvh-3.75rem)] place-items-center px-6 lg:min-h-dvh">
      <div className="text-center">
        <span className="mx-auto block size-9 animate-spin rounded-full border-2 border-pp-sand border-t-pp-teal" />
        <p className="mt-5 text-sm font-medium text-pp-ink">{message}</p>
        <p className="mt-2 text-xs text-pp-stone">
          This may take a few moments while we read the first profile snapshot.
        </p>
      </div>
    </div>
  );
}

export default function GoogleBusinessCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-dvh place-items-center text-sm text-pp-stone">Finishing connection…</div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
