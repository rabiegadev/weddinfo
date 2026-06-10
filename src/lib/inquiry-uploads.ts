import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AttachmentKind } from "@/db/schema";

export const MAX_INQUIRY_FILES = 2;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export type SavedAttachment = {
  kind: AttachmentKind;
  storedName: string;
  originalName: string;
  mimeType: string;
  byteSize: number;
};

function storageRoot(): string {
  const custom = process.env.WEDDINFO_UPLOAD_DIR?.trim();
  if (custom) return custom;
  // Statyczna ścieżka względem projektu (storage/inquiries)
  return path.join(/* turbopackIgnore: true */ process.cwd(), "storage", "inquiries");
}

export function validateUploadFile(file: File): string | null {
  if (!file.size) return "Pusty plik.";
  if (file.size > MAX_FILE_BYTES) return `Plik „${file.name}” przekracza 5 MB.`;
  if (!ALLOWED_MIME.has(file.type)) {
    return `Plik „${file.name}” ma niedozwolony format (dozwolone: JPG, PNG, WebP).`;
  }
  return null;
}

export async function saveInquiryFiles(
  publicId: string,
  files: { file: File; kind: AttachmentKind }[],
): Promise<SavedAttachment[]> {
  if (files.length > MAX_INQUIRY_FILES) {
    throw new Error(`Można przesłać maksymalnie ${MAX_INQUIRY_FILES} pliki.`);
  }

  const dir = path.join(storageRoot(), publicId);
  await mkdir(dir, { recursive: true });

  const saved: SavedAttachment[] = [];
  for (let i = 0; i < files.length; i += 1) {
    const { file, kind } = files[i]!;
    const err = validateUploadFile(file);
    if (err) throw new Error(err);

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const storedName = `${kind}-${Date.now()}-${i + 1}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, storedName), buffer);
    saved.push({
      kind,
      storedName,
      originalName: file.name.slice(0, 255),
      mimeType: file.type,
      byteSize: file.size,
    });
  }

  return saved;
}

export function getInquiryAttachmentPath(publicId: string, storedName: string): string {
  const safeName = path.basename(storedName);
  return path.join(storageRoot(), publicId, safeName);
}

export async function readInquiryAttachment(
  publicId: string,
  storedName: string,
): Promise<Buffer | null> {
  const filePath = getInquiryAttachmentPath(publicId, storedName);
  try {
    await access(filePath);
    return readFile(filePath);
  } catch {
    return null;
  }
}
