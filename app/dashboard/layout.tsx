import type { Metadata } from "next";

import { getAuthenticatedUser } from "@/lib/auth/token_check";
import { Sidebar } from "@/components/dashboard/sidebar";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s — postpooch",
  },
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthenticatedUser();
  const userEmail = user?.email?.trim() || null;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-pp-cream lg:flex-row">
      <Sidebar userEmail={userEmail} />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
