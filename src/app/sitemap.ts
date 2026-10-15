import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

/** Built pages only. Each batch adds its routes here (placeholders are noindex and excluded). Full lastmod logic arrives in Batch 6. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${siteUrl()}/`, changeFrequency: "monthly", priority: 1 }];
}
