import pg, { Pool } from "pg";

// Return DATE columns as plain "YYYY-MM-DD" strings (no timezone shifting).
pg.types.setTypeParser(1082, (v) => v);

/**
 * One pg Pool per server instance (reused across hot reloads and warm serverless invocations).
 * DATABASE_URL = Neon *pooled* connection string. `channel_binding` is dropped (node-postgres doesn't need it; TLS stays required).
 * No framework imports here: scripts/db-migrate.ts reuses this file.
 */
export function connectionString(raw = process.env.DATABASE_URL) {
  if (!raw) throw new Error("DATABASE_URL is not set");
  const url = new URL(raw);
  url.searchParams.delete("channel_binding");
  if (url.searchParams.get("sslmode") === "require") url.searchParams.set("sslmode", "verify-full");
  return url.toString();
}

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

const g = globalThis as unknown as { __gliPool?: Pool };

export function getPool(): Pool {
  if (!g.__gliPool) {
    if (!process.env.DATABASE_URL) {
      // Never crash the build: Next evaluates route modules while collecting page data. Queries fail with a clear message instead.
      console.warn("[db] DATABASE_URL is not set: lead saving and the admin are disabled until it is added (Netlify → Environment variables).");
      g.__gliPool = new Pool({ max: 1, host: "database-url-not-set.invalid", connectionTimeoutMillis: 1000 });
    } else {
      g.__gliPool = new Pool({
        connectionString: connectionString(),
        max: Number(process.env.PG_POOL_MAX) || 5,
        idleTimeoutMillis: 10_000,
        connectionTimeoutMillis: 10_000,
      });
    }
    g.__gliPool.on("error", (e) => console.error("[db] idle client error", e.message));
  }
  return g.__gliPool;
}
