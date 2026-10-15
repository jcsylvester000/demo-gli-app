"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { authClient } from "@/lib/auth-client";
import { btn, input, Label } from "./ui";

/** Optional TOTP two-step verification (Google Authenticator, Microsoft Authenticator, 1Password…). */
export function TwoFactor({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<"idle" | "scan">("idle");
  const [qr, setQr] = useState<string | null>(null);
  const [codes, setCodes] = useState<string[]>([]);
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({});
  const [busy, setBusy] = useState(false);

  async function start(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg({});
    const password = String(new FormData(e.currentTarget).get("password"));
    const r = await authClient.twoFactor.enable({ password });
    setBusy(false);
    if (r.error || !r.data) return setMsg({ err: "Password is incorrect." });
    if (!("totpURI" in r.data)) return setMsg({ err: "Authenticator setup is not available." });
    setQr(await QRCode.toDataURL(r.data.totpURI, { margin: 1, width: 200 }));
    setCodes(r.data.backupCodes);
    setStep("scan");
  }

  async function verify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const code = String(new FormData(e.currentTarget).get("code")).replace(/\s/g, "");
    const r = await authClient.twoFactor.verifyTotp({ code });
    setBusy(false);
    if (r.error) return setMsg({ err: "That code didn't work. Check the time on your phone and try again." });
    setMsg({ ok: "Two-step verification is on." });
    setStep("idle");
    router.refresh();
  }

  async function disable(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const password = String(new FormData(e.currentTarget).get("password"));
    const r = await authClient.twoFactor.disable({ password });
    setBusy(false);
    if (r.error) return setMsg({ err: "Password is incorrect." });
    setMsg({ ok: "Two-step verification is off." });
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {step === "scan" && qr ? (
        <form onSubmit={verify} className="space-y-3">
          <p>Scan this code with your authenticator app, then enter the 6-digit code it shows.</p>
          {/* eslint-disable-next-line @next/next/no-img-element -- data URL generated in the browser */}
          <img src={qr} alt="QR code for your authenticator app" width={200} height={200} className="rounded border border-gli-line" />
          <p className="text-[0.875rem] text-gli-slate">Backup codes (store them somewhere safe; each works once):</p>
          <pre className="rounded bg-gli-mist p-3 font-mono text-[0.8125rem]">{codes.join("\n")}</pre>
          <label className="block max-w-xs">
            <Label>6-digit code</Label>
            <input name="code" required inputMode="numeric" autoComplete="one-time-code" className={`${input} text-center font-mono tracking-[0.3em]`} />
          </label>
          <button disabled={busy} className={btn("primary")}>
            Turn on
          </button>
        </form>
      ) : enabled ? (
        <form onSubmit={disable} className="flex flex-wrap items-end gap-2">
          <label>
            <Label>Password to turn off</Label>
            <input name="password" type="password" required autoComplete="current-password" className={input} />
          </label>
          <button disabled={busy} className={btn("secondary")}>
            Turn off two-step verification
          </button>
        </form>
      ) : (
        <form onSubmit={start} className="flex flex-wrap items-end gap-2">
          <label>
            <Label>Your password</Label>
            <input name="password" type="password" required autoComplete="current-password" className={input} />
          </label>
          <button disabled={busy} className={btn("primary")}>
            Set up two-step verification
          </button>
        </form>
      )}
      {msg.err ? (
        <p role="alert" className="font-semibold text-danger">
          {msg.err}
        </p>
      ) : null}
      {msg.ok ? (
        <p role="status" className="font-semibold text-success">
          {msg.ok}
        </p>
      ) : null}
    </div>
  );
}
