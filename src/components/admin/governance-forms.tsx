"use client";

import { addRedirect, addUser, deleteRedirect, deleteTestimonial, removeUser, resetUserPassword, saveContactSettings, saveTestimonial, setCaseStatus, setClientPermission, setProductSetting, setUserRole } from "@/app/admin/actions";
import { ActionForm } from "./action-form";
import { btn, input, Label } from "./ui";

export function ClientPermissionForm({ slug, status, date, note }: { slug: string; status: string; date: string; note: string }) {
  return (
    <ActionForm action={setClientPermission} className="grid gap-2 md:grid-cols-[10rem_9rem_1fr_auto] md:items-end">
      {(pending) => (
        <>
          <input type="hidden" name="slug" value={slug} />
          <label>
            <Label>Permission</Label>
            <select name="status" defaultValue={status} className={input}>
              <option value="pending">Pending</option>
              <option value="yes">Yes: name + logo</option>
              <option value="name_only">Name only</option>
              <option value="no">No: don&apos;t show</option>
            </select>
          </label>
          <label>
            <Label>Date</Label>
            <input type="date" name="date" defaultValue={date} className={input} />
          </label>
          <label>
            <Label>Evidence</Label>
            <input name="note" defaultValue={note} maxLength={500} placeholder="e.g. Email from brand manager, 12 Nov 2026" className={input} />
          </label>
          <button disabled={pending} className={btn("primary")}>
            {pending ? "Saving…" : "Save"}
          </button>
        </>
      )}
    </ActionForm>
  );
}

export function CaseStatusForm({ slug, workflow, rx, rxCleared, isAdmin }: { slug: string; workflow: string; rx: boolean; rxCleared: boolean; isAdmin: boolean }) {
  return (
    <ActionForm action={setCaseStatus} className="flex flex-wrap items-end gap-3">
      {(pending) => (
        <>
          <input type="hidden" name="slug" value={slug} />
          <label className="min-w-48">
            <Label>Workflow</Label>
            <select name="workflow" defaultValue={workflow} className={input}>
              <option value="draft">Draft (hidden)</option>
              <option value="in_review">In review (hidden)</option>
              <option value="permission_check">Permission check (hidden)</option>
              <option value="approved">Approved (hidden)</option>
              <option value="published">Published</option>
            </select>
          </label>
          {rx ? (
            <label className="flex min-h-10 items-center gap-2 text-[0.9375rem]">
              <input type="checkbox" name="rxCleared" value="on" defaultChecked={rxCleared} disabled={!isAdmin} className="size-4 accent-gli-blue" />
              Rx clearance recorded{!isAdmin ? " (Admin only)" : ""}
            </label>
          ) : null}
          <button disabled={pending} className={btn("primary")}>
            {pending ? "Saving…" : "Save"}
          </button>
        </>
      )}
    </ActionForm>
  );
}

type T = { id?: number; quote?: string; person?: string; title?: string; client?: string; approved?: boolean; evidence?: string };
export function TestimonialForm({ t, clients }: { t?: T; clients: { slug: string; name: string }[] }) {
  return (
    <ActionForm action={saveTestimonial} className="space-y-3" resetOnSuccess={!t?.id}>
      {(pending) => (
        <>
          {t?.id ? <input type="hidden" name="id" value={t.id} /> : null}
          <label className="block">
            <Label>Quote (client&apos;s exact words)</Label>
            <textarea name="quote" defaultValue={t?.quote} required maxLength={600} className={`${input} min-h-20 py-2`} />
          </label>
          <div className="grid gap-3 md:grid-cols-3">
            <label>
              <Label>Person</Label>
              <input name="person" defaultValue={t?.person} required className={input} />
            </label>
            <label>
              <Label>Title</Label>
              <input name="title" defaultValue={t?.title} className={input} />
            </label>
            <label>
              <Label>Company</Label>
              <select name="client" defaultValue={t?.client ?? ""} className={input}>
                <option value="">Not listed</option>
                {clients.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <Label>Approval evidence</Label>
            <input name="evidence" defaultValue={t?.evidence} maxLength={500} placeholder="Who approved it in writing, and when" className={input} />
          </label>
          <label className="flex items-center gap-2 text-[0.9375rem]">
            <input type="checkbox" name="approved" value="on" defaultChecked={t?.approved} className="size-4 accent-gli-blue" /> Approved for the website
          </label>
          <button disabled={pending} className={btn("primary")}>
            {pending ? "Saving…" : t?.id ? "Save changes" : "Add testimonial"}
          </button>
        </>
      )}
    </ActionForm>
  );
}

export function DeleteTestimonial({ id }: { id: number }) {
  return (
    <ActionForm action={deleteTestimonial} confirmText="Delete this testimonial?">
      {(pending) => (
        <>
          <input type="hidden" name="id" value={id} />
          <button disabled={pending} className={btn("ghost", "text-danger")}>
            Delete
          </button>
        </>
      )}
    </ActionForm>
  );
}

export function ProductSettingForm({ slug, price, leadTime }: { slug: string; price: string; leadTime: string }) {
  return (
    <ActionForm action={setProductSetting} className="grid gap-2 sm:grid-cols-[10rem_1fr_auto] sm:items-end">
      {(pending) => (
        <>
          <input type="hidden" name="slug" value={slug} />
          <label>
            <Label hint="(PHP)">Starting from</Label>
            <input name="price" defaultValue={price} inputMode="decimal" placeholder="Price on request" className={input} />
          </label>
          <label>
            <Label>Lead time</Label>
            <input name="leadTime" defaultValue={leadTime} maxLength={80} placeholder="e.g. 5 working days from approved artwork" className={input} />
          </label>
          <button disabled={pending} className={btn("primary")}>
            {pending ? "Saving…" : "Save"}
          </button>
        </>
      )}
    </ActionForm>
  );
}

const CONTACT_LABELS: [string, string, string][] = [
  ["address", "Office address", "Street, City, Metro Manila"],
  ["landline", "Landline", "(02) 8123 4567"],
  ["mobile", "Mobile", "0917 123 4567"],
  ["viberIntl", "Viber number (international)", "+63 917 123 4567"],
  ["whatsappIntl", "WhatsApp number (international)", "+63 917 123 4567"],
  ["messengerPage", "Messenger page", "m.me/yourpage"],
  ["email", "Email", "hello@your-domain"],
  ["hours", "Business hours", "Monday to Friday, 8:30 am to 5:30 pm"],
  ["responseTime", "Response promise", "within one business day"],
];
export function ContactSettingsForm({ values }: { values: Record<string, string> }) {
  return (
    <ActionForm action={saveContactSettings} className="space-y-4">
      {(pending) => (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {CONTACT_LABELS.map(([k, label, ph]) => (
              <label key={k} className="block">
                <Label>{label}</Label>
                <input name={k} defaultValue={values[k] ?? ""} placeholder={ph} maxLength={200} className={input} />
              </label>
            ))}
          </div>
          <p className="text-[0.875rem] text-gli-slate">
            Only filled-in details appear on the website (header, footer, chat button, Contact page, emails). Leave a field empty to hide it. The response promise appears in sentences like
            &ldquo;a producer will call you <em>within one business day</em>&rdquo;.
          </p>
          <button disabled={pending} className={btn("primary")}>
            {pending ? "Saving…" : "Save contact details"}
          </button>
        </>
      )}
    </ActionForm>
  );
}

export function RedirectForm() {
  return (
    <ActionForm action={addRedirect} resetOnSuccess className="grid gap-2 md:grid-cols-[1fr_1fr_8rem_auto] md:items-end">
      {(pending) => (
        <>
          <label>
            <Label>From (old path)</Label>
            <input name="from" required placeholder="/old-page" className={input} />
          </label>
          <label>
            <Label>To</Label>
            <input name="to" required placeholder="/services/print-and-collateral" className={input} />
          </label>
          <label>
            <Label>Type</Label>
            <select name="code" defaultValue="301" className={input}>
              <option value="301">Permanent</option>
              <option value="302">Temporary</option>
            </select>
          </label>
          <button disabled={pending} className={btn("primary")}>
            {pending ? "Saving…" : "Add"}
          </button>
        </>
      )}
    </ActionForm>
  );
}

export function DeleteRedirect({ from }: { from: string }) {
  return (
    <ActionForm action={deleteRedirect}>
      {(pending) => (
        <>
          <input type="hidden" name="from" value={from} />
          <button disabled={pending} className={btn("ghost", "text-danger")}>
            Remove
          </button>
        </>
      )}
    </ActionForm>
  );
}

export function AddUserForm() {
  return (
    <ActionForm action={addUser} resetOnSuccess className="grid gap-3 md:grid-cols-2">
      {(pending) => (
        <>
          <label>
            <Label>Name</Label>
            <input name="name" required className={input} />
          </label>
          <label>
            <Label>Username</Label>
            <input name="username" required pattern="[A-Za-z0-9_.]{3,30}" autoCapitalize="none" className={input} />
          </label>
          <label>
            <Label hint="(optional)">Email</Label>
            <input name="email" type="email" className={input} />
          </label>
          <label>
            <Label>Role</Label>
            <select name="role" defaultValue="SALES" className={input}>
              <option value="SALES">Sales: leads only</option>
              <option value="EDITOR">Editor: publishing, no leads</option>
              <option value="ADMIN">Admin: everything</option>
            </select>
          </label>
          <label className="md:col-span-2">
            <Label hint="(10+ characters; they must change it at first sign-in)">Temporary password</Label>
            <input name="password" type="text" required minLength={10} autoComplete="off" className={input} />
          </label>
          <div className="md:col-span-2">
            <button disabled={pending} className={btn("primary")}>
              {pending ? "Adding…" : "Add team member"}
            </button>
          </div>
        </>
      )}
    </ActionForm>
  );
}

export function UserRow({ id, role, isSelf }: { id: string; role: string; isSelf: boolean }) {
  return (
    <div className="flex flex-wrap items-start gap-3">
      <ActionForm action={setUserRole} className="flex items-end gap-2">
        {(pending) => (
          <>
            <input type="hidden" name="id" value={id} />
            <select name="role" defaultValue={role} className={`${input} mt-0 w-auto`} aria-label="Role" disabled={isSelf}>
              <option value="SALES">Sales</option>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Admin</option>
            </select>
            {!isSelf ? (
              <button disabled={pending} className={btn("secondary")}>
                Set role
              </button>
            ) : null}
          </>
        )}
      </ActionForm>
      {!isSelf ? (
        <>
          <ActionForm action={resetUserPassword} className="flex items-end gap-2">
            {(pending) => (
              <>
                <input type="hidden" name="id" value={id} />
                <input name="password" placeholder="New temporary password" minLength={10} required autoComplete="off" className={`${input} mt-0 w-56`} aria-label="New temporary password" />
                <button disabled={pending} className={btn("secondary")}>
                  Reset password
                </button>
              </>
            )}
          </ActionForm>
          <ActionForm action={removeUser} confirmText="Remove this team member? Their leads become unassigned.">
            {(pending) => (
              <>
                <input type="hidden" name="id" value={id} />
                <button disabled={pending} className={btn("ghost", "text-danger")}>
                  Remove
                </button>
              </>
            )}
          </ActionForm>
        </>
      ) : (
        <span className="text-[0.875rem] text-gli-slate">This is you</span>
      )}
    </div>
  );
}
