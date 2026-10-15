import type { MetadataRoute } from "next";
import { SERVICES } from "@/content/services";
import { INDUSTRY_PAGES } from "@/content/industries";
import { PRODUCTS } from "@/content/products";
import { ARTICLES, INSIGHT_CATEGORIES } from "@/content/articles";
import { visibleCases } from "@/lib/gate";
import { getGovernance } from "@/lib/server/governance";
import { WORK_HUB } from "@/content/work-hub";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

/** Built, indexable pages only (placeholders, admin, filters and the styleguide are excluded). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const g = await getGovernance();
  const cases = visibleCases(g);
  const latestArticle = ARTICLES.map((a) => a.published).sort().at(-1);
  const u = (path: string, priority = 0.6, lastModified?: string) => ({ url: `${base}${path}`, priority, ...(lastModified ? { lastModified } : {}) });
  const pages = Math.ceil(cases.length / WORK_HUB.perPage);
  return [
    u("/", 1),
    u("/services", 0.9),
    ...SERVICES.map((s) => u(`/services/${s.slug}`, 0.9)),
    u("/industries", 0.8),
    ...INDUSTRY_PAGES.map((i) => u(`/industries/${i.slug}`, 0.8)),
    u("/work", 0.8),
    ...Array.from({ length: Math.max(0, pages - 1) }, (_, i) => u(`/work/page/${i + 2}`, 0.4)),
    ...cases.map((c) => u(`/work/${c.slug}`, 0.7)),
    u("/products", 0.7),
    ...PRODUCTS.map((p) => u(`/products/${p.slug}`, 0.6)),
    u("/insights", 0.7, latestArticle),
    ...INSIGHT_CATEGORIES.map((c) => u(`/insights/category/${c.slug}`, 0.4)),
    ...ARTICLES.map((a) => u(`/insights/${a.slug}`, 0.6, a.published)),
    u("/about", 0.6),
    u("/about/how-we-work", 0.5),
    u("/about/clients", 0.5),
    u("/faq", 0.5),
    u("/privacy", 0.2),
    u("/terms", 0.2),
  ];
}
