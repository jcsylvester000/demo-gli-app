import type { Metadata } from "next";
import Link from "next/link";
import { redirectOrNotFound } from "@/lib/server/redirects";
import { ArrowRight } from "lucide-react";
import { INDUSTRY_PAGES, industryBySlug } from "@/content/industries";
import { serviceBySlug } from "@/content/services";
import { clientBySlug } from "@/content/clients";
import { approvedTestimonials, nameableClients, resolveText, visibleCases } from "@/lib/gate";
import { getGovernance } from "@/lib/server/governance";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { MarkList } from "@/components/pages/list-with-marks";
import { CaseCard } from "@/components/gli/case-card";
import { SignOffTestimonial } from "@/components/gli/sign-off-testimonial";
import { JsonLd } from "@/components/seo/json-ld";
import { orgRef } from "@/lib/schema";
import { siteUrl } from "@/lib/utils";
import { StockFigure } from "@/components/gli/proof-image";
import { industryStock } from "@/content/stock";

export const revalidate = 300;
export const generateStaticParams = () => INDUSTRY_PAGES.map((i) => ({ slug: i.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const i = industryBySlug((await params).slug);
  if (!i) return {};
  const g = await getGovernance();
  return pageMetadata({ title: i.seoTitle, description: resolveText(g, i.meta), path: `/industries/${i.slug}` });
}

/** Industry template (BRD FR-021): copy, permission-filtered client list, related cases (by industry tag), testimonial, CTA. */
export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const i = industryBySlug(slug);
  if (!i) return redirectOrNotFound(`/industries/${slug}`);
  const g = await getGovernance();
  const cases = visibleCases(g)
    .filter((c) => c.industry === i.slug && !c.archive)
    .slice(0, 3);
  const clients = nameableClients(g).filter((c) => c.industry === i.slug);
  const testimonial = approvedTestimonials(g).find((t) => t.clientSlug && clientBySlug(t.clientSlug)?.industry === i.slug);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Industries", href: "/industries" },
          { name: i.name, href: `/industries/${i.slug}` },
        ]}
      />
      <PageHero
        eyebrow={i.name}
        title={i.h1}
        intro={resolveText(g, i.body)}
        primary={{ label: i.cta, href: "/quote" }}
        secondary={{ label: "See related work", href: "#work" }}
        aside={
          <div className="mx-auto max-w-md rotate-1">
            <StockFigure photo={industryStock(i.slug)!} priority sizes="(min-width: 1024px) 420px, 90vw" />
          </div>
        }
      />

      <section aria-labelledby="do-title" className="bg-white">
        <div className="container-site grid gap-12 py-14 md:py-20 lg:grid-cols-2">
          <div>
            <SectionHeading id="do-title" eyebrow="What we do for you" title={`For ${i.name.toLowerCase()} teams`} />
            <div className="mt-8 text-lg">
              <MarkList items={i.whatWeDo} />
            </div>
          </div>
          <div>
            <h2 className="eyebrow text-gli-slate">Related services</h2>
            <ul className="mt-3 divide-y divide-gli-line border-y border-gli-line">
              {i.services.map((slug) => {
                const s = serviceBySlug(slug);
                return s ? (
                  <li key={slug}>
                    <Link
                      href={`/services/${slug}`}
                      className="group flex min-h-14 items-center justify-between gap-3 py-2 font-heading text-lg font-semibold text-gli-navy hover:text-gli-blue"
                    >
                      {s.eyebrow}
                      <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        </div>
      </section>

      {cases.length ? (
        <section id="work" aria-labelledby="work-title" className="scroll-mt-24 bg-gli-mist">
          <div className="container-site py-14 md:py-20">
            <SectionHeading id="work-title" eyebrow="Case studies" title={`${i.name} work`} />
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {cases.map((c) => (
                <CaseCard key={c.slug} item={c} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div id="work" />
      )}

      {clients.length ? (
        <section aria-labelledby="clients-title" className="bg-white">
          <div className="container-site py-14 md:py-16">
            <SectionHeading id="clients-title" eyebrow="Clients" title="Teams we've worked with" />
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {clients.map((c) => (
                <li key={c.slug} className="font-heading text-xl font-semibold text-gli-slate">
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {testimonial ? (
        <section aria-label="Client testimonial" className="bg-white">
          <div className="container-site py-14">
            <SignOffTestimonial item={testimonial} company={testimonial.clientSlug ? clientBySlug(testimonial.clientSlug)?.name : undefined} />
          </div>
        </section>
      ) : null}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Marketing production for ${i.name}`,
          url: `${siteUrl()}/industries/${i.slug}`,
          description: resolveText(g, i.meta),
          provider: orgRef(),
          areaServed: { "@type": "Country", name: "Philippines" },
          audience: { "@type": "BusinessAudience", name: i.name },
        }}
      />
    </>
  );
}
