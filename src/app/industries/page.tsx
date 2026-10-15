import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INDUSTRIES_HUB, INDUSTRY_PAGES } from "@/content/industries";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero } from "@/components/layout/page-hero";
import { RegMark } from "@/components/brand/print-marks";
import { JsonLd } from "@/components/seo/json-ld";
import { listPage } from "@/lib/schema";
import Image from "next/image";
import { industryStock, stockUrl } from "@/content/stock";

export const metadata = pageMetadata({
  title: INDUSTRIES_HUB.seoTitle,
  description: INDUSTRIES_HUB.meta,
  path: "/industries",
});

export default function IndustriesHub() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Industries", href: "/industries" }]} />
      <PageHero
        eyebrow="Industries"
        title={INDUSTRIES_HUB.h1}
        intro={INDUSTRIES_HUB.intro}
        secondary={{ label: "See the work", href: "/work" }}
      />
      <section aria-label="Industries" className="bg-white">
        <div className="container-site py-14 md:py-20">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INDUSTRY_PAGES.map((i) => (
              <li key={i.slug}>
                <Link
                  href={`/industries/${i.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-gli-line bg-white transition-shadow hover:shadow-[0_14px_30px_-16px_rgb(0_48_107/0.5)]"
                >
                  {industryStock(i.slug) ? (
                    <div className="relative aspect-[16/9] overflow-hidden bg-gli-tint">
                      <Image
                        src={stockUrl(industryStock(i.slug)!)}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <span className="absolute bottom-1.5 right-2 text-[0.625rem] text-white/85 [text-shadow:0_1px_2px_rgb(0_0_0/0.6)]">
                        Photo: {industryStock(i.slug)!.by} / Unsplash
                      </span>
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <RegMark className="size-6 text-gli-signal" />
                    <h2 className="mt-4 text-2xl group-hover:text-gli-blue">
                      {i.name}
                    </h2>
                    <p className="mt-1 font-heading text-lg text-gli-blue">
                      {i.h1}
                    </p>
                    <p className="mt-3 text-[0.9375rem] text-gli-slate">
                      {i.whatWeDo.join(" · ")}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 font-heading font-semibold text-gli-blue">
                      See {i.name.toLowerCase()} work{" "}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <JsonLd
        data={listPage(
          "Industries GLI serves",
          "/industries",
          INDUSTRY_PAGES.map((i) => ({
            name: i.name,
            path: `/industries/${i.slug}`,
          })),
        )}
      />
    </>
  );
}
