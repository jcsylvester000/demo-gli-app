"use server";

import { auth } from "@/lib/server/auth";
import { getPool, hasDatabase } from "@/lib/server/pool";
import { createUser, setPassword } from "@/lib/server/users";

/**
 * TESTING ONLY: a fixed admin login (admin / admin1234!) so the team can get in without resets or env changes.
 * On a match it makes sure the "admin" account exists with exactly this password (no forced change, two-step off),
 * then the normal sign-in runs. Turn it OFF before launch: set ADMIN_TEST_LOGIN=off in Netlify (or delete this file).
 */
const TEST_USER = "admin";
const TEST_PASSWORD = "admin1234!";

export async function prepareTestLogin(username: string, password: string): Promise<void> {
  if (process.env.ADMIN_TEST_LOGIN === "off") return;
  if (username.trim().toLowerCase() !== TEST_USER || password !== TEST_PASSWORD || !hasDatabase()) return;
  const pool = getPool();
  const found = await pool.query<{ id: string }>(`SELECT id FROM "user" WHERE lower(username) = $1`, [TEST_USER]);
  let id = found.rows[0]?.id;
  if (!id) {
    await createUser(auth as never, pool, { username: "Admin", name: "Admin", password: TEST_PASSWORD, role: "ADMIN", mustChangePassword: false });
    id = (await pool.query<{ id: string }>(`SELECT id FROM "user" WHERE lower(username) = $1`, [TEST_USER])).rows[0]?.id;
    if (!id) return;
  } else {
    await setPassword(auth as never, pool, id, TEST_PASSWORD, false);
  }
  await pool.query(`UPDATE "user" SET role = 'ADMIN', "twoFactorEnabled" = false WHERE id = $1`, [id]);
  await pool.query(`DELETE FROM "twoFactor" WHERE "userId" = $1`, [id]);
  await pool.query(`DELETE FROM "rateLimit" WHERE key LIKE '%sign-in%'`).catch(() => {});
}
