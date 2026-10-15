import { audit, requireAdminAction } from "@/lib/server/admin/guard";
import { exportLeads } from "@/lib/server/admin/leads";

export const dynamic = "force-dynamic";

/** CSV of the filtered leads (Admin only). Cells starting with = + - @ are prefixed so spreadsheets don't run them. */
const cell = (v: unknown) => {
  if (v == null) return "";
  let s = v instanceof Date ? v.toISOString() : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET(req: Request) {
  let me;
  try {
    me = await requireAdminAction("admin");
  } catch {
    return new Response("Not found", { status: 404 });
  }
  const sp = new URL(req.url).searchParams;
  const date = (k: string) => (/^\d{4}-\d{2}-\d{2}$/.test(sp.get(k) ?? "") ? sp.get(k)! : undefined);
  const rows = await exportLeads({
    q: sp.get("q")?.slice(0, 100) || undefined,
    status: sp.get("status") || undefined,
    kind: sp.get("kind") || undefined,
    service: sp.get("service") || undefined,
    from: date("from"),
    to: date("to"),
    overdue: sp.get("overdue") === "1",
  });
  const cols = rows[0] ? Object.keys(rows[0]) : ["ticket_no"];
  const csv = "\ufeff" + [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\r\n");
  await audit(me.id, "leads.exported", `${rows.length} rows`);
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="gli-leads-${stamp}.csv"`, "Cache-Control": "private, no-store" },
  });
}
