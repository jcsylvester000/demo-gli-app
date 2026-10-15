import Link from "next/link";
import { can, requireAdmin } from "@/lib/server/admin/guard";
import { overviewStats } from "@/lib/server/admin/leads";
import { ALL_SERVICES } from "@/content/site";
import { Card, PageTitle, manila } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export const metadata = { title: "Overview" };

const svcName = (s: string) => (s === "not-sure" ? "Not sure yet" : (ALL_SERVICES.find((x) => x.slug === s)?.name ?? s));

function Stat({ label, value, href, tone }: { label: string; value: number; href?: string; tone?: "alert" }) {
  const inner = (
    <>
      <span className={cn("tabular block font-heading text-3xl font-semibold", tone === "alert" && value > 0 ? "text-danger" : "text-gli-navy")}>{value}</span>
      <span className="text-[0.875rem] text-gli-slate">{label}</span>
    </>
  );
  return href ? (
    <Link href={href} className="block rounded-lg border border-gli-line bg-white p-4 hover:border-gli-blue">
      {inner}
    </Link>
  ) : (
    <div className="rounded-lg border border-gli-line bg-white p-4">{inner}</div>
  );
}

function Bars({ rows, label }: { rows: { label: string; n: number }[]; label: string }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  if (!rows.length) return <p className="text-gli-slate">No leads in the last 30 days yet.</p>;
  return (
    <table className="w-full text-[0.875rem]" aria-label={label}>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <th scope="row" className="w-1/2 py-1 pr-3 text-left font-normal text-gli-ink">
              {r.label}
            </th>
            <td className="py-1">
              <span className="flex items-center gap-2">
                <span className="h-2.5 rounded-sm bg-gli-blue" style={{ width: `${(r.n / max) * 100}%`, minWidth: 4 }} />
                <span className="tabular font-semibold text-gli-navy">{r.n}</span>
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function Overview() {
  const me = await requireAdmin();
  if (!can(me.role, "leads")) {
    return (
      <>
        <PageTitle title={`Hello, ${me.name}`} sub="Publishing tools are in the menu: case studies, prices and lead times, contact details." />
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/admin/cases" className="rounded-lg border border-gli-line bg-white p-5 font-heading font-semibold text-gli-navy hover:border-gli-blue">Case studies →</Link>
          <Link href="/admin/products" className="rounded-lg border border-gli-line bg-white p-5 font-heading font-semibold text-gli-navy hover:border-gli-blue">Prices & lead times →</Link>
          <Link href="/admin/settings" className="rounded-lg border border-gli-line bg-white p-5 font-heading font-semibold text-gli-navy hover:border-gli-blue">Contact details →</Link>
        </div>
      </>
    );
  }
  const s = await overviewStats();
  const maxDay = Math.max(1, ...s.daily.map((d) => d.n));
  return (
    <>
      <PageTitle title="Overview" sub="Job tickets and enquiries. Target: first reply within one business day." />
      {s.failing ? (
        <p role="alert" className="mb-5 rounded-lg border border-danger/40 bg-danger-tint p-3 font-semibold text-danger">
          {s.failing} email{s.failing === 1 ? "" : "s"} could not be sent yet. Leads are safe; open a lead to retry, or check the email settings.
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="New, not yet contacted" value={s.newCount} href="/admin/leads?status=new" />
        <Stat label="Overdue (over 1 business day)" value={s.overdue.length} href="/admin/leads?overdue=1" tone="alert" />
        <Stat label="Open (new, contacted, proposal)" value={s.open} href="/admin/leads" />
        <Stat label="Last 7 days" value={s.week} />
        <Stat label="Last 30 days" value={s.month} />
        <Stat label="Newsletter subscribers" value={s.newsletter} href="/admin/leads?kind=newsletter" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card title="Leads per day, last 30 days">
          <div className="flex h-36 items-end gap-[3px]" role="img" aria-label={`Leads per day for the last 30 days, peak ${maxDay}`}>
            {s.daily.map((d) => (
              <span key={d.day} title={`${d.day}: ${d.n}`} className="flex-1 rounded-t-sm bg-gli-blue/85" style={{ height: `${(d.n / maxDay) * 100}%`, minHeight: d.n ? 4 : 1, opacity: d.n ? 1 : 0.25 }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[0.75rem] text-gli-slate">
            <span>{s.daily[0]?.day}</span>
            <span>Today</span>
          </div>
        </Card>
        <Card title="Needs attention">
          {s.overdue.length || s.followUps.length ? (
            <ul className="space-y-2 text-[0.9375rem]">
              {s.overdue.slice(0, 6).map((l) => (
                <li key={`o${l.id}`}>
                  <Link href={`/admin/leads/${l.id}`} className="font-semibold text-danger hover:underline">
                    Overdue: {l.ticket_no ?? "Enquiry"} · {l.company || l.name}
                  </Link>
                  <span className="block text-[0.8125rem] text-gli-slate">since {manila(l.created_at)}</span>
                </li>
              ))}
              {s.followUps.map((l) => (
                <li key={`f${l.id}`}>
                  <Link href={`/admin/leads/${l.id}`} className="font-semibold text-gli-navy hover:underline">
                    Follow up: {l.ticket_no ?? "Enquiry"} · {l.name}
                  </Link>
                  <span className="block text-[0.8125rem] text-gli-slate">due {l.follow_up_at}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gli-slate">Nothing overdue. Nice work.</p>
          )}
        </Card>
        <Card title="By service, last 30 days">
          <Bars label="Leads by service" rows={s.byService.map((r) => ({ label: svcName(r.service), n: r.n }))} />
        </Card>
        <Card title="By source, last 30 days">
          <Bars label="Leads by source" rows={s.bySource.map((r) => ({ label: r.source, n: r.n }))} />
        </Card>
      </div>
    </>
  );
}
