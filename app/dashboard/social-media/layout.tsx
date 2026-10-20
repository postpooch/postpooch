import { SocialMediaShell } from "@/components/dashboard/social-media/top-nav";

export default function SocialMediaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SocialMediaShell>{children}</SocialMediaShell>;
}
