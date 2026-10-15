import { requireAdmin } from "@/lib/server/admin/guard";
import { getPool } from "@/lib/server/pool";
import { CLIENTS } from "@/content/clients";
import { INDUSTRIES } from "@/content/site";
import { Badge, Card, PageTitle } from "@/components/admin/ui";
import { ClientPermissionForm } from "@/components/admin/governance-forms";

export const metadata = { title: "Client permissions" };

/** Client register (BRD FR-086). Names show only for Yes / Name only; logos only for Yes. Everyone else is anonymised. */
export default async function Clients() {
  await requireAdmin("admin");
  const { rows } = await getPool().query<{ client_slug: string; status: string; permission_date: string | null; evidence_note: string | null }>(
    `SELECT client_slug, status, permission_date::text, evidence_note FROM client_permission`,
  );
  const bySlug = Object.fromEntries(rows.map((r) => [r.client_slug, r]));
  return (
    <>
      <PageTitle title="Client permissions" sub="Until a client is set to Yes or Name only, the website describes their work anonymously (for example, “a multinational pharma company”)." />
      <div className="space-y-6">
        {INDUSTRIES.map((ind) => (
          <Card key={ind.slug} title={ind.name}>
            <ul className="divide-y divide-gli-line">
              {CLIENTS.filter((c) => c.industry === ind.slug).map((c) => {
                const r = bySlug[c.slug];
                return (
                  <li key={c.slug} className="py-3">
                    <p className="mb-2 flex items-center gap-2 font-semibold">
                      {c.name} <Badge value={r?.status ?? "pending"} />
                    </p>
                    <ClientPermissionForm slug={c.slug} status={r?.status ?? "pending"} date={r?.permission_date ?? ""} note={r?.evidence_note ?? ""} />
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
