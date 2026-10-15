/**
 * Job-ticket upload rules (BRD FR-061, Document 4 §10), shared by the browser and the server.
 * PDF, AI, PSD, JPG, PNG, ZIP · up to 25 MB each · max 5 files · sent in 4 MB parts.
 */
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_FILES = 5;
export const CHUNK_BYTES = 4 * 1024 * 1024;

export const ALLOWED_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  ai: "application/postscript",
  psd: "image/vnd.adobe.photoshop",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  zip: "application/zip",
};
export const ACCEPT_ATTR = ".pdf,.ai,.psd,.jpg,.jpeg,.png,.zip";

export const extOf = (name: string) => name.toLowerCase().split(".").pop() ?? "";
export const partsFor = (size: number) => Math.max(1, Math.ceil(size / CHUNK_BYTES));

/** Checks the first bytes of a file against its extension, so a renamed .exe cannot pass as a PDF. */
export function signatureMatches(ext: string, head: Uint8Array): boolean {
  const starts = (...b: number[]) => b.every((v, i) => head[i] === v);
  const ascii = (s: string) => starts(...[...s].map((c) => c.charCodeAt(0)));
  switch (ext) {
    case "pdf":
      return ascii("%PDF");
    case "ai": // Illustrator files are PDF-compatible, or PostScript for very old versions
      return ascii("%PDF") || ascii("%!PS");
    case "psd":
      return ascii("8BPS");
    case "jpg":
    case "jpeg":
      return starts(0xff, 0xd8, 0xff);
    case "png":
      return starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
    case "zip":
      return starts(0x50, 0x4b, 0x03, 0x04) || starts(0x50, 0x4b, 0x05, 0x06);
    default:
      return false;
  }
}

/** Client- and server-side check before an upload starts. Messages are Document 4's wording. */
export function checkFile(name: string, size: number): string | null {
  if (!ALLOWED_TYPES[extOf(name)]) return "That file type isn't accepted. Please send PDF, AI, PSD, JPG, PNG or ZIP.";
  if (size > MAX_FILE_BYTES) return "That file is over 25 MB. Try a smaller file or send a link in the notes.";
  if (size <= 0) return "That file is empty.";
  return null;
}
