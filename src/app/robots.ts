import type { MetadataRoute } from "next";
import { indexingAllowed, siteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  if (!indexingAllowed()) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/styleguide"] }], sitemap: `${siteUrl()}/sitemap.xml` };
}
