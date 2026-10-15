import { NextResponse } from "next/server";
import { CHUNK_BYTES, extOf, signatureMatches } from "@/lib/uploads";
import { getPool } from "@/lib/server/pool";
import { partKey, uploadStore } from "@/lib/server/blob-store";

export const dynamic = "force-dynamic";

type Session = { filename: string; size_bytes: number; part_count: number; parts_done: number[]; status: string };

/** Receives one ≤ 4 MB part of an upload. Part 0 is checked against the file's real type (FR-061). */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string; part: string }> }) {
  const { id, part } = await params;
  const n = Number(part);
  if (!/^[a-f0-9]{32}$/.test(id) || !Number.isInteger(n) || n < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const pool = getPool();
  const { rows } = await pool.query<Session>(
    `SELECT filename, size_bytes, part_count, parts_done, status FROM upload_session WHERE id = $1 AND created_at > now() - interval '1 day'`,
    [id],
  );
  const s = rows[0];
  if (!s || s.status !== "uploading" || n >= s.part_count) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const expected = n < s.part_count - 1 ? CHUNK_BYTES : s.size_bytes - CHUNK_BYTES * (s.part_count - 1);
  const declared = Number(req.headers.get("content-length") || expected);
  if (declared > CHUNK_BYTES) return NextResponse.json({ error: "Part too large" }, { status: 413 });
  const data = await req.arrayBuffer();
  if (data.byteLength !== expected) return NextResponse.json({ error: "The upload was interrupted. Please try again." }, { status: 400 });

  const store = await uploadStore();
  if (n === 0 && !signatureMatches(extOf(s.filename), new Uint8Array(data.slice(0, 16)))) {
    await pool.query(`UPDATE upload_session SET status = 'rejected' WHERE id = $1`, [id]);
    await store.deletePrefix(`${id}/`);
    return NextResponse.json({ error: "That file doesn't look like the type its name says. Please check the file and try again." }, { status: 415 });
  }
  await store.set(partKey(id, n), data);
  const { rows: upd } = await pool.query<{ done: number; part_count: number }>(
    `UPDATE upload_session
        SET parts_done = (SELECT array_agg(DISTINCT x ORDER BY x) FROM unnest(array_append(parts_done, $2::int)) AS x)
      WHERE id = $1
      RETURNING cardinality(parts_done) AS done, part_count`,
    [id, n],
  );
  const complete = upd[0].done === upd[0].part_count;
  if (complete) await pool.query(`UPDATE upload_session SET status = 'ready' WHERE id = $1 AND status = 'uploading'`, [id]);
  return NextResponse.json({ ok: true, complete }, { headers: { "Cache-Control": "no-store" } });
}
