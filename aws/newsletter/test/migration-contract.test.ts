import { readFileSync } from "node:fs";
import path from "node:path";

const migration = readFileSync(
  path.resolve(
    __dirname,
    "../../../supabase/migrations/20261009000000_newsletter_delivery_pipeline.sql",
  ),
  "utf8",
);

test("unknown consent is the safe default and only subscribed contacts are prepared", () => {
  expect(migration).toContain("email_marketing_status text not null default 'unknown'");
  expect(migration).toContain("c.email_marketing_status = 'subscribed'");
  expect(migration).not.toContain("email_marketing_status text not null default 'subscribed'");
});

test("legacy uniqueness conflicts abort inside an explicit transaction", () => {
  expect(migration).toMatch(/\bbegin;[\s\S]*duplicate legacy rows require manual review[\s\S]*\bcommit;/);
});

test("the worker receives column-scoped direct table permissions", () => {
  expect(migration).toContain("grant update (queued_at)");
  expect(migration).toContain("grant execute on function public.newsletter_prepare_campaign(uuid)");
  expect(migration).not.toContain(
    "grant select, update on table public.newsletter_campaigns to postpooch_worker",
  );
  expect(migration).not.toContain(
    "grant select, update on table public.newsletter_sends to postpooch_worker",
  );
});
