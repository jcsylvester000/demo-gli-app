import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

/** Salted hash of the visitor IP, for rate limiting only (the raw IP is never stored). */
export async function ipHash(): Promise<string | null> {
  const h = await headers();
  const ip = h.get("x-nf-client-connection-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip");
  if (!ip) return null;
  return createHash("sha256").update(`${process.env.IP_HASH_SALT || "gli-dev-salt"}:${ip}`).digest("hex").slice(0, 32);
}
