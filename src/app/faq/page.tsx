import Link from "next/link";
import { FAQ_PAGE } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero } from "@/components/layout/page-hero";
import { ProofFaq } from "@/components/gli/proof-faq";

export const metadata = pageMetadata({ title: FAQ_PAGE.seoTitle, description: FAQ_PAGE.meta, path: "/faq" });

/** Answers GLI has not supplied yet are hidden (never shown as placeholders). */
export default function Faq() {
  const items = FAQ_PAGE.items.filter((f): f is { q: string; a: string } => !!f.a);
  return (
    <>
      <Breadcrumbs items={[{ name: "FAQ", href: "/faq" }]} />
      <PageHero eyebrow="FAQ" title={FAQ_PAGE.h1} intro="Lead times, production, coverage and files: the questions buyers ask us most." proof={null} />
      <section aria-label="Questions" className="bg-white">
        <div className="container-site grid gap-10 py-14 md:py-20 lg:grid-cols-[1.6fr_1fr]">
          <ProofFaq items={items} />
          <aside className="self-start rounded-[var(--radius)] border-2 border-dashed border-gli-signal/60 bg-gli-mist p-6">
            <p className="font-heading text-xl font-semibold text-gli-navy">Still have a question?</p>
            <p className="mt-2 text-gli-ink">Start a job ticket and ask it in the notes, or use our Contact page.</p>
            <Link href="/contact" className="mt-4 inline-flex min-h-11 items-center font-heading font-semibold text-gli-blue underline underline-offset-4">
              Contact GLI
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
