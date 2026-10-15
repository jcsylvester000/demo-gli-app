"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { LogoLockup } from "@/components/brand/logo";
import { BrushUnderline } from "@/components/brand/print-marks";
import { buttonClass } from "@/components/ui/button";
import { PRIMARY_NAV, SERVICE_GROUPS } from "@/content/site";
import { cn } from "@/lib/utils";
import { QuoteCount } from "@/components/gli/add-to-quote";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

/**
 * Header (BRD FR-001, FR-002): logo lockup, primary nav, Services mega-menu and a persistent Request a Quote button.
 * The mega-menu panel is always in the HTML (crawlable <a href> links) and is shown/hidden with `inert` + CSS.
 * Desktop ≥ 1024 px; below that a menu button opens a full-height panel.
 */
export function Header() {
  const pathname = usePathname() || "/";
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // A mouse user's hover opens the menu just before their click lands; that click should keep it open, not toggle it shut.
  const hoverOpenedAt = useRef(0);

  const closeMega = useCallback((returnFocus = false) => {
    setMegaOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset UI state when the route changes
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Esc closes; Tab is kept inside trigger + panel while the mega-menu is open; outside click closes.
  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMega(true);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current || !triggerRef.current) return;
      const focusables = [triggerRef.current, ...Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href]"))];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const idx = focusables.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && (document.activeElement === first || idx === -1)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || idx === -1)) {
        e.preventDefault();
        first.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t)) closeMega();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [megaOpen, closeMega]);

  // Lock page scroll + Esc for the mobile panel.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setMobileOpen(false);
      if (e.key !== "Tab") return;
      const panel = document.getElementById("mobile-menu");
      if (!panel) return;
      const f = Array.from(panel.querySelectorAll<HTMLElement>("a[href], button, summary"));
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // Move focus into the panel; hand it back to the menu button on close (WCAG 2.4.3).
    const raf = requestAnimationFrame(() => document.getElementById("mobile-menu")?.querySelector<HTMLElement>("a[href], button")?.focus());
    const opener = menuButtonRef.current;
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [mobileOpen]);

  const hoverOpen = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!megaOpen) hoverOpenedAt.current = Date.now();
    setMegaOpen(true);
  };
  const hoverClose = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    closeTimer.current = setTimeout(() => setMegaOpen(false), 180);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gli-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container-site flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <Link href="/" className="rounded-sm">
          <LogoLockup />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {PRIMARY_NAV.map((item) => {
              const active = isActive(pathname, item.href);
              if ("mega" in item && item.mega) {
                return (
                  <li key={item.href} onPointerEnter={hoverOpen} onPointerLeave={hoverClose} className="relative">
                    <button
                      ref={triggerRef}
                      type="button"
                      aria-expanded={megaOpen}
                      aria-controls="mega-services"
                      onClick={() => {
                        if (Date.now() - hoverOpenedAt.current < 500) {
                          hoverOpenedAt.current = 0;
                          setMegaOpen(true);
                          return;
                        }
                        setMegaOpen((o) => !o);
                      }}
                      className={cn(
                        "relative inline-flex min-h-11 items-center gap-1 rounded-sm px-3 font-heading text-[0.9375rem] font-medium text-gli-ink hover:text-gli-blue",
                        active && "text-gli-navy",
                      )}
                    >
                      {item.label}
                      <ChevronDown aria-hidden="true" className={cn("size-4 transition-transform", megaOpen && "rotate-180")} />
                      {active ? <BrushUnderline className="absolute inset-x-2 -bottom-0.5" /> : null}
                    </button>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center rounded-sm px-3 font-heading text-[0.9375rem] font-medium text-gli-ink hover:text-gli-blue",
                      active && "text-gli-navy",
                    )}
                  >
                    {item.label}
                    {active ? <BrushUnderline className="absolute inset-x-2 -bottom-0.5" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/quote" prefetch={false} className={buttonClass("primary", "md", "hidden sm:inline-flex")}>
            Request a Quote
            <QuoteCount />
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-[var(--radius)] text-gli-navy hover:bg-gli-mist lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            ref={menuButtonRef}
            onClick={() => setMobileOpen(true)}
          >
            <Menu aria-hidden="true" className="size-6" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>

      {/* Services mega-menu (desktop). Always rendered so links are crawlable. */}
      <div
        id="mega-services"
        ref={panelRef}
        inert={!megaOpen}
        onPointerEnter={hoverOpen}
        onPointerLeave={hoverClose}
        className={cn(
          "absolute inset-x-0 top-full hidden border-b border-gli-line bg-white shadow-[0_24px_40px_-24px_rgb(0_48_107/0.35)] lg:block",
          megaOpen ? "visible opacity-100" : "invisible opacity-0",
          "transition-opacity duration-150",
        )}
      >
        <div className="container-site py-8">
          <div className="grid grid-cols-4 gap-8">
            {SERVICE_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="eyebrow text-gli-slate">{group.label}</p>
                <ul className="mt-3 space-y-1">
                  {group.services.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`} className="group block rounded-[var(--radius)] p-2 -mx-2 hover:bg-gli-mist">
                        <span className="block font-heading font-semibold text-gli-navy group-hover:text-gli-blue">{s.name}</span>
                        <span className="block text-sm leading-5 text-gli-slate">{s.oneLiner}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gli-line pt-4 text-[0.9375rem]">
            <Link href="/services" className="font-heading font-semibold text-gli-blue hover:underline">
              All services →
            </Link>
            <p className="text-gli-slate">
              Not sure what you need?{" "}
              <Link href="/quote" className="font-semibold text-gli-blue underline underline-offset-4">
                Start a job ticket
              </Link>{" "}
              and we&apos;ll help you scope it.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile menu (< 1024 px) */}
      {mobileOpen
        ? createPortal(
            <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[70] flex flex-col bg-white lg:hidden">
              <div className="container-site flex h-16 items-center justify-between border-b border-gli-line">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <LogoLockup />
                </Link>
                <button
                  type="button"
                  autoFocus
                  className="inline-flex size-11 items-center justify-center rounded-[var(--radius)] text-gli-navy hover:bg-gli-mist"
                  onClick={() => setMobileOpen(false)}
                >
                  <X aria-hidden="true" className="size-6" />
                  <span className="sr-only">Close menu</span>
                </button>
              </div>
              <nav aria-label="Mobile" className="container-site flex-1 overflow-y-auto py-4">
                <details className="group border-b border-gli-line" open={pathname.startsWith("/services")}>
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-heading text-lg font-semibold text-gli-navy">
                    Services <ChevronDown aria-hidden="true" className="size-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="space-y-4 pb-4">
                    {SERVICE_GROUPS.map((g) => (
                      <div key={g.label}>
                        <p className="eyebrow text-gli-slate">{g.label}</p>
                        <ul className="mt-1">
                          {g.services.map((s) => (
                            <li key={s.slug}>
                              <Link href={`/services/${s.slug}`} className="flex min-h-11 items-center text-gli-ink">
                                {s.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <Link href="/services" className="flex min-h-11 items-center font-semibold text-gli-blue">
                      All services →
                    </Link>
                  </div>
                </details>
                <ul>
                  {PRIMARY_NAV.filter((i) => !("mega" in i)).map((item) => (
                    <li key={item.href} className="border-b border-gli-line">
                      <Link
                        href={item.href}
                        aria-current={isActive(pathname, item.href) ? "page" : undefined}
                        className="flex min-h-12 items-center font-heading text-lg font-semibold text-gli-navy"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li className="border-b border-gli-line">
                    <Link href="/contact" className="flex min-h-12 items-center font-heading text-lg font-semibold text-gli-navy">
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="container-site border-t border-gli-line py-4">
                <Link href="/quote" className={buttonClass("primary", "lg", "w-full")}>
                  Request a Quote
                </Link>
              </div>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
