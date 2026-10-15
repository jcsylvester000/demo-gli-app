import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { WORK_HUB } from "@/content/work-hub";
import { pageMetadata } from "@/lib/seo";
import { WorkListing, workPages } from "@/components/pages/work-listing";

export const revalidate = 300;

export async function generateStaticParams() {
  const { pages } = await workPages();
  return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ n: String(i + 2) }));
}

type Props = { params: Promise<{ n: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = Number((await params).n);
  return pageMetadata({ title: `Our Work, page ${n} | GLI`, description: WORK_HUB.meta, path: `/work/page/${n}` });
}

export default async function WorkPage({ params }: Props) {
  const raw = (await params).n;
  const n = Number(raw);
  if (n === 1) permanentRedirect("/work");
  const { pages } = await workPages();
  if (!/^\d+$/.test(raw) || n < 2 || n > pages) notFound();
  return <WorkListing page={n} />;
}
