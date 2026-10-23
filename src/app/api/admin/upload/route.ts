import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth/dal";
import { queryOne } from "@/lib/db";
import { uploadToImageKit } from "@/lib/imagekit";
import { logActivity } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getApiUser("editor");
  if (!user) return NextResponse.json({ ok: false, error: "Not authorised." }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid upload." }, { status: 400 });
  }

  const files = form.getAll("file").filter((f): f is File => f instanceof File).slice(0, 10);
  if (!files.length) return NextResponse.json({ ok: false, error: "No file received." }, { status: 400 });

  const uploaded = [];
  const failed: { name: string; error: string }[] = [];

  for (const file of files) {
    try {
      const up = await uploadToImageKit(file);
      const row = await queryOne<{ id: string }>(
        `insert into media (file_id,url,name,size,mime,width,height,folder,uploaded_by)
         values ($1,$2,$3,$4,$5,$6,$7,'/westcamp',$8) returning id`,
        [up.fileId, up.url, up.name, up.size, up.mime, up.width ?? null, up.height ?? null, user.name]
      );
      uploaded.push({ id: row!.id, url: up.url, name: up.name, width: up.width, height: up.height });
      await logActivity(user, "upload", "media", row!.id, `Uploaded image ${up.name}`);
    } catch (err) {
      failed.push({ name: file.name, error: (err as Error).message });
    }
  }

  if (!uploaded.length) {
    return NextResponse.json({ ok: false, error: failed[0]?.error ?? "Upload failed.", failed }, { status: 400 });
  }
  return NextResponse.json({ ok: true, files: uploaded, failed });
}
