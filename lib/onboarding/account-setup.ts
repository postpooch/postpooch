import "server-only";

import { initializeNewsletterSenderSetup } from "@/lib/newsletter-senders/setup";

export type AccountSetupInput = {
  profileId: string;
  email: string;
  emailVerified: boolean;
};

type SetupStep = {
  name: string;
  run: () => Promise<unknown>;
};

type AccountSetupDependencies = {
  newsletterSetup?: (input: AccountSetupInput) => Promise<unknown>;
  additionalSteps?: SetupStep[];
};

export async function runAccountSetup(
  input: AccountSetupInput,
  dependencies: AccountSetupDependencies = {},
) {
  const newsletterSetup =
    dependencies.newsletterSetup ??
    ((value: AccountSetupInput) =>
      initializeNewsletterSenderSetup({
        profileId: value.profileId,
        replyToEmail: value.email,
        replyToVerified: value.emailVerified,
      }));
  const steps: SetupStep[] = [
    { name: "newsletter-sender", run: () => newsletterSetup(input) },
    ...(dependencies.additionalSteps ?? []),
  ];
  const results: { name: string; status: "complete" }[] = [];
  for (const step of steps) {
    try {
      await step.run();
      results.push({ name: step.name, status: "complete" });
    } catch (error) {
      throw new Error(`Account setup step failed: ${step.name}`, { cause: error });
    }
  }
  return results;
}
