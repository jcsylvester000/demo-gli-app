/**
 * Launch URLs still waiting for a later batch. They render a "being built" placeholder (noindex) from
 * app/(site)/[...slug]; unknown URLs return a real 404.
 */
export type RouteDef = { path: string; title: string; parent?: string; batch: number };

export const LAUNCH_ROUTES: RouteDef[] = [
  { path: "/contact", title: "Contact", batch: 4 },
  { path: "/quote", title: "Request a Quote", batch: 4 },
  { path: "/admin", title: "Admin", batch: 5 },
];

export const routeByPath = (path: string) => LAUNCH_ROUTES.find((r) => r.path === path);
