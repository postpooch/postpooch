import { describe, expect, it } from "vitest";

import { getTenantSubdomain } from "./tenant-host";

describe("getTenantSubdomain", () => {
  const env = { TENANT_ROOT_DOMAIN: "postpooch.com" };

  it("rewrites single-label tenants on the configured root", () => {
    expect(getTenantSubdomain("sally.postpooch.com", env)).toBe("sally");
    expect(getTenantSubdomain("Sally.PostPooch.COM:443", env)).toBe("sally");
  });

  it("does not treat apex or reserved labels as tenants", () => {
    expect(getTenantSubdomain("postpooch.com", env)).toBeNull();
    expect(getTenantSubdomain("www.postpooch.com", env)).toBeNull();
    expect(getTenantSubdomain("app.postpooch.com", env)).toBeNull();
    expect(getTenantSubdomain("api.postpooch.com", env)).toBeNull();
  });

  it("ignores hosts outside the allowlisted root", () => {
    expect(
      getTenantSubdomain("postpooch-temp-ue5t.vercel.app", env),
    ).toBeNull();
    expect(getTenantSubdomain("sally.example.com", env)).toBeNull();
    expect(getTenantSubdomain("localhost", env)).toBeNull();
  });

  it("supports name.localhost for local preview", () => {
    expect(getTenantSubdomain("sally.localhost", {})).toBe("sally");
    expect(getTenantSubdomain("sally.localhost:3000", env)).toBe("sally");
    expect(getTenantSubdomain("www.localhost", env)).toBeNull();
  });

  it("does not rewrite when TENANT_ROOT_DOMAIN is unset", () => {
    expect(getTenantSubdomain("sally.postpooch.com", {})).toBeNull();
  });

  it("rejects multi-label prefixes under the root", () => {
    expect(getTenantSubdomain("a.b.postpooch.com", env)).toBeNull();
  });
});
