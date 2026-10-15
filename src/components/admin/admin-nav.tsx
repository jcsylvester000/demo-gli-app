"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { GliMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string; group: string };

export function AdminNav({ items, user }: { items: NavItem[]; user: { name: string; role: string } }) {
  const pathname = usePathname() || "/admin";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/"));
  const groups = [...new Set(items.map((i) => i.group))];

  const signOut = async () => {
    await authClient.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  const nav = (
    <nav aria-label="Admin" className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
      {groups.map((g) => (
        <div key={g}>
          <p className="px-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-gli-sky">{g}</p>
          <ul className="mt-1.5 space-y-0.5">
            {items
              .filter((i) => i.group === g)
              .map((i) => (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    onClick={() => setOpen(false)}
                    aria-current={active(i.href) ? "page" : undefined}
                    className={cn("block rounded-md px-2 py-2 text-[0.9375rem] font-semibold", active(i.href) ? "bg-white text-gli-navy" : "text-white/90 hover:bg-white/10")}
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
      <div className="mt-auto space-y-1 border-t border-white/15 pt-4 text-[0.875rem]">
        <p className="px-2 text-white/80">
          {user.name} · <span className="text-gli-sky">{user.role.toLowerCase()}</span>
        </p>
        <Link href="/" className="block rounded-md px-2 py-1.5 text-white/90 hover:bg-white/10" target="_blank">
          View website ↗
        </Link>
        <button type="button" onClick={signOut} className="block w-full rounded-md px-2 py-1.5 text-left text-white/90 hover:bg-white/10">
          Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <>
      <div className="on-dark sticky top-0 z-40 flex h-14 items-center justify-between bg-gli-navy px-4 text-white lg:hidden">
        <span className="flex items-center gap-2 font-heading font-semibold">
          <GliMark className="h-7 w-auto text-white" title="" /> GLI Admin
        </span>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="admin-drawer" className="grid size-10 place-items-center rounded-md hover:bg-white/10">
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>
      <aside
        id="admin-drawer"
        className={cn(
          "on-dark fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gli-navy text-white transition-transform lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="hidden h-16 items-center gap-2 border-b border-white/15 px-5 font-heading text-lg font-semibold lg:flex">
          <GliMark className="h-8 w-auto text-white" title="" /> GLI Admin
        </div>
        {nav}
      </aside>
      {open ? <button type="button" aria-label="Close menu" className="fixed inset-0 z-40 bg-gli-ink/40 lg:hidden" onClick={() => setOpen(false)} /> : null}
    </>
  );
}
