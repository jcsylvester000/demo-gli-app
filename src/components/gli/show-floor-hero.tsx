import Link from "next/link";
import type { ReactNode } from "react";
import type { WorkImage } from "@/content/work-images";
import { BrushUnderline, CmykBar } from "@/components/brand/print-marks";
import { buttonClass } from "@/components/ui/button";
import { ProofImage } from "./proof-image";
import { cn } from "@/lib/utils";

/** Ripple field from the GLI deck background (one animated element per section). Decorative. */
function Ripple({ className }: { className?: string }) {
  const rings = [220, 330, 440, 560, 690, 830];
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute", className)}>
      {rings.map((d, i) => (
        <span key={d} className="gli-ripple-ring" style={{ width: d, height: d, animationDelay: `${i * 0.35}s`, opacity: 1 - i * 0.12 }} />
      ))}
    </div>
  );
}

/**
 * S1 Show-Floor Hero (BRD FR-010): eyebrow, H1 with brush underline, sub-line, two CTAs and a 4-image proof collage
 * (real GLI work shown as press proofs with crop marks), ripple background and a CMYK colour bar on the edge.
 * The first collage image is the LCP candidate on desktop: preloaded, never lazy.
 */
export function ShowFloorHero({
  eyebrow,
  h1Lead,
  h1Underline,
  sub,
  primary,
  secondary,
  images,
  children,
}: {
  eyebrow: string;
  h1Lead: string;
  h1Underline: string;
  sub: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  images: WorkImage[];
  children?: ReactNode;
}) {
  const [a, b, c, d] = images;
  return (
    <section className="on-dark relative overflow-hidden bg-gli-blue text-white">
      <Ripple className="left-[78%] top-1/2" />
      <div className="container-site relative grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div>
          <p className="eyebrow text-gli-yellow">{eyebrow}</p>
          <h1 className="mt-4 text-[2.5rem] leading-[1.04] text-white md:text-[3.5rem]">
            {h1Lead}{" "}
            <span className="relative inline-block whitespace-nowrap">
              {h1Underline}
              <BrushUnderline className="absolute inset-x-0 -bottom-2" />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gli-tint md:text-xl">{sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={primary.href} className={buttonClass("accent", "lg")}>
              {primary.label}
            </Link>
            {secondary ? (
              <Link href={secondary.href} className={buttonClass("outline-light", "lg")}>
                {secondary.label}
              </Link>
            ) : null}
          </div>
          {children}
        </div>

        {images.length >= 2 ? (
          <div className="relative mx-auto grid w-full max-w-[34rem] grid-cols-2 gap-5 sm:gap-7" aria-label="Recent GLI work" role="group">
            {a ? <ProofImage image={a} priority sizes="(min-width: 1024px) 260px, 45vw" className="-rotate-2" /> : null}
            {b ? <ProofImage image={b} sizes="(min-width: 1024px) 260px, 45vw" className="mt-8 rotate-[1.5deg]" /> : null}
            {c ? <ProofImage image={c} sizes="(min-width: 1024px) 260px, 45vw" className="-mt-4 rotate-1 max-sm:hidden" /> : null}
            {d ? <ProofImage image={d} sizes="(min-width: 1024px) 260px, 45vw" className="mt-4 -rotate-[1.5deg] max-sm:hidden" /> : null}
          </div>
        ) : null}
      </div>
      <CmykBar />
    </section>
  );
}
