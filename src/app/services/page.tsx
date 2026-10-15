import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES_HUB } from "@/content/services";
import { SERVICE_GROUPS } from "@/content/site";
import { HOME_SERVICE_ORDER } from "@/content/service-media";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero } from "@/components/layout/page-hero";
import { ServicesGrid } from "@/components/gli/services-grid";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = pageMetadata({ title: SERVICES_HUB.seoTitle, description: SERVICES_HUB.meta, path: "/services" });

export default function ServicesHub() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Services", href: "/services" }]} />
      <PageHero eyebrow="Our services" title={SERVICES_HUB.h1} intro={SERVICES_HUB.intro} secondary={{ label: "See the work", href: "/work" }} />
      <section aria-label="All services" className="bg-gli-mist">
        <div className="container-site py-14 md:py-20">
          <ServicesGrid order={HOME_SERVICE_ORDER} />
        </div>
      </section>
      <section aria-labelledby="groups-title" className="bg-white">
        <div className="container-site py-14 md:py-20">
          <SectionHeading id="groups-title" eyebrow="By group" title="Find the right team for the job" />
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICE_GROUPS.map((g) => (
              <div key={g.label}>
                <h3 className="eyebrow text-gli-slate">{g.label}</h3>
                <ul className="mt-3 divide-y divide-gli-line border-y border-gli-line">
                  {g.services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="group flex min-h-12 items-center justify-between gap-2 py-2 font-heading font-semibold text-gli-navy hover:text-gli-blue"
                      >
                        {s.name}
                        <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
