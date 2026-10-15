import "server-only";

/**
 * Cloudflare Turnstile (BRD FR-062). Without keys, Cloudflare's published test keys are used: they always
 * pass, so forms keep working on previews; /api/health reports `turnstile: "test-keys"` until real keys are set.
 */
export const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";
const TEST_SECRET = "1x0000000000000000000000000000000AA";

export const turnstileSecret = () => process.env.TURNSTILE_SECRET_KEY || TEST_SECRET;
export const turnstileConfigured = () => Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

export async function verifyTurnstile(token: string | null | undefined, ip?: string | null): Promise<boolean> {
  if (!token) return false;
  const secret = turnstileSecret();
  if (secret === TEST_SECRET) return token.length > 0; // documented test key: always passes
  try {
    const body = new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) });
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, signal: AbortSignal.timeout(8000) });
    const j = (await r.json()) as { success?: boolean };
    return !!j.success;
  } catch (e) {
    console.error("[turnstile] verify failed:", (e as Error).message);
    return false;
  }
}
