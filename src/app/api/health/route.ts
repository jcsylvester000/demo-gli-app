import { NextResponse } from "next/server";
import { getPool, hasDatabase } from "@/lib/server/pool";

export const dynamic = "force-dynamic";

/** Deploy check: confirms the site can reach Neon and the schema exists. Returns no data, only status. */
export async function GET() {
  if (!hasDatabase()) return NextResponse.json({ ok: false, db: "not_configured" }, { status: 503 });
  try {
    const { rows } = await getPool().query<{ n: number }>(
      `SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('lead','lead_file','outbox','client_permission','case_status')`,
    );
    const ready = rows[0].n === 5;
    return NextResponse.json({ ok: ready, db: ready ? "ok" : "schema_missing" }, { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, db: "unreachable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
