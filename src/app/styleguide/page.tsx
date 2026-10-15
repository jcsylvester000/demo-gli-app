import { GliMark, LogoLockup } from "@/components/brand/logo";
import { BrushUnderline, CmykBar, CmykSeal, CropMarks, RegMark } from "@/components/brand/print-marks";
import { buttonClass } from "@/components/ui/button";

export const metadata = { title: "Style guide", robots: { index: false, follow: false } };

const SWATCHES = [
  ["GLI Blue", "bg-gli-blue", "#005AA9", "text-white"],
  ["Library Navy", "bg-gli-navy", "#00306B", "text-white"],
  ["Deep Ink", "bg-gli-ink", "#0B1B33", "text-white"],
  ["Signal Blue", "bg-gli-signal", "#3883C6", "text-white"],
  ["Sky", "bg-gli-sky", "#8DBCE7", "text-gli-ink"],
  ["Sky Tint", "bg-gli-tint", "#E3EEF9", "text-gli-ink"],
  ["Mist", "bg-gli-mist", "#F4F7FB", "text-gli-ink"],
  ["Slate", "bg-gli-slate", "#56606E", "text-white"],
  ["Line", "bg-gli-line", "#D5DEE9", "text-gli-ink"],
  ["Press Yellow", "bg-gli-yellow", "#FFC20E", "text-gli-ink"],
] as const;

/** Brand foundation preview (Batch 1, noindex). Moves behind the admin login in Batch 5. */
export default function StyleGuide() {
  return (
    <div className="container-site space-y-16 py-14">
      <header>
        <p className="eyebrow text-gli-blue">Brand foundation · Batch 1</p>
        <h1 className="mt-2 text-4xl">GLI style guide</h1>
        <p className="mt-3 max-w-2xl text-gli-slate">Tokens, type, buttons and print-heritage motifs from the Brand Kit (Document 1). Every component on the site uses these tokens.</p>
      </header>

      <section aria-labelledby="sg-logo">
        <h2 id="sg-logo" className="text-2xl">Logo</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex h-40 items-center justify-center border border-gli-line bg-white"><GliMark className="h-28 w-auto text-gli-blue" /></div>
          <div className="flex h-40 items-center justify-center bg-gli-blue"><GliMark className="h-28 w-auto text-white" /></div>
          <div className="flex h-40 items-center justify-center bg-gli-navy"><GliMark className="h-28 w-auto text-white" /></div>
          <div className="flex h-40 items-center justify-center border border-gli-line bg-white px-4"><LogoLockup /></div>
        </div>
        <p className="mt-3 text-sm text-gli-slate">Traced from the supplied logo for preview. Replace with GLI&apos;s vector master when supplied (Q-09).</p>
      </section>

      <section aria-labelledby="sg-colour">
        <h2 id="sg-colour" className="text-2xl">Colour</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {SWATCHES.map(([name, bg, hex, fg]) => (
            <li key={name} className={`${bg} ${fg} flex h-28 flex-col justify-end rounded-[var(--radius)] border border-gli-line p-3`}>
              <span className="font-heading font-semibold">{name}</span>
              <span className="text-sm opacity-90">{hex}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sg-type">
        <h2 id="sg-type" className="text-2xl">Typography</h2>
        <div className="mt-6 space-y-3">
          <p className="eyebrow text-gli-blue">Eyebrow · Barlow 600 caps</p>
          <p className="font-heading text-[3.5rem] font-semibold leading-none text-gli-navy">Display 56</p>
          <p className="font-heading text-[2.5rem] font-semibold leading-tight text-gli-navy">H1 · Designed, printed, built, delivered</p>
          <p className="font-heading text-[2rem] font-semibold text-gli-navy">H2 · Designed, printed, built, delivered</p>
          <p className="font-heading text-2xl font-semibold text-gli-navy">H3 · Designed, printed, built, delivered</p>
          <p className="max-w-2xl text-lg">Body L · For thirty years we have taken brands from a blank artboard to a finished booth, a printed detail aid, a gondola on the shelf and a ballroom full of guests.</p>
          <p className="max-w-2xl">Body · Source Sans 3 at 17 px with a 1.6 line height keeps long reads easy on a phone.</p>
          <p className="max-w-2xl italic text-gli-slate">Caption italic · Source Sans 3 400 italic</p>
          <p className="tabular font-heading text-3xl font-semibold text-gli-navy">1996 · 30 · 50+ · 20</p>
          <p className="wordmark text-gli-navy">Graphics Library Incorporated</p>
        </div>
      </section>

      <section aria-labelledby="sg-buttons">
        <h2 id="sg-buttons" className="text-2xl">Buttons</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className={buttonClass("primary")}>Request a Quote</button>
          <button type="button" className={buttonClass("secondary")}>View our work</button>
          <button type="button" className={buttonClass("accent")}>Message us on Viber</button>
        </div>
        <div className="on-dark mt-4 flex flex-wrap gap-3 bg-gli-navy p-5">
          <button type="button" className={buttonClass("accent")}>Start a job ticket</button>
          <button type="button" className={buttonClass("outline-light")}>See the work</button>
        </div>
      </section>

      <section aria-labelledby="sg-motifs">
        <h2 id="sg-motifs" className="text-2xl">Print-heritage motifs</h2>
        <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="relative h-32 bg-gli-mist"><CropMarks /></div>
            <p className="mt-3 text-sm text-gli-slate">Crop marks: portfolio images, tiles, thumbnails</p>
          </div>
          <div>
            <div className="flex h-32 flex-col justify-end bg-gli-tint"><CmykBar /></div>
            <p className="mt-3 text-sm text-gli-slate">CMYK colour bar: hero edge, CTA band</p>
          </div>
          <div>
            <div className="flex h-32 items-center justify-center gap-6 bg-gli-navy text-gli-sky"><RegMark className="size-8" /><CmykSeal /></div>
            <p className="mt-3 text-sm text-gli-slate">Registration mark and CMYK seal</p>
          </div>
          <div>
            <div className="ripple-field h-32 bg-gli-blue" />
            <p className="mt-3 text-sm text-gli-slate">Ripple field: hero, CTA bands (never behind body text)</p>
          </div>
          <div>
            <div className="flex h-32 items-center justify-center bg-white"><span className="relative font-heading text-3xl font-semibold text-gli-navy">show floor.<BrushUnderline className="absolute inset-x-0 -bottom-2" /></span></div>
            <p className="mt-3 text-sm text-gli-slate">Brush underline: one key phrase, active nav item</p>
          </div>
          <div>
            <div className="flex h-32 items-center justify-center border-2 border-dashed border-gli-signal bg-white text-sm text-gli-slate">Dieline border</div>
            <p className="mt-3 text-sm text-gli-slate">Dieline: product spec cards (Batch 2)</p>
          </div>
        </div>
      </section>
    </div>
  );
}
