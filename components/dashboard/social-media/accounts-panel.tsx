"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import {
  isConnectablePlatform,
  platformDisplayName,
  type ConnectablePlatform,
} from "@/lib/zernio/platforms";
import { LoadingIndicator } from "@/components/dashboard/website/loading-indicator";
import { ArrowRightIcon, FacebookIcon, InstagramIcon } from "../icons";

type PlatformId = ConnectablePlatform;

type Platform = {
  id: PlatformId;
  name: string;
  detail: string;
};

export type AccountConnections = Record<PlatformId, boolean>;

const PLATFORMS: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    detail: "Feed posts and Reels",
  },
  {
    id: "facebook",
    name: "Facebook",
    detail: "Page posts",
  },
];

const MASCOT_SRC =
  "/postpooch_web_mascot_assets/responsive/with-shadow/webp/postpooch-mascot-with-shadow-128w.webp";

type AccountsPanelProps = {
  connections: AccountConnections;
};

function AccountsPanelInner({ connections }: AccountsPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const feedbackClearedRef = useRef(false);

  const [connected, setConnected] = useState<AccountConnections>(connections);
  const [connecting, setConnecting] = useState<PlatformId | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setConnected(connections);
  }, [connections]);

  useEffect(() => {
    if (feedbackClearedRef.current) return;

    const connectedPlatform = searchParams.get("connected");
    const connectError = searchParams.get("connect_error");
    const errorPlatform = searchParams.get("platform");

    if (isConnectablePlatform(connectedPlatform)) {
      feedbackClearedRef.current = true;
      setConnected((prev) => ({ ...prev, [connectedPlatform]: true }));
      setSuccess(`${platformDisplayName(connectedPlatform)} is connected.`);
      setError("");
      router.replace("/dashboard/social-media", { scroll: false });
      return;
    }

    if (connectError) {
      feedbackClearedRef.current = true;
      const label = isConnectablePlatform(errorPlatform)
        ? platformDisplayName(errorPlatform)
        : "channel";
      setError(
        `Unable to finish connecting your ${label}. Try again when you are ready.`,
      );
      setSuccess("");
      router.replace("/dashboard/social-media", { scroll: false });
    }
  }, [router, searchParams]);

  const connectedCount = PLATFORMS.filter((p) => connected[p.id]).length;

  async function connect(platform: PlatformId) {
    if (connecting) return;

    setConnecting(platform);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/social_accounts/make_account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      const result = (await response.json()) as {
        authUrl?: string;
        error?: string;
      };

      if (response.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (!response.ok || !result.authUrl) {
        throw new Error(
          result.error ??
            `Unable to start the ${platformDisplayName(platform)} connection.`,
        );
      }

      window.location.assign(result.authUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Unable to start the ${platformDisplayName(platform)} connection.`,
      );
      setConnecting(null);
    }
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className="text-[13px] tracking-[-0.01em] text-pp-stone"
          aria-live="polite"
        >
          {connectedCount === 0
            ? "No channels connected yet"
            : connectedCount === PLATFORMS.length
              ? "Both channels connected"
              : `${connectedCount} of ${PLATFORMS.length} connected`}
        </p>
        {success ? (
          <p
            className="text-[13px] font-medium tracking-[-0.01em] text-pp-teal"
            role="status"
          >
            {success}
          </p>
        ) : null}
        {error ? (
          <p
            className="text-[13px] font-medium tracking-[-0.01em] text-pp-coral"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PLATFORMS.map((platform) => {
          const isOn = connected[platform.id];
          const isConnecting = connecting === platform.id;

          return (
            <li key={platform.id}>
              <div
                className={[
                  "flex h-full flex-col gap-6 rounded-[18px] bg-pp-white p-5 ring-1 transition-[box-shadow,transform,ring-color] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] sm:p-6",
                  "hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(36,25,20,0.1)]",
                  isOn ? "ring-2 ring-pp-teal" : "ring-pp-sand/60",
                ].join(" ")}
              >
                <div className="flex items-start gap-3.5">
                  <PlatformMark id={platform.id} />
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[15px] font-semibold leading-snug tracking-[-0.015em] text-pp-ink">
                      {platform.name}
                    </p>
                    <p className="mt-1 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                      {platform.detail}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3">
                  <span
                    className={[
                      "text-[12px] font-medium tracking-[-0.01em]",
                      isOn ? "text-pp-teal" : "text-pp-stone",
                    ].join(" ")}
                  >
                    {isOn ? "Connected" : "Not connected"}
                  </span>
                  {isOn ? null : (
                    <button
                      type="button"
                      disabled={connecting !== null}
                      onClick={() => void connect(platform.id)}
                      className={[
                        "inline-flex h-9 items-center justify-center gap-2 rounded-[12px] bg-pp-teal px-4",
                        "text-xs font-semibold tracking-[-0.01em] text-pp-white",
                        "transition-[background-color,transform] duration-200 ease-out",
                        "hover:bg-pp-teal-dark active:scale-[0.98]",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
                        "disabled:cursor-not-allowed disabled:opacity-45",
                      ].join(" ")}
                    >
                      {isConnecting ? (
                        <LoadingIndicator
                          label="Connecting…"
                          tone="dark"
                          className="gap-1.5"
                          spinnerClassName="size-3.5"
                        />
                      ) : (
                        <>
                          Connect
                          <ArrowRightIcon className="size-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {connectedCount === 0 ? (
        <div className="rounded-2xl border border-dashed border-pp-sand px-5 py-8">
          <div className="flex max-w-md items-start gap-4">
            <Image
              src={MASCOT_SRC}
              alt=""
              width={72}
              height={72}
              className="mt-0.5 h-12 w-auto shrink-0"
            />
            <div>
              <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-pp-ink">
                Nothing connected yet
              </h2>
              <p className="mt-1 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                Connect Instagram or Facebook so approved posts have somewhere to
                publish.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AccountsPanel(props: AccountsPanelProps) {
  return (
    <Suspense
      fallback={
        <div className="flex w-full flex-col gap-6">
          <p className="text-[13px] tracking-[-0.01em] text-pp-stone">
            Loading channels…
          </p>
        </div>
      }
    >
      <AccountsPanelInner {...props} />
    </Suspense>
  );
}

function PlatformMark({ id }: { id: PlatformId }) {
  const Icon = id === "instagram" ? InstagramIcon : FacebookIcon;

  return (
    <span
      className="inline-flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-pp-mist text-pp-ink ring-1 ring-pp-sand/80"
      aria-hidden
    >
      <Icon branded className="size-5" />
    </span>
  );
}
