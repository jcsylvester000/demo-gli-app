import Link from "next/link";
import { can, requireAdmin } from "@/lib/server/admin/guard";
import { getPool } from "@/lib/server/pool";
import { CASES } from "@/content/cases";
import { clientBySlug } from "@/content/clients";
import { Badge, Card, PageTitle } from "@/components/admin/ui";
import { CaseStatusForm } from "@/components/admin/governance-forms";

export const metadata = { title: "Case studies" };

/**
 * Publishing workflow (BRD FR-082) and Rx gate (FR-032). Until a case has a row here, non-Rx cases show (anonymised)
 * and Rx cases stay hidden. Saving "Published" on an Rx case requires an Admin's Rx clearance (also enforced in the database).
 */
export default async function Cases() {
  const me = await requireAdmin("content");
  const pool = getPool();
  const [status, perms] = await Promise.all([
    pool.query<{ case_slug: string; workflow: string; rx_cleared: boolean }>(`SELECT case_slug, workflow, rx_cleared FROM case_status`),
    pool.query<{ client_slug: string; status: string }>(`SELECT client_slug, status FROM client_permission`),
  ]);
  const st = Object.fromEntries(status.rows.map((r) => [r.case_slug, r]));
  const perm = Object.fromEntries(perms.rows.map((r) => [r.client_slug, r.status]));
  return (
    <>
      <PageTitle title="Case studies" sub="Choose what is live. Client names on each case follow the Client permissions page; until then the case reads anonymously." />
      <div className="space-y-4">
        {CASES.map((c) => {
          const r = st[c.slug];
          const workflow = r?.workflow ?? (c.rx ? "draft" : "published");
          const live = workflow === "published" && (!c.rx || r?.rx_cleared);
          return (
            <Card key={c.slug}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-heading text-lg font-semibold text-gli-navy">
                    {c.id} · {c.title}
                  </p>
                  <p className="text-[0.875rem] text-gli-slate">
                    {c.clients.map((s) => `${clientBySlug(s)?.name ?? s} (${(perm[s] ?? "pending").replace("_", " ")})`).join(", ")}
                  </p>
                </div>
                <span className="flex items-center gap-2">
                  {c.rx ? <Badge value="hot" label="Rx-sensitive" /> : null}
                  <Badge value={live ? "published" : "draft"} label={live ? "Live" : "Hidden"} />
                  {live ? (
                    <Link href={`/work/${c.slug}`} target="_blank" className="text-[0.875rem] font-semibold text-gli-blue underline">
                      View
                    </Link>
                  ) : null}
                </span>
              </div>
              <CaseStatusForm slug={c.slug} workflow={workflow} rx={c.rx} rxCleared={!!r?.rx_cleared} isAdmin={can(me.role, "admin")} />
            </Card>
          );
        })}
      </div>
    </>
  );
}
