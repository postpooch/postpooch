# PostPooch newsletter pipeline

This CDK app owns the two-stage newsletter delivery pipeline in `us-east-1`:

```text
Vercel -> campaign SQS -> dispatch Lambda -> send SQS -> email Lambda -> SES
```

The original delivery path is unchanged. A separate onboarding path prepares
the trusted sender records before a profile can enter that path:

```text
signup/login -> sender-setup SQS -> provisioning Lambda -> SES tenant + SES identity + Route 53
```

Each profile receives one deterministic tenant and one domain identity under
`postpoochmail.com`. The provisioning worker uses Route 53 UPSERT operations,
so retries and the existing-customer backfill do not create duplicate records.
It enables tenant-scoped bounce and complaint suppression, adds Easy DKIM and a
custom MAIL FROM domain, associates the identity and shared configuration set,
and marks the database rows ready only after SES confirms verification.

The send Lambda does not trust sender values from the browser or campaign
payload. Its protected database lookup resolves the campaign owner's ready
identity, confirmed reply address, tenant, and configuration set. It supplies
those values as `FromEmailAddress`, `ReplyToAddresses`, `TenantName`, and
`ConfigurationSetName` on the SES request.

Only versioned identifiers are placed in SQS. Supabase remains authoritative for campaign content, recipients, eligibility, claims, progress, and results.

CRM contacts default to the non-sendable `unknown` marketing state. A trusted
signup/import/CRM workflow must explicitly record `subscribed`; audience
membership alone is not treated as consent. Lambda #1 snapshots only contacts
whose current status is exactly `subscribed`, and Lambda #2 checks that status
again immediately before delivery.

## Runtime configuration

The stack takes CloudFormation parameters instead of storing deployment values in source:

- `DatabaseSecretArn`: an existing Secrets Manager secret in `us-east-1`. Its `SecretString` is either the database URL itself or JSON containing `DATABASE_URL`. Use the Supabase transaction-pooler URL for the existing least-privilege `postpooch_worker` login, not the `postgres` owner or an unrestricted direct connection. The migration grants that role only the newsletter tables/functions required by these Lambdas.
- `SesIdentityName`: an existing verified SES identity (email address or domain) in `us-east-1`.
- `SesFromEmail`: the verified address used in the email `From` header.
- `UnsubscribeBaseUrl`: for example `https://postpooch.com/api/newsletter/unsubscribe`.
- `SesConfigurationSet`: optional existing SES configuration set name.
- `SendingRootDomain`: the Route 53-owned root used for per-profile identities.
- `SendingHostedZoneId`: the exact hosted zone the provisioning role may edit.

Each warm Lambda execution reuses a pool capped at one connection because its
database operations are sequential. With the initial Lambda concurrency limits,
the newsletter pipeline can therefore consume at most seven worker-role client
connections before pooler multiplexing. Confirm shared pooler headroom with the
existing Trigger workers before deployment.

The Vercel project needs these server-only variables:

```text
NEWSLETTER_AWS_REGION=us-east-1
NEWSLETTER_CAMPAIGN_QUEUE_URL=<CampaignQueueUrl stack output>
NEWSLETTER_SENDER_SETUP_QUEUE_URL=<SenderSetupQueueUrl stack output>
NEWSLETTER_SES_CONFIGURATION_SET=my-first-configuration-set
```

The old global `NEWSLETTER_FROM_EMAIL` setting is no longer used. The sender
shown in the UI comes from the profile's protected database record.

## Existing profiles

The migration inserts one pending tenant and identity row for every existing
profile. Enqueue this exact versioned message once per non-ready profile:

```json
{"version":1,"type":"newsletter.sender.setup","profileId":"<profile UUID>"}
```

It is safe to enqueue the same profile more than once. AWS names are derived
from the full profile UUID, DNS writes are UPSERTs, and existing SES resources
are read and reused. Successful setup ends with both database rows at `ready`.
Failed or still-verifying work retains status and error details and is retried
through the setup queue and DLQ.

Give the Vercel AWS role the stack output `VercelDispatchPolicyArn`. Prefer Vercel's AWS/OIDC integration for short-lived credentials. If the integration injects standard AWS SDK credential variables, no application-specific credential variables are needed.

## Validation

```powershell
npm.cmd run build
npm.cmd test -- --runInBand
npm.cmd exec cdk synth -- --strict
npm.cmd exec cdk diff -- --parameters NewsletterStack:DatabaseSecretArn=<arn> --parameters NewsletterStack:SesIdentityName=<identity> --parameters NewsletterStack:SesFromEmail=<email> --parameters NewsletterStack:UnsubscribeBaseUrl=<url>
```

The 100,000-recipient preparation test is intentionally guarded. It rolls back all fixtures and refuses any database whose name does not contain `test`:

```powershell
$env:NEWSLETTER_TEST_DATABASE_URL='<safe test database URL>'
npm.cmd run test:integration
```

Do not deploy until the account-aware diff, SES identity, quota, and target account are reviewed and explicitly approved.

## Delivery semantics

SQS and Lambda are at-least-once. Database claims prevent concurrent sends and completed rows are not resent. A worker records `ses_request_started_at` immediately before SES. If SES may have accepted a message but the worker stops before Supabase records the result, an expired claim becomes `uncertain` for manual review instead of being automatically resent. This deliberately avoids claiming impossible exactly-once behavior across SES and PostgreSQL.

The send Lambda is initially capped at two concurrent executions and four emails/second per execution, for an aggregate ceiling of eight emails/second. It checks the rolling SES 24-hour quota before a batch and leaves quota-constrained work retryable/DLQ-visible rather than silently dropping it.
