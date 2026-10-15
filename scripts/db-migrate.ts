/**
 * Creates/updates all tables (idempotent), including the admin login tables (Better Auth), and on an empty user table
 * creates the first Admin: username "Admin", temporary password "Admin1234" (must be changed at first sign-in), or
 * ADMIN_INITIAL_PASSWORD if set. Runs locally (`npm run db:migrate`) and on every Netlify build.
 */
import { readFileSync } from "node:fs";
import nextEnv from "@next/env";
import pg from "pg";
import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { authOptions } from "../src/lib/server/auth-options.ts";
import { connectionString } from "../src/lib/server/pool.ts";
import { createUser } from "../src/lib/server/users.ts";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) {
  console.warn("[db:migrate] DATABASE_URL is not set; skipping. Add it in Netlify → Site configuration → Environment variables, then redeploy.");
  process.exit(0);
}
process.env.BETTER_AUTH_SECRET ||= "migration-only-secret-not-used-for-sessions";
const pool = new pg.Pool({ connectionString: connectionString(), max: Number(process.env.PG_POOL_MAX) || 2 });
try {
  await pool.query(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
  const options = authOptions(pool);
  const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(options);
  if (toBeCreated.length || toBeAdded.length) {
    console.log("[db:migrate] auth tables:", [...toBeCreated, ...toBeAdded].map((t) => t.table).join(", "));
    await runMigrations();
  }
  const { rows } = await pool.query<{ n: number }>(`SELECT count(*)::int AS n FROM "user"`);
  if (!rows[0].n) {
    const password = process.env.ADMIN_INITIAL_PASSWORD || "Admin1234";
    await createUser(betterAuth(options) as never, pool, { username: "Admin", name: "Admin", password, role: "ADMIN", mustChangePassword: true });
    console.log(`[db:migrate] created first account: username "Admin"${process.env.ADMIN_INITIAL_PASSWORD ? "" : ', temporary password "Admin1234"'} (must be changed at first sign-in)`);
  }
  const t = await pool.query<{ n: number }>(`SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema = 'public'`);
  console.log(`[db:migrate] done (${t.rows[0].n} tables)`);
} catch (e) {
  console.error("[db:migrate] failed:", (e as Error).message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
