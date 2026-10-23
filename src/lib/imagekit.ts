import "server-only";

const UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";
const API_URL = "https://api.imagekit.io/v1/files";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
  "image/avif": ["avif"],
};

function authHeader() {
  const key = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!key) throw new Error("IMAGEKIT_PRIVATE_KEY is not configured.");
  return "Basic " + Buffer.from(`${key}:`).toString("base64");
}

/** Cheap content sniffing so a renamed .exe can't be uploaded as image/png. */
function sniffMatches(buf: Buffer, mime: string): boolean {
  if (mime === "image/jpeg") return buf[0] === 0xff && buf[1] === 0xd8;
  if (mime === "image/png") return buf.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
  if (mime === "image/gif") return buf.subarray(0, 3).toString("ascii") === "GIF";
  if (mime === "image/webp") return buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP";
  if (mime === "image/avif") return buf.subarray(4, 12).toString("ascii").startsWith("ftyp");
  return false;
}

export interface UploadedFile {
  fileId: string;
  url: string;
  name: string;
  size: number;
  width?: number;
  height?: number;
  mime: string;
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED[file.type]) return "Only JPG, PNG, WebP, GIF or AVIF images are allowed.";
  if (file.size === 0) return "The file is empty.";
  if (file.size > MAX_UPLOAD_BYTES) return `Image is too large (max ${MAX_UPLOAD_BYTES / 1024 / 1024} MB).`;
  return null;
}

export async function uploadToImageKit(file: File, folder = "/westcamp"): Promise<UploadedFile> {
  const err = validateImageFile(file);
  if (err) throw new Error(err);

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!sniffMatches(bytes, file.type)) throw new Error("File content does not match an image type.");

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80) || "upload";
  const body = new FormData();
  body.append("file", new Blob([new Uint8Array(bytes)], { type: file.type }), safeName);
  body.append("fileName", safeName);
  body.append("folder", folder);
  body.append("useUniqueFileName", "true");

  const res = await fetch(UPLOAD_URL, { method: "POST", headers: { Authorization: authHeader() }, body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `ImageKit upload failed (${res.status}).`);
  }
  return {
    fileId: data.fileId,
    url: data.url,
    name: data.name ?? safeName,
    size: data.size ?? file.size,
    width: data.width,
    height: data.height,
    mime: file.type,
  };
}

export async function deleteFromImageKit(fileId: string): Promise<void> {
  const res = await fetch(`${API_URL}/${encodeURIComponent(fileId)}`, {
    method: "DELETE",
    headers: { Authorization: authHeader() },
  });
  // 404 = already gone, which is the outcome we want
  if (!res.ok && res.status !== 404) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || `ImageKit delete failed (${res.status}).`);
  }
}
