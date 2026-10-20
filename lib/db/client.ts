import { Pool, type PoolConfig } from 'pg';

const localDatabaseHosts = new Set(['localhost', '127.0.0.1', '::1']);

const globalForPg = globalThis as typeof globalThis & {
  dbPool?: Pool;
};

function getSslConfig(databaseUrl: string): PoolConfig['ssl'] {
  try {
    const url = new URL(databaseUrl);
    const sslMode = url.searchParams.get('sslmode');

    if (sslMode === 'disable') {
      return false;
    }

    if (sslMode === 'require' || sslMode === 'no-verify') {
      return { rejectUnauthorized: false };
    }

    const hostname = url.hostname.replace(/^\[|\]$/g, '');

    if (localDatabaseHosts.has(hostname)) {
      return false;
    }
  } catch {
    return { rejectUnauthorized: false };
  }

  return { rejectUnauthorized: false };
}

export function getDbPool() {
  if (globalForPg.dbPool) {
    return globalForPg.dbPool;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('Missing database configuration.');
  }

  globalForPg.dbPool = new Pool({
    connectionString: databaseUrl,
    ssl: getSslConfig(databaseUrl),
  });

  return globalForPg.dbPool;
}
