import type { inquiryAttachments } from "@/db/schema";

type AttachmentRow = typeof inquiryAttachments.$inferSelect;

const kindLabels = {
  inspiration: "Inspiracja",
  couple_photo: "Zdjęcie pary",
  contact_file: "Załącznik",
} as const;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function InquiryAttachmentsList({
  publicId,
  attachments,
}: {
  publicId: string;
  attachments: AttachmentRow[];
}) {
  if (attachments.length === 0) {
    return <p className="text-sm text-[var(--text-muted)]">Brak załączników.</p>;
  }

  return (
    <ul className="space-y-3">
      {attachments.map((file) => {
        const href = `/api/zapytanie/${encodeURIComponent(publicId)}/zalacznik/${file.id}`;
        const isImage = file.mimeType.startsWith("image/");
        return (
          <li
            key={file.id}
            className="flex flex-col gap-3 rounded border border-[var(--border-light)] bg-white p-4 sm:flex-row sm:items-center"
          >
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={href}
                alt={file.originalName}
                className="h-24 w-24 shrink-0 rounded object-cover"
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--text-dark)]">{file.originalName}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {kindLabels[file.attachmentKind]} · {formatBytes(file.byteSize)}
              </p>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--gold)] hover:opacity-80"
              >
                Otwórz plik →
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
