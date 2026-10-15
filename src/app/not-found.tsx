import Link from "next/link";
import { CropMarks } from "@/components/brand/print-marks";
import { buttonClass } from "@/components/ui/button";

export const metadata = { title: "Page not found", robots: { index: false, follow: true } };

/** Branded 404 (Document 4 §11). Next.js returns HTTP 404 for this page. */
export default function NotFound() {
  return (
    <section className="container-site py-20 md:py-28">
      <div className="relative max-w-2xl p-6 md:p-8">
        <CropMarks />
        <p className="eyebrow text-gli-blue">Error 404</p>
        <h1 className="mt-3 text-4xl md:text-5xl">This page didn&apos;t make it to press.</h1>
        <p className="mt-5 text-lg text-gli-slate">
          The link may be old or mistyped. Try our Services or Work pages, or start a job ticket and tell us what you were looking for.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/services" className={buttonClass("secondary", "lg")}>
            Services
          </Link>
          <Link href="/work" className={buttonClass("secondary", "lg")}>
            Work
          </Link>
          <Link href="/quote" className={buttonClass("primary", "lg")}>
            Start a job ticket
          </Link>
        </div>
      </div>
    </section>
  );
}
