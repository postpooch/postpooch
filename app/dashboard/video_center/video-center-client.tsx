"use client";

import { VideoCenterShell } from "./video-center-shell";
import VideoProjectsPage from "./video-projects";

export function VideoCenterClient() {
  return (
    <VideoCenterShell className="opencut-root min-h-0 flex-1 overflow-y-auto font-sans antialiased">
      <VideoProjectsPage />
    </VideoCenterShell>
  );
}
