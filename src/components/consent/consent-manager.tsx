"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, readConsent, writeConsent, type Consent } from "./consent";

/**
 * Data Privacy Act consent banner + consent-gated Google Tag Manager (BRD FR-007, NFR-05).
 * - Accept / Decline / Settings have equal visual weight.
 * - Consent Mode v2 defaults to denied; GTM is only requested after the visitor accepts analytics,
 *   so no analytics cookie or request exists before opt-in (UAT-10).
 * - The choice is remembered and can be reopened from the footer ("Cookie settings").
 */
export function ConsentManager({ gtmId }: { gtmId?: string }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const c = readConsent();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only storage after mount
    setConsent(c);
    setOpen(!c);
    const reopen = () => {
      setAnalytics(!!readConsent()?.analytics);
      setSettings(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (!consent) return;
    const w = window as unknown as { gtag?: (...a: unknown[]) => void };
    w.gtag?.("consent", "update", { analytics_storage: consent.analytics ? "granted" : "denied" });
  }, [consent]);

  const save = (a: boolean) => {
    setConsent(writeConsent(a));
    setOpen(false);
    setSettings(false);
  };

  const loadGtm = !!gtmId && !!consent?.analytics;
  const btn =
    "min-h-11 rounded-[var(--radius)] border border-gli-navy bg-white px-4 font-heading font-semibold text-gli-navy hover:bg-gli-navy hover:text-white";

  return (
    <>
      {loadGtm ? (
        <>
          <Script id="gli-consent-default" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
            gtag('consent','update',{analytics_storage:'granted'});
            dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
          `}</Script>
          <Script id="gli-gtm" strategy="lazyOnload" src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId!)}`} />
        </>
      ) : null}

      {open ? (
        <div role="dialog" aria-modal="false" aria-labelledby="consent-title" className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4">
          <div className="mx-auto max-w-3xl rounded-[var(--radius)] border border-gli-line bg-white p-5 shadow-[0_18px_40px_-16px_rgb(0_48_107/0.45)] sm:p-6">
            <p id="consent-title" className="font-heading text-lg font-semibold text-gli-navy">
              Cookies
            </p>
            <p className="mt-1.5 text-[0.9375rem] leading-6 text-gli-ink">
              We use cookies to understand how our site is used and to improve it. Analytics stay off unless you accept. See our{" "}
              <Link href="/privacy" className="font-semibold text-gli-blue underline underline-offset-4">
                Privacy Notice
              </Link>
              .
            </p>
            {settings ? (
              <fieldset className="mt-4 space-y-1">
                <legend className="sr-only">Cookie settings</legend>
                <label className="flex min-h-11 items-center gap-3">
                  <input type="checkbox" checked disabled className="size-5 accent-gli-blue" /> Necessary (always on)
                </label>
                <label className="flex min-h-11 items-center gap-3">
                  <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="size-5 accent-gli-blue" />{" "}
                  Analytics (Google Analytics)
                </label>
              </fieldset>
            ) : null}
            <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
              <button type="button" className={btn} onClick={() => save(true)}>
                Accept
              </button>
              <button type="button" className={btn} onClick={() => save(false)}>
                Decline
              </button>
              {settings ? (
                <button type="button" className={btn} onClick={() => save(analytics)}>
                  Save settings
                </button>
              ) : (
                <button type="button" className={btn} onClick={() => setSettings(true)}>
                  Settings
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))}>
      Cookie settings
    </button>
  );
}
