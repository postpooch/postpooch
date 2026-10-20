import { S3Client } from "@aws-sdk/client-s3";
import { Pool } from "pg";
import Zernio from "@zernio/node";

import { getPostingEnvironment } from "./env";

let databasePool: Pool | undefined;
let r2Client: S3Client | undefined;
let zernioClient: Zernio | undefined;

export function getDatabasePool(): Pool {
  if (!databasePool) {
    const environment = getPostingEnvironment();
    databasePool = new Pool({
      connectionString: environment.databaseUrl,
      max: 2,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 10_000,
      allowExitOnIdle: true,
    });
  }

  return databasePool;
}

export function getR2Client(): S3Client {
  if (!r2Client) {
    const environment = getPostingEnvironment();
    r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${environment.r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: environment.r2AccessKeyId,
        secretAccessKey: environment.r2SecretAccessKey,
      },
    });
  }

  return r2Client;
}

export function getZernioClient(): Zernio {
  if (!zernioClient) {
    zernioClient = new Zernio({
      apiKey: getPostingEnvironment().zernioApiKey,
      timeout: 60_000,
    });
  }

  return zernioClient;
}
