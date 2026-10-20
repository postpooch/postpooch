import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { Pool } from "pg";

const secrets = new SecretsManagerClient({ maxAttempts: 3 });
let pool: Pool | undefined;
let databaseUrl: string | undefined;

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function getDatabaseUrl() {
  if (databaseUrl) return databaseUrl;
  const response = await secrets.send(
    new GetSecretValueCommand({ SecretId: required("DATABASE_SECRET_ARN") }),
  );
  const value = response.SecretString?.trim();
  if (!value) throw new Error("The database secret has no SecretString value");

  if (value.startsWith("{")) {
    const parsed = JSON.parse(value) as { DATABASE_URL?: unknown; databaseUrl?: unknown };
    const candidate = parsed.DATABASE_URL ?? parsed.databaseUrl;
    if (typeof candidate !== "string" || !candidate.trim()) {
      throw new Error("The database secret must contain DATABASE_URL");
    }
    databaseUrl = candidate.trim();
  } else {
    databaseUrl = value;
  }
  return databaseUrl;
}

export async function getDatabasePool() {
  if (pool) return pool;
  const connectionString = await getDatabaseUrl();
  pool = new Pool({
    connectionString,
    // Both Lambdas issue database operations sequentially. One reusable
    // connection per warm execution avoids consuming the shared worker role's
    // limited connection budget without reducing useful Lambda concurrency.
    max: 1,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    ssl: { rejectUnauthorized: false },
    application_name: process.env.AWS_LAMBDA_FUNCTION_NAME ?? "postpooch-newsletter-worker",
  });
  pool.on("error", (error) => {
    log("error", "database_pool_error", { errorName: error.name });
  });
  return pool;
}

export function log(
  level: "info" | "warn" | "error",
  event: string,
  fields: Record<string, unknown> = {},
) {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    service: process.env.POWERTOOLS_SERVICE_NAME ?? "postpooch-newsletter",
    ...fields,
  });
  if (level === "error") console.error(entry);
  else if (level === "warn") console.warn(entry);
  else console.info(entry);
}

export function safeError(error: unknown) {
  if (!(error instanceof Error)) return { errorName: "UnknownError", errorMessage: "Unknown failure" };
  return {
    errorName: error.name,
    errorMessage: error.message.slice(0, 500),
  };
}
