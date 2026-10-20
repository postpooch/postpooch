import { readFileSync } from "node:fs";
import path from "node:path";

const migration = readFileSync(
  path.resolve(
    __dirname,
    "../../../supabase/migrations/20261016000000_newsletter_ses_tenants.sql",
  ),
  "utf8",
);

test("creates one protected SES tenant and sending identity per profile", () => {
  expect(migration).toContain("create table if not exists public.newsletter_ses_tenants");
  expect(migration).toContain("profile_id uuid not null unique");
  expect(migration).toContain("create table if not exists public.newsletter_sending_identities");
  expect(migration).toContain("identity_domain text not null unique");
  expect(migration).toContain("from_email text not null unique");
  expect(migration).toContain("enable row level security");
});

test("backfills deterministic pending records for existing profiles", () => {
  expect(migration).toContain("insert into public.newsletter_ses_tenants");
  expect(migration).toContain("insert into public.newsletter_sending_identities");
  expect(migration).toContain("on conflict (profile_id) do nothing");
});

test("campaign claims return only trusted ready sender records", () => {
  expect(migration).toContain("reply_to_email text");
  expect(migration).toContain("tenant_name text");
  expect(migration).toContain("configuration_set_name text");
  expect(migration).toContain("identity.status = 'ready'");
  expect(migration).toContain("tenant.status = 'ready'");
});

test("the worker receives only the setup permissions it needs", () => {
  expect(migration).toContain("grant select");
  expect(migration).toContain("on table public.newsletter_ses_tenants to postpooch_worker");
  expect(migration).not.toContain(
    "grant all on table public.newsletter_ses_tenants to postpooch_worker",
  );
});
