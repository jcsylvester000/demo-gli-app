import Link from "next/link";
import { CmykBar } from "@/components/brand/print-marks";
import { buttonClass } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { linksFor, responsePromiseFor } from "@/content/site";
import { getContact } from "@/lib/server/site-settings";

/** CTA band on every page except /quote (BRD §3 navigation model, Document 4 §2). */
export async function CtaBand() {
  const c = await getContact();
  const viber = linksFor(c).viber();
  return (
    <section aria-labelledby="cta-band-title" className="on-dark ripple-field relative overflow-hidden bg-gli-blue text-white">
      <div className="container-site flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 id="cta-band-title" className="text-3xl text-white md:text-[2.25rem]">
            Got a launch, convention or rollout coming up?
          </h2>
          <p className="mt-3 text-lg text-gli-tint">
            Start a job ticket in four short steps. You&apos;ll get a ticket number straight away and a call from a producer{responsePromiseFor(c)}.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/quote" className={buttonClass("accent", "lg")}>
            Start a job ticket
          </Link>
          {viber ? (
            <TrackedLink href={viber} event="chat_click" channel="viber" location="cta_band" className={buttonClass("outline-light", "lg")}>
              Message us on Viber
            </TrackedLink>
          ) : (
            <Link href="/contact" className={buttonClass("outline-light", "lg")}>
              Contact us
            </Link>
          )}
        </div>
      </div>
      <CmykBar />
    </section>
  );
}
