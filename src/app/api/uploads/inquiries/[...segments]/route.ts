import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function getUploadRootDir(): string {
  return (
    process.env.WEDDINFO_UPLOAD_DIR ||
    path.join(/* turbopackIgnore: true */ process.cwd(), "uploads", "inquiries")
  );
}

function isSafeSegment(segment: string): boolean {
  return /^[a-zA-Z0-9_.-]+$/.test(segment);
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ segments: string[] }> },
) {
  const { segments } = await context.params;
  if (!Array.isArray(segments) || segments.length === 0 || !segments.every(isSafeSegment)) {
    return NextResponse.json({ error: "Nieprawidłowa ścieżka pliku." }, { status: 400 });
  }

  const rootDir = getUploadRootDir();
  const fullPath = path.join(rootDir, ...segments);
  const normalizedRoot = path.resolve(rootDir);
  const normalizedPath = path.resolve(fullPath);

  if (!normalizedPath.startsWith(normalizedRoot)) {
    return NextResponse.json({ error: "Niedozwolona ścieżka." }, { status: 400 });
  }

  try {
    const bytes = await readFile(normalizedPath);
    const ext = path.extname(normalizedPath).toLowerCase();
    const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";
    return new NextResponse(bytes, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Plik nie istnieje." }, { status: 404 });
  }
}
