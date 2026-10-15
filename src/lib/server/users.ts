import type { Pool } from "pg";

// Same allow-list as auth-options.ts, shared through globalThis (this file must stay import-free for the scripts).
const pendingSignups: Set<string> = ((globalThis as { __gliPendingSignups?: Set<string> }).__gliPendingSignups ??= new Set<string>());

type AuthLike = {
  api: { signUpEmail: (a: { body: Record<string, unknown> }) => Promise<unknown> };
  $context: Promise<{ password: { hash: (p: string) => Promise<string> }; internalAdapter: { updatePassword: (userId: string, hash: string) => Promise<unknown> } }>;
};

export const USERNAME_RE = /^[A-Za-z0-9_.]{3,30}$/;
export type Role = "ADMIN" | "EDITOR" | "SALES";
export type NewUser = { username: string; name: string; email?: string; password: string; role: Role; mustChangePassword: boolean };

/** Creates an admin user (username + password). */
export async function createUser(auth: AuthLike, pool: Pool, u: NewUser) {
  if (!USERNAME_RE.test(u.username)) throw new Error("Username: 3–30 letters, numbers, dots or underscores.");
  const email = (u.email?.trim() || `${u.username.toLowerCase()}@users.gli.local`).toLowerCase();
  const taken = await pool.query(`SELECT 1 FROM "user" WHERE lower(username) = lower($1) OR lower(email) = $2`, [u.username, email]);
  if (taken.rowCount) throw new Error("That username or email is already in use.");
  pendingSignups.add(email);
  try {
    await auth.api.signUpEmail({ body: { email, password: u.password, name: u.name, username: u.username, displayUsername: u.username } });
  } finally {
    pendingSignups.delete(email);
  }
  const { rows } = await pool.query<{ id: string }>(`UPDATE "user" SET role = $1, "mustChangePassword" = $2, "emailVerified" = true WHERE lower(email) = $3 RETURNING id`, [
    u.role,
    u.mustChangePassword,
    email,
  ]);
  return rows[0]?.id;
}

/** Sets a password the same way Better Auth hashes it; optionally forces a change at next sign-in and ends sessions. */
export async function setPassword(auth: AuthLike, pool: Pool, userId: string, password: string, mustChangePassword: boolean) {
  const ctx = await auth.$context;
  await ctx.internalAdapter.updatePassword(userId, await ctx.password.hash(password));
  await pool.query(`UPDATE "user" SET "mustChangePassword" = $1 WHERE id = $2`, [mustChangePassword, userId]);
  if (mustChangePassword) await pool.query(`DELETE FROM "session" WHERE "userId" = $1`, [userId]);
}
