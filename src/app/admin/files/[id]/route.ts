import { audit, requireAdminAction } from "@/lib/server/admin/guard";
import { getPool } from "@/lib/server/pool";
import { partKey, uploadStore } from "@/lib/server/blob-store";

export const dynamic = "force-dynamic";

/** Private download of a job-ticket file (BRD FR-061): signed-in Sales/Admin only; parts are streamed in order. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  let me;
  try {
    me = await requireAdminAction("leads");
  } catch {
    return new Response("Not found", { status: 404 });
  }
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) return new Response("Not found", { status: 404 });
  const { rows } = await getPool().query<{ blob_key: string; filename: string; size_bytes: number; part_count: number; lead_id: string }>(
    `SELECT blob_key, filename, size_bytes, part_count, lead_id FROM lead_file WHERE id = $1`,
    [id],
  );
  const f = rows[0];
  if (!f) return new Response("Not found", { status: 404 });
  const store = await uploadStore();
  let n = 0;
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (n >= f.part_count) return controller.close();
      const part = await store.get(partKey(f.blob_key, n++));
      if (!part) return controller.error(new Error("missing part"));
      controller.enqueue(new Uint8Array(part));
    },
  });
  await audit(me.id, "file.downloaded", `lead:${f.lead_id}/file:${id}`);
  const ascii = f.filename.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");
  return new Response(stream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(f.size_bytes),
      "Content-Disposition": `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(f.filename)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
