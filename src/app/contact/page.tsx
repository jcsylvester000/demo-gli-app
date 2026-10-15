import Link from "next/link";
import { hasValue, linksFor, responsePromiseFor } from "@/content/site";
import { getContact } from "@/lib/server/site-settings";
import { chatChannels } from "@/components/layout/channels";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero } from "@/components/layout/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { TrackedLink } from "@/components/ui/tracked-link";
import { buttonClass } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/contact-form";
import { MapEmbed } from "@/components/forms/map-embed";

export const metadata = pageMetadata({
  title: "Contact GLI | Manila Print, Booth & Event Production",
  description: "Call, email or message GLI. Office details, hours and a short contact form, or start a job ticket for a project.",
  path: "/contact",
});

/** Contact (BRD FR-070). Contact details render only once GLI confirms them (Q-02); the form always works. */
export const revalidate = 300;

export default async function ContactPage() {
  const CONTACT = await getContact();
  const links = linksFor(CONTACT);
  const tel = links.tel();
  const email = links.email();
  const channels = chatChannels(CONTACT).filter((c) => c.key !== "email");
  const hours = CONTACT.hours.pending ? null : CONTACT.hours.value;
  const address = hasValue(CONTACT.address) && !CONTACT.address.pending ? CONTACT.address.value : null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl()}/#localbusiness`,
    name: "Graphics Library, Inc.",
    alternateName: "GLI",
    url: siteUrl(),
    logo: `${siteUrl()}/brand/gli-mark.svg`,
    foundingDate: "1996",
    areaServed: { "@type": "Country", name: "Philippines" },
    ...(address ? { address: { "@type": "PostalAddress", streetAddress: address, addressRegion: "Metro Manila", addressCountry: "PH" } } : {}),
    ...(tel ? { telephone: links.telLabel() } : {}),
    ...(email ? { email: CONTACT.email.value } : {}),
  };

  return (
    <>
      <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />
      <PageHero eyebrow="Contact" title="Talk to GLI" intro={`Call, message or drop by. A producer will get back to you${responsePromiseFor(CONTACT)}.`} primary={{ label: "Start a job ticket", href: "/quote" }} proof={null} />
      <section className="bg-white">
        <div className="container-site grid gap-12 py-12 md:py-16 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-2xl md:text-3xl">Send us a message</h2>
            <p className="mt-2 text-gli-slate">For general questions. For a project, the job ticket is faster.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
          <aside className="space-y-6">
            <div className="on-dark rounded-[var(--radius)] bg-gli-blue p-6 text-white">
              <p className="font-heading text-xl font-semibold">Have a job in mind?</p>
              <p className="mt-2 text-gli-tint">Skip the back-and-forth: start a job ticket and attach your brief.</p>
              <Link href="/quote" className={buttonClass("accent", "md", "mt-4")}>
                Start a job ticket
              </Link>
            </div>
            <div className="rounded-[var(--radius)] border border-gli-line p-6">
              <p className="eyebrow text-gli-slate">Graphics Library, Inc.</p>
              <dl className="mt-3 space-y-2">
                {address ? (
                  <div>
                    <dt className="sr-only">Office</dt>
                    <dd>{address}</dd>
                  </div>
                ) : (
                  <div>
                    <dt className="sr-only">Location</dt>
                    <dd>Metro Manila, Philippines</dd>
                  </div>
                )}
                {tel ? (
                  <div>
                    <dt className="sr-only">Landline</dt>
                    <dd>
                      <TrackedLink href={tel} event="phone_click" channel="phone" location="contact" className="font-semibold text-gli-blue underline underline-offset-4">
                        {links.telLabel()}
                      </TrackedLink>
                    </dd>
                  </div>
                ) : null}
                {email ? (
                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd>
                      <TrackedLink href={email} event="email_click" channel="email" location="contact" className="font-semibold text-gli-blue underline underline-offset-4">
                        {CONTACT.email.value}
                      </TrackedLink>
                    </dd>
                  </div>
                ) : null}
                {hours ? (
                  <div>
                    <dt className="sr-only">Hours</dt>
                    <dd className="text-gli-slate">{hours}</dd>
                  </div>
                ) : null}
              </dl>
              {channels.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {channels.map((c) => (
                    <TrackedLink key={c.key} href={c.href} event={c.event} channel={c.key} location="contact" className={buttonClass("secondary")} target="_blank" rel="noopener noreferrer">
                      {c.label}
                    </TrackedLink>
                  ))}
                </div>
              ) : null}
            </div>
            {address ? <MapEmbed query={address} /> : null}
          </aside>
        </div>
      </section>
      <JsonLd data={schema} />
    </>
  );
}
