import type { InquiryAttachmentRow } from "@/data/inquiry-attachments";
import type { InquiryMessageRow } from "@/data/inquiry-messages";
import type { SafeInquiry } from "@/data/inquiries";
import type { RsvpResponseRow } from "@/data/rsvp-responses";
import { GuestCorrespondenceSection } from "./guest-correspondence";

function row(label: string, value: string | null | undefined) {
  if (value == null || value === "") return null;
  return (
    <div className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
        {label}
      </dt>
      <dd className="text-sm text-zinc-900 dark:text-zinc-100">{value}</dd>
    </div>
  );
}

export function InquiryDetails({
  inquiry,
  messages,
  attachments,
  rsvps,
}: {
  inquiry: SafeInquiry;
  messages: InquiryMessageRow[];
  attachments: InquiryAttachmentRow[];
  rsvps: RsvpResponseRow[];
}) {
  const names = `${inquiry.partner1FirstName} ${inquiry.partner1LastName} & ${inquiry.partner2FirstName} ${inquiry.partner2LastName}`;

  return (
    <div className="space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <header className="flex flex-col gap-2 border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <p className="font-mono text-sm text-rose-800 dark:text-rose-200">
          #{inquiry.publicId}
        </p>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {names}
        </h1>
        <p className="text-sm text-zinc-500">
          Status:{" "}
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            {inquiry.status}
          </span>
        </p>
      </header>

      <dl className="space-y-3">
        {row("Data wesela", inquiry.weddingDate ?? undefined)}
        {row("Miejsce", inquiry.locationName ?? undefined)}
        {row(
          "Współrzędne",
          inquiry.locationLat && inquiry.locationLng
            ? `${inquiry.locationLat}, ${inquiry.locationLng}`
            : undefined,
        )}
        {row("Kolorystyka", inquiry.colorPalette ?? undefined)}
        {row("Motywy", inquiry.themes ?? undefined)}
        {row("E-mail", inquiry.clientEmail)}
        {row("Telefon", inquiry.clientPhone ?? undefined)}
        {row("Nocleg / goście", inquiry.accommodationNote ?? undefined)}
        {row(
          "RSVP",
          inquiry.rsvpEnabled
            ? `Tak${inquiry.rsvpDeadline ? ` — termin: ${inquiry.rsvpDeadline}` : ""}`
            : "Nie",
        )}
        {row("Uwagi", inquiry.extraNotes ?? undefined)}
      </dl>

      {inquiry.schedule.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
            Harmonogram
          </h2>
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {inquiry.schedule.map((s, i) => (
              <li key={i} className="flex gap-4 py-2 text-sm">
                <span className="w-16 shrink-0 font-mono text-zinc-600 dark:text-zinc-400">
                  {s.time}
                </span>
                <span className="text-zinc-900 dark:text-zinc-100">{s.action}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <GuestCorrespondenceSection
        publicId={inquiry.publicId}
        messages={messages}
        attachments={attachments}
        rsvpEnabled={inquiry.rsvpEnabled}
        inquiryStatus={inquiry.status}
        rsvps={rsvps}
      />
    </div>
  );
}
