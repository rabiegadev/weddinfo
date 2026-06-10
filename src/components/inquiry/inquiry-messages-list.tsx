import type { inquiryMessages } from "@/db/schema";

type MessageRow = typeof inquiryMessages.$inferSelect;

function formatDateTime(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const guestPerspective = {
  guest: "Ty",
  staff: "Weddinfo",
} as const;

const adminPerspective = {
  guest: "Klient",
  staff: "Weddinfo (Ty)",
} as const;

export function InquiryMessagesList({
  messages,
  viewer = "guest",
}: {
  messages: MessageRow[];
  viewer?: "guest" | "admin";
}) {
  const authorLabels = viewer === "admin" ? adminPerspective : guestPerspective;
  if (messages.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)]">Brak wiadomości w korespondencji.</p>
    );
  }

  return (
    <ul className="space-y-4">
      {messages.map((msg) => {
        const isStaff = msg.authorRole === "staff";
        return (
          <li
            key={msg.id}
            className={`rounded border p-4 text-sm ${
              isStaff
                ? "border-[var(--gold)]/40 bg-[var(--bg-light)]/60"
                : "border-[var(--border-light)] bg-white"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
              <span className="font-semibold uppercase tracking-[0.12em] text-[var(--text-dark)]">
                {authorLabels[msg.authorRole]}
              </span>
              <time dateTime={String(msg.createdAt)}>{formatDateTime(msg.createdAt)}</time>
            </div>
            <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[var(--text-dark)]">
              {msg.body}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
