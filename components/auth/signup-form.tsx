"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setPending(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as {
        error?: string;
        requiresEmailConfirmation?: boolean;
      };

      if (!response.ok) {
        setError(data.error ?? "Unable to create account.");
        return;
      }

      if (data.requiresEmailConfirmation) {
        setInfo("Check your email to confirm your account, then log in.");
        return;
      }

      router.replace("/dashboard/overview");
      router.refresh();
    } catch {
      setError("Unable to create account right now.");
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
        <label htmlFor="password" className="block text-sm font-semibold text-pp-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1.5 w-full rounded-control border border-pp-sand bg-pp-cream/40 px-3.5 py-2.5 text-sm text-pp-ink outline-none transition-colors placeholder:text-pp-stone/60 focus:border-pp-teal focus:bg-pp-white focus:ring-2 focus:ring-pp-teal/20"
          placeholder="At least 8 characters"
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-control border border-pp-coral/30 bg-pp-coral/10 px-3 py-2 text-sm text-pp-coral"
        >
          {error}
        </p>
      ) : null}

      {info ? (
        <p
          role="status"
          className="rounded-control border border-pp-teal/30 bg-pp-teal/10 px-3 py-2 text-sm text-pp-teal-dark"
        >
          {info}{" "}
          <Link href="/auth/login" className="font-semibold underline-offset-2 hover:underline">
            Go to log in
          </Link>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-pill bg-pp-teal px-5 py-3 text-sm font-semibold text-pp-white shadow-card-sm transition-colors hover:bg-pp-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>

      <p className="pt-1 text-center text-sm text-pp-stone">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-pp-teal underline-offset-2 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
