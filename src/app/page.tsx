import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOME } from "@/content/home";
import { ARTICLES } from "@/content/articles";
import { INDUSTRIES } from "@/content/site";
import { HOME_SERVICE_ORDER } from "@/content/service-media";
import { clientBySlug } from "@/content/clients";
import {
  approvedTestimonials,
  clientStatus,
  featuredCases,
  nameableClients,
} from "@/lib/gate";
import { getGovernance } from "@/lib/server/governance";
import { siteUrl } from "@/lib/utils";
import { OG_IMAGE } from "@/lib/seo";
import { localBusiness } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { ShowFloorHero } from "@/components/gli/show-floor-hero";
import { ClientRibbon } from "@/components/gli/client-ribbon";
import { ServicesGrid } from "@/components/gli/services-grid";
import { CaseCard } from "@/components/gli/case-card";
import { Counters } from "@/components/gli/counters";
import { ProcessTimeline } from "@/components/gli/process-timeline";
import { SignOffTestimonial } from "@/components/gli/sign-off-testimonial";
import { InsightRow } from "@/components/gli/insight-row";
import { VendorMerge } from "@/components/gli/vendor-merge";
import { industryStock, stockUrl } from "@/content/stock";
import Image from "next/image";

/** ISR: governance changes (permissions, publishing) also refresh this page instantly via the "governance" tag (Batch 5). */
export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: HOME.seoTitle },
  description: HOME.metaDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME.seoTitle,
    description: HOME.metaDescription,
    url: "/",
    type: "website",
    locale: "en_PH",
    siteName: "Graphics Library, Inc.",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME.seoTitle,
    description: HOME.metaDescription,
    images: [OG_IMAGE.url],
  },
};

export default async function Home() {
  const g = await getGovernance();
  const collage = HOME.hero.collage.filter(
    (img) => !img.rx && (!img.client || clientStatus(g, img.client) !== "no"),
  );
  const featured = featuredCases(g, 3);
  const testimonial = approvedTestimonials(g)[0];
  const latest = [...ARTICLES]
    .sort((a, b) => b.published.localeCompare(a.published))
    .slice(0, 3);

  const org = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl()}/#organization`,
        name: "Graphics Library, Inc.",
        alternateName: "GLI",
        url: siteUrl(),
        logo: `${siteUrl()}/brand/gli-mark.svg`,
        foundingDate: "1996",
        slogan: "From first sketch to show floor.",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl()}/#website`,
        url: siteUrl(),
        name: "Graphics Library, Inc.",
        inLanguage: "en-PH",
        publisher: { "@id": `${siteUrl()}/#organization` },
      },
      localBusiness(),
    ],
  };

  return (
    <>
      <ShowFloorHero {...HOME.hero} images={collage} />

      <ClientRibbon label={HOME.ribbonLabel} clients={nameableClients(g)} />

      {/* Problem band: the vendor-sprawl diagram makes the point visually */}
      <section aria-labelledby="problem-title" className="bg-white">
        <div className="container-site grid items-center gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <h2
              id="problem-title"
              className="text-3xl leading-[1.05] md:text-[2.75rem]"
            >
              {HOME.problem.h2}
            </h2>
            <p className="mt-5 text-lg text-gli-ink">{HOME.problem.body}</p>
            <Link
              href={HOME.problem.link.href}
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-heading font-semibold text-gli-blue hover:underline underline-offset-4"
            >
              {HOME.problem.link.label}{" "}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <VendorMerge />
        </div>
      </section>

      {/* Services (S5) */}
      <section aria-labelledby="services-title" className="bg-gli-mist">
        <div className="container-site py-16 md:py-24">
          <SectionHeading
            id="services-title"
            eyebrow="Our services"
            title={HOME.services.h2}
            intro={HOME.services.intro}
          />
          <div className="mt-12">
            <ServicesGrid order={HOME_SERVICE_ORDER} />
          </div>
        </div>
      </section>

      {/* S2 slider: renders only when a real, permission-cleared render/build pair exists (none yet). */}

      {/* Featured work (S6) */}
      {featured.length ? (
        <section aria-labelledby="featured-title" className="bg-white">
          <div className="container-site py-16 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                id="featured-title"
                eyebrow="Our work"
                title={HOME.featured.h2}
              />
              <Link
                href={HOME.featured.link.href}
                className="inline-flex min-h-11 items-center gap-2 font-heading font-semibold text-gli-blue hover:underline underline-offset-4"
              >
                {HOME.featured.link.label}{" "}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((c) => (
                <CaseCard key={c.slug} item={c} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Counters (S4) */}
      <section
        aria-label="GLI in numbers"
        className="border-y border-gli-line bg-gli-tint"
      >
        <div className="container-site py-12 md:py-14">
          <Counters items={HOME.counters} />
        </div>
      </section>

      {/* Process (S7) */}
      <section aria-labelledby="process-title" className="bg-white">
        <div className="container-site py-16 md:py-24">
          <SectionHeading
            id="process-title"
            eyebrow="From brief to wrap-up"
            title={HOME.process.h2}
          />
          <div className="mt-12">
            <ProcessTimeline steps={HOME.process.steps} />
          </div>
          <Link
            href="/about/how-we-work"
            className="mt-10 inline-flex min-h-11 items-center gap-2 font-heading font-semibold text-gli-blue hover:underline underline-offset-4"
          >
            More on how we work{" "}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>

      {/* Industries */}
      <section
        aria-labelledby="industries-title"
        className="on-dark bg-gli-navy text-white"
      >
        <div className="container-site py-16 md:py-24">
          <SectionHeading
            id="industries-title"
            eyebrow="Industries"
            title={HOME.industries.h2}
            tone="dark"
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {INDUSTRIES.map((i) => {
              const photo = industryStock(i.slug);
              return (
                <li key={i.slug}>
                  <Link
                    href={`/industries/${i.slug}`}
                    className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[var(--radius)] border border-white/15 bg-gli-blue p-5 lg:aspect-[3/4]"
                  >
                    {photo ? (
                      <Image
                        src={stockUrl(photo)}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 230px, (min-width: 640px) 45vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-gli-navy via-gli-navy/60 to-gli-navy/5"
                    />
                    <span className="relative flex items-end justify-between gap-2 font-heading text-lg font-semibold leading-tight">
                      {i.name}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[0.75rem] text-white/60">
            Illustrative photos from Unsplash.
          </p>
        </div>
      </section>

      {/* Testimonial (S11): only approved, attributed quotes */}
      {testimonial ? (
        <section aria-label="Client testimonial" className="bg-white">
          <div className="container-site py-16 md:py-20">
            <SignOffTestimonial
              item={testimonial}
              company={
                testimonial.clientSlug
                  ? clientBySlug(testimonial.clientSlug)?.name
                  : undefined
              }
            />
          </div>
        </section>
      ) : null}

      {/* Insights (S13) */}
      <section aria-labelledby="insights-title" className="bg-white">
        <div className="container-site py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              id="insights-title"
              eyebrow="Insights"
              title={HOME.insights.h2}
            />
            <Link
              href="/insights"
              className="inline-flex min-h-11 items-center gap-2 font-heading font-semibold text-gli-blue hover:underline underline-offset-4"
            >
              All insights <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="mt-10">
            <InsightRow items={latest} />
          </div>
        </div>
      </section>

      <JsonLd data={org} />
    </>
  );
}
