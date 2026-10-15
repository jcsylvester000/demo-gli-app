import { cn } from "@/lib/utils";
import { MARK_PATH, MARK_VIEWBOX } from "./mark-path";

/** The GLI brush mark (with "G L I" letters), drawn in currentColor. Kept exactly as supplied: never stretched, recoloured outside the palette, or rotated. */
export function GliMark({ className, title = "GLI" }: { className?: string; title?: string }) {
  return (
    <svg viewBox={MARK_VIEWBOX} className={cn("shrink-0", className)} role="img" aria-label={title} focusable="false">
      <path fill="currentColor" fillRule="evenodd" d={MARK_PATH} />
    </svg>
  );
}

/** Horizontal lockup (Brand Kit §2): mark + "Graphics Library / Incorporated". Minimum mark height 32 px. */
export function LogoLockup({ tone = "blue", className }: { tone?: "blue" | "white"; className?: string }) {
  const white = tone === "white";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <GliMark className={cn("h-11 w-auto", white ? "text-white" : "text-gli-blue")} title="" />
      <span className="flex flex-col leading-none" aria-hidden="true">
        <span className={cn("font-heading text-[1.125rem] font-semibold tracking-tight", white ? "text-white" : "text-gli-navy")}>Graphics Library</span>
        <span className={cn("font-heading text-[0.8125rem] font-medium", white ? "text-gli-sky" : "text-gli-blue")}>Incorporated</span>
      </span>
      <span className="sr-only">Graphics Library, Inc.</span>
    </span>
  );
}
