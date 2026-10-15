import "server-only";
import { mkdir, readFile, rm, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

/**
 * Private file storage for job-ticket uploads (BRD FR-061).
 * - On Netlify: Netlify Blobs store "quote-uploads" (never public; read only through the admin).
 * - Locally (npm run dev): files under ./.data/uploads (gitignored), so the form works without Netlify.
 * Keys: `<uploadId>/<partNo>`; a file is stored as up to 8 parts of ≤ 4 MB and streamed back in order.
 */
type Store = {
  set(key: string, data: ArrayBuffer): Promise<void>;
  get(key: string): Promise<ArrayBuffer | null>;
  deletePrefix(prefix: string): Promise<void>;
};

const onNetlify = () => Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT || process.env.NETLIFY_LOCAL);

async function netlifyStore(): Promise<Store> {
  const { getStore } = await import("@netlify/blobs");
  const s = getStore({ name: "quote-uploads", consistency: "strong" });
  return {
    set: async (k, d) => {
      await s.set(k, d);
    },
    get: async (k) => (await s.get(k, { type: "arrayBuffer" })) ?? null,
    deletePrefix: async (prefix) => {
      const { blobs } = await s.list({ prefix });
      await Promise.all(blobs.map((b) => s.delete(b.key)));
    },
  };
}

function fileStore(): Store {
  const root = path.join(process.cwd(), ".data", "uploads");
  const safe = (k: string) => {
    if (!/^[a-f0-9]{32}\/\d{4}$/.test(k) && !/^[a-f0-9]{32}\/?$/.test(k)) throw new Error("bad key");
    return path.join(root, k);
  };
  return {
    set: async (k, d) => {
      const p = safe(k);
      await mkdir(path.dirname(p), { recursive: true });
      await writeFile(p, Buffer.from(d));
    },
    get: async (k) => {
      try {
        const b = await readFile(safe(k));
        return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
      } catch {
        return null;
      }
    },
    deletePrefix: async (prefix) => {
      const dir = safe(prefix.replace(/\/$/, ""));
      await rm(dir, { recursive: true, force: true });
      await readdir(root).catch(() => null);
    },
  };
}

export async function uploadStore(): Promise<Store> {
  return onNetlify() ? netlifyStore() : fileStore();
}

export const partKey = (uploadId: string, n: number) => `${uploadId}/${String(n).padStart(4, "0")}`;
