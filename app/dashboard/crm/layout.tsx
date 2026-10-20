import { redirect } from "next/navigation";

import { CrmNav } from "@/components/dashboard/crm/ui";
import { getAuthenticatedProfile } from "@/lib/auth/token_check";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  if (!(await getAuthenticatedProfile())) redirect("/auth/login");
  return (
    <div className="crm-shell flex min-h-[calc(100dvh-3.75rem)] flex-col bg-white lg:h-dvh lg:min-h-0 lg:flex-row lg:overflow-hidden">
      <CrmNav />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
