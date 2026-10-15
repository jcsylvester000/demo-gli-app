import "server-only";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { authOptions } from "./auth-options";
import { getPool } from "./pool";

const base = authOptions(getPool());
// During `next build` routes are evaluated without secrets; use a throwaway value so the build log stays clean.
// At runtime a missing BETTER_AUTH_SECRET still fails closed (and /api/health reports "secret_missing").
const secret = base.secret || (process.env.NEXT_PHASE === "phase-production-build" ? "build-phase-placeholder-never-used-for-sessions-0000" : undefined);
export const auth = betterAuth({ ...base, secret, plugins: [...(base.plugins ?? []), nextCookies()] });
