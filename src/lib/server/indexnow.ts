import "server-only";
import { indexingAllowed, siteUrl } from "@/lib/utils";

/**
 * IndexNow (BRD FR-085): tells Bing, Yandex, Naver and others which URLs changed, right after a publish in the admin.
 * Active only on the real domain (ALLOW_INDEXING=true, https) with INDEXNOW_KEY set (8–128 letters/digits/dashes).
 * The key file is served at /<key>.txt (rewrite in next.config.ts → /api/indexnow-key). Google does not use IndexNow;
 * it reads the sitemap.
 */
export const indexNowKey = () => {
  const k = process.env.INDEXNOW_KEY || "";
  return /^[A-Za-z0-9-]{8,128}$/.test(k) ? k : null;
};

export function pingIndexNow(paths: string[]) {
  const key = indexNowKey();
  const base = siteUrl();
  if (!key || !indexingAllowed() || !base.startsWith("https://") || !paths.length) return;
  const host = new URL(base).host;
  fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation: `${base}/${key}.txt`, urlList: [...new Set(paths)].map((p) => `${base}${p === "/" ? "" : p}`) }),
    signal: AbortSignal.timeout(5000),
  }).catch((e) => console.warn("[indexnow]", (e as Error).message));
}
