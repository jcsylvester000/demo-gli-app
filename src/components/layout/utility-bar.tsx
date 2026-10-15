import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { linksFor } from "@/content/site";
import { getContact } from "@/lib/server/site-settings";
import { TrackedLink } from "@/components/ui/tracked-link";

/** Utility bar (BRD FR-003): click-to-call, Viber, email. Channels without confirmed values are not shown. For Global Teams is phase 2 (hidden). */
export async function UtilityBar() {
  const c = await getContact();
  const links = linksFor(c);
  const tel = links.tel();
  const viber = links.viber();
  const email = links.email();
  const item = "inline-flex min-h-8 items-center gap-1.5 hover:text-white";
  return (
    <aside aria-label="Quick contact" className="on-dark hidden bg-gli-navy text-[0.875rem] text-gli-sky md:block">
      <div className="container-site flex h-9 items-center justify-between gap-4">
        <p className="eyebrow text-[0.75rem] text-gli-sky">Graphics Library, Inc. · Since 1996</p>
        <ul className="flex items-center gap-5">
          {tel ? (
            <li>
              <TrackedLink href={tel} event="phone_click" channel="phone" location="utility_bar" className={item}>
                <Phone aria-hidden="true" className="size-3.5" /> {links.telLabel()}
              </TrackedLink>
            </li>
          ) : null}
          {viber ? (
            <li>
              <TrackedLink href={viber} event="chat_click" channel="viber" location="utility_bar" className={item}>
                <MessageCircle aria-hidden="true" className="size-3.5" /> Viber
              </TrackedLink>
            </li>
          ) : null}
          {email ? (
            <li>
              <TrackedLink href={email} event="email_click" channel="email" location="utility_bar" className={item}>
                <Mail aria-hidden="true" className="size-3.5" /> {c.email.value}
              </TrackedLink>
            </li>
          ) : null}
          {!tel && !viber && !email ? (
            <li>
              <Link href="/contact" className={item}>
                Contact us
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
    </aside>
  );
}
