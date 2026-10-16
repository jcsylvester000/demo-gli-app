"use client";

import { startTransition, useActionState, useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { ActionState } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

type Action = (prev: ActionState, fd: FormData) => Promise<ActionState>;

/**
 * A server-action form that shows its own success or error line. `resetOnSuccess` clears inputs (e.g. notes).
 * Submitted through onSubmit (not the form `action` prop) so React does not clear the fields when the server returns
 * an error: people keep what they typed and just fix the problem.
 */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
  confirmText,
}: {
  action: Action;
  children: ReactNode | ((pending: boolean) => ReactNode);
  className?: string;
  resetOnSuccess?: boolean;
  confirmText?: string;
}) {
  const [state, run, pending] = useActionState<ActionState, FormData>(action, {});
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (!state.ok) return;
    if (resetOnSuccess) ref.current?.reset();
    // Re-read the page's server data so lists (new/deleted items, badges, counts) update without a manual reload.
    router.refresh();
  }, [state, resetOnSuccess, router]);
  return (
    <form
      ref={ref}
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        if (confirmText && !window.confirm(confirmText)) return;
        const fd = new FormData(e.currentTarget);
        startTransition(() => run(fd));
      }}
    >
      {typeof children === "function" ? children(pending) : children}
      {state.error || state.message ? (
        <p role={state.error ? "alert" : "status"} className={cn("mt-2 text-[0.875rem] font-semibold", state.error ? "text-danger" : "text-success")}>
          {state.error ?? state.message}
        </p>
      ) : null}
    </form>
  );
}
