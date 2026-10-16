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
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
    >
      {rings.map((d, i) => (
        <span
          key={d}
          className="gli-ripple-ring"
          style={{
            width: d,
            height: d,
            animationDelay: `${i * 0.35}s`,
            opacity: 1 - i * 0.12,
          }}
        />
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
  // Each proof is dealt from off the mat: start offset, rotation and stagger (transform-only animation).
  const deal = (x: string, y: string, r: string, delay: number) =>
    ({
      "--deal-x": x,
      "--deal-y": y,
      "--deal-r": r,
      "--deal-delay": `${delay}s`,
    }) as React.CSSProperties;
  return (
    <section className="on-dark mat-grid relative overflow-hidden text-white">
      <span aria-hidden="true" className="mat-ruler-x" />
      <span aria-hidden="true" className="mat-ruler-y" />
      <Ripple className="left-[76%] top-[52%] opacity-60" />
      <div className="container-site relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_1fr] lg:py-28">
        <div>
          <p className="eyebrow text-gli-sky">{eyebrow}</p>
          <h1 className="mt-5 text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.02em] text-white sm:text-[3.5rem] lg:text-[4.5rem]">
            {h1Lead}{" "}
            <span className="relative inline-block whitespace-nowrap">
              {h1Underline}
              <BrushUnderline className="absolute inset-x-0 -bottom-2" />
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-lg text-gli-tint md:text-xl">
            {sub}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={primary.href} className={buttonClass("accent", "lg")}>
              {primary.label}
            </Link>
            {secondary ? (
              <Link
                href={secondary.href}
                className={buttonClass("outline-light", "lg")}
              >
                {secondary.label}
              </Link>
            ) : null}
          </div>
          {children}
        </div>

        {images.length >= 2 ? (
          <div
            className="relative mx-auto grid w-full max-w-[36rem] grid-cols-2 gap-5 sm:gap-7"
            aria-label="Recent GLI work"
            role="group"
          >
            {a ? (
              <div
                className="gli-deal -rotate-3"
                style={deal("-60px", "80px", "-14deg", 0.05)}
              >
                <ProofImage
                  image={a}
                  priority
                  sizes="(min-width: 1024px) 280px, 45vw"
                />
              </div>
            ) : null}
            {b ? (
              <div
                className="gli-deal mt-10 rotate-2"
                style={deal("70px", "60px", "12deg", 0.18)}
              >
                <ProofImage image={b} sizes="(min-width: 1024px) 280px, 45vw" />
              </div>
            ) : null}
            {c ? (
              <div
                className="gli-deal -mt-6 rotate-1 max-sm:hidden"
                style={deal("-50px", "120px", "10deg", 0.3)}
              >
                <ProofImage image={c} sizes="(min-width: 1024px) 280px, 45vw" />
              </div>
            ) : null}
            {d ? (
              <div
                className="gli-deal mt-4 -rotate-2 max-sm:hidden"
                style={deal("60px", "140px", "-12deg", 0.42)}
              >
                <ProofImage image={d} sizes="(min-width: 1024px) 280px, 45vw" />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <CmykBar />
    </section>
  );
}
