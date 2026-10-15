import "server-only";
import { unstable_cache } from "next/cache";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { getPool, hasDatabase } from "./pool";
import { GOVERNANCE_TAG } from "./governance";

type Rule = { to: string; code: 301 | 302 };

const load = unstable_cache(
  async (): Promise<Record<string, Rule>> => {
    const { rows } = await getPool().query<{ from_path: string; to_path: string; code: number }>(`SELECT from_path, to_path, code FROM redirect`);
    return Object.fromEntries(rows.map((r) => [r.from_path.toLowerCase().replace(/\/$/, "") || "/", { to: r.to_path, code: r.code === 302 ? 302 : 301 }]));
  },
  ["redirects-v1"],
  { tags: [GOVERNANCE_TAG], revalidate: 300 },
);

export async function redirectMap(): Promise<Record<string, Rule>> {
  if (!hasDatabase()) return {};
  try {
    return await load();
  } catch {
    return {};
  }
}

/**
 * Called wherever a URL would 404 (BRD FR-092). Applies a saved redirect (permanent = 308, temporary = 307, which
 * search engines treat like 301/302), otherwise shows the branded 404.
 */
export async function redirectOrNotFound(path: string): Promise<never> {
  const key = path.toLowerCase().replace(/\/$/, "") || "/";
  const rule = (await redirectMap())[key];
  if (rule) (rule.code === 301 ? permanentRedirect : redirect)(rule.to);
  notFound();
}

/** Would saving from → to create a loop or a chain back to itself? */
export function createsLoop(map: Record<string, Rule>, from: string, to: string): boolean {
  const norm = (p: string) => p.toLowerCase().replace(/\/$/, "") || "/";
  let cur = norm(to);
  const seen = new Set<string>([norm(from)]);
  for (let i = 0; i < 20; i++) {
    if (seen.has(cur)) return true;
    seen.add(cur);
    const next = map[cur];
    if (!next || /^https?:/i.test(next.to)) return false;
    cur = norm(next.to);
  }
  return true;
}
