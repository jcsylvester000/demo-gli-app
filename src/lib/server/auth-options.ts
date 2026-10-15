import type { BetterAuthOptions } from "better-auth";
import { APIError } from "better-auth/api";
import { twoFactor, username } from "better-auth/plugins";
import type { Pool } from "pg";

/**
 * Admin authentication (Better Auth, tables in our Neon database). Shared by the app and scripts/db-migrate.ts,
 * so this file has no framework imports. Pattern proven on Drake-Farmland (agency W20).
 * - Username + password; public sign-up and email sign-in endpoints disabled (accounts are created by an Admin).
 * - New and reset accounts must choose a new password at first sign-in (mustChangePassword).
 * - Optional TOTP two-step verification. Database-backed rate limits (5 sign-in attempts / 15 min).
 * - 8-hour sessions; secure httpOnly cookies in production.
 */
export const pendingSignups: Set<string> = ((globalThis as { __gliPendingSignups?: Set<string> }).__gliPendingSignups ??= new Set<string>());

export function authOptions(pool: Pool): BetterAuthOptions {
  const baseURL = (process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "") || undefined;
  return {
    appName: "GLI Admin",
    baseURL,
    secret: process.env.BETTER_AUTH_SECRET,
    disabledPaths: ["/sign-up/email", "/sign-in/email"],
    trustedOrigins: [baseURL, process.env.NEXT_PUBLIC_SITE_URL, process.env.URL, process.env.DEPLOY_PRIME_URL].filter((x): x is string => Boolean(x)),
    database: pool,
    emailAndPassword: { enabled: true, minPasswordLength: 8, maxPasswordLength: 128, autoSignIn: false },
    user: {
      additionalFields: {
        role: { type: "string", input: false, defaultValue: "SALES" },
        mustChangePassword: { type: "boolean", input: false, defaultValue: true },
      },
    },
    session: { expiresIn: 60 * 60 * 8, updateAge: 60 * 30 },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 60,
      customRules: {
        "/sign-in/username": { window: 15 * 60, max: 5 },
        "/two-factor/verify-totp": { window: 15 * 60, max: 6 },
        "/two-factor/verify-backup-code": { window: 15 * 60, max: 5 },
      },
    },
    advanced: {
      cookiePrefix: "gli",
      useSecureCookies: process.env.NODE_ENV === "production" && !baseURL?.startsWith("http://"),
      ipAddress: { ipAddressHeaders: ["x-nf-client-connection-ip", "x-forwarded-for"] },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            if (!pendingSignups.has(user.email.toLowerCase())) throw new APIError("FORBIDDEN", { message: "Accounts are created by an administrator." });
            return { data: user };
          },
        },
      },
    },
    plugins: [username({ minUsernameLength: 3, maxUsernameLength: 30 }), twoFactor({ issuer: "GLI Admin" })],
  };
}
