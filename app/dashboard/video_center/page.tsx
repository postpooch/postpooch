import type { Metadata } from "next";

import { VideoCenterClient } from "./video-center-client";

export const metadata: Metadata = {
  title: "Video Center",
};

export default function VideoCenterPage() {
  return <VideoCenterClient />;
}
