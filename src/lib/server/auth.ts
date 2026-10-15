import "server-only";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { authOptions } from "./auth-options";
import { getPool } from "./pool";

const base = authOptions(getPool());
export const auth = betterAuth({ ...base, plugins: [...(base.plugins ?? []), nextCookies()] });
