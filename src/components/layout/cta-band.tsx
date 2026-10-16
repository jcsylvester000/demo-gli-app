import Link from "next/link";
import { CmykBar, CropMarks } from "@/components/brand/print-marks";
import { buttonClass } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { linksFor, responsePromiseFor } from "@/content/site";
import { getContact } from "@/lib/server/site-settings";

/** CTA band on every page except /quote (BRD §3 navigation model, Document 4 §2). */
export async function CtaBand() {
  const c = await getContact();
  const viber = linksFor(c).viber();
  return (
    <section aria-labelledby="cta-band-title" className="bg-gli-mist">
      <div className="container-site py-14 md:py-20">
        {/* A press sheet on the mat: crop marks outside the trim, ruler ticks along the edges. */}
        <div className="relative">
          <CropMarks />
          <div className="on-dark mat-grid relative overflow-hidden rounded-[var(--radius)] px-6 py-12 text-white md:px-14 md:py-16">
            <span aria-hidden="true" className="mat-ruler-x" />
            <span aria-hidden="true" className="mat-ruler-y" />
            <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <h2
                  id="cta-band-title"
                  className="max-w-2xl text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.015em] text-white md:text-[3.25rem]"
                >
                  Got a launch, convention or rollout coming up?
                </h2>
                <p className="mt-5 max-w-xl text-lg text-gli-tint">
                  Start a job ticket in four short steps. You&apos;ll get a
                  ticket number straight away and a call from a producer
                  {responsePromiseFor(c)}.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link href="/quote" className={buttonClass("accent", "lg")}>
                  Start a job ticket
                </Link>
                {viber ? (
                  <TrackedLink
                    href={viber}
                    event="chat_click"
                    channel="viber"
                    location="cta_band"
                    className={buttonClass("outline-light", "lg")}
                  >
                    Message us on Viber
                  </TrackedLink>
                ) : (
                  <Link
                    href="/contact"
                    className={buttonClass("outline-light", "lg")}
                  >
                    Contact us
                  </Link>
                )}
              </div>
            </div>
            <CmykBar className="absolute inset-x-0 bottom-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
