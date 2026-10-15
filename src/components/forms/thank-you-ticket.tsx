"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics/track";

/** Ticket number comes from the URL (not personal data); first name + email only from this browser session. */
export function ThankYouTicket({ promise }: { promise: string }) {
  const [t, setT] = useState<{ ticket: string; first?: string; email?: string } | null>(null);
  useEffect(() => {
    const ticket = new URLSearchParams(window.location.search).get("t") || "";
    let first: string | undefined;
    let email: string | undefined;
    try {
      const raw = window.sessionStorage.getItem("gli_last_ticket");
      if (raw) {
        const j = JSON.parse(raw) as { ticket: string; first: string; email: string };
        if (j.ticket === ticket) ({ first, email } = j);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the ticket from the URL once
    setT({ ticket: /^GLI-\d{4}-\d{4}$/.test(ticket) ? ticket : "", first, email });
    if (/^GLI-\d{4}-\d{4}$/.test(ticket)) track("quote_submit", { ticket });
  }, []);

  return (
    <>
      <h1 className="text-[2.25rem] leading-[1.1] md:text-[3rem]">{t?.ticket ? `Ticket ${t.ticket} received` : "Job ticket received"}</h1>
      <p className="mt-4 text-lg text-gli-ink">
        {t?.first ? `Thanks, ${t.first}. ` : "Thank you. "}
        {t?.email ? `A copy is on its way to ${t.email}.` : "A copy is on its way to your inbox."}
      </p>
      <ol className="mt-8 space-y-3 text-lg">
        <li>
          <span className="font-heading font-semibold text-gli-navy">1.</span> A producer reviews your ticket.
        </li>
        <li>
          <span className="font-heading font-semibold text-gli-navy">2.</span> We call or message you{promise}.
        </li>
        <li>
          <span className="font-heading font-semibold text-gli-navy">3.</span> You get a proposal with options and a timeline.
        </li>
      </ol>
    </>
  );
}
