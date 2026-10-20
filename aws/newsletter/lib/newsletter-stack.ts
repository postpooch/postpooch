import * as path from "node:path";

import * as cdk from "aws-cdk-lib/core";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as iam from "aws-cdk-lib/aws-iam";
import * as kms from "aws-cdk-lib/aws-kms";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

const CAMPAIGN_FUNCTION_TIMEOUT_SECONDS = 120;
const SEND_FUNCTION_TIMEOUT_SECONDS = 60;
const SENDER_SETUP_FUNCTION_TIMEOUT_SECONDS = 60;
const SEND_EVENT_SOURCE_MAX_CONCURRENCY = 2;
const SEND_BATCH_SIZE = 10;
const SEND_RATE_PER_EXECUTION = 4;

export class NewsletterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const databaseSecretArn = new cdk.CfnParameter(this, "DatabaseSecretArn", {
      type: "String",
      noEcho: true,
      description: "ARN of an existing Secrets Manager secret containing DATABASE_URL for the Supabase transaction pooler.",
    });
    const sesIdentityName = new cdk.CfnParameter(this, "SesIdentityName", {
      type: "String",
      description: "Existing verified SES email address or domain identity in us-east-1.",
    });
    const unsubscribeBaseUrl = new cdk.CfnParameter(this, "UnsubscribeBaseUrl", {
      type: "String",
      description: "Public URL ending in /api/newsletter/unsubscribe.",
    });
    const sesConfigurationSet = new cdk.CfnParameter(this, "SesConfigurationSet", {
      type: "String",
      default: "",
      description: "Optional existing SES configuration set name.",
    });
    const sendingRootDomain = new cdk.CfnParameter(this, "SendingRootDomain", {
      type: "String",
      default: "postpoochmail.com",
      description: "Route 53 domain owned by PostPooch for customer sending identities.",
    });
    const sendingHostedZoneId = new cdk.CfnParameter(this, "SendingHostedZoneId", {
      type: "String",
      default: "Z024717134WYLEHOPEZCC",
      description: "Existing public Route 53 hosted zone ID for the sending root domain.",
    });

    const encryptionKey = new kms.Key(this, "NewsletterKey", {
      alias: "alias/postpooch-newsletter",
      description: "Encrypts PostPooch newsletter SQS queues.",
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const campaignDlq = new sqs.Queue(this, "CampaignDlq", {
      queueName: "postpooch-newsletter-campaigns-dlq",
      encryption: sqs.QueueEncryption.KMS,
      encryptionMasterKey: encryptionKey,
      enforceSSL: true,
      retentionPeriod: cdk.Duration.days(14),
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    const sendDlq = new sqs.Queue(this, "SendDlq", {
      queueName: "postpooch-newsletter-sends-dlq",
      encryption: sqs.QueueEncryption.KMS,
      encryptionMasterKey: encryptionKey,
      enforceSSL: true,
      retentionPeriod: cdk.Duration.days(14),
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    const senderSetupDlq = new sqs.Queue(this, "SenderSetupDlq", {
      queueName: "postpooch-newsletter-sender-setup-dlq",
      encryption: sqs.QueueEncryption.KMS,
      encryptionMasterKey: encryptionKey,
      enforceSSL: true,
      retentionPeriod: cdk.Duration.days(14),
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    const campaignQueue = new sqs.Queue(this, "CampaignQueue", {
      queueName: "postpooch-newsletter-campaigns",
      encryption: sqs.QueueEncryption.KMS,
      encryptionMasterKey: encryptionKey,
      enforceSSL: true,
      visibilityTimeout: cdk.Duration.seconds(CAMPAIGN_FUNCTION_TIMEOUT_SECONDS * 6),
      receiveMessageWaitTime: cdk.Duration.seconds(20),
      deadLetterQueue: { queue: campaignDlq, maxReceiveCount: 5 },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    const sendQueue = new sqs.Queue(this, "SendQueue", {
      queueName: "postpooch-newsletter-sends",
      encryption: sqs.QueueEncryption.KMS,
      encryptionMasterKey: encryptionKey,
      enforceSSL: true,
      visibilityTimeout: cdk.Duration.seconds(SEND_FUNCTION_TIMEOUT_SECONDS * 6),
      receiveMessageWaitTime: cdk.Duration.seconds(20),
      deadLetterQueue: { queue: sendDlq, maxReceiveCount: 5 },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    const senderSetupQueue = new sqs.Queue(this, "SenderSetupQueue", {
      queueName: "postpooch-newsletter-sender-setup",
      encryption: sqs.QueueEncryption.KMS,
      encryptionMasterKey: encryptionKey,
      enforceSSL: true,
      visibilityTimeout: cdk.Duration.seconds(SENDER_SETUP_FUNCTION_TIMEOUT_SECONDS * 6),
      receiveMessageWaitTime: cdk.Duration.seconds(20),
      deadLetterQueue: { queue: senderSetupDlq, maxReceiveCount: 8 },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const databaseSecret = secretsmanager.Secret.fromSecretCompleteArn(
      this,
      "DatabaseSecret",
      databaseSecretArn.valueAsString,
    );
    const dispatchLogGroup = new logs.LogGroup(this, "DispatchLogGroup", {
      logGroupName: "/aws/lambda/postpooch-newsletter-dispatch-campaign",
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    const sendLogGroup = new logs.LogGroup(this, "SendLogGroup", {
      logGroupName: "/aws/lambda/postpooch-newsletter-send-email",
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    const senderSetupLogGroup = new logs.LogGroup(this, "SenderSetupLogGroup", {
      logGroupName: "/aws/lambda/postpooch-newsletter-provision-sender",
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    const dispatchRole = new iam.Role(this, "DispatchRole", {
      roleName: "postpooch-newsletter-dispatch-campaign",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      description: "Least-privilege execution role for newsletter campaign dispatch.",
    });
    const sendRole = new iam.Role(this, "SendRole", {
      roleName: "postpooch-newsletter-send-email",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      description: "Least-privilege execution role for individual newsletter delivery.",
    });
    const senderSetupRole = new iam.Role(this, "SenderSetupRole", {
      roleName: "postpooch-newsletter-provision-sender",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      description: "Least-privilege execution role for customer SES sender setup.",
    });
    dispatchLogGroup.grantWrite(dispatchRole);
    sendLogGroup.grantWrite(sendRole);
    senderSetupLogGroup.grantWrite(senderSetupRole);
    for (const role of [dispatchRole, sendRole, senderSetupRole]) {
      // X-Ray write APIs do not support resource-level scoping.
      role.addToPolicy(
        new iam.PolicyStatement({
          actions: ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
          resources: ["*"],
        }),
      );
    }

    const commonBundling: lambdaNodejs.BundlingOptions = {
      minify: true,
      sourceMap: true,
      sourcesContent: false,
      target: "node22",
      bundleAwsSDK: true,
    };
    const dispatchFunction = new lambdaNodejs.NodejsFunction(this, "DispatchFunction", {
      functionName: "postpooch-newsletter-dispatch-campaign",
      description: "Prepares fixed campaign recipients and fans out one page to the individual-send queue.",
      entry: path.join(__dirname, "../functions/dispatch-campaign/index.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 512,
      timeout: cdk.Duration.seconds(CAMPAIGN_FUNCTION_TIMEOUT_SECONDS),
      role: dispatchRole,
      tracing: lambda.Tracing.ACTIVE,
      logGroup: dispatchLogGroup,
      bundling: commonBundling,
      environment: {
        DATABASE_SECRET_ARN: databaseSecretArn.valueAsString,
        CAMPAIGN_QUEUE_URL: campaignQueue.queueUrl,
        SEND_QUEUE_URL: sendQueue.queueUrl,
        POWERTOOLS_SERVICE_NAME: "postpooch-newsletter-dispatch-campaign",
      },
    });
    const sendFunction = new lambdaNodejs.NodejsFunction(this, "SendFunction", {
      functionName: "postpooch-newsletter-send-email",
      description: "Claims newsletter sends and sends one SES email per eligible recipient.",
      entry: path.join(__dirname, "../functions/send-email/index.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(SEND_FUNCTION_TIMEOUT_SECONDS),
      role: sendRole,
      tracing: lambda.Tracing.ACTIVE,
      logGroup: sendLogGroup,
      bundling: commonBundling,
      environment: {
        DATABASE_SECRET_ARN: databaseSecretArn.valueAsString,
        SES_CONFIGURATION_SET: sesConfigurationSet.valueAsString,
        UNSUBSCRIBE_BASE_URL: unsubscribeBaseUrl.valueAsString,
        SES_SEND_RATE_PER_EXECUTION: String(SEND_RATE_PER_EXECUTION),
        SES_DAILY_QUOTA_SAFETY_MARGIN: "100",
        POWERTOOLS_SERVICE_NAME: "postpooch-newsletter-send-email",
      },
    });
    const senderSetupFunction = new lambdaNodejs.NodejsFunction(this, "SenderSetupFunction", {
      functionName: "postpooch-newsletter-provision-sender",
      description: "Creates and verifies one SES identity and tenant for a PostPooch profile.",
      entry: path.join(__dirname, "../functions/provision-sender/index.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 512,
      timeout: cdk.Duration.seconds(SENDER_SETUP_FUNCTION_TIMEOUT_SECONDS),
      role: senderSetupRole,
      tracing: lambda.Tracing.ACTIVE,
      logGroup: senderSetupLogGroup,
      bundling: commonBundling,
      environment: {
        DATABASE_SECRET_ARN: databaseSecretArn.valueAsString,
        SENDER_SETUP_QUEUE_URL: senderSetupQueue.queueUrl,
        SENDING_ROOT_DOMAIN: sendingRootDomain.valueAsString,
        SES_CONFIGURATION_SET: sesConfigurationSet.valueAsString,
        POSTPOOCH_AWS_ACCOUNT_ID: this.account,
        POWERTOOLS_SERVICE_NAME: "postpooch-newsletter-provision-sender",
      },
    });

    dispatchFunction.addEventSource(
      new lambdaEventSources.SqsEventSource(campaignQueue, {
        batchSize: 1,
        maxBatchingWindow: cdk.Duration.seconds(0),
        maxConcurrency: 5,
      }),
    );
    sendFunction.addEventSource(
      new lambdaEventSources.SqsEventSource(sendQueue, {
        batchSize: SEND_BATCH_SIZE,
        maxBatchingWindow: cdk.Duration.seconds(0),
        reportBatchItemFailures: true,
        maxConcurrency: SEND_EVENT_SOURCE_MAX_CONCURRENCY,
      }),
    );
    senderSetupFunction.addEventSource(
      new lambdaEventSources.SqsEventSource(senderSetupQueue, {
        batchSize: 1,
        maxBatchingWindow: cdk.Duration.seconds(0),
        reportBatchItemFailures: true,
        maxConcurrency: 2,
      }),
    );

    campaignQueue.grantSendMessages(dispatchFunction);
    sendQueue.grantSendMessages(dispatchFunction);
    databaseSecret.grantRead(dispatchFunction);
    databaseSecret.grantRead(sendFunction);
    databaseSecret.grantRead(senderSetupFunction);
    senderSetupQueue.grantSendMessages(senderSetupFunction);

    const sesIdentityArn = cdk.Stack.of(this).formatArn({
      service: "ses",
      resource: "identity",
      resourceName: sesIdentityName.valueAsString,
    });
    const customerSesIdentityArn = cdk.Stack.of(this).formatArn({
      service: "ses",
      resource: "identity",
      resourceName: `*.${sendingRootDomain.valueAsString}`,
    });
    const sesConfigurationSetArn = cdk.Stack.of(this).formatArn({
      service: "ses",
      resource: "configuration-set",
      resourceName: sesConfigurationSet.valueAsString,
    });
    sendFunction.addToRolePolicy(
      new iam.PolicyStatement({
        sid: "SendFromPostPoochIdentity",
        actions: ["ses:SendEmail"],
        resources: [sesIdentityArn, customerSesIdentityArn, sesConfigurationSetArn],
      }),
    );
    // GetAccount is account-scoped and does not support resource-level IAM permissions.
    sendFunction.addToRolePolicy(
      new iam.PolicyStatement({
        sid: "ReadSesAccountQuota",
        actions: ["ses:GetAccount"],
        resources: ["*"],
      }),
    );

    // The provisioning Lambda's runtime AWS permissions are generated from its
    // SDK calls with IAM Policy Autopilot and kept explicitly scoped here.
    senderSetupFunction.addToRolePolicy(
      new iam.PolicyStatement({
        sid: "CreatePostPoochSesTenantsAndIdentities",
        actions: [
          "ses:CreateEmailIdentity",
          "ses:CreateTenant",
          "ses:GetTenant",
          "ses:TagResource",
        ],
        resources: ["*"],
      }),
    );
    senderSetupFunction.addToRolePolicy(
      new iam.PolicyStatement({
        sid: "ConfigurePostPoochSesTenantsAndIdentities",
        actions: [
          "ses:CreateTenantResourceAssociation",
          "ses:GetEmailIdentity",
          "ses:PutEmailIdentityConfigurationSetAttributes",
          "ses:PutEmailIdentityMailFromAttributes",
          "ses:PutTenantSuppressionAttributes",
        ],
        resources: [
          customerSesIdentityArn,
          sesConfigurationSetArn,
          cdk.Stack.of(this).formatArn({
            service: "ses",
            resource: "tenant",
            resourceName: "*/*",
          }),
        ],
      }),
    );
    senderSetupFunction.addToRolePolicy(
      new iam.PolicyStatement({
        sid: "DiscoverSendingDomainDns",
        actions: ["route53:ListHostedZonesByName"],
        resources: ["*"],
      }),
    );
    senderSetupFunction.addToRolePolicy(
      new iam.PolicyStatement({
        sid: "UpdateSendingDomainDns",
        actions: ["route53:ChangeResourceRecordSets"],
        resources: [`arn:${this.partition}:route53:::hostedzone/${sendingHostedZoneId.valueAsString}`],
      }),
    );

    const vercelDispatchPolicy = new iam.ManagedPolicy(this, "VercelDispatchPolicy", {
      managedPolicyName: "postpooch-newsletter-vercel-dispatch",
      description: "Allows Vercel to submit campaign identifiers to the newsletter dispatch queue only.",
      statements: [
        new iam.PolicyStatement({
          actions: ["sqs:SendMessage"],
          resources: [campaignQueue.queueArn, senderSetupQueue.queueArn],
        }),
        new iam.PolicyStatement({
          actions: ["kms:GenerateDataKey", "kms:Decrypt"],
          resources: [encryptionKey.keyArn],
          conditions: {
            StringEquals: { "kms:ViaService": `sqs.${this.region}.amazonaws.com` },
          },
        }),
      ],
    });

    this.addQueueAlarms(campaignQueue, campaignDlq, "Campaign", 900);
    this.addQueueAlarms(sendQueue, sendDlq, "Send", 900);
    this.addFunctionAlarms(dispatchFunction, "Dispatch");
    this.addFunctionAlarms(sendFunction, "SendEmail");
    this.addQueueAlarms(senderSetupQueue, senderSetupDlq, "SenderSetup", 900);
    this.addFunctionAlarms(senderSetupFunction, "SenderSetup");

    new cdk.CfnOutput(this, "CampaignQueueUrl", { value: campaignQueue.queueUrl });
    new cdk.CfnOutput(this, "CampaignQueueArn", { value: campaignQueue.queueArn });
    new cdk.CfnOutput(this, "SendQueueUrl", { value: sendQueue.queueUrl });
    new cdk.CfnOutput(this, "SenderSetupQueueUrl", { value: senderSetupQueue.queueUrl });
    new cdk.CfnOutput(this, "VercelDispatchPolicyArn", {
      value: vercelDispatchPolicy.managedPolicyArn,
    });
  }

  private addQueueAlarms(
    queue: sqs.IQueue,
    dlq: sqs.IQueue,
    prefix: string,
    oldestMessageSeconds: number,
  ) {
    new cloudwatch.Alarm(this, `${prefix}DlqMessagesAlarm`, {
      alarmName: `postpooch-newsletter-${prefix.toLowerCase()}-dlq-has-messages`,
      metric: dlq.metricApproximateNumberOfMessagesVisible({ period: cdk.Duration.minutes(1) }),
      threshold: 1,
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    new cloudwatch.Alarm(this, `${prefix}OldestMessageAlarm`, {
      alarmName: `postpooch-newsletter-${prefix.toLowerCase()}-oldest-message-age`,
      metric: queue.metricApproximateAgeOfOldestMessage({ period: cdk.Duration.minutes(1) }),
      threshold: oldestMessageSeconds,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
  }

  private addFunctionAlarms(fn: lambda.IFunction, prefix: string) {
    new cloudwatch.Alarm(this, `${prefix}ErrorsAlarm`, {
      alarmName: `postpooch-newsletter-${prefix.toLowerCase()}-errors`,
      metric: fn.metricErrors({ period: cdk.Duration.minutes(1) }),
      threshold: 1,
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    new cloudwatch.Alarm(this, `${prefix}ThrottlesAlarm`, {
      alarmName: `postpooch-newsletter-${prefix.toLowerCase()}-throttles`,
      metric: fn.metricThrottles({ period: cdk.Duration.minutes(1) }),
      threshold: 1,
      evaluationPeriods: 2,
      datapointsToAlarm: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
  }
}
