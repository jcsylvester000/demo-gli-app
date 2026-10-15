import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INDUSTRIES_HUB, INDUSTRY_PAGES } from "@/content/industries";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero } from "@/components/layout/page-hero";
import { RegMark } from "@/components/brand/print-marks";

export const metadata = pageMetadata({ title: INDUSTRIES_HUB.seoTitle, description: INDUSTRIES_HUB.meta, path: "/industries" });

export default function IndustriesHub() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Industries", href: "/industries" }]} />
      <PageHero eyebrow="Industries" title={INDUSTRIES_HUB.h1} intro={INDUSTRIES_HUB.intro} secondary={{ label: "See the work", href: "/work" }} />
      <section aria-label="Industries" className="bg-white">
        <div className="container-site py-14 md:py-20">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INDUSTRY_PAGES.map((i) => (
              <li key={i.slug}>
                <Link
                  href={`/industries/${i.slug}`}
                  className="group flex h-full flex-col rounded-[var(--radius)] border border-gli-line bg-white p-6 transition-shadow hover:shadow-[0_14px_30px_-16px_rgb(0_48_107/0.5)]"
                >
                  <RegMark className="size-6 text-gli-signal" />
                  <h2 className="mt-4 text-2xl group-hover:text-gli-blue">{i.name}</h2>
                  <p className="mt-1 font-heading text-lg text-gli-blue">{i.h1}</p>
                  <p className="mt-3 text-[0.9375rem] text-gli-slate">{i.whatWeDo.join(" · ")}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 font-heading font-semibold text-gli-blue">
                    See {i.name.toLowerCase()} work <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
