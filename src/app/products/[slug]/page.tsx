import type { Metadata } from "next";
import Link from "next/link";
import { redirectOrNotFound } from "@/lib/server/redirects";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, categoryLabel, productBySlug } from "@/content/products";
import { serviceBySlug } from "@/content/services";
import { caseBySlug } from "@/content/cases";
import { caseVisible, productSetting, resolveCase, resolveText } from "@/lib/gate";
import { getGovernance } from "@/lib/server/governance";
import { fitTitle, pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { CmykBar } from "@/components/brand/print-marks";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpecCard, formatPhp } from "@/components/gli/spec-card";
import { AddToQuote } from "@/components/gli/add-to-quote";
import { CaseCard } from "@/components/gli/case-card";
import { ProofFaq } from "@/components/gli/proof-faq";
import { ProofImage, TypeThumb } from "@/components/gli/proof-image";

export const revalidate = 300;
export const generateStaticParams = () => PRODUCTS.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = productBySlug((await params).slug);
  if (!p) return {};
  return pageMetadata({
    // SEO Map pattern: "[Product]: Specs, Options & Quote | GLI Manila"
    title: fitTitle(`${p.name}: Specs, Options & Quote | GLI Manila`, `${p.name}: Specs & Quote | GLI Manila`, `${p.name} | GLI Manila`, `${p.name} | GLI`),
    description: `${p.name}: ${p.specs.map((s) => s.value.charAt(0).toLowerCase() + s.value.slice(1)).join("; ")}. Add it to a job ticket for a quote.`.slice(0, 160),
    path: `/products/${p.slug}`,
  });
}

/** Product template (BRD FR-041): gallery, spec table, inclusions, lead time, where used, related products, FAQ, Add to quote. */
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) return redirectOrNotFound(`/products/${slug}`);
  const g = await getGovernance();
  const ps = productSetting(g, p.slug);
  const cases = p.cases
    .map(caseBySlug)
    .filter((c): c is NonNullable<typeof c> => !!c && caseVisible(g, c))
    .map((c) => resolveCase(g, c))
    .slice(0, 3);
  const related = PRODUCTS.filter((x) => x.slug !== p.slug && (x.category === p.category || x.services.some((s) => p.services.includes(s)))).slice(0, 3);
  const faq = p.services
    .flatMap((s) => serviceBySlug(s)?.faq ?? [])
    .filter((f): f is { q: string; a: string } => !!f.a)
    .slice(0, 3);

  // Product + Offer schema only when GLI has set a real price (FR-041).
  const schema = ps.priceCentavos
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: p.name,
        description: p.oneLiner,
        brand: { "@type": "Organization", name: "Graphics Library, Inc." },
        offers: {
          "@type": "Offer",
          priceCurrency: "PHP",
          price: (ps.priceCentavos / 100).toFixed(2),
          availability: "https://schema.org/InStock",
          url: `${siteUrl()}/products/${p.slug}`,
        },
      }
    : null;

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Products", href: "/products" },
          { name: p.name, href: `/products/${p.slug}` },
        ]}
      />
      <section className="on-dark ripple-field bg-gli-blue text-white">
        <div className="container-site grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow text-gli-yellow">{categoryLabel(p.category)}</p>
            <h1 className="mt-3 text-[2.25rem] leading-[1.08] text-white md:text-[3rem]">{p.name}</h1>
            <p className="mt-4 text-xl text-gli-tint">{p.oneLiner}</p>
            <p className="mt-6 font-heading text-2xl font-semibold">{ps.priceCentavos ? `Starting from ${formatPhp(ps.priceCentavos)}` : "Price on request"}</p>
            <div className="mt-6 max-w-xs rounded-[var(--radius)] bg-white p-3">
              <AddToQuote slug={p.slug} name={p.name} />
            </div>
            <p className="mt-6 text-[0.9375rem] text-gli-tint">Seen in: {resolveText(g, p.seenIn)}</p>
          </div>
          <div className="mx-auto w-full max-w-md rotate-1">
            {p.image ? (
              <ProofImage image={p.image} priority sizes="(min-width: 1024px) 440px, 90vw" />
            ) : (
              <TypeThumb label={p.name} sub={categoryLabel(p.category)} className="shadow-xl" />
            )}
          </div>
        </div>
        <CmykBar />
      </section>

      <section aria-labelledby="spec-title" className="bg-white">
        <div className="container-site grid gap-12 py-14 md:py-20 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading id="spec-title" eyebrow="Spec sheet" title="Specifications" />
            <dl className="mt-8 divide-y divide-gli-line rounded-[var(--radius)] border-2 border-dashed border-gli-signal/60">
              {p.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[9rem_1fr] gap-4 px-5 py-3.5">
                  <dt className="font-heading font-semibold text-gli-slate">{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[9rem_1fr] gap-4 px-5 py-3.5">
                <dt className="font-heading font-semibold text-gli-slate">Lead time</dt>
                <dd>{ps.leadTime ?? "Confirmed in your quote, based on quantity and date"}</dd>
              </div>
            </dl>
          </div>
          <aside className="self-start rounded-[var(--radius)] bg-gli-mist p-6">
            <p className="eyebrow text-gli-slate">Made by</p>
            <ul className="mt-3 space-y-1">
              {p.services.map((s) => {
                const svc = serviceBySlug(s);
                return svc ? (
                  <li key={s}>
                    <Link
                      href={`/services/${s}`}
                      className="group inline-flex min-h-10 items-center gap-2 font-heading font-semibold text-gli-navy hover:text-gli-blue"
                    >
                      {svc.eyebrow} <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
            <p className="mt-5 text-[0.9375rem] text-gli-slate">Need it custom? Add it to your job ticket and describe what you need in the notes.</p>
          </aside>
        </div>
      </section>

      {cases.length ? (
        <section aria-labelledby="used-title" className="bg-gli-mist">
          <div className="container-site py-14 md:py-20">
            <SectionHeading id="used-title" eyebrow="Where it's been used" title="On real jobs" />
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {cases.map((c) => (
                <CaseCard key={c.slug} item={c} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {faq.length ? (
        <section aria-labelledby="faq-title" className="bg-white">
          <div className="container-site grid gap-10 py-14 md:py-20 lg:grid-cols-[1fr_1.6fr]">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions buyers ask" />
            <ProofFaq items={faq} />
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section aria-labelledby="related-title" className="bg-gli-mist">
          <div className="container-site py-14 md:py-20">
            <SectionHeading id="related-title" eyebrow="Related products" title="Often ordered together" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => {
                const rs = productSetting(g, r.slug);
                return (
                  <SpecCard
                    key={r.slug}
                    name={r.name}
                    href={`/products/${r.slug}`}
                    oneLiner={r.oneLiner}
                    specs={r.specs}
                    priceCentavos={rs.priceCentavos}
                    leadTime={rs.leadTime}
                    image={r.image}
                    fallbackLabel={categoryLabel(r.category)}
                    addToQuote={<AddToQuote slug={r.slug} name={r.name} />}
                  />
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
      {schema ? <JsonLd data={schema} /> : null}
    </>
  );
}
