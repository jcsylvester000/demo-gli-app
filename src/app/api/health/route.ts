import { NextResponse } from "next/server";
import { getPool, hasDatabase } from "@/lib/server/pool";
import { emailConfigured, salesInbox } from "@/lib/server/email";
import { turnstileConfigured } from "@/lib/server/turnstile";

/** Which integrations are configured (booleans only, never values). */
const config = () => ({
  email: emailConfigured() && salesInbox().length > 0 ? "configured" : "not_configured",
  turnstile: turnstileConfigured() ? "configured" : "test-keys",
  retryJob: (process.env.CRON_SECRET || "").length >= 16 ? "configured" : "not_configured",
  teamAlert: process.env.TEAM_ALERT_WEBHOOK_URL ? "configured" : "off",
  adminLogin: (process.env.BETTER_AUTH_SECRET || "").length < 32 ? "secret_missing" : !process.env.BETTER_AUTH_URL ? "url_missing" : "configured",
});

export const dynamic = "force-dynamic";

/** Deploy check: confirms the site can reach Neon and the schema exists. Returns no data, only status. */
export async function GET() {
  if (!hasDatabase()) return NextResponse.json({ ok: false, db: "not_configured" }, { status: 503 });
  try {
    const { rows } = await getPool().query<{ n: number }>(
      `SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('lead','lead_file','outbox','client_permission','case_status','upload_session')`,
    );
    const ready = rows[0].n === 6;
    return NextResponse.json({ ok: ready, db: ready ? "ok" : "schema_missing", ...config() }, { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, db: "unreachable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
