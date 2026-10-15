import { cn } from "@/lib/utils";

/** Crop marks at the four corners of a box (press-sheet trim marks). Parent must be `relative`. Decorative. */
export function CropMarks({ className, tone = "slate" }: { className?: string; tone?: "slate" | "white" | "blue" }) {
  const color = tone === "white" ? "border-white/70" : tone === "blue" ? "border-gli-blue" : "border-gli-slate/60";
  const base = cn("pointer-events-none absolute size-3", color);
  return (
    <span aria-hidden="true" className={className}>
      <span className={cn(base, "-left-2 -top-2 border-r border-b")} />
      <span className={cn(base, "-right-2 -top-2 border-l border-b")} />
      <span className={cn(base, "-bottom-2 -left-2 border-r border-t")} />
      <span className={cn(base, "-bottom-2 -right-2 border-l border-t")} />
    </span>
  );
}

/** CMYK colour-control bar (one per section; 8–14 px tall). Decorative. */
export function CmykBar({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex h-2.5 w-full", className)}>
      <span className="flex-1 bg-cmyk-c" />
      <span className="flex-1 bg-cmyk-m" />
      <span className="flex-1 bg-cmyk-y" />
      <span className="flex-1 bg-cmyk-k" />
    </div>
  );
}

/** Small CMYK seal (footer). Decorative. */
export function CmykSeal({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("inline-grid grid-cols-4 gap-0.5", className)}>
      <span className="size-3 bg-cmyk-c" />
      <span className="size-3 bg-cmyk-m" />
      <span className="size-3 bg-cmyk-y" />
      <span className="size-3 border border-white/40 bg-cmyk-k" />
    </span>
  );
}

/** Registration mark (plate-alignment target), outline only. Decorative. */
export function RegMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4", className)} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="6.5" />
      <path d="M12 1.5v21M1.5 12h21" />
    </svg>
  );
}

/** Brush-stroke underline (echoes the logo's lower stroke). Used under one key phrase or the active nav item. */
export function BrushUnderline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true" className={cn("h-2.5 w-full text-gli-yellow", className)}>
      <path
        fill="currentColor"
        d="M2 9.6C30 5.2 62 3.4 98 3.2c34-.2 66 1.2 98 3.6 2 .2 2.6 2.4.6 2.8-22 1.4-40 2-60 2.6-34 .8-70 1.4-104 1-12-.2-22-.6-30-1.2-2.6-.2-3-2.2-.6-2.4Z"
      />
    </svg>
  );
}
