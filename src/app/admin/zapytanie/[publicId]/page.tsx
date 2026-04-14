import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listAttachmentsByInquiryId } from "@/data/inquiry-attachments";
import { listMessagesByInquiryId } from "@/data/inquiry-messages";
import { getInquiryAdminByPublicId } from "@/data/inquiries";
import { listRsvpByInquiryId } from "@/data/rsvp-responses";
import { requireAdminSession } from "@/lib/admin-auth";
import { getSiteBaseUrl } from "@/lib/site-url";
import { AdminInquiryPanel } from "./admin-panel";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ publicId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publicId } = await params;
  return { title: `Zapytanie ${publicId} — Weddinfo` };
}

export default async function AdminInquiryPage({ params }: Props) {
  await requireAdminSession();
  const { publicId } = await params;
  const inquiry = await getInquiryAdminByPublicId(publicId);
  if (!inquiry) notFound();

  const [messages, attachments, rsvps, base] = await Promise.all([
    listMessagesByInquiryId(inquiry.id),
    listAttachmentsByInquiryId(inquiry.id),
    listRsvpByInquiryId(inquiry.id),
    getSiteBaseUrl(),
  ]);

  const guestPageUrl = `${base}/zapytanie/${encodeURIComponent(publicId)}`;
  const names =
    inquiry.inquiryType === "contact"
      ? (inquiry.contactFullName ?? `${inquiry.partner1FirstName} ${inquiry.partner1LastName}`)
      : `${inquiry.partner1FirstName} ${inquiry.partner1LastName} & ${inquiry.partner2FirstName} ${inquiry.partner2LastName}`;
  const ceremonyTypeLabel =
    inquiry.ceremonyType === "church"
      ? "Ślub kościelny"
      : inquiry.ceremonyType === "civil"
        ? "Ślub cywilny w urzędzie"
        : inquiry.ceremonyType === "outdoor"
          ? "Ślub plenerowy"
          : inquiry.ceremonyType === "other"
            ? "Inne"
            : null;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-10 sm:pt-[calc(6rem+env(safe-area-inset-top,0px))]">
      <header className="mb-8 flex flex-col gap-2 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <p className="font-mono text-sm text-rose-800 dark:text-rose-200">
          #{inquiry.publicId}
        </p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {names}
        </h1>
        <dl className="mt-2 grid gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          <div>
            <span className="text-zinc-500">E-mail pary: </span>
            <a
              href={`mailto:${inquiry.clientEmail}`}
              className="text-rose-800 hover:underline dark:text-rose-200"
            >
              {inquiry.clientEmail}
            </a>
          </div>
          {inquiry.clientPhone ? (
            <div>
              <span className="text-zinc-500">Telefon: </span>
              {inquiry.clientPhone}
            </div>
          ) : null}
        </dl>
        <p className="mt-2 text-sm">
          <Link
            href="/admin/logout"
            className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Wyloguj
          </Link>
        </p>
      </header>

      <section className="mb-8 space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <p>
          <span className="text-zinc-500">Typ formularza: </span>
          <strong>{inquiry.inquiryType === "contact" ? "Formularz kontaktowy" : "Formularz wizytówki weselnej"}</strong>
        </p>
        {inquiry.contactMessage ? (
          <p className="whitespace-pre-wrap">
            <span className="text-zinc-500">Treść wiadomości: </span>
            {inquiry.contactMessage}
          </p>
        ) : null}
        {inquiry.locationName ? (
          <p>
            <span className="text-zinc-500">Lokalizacja wesela: </span>
            {inquiry.locationName}
          </p>
        ) : null}
        {inquiry.weddingVenueName || inquiry.weddingVenueCity || inquiry.weddingVenueStreet ? (
          <p className="whitespace-pre-wrap">
            <span className="text-zinc-500">Dokładna lokalizacja wesela: </span>
            {[inquiry.weddingVenueName, inquiry.weddingVenueStreet, inquiry.weddingVenuePostalCode, inquiry.weddingVenueCity]
              .filter(Boolean)
              .join(", ")}
          </p>
        ) : null}
        {inquiry.weddingVenueMapLink ? (
          <p>
            <span className="text-zinc-500">Mapa wesela: </span>
            <a
              href={inquiry.weddingVenueMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-800 underline-offset-2 hover:underline dark:text-rose-200"
            >
              {inquiry.weddingVenueMapLink}
            </a>
          </p>
        ) : null}
        {ceremonyTypeLabel ? (
          <p>
            <span className="text-zinc-500">Typ ceremonii: </span>
            {ceremonyTypeLabel}
          </p>
        ) : null}
        {inquiry.ceremonyName || inquiry.ceremonyCity || inquiry.ceremonyStreet ? (
          <p className="whitespace-pre-wrap">
            <span className="text-zinc-500">Lokalizacja ceremonii: </span>
            {[inquiry.ceremonyName, inquiry.ceremonyStreet, inquiry.ceremonyPostalCode, inquiry.ceremonyCity]
              .filter(Boolean)
              .join(", ")}
          </p>
        ) : null}
        {inquiry.ceremonyMapLink ? (
          <p>
            <span className="text-zinc-500">Mapa ceremonii: </span>
            <a
              href={inquiry.ceremonyMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-800 underline-offset-2 hover:underline dark:text-rose-200"
            >
              {inquiry.ceremonyMapLink}
            </a>
          </p>
        ) : null}
        {inquiry.ceremonyOtherDetails ? (
          <p className="whitespace-pre-wrap">
            <span className="text-zinc-500">Szczegóły ceremonii (inne): </span>
            {inquiry.ceremonyOtherDetails}
          </p>
        ) : null}
        {inquiry.travelDetails ? (
          <p className="whitespace-pre-wrap">
            <span className="text-zinc-500">Szczegóły dojazdu: </span>
            {inquiry.travelDetails}
          </p>
        ) : null}
        {inquiry.schedule.length > 0 ? (
          <div>
            <p className="text-zinc-500">Harmonogram:</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {inquiry.schedule.map((item, idx) => (
                <li key={`${item.time}-${item.action}-${idx}`}>
                  <span className="font-mono">{item.time}</span> — {item.action}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {inquiry.schedulePreferences ? (
          <p className="whitespace-pre-wrap">
            <span className="text-zinc-500">Opis harmonogramu: </span>
            {inquiry.schedulePreferences}
          </p>
        ) : null}
        {inquiry.scheduleSuggestions.length > 0 ? (
          <p>
            <span className="text-zinc-500">Sugestie harmonogramu: </span>
            {inquiry.scheduleSuggestions.join(", ")}
          </p>
        ) : null}
        {inquiry.overnightTransportNote ? (
          <p className="whitespace-pre-wrap">
            <span className="text-zinc-500">Nocleg i transport: </span>
            {inquiry.overnightTransportNote}
          </p>
        ) : null}
        {inquiry.afterpartyNote ? (
          <p className="whitespace-pre-wrap">
            <span className="text-zinc-500">Poprawiny: </span>
            {inquiry.afterpartyNote}
          </p>
        ) : null}
        {inquiry.guestInfoNote ? (
          <p className="whitespace-pre-wrap">
            <span className="text-zinc-500">Informacje dla gości: </span>
            {inquiry.guestInfoNote}
          </p>
        ) : null}
        {inquiry.rsvpEnabled ? (
          <p>
            <span className="text-zinc-500">RSVP online: </span>
            Tak
            {inquiry.rsvpDeadline ? ` (termin: ${inquiry.rsvpDeadline})` : ""}
          </p>
        ) : (
          <p>
            <span className="text-zinc-500">RSVP online: </span>
            Nie
          </p>
        )}
        {inquiry.rsvpNotes ? (
          <p className="whitespace-pre-wrap">
            <span className="text-zinc-500">Uwagi RSVP: </span>
            {inquiry.rsvpNotes}
          </p>
        ) : null}
        {inquiry.templateName ? (
          <p>
            <span className="text-zinc-500">Szablon: </span>
            {inquiry.templateName}
          </p>
        ) : null}
        {inquiry.heroPhotoName ? (
          <p>
            <span className="text-zinc-500">Zdjęcie pary (nazwa pliku): </span>
            {inquiry.heroPhotoName}
          </p>
        ) : null}
        {inquiry.inspirationFilesNames.length > 0 ? (
          <p>
            <span className="text-zinc-500">Pliki inspiracji: </span>
            {inquiry.inspirationFilesNames.join(", ")}
          </p>
        ) : null}
        {inquiry.extraNotes ? (
          <p className="whitespace-pre-wrap">
            <span className="text-zinc-500">Dodatkowe uwagi: </span>
            {inquiry.extraNotes}
          </p>
        ) : null}
      </section>

      <AdminInquiryPanel
        publicId={publicId}
        currentStatus={inquiry.status}
        messages={messages}
        attachments={attachments}
        rsvps={rsvps}
        guestPageUrl={guestPageUrl}
      />
    </div>
  );
}
