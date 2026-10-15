/**
 * "Add to quote" list (BRD FR-042): product slugs kept in sessionStorage for this browser session and
 * read by Step 1 of the job ticket (Batch 4). Every change fires QUOTE_CART_EVENT so badges stay in sync.
 */
export const QUOTE_CART_KEY = "gli_quote_items_v1";
export const QUOTE_CART_EVENT = "gli:quote-cart";

export function readCart(): string[] {
  try {
    const raw = window.sessionStorage.getItem(QUOTE_CART_KEY);
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 20) : [];
  } catch {
    return [];
  }
}

function write(items: string[]) {
  try {
    window.sessionStorage.setItem(QUOTE_CART_KEY, JSON.stringify(items));
  } catch {
    /* storage blocked: list lasts for this page view */
  }
  window.dispatchEvent(new CustomEvent(QUOTE_CART_EVENT, { detail: items }));
}

export function addToCart(slug: string) {
  const items = readCart();
  if (!items.includes(slug)) write([...items, slug]);
}

export function removeFromCart(slug: string) {
  write(readCart().filter((s) => s !== slug));
}
