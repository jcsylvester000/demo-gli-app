import "server-only";
import type { PoolClient } from "pg";
import { getPool } from "./pool";
import { autoReply, salesNotify, sendMail, teamAlert, type LeadForMail, type Mail } from "./email";

/**
 * Fan-out after a lead is saved (BRD FR-064): auto-reply, sales notification, team alert.
 * Each send is a row in `outbox`, written in the SAME transaction as the lead, then sent. A failed send is retried
 * with back-off (5, 10, 20, 40, 80 min) by later submissions, the scheduled job and the admin; the lead is never lost.
 */
export async function enqueueFanout(client: PoolClient, l: LeadForMail) {
  const items: [string, unknown][] = [
    ["auto_reply", autoReply(l)],
    ["sales_notify", salesNotify(l)],
  ];
  if (process.env.TEAM_ALERT_WEBHOOK_URL) items.push(["team_alert", teamAlert(l)]);
  for (const [channel, payload] of items) {
    await client.query(`INSERT INTO outbox (lead_id, channel, payload) VALUES ($1, $2, $3) ON CONFLICT (lead_id, channel) DO NOTHING`, [l.id, channel, JSON.stringify(payload)]);
  }
}

async function deliver(channel: string, payload: unknown) {
  if (channel === "team_alert") {
    const url = process.env.TEAM_ALERT_WEBHOOK_URL;
    if (!url) throw new Error("TEAM_ALERT_WEBHOOK_URL not set");
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error(`webhook ${r.status}`);
    return;
  }
  await sendMail(payload as Mail);
}

/** Sends due outbox rows (optionally only one lead's). Rows are claimed first so two runners never send twice. */
export async function processOutbox({ leadId, limit = 10 }: { leadId?: number; limit?: number } = {}) {
  const pool = getPool();
  const { rows } = await pool.query<{ id: number; lead_id: number; channel: string; payload: unknown; attempts: number }>(
    `UPDATE outbox SET next_attempt_at = now() + interval '3 minutes'
      WHERE id IN (
        SELECT id FROM outbox
         WHERE sent_at IS NULL AND attempts < 6 AND next_attempt_at <= now() ${leadId ? "AND lead_id = $2" : ""}
         ORDER BY created_at LIMIT $1)
      RETURNING id, lead_id, channel, payload, attempts`,
    leadId ? [limit, leadId] : [limit],
  );
  let sent = 0;
  for (const row of rows) {
    try {
      await deliver(row.channel, row.payload);
      await pool.query(`UPDATE outbox SET sent_at = now(), last_error = NULL WHERE id = $1`, [row.id]);
      await pool.query(`INSERT INTO lead_activity (lead_id, type, body) VALUES ($1, 'fanout_sent', $2)`, [row.lead_id, row.channel]);
      sent++;
    } catch (e) {
      const msg = (e as Error).message.slice(0, 300);
      const notConfigured = /not configured|not set|no recipient/.test(msg);
      // Missing configuration is not a failed attempt: it waits (15 min) and sends once settings are added.
      await pool.query(
        `UPDATE outbox SET attempts = attempts + $2, last_error = $3,
                next_attempt_at = now() + ($4 || ' minutes')::interval
          WHERE id = $1`,
        [row.id, notConfigured ? 0 : 1, msg, String(notConfigured ? 15 : 5 * 2 ** row.attempts)],
      );
      await pool.query(`INSERT INTO lead_activity (lead_id, type, body) VALUES ($1, 'fanout_failed', $2)`, [row.lead_id, `${row.channel}: ${msg}`]);
    }
  }
  return { claimed: rows.length, sent };
}
