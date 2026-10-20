import type { NextConfig } from "next";

function cloudflareR2RemotePattern():
  | { protocol: "https"; hostname: string; pathname: string }
  | undefined {
  const base = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL?.trim();
  if (!base) return undefined;

  try {
    const url = new URL(base);
    if (url.protocol !== "https:") return undefined;
    return {
      protocol: "https",
      hostname: url.hostname,
      pathname: "/**",
    };
  } catch {
    return undefined;
  }
}

const r2Pattern = cloudflareR2RemotePattern();

const nextConfig: NextConfig = {
  // Native canvas/fabric/playwright/mjml must not be bundled into seeder routes.
  serverExternalPackages: ["canvas", "fabric", "playwright", "mjml"],
  images: {
    remotePatterns: [
      ...(r2Pattern ? [r2Pattern] : []),
      { protocol: "https", hostname: "api.iconify.design" },
      { protocol: "https", hostname: "api.simplesvg.com" },
      { protocol: "https", hostname: "api.unisvg.com" },
    ],
  },
  // OpenCut Classic WASM compositor may use SharedArrayBuffer.
  async headers() {
    return [
      {
        source: "/dashboard/video_center/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/auth/login",
        permanent: false,
      },
      {
        source: "/signup",
        destination: "/auth/signup",
        permanent: false,
      },
      {
        source: "/projects",
        destination: "/dashboard/video_center",
        permanent: false,
      },
      {
        source: "/editor/:project_id",
        destination: "/dashboard/video_center/:project_id",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
