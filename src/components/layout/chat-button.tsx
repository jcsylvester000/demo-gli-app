"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { track } from "@/lib/analytics/track";
import type { Channel } from "./channels";

/**
 * Floating "Chat with a producer" (BRD FR-005). Hidden on /quote by the layout.
 * Sits in the bottom-right corner with a 16 px inset and stays clear of in-page CTAs (compact on mobile).
 */
export function ChatButton({ channels, hours }: { channels: Channel[]; hours: string }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 print:hidden">
      {open ? (
        <div id="chat-panel" role="dialog" aria-label="Chat with a producer" className="w-[min(20rem,calc(100vw-2rem))] rounded-[var(--radius)] border border-gli-line bg-white p-4 shadow-[0_18px_40px_-16px_rgb(0_48_107/0.45)]">
          <p className="text-[0.9375rem] leading-6 text-gli-ink">
            Hi! Message us on your favourite app and a GLI producer will reply during office hours{hours ? ` (${hours})` : ""}.
          </p>
          {channels.length ? (
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {channels.map((c) => (
                <li key={c.key}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClick={() => track(c.event, { channel: c.key, location: "chat_panel" })}
                    className="flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-gli-blue font-heading font-semibold text-gli-blue hover:bg-gli-tint"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3 grid gap-2">
              <Link href="/quote" className="flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-gli-blue font-heading font-semibold text-white hover:bg-gli-navy">
                Start a job ticket
              </Link>
              <Link href="/contact" className="flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-gli-blue font-heading font-semibold text-gli-blue hover:bg-gli-tint">
                Contact us
              </Link>
            </div>
          )}
        </div>
      ) : null}
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-controls="chat-panel"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gli-navy px-4 font-heading font-semibold text-white shadow-[0_10px_24px_-10px_rgb(0_48_107/0.7)] hover:bg-gli-blue"
      >
        {open ? <X aria-hidden="true" className="size-5" /> : <MessageCircle aria-hidden="true" className="size-5" />}
        <span className="hidden sm:inline">Chat with a producer</span>
        <span className="sm:hidden">{open ? "Close" : "Chat"}</span>
      </button>
    </div>
  );
}
