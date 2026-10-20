const RESERVED_TENANT_LABELS = new Set(["www", "app", "api", "admin"]);

/**
 * Parent domain for public agent sites, e.g. `postpooch.com` so
 * `sally.postpooch.com` rewrites to `/websites/sally`.
 *
 * When unset, only `*.localhost` tenant hosts are recognized (local preview).
 * Platform hosts like `*.vercel.app` are never treated as tenants.
 */
export function getTenantRootDomain(
  env: NodeJS.ProcessEnv = process.env,
): string | null {
  const raw = env.TENANT_ROOT_DOMAIN?.trim().toLowerCase();
  return raw || null;
}

/**
 * Extract a tenant subdomain label from a Host header value, or null when
 * the request should use the main app (landing, dashboard, auth, etc.).
 */
export function getTenantSubdomain(
  host: string,
  env: NodeJS.ProcessEnv = process.env,
): string | null {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  if (!hostname) return null;

  const parts = hostname.split(".").filter(Boolean);

  // name.localhost → name (local tenant preview)
  if (parts.length >= 2 && parts.at(-1) === "localhost") {
    const label = parts[0];
    if (!label || RESERVED_TENANT_LABELS.has(label)) return null;
    // only single-label: sally.localhost, not a.b.localhost
    if (parts.length !== 2) return null;
    return label;
  }

  const root = getTenantRootDomain(env);
  if (!root) return null;

  if (hostname === root) return null;

  const suffix = `.${root}`;
  if (!hostname.endsWith(suffix)) return null;

  const prefix = hostname.slice(0, -suffix.length);
  // only single-label tenants: sally.postpooch.com
  if (!prefix || prefix.includes(".")) return null;
  if (RESERVED_TENANT_LABELS.has(prefix)) return null;

  return prefix;
}
