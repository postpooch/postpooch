import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Center",
};

export default function VideoCenterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      {children}
    </div>
  );
}
