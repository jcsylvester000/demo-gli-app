import Link from "next/link";
import { can, requireAdmin } from "@/lib/server/admin/guard";
import { isOverdue, listLeads, PAGE_SIZE } from "@/lib/server/admin/leads";
import { ALL_SERVICES } from "@/content/site";
import { Badge, PageTitle, btn, input, manila, td, th } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export const metadata = { title: "Leads & tickets" };

type SP = Promise<Record<string, string | undefined>>;

export default async function Leads({ searchParams }: { searchParams: SP }) {
  const me = await requireAdmin("leads");
  const sp = await searchParams;
  const f = {
    q: sp.q?.slice(0, 100),
    status: sp.status || undefined,
    kind: sp.kind || undefined,
    service: sp.service || undefined,
    from: /^\d{4}-\d{2}-\d{2}$/.test(sp.from ?? "") ? sp.from : undefined,
    to: /^\d{4}-\d{2}-\d{2}$/.test(sp.to ?? "") ? sp.to : undefined,
    overdue: sp.overdue === "1",
    page: Number(sp.page) || 1,
  };
  const { rows, total, page } = await listLeads(f);
  const qs = (extra: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, ...extra })) if (v !== undefined && v !== "" && k !== "erased") p.set(k, String(v));
    return p.toString();
  };
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageTitle
        title="Leads & tickets"
        sub={`${total} matching`}
        actions={
          can(me.role, "admin") ? (
            <a href={`/admin/leads/export?${qs({ page: undefined })}`} className={btn("secondary")}>
              Export CSV
            </a>
          ) : null
        }
      />
      {sp.erased ? (
        <p role="status" className="mb-4 rounded-lg border border-gli-line bg-white p-3 font-semibold text-success">
          The lead and its files were erased.
        </p>
      ) : null}
      <form className="mb-5 grid gap-3 rounded-lg border border-gli-line bg-white p-4 md:grid-cols-6" role="search">
        <label className="md:col-span-2">
          <span className="text-[0.8125rem] font-semibold text-gli-navy">Search</span>
          <input name="q" defaultValue={f.q} placeholder="Name, company, email, mobile, ticket" className={input} />
        </label>
        <label>
          <span className="text-[0.8125rem] font-semibold text-gli-navy">Status</span>
          <select name="status" defaultValue={f.status ?? ""} className={input}>
            <option value="">Any</option>
            {["new", "contacted", "proposal_sent", "won", "lost", "spam"].map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-[0.8125rem] font-semibold text-gli-navy">Type</span>
          <select name="kind" defaultValue={f.kind ?? ""} className={input}>
            <option value="">Tickets + enquiries</option>
            <option value="quote">Job tickets</option>
            <option value="contact">Contact enquiries</option>
            <option value="newsletter">Newsletter sign-ups</option>
          </select>
        </label>
        <label>
          <span className="text-[0.8125rem] font-semibold text-gli-navy">Service</span>
          <select name="service" defaultValue={f.service ?? ""} className={input}>
            <option value="">Any</option>
            {ALL_SERVICES.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button className={btn("primary", "flex-1")}>Filter</button>
          <Link href="/admin/leads" className={btn("ghost")}>
            Clear
          </Link>
        </div>
        <label>
          <span className="text-[0.8125rem] font-semibold text-gli-navy">From</span>
          <input type="date" name="from" defaultValue={f.from} className={input} />
        </label>
        <label>
          <span className="text-[0.8125rem] font-semibold text-gli-navy">To</span>
          <input type="date" name="to" defaultValue={f.to} className={input} />
        </label>
        <label className="flex items-end gap-2 pb-2 text-[0.9375rem]">
          <input type="checkbox" name="overdue" value="1" defaultChecked={f.overdue} className="size-4 accent-gli-blue" /> Overdue only
        </label>
      </form>

      <div className="overflow-x-auto rounded-lg border border-gli-line bg-white">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-gli-line bg-gli-mist">
            <tr>
              <th className={th}>Received</th>
              <th className={th}>Ticket</th>
              <th className={th}>Who</th>
              <th className={th}>Services</th>
              <th className={th}>Status</th>
              <th className={th}>Follow-up</th>
              <th className={th}>Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gli-line">
            {rows.map((r) => {
              const late = isOverdue(r.status, r.created_at);
              return (
                <tr key={r.id} className={cn("hover:bg-gli-mist", late && "bg-danger-tint/50")}>
                  <td className={td}>
                    {manila(r.created_at)}
                    {late ? <span className="block text-[0.75rem] font-semibold text-danger">Overdue</span> : null}
                  </td>
                  <td className={td}>
                    <Link href={`/admin/leads/${r.id}`} className="font-semibold text-gli-blue hover:underline">
                      {r.ticket_no ?? (r.kind === "newsletter" ? "Newsletter" : "Enquiry")}
                    </Link>
                    {r.files ? <span className="block text-[0.75rem] text-gli-slate">{r.files} file{r.files > 1 ? "s" : ""}</span> : null}
                  </td>
                  <td className={td}>
                    <span className="font-semibold">{r.name ?? r.email}</span>
                    {r.company ? <span className="block text-[0.8125rem] text-gli-slate">{r.company}</span> : null}
                  </td>
                  <td className={cn(td, "max-w-56 text-[0.8125rem]")}>{r.services.map((s) => ALL_SERVICES.find((x) => x.slug === s)?.name ?? "Not sure yet").join(", ")}</td>
                  <td className={td}>
                    <Badge value={r.status} />
                    {r.priority ? (
                      <span className="ml-1">
                        <Badge value={r.priority} />
                      </span>
                    ) : null}
                  </td>
                  <td className={td}>{r.follow_up_at ?? ""}</td>
                  <td className={td}>{r.owner_name ?? <span className="text-gli-slate">Unassigned</span>}</td>
                </tr>
              );
            })}
            {!rows.length ? (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-gli-slate">
                  No leads match these filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {pages > 1 ? (
        <nav aria-label="Pages" className="mt-4 flex items-center justify-end gap-2">
          {page > 1 ? (
            <Link href={`/admin/leads?${qs({ page: page - 1 })}`} className={btn("secondary")}>
              Previous
            </Link>
          ) : null}
          <span className="text-[0.875rem] text-gli-slate">
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link href={`/admin/leads?${qs({ page: page + 1 })}`} className={btn("secondary")}>
              Next
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
