import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { GoogleBusinessConnectScreen } from "@/components/dashboard/google-business/connect-screen";
import { GoogleBusinessEditor } from "@/components/dashboard/google-business/editor";
import { getAuthenticatedProfile } from "@/lib/auth/token_check";
import {
  firstSearchParam,
  parseConnectIssue,
} from "@/lib/google-business/connect-issues";
import { GoogleBusinessService } from "@/lib/google-business/service";

export const metadata: Metadata = { title: "Google Business" };

export default async function GoogleBusinessPage({
  searchParams,
}: {
  searchParams: Promise<{
    connect_issue?: string | string[];
    connect_error?: string | string[];
  }>;
}) {
  const authenticated = await getAuthenticatedProfile();
  if (!authenticated) redirect("/auth/login");
  const dashboard = await new GoogleBusinessService().getDashboard(authenticated.profile.id);
  if (!dashboard.connection) {
    const query = await searchParams;
    const issue =
      parseConnectIssue(firstSearchParam(query.connect_issue)) ??
      (firstSearchParam(query.connect_error) ? "unavailable" : null);
    return <GoogleBusinessConnectScreen issue={issue} />;
  }
  if (!dashboard.locations.length) {
    return <GoogleBusinessConnectScreen issue="no_locations" />;
  }
  return <GoogleBusinessEditor dashboard={dashboard} />;
}
