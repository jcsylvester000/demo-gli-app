import { redirectOrNotFound } from "@/lib/server/redirects";

/**
 * Catch-all for URLs no page matches: applies a redirect saved in the admin (BRD FR-092) or returns the branded 404.
 */
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: true } };

export default async function CatchAll({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return redirectOrNotFound("/" + slug.map(decodeURIComponent).join("/"));
}
