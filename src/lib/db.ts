import pg from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: pg.Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add it to your .env file.");
  }
  return new pg.Pool({
    connectionString,
    // Supabase requires TLS; the pooler certificate chain is not in Node's default store.
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
  });
}

/** Lazily created singleton, kept on globalThis so dev HMR doesn't leak connections. */
export function getPool(): pg.Pool {
  if (!globalThis.__pgPool) globalThis.__pgPool = createPool();
  return globalThis.__pgPool;
}

export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const res = await getPool().query<T>(text, params as any[]);
  return res.rows;
}

export async function queryOne<T extends pg.QueryResultRow = any>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

export async function withTransaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
