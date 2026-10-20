import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your postpooch account and start your free trial.",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Start free"
      subtitle="Create your account — 14-day free trial, no credit card required."
    >
      <SignupForm />
    </AuthShell>
  );
}
