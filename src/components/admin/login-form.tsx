"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { prepareTestLogin } from "@/app/admin/test-login";
import { btn, input, Label } from "./ui";

/** Username + password, then a 6-digit code (or backup code) if two-step verification is on. Generic errors only. */
export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"password" | "totp" | "backup">("password");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const tooMany = "Too many attempts. Try again in 15 minutes.";

  async function onPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const username = String(fd.get("username")).trim();
    const password = String(fd.get("password"));
    await prepareTestLogin(username, password).catch(() => {}); // testing-only fixed login (see app/admin/test-login.ts)
    const { data, error } = await authClient.signIn.username({ username, password });
    setPending(false);
    if (error) return setError(error.status === 429 ? tooMany : "Username or password is incorrect.");
    if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) return setStep("totp");
    router.replace("/admin");
    router.refresh();
  }

  async function onCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const code = String(new FormData(e.currentTarget).get("code")).replace(/\s/g, "");
    const res = step === "totp" ? await authClient.twoFactor.verifyTotp({ code, trustDevice: false }) : await authClient.twoFactor.verifyBackupCode({ code });
    setPending(false);
    if (res.error) return setError(res.error.status === 429 ? tooMany : "That code didn't work. Try again.");
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl">{step === "password" ? "Sign in" : "Two-step verification"}</h1>
      {step === "password" ? (
        <form onSubmit={onPassword} className="mt-5 space-y-4">
          <label className="block">
            <Label>Username</Label>
            <input name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} required className={input} />
          </label>
          <label className="block">
            <Label>Password</Label>
            <input name="password" type="password" autoComplete="current-password" required className={input} />
          </label>
          {error ? (
            <p role="alert" className="text-[0.9375rem] font-semibold text-danger">
              {error}
            </p>
          ) : null}
          <button disabled={pending} className={btn("primary", "w-full")}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : (
        <form onSubmit={onCode} className="mt-5 space-y-4">
          <p className="text-gli-slate">{step === "totp" ? "Enter the 6-digit code from your authenticator app." : "Enter one of your backup codes."}</p>
          <label className="block">
            <Label>{step === "totp" ? "Authentication code" : "Backup code"}</Label>
            <input
              name="code"
              required
              autoFocus
              autoComplete="one-time-code"
              inputMode={step === "totp" ? "numeric" : "text"}
              className={`${input} text-center font-mono text-xl tracking-[0.3em]`}
            />
          </label>
          {error ? (
            <p role="alert" className="text-[0.9375rem] font-semibold text-danger">
              {error}
            </p>
          ) : null}
          <button disabled={pending} className={btn("primary", "w-full")}>
            {pending ? "Checking…" : "Verify"}
          </button>
          <button type="button" onClick={() => setStep(step === "totp" ? "backup" : "totp")} className="w-full text-[0.875rem] font-semibold text-gli-blue underline underline-offset-4">
            {step === "totp" ? "Use a backup code instead" : "Use my authenticator app"}
          </button>
        </form>
      )}
    </div>
  );
}
