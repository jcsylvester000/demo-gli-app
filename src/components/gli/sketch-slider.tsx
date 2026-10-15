"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { WorkImage } from "@/content/work-images";
import { cn } from "@/lib/utils";

/**
 * S2 Sketch-to-Show-Floor Slider (Image Comparison, Motion Primitives, MIT; rebuilt).
 * Drag (pointer/touch) or use arrow keys / Home / End. The handle is a WAI-ARIA slider: aria-valuenow is announced.
 * Only rendered when a real, permission-cleared before/after pair exists.
 */
export function SketchSlider({
  before,
  after,
  labels = ["3D render", "On the show floor"],
  className,
}: {
  before: WorkImage;
  after: WorkImage;
  labels?: readonly [string, string];
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromX = useCallback((clientX: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.round(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100))));
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={boxRef}
      className={cn("relative aspect-[16/10] touch-pan-y select-none overflow-hidden bg-gli-mist", className)}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setFromX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFromX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1024px) 900px, 100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes="(min-width: 1024px) 900px, 100vw" className="object-cover" />
      </div>
      <span className="eyebrow absolute left-3 top-3 rounded-sm bg-gli-navy/85 px-2 py-1 text-[0.6875rem] text-white">{labels[0]}</span>
      <span className="eyebrow absolute right-3 top-3 rounded-sm bg-gli-yellow px-2 py-1 text-[0.6875rem] text-gli-ink">{labels[1]}</span>
      <div className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgb(0_48_107/0.3)]" style={{ left: `${pos}%` }} aria-hidden="true" />
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Compare ${labels[0]} and ${labels[1]}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pos}
        aria-valuetext={`${pos}% ${labels[0]}`}
        onKeyDown={onKey}
        className="absolute top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border-2 border-white bg-gli-blue text-white shadow-lg"
        style={{ left: `${pos}%` }}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
        </svg>
      </div>
    </div>
  );
}
