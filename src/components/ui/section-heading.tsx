import { cn } from "@/lib/utils";

/** Eyebrow + H2 + hairline rule (Brand Kit §5: thin rule under section titles). */
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  tone = "light",
  className,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? <p className={cn("eyebrow", dark ? "text-gli-yellow" : "text-gli-blue")}>{eyebrow}</p> : null}
      <h2 id={id} className={cn("mt-2 text-3xl md:text-[2.5rem]", dark && "text-white")}>
        {title}
      </h2>
      <div className={cn("hairline mt-4 w-16", dark ? "text-white" : "text-gli-blue")} />
      {intro ? <p className={cn("mt-4 text-lg", dark ? "text-gli-tint" : "text-gli-slate")}>{intro}</p> : null}
    </div>
  );
}
