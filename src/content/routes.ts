import { ALL_SERVICES, INDUSTRIES } from "./site";

/**
 * Launch URLs (BRD §3 page inventory). Pages not built yet render a "being built" placeholder (noindex)
 * from app/(site)/[...slug]; each batch replaces placeholders with real routes.
 */
export type RouteDef = { path: string; title: string; parent?: string; batch: number };

export const LAUNCH_ROUTES: RouteDef[] = [
  { path: "/services", title: "Services", batch: 3 },
  ...ALL_SERVICES.map((s) => ({ path: `/services/${s.slug}`, title: s.name, parent: "/services", batch: 3 })),
  { path: "/industries", title: "Industries", batch: 3 },
  ...INDUSTRIES.map((i) => ({ path: `/industries/${i.slug}`, title: i.name, parent: "/industries", batch: 3 })),
  { path: "/work", title: "Work", batch: 3 },
  { path: "/products", title: "Products", batch: 3 },
  { path: "/insights", title: "Insights", batch: 3 },
  { path: "/about", title: "About", batch: 3 },
  { path: "/about/how-we-work", title: "How We Work", parent: "/about", batch: 3 },
  { path: "/about/clients", title: "Clients", parent: "/about", batch: 3 },
  { path: "/contact", title: "Contact", batch: 4 },
  { path: "/quote", title: "Request a Quote", batch: 4 },
  { path: "/faq", title: "FAQ", batch: 3 },
  { path: "/privacy", title: "Privacy Notice", batch: 3 },
  { path: "/terms", title: "Terms of Use", batch: 3 },
  { path: "/admin", title: "Admin", batch: 5 },
];

export const routeByPath = (path: string) => LAUNCH_ROUTES.find((r) => r.path === path);
