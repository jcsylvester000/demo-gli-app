import type { Metadata } from "next";

/** Default share image (1200 × 630, BRD FR-090). Replace with page-specific images once GLI originals arrive. */
export const OG_IMAGE = { url: "/og.jpg", width: 1200, height: 630, alt: "GLI: From first sketch to show floor." };

/** Per-page metadata: title (≤ 60 incl. brand), description (≤ 160), self-canonical, OG/Twitter (BRD FR-083, FR-090). */
export function pageMetadata({ title, description, path, noindex = false }: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", locale: "en_PH", siteName: "Graphics Library, Inc.", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** First candidate that fits the SEO Map's 60-character title limit; the last one is used as-is. */
export function fitTitle(...candidates: string[]): string {
  return candidates.find((t) => t.length <= 60) ?? candidates[candidates.length - 1];
}
