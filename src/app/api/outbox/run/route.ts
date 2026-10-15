import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { processOutbox } from "@/lib/server/outbox";
import { getPool, hasDatabase } from "@/lib/server/pool";
import { uploadStore } from "@/lib/server/blob-store";

export const dynamic = "force-dynamic";

/** Retries queued emails/alerts. Called every 15 minutes by netlify/functions/outbox-retry.mts with CRON_SECRET. */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET || "";
  const given = req.headers.get("x-cron-secret") || "";
  const ok = secret.length >= 16 && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!hasDatabase()) return NextResponse.json({ ok: false, db: "not_configured" }, { status: 503 });
  const r = await processOutbox({ limit: 25 });
  // Remove uploads that were never attached to a ticket (abandoned forms) after a day.
  const pool = getPool();
  const stale = await pool.query<{ id: string }>(`SELECT id FROM upload_session WHERE status <> 'linked' AND created_at < now() - interval '1 day' LIMIT 100`);
  const store = await uploadStore();
  for (const u of stale.rows) {
    await store.deletePrefix(`${u.id}/`);
    await pool.query(`DELETE FROM upload_session WHERE id = $1`, [u.id]);
  }
  return NextResponse.json({ ok: true, ...r, uploadsCleaned: stale.rowCount });
}
