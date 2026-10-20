import * as cdk from "aws-cdk-lib/core";
import { Match, Template } from "aws-cdk-lib/assertions";

import { NewsletterStack } from "../lib/newsletter-stack";

let synthesized: Template | undefined;

function template() {
  if (synthesized) return synthesized;
  const app = new cdk.App();
  synthesized = Template.fromStack(
    new NewsletterStack(app, "TestNewsletterStack", {
      env: { account: "111111111111", region: "us-east-1" },
    }),
  );
  return synthesized;
}

test("preserves the two send queues and adds an encrypted sender-setup queue with a DLQ", () => {
  const output = template();
  output.resourceCountIs("AWS::SQS::Queue", 6);
  expect(
    Object.values(output.findResources("AWS::SQS::Queue")).every(
      (queue) => queue.DeletionPolicy === "Retain" && queue.UpdateReplacePolicy === "Retain",
    ),
  ).toBe(true);
  output.hasResourceProperties("AWS::SQS::Queue", {
    QueueName: "postpooch-newsletter-campaigns",
    VisibilityTimeout: 720,
    RedrivePolicy: Match.objectLike({ maxReceiveCount: 5 }),
    KmsMasterKeyId: Match.anyValue(),
  });
  output.hasResourceProperties("AWS::SQS::Queue", {
    QueueName: "postpooch-newsletter-sends",
    VisibilityTimeout: 360,
    RedrivePolicy: Match.objectLike({ maxReceiveCount: 5 }),
    KmsMasterKeyId: Match.anyValue(),
  });
  output.hasResourceProperties("AWS::SQS::Queue", {
    QueueName: "postpooch-newsletter-sender-setup",
    RedrivePolicy: Match.objectLike({ maxReceiveCount: 8 }),
    KmsMasterKeyId: Match.anyValue(),
  });
});

test("configures Lambda timeouts, event-source concurrency, and partial batch responses", () => {
  const output = template();
  output.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "postpooch-newsletter-dispatch-campaign",
    Timeout: 120,
  });
  output.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "postpooch-newsletter-provision-sender",
    Environment: {
      Variables: Match.objectLike({
        SENDING_ROOT_DOMAIN: Match.anyValue(),
        SES_CONFIGURATION_SET: Match.anyValue(),
      }),
    },
  });
  output.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "postpooch-newsletter-send-email",
    Timeout: 60,
    Environment: {
      Variables: Match.objectLike({ SES_SEND_RATE_PER_EXECUTION: "4" }),
    },
  });
  expect(
    Object.values(output.findResources("AWS::Lambda::Function")).every(
      (fn) => fn.Properties.ReservedConcurrentExecutions === undefined,
    ),
  ).toBe(true);
  output.hasResourceProperties("AWS::Lambda::EventSourceMapping", {
    BatchSize: 1,
    ScalingConfig: { MaximumConcurrency: 5 },
  });
  output.hasResourceProperties("AWS::Lambda::EventSourceMapping", {
    BatchSize: 10,
    MaximumBatchingWindowInSeconds: 0,
    FunctionResponseTypes: ["ReportBatchItemFailures"],
    ScalingConfig: { MaximumConcurrency: 2 },
  });
});

test("creates operational alarms and lets Vercel enqueue campaigns and sender setup only", () => {
  const output = template();
  output.resourceCountIs("AWS::CloudWatch::Alarm", 12);
  output.hasResourceProperties("AWS::IAM::ManagedPolicy", {
    ManagedPolicyName: "postpooch-newsletter-vercel-dispatch",
    PolicyDocument: {
      Statement: Match.arrayWith([
        Match.objectLike({ Action: "sqs:SendMessage", Effect: "Allow" }),
      ]),
    },
  });
  output.hasOutput("SenderSetupQueueUrl", {});
});
