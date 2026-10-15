/**
 * Creates/updates all tables (idempotent). Runs locally (`npm run db:migrate`) and on every Netlify build.
 * Skips quietly when DATABASE_URL is not set, so a build without a database still succeeds.
 */
import { readFileSync } from "node:fs";
import nextEnv from "@next/env";
import pg from "pg";
import { connectionString } from "../src/lib/server/pool.ts";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) {
  console.warn("[db:migrate] DATABASE_URL is not set; skipping. Add it in Netlify → Site configuration → Environment variables, then redeploy.");
  process.exit(0);
}
const pool = new pg.Pool({ connectionString: connectionString(), max: Number(process.env.PG_POOL_MAX) || 2 });
try {
  await pool.query(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
  const { rows } = await pool.query<{ n: number }>(
    `SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema = 'public'`,
  );
  console.log(`[db:migrate] done (${rows[0].n} tables in public schema)`);
} catch (e) {
  console.error("[db:migrate] failed:", (e as Error).message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
