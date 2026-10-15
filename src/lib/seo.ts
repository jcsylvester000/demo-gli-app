import type { Metadata } from "next";

/** Per-page metadata: title (≤ 60 incl. brand), description (≤ 160), self-canonical, OG/Twitter (BRD FR-083, FR-090). */
export function pageMetadata({ title, description, path, noindex = false }: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", locale: "en_PH", siteName: "Graphics Library, Inc." },
    twitter: { card: "summary_large_image", title, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
