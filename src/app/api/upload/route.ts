import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ALLOWED_TYPES, CHUNK_BYTES, checkFile, extOf, partsFor } from "@/lib/uploads";
import { getPool, hasDatabase } from "@/lib/server/pool";
import { ipHash } from "@/lib/server/request";

export const dynamic = "force-dynamic";

const body = z.object({ filename: z.string().trim().min(1).max(180), size: z.number().int().positive() });

/** Starts a private upload (FR-061). Returns an unguessable id; the browser then PUTs the parts. */
export async function POST(req: Request) {
  if (!hasDatabase()) return NextResponse.json({ error: "Uploads are not available yet." }, { status: 503 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
  const filename = parsed.data.filename.replace(/[\\/\u0000-\u001f]/g, "_");
  const problem = checkFile(filename, parsed.data.size);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const pool = getPool();
  const ip = await ipHash();
  if (ip) {
    const { rows } = await pool.query<{ n: number }>(`SELECT count(*)::int AS n FROM upload_session WHERE ip_hash = $1 AND created_at > now() - interval '1 hour'`, [ip]);
    if (rows[0].n >= 25) return NextResponse.json({ error: "Too many uploads from this connection. Please try again later." }, { status: 429 });
  }
  const id = randomBytes(16).toString("hex");
  const parts = partsFor(parsed.data.size);
  await pool.query(`INSERT INTO upload_session (id, filename, mime, size_bytes, part_count, ip_hash) VALUES ($1, $2, $3, $4, $5, $6)`, [
    id,
    filename,
    ALLOWED_TYPES[extOf(filename)],
    parsed.data.size,
    parts,
    ip,
  ]);
  return NextResponse.json({ id, parts, chunkBytes: CHUNK_BYTES }, { headers: { "Cache-Control": "no-store" } });
}
