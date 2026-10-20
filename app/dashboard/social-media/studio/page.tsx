import type { Metadata } from "next";

import { getAuthenticatedProfile } from "@/lib/auth/token_check";
import { CreativeStudio } from "@/components/dashboard/social-media/creative-studio";

export const metadata: Metadata = {
  title: "Studio",
};

/**
 * Temporary front-end switch. Replace this with the persisted profile state
 * when the creative-profile data model is ready.
 */
const HAS_COMPLETED_CREATIVE_PROFILE = true;

export default async function SocialStudioPage() {
  const auth = await getAuthenticatedProfile();
  const connections = {
    instagram: Boolean(auth?.profile.instagram_account_id),
    facebook: Boolean(auth?.profile.facebook_account_id),
  };

  return (
    <CreativeStudio
      hasCompletedProfile={HAS_COMPLETED_CREATIVE_PROFILE}
      connections={connections}
    />
  );
}
