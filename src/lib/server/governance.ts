import "server-only";
import { unstable_cache } from "next/cache";
import { EMPTY_GOVERNANCE, type Governance } from "@/lib/gate";
import type { PermissionStatus } from "@/content/clients";
import { getPool, hasDatabase } from "./pool";

/** Cache tag the admin revalidates after any governance change (Batch 5), so pages update within seconds. */
export const GOVERNANCE_TAG = "governance";

/** Throws on database errors so a failure is never stored in the cache. */
async function load(): Promise<Governance> {
  {
    const pool = getPool();
    const [clients, cases, testimonials] = await Promise.all([
      pool.query<{ client_slug: string; status: PermissionStatus }>(`SELECT client_slug, status FROM client_permission`),
      pool.query<{ case_slug: string; workflow: string; rx_sensitive: boolean; rx_cleared: boolean }>(
        `SELECT case_slug, workflow, rx_sensitive, rx_cleared FROM case_status`,
      ),
      pool.query<{ id: string; quote: string; person: string; title: string | null; client_slug: string | null }>(
        `SELECT id, quote, person, title, client_slug FROM testimonial WHERE approved ORDER BY id`,
      ),
    ]);
    return {
      clients: Object.fromEntries(clients.rows.map((r) => [r.client_slug, r.status])),
      cases: Object.fromEntries(cases.rows.map((r) => [r.case_slug, { workflow: r.workflow, rx_sensitive: r.rx_sensitive, rx_cleared: r.rx_cleared }])),
      testimonials: testimonials.rows.map((r) => ({ id: Number(r.id), quote: r.quote, person: r.person, title: r.title, clientSlug: r.client_slug })),
      source: "database",
    };
  }
}

const cachedLoad = unstable_cache(load, ["governance-v1"], { tags: [GOVERNANCE_TAG], revalidate: 300 });

/** Governance data, or the safe defaults (everything anonymous, Rx hidden, no testimonials) when the database is unavailable. */
export async function getGovernance(): Promise<Governance> {
  if (!hasDatabase()) return EMPTY_GOVERNANCE;
  try {
    return await cachedLoad();
  } catch (e) {
    console.warn("[governance] using safe defaults:", (e as Error).message);
    return EMPTY_GOVERNANCE;
  }
}
