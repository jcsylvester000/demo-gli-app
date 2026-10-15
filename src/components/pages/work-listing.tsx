import Link from "next/link";
import { WORK_HUB } from "@/content/work-hub";
import { visibleCases } from "@/lib/gate";
import { getGovernance } from "@/lib/server/governance";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero } from "@/components/layout/page-hero";
import { Counters } from "@/components/gli/counters";
import { WorkBrowser } from "@/components/gli/work-browser";
import { HOME } from "@/content/home";
import { cn } from "@/lib/utils";

export async function workPages() {
  const g = await getGovernance();
  const all = visibleCases(g).sort((a, b) => Number(a.archive) - Number(b.archive) || (b.year ?? 0) - (a.year ?? 0));
  return { all, pages: Math.max(1, Math.ceil(all.length / WORK_HUB.perPage)) };
}

/** Shared by /work and /work/page/[n]: crawlable pagination with real <a href> links. */
export async function WorkListing({ page }: { page: number }) {
  const { all, pages } = await workPages();
  const pageItems = all.slice((page - 1) * WORK_HUB.perPage, page * WORK_HUB.perPage);
  const href = (n: number) => (n === 1 ? "/work" : `/work/page/${n}`);
  const pagination =
    pages > 1 ? (
      <nav aria-label="Work pages" className="mt-10 flex items-center justify-center gap-2">
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <Link
            key={n}
            href={href(n)}
            aria-current={n === page ? "page" : undefined}
            className={cn(
              "grid size-11 place-items-center rounded-[var(--radius)] border font-heading font-semibold",
              n === page ? "border-gli-blue bg-gli-blue text-white" : "border-gli-line text-gli-navy hover:border-gli-blue",
            )}
          >
            {n}
          </Link>
        ))}
      </nav>
    ) : null;

  return (
    <>
      <Breadcrumbs items={[{ name: "Work", href: "/work" }, ...(page > 1 ? [{ name: `Page ${page}`, href: href(page) }] : [])]} />
      <PageHero eyebrow="Our work" title={WORK_HUB.h1} intro={WORK_HUB.intro} proof={null} />
      <section aria-label="GLI in numbers" className="border-b border-gli-line bg-gli-tint">
        <div className="container-site py-10">
          <Counters items={HOME.counters} />
        </div>
      </section>
      <section aria-label="Case studies" className="bg-white">
        <div className="container-site py-12 md:py-16">
          <WorkBrowser all={all} pageItems={pageItems} pagination={pagination} emptyText={WORK_HUB.empty} />
        </div>
      </section>
    </>
  );
}
