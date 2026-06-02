import { getInquiryTabLabel } from "@/config/inquiry-tabs";
import type { inquiries } from "@/db/schema";

type InquiryRow = typeof inquiries.$inferSelect;

const statusLabels = {
  new: "Otrzymaliśmy zgłoszenie",
  in_progress: "W trakcie realizacji",
  closed: "Zamknięte",
} as const;

function formatDate(value: Date | string | null): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("pl-PL");
}

export function InquiryDetails({ inquiry }: { inquiry: InquiryRow }) {
  const isContact = inquiry.inquiryType === "contact";
  const title = isContact
    ? inquiry.contactFullName ?? "Zgłoszenie kontaktowe"
    : `${inquiry.brideName ?? "—"} & ${inquiry.groomName ?? "—"}`;

  return (
    <div className="space-y-8">
      <header className="border-b border-[var(--border-light)] pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
          {getInquiryTabLabel(inquiry.inquiryType)}
        </p>
        <h1 className="font-wedinfo-serif mt-2 text-2xl text-[var(--text-dark)] sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Numer: <strong>#{inquiry.publicId}</strong> · Status:{" "}
          <strong>{statusLabels[inquiry.status]}</strong>
        </p>
      </header>

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">E-mail</dt>
          <dd className="mt-1 text-[var(--text-dark)]">{inquiry.clientEmail}</dd>
        </div>
        {inquiry.clientPhone ? (
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Telefon</dt>
            <dd className="mt-1 text-[var(--text-dark)]">{inquiry.clientPhone}</dd>
          </div>
        ) : null}
        {!isContact && inquiry.weddingDate ? (
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Data ślubu</dt>
            <dd className="mt-1 text-[var(--text-dark)]">{formatDate(inquiry.weddingDate)}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Złożono</dt>
          <dd className="mt-1 text-[var(--text-dark)]">{formatDate(inquiry.createdAt)}</dd>
        </div>
      </dl>

      {isContact && inquiry.contactMessage ? (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">Wiadomość</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-dark)]">
            {inquiry.contactMessage}
          </p>
        </section>
      ) : null}

      {!isContact ? (
        <section className="rounded border border-[var(--border-light)] bg-[var(--bg-light)]/50 p-5 text-sm text-[var(--text-muted)]">
          <p>
            Szczegóły briefu są w naszym systemie. W kolejnych etapach pojawi się tu korespondencja i aktualizacje
            statusu.
          </p>
        </section>
      ) : null}
    </div>
  );
}
