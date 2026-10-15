import Link from "next/link";
import { BrushUnderline, CmykBar, CropMarks, RegMark } from "@/components/brand/print-marks";
import { buttonClass } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { SERVICE_GROUPS } from "@/content/site";
import { siteUrl } from "@/lib/utils";

/**
 * Home (Batch 1 shell). Copy from Document 4 §2. The full Show-Floor Hero collage (S1), client ribbon,
 * services grid (S5), slider, featured work, counters, process and insights arrive in Batch 2.
 */
export default function Home() {
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
      { "@type": "WebSite", "@id": `${siteUrl()}/#website`, url: siteUrl(), name: "Graphics Library, Inc.", inLanguage: "en-PH", publisher: { "@id": `${siteUrl()}/#organization` } },
    ],
  };

  return (
    <>
      <section className="on-dark ripple-field relative overflow-hidden bg-gli-blue text-white">
        <div className="container-site py-16 md:py-24">
          <p className="eyebrow text-gli-yellow">Graphics Library, Inc. · Since 1996</p>
          <h1 className="mt-4 max-w-3xl text-[2.5rem] leading-[1.05] text-white md:text-[3.5rem]">
            From first sketch to{" "}
            <span className="relative inline-block whitespace-nowrap">
              show floor.
              <BrushUnderline className="absolute inset-x-0 -bottom-2" />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gli-tint md:text-xl">
            Pharma materials, print, retail displays, booths and events: one accountable team, on your deadline.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/quote" className={buttonClass("accent", "lg")}>
              Request a Quote
            </Link>
            <Link href="/work" className={buttonClass("outline-light", "lg")}>
              See the work
            </Link>
          </div>
          <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-4" aria-label="GLI at a glance">
            <li className="flex items-center gap-2">
              <RegMark className="text-gli-sky" />
              <span className="tabular font-heading text-3xl font-semibold">1996</span>
              <span className="text-sm text-gli-tint">Incorporated in the Philippines</span>
            </li>
            <li className="flex items-center gap-2">
              <RegMark className="text-gli-sky" />
              <span className="tabular font-heading text-3xl font-semibold">30</span>
              <span className="text-sm text-gli-tint">Years in 2026</span>
            </li>
          </ul>
        </div>
        <CmykBar />
      </section>

      <section aria-labelledby="services-title" className="container-site py-16 md:py-24">
        <p className="eyebrow text-gli-blue">Our services</p>
        <h2 id="services-title" className="mt-2 text-3xl md:text-[2.5rem]">
          Designed. Printed. Built. Delivered.
        </h2>
        <p className="mt-3 max-w-xl text-lg text-gli-slate">Ten services, one team. Start with what you need; we&apos;ll handle the rest.</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_GROUPS.map((g) => (
            <div key={g.label} className="relative border border-gli-line bg-gli-mist p-5">
              <CropMarks />
              <p className="eyebrow text-gli-slate">{g.label}</p>
              <ul className="mt-3 space-y-3">
                {g.services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="font-heading font-semibold text-gli-navy hover:text-gli-blue">
                      {s.name}
                    </Link>
                    <p className="text-sm leading-5 text-gli-slate">{s.oneLiner}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <JsonLd data={org} />
    </>
  );
}
