"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { addToCart, QUOTE_CART_EVENT, readCart, removeFromCart } from "@/lib/quote-cart";
import { track } from "@/lib/analytics/track";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** "Add to quote" toggle for a product (FR-042). Fires add_to_quote. */
export function AddToQuote({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const sync = () => setAdded(readCart().includes(slug));
    sync();
    window.addEventListener(QUOTE_CART_EVENT, sync);
    return () => window.removeEventListener(QUOTE_CART_EVENT, sync);
  }, [slug]);

  return (
    <div className={cn("grid gap-2", className)}>
      <button
        type="button"
        aria-pressed={added}
        onClick={() => {
          if (added) removeFromCart(slug);
          else {
            addToCart(slug);
            track("add_to_quote", { product: slug });
          }
        }}
        className={buttonClass(added ? "secondary" : "primary", "md", "w-full")}
      >
        {added ? <Check aria-hidden="true" className="size-4" /> : <Plus aria-hidden="true" className="size-4" />}
        {added ? "Added to quote" : "Add to quote"}
        <span className="sr-only"> {name}</span>
      </button>
      {added ? (
        <Link href="/quote" className="text-center text-[0.875rem] font-semibold text-gli-blue underline underline-offset-4">
          Go to job ticket
        </Link>
      ) : null}
    </div>
  );
}

/** Small count on the header button: "Request a Quote (2)". */
export function QuoteCount() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const sync = () => setN(readCart().length);
    sync();
    window.addEventListener(QUOTE_CART_EVENT, sync);
    return () => window.removeEventListener(QUOTE_CART_EVENT, sync);
  }, []);
  if (!n) return null;
  return (
    <span
      className="ml-1 inline-grid min-w-5 place-items-center rounded-full bg-gli-yellow px-1 text-[0.75rem] text-gli-ink"
      aria-label={`${n} item${n > 1 ? "s" : ""} in your quote`}
    >
      {n}
    </span>
  );
}
