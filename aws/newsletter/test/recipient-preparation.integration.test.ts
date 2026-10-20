import { Pool } from "pg";

const databaseUrl = process.env.NEWSLETTER_TEST_DATABASE_URL?.trim();
if (databaseUrl && !/test/i.test(new URL(databaseUrl).pathname)) {
  throw new Error("NEWSLETTER_TEST_DATABASE_URL must target a database whose name contains 'test'.");
}

const integrationTest = databaseUrl ? test : test.skip;

integrationTest(
  "prepares 100,000 fixed recipients within the 120-second Lambda timeout",
  async () => {
    const pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false }, max: 1 });
    const client = await pool.connect();
    try {
      await client.query("begin");
      const profile = await client.query<{ id: string }>("select id from public.profiles limit 1");
      const profileId = profile.rows[0]?.id;
      if (!profileId) throw new Error("The safe test database needs one profile fixture.");

      const audience = await client.query<{ id: string }>(
        "insert into public.newsletter_audiences (profile_id, name) values ($1, '100k performance test') returning id",
        [profileId],
      );
      const audienceId = audience.rows[0]!.id;
      await client.query(
        `
          with inserted as (
            insert into public.crm_contacts (
              profile_id, first_name, email, email_marketing_status,
              email_marketing_status_changed_at
            )
            select $1::uuid, 'Performance',
                   'newsletter-perf-' || n || '-' || gen_random_uuid() || '@example.com',
                   'subscribed', now()
            from generate_series(1, 100000) n
            returning id
          )
          insert into public.newsletter_audience_contact_connections (newsletter_audience_id, crm_contact_id)
          select $2::uuid, id from inserted
        `,
        [profileId, audienceId],
      );
      const email = await client.query<{ id: string }>(
        "insert into public.newsletter_emails (profile_id, content) values ($1, '{}'::jsonb) returning id",
        [profileId],
      );
      const campaign = await client.query<{ id: string }>(
        `
          insert into public.newsletter_campaigns (
            profile_id, newsletter_email_id, subject_line, from_name, from_email, status
          ) values ($1, $2, 'Performance test', 'PostPooch', 'test@example.com', 'queued')
          returning id
        `,
        [profileId, email.rows[0]!.id],
      );
      const campaignId = campaign.rows[0]!.id;
      await client.query(
        "insert into public.newsletter_campaign_audience_connections (newsletter_campaign_id, newsletter_audience_id) values ($1, $2)",
        [campaignId, audienceId],
      );

      const started = Date.now();
      const result = await client.query<{ send_count: number }>(
        "select * from public.newsletter_prepare_campaign($1::uuid)",
        [campaignId],
      );
      const durationMs = Date.now() - started;
      expect(result.rows[0]?.send_count).toBe(100_000);
      expect(durationMs).toBeLessThan(120_000);
    } finally {
      await client.query("rollback");
      client.release();
      await pool.end();
    }
  },
  240_000,
);
