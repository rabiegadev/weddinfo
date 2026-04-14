import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MB = 1024 * 1024;
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function getUploadRootDir(): string {
  return (
    process.env.WEDDINFO_UPLOAD_DIR ||
    path.join(/* turbopackIgnore: true */ process.cwd(), "uploads", "inquiries")
  );
}

export function getUploadPublicBaseUrl(): string {
  return process.env.WEDDINFO_UPLOAD_BASE_URL || "/api/uploads/inquiries";
}

function safeExtensionFromMime(mimeType: string): string {
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";
  if (mimeType === "image/gif") return ".gif";
  return ".jpg";
}

function safeSegment(input: string): string {
  return input.replace(/[^a-zA-Z0-9_-]/g, "_");
}

export function assertAllowedImageFile(file: File, maxBytes: number): string | null {
  if (!allowedMimeTypes.has(file.type)) {
    return "Dozwolone formaty plików: JPG, PNG, WEBP, GIF.";
  }
  if (file.size <= 0) {
    return "Plik jest pusty.";
  }
  if (file.size > maxBytes) {
    return `Plik przekracza limit ${Math.floor(maxBytes / MB)} MB.`;
  }
  return null;
}

export async function storeInquiryImage(params: {
  publicId: string;
  bucket: "hero" | "inspiration";
  file: File;
}): Promise<{ relativePath: string; publicUrl: string; originalName: string }> {
  const rootDir = getUploadRootDir();
  const ext = safeExtensionFromMime(params.file.type);
  const timestamp = Date.now();
  const fileName = `${timestamp}_${randomUUID()}${ext}`;
  const relativePath = path.posix.join(
    safeSegment(params.publicId),
    params.bucket,
    fileName,
  );
  const fullPath = path.join(rootDir, relativePath);

  await mkdir(path.dirname(fullPath), { recursive: true });
  const bytes = Buffer.from(await params.file.arrayBuffer());
  await writeFile(fullPath, bytes);

  const publicBase = getUploadPublicBaseUrl().replace(/\/$/, "");
  const publicUrl = `${publicBase}/${relativePath.split(path.sep).join("/")}`;
  return { relativePath, publicUrl, originalName: params.file.name };
}
