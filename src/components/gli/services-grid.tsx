import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ALL_SERVICES } from "@/content/site";
import { SERVICE_MEDIA } from "@/content/service-media";
import { CropMarks, RegMark } from "@/components/brand/print-marks";
import { cn } from "@/lib/utils";

/**
 * S5 Press-Sheet Services Grid (Bento Grid, Magic UI, MIT; rebuilt). Tiles trimmed like press sheets (crop marks);
 * the lead tile (featured) spans two columns and two rows. Every tile links to its service page (FR-012).
 */
export function ServicesGrid({ order, featured = order[0], cta = true }: { order: string[]; featured?: string; cta?: boolean }) {
  const services = order.map((slug) => ALL_SERVICES.find((s) => s.slug === slug)).filter((s): s is NonNullable<typeof s> => !!s);
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s) => {
        const lead = s.slug === featured;
        const img = SERVICE_MEDIA[s.slug];
        return (
          <li key={s.slug} className={cn("relative", lead && "sm:col-span-2 lg:row-span-2")}>
            <CropMarks />
            <Link
              href={`/services/${s.slug}`}
              className={cn(
                "group flex h-full overflow-hidden border border-gli-line bg-white transition-shadow hover:shadow-[0_14px_30px_-16px_rgb(0_48_107/0.5)]",
                lead ? "flex-col" : "flex-row items-center sm:flex-col sm:items-stretch",
              )}
            >
              <div className={cn("relative overflow-hidden", lead ? "aspect-[16/10] lg:aspect-auto lg:flex-1" : "aspect-square w-24 shrink-0 self-stretch sm:aspect-[16/10] sm:w-auto")}>
                {img ? (
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes={lead ? "(min-width: 1024px) 560px, (min-width: 640px) 90vw, 100vw" : "(min-width: 1024px) 270px, (min-width: 640px) 45vw, 100vw"}
                    className={cn("transition-transform duration-300 group-hover:scale-[1.03]", img.fit === "contain" ? "bg-gli-mist object-contain p-3" : "object-cover")}
                  />
                ) : (
                  <div className="on-dark ripple-field absolute inset-0 flex flex-col justify-between bg-gli-navy p-5 text-white">
                    <RegMark className="size-6 self-end text-gli-sky" />
                    {lead ? (
                      <div className="flex flex-col gap-5">
                        <div aria-hidden="true" className="flex items-end gap-3">
                          {[2, 4, 6, 12, 14].map((n) => (
                            <span
                              key={n}
                              className="grid place-items-end justify-start border border-white/45 bg-white/10 p-1.5 font-heading text-sm font-semibold"
                              style={{ width: 34 + n * 5, height: 52 + n * 7 }}
                            >
                              {n}pp
                            </span>
                          ))}
                        </div>
                        <p className="eyebrow text-[0.75rem] text-gli-sky max-sm:hidden">Detail aids · Clinical posters · Patient programmes · MIMS ads</p>
                      </div>
                    ) : (
                      <span className="eyebrow text-[0.6875rem] text-gli-sky max-sm:hidden">GLI production</span>
                    )}
                  </div>
                )}
              </div>
              <div className={cn("flex flex-1 items-start justify-between gap-3 p-4", lead && "md:p-6")}>
                <div>
                  {lead ? <p className="eyebrow mb-1 text-[0.75rem] text-gli-blue">Our lead service</p> : null}
                  <h3 className={cn("font-heading font-semibold text-gli-navy group-hover:text-gli-blue", lead ? "text-2xl" : "text-lg")}>{s.name}</h3>
                  <p className={cn("mt-1 text-gli-slate", lead ? "text-base" : "text-[0.9375rem] leading-5")}>{s.oneLiner}</p>
                </div>
                <ArrowUpRight aria-hidden="true" className="mt-1 size-5 shrink-0 text-gli-blue transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          </li>
        );
      })}
      {cta ? (
        // Fills the last row (lead tile 2×2 + 9 tiles = 13 cells on a 4-column grid).
        <li className="relative lg:col-span-3">
          <CropMarks />
          <Link
            href="/quote"
            className="on-dark ripple-field group flex h-full min-h-40 flex-col justify-between gap-4 bg-gli-blue p-6 text-white md:flex-row md:items-center"
          >
            <span>
              <span className="eyebrow block text-[0.75rem] text-gli-yellow">Not sure what you need?</span>
              <span className="mt-1 block font-heading text-2xl font-semibold">Start a job ticket and we&apos;ll help you scope it.</span>
            </span>
            <span className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-[var(--radius)] border border-white px-4 font-heading font-semibold group-hover:bg-white group-hover:text-gli-navy md:self-center">
              Start a job ticket <ArrowUpRight aria-hidden="true" className="size-4" />
            </span>
          </Link>
        </li>
      ) : null}
    </ul>
  );
}
