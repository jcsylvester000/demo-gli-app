import type { Metadata } from "next";
import Link from "next/link";
import { redirectOrNotFound } from "@/lib/server/redirects";
import { ArrowRight } from "lucide-react";
import { CASES, caseBySlug } from "@/content/cases";
import { INDUSTRIES } from "@/content/site";
import { serviceBySlug } from "@/content/services";
import { clientBySlug } from "@/content/clients";
import { approvedTestimonials, caseVisible, resolveCase, visibleCases } from "@/lib/gate";
import { getGovernance } from "@/lib/server/governance";
import { fitTitle, pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CmykBar } from "@/components/brand/print-marks";
import { buttonClass } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { CaseCard } from "@/components/gli/case-card";
import { ProofImage, StockFigure, TypeThumb } from "@/components/gli/proof-image";
import { SignOffTestimonial } from "@/components/gli/sign-off-testimonial";
import { TrackView } from "@/components/gli/track-view";
import { JsonLd } from "@/components/seo/json-ld";
import { orgRef } from "@/lib/schema";
import { siteUrl } from "@/lib/utils";
import { caseStock } from "@/content/stock";

export const revalidate = 300;
export const generateStaticParams = () => CASES.map((c) => ({ slug: c.slug }));

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const c = caseBySlug(slug);
  if (!c) return null;
  const g = await getGovernance();
  if (!caseVisible(g, c)) return null; // Rx-sensitive or unpublished cases 404
  return { g, item: resolveCase(g, c) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await load((await params).slug);
  if (!r) return { title: "Not found", robots: { index: false } };
  const { item } = r;
  const client = item.named ? item.clientLabel : item.clientLabel.charAt(0).toLowerCase() + item.clientLabel.slice(1);
  // SEO Map pattern: "[Project] for [Client] | GLI Work" / "[What GLI delivered] for [client] at [venue], [year]: …"
  const title = fitTitle(...(item.named ? [`${item.title} for ${item.clientLabel} | GLI Work`] : []), `${item.title} | GLI Work`, `${item.title} | GLI`, item.title);
  const desc = `${item.delivered} for ${client} at ${item.where}${item.yearLabel ? `, ${item.yearLabel}` : ""}. See the brief and the work.`;
  return pageMetadata({ title, description: desc.slice(0, 160), path: `/work/${item.slug}` });
}

/** Case-study template (BRD FR-031): title, spec strip, hero, brief, delivered gallery, optional outcome/testimonial, related, CTA. */
export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const r = await load(slug);
  if (!r) return redirectOrNotFound(`/work/${slug}`);
  const { g, item } = r;
  const industry = INDUSTRIES.find((i) => i.slug === item.industry);
  const related = visibleCases(g)
    .filter((c) => c.slug !== item.slug && (c.industry === item.industry || c.services.some((s) => item.services.includes(s))))
    .slice(0, 3);
  const testimonial = approvedTestimonials(g).find((t) => t.clientSlug && caseBySlug(item.slug)?.clients.includes(t.clientSlug));
  const [hero, ...gallery] = item.images;

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Work", href: "/work" },
          { name: item.title, href: `/work/${item.slug}` },
        ]}
      />
      <TrackView event="case_view" params={{ case: item.slug }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: item.title,
          url: `${siteUrl()}/work/${item.slug}`,
          abstract: item.brief,
          creator: orgRef(),
          ...(item.year ? { dateCreated: String(item.year) } : {}),
          ...(item.images[0] ? { image: `${siteUrl()}${item.images[0].src.src}` } : {}),
        }}
      />

      <section className="on-dark ripple-field bg-gli-navy text-white">
        <div className="container-site grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow text-gli-yellow">{industry?.name ?? "Case study"}</p>
            <h1 className="mt-3 text-[2.25rem] leading-[1.08] text-white md:text-[3rem]">{item.title}</h1>
            <dl className="mt-8 grid gap-x-6 gap-y-3 border-t border-dashed border-white/30 pt-5 sm:grid-cols-3">
              <div>
                <dt className="eyebrow text-[0.75rem] text-gli-sky">Client</dt>
                <dd className="mt-1">{item.clientLabel}</dd>
              </div>
              <div>
                <dt className="eyebrow text-[0.75rem] text-gli-sky">Where</dt>
                <dd className="mt-1">
                  {item.where}
                  {item.yearLabel ? ` · ${item.yearLabel}` : ""}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-[0.75rem] text-gli-sky">Delivered</dt>
                <dd className="mt-1">{item.delivered}</dd>
              </div>
            </dl>
            <Link href={`/quote?service=${item.services[0]}`} className={buttonClass("accent", "lg", "mt-8")}>
              Start a similar project
            </Link>
          </div>
          <div className="mx-auto w-full max-w-lg -rotate-1">
            {hero ? (
              <ProofImage image={hero} priority sizes="(min-width: 1024px) 480px, 90vw" />
            ) : caseStock(item.slug) ? (
              <StockFigure photo={caseStock(item.slug)!} priority sizes="(min-width: 1024px) 480px, 90vw" caption="Project photos available on request" />
            ) : (
              <TypeThumb label={item.title} sub={industry?.name} className="shadow-xl" />
            )}
          </div>
        </div>
        <CmykBar />
      </section>

      <article className="bg-white">
        <div className="container-site grid gap-12 py-14 md:py-20 lg:grid-cols-[1.5fr_1fr]">
          <div className="max-w-2xl space-y-10 text-lg">
            <section aria-labelledby="brief-title">
              <h2 id="brief-title" className="text-3xl">
                The brief
              </h2>
              <p className="mt-4">{item.brief}</p>
            </section>
            <section aria-labelledby="delivered-title">
              <h2 id="delivered-title" className="text-3xl">
                What we delivered
              </h2>
              <p className="mt-4">{item.whatWeDelivered}</p>
            </section>
            {item.outcome ? (
              <section aria-labelledby="outcome-title">
                <h2 id="outcome-title" className="text-3xl">
                  Outcome
                </h2>
                <p className="mt-4">{item.outcome}</p>
              </section>
            ) : null}
          </div>
          <aside
            aria-label="Services on this project"
            className="self-start rounded-[var(--radius)] border-2 border-dashed border-gli-signal/60 bg-gli-mist p-6"
          >
            <p className="eyebrow text-gli-slate">Services on this job</p>
            <ul className="mt-3 space-y-1">
              {item.services.map((s) => {
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
          </aside>
        </div>

        {item.images.length > 1 || (hero && gallery.length) ? (
          <section aria-labelledby="gallery-title" className="bg-gli-mist">
            <div className="container-site py-14">
              <h2 id="gallery-title" className="text-2xl">
                On the job
              </h2>
              <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {item.images.map((img) => (
                  <div key={img.alt}>
                    <ProofImage image={img} sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw" />
                    <p className="mt-3 text-[0.9375rem] text-gli-slate">{img.caption}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </article>

      {testimonial ? (
        <section aria-label="Client testimonial" className="bg-white">
          <div className="container-site py-14">
            <SignOffTestimonial item={testimonial} company={testimonial.clientSlug ? clientBySlug(testimonial.clientSlug)?.name : undefined} />
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section aria-labelledby="related-title" className="bg-white">
          <div className="container-site py-14 md:py-20">
            <SectionHeading id="related-title" eyebrow="Related work" title="More from the production floor" />
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CaseCard key={c.slug} item={c} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
