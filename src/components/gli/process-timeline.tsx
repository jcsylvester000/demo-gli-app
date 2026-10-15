import { RegMark } from "@/components/brand/print-marks";

type Step = { n: string; title: string; body: string };

/**
 * S7 On-Press Process Timeline (How It Works Timeline, MIT; rebuilt). Six steps on a "press line" with registration
 * marks as nodes. Horizontal on desktop, vertical on mobile. Static (no animation).
 */
export function ProcessTimeline({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative grid gap-8 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-[11px] top-2 w-px bg-gli-line lg:inset-x-0 lg:bottom-auto lg:left-0 lg:top-[11px] lg:h-px lg:w-auto"
      />
      {steps.map((s) => (
        <li key={s.n} className="relative pl-10 lg:pl-0 lg:pt-10">
          <span className="absolute left-0 top-0 grid size-6 place-items-center rounded-full bg-white text-gli-blue">
            <RegMark className="size-6" />
          </span>
          <p className="tabular font-heading text-sm font-semibold text-gli-signal">{s.n}</p>
          <h3 className="mt-0.5 text-xl">{s.title}</h3>
          <p className="mt-2 text-[0.9375rem] leading-6 text-gli-slate">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
