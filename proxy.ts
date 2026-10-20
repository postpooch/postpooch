import { NextResponse, type NextRequest } from "next/server";

import { refreshSupabaseSessionIfNeeded } from "@/lib/auth/token_control";
import { getTenantSubdomain } from "@/lib/websites/tenant-host";

function shouldRefreshSession(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/post-design") ||
    pathname.startsWith("/api/crm") ||
    pathname.startsWith("/api/post_projects") ||
    pathname.startsWith("/api/websites")
  );
}

/**
 * Rewrite tenant subdomains onto the catch-all website route while preserving
 * the visitor's path: sally.localhost/about → /websites/sally/about
 */
function rewriteTenantWebsiteRequest(
  request: NextRequest,
  subdomain: string,
): NextResponse {
  const url = request.nextUrl.clone();
  const visitorPath = request.nextUrl.pathname;

  // Already on an internal website URL — do not double-prefix.
  if (visitorPath === "/websites" || visitorPath.startsWith("/websites/")) {
    return NextResponse.next();
  }

  const encodedSubdomain = encodeURIComponent(subdomain);
  url.pathname =
    visitorPath === "/"
      ? `/websites/${encodedSubdomain}`
      : `/websites/${encodedSubdomain}${visitorPath}`;

  return NextResponse.rewrite(url);
}

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const subdomain = getTenantSubdomain(host);

  if (subdomain) {
    return rewriteTenantWebsiteRequest(request, subdomain);
  }

  if (shouldRefreshSession(request.nextUrl.pathname)) {
    return refreshSupabaseSessionIfNeeded(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match page routes (for subdomain rewrites + session refresh) and
     * authenticated API routes (session refresh), excluding static assets.
     */
    "/((?!api|_next/static|_next/image|_next/data|favicon.ico|.*\\..*).*)",
    "/api/post_projects/:path*",
    "/api/crm/:path*",
    "/api/websites/:path*",
  ],
};
