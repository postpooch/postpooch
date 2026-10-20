import {
  ChangeResourceRecordSetsCommand,
  ListHostedZonesByNameCommand,
  Route53Client,
  type ResourceRecordSet,
} from "@aws-sdk/client-route-53";
import {
  CreateEmailIdentityCommand,
  CreateTenantCommand,
  CreateTenantResourceAssociationCommand,
  GetEmailIdentityCommand,
  GetTenantCommand,
  PutEmailIdentityConfigurationSetAttributesCommand,
  PutEmailIdentityMailFromAttributesCommand,
  PutTenantSuppressionAttributesCommand,
  SESv2Client,
} from "@aws-sdk/client-sesv2";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import type { SQSBatchResponse, SQSEvent } from "aws-lambda";
import type { Pool } from "pg";

import {
  newsletterSenderSetupMessage,
  newsletterSenderSetupMessageSchema,
} from "../../../../shared/newsletter/messages";
import { getDatabasePool, log, safeError } from "../shared/database";

export type SenderSetupRecord = {
  profileId: string;
  tenantName: string;
  identityDomain: string;
  fromEmail: string;
  mailFromDomain: string;
  replyToEmail: string;
  replyToVerified: boolean;
};

export type AwsSenderSetupDependencies = {
  ses: SESv2Client;
  route53: Route53Client;
  accountId: string;
  region: string;
  rootDomain: string;
  configurationSetName: string;
};

export type AwsSenderSetupResult = {
  status: "ready" | "pending_verification" | "pending_reply_verification";
  tenantId?: string;
  tenantArn?: string;
  identityArn?: string;
  dkimTokens?: string[];
  verificationStatus?: string;
};

const runtimeRegion = process.env.AWS_REGION?.trim() || "us-east-1";
const ses = new SESv2Client({ region: runtimeRegion, maxAttempts: 3 });
const route53 = new Route53Client({ region: "us-east-1", maxAttempts: 3 });
const sqs = new SQSClient({ region: runtimeRegion, maxAttempts: 3 });

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function isNotFound(error: unknown) {
  return error instanceof Error && ["NotFoundException", "ResourceNotFoundException"].includes(error.name);
}

function isAlreadyExists(error: unknown) {
  return error instanceof Error && ["AlreadyExistsException", "ConflictException"].includes(error.name);
}

function normalizeDnsName(value: string) {
  return value.trim().replace(/\.$/, "").toLowerCase();
}

async function findPublicHostedZone(client: Route53Client, rootDomain: string) {
  const response = await client.send(
    new ListHostedZonesByNameCommand({ DNSName: rootDomain, MaxItems: 10 }),
  );
  const zone = response.HostedZones?.find(
    (candidate) =>
      normalizeDnsName(candidate.Name ?? "") === normalizeDnsName(rootDomain) &&
      candidate.Config?.PrivateZone !== true,
  );
  if (!zone?.Id) throw new Error(`No public Route 53 hosted zone exists for ${rootDomain}`);
  return zone.Id.replace(/^\/hostedzone\//, "");
}

function dkimRecords(identityDomain: string, tokens: string[]): ResourceRecordSet[] {
  if (tokens.length !== 3) throw new Error("SES did not return all three DKIM records");
  return tokens.map((token) => ({
    Name: `${token}._domainkey.${identityDomain}`,
    Type: "CNAME",
    TTL: 300,
    ResourceRecords: [{ Value: `${token}.dkim.amazonses.com` }],
  }));
}

function mailFromRecords(mailFromDomain: string, region: string): ResourceRecordSet[] {
  return [
    {
      Name: mailFromDomain,
      Type: "MX",
      TTL: 300,
      ResourceRecords: [{ Value: `10 feedback-smtp.${region}.amazonses.com` }],
    },
    {
      Name: mailFromDomain,
      Type: "TXT",
      TTL: 300,
      ResourceRecords: [{ Value: '"v=spf1 include:amazonses.com -all"' }],
    },
  ];
}

async function upsertDnsRecords(
  client: Route53Client,
  hostedZoneId: string,
  records: ResourceRecordSet[],
) {
  await client.send(
    new ChangeResourceRecordSetsCommand({
      HostedZoneId: hostedZoneId,
      ChangeBatch: {
        Comment: "PostPooch customer SES identity authentication",
        Changes: records.map((ResourceRecordSet) => ({ Action: "UPSERT", ResourceRecordSet })),
      },
    }),
  );
}

async function getOrCreateTenant(
  setup: SenderSetupRecord,
  dependencies: AwsSenderSetupDependencies,
) {
  try {
    const existing = await dependencies.ses.send(
      new GetTenantCommand({ TenantName: setup.tenantName }),
    );
    return existing.Tenant;
  } catch (error) {
    if (!isNotFound(error)) throw error;
  }

  try {
    const created = await dependencies.ses.send(
      new CreateTenantCommand({
        TenantName: setup.tenantName,
        Tags: [
          { Key: "Application", Value: "postpooch" },
          { Key: "ProfileId", Value: setup.profileId },
        ],
        SuppressionAttributes: {
          SuppressionScope: "TENANT",
          SuppressedReasons: ["BOUNCE", "COMPLAINT"],
        },
      }),
    );
    return created;
  } catch (error) {
    if (!isAlreadyExists(error)) throw error;
    return (await dependencies.ses.send(
      new GetTenantCommand({ TenantName: setup.tenantName }),
    )).Tenant;
  }
}

async function getOrCreateIdentity(
  setup: SenderSetupRecord,
  dependencies: AwsSenderSetupDependencies,
) {
  try {
    return await dependencies.ses.send(
      new GetEmailIdentityCommand({ EmailIdentity: setup.identityDomain }),
    );
  } catch (error) {
    if (!isNotFound(error)) throw error;
  }

  try {
    return await dependencies.ses.send(
      new CreateEmailIdentityCommand({
        EmailIdentity: setup.identityDomain,
        ConfigurationSetName: dependencies.configurationSetName,
        DkimSigningAttributes: { NextSigningKeyLength: "RSA_2048_BIT" },
        Tags: [
          { Key: "Application", Value: "postpooch" },
          { Key: "ProfileId", Value: setup.profileId },
        ],
      }),
    );
  } catch (error) {
    if (!isAlreadyExists(error)) throw error;
    return dependencies.ses.send(
      new GetEmailIdentityCommand({ EmailIdentity: setup.identityDomain }),
    );
  }
}

async function associateResource(
  dependencies: AwsSenderSetupDependencies,
  tenantName: string,
  resourceArn: string,
) {
  try {
    await dependencies.ses.send(
      new CreateTenantResourceAssociationCommand({ TenantName: tenantName, ResourceArn: resourceArn }),
    );
  } catch (error) {
    if (!isAlreadyExists(error)) throw error;
  }
}

export async function ensureAwsSenderSetup(
  setup: SenderSetupRecord,
  dependencies: AwsSenderSetupDependencies,
): Promise<AwsSenderSetupResult> {
  if (!setup.replyToVerified) return { status: "pending_reply_verification" };
  if (
    normalizeDnsName(setup.identityDomain) === normalizeDnsName(dependencies.rootDomain) ||
    !normalizeDnsName(setup.identityDomain).endsWith(`.${normalizeDnsName(dependencies.rootDomain)}`)
  ) {
    throw new Error("The sender identity is outside the configured PostPooch sending domain");
  }

  const hostedZoneId = await findPublicHostedZone(dependencies.route53, dependencies.rootDomain);
  const tenant = await getOrCreateTenant(setup, dependencies);
  await dependencies.ses.send(
    new PutTenantSuppressionAttributesCommand({
      TenantName: setup.tenantName,
      SuppressionScope: "TENANT",
      SuppressedReasons: ["BOUNCE", "COMPLAINT"],
    }),
  );

  const identity = await getOrCreateIdentity(setup, dependencies);
  const identityStatus = identity as typeof identity & {
    VerificationStatus?: string;
    VerifiedForSendingStatus?: boolean;
  };
  const tokens = identity.DkimAttributes?.Tokens ?? [];
  await upsertDnsRecords(dependencies.route53, hostedZoneId, [
    ...dkimRecords(setup.identityDomain, tokens),
    ...mailFromRecords(setup.mailFromDomain, dependencies.region),
  ]);
  await dependencies.ses.send(
    new PutEmailIdentityMailFromAttributesCommand({
      EmailIdentity: setup.identityDomain,
      MailFromDomain: setup.mailFromDomain,
      BehaviorOnMxFailure: "REJECT_MESSAGE",
    }),
  );
  await dependencies.ses.send(
    new PutEmailIdentityConfigurationSetAttributesCommand({
      EmailIdentity: setup.identityDomain,
      ConfigurationSetName: dependencies.configurationSetName,
    }),
  );

  const tenantArn = tenant?.TenantArn;
  const tenantId = tenant?.TenantId;
  const identityArn = `arn:aws:ses:${dependencies.region}:${dependencies.accountId}:identity/${setup.identityDomain}`;
  const verified =
    identityStatus.VerifiedForSendingStatus === true &&
    identityStatus.VerificationStatus === "SUCCESS" &&
    identity.DkimAttributes?.Status === "SUCCESS";
  if (!verified) {
    return {
      status: "pending_verification",
      tenantId,
      tenantArn,
      identityArn,
      dkimTokens: tokens,
      verificationStatus: identityStatus.VerificationStatus ?? identity.DkimAttributes?.Status ?? "PENDING",
    };
  }

  await associateResource(dependencies, setup.tenantName, identityArn);
  await associateResource(
    dependencies,
    setup.tenantName,
    `arn:aws:ses:${dependencies.region}:${dependencies.accountId}:configuration-set/${dependencies.configurationSetName}`,
  );
  return {
    status: "ready",
    tenantId,
    tenantArn,
    identityArn,
    dkimTokens: tokens,
    verificationStatus: "SUCCESS",
  };
}

async function loadSetup(database: Pool, profileId: string) {
  const result = await database.query<SenderSetupRecord>(
    `
      select
        tenant.profile_id as "profileId",
        tenant.tenant_name as "tenantName",
        identity.identity_domain as "identityDomain",
        identity.from_email as "fromEmail",
        identity.mail_from_domain as "mailFromDomain",
        identity.reply_to_email as "replyToEmail",
        identity.reply_to_verified_at is not null as "replyToVerified"
      from public.newsletter_ses_tenants tenant
      join public.newsletter_sending_identities identity on identity.profile_id = tenant.profile_id
      where tenant.profile_id = $1::uuid
      limit 1
    `,
    [profileId],
  );
  if (!result.rows[0]) throw new Error("Newsletter sender setup record not found");
  return result.rows[0];
}

async function recordAttempt(database: Pool, profileId: string) {
  await database.query(
    `
      update public.newsletter_ses_tenants
      set status = 'provisioning', attempt_count = attempt_count + 1,
          last_attempt_at = now(), last_error = null, updated_at = now()
      where profile_id = $1::uuid
    `,
    [profileId],
  );
  await database.query(
    `update public.newsletter_sending_identities set status = 'provisioning', last_error = null, updated_at = now() where profile_id = $1::uuid`,
    [profileId],
  );
}

async function recordResult(database: Pool, profileId: string, result: AwsSenderSetupResult) {
  const ready = result.status === "ready";
  await database.query(
    `
      update public.newsletter_ses_tenants
      set status = $2, ses_tenant_id = coalesce($3, ses_tenant_id),
          ses_tenant_arn = coalesce($4, ses_tenant_arn),
          suppression_scope = 'TENANT', reputation_policy = 'STANDARD',
          ready_at = case when $2 = 'ready' then coalesce(ready_at, now()) else ready_at end,
          next_attempt_at = case when $2 = 'ready' then null else now() + interval '1 minute' end,
          updated_at = now()
      where profile_id = $1::uuid
    `,
    [profileId, ready ? "ready" : "pending", result.tenantId ?? null, result.tenantArn ?? null],
  );
  await database.query(
    `
      update public.newsletter_sending_identities
      set status = $2, ses_identity_arn = coalesce($3, ses_identity_arn),
          verification_status = coalesce($4, verification_status), dkim_tokens = coalesce($5, dkim_tokens),
          verified_at = case when $2 = 'ready' then coalesce(verified_at, now()) else verified_at end,
          ready_at = case when $2 = 'ready' then coalesce(ready_at, now()) else ready_at end,
          updated_at = now()
      where profile_id = $1::uuid
    `,
    [profileId, ready ? "ready" : "pending", result.identityArn ?? null, result.verificationStatus ?? null, result.dkimTokens ?? null],
  );
}

async function recordFailure(database: Pool, profileId: string, error: unknown) {
  const message = `${safeError(error).errorName}: ${safeError(error).errorMessage}`.slice(0, 2_000);
  await database.query(
    `update public.newsletter_ses_tenants set status = 'failed', last_error = $2, next_attempt_at = now() + interval '5 minutes', updated_at = now() where profile_id = $1::uuid`,
    [profileId, message],
  );
  await database.query(
    `update public.newsletter_sending_identities set status = 'failed', last_error = $2, updated_at = now() where profile_id = $1::uuid`,
    [profileId, message],
  );
}

export async function handler(event: SQSEvent): Promise<SQSBatchResponse> {
  const database = await getDatabasePool();
  const queueUrl = required("SENDER_SETUP_QUEUE_URL");
  const dependencies: AwsSenderSetupDependencies = {
    ses,
    route53,
    accountId: required("POSTPOOCH_AWS_ACCOUNT_ID"),
    region: runtimeRegion,
    rootDomain: required("SENDING_ROOT_DOMAIN"),
    configurationSetName: required("SES_CONFIGURATION_SET"),
  };
  const failures: { itemIdentifier: string }[] = [];
  for (const record of event.Records) {
    let profileId: string | undefined;
    try {
      const message = newsletterSenderSetupMessageSchema.parse(JSON.parse(record.body));
      profileId = message.profileId;
      const setup = await loadSetup(database, profileId);
      await recordAttempt(database, profileId);
      const result = await ensureAwsSenderSetup(setup, dependencies);
      await recordResult(database, profileId, result);
      if (result.status !== "ready") {
        await sqs.send(
          new SendMessageCommand({
            QueueUrl: queueUrl,
            DelaySeconds: result.status === "pending_reply_verification" ? 300 : 60,
            MessageBody: JSON.stringify(newsletterSenderSetupMessage(profileId)),
          }),
        );
      }
      log("info", "newsletter_sender_setup_processed", { profileId, status: result.status });
    } catch (error) {
      if (profileId) await recordFailure(database, profileId, error);
      failures.push({ itemIdentifier: record.messageId });
      log("error", "newsletter_sender_setup_failed", { profileId, ...safeError(error) });
    }
  }
  return { batchItemFailures: failures };
}
