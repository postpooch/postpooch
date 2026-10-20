import { getAuthenticatedUser } from "@/lib/auth/token_check";
import { listRecentNewsletterTemplates } from "@/lib/dummy/newsletter-template";

import { DummyNewsletterSeeder } from "./seeder";

export default async function DummyNewsletterPage() {
  const user = await getAuthenticatedUser();
  const recents = user
    ? await listRecentNewsletterTemplates().catch(() => [])
    : [];

  return (
    <DummyNewsletterSeeder
      initialRecents={recents}
      signedIn={Boolean(user)}
    />
  );
}
