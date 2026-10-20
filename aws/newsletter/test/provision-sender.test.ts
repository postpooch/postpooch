import type { Route53Client } from "@aws-sdk/client-route-53";
import type { SESv2Client } from "@aws-sdk/client-sesv2";

import {
  ensureAwsSenderSetup,
  type SenderSetupRecord,
} from "../functions/provision-sender";

const setup: SenderSetupRecord = {
  profileId: "11111111-2222-4333-8444-555555555555",
  tenantName: "pp-11111111222243338444555555555555",
  identityDomain: "mail-11111111222243338444555555555555.postpoochmail.com",
  fromEmail:
    "sender-11111111222243338444555555555555@mail-11111111222243338444555555555555.postpoochmail.com",
  mailFromDomain:
    "bounce.mail-11111111222243338444555555555555.postpoochmail.com",
  replyToEmail: "owner@example.com",
  replyToVerified: true,
};

function namedError(name: string) {
  return Object.assign(new Error(name), { name });
}

test("creates the tenant, private suppression list, identity, and DNS idempotently", async () => {
  const sesSend = jest.fn(async (command: object) => {
    switch (command.constructor.name) {
      case "GetTenantCommand":
      case "GetEmailIdentityCommand":
        throw namedError("NotFoundException");
      case "CreateTenantCommand":
        return { TenantId: "tenant-id", TenantArn: "arn:aws:ses:us-east-1:1:tenant/abc" };
      case "CreateEmailIdentityCommand":
        return {
          VerificationStatus: "PENDING",
          DkimAttributes: { Tokens: ["one", "two", "three"] },
        };
      default:
        return {};
    }
  });
  const route53Send = jest.fn(async (command: object) => {
    if (command.constructor.name === "ListHostedZonesByNameCommand") {
      return {
        HostedZones: [
          { Id: "/hostedzone/ZONE", Name: "postpoochmail.com.", Config: { PrivateZone: false } },
        ],
      };
    }
    return { ChangeInfo: { Id: "change-id", Status: "PENDING" } };
  });

  const result = await ensureAwsSenderSetup(setup, {
    ses: { send: sesSend } as unknown as SESv2Client,
    route53: { send: route53Send } as unknown as Route53Client,
    accountId: "111111111111",
    region: "us-east-1",
    rootDomain: "postpoochmail.com",
    configurationSetName: "my-first-configuration-set",
  });

  expect(result.status).toBe("pending_verification");
  expect(result.dkimTokens).toEqual(["one", "two", "three"]);
  expect(sesSend.mock.calls.map(([command]) => command.constructor.name)).toEqual(
    expect.arrayContaining([
      "CreateTenantCommand",
      "PutTenantSuppressionAttributesCommand",
      "CreateEmailIdentityCommand",
      "PutEmailIdentityMailFromAttributesCommand",
    ]),
  );
  const dnsChange = route53Send.mock.calls.find(
    ([command]) => command.constructor.name === "ChangeResourceRecordSetsCommand",
  )?.[0] as { input?: { ChangeBatch?: { Changes?: unknown[] } } };
  expect(dnsChange.input?.ChangeBatch?.Changes).toHaveLength(5);
});

test("associates a verified identity and shared configuration set with its tenant", async () => {
  const sesSend = jest.fn(async (command: object) => {
    switch (command.constructor.name) {
      case "GetTenantCommand":
        return {
          Tenant: {
            TenantId: "tenant-id",
            TenantArn: "arn:aws:ses:us-east-1:111111111111:tenant/tenant-id",
            SendingStatus: "ENABLED",
          },
        };
      case "GetEmailIdentityCommand":
        return {
          VerifiedForSendingStatus: true,
          VerificationStatus: "SUCCESS",
          DkimAttributes: { Status: "SUCCESS", Tokens: ["one", "two", "three"] },
        };
      default:
        return {};
    }
  });
  const route53Send = jest.fn(async (command: object) => {
    if (command.constructor.name === "ListHostedZonesByNameCommand") {
      return {
        HostedZones: [
          { Id: "/hostedzone/ZONE", Name: "postpoochmail.com.", Config: { PrivateZone: false } },
        ],
      };
    }
    return { ChangeInfo: { Id: "change-id", Status: "INSYNC" } };
  });

  const result = await ensureAwsSenderSetup(setup, {
    ses: { send: sesSend } as unknown as SESv2Client,
    route53: { send: route53Send } as unknown as Route53Client,
    accountId: "111111111111",
    region: "us-east-1",
    rootDomain: "postpoochmail.com",
    configurationSetName: "my-first-configuration-set",
  });

  expect(result.status).toBe("ready");
  const associations = sesSend.mock.calls.filter(
    ([command]) => command.constructor.name === "CreateTenantResourceAssociationCommand",
  );
  expect(associations).toHaveLength(2);
  expect(associations.map(([command]) => (command as { input: { ResourceArn: string } }).input.ResourceArn)).toEqual(
    expect.arrayContaining([
      `arn:aws:ses:us-east-1:111111111111:identity/${setup.identityDomain}`,
      "arn:aws:ses:us-east-1:111111111111:configuration-set/my-first-configuration-set",
    ]),
  );
});

test("does not become ready without a confirmed customer reply address", async () => {
  await expect(
    ensureAwsSenderSetup(
      { ...setup, replyToVerified: false },
      {
        ses: { send: jest.fn() } as unknown as SESv2Client,
        route53: { send: jest.fn() } as unknown as Route53Client,
        accountId: "111111111111",
        region: "us-east-1",
        rootDomain: "postpoochmail.com",
        configurationSetName: "my-first-configuration-set",
      },
    ),
  ).resolves.toEqual(expect.objectContaining({ status: "pending_reply_verification" }));
});
