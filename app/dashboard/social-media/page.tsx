import type { Metadata } from "next";

import { getAuthenticatedProfile } from "@/lib/auth/token_check";
import { AccountsPanel } from "@/components/dashboard/social-media/accounts-panel";

export const metadata: Metadata = {
  title: "Accounts",
};

export default async function SocialMediaAccountsPage() {
  const auth = await getAuthenticatedProfile();

  const connections = {
    instagram: Boolean(auth?.profile.instagram_account_id),
    facebook: Boolean(auth?.profile.facebook_account_id),
  };

  return <AccountsPanel connections={connections} />;
}
