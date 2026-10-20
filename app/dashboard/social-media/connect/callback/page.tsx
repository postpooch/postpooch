"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { LoadingIndicator } from "@/components/dashboard/website/loading-indicator";
import {
  isConnectablePlatform,
  platformDisplayName,
  type ConnectablePlatform,
} from "@/lib/zernio/platforms";

function ConnectCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startedRef = useRef(false);
  const [message, setMessage] = useState("Saving connection…");

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const connected = searchParams.get("connected");
    const accountId = searchParams.get("accountId")?.trim() ?? "";
    const storedReturnPath = window.sessionStorage.getItem(
      "pp-social-connect-return",
    );
    window.sessionStorage.removeItem("pp-social-connect-return");
    const returnPath =
      storedReturnPath === "/dashboard/social-media/studio"
        ? storedReturnPath
        : "/dashboard/social-media";

    if (!isConnectablePlatform(connected) || !accountId) {
      router.replace(`${returnPath}?connect_error=1`);
      return;
    }

    const platform = connected as ConnectablePlatform;

    async function persistConnection() {
      try {
        const response = await fetch("/api/social_accounts/get_account_id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform, accountId }),
        });

        if (response.status === 401) {
          router.replace("/auth/login");
          return;
        }

        if (!response.ok) {
          router.replace(
            `${returnPath}?connect_error=1&platform=${platform}`,
          );
          return;
        }

        router.replace(`${returnPath}?connected=${platform}`);
      } catch {
        setMessage(
          `Unable to save your ${platformDisplayName(platform)} connection.`,
        );
        router.replace(
          `${returnPath}?connect_error=1&platform=${platform}`,
        );
      }
    }

    void persistConnection();
  }, [router, searchParams]);

  return (
    <div className="grid min-h-[calc(100dvh-3.75rem)] place-items-center px-4 lg:min-h-dvh">
      <div className="rounded-2xl bg-white/92 px-4 py-3 text-sm font-medium text-pp-ink shadow-card ring-1 ring-pp-sand/80">
        <LoadingIndicator label={message} />
      </div>
    </div>
  );
}

export default function SocialConnectCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[calc(100dvh-3.75rem)] place-items-center px-4 lg:min-h-dvh">
          <div className="rounded-2xl bg-white/92 px-4 py-3 text-sm font-medium text-pp-ink shadow-card ring-1 ring-pp-sand/80">
            <LoadingIndicator label="Saving connection…" />
          </div>
        </div>
      }
    >
      <ConnectCallbackContent />
    </Suspense>
  );
}
