export interface UploadedMedia {
  id: string;
  url: string;
  name: string;
  width?: number;
  height?: number;
}

export const MAX_MB = 10;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

/** Client-side pre-check so people get instant feedback; the server validates again. */
export function precheck(file: File): string | null {
  if (!OK_TYPES.includes(file.type)) return `${file.name}: only JPG, PNG, WebP, GIF or AVIF images are allowed.`;
  if (file.size > MAX_MB * 1024 * 1024) return `${file.name}: larger than ${MAX_MB} MB.`;
  return null;
}

export async function uploadFiles(files: File[]): Promise<{ uploaded: UploadedMedia[]; errors: string[] }> {
  const errors: string[] = [];
  const ok: File[] = [];
  for (const f of files) {
    const e = precheck(f);
    if (e) errors.push(e);
    else ok.push(f);
  }
  if (!ok.length) return { uploaded: [], errors };

  const fd = new FormData();
  ok.forEach((f) => fd.append("file", f));
  try {
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      errors.push(data?.error || "Upload failed.");
      return { uploaded: [], errors };
    }
    (data.failed ?? []).forEach((f: { name: string; error: string }) => errors.push(`${f.name}: ${f.error}`));
    return { uploaded: data.files as UploadedMedia[], errors };
  } catch {
    errors.push("Network error while uploading.");
    return { uploaded: [], errors };
  }
}
