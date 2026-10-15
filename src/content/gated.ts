/**
 * Text that names clients. `named` shows only when EVERY client listed may be named (permission Yes / Name only);
 * otherwise `anon` shows. Plain strings never name clients. Resolved by lib/gate.ts → resolveText().
 */
export type Gated = string | { named: string; anon: string; clients: string[] };
export const gated = (named: string, anon: string, clients: string[]): Gated => ({ named, anon, clients });

/** An FAQ item. `answer: null` = GLI has not supplied the answer yet: the item is hidden. */
export type Faq = { q: string; a: string | null };
