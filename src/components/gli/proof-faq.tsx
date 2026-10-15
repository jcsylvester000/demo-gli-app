import { JsonLd } from "@/components/seo/json-ld";

export type FaqItem = { q: string; a: string };

/**
 * S12 Proof FAQ (Accordion, shadcn, MIT; built on native <details> so it works without JavaScript and is
 * keyboard-accessible by default). Open item outlined in GLI Blue; plus/minus in Barlow.
 * FAQPage JSON-LD is optional: Google no longer shows FAQ rich results (Doc 2 §8), it only helps machine reading.
 */
export function ProofFaq({ items, schema = false }: { items: FaqItem[]; schema?: boolean }) {
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <details
          key={it.q}
          className="group rounded-[var(--radius)] border border-gli-line bg-white open:border-gli-blue open:shadow-[0_0_0_1px_var(--color-gli-blue)]"
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-heading text-lg font-semibold text-gli-navy [&::-webkit-details-marker]:hidden">
            {it.q}
            <span aria-hidden="true" className="font-heading text-2xl font-medium text-gli-blue">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <div className="px-5 pb-5 text-gli-ink">{it.a}</div>
        </details>
      ))}
      {schema ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
          }}
        />
      ) : null}
    </div>
  );
}
