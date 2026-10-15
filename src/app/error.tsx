"use client";

import Link from "next/link";

/** Public error boundary: anything unexpected still gets a branded, recoverable page with a route to a human. */
export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-site py-20 md:py-28">
      <title>Something went wrong | Graphics Library, Inc.</title>
      <h1 className="text-3xl md:text-[2.5rem]">Something went wrong on our side</h1>
      <p className="mt-4 max-w-prose text-lg text-gli-ink">Sorry about that. Try again, or send us your brief and we&apos;ll pick it up from there.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="inline-flex min-h-12 items-center rounded-[var(--radius)] bg-gli-blue px-6 font-heading font-semibold text-white hover:bg-gli-navy">
          Try again
        </button>
        <Link href="/contact" className="inline-flex min-h-12 items-center rounded-[var(--radius)] border border-gli-blue px-6 font-heading font-semibold text-gli-blue hover:bg-gli-tint">
          Contact us
        </Link>
      </div>
    </section>
  );
}
