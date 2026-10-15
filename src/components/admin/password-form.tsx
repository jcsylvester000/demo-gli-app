"use client";

import { changePassword } from "@/app/admin/actions";
import { ActionForm } from "./action-form";
import { btn, input, Label } from "./ui";

export function PasswordForm({ mode }: { mode: "first" | "account" }) {
  return (
    <ActionForm action={changePassword} className="space-y-4" resetOnSuccess>
      {(pending) => (
        <>
          {mode === "account" ? <input type="hidden" name="next" value="account" /> : null}
          <label className="block">
            <Label>{mode === "first" ? "Temporary password" : "Current password"}</Label>
            <input name="current" type="password" autoComplete="current-password" required className={input} />
          </label>
          <label className="block">
            <Label hint="(10+ characters)">New password</Label>
            <input name="password" type="password" autoComplete="new-password" required minLength={10} className={input} />
          </label>
          <label className="block">
            <Label>Confirm new password</Label>
            <input name="confirm" type="password" autoComplete="new-password" required className={input} />
          </label>
          <button disabled={pending} className={btn("primary", mode === "first" ? "w-full" : "")}>
            {pending ? "Saving…" : "Save new password"}
          </button>
        </>
      )}
    </ActionForm>
  );
}
