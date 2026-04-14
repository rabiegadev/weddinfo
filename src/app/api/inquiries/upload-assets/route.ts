import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { getDb, inquiries } from "@/db";
import { insertInquiryAttachment } from "@/data/inquiry-attachments";
import { assertAllowedImageFile, storeInquiryImage } from "@/lib/uploads";

const HERO_LIMIT_BYTES = 8 * 1024 * 1024;
const INSP_LIMIT_BYTES = 12 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const publicIdValue = formData.get("publicId");
  const publicId = typeof publicIdValue === "string" ? publicIdValue.trim() : "";
  if (!publicId) {
    return NextResponse.json({ ok: false, error: "Brak identyfikatora zapytania." }, { status: 400 });
  }

  const db = getDb();
  const [inquiry] = await db
    .select({
      id: inquiries.id,
      inquiryType: inquiries.inquiryType,
    })
    .from(inquiries)
    .where(and(eq(inquiries.publicId, publicId), eq(inquiries.inquiryType, "wedding_website")))
    .limit(1);

  if (!inquiry) {
    return NextResponse.json(
      { ok: false, error: "Nie znaleziono zapytania dla uploadu." },
      { status: 404 },
    );
  }

  const heroRaw = formData.get("heroPhoto");
  const heroPhoto = heroRaw instanceof File && heroRaw.size > 0 ? heroRaw : null;
  const inspirationFiles = formData
    .getAll("inspirationFiles")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)
    .slice(0, 3);

  if (!heroPhoto && inspirationFiles.length === 0) {
    return NextResponse.json({ ok: true, uploaded: 0 });
  }

  if (heroPhoto) {
    const error = assertAllowedImageFile(heroPhoto, HERO_LIMIT_BYTES);
    if (error) {
      return NextResponse.json({ ok: false, error: `Zdjęcie pary: ${error}` }, { status: 400 });
    }
  }

  for (const file of inspirationFiles) {
    const error = assertAllowedImageFile(file, INSP_LIMIT_BYTES);
    if (error) {
      return NextResponse.json({ ok: false, error: `Plik inspiracji: ${error}` }, { status: 400 });
    }
  }

  const uploadedNames: string[] = [];
  try {
    if (heroPhoto) {
      const stored = await storeInquiryImage({
        publicId,
        bucket: "hero",
        file: heroPhoto,
      });
      await insertInquiryAttachment(inquiry.id, stored.publicUrl, "Zdjęcie pary młodej");
      uploadedNames.push(stored.originalName);
      await db
        .update(inquiries)
        .set({
          heroPhotoName: stored.originalName,
          updatedAt: new Date(),
        })
        .where(eq(inquiries.id, inquiry.id));
    }

    if (inspirationFiles.length > 0) {
      const names: string[] = [];
      for (const [idx, file] of inspirationFiles.entries()) {
        const stored = await storeInquiryImage({
          publicId,
          bucket: "inspiration",
          file,
        });
        await insertInquiryAttachment(
          inquiry.id,
          stored.publicUrl,
          `Inspiracja ${idx + 1}`,
        );
        names.push(stored.originalName);
        uploadedNames.push(stored.originalName);
      }
      await db
        .update(inquiries)
        .set({
          inspirationFilesNames: names,
          updatedAt: new Date(),
        })
        .where(eq(inquiries.id, inquiry.id));
    }
  } catch (error) {
    console.error("[upload-assets] upload failed", error);
    return NextResponse.json(
      { ok: false, error: "Nie udało się zapisać plików na serwerze plików." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    uploaded: uploadedNames.length,
    files: uploadedNames,
  });
}
