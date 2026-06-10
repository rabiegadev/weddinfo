import type { inquiries } from "@/db/schema";

type InquiryRow = typeof inquiries.$inferSelect;

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value?.trim()) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm text-[var(--text-dark)]">{value}</dd>
    </div>
  );
}

function BoolField({ label, value, notes }: { label: string; value: boolean | null; notes?: string | null }) {
  if (value == null) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</dt>
      <dd className="mt-1 text-sm text-[var(--text-dark)]">{value ? "Tak" : "Nie"}</dd>
      {notes?.trim() ? (
        <dd className="mt-1 whitespace-pre-wrap text-sm text-[var(--text-muted)]">{notes}</dd>
      ) : null}
    </div>
  );
}

function formatDate(value: Date | string | null): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("pl-PL");
}

export function InquiryBriefSection({ inquiry }: { inquiry: InquiryRow }) {
  if (inquiry.inquiryType === "contact") return null;

  return (
    <section className="border border-[var(--border-light)] bg-[var(--bg-light)]/25 p-5 sm:p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">Brief</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Miejsce ślubu" value={inquiry.ceremonyLocation} />
        <Field label="Miejsce wesela" value={inquiry.receptionLocation} />
        <Field label="Data ślubu" value={formatDate(inquiry.weddingDate)} />
        <Field label="Szablon" value={inquiry.templateName} />
        <Field label="Harmonogram" value={inquiry.scheduleNotes} />
        <Field label="Noclegi" value={inquiry.lodgingInfo} />
        <Field label="Poprawiny" value={inquiry.afterpartyInfo} />
        <Field label="Info dla gości" value={inquiry.guestInfo} />
        <Field label="Kolorystyka" value={inquiry.colorPreferences} />
        <Field label="Klimat strony" value={inquiry.moodClimate} />
        <Field label="Motywy" value={inquiry.themesMotifs} />
        <Field label="Sugestie" value={inquiry.suggestions} />
        <Field label="Dodatkowe informacje" value={inquiry.additionalInfo} />
        <Field label="Korekty" value={inquiry.correctionRequests} />
        <BoolField label="Kod QR" value={inquiry.wantsQrCode} notes={inquiry.qrCodeNotes} />
        <BoolField label="RSVP" value={inquiry.wantsRsvp} notes={inquiry.rsvpNotes} />
        <BoolField label="Chronione hasłem" value={inquiry.wantsPasswordProtection} />
        <BoolField label="Galeria" value={inquiry.wantsGallery} />
      </dl>
    </section>
  );
}
