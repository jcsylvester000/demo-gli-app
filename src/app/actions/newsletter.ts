"use server";

import { z } from "zod";
import { getPool, hasDatabase } from "@/lib/server/pool";
import { ipHash } from "@/lib/server/request";

export type NewsletterState = { status: "idle" | "ok" | "error"; message?: string };

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a full email, e.g. name@company.com.").max(200),
  consent: z.literal("on", { message: "Please tick the box so we can send you Show Floor Notes." }),
  website: z.string().max(0).optional(), // honeypot: real people leave it empty
});

/** Newsletter sign-up (BRD FR-050): saved as a lead (kind = newsletter) with the consent version and time (RA 10173). */
export async function subscribeNewsletter(_prev: NewsletterState, form: FormData): Promise<NewsletterState> {
  const parsed = schema.safeParse({ email: form.get("email"), consent: form.get("consent"), website: form.get("website") ?? "" });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form." };
  if (!hasDatabase()) return { status: "error", message: "Sign-up is not available yet. Please try again later." };
  const pool = getPool();
  const ip = await ipHash();
  try {
    if (ip) {
      const { rows } = await pool.query<{ n: number }>(`SELECT count(*)::int AS n FROM lead WHERE ip_hash = $1 AND created_at > now() - interval '1 hour'`, [ip]);
      if (rows[0].n >= 5) return { status: "error", message: "Too many sign-ups from this connection. Please try again later." };
    }
    const exists = await pool.query(`SELECT 1 FROM lead WHERE kind = 'newsletter' AND lower(email) = $1 LIMIT 1`, [parsed.data.email]);
    if (!exists.rowCount) {
      await pool.query(
        `INSERT INTO lead (kind, email, consent_version, consent_at, newsletter_opt_in, ip_hash, landing_page) VALUES ('newsletter', $1, 'newsletter-v1', now(), true, $2, $3)`,
        [parsed.data.email, ip, String(form.get("page") || "").slice(0, 300) || null],
      );
    }
    return { status: "ok", message: "You're on the list. Thank you!" };
  } catch (e) {
    console.error("[newsletter] save failed:", (e as Error).message);
    return { status: "error", message: "Something went wrong on our side. Please try again." };
  }
}
