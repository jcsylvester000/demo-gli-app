"use client";

import { useState } from "react";
import { addNote, eraseLead, updateLead } from "@/app/admin/actions";
import { ActionForm } from "./action-form";
import { btn, input, Label } from "./ui";

export function LeadUpdateForm({
  id,
  status,
  lostReason,
  priority,
  followUp,
  ownerId,
  users,
}: {
  id: string;
  status: string;
  lostReason: string;
  priority: string;
  followUp: string;
  ownerId: string;
  users: { id: string; name: string }[];
}) {
  const [s, setS] = useState(status);
  return (
    <ActionForm action={updateLead} className="space-y-3">
      {(pending) => (
        <>
          <input type="hidden" name="id" value={id} />
          <label className="block">
            <Label>Status</Label>
            <select name="status" value={s} onChange={(e) => setS(e.target.value)} className={input}>
              {[
                ["new", "New"],
                ["contacted", "Contacted"],
                ["proposal_sent", "Proposal sent"],
                ["won", "Won"],
                ["lost", "Lost"],
                ["spam", "Spam"],
              ].map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          {s === "lost" ? (
            <label className="block">
              <Label>Reason lost</Label>
              <input name="lostReason" defaultValue={lostReason} maxLength={300} placeholder="e.g. Budget, timing, chose another supplier" className={input} />
            </label>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <Label>Priority</Label>
              <select name="priority" defaultValue={priority} className={input}>
                <option value="">—</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </label>
            <label className="block">
              <Label>Follow up on</Label>
              <input type="date" name="followUpAt" defaultValue={followUp} className={input} />
            </label>
          </div>
          <label className="block">
            <Label>Owner</Label>
            <select name="ownerId" defaultValue={ownerId} className={input}>
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>
          <button disabled={pending} className={btn("primary", "w-full")}>
            {pending ? "Saving…" : "Save"}
          </button>
        </>
      )}
    </ActionForm>
  );
}

export function NoteForm({ id }: { id: string }) {
  return (
    <ActionForm action={addNote} resetOnSuccess className="space-y-2">
      {(pending) => (
        <>
          <input type="hidden" name="id" value={id} />
          <label className="block">
            <Label>Add a note</Label>
            <textarea name="body" required maxLength={4000} className={`${input} min-h-24 py-2`} placeholder="Call summary, next step, decision…" />
          </label>
          <button disabled={pending} className={btn("secondary")}>
            {pending ? "Adding…" : "Add note"}
          </button>
        </>
      )}
    </ActionForm>
  );
}


export function EraseLead({ id }: { id: string }) {
  return (
    <ActionForm action={eraseLead} className="space-y-2">
      {(pending) => (
        <>
          <input type="hidden" name="id" value={id} />
          <p className="text-[0.875rem] text-gli-slate">For a data-subject request (Data Privacy Act): permanently deletes this lead, its files, notes and messages. This cannot be undone.</p>
          <label className="block">
            <Label>Type ERASE to confirm</Label>
            <input name="confirm" autoComplete="off" className={input} />
          </label>
          <button disabled={pending} className={btn("danger")}>
            {pending ? "Erasing…" : "Erase permanently"}
          </button>
        </>
      )}
    </ActionForm>
  );
}
