import type { ReactNode } from "react";
import { getInquiryTabLabel } from "@/config/inquiry-tabs";
import { InquiryAttachmentsList } from "@/components/inquiry/inquiry-attachments-list";
import { InquiryBriefSection } from "@/components/inquiry/inquiry-brief-section";
import { InquiryMessagesList } from "@/components/inquiry/inquiry-messages-list";
import type { inquiryAttachments, inquiryMessages, inquiries, InquiryStatus } from "@/db/schema";
import { getInquiryDisplayName } from "@/lib/inquiry-display";
import { inquiryStatusLabels } from "@/lib/inquiry-status";
import { InquiryGuestPanel } from "./inquiry-guest-panel";

type InquiryRow = typeof inquiries.$inferSelect;
type AttachmentRow = typeof inquiryAttachments.$inferSelect;
type MessageRow = typeof inquiryMessages.$inferSelect;

function formatDate(value: Date | string | null): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("pl-PL");
}

const statusTone: Record<InquiryStatus, string> = {
  new: "border-[var(--gold)]/40 bg-[var(--bg-light)] text-[var(--text-dark)]",
  in_progress: "border-blue-200 bg-blue-50/80 text-blue-950",
  closed: "border-[var(--border-light)] bg-[var(--bg-light)]/60 text-[var(--text-muted)]",
  cancelled_by_client: "border-red-200 bg-red-50/80 text-red-950",
};

function DetailCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-[var(--border-light)] bg-[var(--bg-light)]/25 p-5 sm:p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

type InquiryDetailsProps = {
  inquiry: InquiryRow;
  attachments: AttachmentRow[];
  messages: MessageRow[];
};

export function InquiryDetails({ inquiry, attachments, messages }: InquiryDetailsProps) {
  const isContact = inquiry.inquiryType === "contact";
  const title = getInquiryDisplayName(inquiry);

  return (
    <div className="space-y-8">
      <header className="border-b border-[var(--border-light)] pb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
          {getInquiryTabLabel(inquiry.inquiryType)}
        </p>
        <h1 className="font-wedinfo-serif mt-3 text-2xl text-[var(--text-dark)] sm:text-3xl">{title}</h1>
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          Numer zgłoszenia: <strong className="text-[var(--text-dark)]">#{inquiry.publicId}</strong>
        </p>
        <p
          className={`mx-auto mt-4 inline-block border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${statusTone[inquiry.status]}`}
        >
          {inquiryStatusLabels[inquiry.status]}
        </p>
      </header>

      <dl className="grid gap-4 rounded border border-[var(--border-light)] bg-white p-5 text-sm sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
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

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-8">
        <div className="space-y-8">
          {isContact && inquiry.contactMessage ? (
            <DetailCard title="Wiadomość">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-dark)]">
                {inquiry.contactMessage}
              </p>
            </DetailCard>
          ) : null}

          {!isContact ? <InquiryBriefSection inquiry={inquiry} /> : null}

          <DetailCard title="Załączniki">
            <InquiryAttachmentsList publicId={inquiry.publicId} attachments={attachments} />
          </DetailCard>
        </div>

        <div className="space-y-8">
          <DetailCard title="Korespondencja">
            <InquiryMessagesList messages={messages} />
          </DetailCard>

          <InquiryGuestPanel publicId={inquiry.publicId} status={inquiry.status} />
        </div>
      </div>
    </div>
  );
}
