import type { Metadata } from "next";
import localFont from "next/font/local";
import { Comfortaa, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const postPoochSans = localFont({
  src: [
    {
      path: "../public/fonts/inter/Inter-Variable.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../public/fonts/inter/Inter-Italic-Variable.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-postpooch-sans",
});

const postPoochDisplay = Comfortaa({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-postpooch-display",
});

// Open-licensed stand-in for the proprietary Anthropic Serif.
// Self-hosted at build time (no runtime Google request); system
// fallbacks in landing.css cover offline / failed-load cases.
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-source-serif",
});

export const metadata: Metadata = {
  title: {
    default: "postpooch — Automated social content for real estate agents",
    template: "%s — postpooch",
  },
  description:
    "postpooch turns your listings, market knowledge, and local expertise into ready-to-review social posts. Stay top of feed. Stay top of mind.",
  icons: {
    icon: [
      {
        url: "/postpooch_web_mascot_assets/avatar/favicon-16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/postpooch_web_mascot_assets/avatar/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/postpooch_web_mascot_assets/avatar/favicon-48.png",
        sizes: "48x48",
        type: "image/png",
      },
    ],
    apple: "/postpooch_web_mascot_assets/avatar/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${postPoochSans.variable} ${postPoochDisplay.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
