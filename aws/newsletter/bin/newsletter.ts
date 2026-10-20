#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { NewsletterStack } from '../lib/newsletter-stack';

const app = new cdk.App();
new NewsletterStack(app, 'NewsletterStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
  description: 'PostPooch two-stage newsletter dispatch and SES delivery pipeline',
  terminationProtection: true,
  tags: {
    Application: 'postpooch',
    Feature: 'newsletter',
    ManagedBy: 'aws-cdk',
  },
});
