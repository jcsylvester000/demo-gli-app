/**
 * Creates/updates all tables (idempotent), including the admin login tables (Better Auth), and on an empty user table
 * creates the first Admin: username "Admin", temporary password "Admin1234" (must be changed at first sign-in), or
 * ADMIN_INITIAL_PASSWORD if set. Runs locally (`npm run db:migrate`) and on every Netlify build.
 *
 * Lock-out recovery: set ADMIN_RECOVERY_USERNAME + ADMIN_INITIAL_PASSWORD and redeploy. That user's password becomes
 * the temporary one (must be changed at sign-in), their sessions end and two-step is turned off. Runs once per
 * username/password pair (remembered in site_setting "admin_recovery"); remove both variables afterwards.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import nextEnv from "@next/env";
import pg from "pg";
import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { authOptions } from "../src/lib/server/auth-options.ts";
import { connectionString } from "../src/lib/server/pool.ts";
import { createUser, setPassword } from "../src/lib/server/users.ts";

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
  const recoverUser = process.env.ADMIN_RECOVERY_USERNAME?.trim().toLowerCase();
  const recoverPw = process.env.ADMIN_INITIAL_PASSWORD;
  if (recoverUser && recoverPw) {
    const marker = createHash("sha256").update(`${recoverUser}:${recoverPw}`).digest("hex");
    const done = await pool.query(`SELECT 1 FROM site_setting WHERE key = 'admin_recovery' AND value->>'marker' = $1`, [marker]);
    const u = await pool.query<{ id: string }>(`SELECT id FROM "user" WHERE username = $1`, [recoverUser]);
    if (!u.rows[0]) console.warn(`[db:migrate] recovery: no user "${recoverUser}"`);
    else if (done.rowCount) console.warn("[db:migrate] recovery already applied; remove ADMIN_RECOVERY_USERNAME from the environment.");
    else {
      const id = u.rows[0].id;
      await setPassword(betterAuth(options) as never, pool, id, recoverPw, true);
      await pool.query(`DELETE FROM session WHERE "userId" = $1`, [id]);
      await pool.query(`DELETE FROM "twoFactor" WHERE "userId" = $1`, [id]);
      await pool.query(`UPDATE "user" SET "twoFactorEnabled" = false WHERE id = $1`, [id]);
      await pool.query(
        `INSERT INTO site_setting (key, value, updated_at) VALUES ('admin_recovery', jsonb_build_object('marker', $1::text), now())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [marker],
      );
      await pool.query(`INSERT INTO admin_audit (actor_id, action, target) VALUES (NULL, 'user.recovery_reset', $1)`, [`user:${id}`]);
      console.warn(`[db:migrate] recovery: "${recoverUser}" reset to the temporary password, sessions ended, two-step off. Remove ADMIN_RECOVERY_USERNAME now.`);
    }
  }
  const t = await pool.query<{ n: number }>(`SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema = 'public'`);
  console.log(`[db:migrate] done (${t.rows[0].n} tables)`);
} catch (e) {
  console.error("[db:migrate] failed:", (e as Error).message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
