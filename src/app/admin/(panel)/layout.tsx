import { can, requireAdmin } from "@/lib/server/admin/guard";
import { AdminNav, type NavItem } from "@/components/admin/admin-nav";

/** Signed-in admin shell. Every page inside also checks its own role (defence in depth). */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const me = await requireAdmin();
  const items: NavItem[] = [
    { href: "/admin", label: "Overview", group: "Dashboard" },
    ...(can(me.role, "leads") ? [{ href: "/admin/leads", label: "Leads & tickets", group: "Dashboard" }] : []),
    ...(can(me.role, "admin") ? [{ href: "/admin/clients", label: "Client permissions", group: "Publishing" }] : []),
    ...(can(me.role, "content") ? [{ href: "/admin/cases", label: "Case studies", group: "Publishing" }] : []),
    ...(can(me.role, "admin") ? [{ href: "/admin/testimonials", label: "Testimonials", group: "Publishing" }] : []),
    ...(can(me.role, "content") ? [{ href: "/admin/products", label: "Prices & lead times", group: "Publishing" }] : []),
    ...(can(me.role, "content") ? [{ href: "/admin/settings", label: "Contact details", group: "Site" }] : []),
    ...(can(me.role, "admin") ? [{ href: "/admin/redirects", label: "Redirects", group: "Site" }] : []),
    ...(can(me.role, "content") ? [{ href: "/admin/styleguide", label: "Style guide", group: "Site" }] : []),
    ...(can(me.role, "admin") ? [{ href: "/admin/team", label: "Team", group: "Account" }] : []),
    { href: "/admin/account", label: "My account", group: "Account" },
  ];
  return (
    <div className="lg:flex">
      <AdminNav items={items} user={{ name: me.name, role: me.role }} />
      <div className="min-w-0 flex-1 p-4 md:p-8">
        {children}
      </div>
    </div>
  );
}
