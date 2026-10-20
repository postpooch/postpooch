import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Template seeder",
  description: "Dev tool for adding social templates to postpooch.",
};

export default function DummyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
