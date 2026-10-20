import type { Metadata } from "next";

import { WeeklySchedulePicker } from "@/components/dashboard/social-media/weekly-schedule-picker";
import { getAuthenticatedProfile } from "@/lib/auth/token_check";
import { connectedSchedulePlatformsFromProfile } from "@/lib/schedule-platforms";
import {
  listAutomaticSchedulesForProfile,
  toPostingSlots,
} from "@/lib/schedules";

export const metadata: Metadata = {
  title: "Schedule",
};

export default async function SocialSchedulePage() {
  const auth = await getAuthenticatedProfile();
  const initialSlots = auth
    ? toPostingSlots(await listAutomaticSchedulesForProfile(auth.profile.id))
    : [];
  const connectedPlatforms = auth
    ? connectedSchedulePlatformsFromProfile(auth.profile)
    : { Instagram: false, Facebook: false };

  return (
    <WeeklySchedulePicker
      initialSlots={initialSlots}
      connectedPlatforms={connectedPlatforms}
    />
  );
}
