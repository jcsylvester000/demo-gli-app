import { RegMark } from "@/components/brand/print-marks";

/**
 * "Five vendors vs one partner" diagram for the problem band. Left: one launch split across five suppliers, each
 * hand-off drawn as a dashed break. Right: the same five deliverables on one GLI job ticket. Static, no JS.
 */
const JOBS = [
  { item: "Detail aid", vendor: "Design studio" },
  { item: "Backdrop", vendor: "Large-format printer" },
  { item: "Booth", vendor: "Fabricator" },
  { item: "AVP", vendor: "Video house" },
  { item: "Quiz game", vendor: "App developer" },
];

export function VendorMerge() {
  return (
    <figure className="grid gap-6 sm:grid-cols-2" aria-label="Five suppliers compared with one GLI job ticket">
      <div className="rounded-[var(--radius)] border border-dashed border-gli-line bg-gli-mist p-5">
        <figcaption className="font-heading text-[0.9375rem] font-semibold text-gli-slate">The usual way: five suppliers</figcaption>
        <ol className="mt-4 space-y-2">
          {JOBS.map((j, i) => (
            <li key={j.item}>
              <div className="flex items-center justify-between gap-3 rounded-md border border-gli-line bg-white px-3 py-2 text-[0.9375rem]">
                <span className="font-semibold text-gli-ink">{j.item}</span>
                <span className="text-gli-slate">{j.vendor}</span>
              </div>
              {i < JOBS.length - 1 ? (
                <p className="py-0.5 pl-3 text-[0.75rem] text-danger" aria-hidden="true">
                  ┆ hand-off
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      <div className="relative flex flex-col rounded-[var(--radius)] bg-gli-navy p-5 text-white">
        <p className="flex items-center gap-2 font-heading text-[0.9375rem] font-semibold text-gli-sky">
          <RegMark className="size-4 text-gli-yellow" /> With GLI: one job ticket
        </p>
        <ul className="mt-4 divide-y divide-white/15 rounded-md border border-white/20">
          {JOBS.map((j) => (
            <li key={j.item} className="flex items-center justify-between px-3 py-2.5 text-[0.9375rem]">
              <span className="font-semibold">{j.item}</span>
              <span aria-hidden="true" className="text-gli-yellow">
                ✓
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-4 text-[0.9375rem] text-gli-tint">One producer, one schedule, one colour standard.</p>
      </div>
    </figure>
  );
}
