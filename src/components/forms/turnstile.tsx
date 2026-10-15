"use client";

import { useEffect, useRef } from "react";

const TEST_KEY = "1x00000000000000000000AA";
/** Cloudflare's documented dummy token: accepted only together with the test secret key. */
const DUMMY_TOKEN = "XXXX.DUMMY.TOKEN.XXXX";

type TurnstileApi = { render: (el: HTMLElement, opts: Record<string, unknown>) => string; remove: (id: string) => void };

/**
 * Cloudflare Turnstile widget (BRD FR-062). With no site key configured (local/dev) the test key path is used and no
 * script is loaded, so the form works offline; set NEXT_PUBLIC_TURNSTILE_SITE_KEY + TURNSTILE_SECRET_KEY for production.
 */
export function Turnstile({ onToken }: { onToken: (t: string | null) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || TEST_KEY;
  const cb = useRef(onToken);
  useEffect(() => {
    cb.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (siteKey === TEST_KEY) {
      cb.current(DUMMY_TOKEN);
      return;
    }
    let id: string | null = null;
    const w = window as unknown as { turnstile?: TurnstileApi };
    const render = () => {
      if (!ref.current || !w.turnstile) return;
      id = w.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (t: string) => cb.current(t),
        "expired-callback": () => cb.current(null),
        "error-callback": () => cb.current(null),
      });
    };
    if (w.turnstile) render();
    else {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    }
    return () => {
      if (id && w.turnstile) w.turnstile.remove(id);
    };
  }, [siteKey]);

  if (siteKey === TEST_KEY) return null;
  return <div ref={ref} className="min-h-[65px]" />;
}
