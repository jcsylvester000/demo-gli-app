import "server-only";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "../auth";
import { getPool } from "../pool";
import type { Role } from "../users";

export type { Role };

/**
 * Role matrix (Build-Out Guide B-20):
 * - SALES: leads (view, update, notes, files).
 * - EDITOR: cases workflow, products (price/lead time), contact settings, styleguide. No lead data.
 * - ADMIN: everything, plus users, client register, Rx clearance, testimonials, redirects, CSV export, erase.
 */
export type Area = "leads" | "content" | "admin";
const ALLOWED: Record<Area, Role[]> = { leads: ["ADMIN", "SALES"], content: ["ADMIN", "EDITOR"], admin: ["ADMIN"] };
export const can = (role: Role, area: Area) => ALLOWED[area].includes(role);

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  username?: string | null;
  twoFactorEnabled?: boolean | null;
  mustChangePassword?: boolean | null;
};

export async function getAdminSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Page guard: signed out → login; temporary password → change it; wrong role → 404. */
export async function requireAdmin(area?: Area): Promise<AdminUser> {
  const s = await getAdminSession();
  if (!s) redirect("/admin/login");
  const u = s.user as unknown as AdminUser;
  if (u.mustChangePassword) redirect("/admin/security/change-password");
  const role = (u.role ?? "SALES") as Role;
  if (area && !can(role, area)) notFound();
  return { ...u, role };
}

/** Action / route guard: same rules, throws instead of redirecting. */
export async function requireAdminAction(area?: Area): Promise<AdminUser> {
  const s = await getAdminSession();
  const u = s?.user as unknown as AdminUser | undefined;
  if (!u || u.mustChangePassword) throw new Error("Not authorised");
  const role = (u.role ?? "SALES") as Role;
  if (area && !can(role, area)) throw new Error("Not authorised");
  return { ...u, role };
}

/** Audit trail (BRD NFR-04): who did what to which record. Never stores personal data in `target`. */
export async function audit(actorId: string | null, action: string, target?: string) {
  await getPool()
    .query(`INSERT INTO admin_audit (actor_id, action, target) VALUES ($1, $2, $3)`, [actorId, action, target ?? null])
    .catch((e) => console.error("[audit]", (e as Error).message));
}
