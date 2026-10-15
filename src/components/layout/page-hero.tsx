import Link from "next/link";
import type { ReactNode } from "react";
import { CmykBar, RegMark } from "@/components/brand/print-marks";
import { buttonClass } from "@/components/ui/button";

/**
 * Inner-page hero (S1 variant): eyebrow, H1, intro, one primary CTA (+ optional secondary) and a proof line,
 * so the first screen of every page carries H1 + proof + CTA (BRD §4 layout rules).
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  primary = { label: "Request a Quote", href: "/quote" },
  secondary,
  proof = "Since 1996 · 50+ brands served · 20 pharmaceutical clients",
  aside,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  primary?: { label: string; href: string } | null;
  secondary?: { label: string; href: string };
  proof?: string | null;
  aside?: ReactNode;
}) {
  return (
    <section className="on-dark ripple-field relative overflow-hidden bg-gli-blue text-white">
      <div className={aside ? "container-site grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.2fr_1fr]" : "container-site py-12 md:py-16"}>
        <div className="max-w-3xl">
          {eyebrow ? <p className="eyebrow text-gli-yellow">{eyebrow}</p> : null}
          <h1 className="mt-3 text-[2.25rem] leading-[1.08] text-white md:text-[3rem]">{title}</h1>
          {intro ? <p className="mt-5 text-lg text-gli-tint md:text-xl">{intro}</p> : null}
          {primary || secondary ? (
            <div className="mt-7 flex flex-wrap gap-3">
              {primary ? (
                <Link href={primary.href} className={buttonClass("accent", "lg")}>
                  {primary.label}
                </Link>
              ) : null}
              {secondary ? (
                <Link href={secondary.href} className={buttonClass("outline-light", "lg")}>
                  {secondary.label}
                </Link>
              ) : null}
            </div>
          ) : null}
          {proof ? (
            <p className="mt-8 inline-flex items-center gap-2 text-[0.9375rem] text-gli-tint">
              <RegMark className="text-gli-sky" /> {proof}
            </p>
          ) : null}
        </div>
        {aside ? <div>{aside}</div> : null}
      </div>
      <CmykBar />
    </section>
  );
}
