import type { Metadata } from "next";
import Link from "next/link";
import { redirectOrNotFound } from "@/lib/server/redirects";
import { ArrowRight } from "lucide-react";
import { SERVICES, serviceBySlug } from "@/content/services";
import { categoryLabel, productBySlug } from "@/content/products";
import { SERVICE_GALLERY, SERVICE_MEDIA } from "@/content/service-media";
import { productSetting, resolveText, visibleCases, clientStatus } from "@/lib/gate";
import { getGovernance } from "@/lib/server/governance";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero } from "@/components/layout/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { MarkList } from "@/components/pages/list-with-marks";
import { CaseCard } from "@/components/gli/case-card";
import { SpecCard } from "@/components/gli/spec-card";
import { AddToQuote } from "@/components/gli/add-to-quote";
import { ProofFaq } from "@/components/gli/proof-faq";
import { ProofImage, StockFigure, TypeThumb } from "@/components/gli/proof-image";
import { productStock, serviceStock } from "@/content/stock";

export const revalidate = 300;
export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = serviceBySlug((await params).slug);
  if (!s) return {};
  const g = await getGovernance();
  return pageMetadata({ title: s.seoTitle, description: resolveText(g, s.meta), path: `/services/${s.slug}` });
}

/** Service template (BRD FR-020): hero, deliverables, process, where we've done it + related cases, related products, FAQ. */
export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return redirectOrNotFound(`/services/${slug}`);
  const g = await getGovernance();
  const cases = visibleCases(g)
    .filter((c) => c.services.includes(s.slug))
    .slice(0, 3);
  const products = s.products
    .map(productBySlug)
    .filter((p): p is NonNullable<typeof p> => !!p)
    .slice(0, 3);
  const faq = s.faq.filter((f): f is { q: string; a: string } => !!f.a);
  const img = SERVICE_MEDIA[s.slug];
  const intro = resolveText(g, s.intro);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.eyebrow,
    serviceType: s.eyebrow,
    description: resolveText(g, s.meta),
    url: `${siteUrl()}/services/${s.slug}`,
    areaServed: { "@type": "Country", name: "Philippines" },
    provider: { "@id": `${siteUrl()}/#organization`, "@type": "Organization", name: "Graphics Library, Inc." },
  };

  const gallery = (SERVICE_GALLERY[s.slug] ?? []).filter((img) => !img.client || clientStatus(g, img.client) !== "no");
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Services", href: "/services" },
          { name: s.eyebrow, href: `/services/${s.slug}` },
        ]}
      />
      <PageHero
        eyebrow={s.eyebrow}
        title={s.h1}
        intro={intro}
        primary={{ label: "Request a Quote", href: `/quote?service=${s.slug}` }}
        secondary={{ label: "See related work", href: "#work" }}
        aside={
          <div className="mx-auto max-w-md rotate-1">
            {img ? (
              <ProofImage image={img} priority sizes="(min-width: 1024px) 420px, 90vw" />
            ) : serviceStock(s.slug) ? (
              <StockFigure photo={serviceStock(s.slug)!} priority sizes="(min-width: 1024px) 420px, 90vw" />
            ) : (
              <TypeThumb label={s.eyebrow} sub="GLI production" className="shadow-xl" />
            )}
          </div>
        }
      />

      <section aria-labelledby="make-title" className="bg-white">
        <div className="container-site grid gap-12 py-14 md:py-20 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading id="make-title" eyebrow="What we make" title={`${s.eyebrow}, made by one team`} />
            <div className="mt-8 text-lg">
              <MarkList items={s.make} />
            </div>
          </div>
          <aside
            aria-labelledby="how-title"
            className="relative self-start rounded-[var(--radius)] border-2 border-dashed border-gli-signal/60 bg-gli-mist p-6"
          >
            <h2 id="how-title" className="text-2xl">
              How it works
            </h2>
            <p className="mt-3 text-gli-ink">{s.how}</p>
            <Link
              href="/about/how-we-work"
              className="mt-4 inline-flex min-h-11 items-center gap-2 font-heading font-semibold text-gli-blue hover:underline underline-offset-4"
            >
              Our six-step process <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </aside>
        </div>
      </section>

      <section id="work" aria-labelledby="where-title" className="scroll-mt-24 bg-gli-mist">
        <div className="container-site py-14 md:py-20">
          <SectionHeading id="where-title" eyebrow="Where we've done it" title="Recent and remarkable" />
          <p className="mt-6 max-w-3xl text-lg text-gli-ink">{resolveText(g, s.where)}</p>
          {cases.length ? (
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {cases.map((c) => (
                <CaseCard key={c.slug} item={c} />
              ))}
            </div>
          ) : null}
          <Link
            href="/work"
            className="mt-8 inline-flex min-h-11 items-center gap-2 font-heading font-semibold text-gli-blue hover:underline underline-offset-4"
          >
            See all work <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>

      {gallery.length ? (
        <section aria-labelledby="floor-title" className="bg-white">
          <div className="container-site py-14 md:py-20">
            <SectionHeading id="floor-title" eyebrow="From the floor" title="Photos from our jobs" />
            <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {gallery.map((img, i) => (
                <li key={img.alt} className={i === 0 && gallery.length > 3 ? "sm:col-span-2 lg:row-span-2" : undefined}>
                  <ProofImage image={img} sizes={i === 0 && gallery.length > 3 ? "(min-width: 1024px) 560px, 90vw" : "(min-width: 1024px) 270px, (min-width: 640px) 45vw, 90vw"} />
                  <p className="mt-3 text-[0.9375rem] text-gli-slate">{img.caption}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {products.length ? (
        <section aria-labelledby="products-title" className="bg-white">
          <div className="container-site py-14 md:py-20">
            <SectionHeading id="products-title" eyebrow="From the catalogue" title="Items we make all the time" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const ps = productSetting(g, p.slug);
                return (
                  <SpecCard
                    key={p.slug}
                    name={p.name}
                    href={`/products/${p.slug}`}
                    oneLiner={p.oneLiner}
                    specs={p.specs}
                    priceCentavos={ps.priceCentavos}
                    leadTime={ps.leadTime}
                    image={p.image}
                    fallbackLabel={categoryLabel(p.category)}
                    photo={productStock(p.slug)}
                    addToQuote={<AddToQuote slug={p.slug} name={p.name} />}
                  />
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {faq.length ? (
        <section aria-labelledby="faq-title" className="bg-gli-mist">
          <div className="container-site grid gap-10 py-14 md:py-20 lg:grid-cols-[1fr_1.6fr]">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions buyers ask" />
            <ProofFaq items={faq.map((f) => ({ q: f.q, a: f.a }))} />
          </div>
        </section>
      ) : null}
      <JsonLd data={schema} />
    </>
  );
}
