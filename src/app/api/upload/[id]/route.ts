import { NextResponse } from "next/server";
import { getPool } from "@/lib/server/pool";
import { uploadStore } from "@/lib/server/blob-store";

export const dynamic = "force-dynamic";

/** Removes a file the visitor took out of the ticket before submitting (never a file already linked to a lead). */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9]{32}$/.test(id)) return NextResponse.json({ ok: true });
  const { rowCount } = await getPool().query(`DELETE FROM upload_session WHERE id = $1 AND status <> 'linked'`, [id]);
  if (rowCount) await (await uploadStore()).deletePrefix(`${id}/`);
  return NextResponse.json({ ok: true });
}
