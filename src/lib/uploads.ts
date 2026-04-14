import { randomUUID } from "node:crypto";
import path from "node:path";

const MB = 1024 * 1024;
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function getUploadPublicBaseUrl(): string {
  const raw = process.env.FILES_PUBLIC_BASE_URL?.trim();
  if (!raw) {
    throw new Error("FILES_PUBLIC_BASE_URL is not set");
  }
  return raw.replace(/\/$/, "");
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

function getFilesUploadEndpoint(): { endpoint: string; token: string } {
  const endpoint = process.env.FILES_UPLOAD_ENDPOINT?.trim();
  const token = process.env.FILES_UPLOAD_TOKEN?.trim();
  if (!endpoint || !token) {
    throw new Error("Missing files server config (FILES_UPLOAD_ENDPOINT, FILES_UPLOAD_TOKEN).");
  }
  return { endpoint, token };
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
  const ext = safeExtensionFromMime(params.file.type);
  const timestamp = Date.now();
  const fileName = `${timestamp}_${randomUUID()}${ext}`;
  const relativePath = path.posix.join(
    safeSegment(params.publicId),
    params.bucket,
    fileName,
  );
  const { endpoint, token } = getFilesUploadEndpoint();
  const uploadFormData = new FormData();
  uploadFormData.set("path", relativePath);
  uploadFormData.set("file", params.file);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: uploadFormData,
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Upload server error: HTTP ${response.status}`);
  }

  const payload = (await response.json().catch(() => null)) as
    | { ok?: boolean; url?: string; path?: string }
    | null;
  if (!payload?.ok) {
    throw new Error("Upload server returned invalid response.");
  }

  const publicBase = getUploadPublicBaseUrl();
  const uploadedPath = payload.path?.trim() || relativePath;
  const publicUrl =
    payload.url?.trim() ||
    `${publicBase}/${uploadedPath.split(path.sep).join("/")}`;
  return { relativePath, publicUrl, originalName: params.file.name };
}
