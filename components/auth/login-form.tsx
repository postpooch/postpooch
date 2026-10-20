"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Unable to sign in.");
        return;
      }

      router.replace("/dashboard/overview");
      router.refresh();
    } catch {
      setError("Unable to sign in right now.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-pp-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1.5 w-full rounded-control border border-pp-sand bg-pp-cream/40 px-3.5 py-2.5 text-sm text-pp-ink outline-none transition-colors placeholder:text-pp-stone/60 focus:border-pp-teal focus:bg-pp-white focus:ring-2 focus:ring-pp-teal/20"
          placeholder="you@brokerage.com"
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="password" className="block text-sm font-semibold text-pp-ink">
            Password
          </label>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1.5 w-full rounded-control border border-pp-sand bg-pp-cream/40 px-3.5 py-2.5 text-sm text-pp-ink outline-none transition-colors placeholder:text-pp-stone/60 focus:border-pp-teal focus:bg-pp-white focus:ring-2 focus:ring-pp-teal/20"
          placeholder="••••••••"
        />
      </div>

      <label className="flex items-center gap-2.5 text-sm text-pp-ink">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(event) => setRememberMe(event.target.checked)}
          className="size-4 rounded border-pp-sand text-pp-teal accent-pp-teal"
        />
        Keep me signed in
      </label>

      {error ? (
        <p
          role="alert"
          className="rounded-control border border-pp-coral/30 bg-pp-coral/10 px-3 py-2 text-sm text-pp-coral"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-pill bg-pp-teal px-5 py-3 text-sm font-semibold text-pp-white shadow-card-sm transition-colors hover:bg-pp-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Signing in…" : "Log in"}
      </button>

      <p className="pt-1 text-center text-sm text-pp-stone">
        New here?{" "}
        <Link
          href="/auth/signup"
          className="font-semibold text-pp-teal underline-offset-2 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
