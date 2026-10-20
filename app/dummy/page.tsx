import Link from "next/link";

import { getAuthenticatedUser } from "@/lib/auth/token_check";
import { listRecentDummyTemplates } from "@/lib/dummy/social-template";

import { DummyTemplateSeeder } from "./seeder";

export default async function DummyPage() {
  const user = await getAuthenticatedUser();
  const recents = user ? await listRecentDummyTemplates().catch(() => []) : [];

  return (
    <>
      <div className="bg-[#f5f5f7] px-5 pt-4 text-center text-[13px] text-[#6e6e73] sm:px-8">
        <Link
          className="font-medium text-[#0071e3] hover:underline"
          href="/dummy/newsletter"
        >
          Newsletter MJML seeder
        </Link>
      </div>
      <DummyTemplateSeeder
        initialRecents={recents}
        signedIn={Boolean(user)}
      />
    </>
  );
}

