import { requireAdmin } from "@/lib/server/admin/guard";
import { getPool } from "@/lib/server/pool";
import { CLIENTS } from "@/content/clients";
import { Badge, Card, PageTitle } from "@/components/admin/ui";
import { DeleteTestimonial, TestimonialForm } from "@/components/admin/governance-forms";

export const metadata = { title: "Testimonials" };

/** S11 testimonials: shown only when approved, with written evidence, and when the company may be named. */
export default async function Testimonials() {
  await requireAdmin("admin");
  const { rows } = await getPool().query<{ id: number; quote: string; person: string; title: string | null; client_slug: string | null; approved: boolean; evidence_note: string | null }>(
    `SELECT id::int, quote, person, title, client_slug, approved, evidence_note FROM testimonial ORDER BY id DESC`,
  );
  const clients = CLIENTS.map((c) => ({ slug: c.slug, name: c.name }));
  return (
    <>
      <PageTitle title="Testimonials" sub="Only real, attributed quotes approved in writing. A quote shows on the site when it is approved and its company may be named." />
      <Card title="Add a testimonial" className="mb-6">
        <TestimonialForm clients={clients} />
      </Card>
      <div className="space-y-4">
        {rows.map((t) => (
          <Card key={t.id} actions={<span className="flex items-center gap-2"><Badge value={t.approved ? "published" : "draft"} label={t.approved ? "Approved" : "Not approved"} /><DeleteTestimonial id={t.id} /></span>}>
            <TestimonialForm clients={clients} t={{ id: t.id, quote: t.quote, person: t.person, title: t.title ?? "", client: t.client_slug ?? "", approved: t.approved, evidence: t.evidence_note ?? "" }} />
          </Card>
        ))}
        {!rows.length ? <p className="text-gli-slate">No testimonials yet.</p> : null}
      </div>
    </>
  );
}
