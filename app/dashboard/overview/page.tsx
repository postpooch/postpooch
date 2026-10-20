import type { Metadata } from "next";
import { PresenceMap } from "@/components/dashboard/presence-map";

export const metadata: Metadata = {
  title: "Overview",
};

export default function OverviewPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <PresenceMap />
    </div>
  );
}
