import { clientBySlug, CLIENTS, type PermissionStatus } from "@/content/clients";
import { CASES, FEATURED_CASE_ORDER, type CaseStudy } from "@/content/cases";
import type { WorkImage } from "@/content/work-images";
import type { Gated } from "@/content/gated";

/**
 * The publishing gate (BRD FR-011, FR-014, FR-032, FR-082, FR-086; decisions D-1, D-2).
 * Pure functions: the same rules run on the server for every page. Governance data comes from Neon via
 * lib/server/governance.ts; when the database is unreachable the defaults below apply (safe = anonymous).
 *
 * Rules
 * - Client NAME shows only for status yes / name_only; LOGO only for yes.
 * - A case is visible when its admin workflow is "published", or (no admin row yet) when it is not Rx-sensitive.
 * - Rx-sensitive cases/images need Rx clearance; a client set to "no" hides that client's case images.
 */
export type CaseRow = { workflow: string; rx_sensitive: boolean; rx_cleared: boolean };
export type Testimonial = { id: number; quote: string; person: string; title: string | null; clientSlug: string | null };
export type ProductSetting = { priceCentavos: number | null; leadTime: string | null };
export type Governance = {
  clients: Record<string, PermissionStatus>;
  cases: Record<string, CaseRow>;
  testimonials: Testimonial[];
  products: Record<string, ProductSetting>;
  source: "database" | "defaults";
};

export const EMPTY_GOVERNANCE: Governance = { clients: {}, cases: {}, testimonials: [], products: {}, source: "defaults" };

/** Named text only when every client it mentions may be named; otherwise the anonymous wording. */
export function resolveText(g: Governance, t: Gated): string {
  if (typeof t === "string") return t;
  return t.clients.every((slug) => canShowName(clientStatus(g, slug))) ? t.named : t.anon;
}

export const productSetting = (g: Governance, slug: string): ProductSetting => g.products[slug] ?? { priceCentavos: null, leadTime: null };

export const clientStatus = (g: Governance, slug: string): PermissionStatus => g.clients[slug] ?? "pending";
export const canShowName = (s: PermissionStatus) => s === "yes" || s === "name_only";
export const canShowLogo = (s: PermissionStatus) => s === "yes";

function rxState(g: Governance, c: CaseStudy) {
  const row = g.cases[c.slug];
  return { rx: c.rx || !!row?.rx_sensitive, cleared: !!row?.rx_cleared };
}

export function caseVisible(g: Governance, c: CaseStudy): boolean {
  const row = g.cases[c.slug];
  const { rx, cleared } = rxState(g, c);
  if (rx && !cleared) return false;
  if (row) return row.workflow === "published";
  return !c.rx;
}

export type ResolvedCase = {
  slug: string;
  id: string;
  title: string;
  clientLabel: string;
  named: boolean;
  where: string;
  yearLabel?: string;
  year?: number;
  delivered: string;
  industry: CaseStudy["industry"];
  services: string[];
  archive: boolean;
  brief: string;
  whatWeDelivered: string;
  outcome?: string;
  images: WorkImage[];
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Applies names or anonymous wording + image rules to one case. */
export function resolveCase(g: Governance, c: CaseStudy): ResolvedCase {
  const named = c.clients.length > 0 && c.clients.every((slug) => canShowName(clientStatus(g, slug)));
  const label = named ? c.clients.map((s) => clientBySlug(s)?.name ?? s).join(", ") : c.anonClient;
  const fill = (t: string) => t.replaceAll("{Client}", named ? label : cap(label)).replaceAll("{client}", label);
  const { rx, cleared } = rxState(g, c);
  const images = c.images.filter((img) => (!img.rx && !rx) || cleared).filter((img) => !img.client || clientStatus(g, img.client) !== "no");
  return {
    slug: c.slug,
    id: c.id,
    title: named ? c.title : (c.anonTitle ?? c.title),
    clientLabel: named ? label : cap(label),
    named,
    where: named ? c.where : (c.anon?.where ?? c.where),
    yearLabel: c.yearLabel ?? (c.year ? String(c.year) : undefined),
    year: c.year,
    delivered: c.delivered,
    industry: c.industry,
    services: c.services,
    archive: c.archive,
    brief: fill(named ? c.brief : (c.anon?.brief ?? c.brief)),
    whatWeDelivered: fill(named ? c.whatWeDelivered : (c.anon?.whatWeDelivered ?? c.whatWeDelivered)),
    outcome: c.outcome,
    images,
  };
}

export const visibleCases = (g: Governance) => CASES.filter((c) => caseVisible(g, c)).map((c) => resolveCase(g, c));

/** Home featured work: first 3 visible, non-archive cases in the editorial order (FR-014, FR-033). */
export function featuredCases(g: Governance, n = 3): ResolvedCase[] {
  const out: ResolvedCase[] = [];
  for (const slug of FEATURED_CASE_ORDER) {
    const c = CASES.find((x) => x.slug === slug);
    if (c && !c.archive && caseVisible(g, c)) out.push(resolveCase(g, c));
    if (out.length === n) break;
  }
  return out;
}

/** Clients whose names may be shown (ribbon, Clients page). */
export const nameableClients = (g: Governance) =>
  CLIENTS.filter((c) => canShowName(clientStatus(g, c.slug))).map((c) => ({ ...c, logo: canShowLogo(clientStatus(g, c.slug)) }));

/** Testimonials only when approved AND the client allows its name (S11). */
export const approvedTestimonials = (g: Governance) =>
  g.testimonials.filter((t) => !t.clientSlug || canShowName(clientStatus(g, t.clientSlug)));
