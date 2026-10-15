import { responsePromise } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { RegMark } from "@/components/brand/print-marks";
import { JobTicketForm } from "@/components/forms/job-ticket-form";

export const metadata = pageMetadata({
  title: "Request a Quote | Start a Job Ticket | GLI",
  description: "Tell us what you need in four short steps and upload your brief. You get a ticket number straight away and a reply from a producer.",
  path: "/quote",
});

/** /quote (BRD P-30). No CTA band or floating chat here (layout hides them). */
export default function QuotePage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Request a Quote", href: "/quote" }]} />
      <section className="bg-gli-mist">
        <div className="container-site py-8 md:py-12">
          <div className="max-w-3xl">
            <p className="eyebrow text-gli-blue">Request a quote</p>
            <h1 className="mt-2 text-[2.25rem] leading-[1.08] md:text-[3rem]">Start a job ticket</h1>
            <p className="mt-4 text-lg text-gli-ink">
              Four short steps. You&apos;ll get a ticket number right away and a call from a producer{responsePromise()}.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-[0.9375rem] text-gli-slate">
              <RegMark className="text-gli-signal" /> One accountable team since 1996 · 50+ brands served
            </p>
          </div>
          <div className="mt-8">
            <JobTicketForm />
          </div>
        </div>
      </section>
    </>
  );
}
