import "server-only";
import { getPool } from "../pool";

/**
 * Response target (BRD BO-5): one business day. A lead is overdue when it is still "new" after the next business
 * day (Manila time; weekends skipped). Holidays are not modelled.
 */
export function businessDeadline(created: Date): Date {
  const d = new Date(created.getTime() + 24 * 3600 * 1000);
  const dow = () => new Date(d.toLocaleString("en-US", { timeZone: "Asia/Manila" })).getDay();
  while (dow() === 0 || dow() === 6) d.setTime(d.getTime() + 24 * 3600 * 1000);
  return d;
}
export const isOverdue = (status: string, created: Date | string) => status === "new" && businessDeadline(new Date(created)) < new Date();

export type LeadRow = {
  id: string;
  ticket_no: string | null;
  kind: "quote" | "contact" | "newsletter";
  status: string;
  priority: string | null;
  name: string | null;
  company: string | null;
  email: string;
  services: string[];
  follow_up_at: string | null;
  owner_name: string | null;
  created_at: string;
  files: number;
};

export type LeadFilters = { q?: string; status?: string; kind?: string; service?: string; from?: string; to?: string; page?: number; overdue?: boolean };

function where(f: LeadFilters) {
  const w: string[] = [];
  const p: unknown[] = [];
  const add = (sql: string, v: unknown) => {
    p.push(v);
    w.push(sql.replace("?", `$${p.length}`));
  };
  if (f.q) {
    p.push(`%${f.q.trim().toLowerCase()}%`);
    const n = `$${p.length}`;
    w.push(`(lower(coalesce(l.name,'')) LIKE ${n} OR lower(coalesce(l.company,'')) LIKE ${n} OR lower(l.email) LIKE ${n} OR lower(coalesce(l.ticket_no,'')) LIKE ${n} OR coalesce(l.mobile,'') LIKE ${n})`);
  }
  if (f.status) add("l.status = ?", f.status);
  if (f.kind) add("l.kind = ?", f.kind);
  else w.push("l.kind IN ('quote','contact')");
  if (f.service) add("? = ANY(l.services)", f.service);
  if (f.from) add("l.created_at >= ?::date", f.from);
  if (f.to) add("l.created_at < (?::date + 1)", f.to);
  if (f.overdue) w.push("l.status = 'new' AND l.created_at < now() - interval '1 day'");
  return { sql: w.length ? `WHERE ${w.join(" AND ")}` : "", params: p };
}

export const PAGE_SIZE = 25;

export async function listLeads(f: LeadFilters) {
  const { sql, params } = where(f);
  const pool = getPool();
  const page = Math.max(1, f.page ?? 1);
  const [rows, count] = await Promise.all([
    pool.query<LeadRow>(
      `SELECT l.id, l.ticket_no, l.kind, l.status, l.priority, l.name, l.company, l.email, l.services, l.follow_up_at::text, u.name AS owner_name, l.created_at,
              (SELECT count(*)::int FROM lead_file f WHERE f.lead_id = l.id) AS files
         FROM lead l LEFT JOIN "user" u ON u.id = l.owner_id
         ${sql} ORDER BY l.created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`,
      params,
    ),
    pool.query<{ n: number }>(`SELECT count(*)::int AS n FROM lead l ${sql}`, params),
  ]);
  return { rows: rows.rows, total: count.rows[0].n, page };
}

/** All matching rows for CSV export (no paging). */
export async function exportLeads(f: LeadFilters) {
  const { sql, params } = where(f);
  const { rows } = await getPool().query(
    `SELECT l.ticket_no, l.created_at, l.kind, l.status, l.lost_reason, l.priority, l.name, l.company, l.email, l.mobile, l.preferred_channel,
            array_to_string(l.services, '; ') AS services, l.industry, array_to_string(l.products, '; ') AS products, l.event_date::text, l.venue, l.qty_sizes,
            l.budget_band, l.notes, l.follow_up_at::text, u.name AS owner, l.utm_source, l.utm_medium, l.utm_campaign, l.landing_page,
            l.consent_version, l.consent_at, l.newsletter_opt_in,
            (SELECT count(*)::int FROM lead_file f WHERE f.lead_id = l.id) AS files
       FROM lead l LEFT JOIN "user" u ON u.id = l.owner_id ${sql} ORDER BY l.created_at DESC LIMIT 10000`,
    params,
  );
  return rows as Record<string, unknown>[];
}

export async function getLead(id: number) {
  const pool = getPool();
  const lead = await pool.query(`SELECT l.*, l.event_date::text AS event_date_text, l.follow_up_at::text AS follow_up_text FROM lead l WHERE l.id = $1`, [id]);
  if (!lead.rowCount) return null;
  const [files, activity, users] = await Promise.all([
    pool.query<{ id: string; filename: string; size_bytes: number; created_at: string }>(`SELECT id, filename, size_bytes, created_at FROM lead_file WHERE lead_id = $1 ORDER BY id`, [id]),
    pool.query<{ type: string; body: string | null; created_at: string; actor: string | null }>(
      `SELECT a.type, a.body, a.created_at, u.name AS actor FROM lead_activity a LEFT JOIN "user" u ON u.id = a.actor_id WHERE a.lead_id = $1 ORDER BY a.created_at DESC, a.id DESC`,
      [id],
    ),
    pool.query<{ id: string; name: string; role: string }>(`SELECT id, name, role FROM "user" WHERE role IN ('ADMIN','SALES') ORDER BY name`),
  ]);
  return { lead: lead.rows[0] as Record<string, unknown> & { id: string; status: string; created_at: string; kind: string }, files: files.rows, activity: activity.rows, users: users.rows };
}

export async function overviewStats() {
  const pool = getPool();
  const [totals, newRows, byService, bySource, daily, followUps, newsletter] = await Promise.all([
    pool.query<{ week: number; month: number; open: number; won: number }>(
      `SELECT count(*) FILTER (WHERE created_at > now() - interval '7 days')::int AS week,
              count(*) FILTER (WHERE created_at > now() - interval '30 days')::int AS month,
              count(*) FILTER (WHERE status IN ('new','contacted','proposal_sent'))::int AS open,
              count(*) FILTER (WHERE status = 'won' AND updated_at > now() - interval '90 days')::int AS won
         FROM lead WHERE kind IN ('quote','contact')`,
    ),
    pool.query<{ id: string; created_at: string; ticket_no: string | null; name: string | null; company: string | null }>(
      `SELECT id, created_at, ticket_no, name, company FROM lead WHERE kind IN ('quote','contact') AND status = 'new' ORDER BY created_at`,
    ),
    pool.query<{ service: string; n: number }>(
      `SELECT s AS service, count(*)::int AS n FROM lead, unnest(services) s WHERE created_at > now() - interval '30 days' GROUP BY s ORDER BY n DESC`,
    ),
    pool.query<{ source: string; n: number }>(
      `SELECT coalesce(nullif(utm_source,''), 'Direct / unknown') AS source, count(*)::int AS n FROM lead WHERE kind IN ('quote','contact') AND created_at > now() - interval '30 days' GROUP BY 1 ORDER BY n DESC LIMIT 8`,
    ),
    pool.query<{ day: string; n: number }>(
      `SELECT d::date::text AS day, count(l.id)::int AS n
         FROM generate_series((now() AT TIME ZONE 'Asia/Manila')::date - 29, (now() AT TIME ZONE 'Asia/Manila')::date, interval '1 day') d
         LEFT JOIN lead l ON (l.created_at AT TIME ZONE 'Asia/Manila')::date = d::date AND l.kind IN ('quote','contact')
        GROUP BY d ORDER BY d`,
    ),
    pool.query<{ id: string; ticket_no: string | null; name: string | null; follow_up_at: string }>(
      `SELECT id, ticket_no, name, follow_up_at::text FROM lead WHERE follow_up_at <= (now() AT TIME ZONE 'Asia/Manila')::date AND status NOT IN ('won','lost','spam') ORDER BY follow_up_at LIMIT 10`,
    ),
    pool.query<{ n: number }>(`SELECT count(*)::int AS n FROM lead WHERE kind = 'newsletter'`),
  ]);
  const overdue = newRows.rows.filter((r) => isOverdue("new", r.created_at));
  return {
    ...totals.rows[0],
    newCount: newRows.rowCount ?? 0,
    overdue,
    byService: byService.rows,
    bySource: bySource.rows,
    daily: daily.rows,
    followUps: followUps.rows,
    newsletter: newsletter.rows[0].n,
  };
}
