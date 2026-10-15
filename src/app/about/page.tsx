import { ABOUT } from "@/content/about";
import { HOME } from "@/content/home";
import { resolveText } from "@/lib/gate";
import { getGovernance } from "@/lib/server/governance";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { RegMark } from "@/components/brand/print-marks";
import { Counters } from "@/components/gli/counters";
import { JsonLd } from "@/components/seo/json-ld";
import { orgRef } from "@/lib/schema";
import { siteUrl } from "@/lib/utils";
import { StockFigure } from "@/components/gli/proof-image";
import { pageStock } from "@/content/stock";

export const revalidate = 300;
export const metadata = pageMetadata({ title: ABOUT.seoTitle, description: ABOUT.meta, path: "/about" });

export default async function About() {
  const g = await getGovernance();
  return (
    <>
      <Breadcrumbs items={[{ name: "About", href: "/about" }]} />
      <PageHero
        eyebrow="About GLI"
        title={ABOUT.h1}
        intro={ABOUT.intro}
        primary={{ label: "Start a job ticket", href: "/quote" }}
        secondary={{ label: "See how we work", href: "/about/how-we-work" }}
        aside={
          <div className="mx-auto max-w-md rotate-1">
            <StockFigure photo={pageStock.about} priority sizes="(min-width: 1024px) 420px, 90vw" />
          </div>
        }
      />

      <section aria-label="GLI in numbers" className="border-b border-gli-line bg-gli-tint">
        <div className="container-site py-10">
          <Counters items={HOME.counters} />
        </div>
      </section>

      <section aria-labelledby="story-title" className="bg-white">
        <div className="container-site py-14 md:py-20">
          <SectionHeading id="story-title" eyebrow="Our story" title="From a design and print shop to the whole show floor" />
          <ol className="relative mt-12 grid gap-8 md:grid-cols-5 md:gap-6">
            <span
              aria-hidden="true"
              className="absolute bottom-2 left-[11px] top-2 w-px bg-gli-line md:inset-x-0 md:bottom-auto md:left-0 md:top-[11px] md:h-px md:w-auto"
            />
            {ABOUT.story.map((s) => (
              <li key={s.when} className="relative pl-10 md:pl-0 md:pt-10">
                <span className="absolute left-0 top-0 grid size-6 place-items-center rounded-full bg-white text-gli-blue">
                  <RegMark className="size-6" />
                </span>
                <p className="tabular font-heading text-2xl font-semibold text-gli-navy">{s.when}</p>
                <p className="mt-2 text-[0.9375rem] leading-6 text-gli-ink">{resolveText(g, s.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="values-title" className="on-dark bg-gli-navy text-white">
        <div className="container-site py-14 md:py-20">
          <SectionHeading id="values-title" eyebrow="What we stand for" title="Quality, cost, time, partnership" tone="dark" />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT.values.map((v) => (
              <li key={v.title} className="rounded-[var(--radius)] border border-white/20 p-6">
                <h3 className="text-xl text-white">{v.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-6 text-gli-tint">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="glance-title" className="bg-white">
        <div className="container-site py-14 md:py-20">
          <SectionHeading id="glance-title" eyebrow="GLI at a glance" title="The facts" />
          <dl className="mt-8 max-w-4xl divide-y divide-gli-line border-y border-gli-line">
            {ABOUT.glance.map((f) => (
              <div key={f.label} className="grid gap-1 py-3.5 sm:grid-cols-[12rem_1fr] sm:gap-4">
                <dt className="font-heading font-semibold text-gli-slate">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", name: ABOUT.seoTitle, url: `${siteUrl()}/about`, mainEntity: orgRef() }} />
    </>
  );
}
