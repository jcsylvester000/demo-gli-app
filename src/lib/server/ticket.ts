import "server-only";
import type { PoolClient } from "pg";

/** "2610" for October 2026, in Philippine time. */
export function yymmManila(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", year: "2-digit", month: "2-digit" }).formatToParts(d);
  return `${parts.find((p) => p.type === "year")!.value}${parts.find((p) => p.type === "month")!.value}`;
}

/**
 * Next ticket number GLI-YYMM-#### (BRD FR-063): unique and sequential per month. The counter row is
 * incremented atomically inside the caller's transaction, so simultaneous submissions never share a number.
 */
export async function nextTicketNo(client: PoolClient, d = new Date()): Promise<string> {
  const yymm = yymmManila(d);
  const { rows } = await client.query<{ last_no: number }>(
    `INSERT INTO ticket_counter (yymm, last_no) VALUES ($1, 1)
     ON CONFLICT (yymm) DO UPDATE SET last_no = ticket_counter.last_no + 1
     RETURNING last_no`,
    [yymm],
  );
  return `GLI-${yymm}-${String(rows[0].last_no).padStart(4, "0")}`;
}
