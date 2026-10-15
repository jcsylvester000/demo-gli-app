"use client";

import { useEffect, useRef, useState } from "react";
import { RegMark } from "@/components/brand/print-marks";
import { cn } from "@/lib/utils";

type Counter = { value: number; suffix?: string; label: string; animate: boolean };

/** One number: server HTML has the final value (works without JS); counts up once when scrolled into view. */
function Ticker({ value, suffix = "", animate }: Counter) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!animate || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) return; // already on screen: keep the final value, no flash
    setShown(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1400;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [animate, value]);

  return (
    <span ref={ref} className="tabular">
      <span aria-hidden="true">
        {shown}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}

/**
 * S4 Since-1996 Counters (Number Ticker, Magic UI, MIT; rebuilt). Registration-mark bullets; "1996" never animates;
 * final values show instantly under reduced motion and without JavaScript (FR-015).
 */
export function Counters({ items, tone = "light", className }: { items: Counter[]; tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4", className)}>
      {items.map((c) => (
        <div key={c.label} className="flex flex-col">
          <dt className="order-2 mt-1 text-[0.9375rem] leading-5 text-gli-slate data-[dark=true]:text-gli-tint" data-dark={dark}>
            {c.label}
          </dt>
          <dd
            className={cn(
              "order-1 flex items-center gap-2 font-heading text-[2.5rem] font-semibold leading-none md:text-5xl",
              dark ? "text-white" : "text-gli-navy",
            )}
          >
            <RegMark className={cn("size-5", dark ? "text-gli-sky" : "text-gli-signal")} />
            <Ticker {...c} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
