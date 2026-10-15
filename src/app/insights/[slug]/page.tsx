import type { Metadata } from "next";
import Link from "next/link";
import { redirectOrNotFound } from "@/lib/server/redirects";
import { ArrowRight } from "lucide-react";
import {
  ARTICLES,
  ARTICLE_BODIES,
  ARTICLE_SERVICE,
  categoryName,
} from "@/content/articles";
import { serviceBySlug } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { GliMark } from "@/components/brand/logo";
import { RegMark } from "@/components/brand/print-marks";
import { buttonClass } from "@/components/ui/button";
import { InsightRow } from "@/components/gli/insight-row";
import { StockFigure } from "@/components/gli/proof-image";
import { articleStock } from "@/content/stock";

export const generateStaticParams = () =>
  ARTICLES.map((a) => ({ slug: a.slug }));

type Props = { params: Promise<{ slug: string }> };
const anchor = (h: string) =>
  h
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const fmt = (d: string) =>
  new Date(`${d}T00:00:00+08:00`).toLocaleDateString("en-PH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Manila",
  });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) return {};
  const m = pageMetadata({
    title: a.seoTitle ?? `${a.title} | GLI Insights`,
    description: a.excerpt,
    path: `/insights/${a.slug}`,
  });
  return {
    ...m,
    openGraph: {
      ...m.openGraph,
      type: "article",
      publishedTime: a.published,
      modifiedTime: ARTICLE_BODIES[a.slug]?.updated ?? a.published,
    },
  };
}

/** Article template (BRD FR-051): author box, table of contents, inline CTA, related articles, Article schema. */
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  const body = a ? ARTICLE_BODIES[a.slug] : undefined;
  const heroPhoto = a ? articleStock(a.slug) : undefined;
  if (!a || !body) return redirectOrNotFound(`/insights/${slug}`);
  const service = serviceBySlug(ARTICLE_SERVICE[a.slug] ?? "");
  const related = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3);
  const updated = body.updated ?? a.published;
  const authorName = body.author?.name ?? "The GLI production team";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.published,
    dateModified: updated,
    inLanguage: "en-PH",
    mainEntityOfPage: `${siteUrl()}/insights/${a.slug}`,
    author: body.author
      ? {
          "@type": "Person",
          name: body.author.name,
          jobTitle: body.author.role,
          worksFor: { "@type": "Organization", name: "Graphics Library, Inc." },
        }
      : {
          "@type": "Organization",
          name: "Graphics Library, Inc.",
          url: siteUrl(),
        },
    publisher: {
      "@type": "Organization",
      name: "Graphics Library, Inc.",
      logo: { "@type": "ImageObject", url: `${siteUrl()}/brand/gli-mark.svg` },
    },
  };

  const inlineCtaAfter = Math.min(2, body.sections.length - 1);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Insights", href: "/insights" },
          { name: a.title, href: `/insights/${a.slug}` },
        ]}
      />
      <article>
        <header className="on-dark ripple-field bg-gli-navy text-white">
          <div
            className={
              heroPhoto
                ? "container-site grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.3fr_1fr]"
                : "container-site py-12 md:py-16"
            }
          >
            <div>
              <Link
                href={`/insights/category/${a.category}`}
                className="eyebrow text-gli-yellow hover:underline"
              >
                {categoryName(a.category)}
              </Link>
              <h1 className="mt-3 max-w-4xl text-[2.25rem] leading-[1.1] text-white md:text-[2.75rem]">
                {a.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg text-gli-tint">
                {a.excerpt}
              </p>
              <p className="mt-6 text-[0.9375rem] text-gli-sky">
                {authorName} ·{" "}
                <time dateTime={a.published}>{fmt(a.published)}</time> ·{" "}
                {a.readMins} min read
              </p>
            </div>
            {heroPhoto ? (
              <div className="mx-auto w-full max-w-md rotate-1">
                <StockFigure
                  photo={heroPhoto}
                  priority
                  sizes="(min-width: 1024px) 420px, 90vw"
                />
              </div>
            ) : null}
          </div>
        </header>

        <div className="container-site grid gap-12 py-12 md:py-16 lg:grid-cols-[16rem_1fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav
              aria-labelledby="toc-title"
              className="rounded-[var(--radius)] border border-gli-line p-5"
            >
              <p id="toc-title" className="eyebrow text-gli-slate">
                On this page
              </p>
              <ol className="mt-3 space-y-2 text-[0.9375rem]">
                {body.sections.map((s) => (
                  <li key={s.h}>
                    <a
                      href={`#${anchor(s.h)}`}
                      className="text-gli-navy hover:text-gli-blue hover:underline underline-offset-4"
                    >
                      {s.h}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="max-w-[44rem] text-[1.125rem] leading-[1.7]">
            <p className="text-xl leading-relaxed text-gli-ink">{body.intro}</p>
            {body.sections.map((s, i) => (
              <section
                key={s.h}
                aria-labelledby={anchor(s.h)}
                className="mt-10"
              >
                <h2
                  id={anchor(s.h)}
                  className="scroll-mt-28 text-2xl md:text-[1.75rem]"
                >
                  {s.h}
                </h2>
                {s.p.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-4">
                    {p}
                  </p>
                ))}
                {i === inlineCtaAfter ? (
                  <aside className="on-dark mt-8 flex flex-col gap-4 rounded-[var(--radius)] bg-gli-blue p-6 text-white sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-heading text-xl font-semibold">
                      Planning something similar? Start a job ticket.
                    </p>
                    <Link
                      href={`/quote${service ? `?service=${service.slug}` : ""}`}
                      className={buttonClass("accent", "md", "shrink-0")}
                    >
                      Start a job ticket
                    </Link>
                  </aside>
                ) : null}
              </section>
            ))}
            {body.checklist ? (
              <section
                aria-labelledby="checklist"
                className="mt-10 rounded-[var(--radius)] border-2 border-dashed border-gli-signal/60 bg-gli-mist p-6"
              >
                <h2 id="checklist" className="text-2xl">
                  Checklist
                </h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {body.checklist.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-base">
                      <RegMark className="shrink-0 text-gli-signal" /> {c}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            <p className="mt-10 font-heading text-xl font-semibold text-gli-navy">
              {body.close}
            </p>
            {body.sources?.length ? (
              <section
                aria-labelledby="sources"
                className="mt-10 border-t border-gli-line pt-6 text-[0.9375rem] text-gli-slate"
              >
                <h2 id="sources" className="eyebrow text-gli-slate">
                  Sources
                </h2>
                <ul className="mt-2 space-y-2">
                  {body.sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        className="text-gli-blue underline underline-offset-4"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {s.label}
                      </a>
                      {s.note ? ` ${s.note}` : ""}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="mt-10 flex items-center gap-4 rounded-[var(--radius)] border border-gli-line p-5">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-gli-tint">
                <GliMark className="h-9 w-auto text-gli-blue" title="" />
              </span>
              <div>
                <p className="font-heading font-semibold text-gli-navy">
                  Written by {authorName}
                </p>
                <p className="text-[0.9375rem] text-gli-slate">
                  {body.author
                    ? `${body.author.role} at GLI · ${body.author.years} years in production`
                    : "Producers and designers at Graphics Library, Inc., in production since 1996."}
                </p>
              </div>
            </div>
            {service ? (
              <Link
                href={`/services/${service.slug}`}
                className="mt-8 inline-flex min-h-11 items-center gap-2 font-heading font-semibold text-gli-blue hover:underline underline-offset-4"
              >
                Related service: {service.eyebrow}{" "}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </article>

      <section aria-labelledby="related-reading" className="bg-gli-mist">
        <div className="container-site py-14">
          <h2 id="related-reading" className="text-2xl md:text-3xl">
            Related reading
          </h2>
          <div className="mt-6">
            <InsightRow items={related} />
          </div>
        </div>
      </section>
      <JsonLd data={schema} />
    </>
  );
}
