import Link from "next/link";
import { notFound } from "next/navigation";
import { can, requireAdmin } from "@/lib/server/admin/guard";
import { getLead, isOverdue } from "@/lib/server/admin/leads";
import { ALL_SERVICES, INDUSTRIES } from "@/content/site";
import { productBySlug } from "@/content/products";
import { Badge, Card, PageTitle, btn, manila } from "@/components/admin/ui";
import { EraseLead, LeadUpdateForm, NoteForm } from "@/components/admin/lead-controls";

export const metadata = { title: "Lead" };

/** "0917 123 4567" → "639171234567" (for Viber / WhatsApp deep links). */
const intl = (m: string) => {
  const d = m.replace(/[^\d+]/g, "");
  if (/^09\d{9}$/.test(d)) return `63${d.slice(1)}`;
  return d.replace(/^\+/, "");
};

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireAdmin("leads");
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  const data = await getLead(id);
  if (!data) notFound();
  const { lead: l, files, activity, users } = data;
  const str = (k: string) => (l[k] == null || l[k] === "" ? null : String(l[k]));
  const services = (l.services as string[]).map((s) => ALL_SERVICES.find((x) => x.slug === s)?.name ?? "Not sure yet");
  const products = (l.products as string[]).map((p) => productBySlug(p)?.name ?? p);
  const industry = str("industry") ? (INDUSTRIES.find((i) => i.slug === l.industry)?.name ?? "Other") : null;
  const mobile = str("mobile");
  const late = isOverdue(l.status, l.created_at);

  const facts: [string, string | null][] = [
    ["Services", services.join(", ") || null],
    ["Industry", industry],
    ["Catalogue items", products.join(", ") || null],
    ["Date", str("event_date_text")],
    ["Venue / location", str("venue")],
    ["Quantity / sizes", str("qty_sizes")],
    ["Budget band", str("budget_band")],
    [l.kind === "contact" ? "Message" : "Notes", str("notes")],
    ["Preferred channel", str("preferred_channel")],
    ["Source", [str("utm_source"), str("utm_medium"), str("utm_campaign")].filter(Boolean).join(" / ") || null],
    ["Landing page", str("landing_page")],
    ["Consent", str("consent_version") ? `${str("consent_version")} · ${manila(String(l.consent_at))}` : null],
    ["Newsletter", l.newsletter_opt_in ? "Opted in" : null],
  ];

  return (
    <>
      <Link href="/admin/leads" className={btn("ghost", "-ml-3 mb-2")}>
        ← All leads
      </Link>
      <PageTitle
        title={str("ticket_no") ?? (l.kind === "newsletter" ? "Newsletter sign-up" : "Contact enquiry")}
        sub={`Received ${manila(l.created_at)}`}
        actions={
          <span className="flex items-center gap-2">
            <Badge value={l.kind} label={l.kind === "quote" ? "Job ticket" : undefined} />
            <Badge value={l.status} />
            {late ? <span className="font-semibold text-danger">Overdue</span> : null}
          </span>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card title="Contact">
            <p className="font-heading text-xl font-semibold text-gli-navy">{str("name") ?? str("email")}</p>
            {str("company") ? <p className="text-gli-slate">{str("company")}</p> : null}
            <p className="mt-2">
              {str("email")}
              {mobile ? ` · ${mobile}` : ""}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {mobile ? (
                <>
                  <a href={`tel:${mobile.replace(/[^\d+]/g, "")}`} className={btn("primary")}>
                    Call
                  </a>
                  <a href={`viber://chat?number=%2B${intl(mobile)}`} className={btn("secondary")}>
                    Viber
                  </a>
                  <a href={`https://wa.me/${intl(mobile)}`} target="_blank" rel="noopener noreferrer" className={btn("secondary")}>
                    WhatsApp
                  </a>
                </>
              ) : null}
              <a href={`mailto:${str("email")}?subject=${encodeURIComponent(str("ticket_no") ? `Your GLI job ticket ${str("ticket_no")}` : "Your enquiry to GLI")}`} className={btn("secondary")}>
                Email
              </a>
            </div>
          </Card>

          <Card title="Request">
            <dl className="divide-y divide-gli-line">
              {facts
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="grid gap-1 py-2 sm:grid-cols-[10rem_1fr]">
                    <dt className="text-[0.875rem] font-semibold text-gli-slate">{k}</dt>
                    <dd className="whitespace-pre-wrap">{v}</dd>
                  </div>
                ))}
            </dl>
          </Card>

          {files.length ? (
            <Card title={`Files (${files.length})`}>
              <ul className="divide-y divide-gli-line">
                {files.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-3 py-2">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{f.filename}</span>
                      <span className="text-[0.8125rem] text-gli-slate">{(f.size_bytes / 1048576).toFixed(1)} MB</span>
                    </span>
                    <a href={`/admin/files/${f.id}`} className={btn("secondary")} download>
                      Download
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[0.8125rem] text-gli-slate">Files are private and checked by type only (not virus-scanned): open with care.</p>
            </Card>
          ) : null}

          <Card title="Activity">
            <NoteForm id={l.id} />
            <ol className="mt-5 space-y-3 border-l-2 border-gli-line pl-4">
              {activity.map((a, i) => (
                <li key={i}>
                  <p className="text-[0.8125rem] text-gli-slate">
                    {manila(a.created_at)} · {a.actor ?? "System"} · {a.type.replace(/_/g, " ")}
                  </p>
                  {a.body ? <p className="whitespace-pre-wrap">{a.body}</p> : null}
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Manage">
            <LeadUpdateForm
              id={l.id}
              status={l.status}
              lostReason={str("lost_reason") ?? ""}
              priority={str("priority") ?? ""}
              followUp={str("follow_up_text") ?? ""}
              ownerId={str("owner_id") ?? ""}
              users={users}
            />
          </Card>
          {can(me.role, "admin") ? (
            <Card title="Erase this lead">
              <EraseLead id={l.id} />
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
}
