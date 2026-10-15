import Link from "next/link";
import { GliMark } from "@/components/brand/logo";
import { CmykSeal } from "@/components/brand/print-marks";
import { CookieSettingsButton } from "@/components/consent/consent-manager";
import { TrackedLink } from "@/components/ui/tracked-link";
import { ALL_SERVICES, COMPANY_LINKS, CONTACT, CONTACT_PENDING, LEGAL_LINKS, hasValue, links } from "@/content/site";
import { chatChannels } from "./channels";

/** Press Footer (S10, BRD FR-004): Library Navy, NAP, service/company/contact/legal links, letter-spaced wordmark band and CMYK seal. */
export function Footer() {
  const tel = links.tel();
  const email = links.email();
  const channels = chatChannels().filter((c) => c.key !== "email");
  const heading = "eyebrow text-gli-sky";
  const link = "inline-flex min-h-9 items-center text-white/90 hover:text-white hover:underline underline-offset-4";

  return (
    <footer className="on-dark mt-auto bg-gli-navy text-white">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1.2fr_1fr_1fr]">
        <div>
          <GliMark className="h-16 w-auto text-white" title="" />
          <p className="mt-4 font-heading text-xl font-semibold">{CONTACT.legalName}</p>
          <p className="mt-1 text-gli-sky">{CONTACT.tagline}</p>
          <address className="mt-4 space-y-1 not-italic text-[0.9375rem] text-white/85">
            {hasValue(CONTACT.address) ? <p>{CONTACT.address.value}</p> : null}
            {tel ? (
              <p>
                <TrackedLink href={tel} event="phone_click" channel="phone" location="footer" className="hover:underline">
                  {CONTACT.landline.value}
                </TrackedLink>
              </p>
            ) : null}
            {email ? (
              <p>
                <TrackedLink href={email} event="email_click" channel="email" location="footer" className="hover:underline">
                  {CONTACT.email.value}
                </TrackedLink>
              </p>
            ) : null}
          </address>
        </div>

        <nav aria-label="Services">
          <p className={heading}>Services</p>
          <ul className="mt-3 space-y-0.5 text-[0.9375rem]">
            {ALL_SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={link}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <p className={heading}>Company</p>
          <ul className="mt-3 space-y-0.5 text-[0.9375rem]">
            {COMPANY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <nav aria-label="Get in touch">
            <p className={heading}>Get in touch</p>
            <ul className="mt-3 space-y-0.5 text-[0.9375rem]">
              <li>
                <Link href="/quote" className={link}>
                  Request a Quote
                </Link>
              </li>
              <li>
                <Link href="/contact" className={link}>
                  Contact
                </Link>
              </li>
              {channels.map((c) => (
                <li key={c.key}>
                  <TrackedLink href={c.href} event={c.event} channel={c.key} location="footer" className={link} target="_blank" rel="noopener noreferrer">
                    {c.label}
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Legal" className="mt-6">
            <p className={heading}>Legal</p>
            <ul className="mt-3 space-y-0.5 text-[0.9375rem]">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={link}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton className={link} />
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Wordmark band */}
      <div className="border-t border-white/15 bg-[color-mix(in_oklab,var(--color-gli-navy),black_22%)]">
        <div className="container-site flex flex-col items-center justify-between gap-4 py-5 text-center md:flex-row md:text-left">
          <p className="wordmark text-[0.95rem] text-white/85">Graphics Library Incorporated</p>
          <CmykSeal />
        </div>
        <div className="container-site flex flex-col gap-2 pb-6 text-[0.8125rem] text-white/70 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Graphics Library, Inc. All rights reserved. Client names and marks belong to their respective owners.</p>
          <Link href="/admin" className="hover:text-white" rel="nofollow">
            Admin
          </Link>
        </div>
        {CONTACT_PENDING ? (
          <p className="container-site pb-4 text-[0.75rem] text-gli-yellow">Preview: some contact details are pending confirmation from GLI.</p>
        ) : null}
      </div>
    </footer>
  );
}
