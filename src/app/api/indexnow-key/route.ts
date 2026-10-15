import { indexNowKey } from "@/lib/server/indexnow";

/** Serves the IndexNow key file (reached at /<key>.txt through a rewrite). */
export function GET() {
  const key = indexNowKey();
  return key ? new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } }) : new Response("Not found", { status: 404 });
}
