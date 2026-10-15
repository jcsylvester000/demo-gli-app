import Link from "next/link";
import { responsePromiseFor } from "@/content/site";
import { getContact } from "@/lib/server/site-settings";
import { chatChannels } from "@/components/layout/channels";
import { CropMarks } from "@/components/brand/print-marks";
import { buttonClass } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { ThankYouTicket } from "@/components/forms/thank-you-ticket";

export const metadata = { title: "Ticket received", robots: { index: false, follow: false } };

/** Thank-you (Document 4 §10): ticket number, next steps and chat links; fires quote_submit. */
export const revalidate = 300;

export default async function ThankYou() {
  const contact = await getContact();
  const channels = chatChannels(contact);
  return (
    <section className="bg-gli-mist">
      <div className="container-site py-14 md:py-20">
        <div className="relative max-w-3xl bg-white p-6 shadow-[0_24px_50px_-30px_rgb(0_48_107/0.55)] md:p-10">
          <CropMarks />
          <p className="eyebrow text-gli-blue">Job ticket</p>
          <ThankYouTicket promise={responsePromiseFor(contact)} />
          {channels.length ? (
            <div className="mt-8 border-t border-dashed border-gli-line pt-6">
              <p className="font-heading font-semibold text-gli-navy">Need us sooner? Message us with your ticket number.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {channels.map((c) => (
                  <TrackedLink key={c.key} href={c.href} event={c.event} channel={c.key} location="thank_you" className={buttonClass("secondary")}>
                    {c.label}
                  </TrackedLink>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/work" className={buttonClass("primary", "lg")}>
              See our work
            </Link>
            <Link href="/" className={buttonClass("secondary", "lg")}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
