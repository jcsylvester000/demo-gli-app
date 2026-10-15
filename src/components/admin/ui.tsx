import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Admin UI primitives (GLI tokens, compact). */
export const input = "mt-1 block w-full min-h-10 rounded-md border border-gli-line bg-white px-3 text-[0.9375rem] text-gli-ink focus:border-gli-blue";
export const btn = (v: "primary" | "secondary" | "danger" | "ghost" = "primary", extra?: string) =>
  cn(
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3.5 font-heading text-[0.9375rem] font-semibold transition-colors disabled:opacity-60",
    v === "primary" && "bg-gli-blue text-white hover:bg-gli-navy",
    v === "secondary" && "border border-gli-line bg-white text-gli-navy hover:border-gli-blue",
    v === "danger" && "bg-danger text-white hover:opacity-90",
    v === "ghost" && "text-gli-blue hover:underline",
    extra,
  );

export function PageTitle({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl md:text-3xl">{title}</h1>
        {sub ? <p className="mt-1 text-gli-slate">{sub}</p> : null}
      </div>
      {actions}
    </div>
  );
}

export function Card({ title, children, className, actions }: { title?: string; children: ReactNode; className?: string; actions?: ReactNode }) {
  return (
    <section className={cn("rounded-lg border border-gli-line bg-white p-5", className)}>
      {title || actions ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h2 className="text-lg">{title}</h2> : <span />}
          {actions}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <span className="block text-[0.875rem] font-semibold text-gli-navy">
      {children}
      {hint ? <span className="ml-1 font-normal text-gli-slate">{hint}</span> : null}
    </span>
  );
}

const TONES: Record<string, string> = {
  new: "bg-gli-yellow text-gli-ink",
  contacted: "bg-gli-tint text-gli-navy",
  proposal_sent: "bg-gli-sky/60 text-gli-navy",
  won: "bg-success-tint text-success",
  lost: "bg-gli-line text-gli-slate",
  spam: "bg-gli-line text-gli-slate line-through",
  quote: "bg-gli-blue text-white",
  contact: "bg-gli-signal text-white",
  newsletter: "bg-gli-mist text-gli-navy border border-gli-line",
  yes: "bg-success-tint text-success",
  name_only: "bg-gli-tint text-gli-navy",
  no: "bg-danger-tint text-danger",
  pending: "bg-gli-yellow/60 text-gli-ink",
  published: "bg-success-tint text-success",
  draft: "bg-gli-mist text-gli-slate border border-gli-line",
  hot: "bg-danger-tint text-danger",
  warm: "bg-gli-yellow/60 text-gli-ink",
  cold: "bg-gli-tint text-gli-navy",
};
export function Badge({ value, label }: { value: string; label?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[0.75rem] font-semibold", TONES[value] ?? "bg-gli-mist text-gli-navy")}>
      {label ?? value.replace(/_/g, " ")}
    </span>
  );
}

export const th = "px-3 py-2 text-left text-[0.75rem] font-semibold uppercase tracking-wider text-gli-slate";
export const td = "px-3 py-2.5 align-top text-[0.9375rem]";

/** Date/time in Manila for the admin. */
export const manila = (d: string | Date, withTime = true) =>
  new Date(d).toLocaleString("en-PH", { timeZone: "Asia/Manila", day: "numeric", month: "short", year: "numeric", ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}) });
