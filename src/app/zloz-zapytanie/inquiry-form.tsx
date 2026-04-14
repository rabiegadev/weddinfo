"use client";

import { useState } from "react";
import Link from "next/link";
import { weddingTemplateOptions } from "@/data/wedding-templates";
import { submitInquiry, type SubmitInquiryResult } from "./actions";

type InquiryMode = "wedding_website" | "contact";
type ScheduleRow = { time: string; action: string };

const emptyScheduleRow = (): ScheduleRow => ({ time: "", action: "" });

const scheduleSuggestionOptions = [
  "animowany",
  "z tłem",
  "bez tła",
  "z grafikami",
  "ze strzałką przewijania",
  "z efektem premium",
] as const;

/** min. 16px — bez zoom iOS w polach; min. wysokość pod palec */
const fieldClass =
  "min-h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-3 text-base leading-normal text-zinc-900 placeholder:text-zinc-400/70 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500";

const textareaClass = `${fieldClass} min-h-[5.25rem] resize-y sm:min-h-[5.5rem]`;

export function InquiryForm() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SubmitInquiryResult | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [mode, setMode] = useState<InquiryMode>("wedding_website");
  const [ceremonyType, setCeremonyType] = useState<"church" | "civil" | "outdoor" | "other">("church");
  const [rsvpOnlineEnabled, setRsvpOnlineEnabled] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleRow[]>([emptyScheduleRow()]);
  const [schedulePreferences, setSchedulePreferences] = useState("");
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  function appendSuggestion(value: string) {
    setSelectedSuggestions((prev) => {
      if (prev.includes(value)) return prev;
      return [...prev, value];
    });
    setSchedulePreferences((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return value;
      if (trimmed.includes(value)) return prev;
      return `${prev}${prev.endsWith(", ") || prev.endsWith(",") ? " " : ", "}${value}`;
    });
  }

  async function handleSubmit(formData: FormData) {
    setUploadNotice(null);
    const getOptionalText = (key: string): string | undefined => {
      const value = formData.get(key);
      if (typeof value !== "string") return undefined;
      const trimmed = value.trim();
      return trimmed ? trimmed : undefined;
    };
    const getRequiredText = (key: string): string => getOptionalText(key) ?? "";

    const heroPhotoFile = formData.get("heroPhoto");
    const heroPhoto =
      heroPhotoFile instanceof File && heroPhotoFile.size > 0 ? heroPhotoFile : null;
    const inspirationFiles = formData
      .getAll("inspirationFiles")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)
      .slice(0, 3);

    const inquiryTypeRaw = formData.get("inquiryType");
    const inquiryType: InquiryMode =
      inquiryTypeRaw === "contact" ? "contact" : "wedding_website";
    const rsvpEnabled = inquiryType === "wedding_website" && formData.get("rsvpEnabled") === "on";
    const scheduleRows =
      inquiryType === "wedding_website"
        ? schedule
            .filter((row) => row.time.trim() && row.action.trim())
            .map((row) => ({ time: row.time.trim(), action: row.action.trim() }))
        : [];

    const raw = {
      inquiryType,
      partner1FirstName: getRequiredText("p1f"),
      partner1LastName: getRequiredText("p1l"),
      partner2FirstName: getRequiredText("p2f"),
      partner2LastName: getRequiredText("p2l"),
      contactFullName: getOptionalText("contactFullName"),
      contactMessage: getOptionalText("contactMessage"),
      weddingDate: getOptionalText("weddingDate"),
      locationName: getOptionalText("locationName"),
      weddingVenueName: getOptionalText("weddingVenueName"),
      weddingVenuePostalCode: getOptionalText("weddingVenuePostalCode"),
      weddingVenueCity: getOptionalText("weddingVenueCity"),
      weddingVenueStreet: getOptionalText("weddingVenueStreet"),
      weddingVenueMapLink: getOptionalText("weddingVenueMapLink"),
      ceremonyType: getOptionalText("ceremonyType"),
      ceremonyName: getOptionalText("ceremonyName"),
      ceremonyPostalCode: getOptionalText("ceremonyPostalCode"),
      ceremonyCity: getOptionalText("ceremonyCity"),
      ceremonyStreet: getOptionalText("ceremonyStreet"),
      ceremonyMapLink: getOptionalText("ceremonyMapLink"),
      ceremonyOtherDetails: getOptionalText("ceremonyOtherDetails"),
      locationLat: getOptionalText("locationLat"),
      locationLng: getOptionalText("locationLng"),
      travelDetails: getOptionalText("travelDetails"),
      colorPalette: getOptionalText("colorPalette"),
      themes: getOptionalText("themes"),
      templateName: getOptionalText("templateName"),
      heroPhotoName: undefined,
      inspirationFilesNames: [],
      clientEmail: getRequiredText("clientEmail"),
      clientPhone: getOptionalText("clientPhone"),
      schedule: scheduleRows,
      schedulePreferences: getOptionalText("schedulePreferences"),
      scheduleSuggestions: selectedSuggestions,
      accommodationNote: getOptionalText("accommodationNote"),
      overnightTransportNote: getOptionalText("overnightTransportNote"),
      afterpartyNote: getOptionalText("afterpartyNote"),
      guestInfoNote: getOptionalText("guestInfoNote"),
      rsvpEnabled,
      rsvpDeadline: rsvpEnabled ? getOptionalText("rsvpDeadline") : undefined,
      rsvpNotes: rsvpEnabled ? getOptionalText("rsvpNotes") : undefined,
      extraNotes: getOptionalText("extraNotes"),
    };

    setPending(true);
    try {
      const res = await submitInquiry(raw);
      if (res.ok && (heroPhoto || inspirationFiles.length > 0) && inquiryType === "wedding_website") {
        const uploadFormData = new FormData();
        uploadFormData.set("publicId", res.publicId);
        if (heroPhoto) {
          uploadFormData.set("heroPhoto", heroPhoto);
        }
        for (const file of inspirationFiles) {
          uploadFormData.append("inspirationFiles", file);
        }
        try {
          const uploadRes = await fetch("/api/inquiries/upload-assets", {
            method: "POST",
            body: uploadFormData,
          });
          if (!uploadRes.ok) {
            const payload = (await uploadRes.json().catch(() => null)) as { error?: string } | null;
            setUploadNotice(payload?.error || "Zapytanie zapisane, ale upload plików nie powiódł się.");
          }
        } catch {
          setUploadNotice("Zapytanie zapisane, ale upload plików nie powiódł się.");
        }
      }
      setResult(res);
    } finally {
      setPending(false);
    }
  }

  if (result?.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100">
        <h2 className="text-lg font-semibold">Zapytanie zapisane</h2>
        <p className="mt-2 text-sm leading-relaxed">
          Numer referencyjny:{" "}
          <span className="font-mono font-medium">#{result.publicId}</span>
        </p>
        {result.mailSent ? (
          <p className="mt-2 text-sm leading-relaxed">
            Wysłaliśmy wiadomość na podany adres e-mail z linkiem do podglądu i
            hasłem dostępu. Sprawdź też folder spam.
          </p>
        ) : (
          <div className="mt-3 space-y-2 rounded-lg border border-amber-300/80 bg-amber-50/90 p-3 text-sm text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-100">
            <p>
              <strong>Nie udało się wysłać e-maila</strong> (brak lub błędna
              konfiguracja wysyłki na serwerze). Zapisz poniższe hasło — jest
              potrzebne do wejścia na stronę zapytania.
            </p>
            {result.guestPassword ? (
              <p className="font-mono text-base font-semibold tracking-wide">
                Hasło: {result.guestPassword}
              </p>
            ) : null}
          </div>
        )}
        {result.mailSent && result.guestPassword ? (
          <p className="mt-3 rounded-lg bg-white/60 p-3 text-xs dark:bg-black/20">
            <strong>Tryb dev:</strong> hasło dostępu:{" "}
            <span className="font-mono">{result.guestPassword}</span>
          </p>
        ) : null}
        <p className="mt-4 text-sm">
          <Link
            href={`/zapytanie/${result.publicId}`}
            className="font-medium text-rose-800 underline decoration-rose-300 underline-offset-2 hover:text-rose-950 dark:text-rose-200 dark:hover:text-rose-50"
          >
            Przejdź do podglądu zapytania
          </Link>
        </p>
        {uploadNotice ? (
          <p className="mt-3 rounded-lg border border-amber-300/80 bg-amber-50/80 p-3 text-xs text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-100">
            {uploadNotice}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-8">
      <section className="space-y-3">
        <div className="inline-flex w-full rounded-full border border-zinc-200 bg-zinc-100/70 p-1 dark:border-zinc-700 dark:bg-zinc-900/80">
          <button
            type="button"
            onClick={() => setMode("wedding_website")}
            className={`min-h-11 flex-1 rounded-full px-4 text-sm font-medium transition ${
              mode === "wedding_website"
                ? "bg-zinc-900/12 text-zinc-900 dark:bg-white/15 dark:text-zinc-50"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            Formularz wizytówki weselnej
          </button>
          <button
            type="button"
            onClick={() => setMode("contact")}
            className={`min-h-11 flex-1 rounded-full px-4 text-sm font-medium transition ${
              mode === "contact"
                ? "bg-zinc-900/12 text-zinc-900 dark:bg-white/15 dark:text-zinc-50"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            Formularz kontaktowy
          </button>
        </div>
        <input type="hidden" name="inquiryType" value={mode} />
        {mode === "contact" ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Formularz służy do szybkiego kontaktu, zadania pytania i opisania czego potrzebujesz.
          </p>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Uzupełnij dane, aby przygotować kompletną wizytówkę weselną pod wdrożenie.
          </p>
        )}
      </section>

      {result && !result.ok ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
          role="alert"
        >
          {result.error}
        </div>
      ) : null}

      {mode === "contact" ? (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
            Kontakt
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="text-zinc-600 dark:text-zinc-400">Imię i nazwisko</span>
              <input
                required
                name="contactFullName"
                placeholder="np. Paulina Kowalska"
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Telefon</span>
              <input
                type="tel"
                name="clientPhone"
                placeholder="+48 123 345 567"
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">E-mail</span>
              <input
                required
                type="email"
                name="clientEmail"
                placeholder="np. para@example.com"
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="text-zinc-600 dark:text-zinc-400">Treść wiadomości</span>
              <textarea
                required
                name="contactMessage"
                rows={6}
                placeholder="Napisz czego potrzebujesz i o co chcesz zapytać."
                className={textareaClass}
              />
            </label>
          </div>
        </section>
      ) : (
        <>
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
          Para młoda
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Imię (pierwsza osoba)</span>
            <input
              required
              name="p1f"
              placeholder="np. Paulina"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Nazwisko</span>
            <input
              required
              name="p1l"
              placeholder="np. Kowalska"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Imię (druga osoba)</span>
            <input
              required
              name="p2f"
              placeholder="np. Bartosz"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Nazwisko</span>
            <input
              required
              name="p2l"
              placeholder="np. Nowak"
              className={fieldClass}
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
          Wesele
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="text-zinc-600 dark:text-zinc-400">Data</span>
            <input
              type="date"
              name="weddingDate"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="text-zinc-600 dark:text-zinc-400">Lokalizacja wesela</span>
            <input
              required
              name="locationName"
              placeholder="np. Hotel Texicana, Kałsko"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Nazwa sali weselnej</span>
            <input name="weddingVenueName" placeholder="np. Sala Balowa Magnolia" className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Kod pocztowy</span>
            <input name="weddingVenuePostalCode" placeholder="np. 66-100" className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Miasto</span>
            <input name="weddingVenueCity" placeholder="np. Zielona Góra" className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Ulica i numer</span>
            <input name="weddingVenueStreet" placeholder="np. Leśna 12" className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="text-zinc-600 dark:text-zinc-400">Link do pinezki na mapie</span>
            <input name="weddingVenueMapLink" placeholder="https://maps.google.com/..." className={fieldClass} />
          </label>
        </div>

        <div className="space-y-4 rounded-xl border border-zinc-200/80 bg-zinc-50/55 p-4 dark:border-zinc-800 dark:bg-zinc-900/45">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Ślub odbędzie się w</span>
            <select
              name="ceremonyType"
              className={fieldClass}
              value={ceremonyType}
              onChange={(e) => setCeremonyType(e.target.value as "church" | "civil" | "outdoor" | "other")}
            >
              <option value="church">Ślub kościelny</option>
              <option value="civil">Ślub cywilny w urzędzie</option>
              <option value="outdoor">Ślub plenerowy</option>
              <option value="other">Inne</option>
            </select>
          </label>

          {ceremonyType === "other" ? (
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Szczegóły (inne)</span>
              <textarea
                name="ceremonyOtherDetails"
                rows={5}
                placeholder="Opisz miejsce i formę ceremonii."
                className={textareaClass}
              />
            </label>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                <span className="text-zinc-600 dark:text-zinc-400">
                  {ceremonyType === "church"
                    ? "Nazwa kościoła"
                    : ceremonyType === "civil"
                      ? "Nazwa urzędu"
                      : "Nazwa miejsca plenerowego"}
                </span>
                <input name="ceremonyName" placeholder="np. Kościół św. Jana" className={fieldClass} />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Kod pocztowy</span>
                <input name="ceremonyPostalCode" placeholder="np. 66-100" className={fieldClass} />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Miasto</span>
                <input name="ceremonyCity" placeholder="np. Zielona Góra" className={fieldClass} />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Ulica i numer</span>
                <input name="ceremonyStreet" placeholder="np. Plac Kościelny 1" className={fieldClass} />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Link do pinezki / wizytówki</span>
                <input name="ceremonyMapLink" placeholder="https://maps.google.com/..." className={fieldClass} />
              </label>
            </div>
          )}

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Szczegóły dojazdu (opcjonalnie)</span>
            <textarea
              name="travelDetails"
              rows={3}
              placeholder="np. parking, autokar, wskazówki dojazdu."
              className={textareaClass}
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
          Styl i kontakt
        </h2>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Kolorystyka</span>
          <textarea
            name="colorPalette"
            rows={2}
            placeholder="np. beże, złoto, delikatny róż"
            className={textareaClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Motywy przewodnie</span>
          <textarea
            name="themes"
            rows={2}
            placeholder="np. elegancki minimalizm, kwiaty, subtelne animacje"
            className={textareaClass}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Nazwa szablonu</span>
            <select name="templateName" className={fieldClass} defaultValue="">
              <option value="">Wybierz szablon</option>
              {weddingTemplateOptions.map((templateName) => (
                <option key={templateName} value={templateName}>
                  {templateName}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Telefon</span>
            <input type="tel" name="clientPhone" placeholder="+48 123 345 567" className={fieldClass} />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Zdjęcie pary młodej</span>
            <input
              type="file"
              name="heroPhoto"
              accept="image/*"
              className="min-h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:file:bg-zinc-800 dark:file:text-zinc-200"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Inspiracje (max 3 pliki)</span>
            <input
              type="file"
              name="inspirationFiles"
              multiple
              accept="image/*"
              className="min-h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:file:bg-zinc-800 dark:file:text-zinc-200"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">E-mail</span>
            <input
              required
              type="email"
              name="clientEmail"
              placeholder="np. para@example.com"
              className={fieldClass}
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
          Harmonogram
        </h2>
        <div className="space-y-3">
          {schedule.map((row, i) => (
            <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <label className="flex flex-1 flex-col gap-1 text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Godzina</span>
                <input
                  value={row.time}
                  onChange={(e) => {
                    const next = [...schedule];
                    next[i] = { ...next[i], time: e.target.value };
                    setSchedule(next);
                  }}
                  placeholder="np. 15:00"
                  className={fieldClass}
                />
              </label>
              <label className="flex-[2] flex flex-col gap-1 text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Akcja</span>
                <input
                  value={row.action}
                  onChange={(e) => {
                    const next = [...schedule];
                    next[i] = { ...next[i], action: e.target.value };
                    setSchedule(next);
                  }}
                  placeholder="np. Ceremonia / życzenia / pierwszy taniec"
                  className={fieldClass}
                />
              </label>
              {schedule.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setSchedule(schedule.filter((_, j) => j !== i))}
                  className="touch-manipulation min-h-11 rounded-lg px-4 py-2 text-base text-red-700 hover:bg-red-50 active:bg-red-100 dark:text-red-300 dark:hover:bg-red-950/40 sm:text-sm [-webkit-tap-highlight-color:transparent]"
                >
                  Usuń
                </button>
              ) : null}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSchedule([...schedule, emptyScheduleRow()])}
            className="touch-manipulation inline-flex min-h-11 items-center text-base font-medium text-rose-800 hover:underline active:opacity-80 dark:text-rose-200 sm:text-sm [-webkit-tap-highlight-color:transparent]"
          >
            + dodaj punkt
          </button>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Opis preferowanego harmonogramu</span>
          <textarea
            name="schedulePreferences"
            rows={5}
            value={schedulePreferences}
            onChange={(e) => setSchedulePreferences(e.target.value)}
            placeholder="Opisz, jak ma wyglądać sekcja harmonogramu na stronie."
            className={textareaClass}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {scheduleSuggestionOptions.map((option) => {
            const isSelected = selectedSuggestions.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => appendSuggestion(option)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  isSelected
                    ? "border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-500/40 dark:bg-rose-950/40 dark:text-rose-200"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
          Nocleg, poprawiny i informacje dla gości
        </h2>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Nocleg i transport</span>
          <textarea
            name="overnightTransportNote"
            rows={3}
            placeholder="np. nocleg zapewniony, transport autokarem."
            className={textareaClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Poprawiny</span>
          <textarea
            name="afterpartyNote"
            rows={3}
            placeholder="np. poprawiny następnego dnia od 13:00."
            className={textareaClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Dodatkowe informacje dla gości</span>
          <textarea
            name="guestInfoNote"
            rows={4}
            placeholder="np. dress code, prezenty, opieka nad dziećmi."
            className={textareaClass}
          />
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-base text-zinc-800 touch-manipulation dark:text-zinc-200 sm:text-sm">
          <input
            type="checkbox"
            name="rsvpEnabled"
            checked={rsvpOnlineEnabled}
            onChange={(e) => setRsvpOnlineEnabled(e.target.checked)}
            className="size-5 shrink-0 rounded border-zinc-300 text-rose-800 dark:border-zinc-600"
          />
          Potwierdzenia obecności online
        </label>
        {rsvpOnlineEnabled ? (
          <div className="space-y-4 rounded-xl border border-zinc-200/80 bg-zinc-50/55 p-4 dark:border-zinc-800 dark:bg-zinc-900/45">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Termin odpowiedzi</span>
              <input
                name="rsvpDeadline"
                placeholder="np. do 1 czerwca 2026"
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Dodatkowe uwagi</span>
              <textarea
                name="rsvpNotes"
                rows={4}
                placeholder="np. pytanie o nocleg, opcje menu, alergie."
                className={textareaClass}
              />
            </label>
          </div>
        ) : null}
      </section>
      </>
      )}

      {mode === "wedding_website" ? (
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Inne uwagi</span>
          <textarea
            name="extraNotes"
            rows={4}
            placeholder="Dodatkowe informacje, które powinniśmy uwzględnić."
            className={textareaClass}
          />
        </label>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="submit"
          disabled={pending}
          className="touch-manipulation min-h-12 w-full rounded-full bg-rose-800 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-rose-900 disabled:opacity-60 active:bg-rose-950 dark:bg-rose-700 dark:hover:bg-rose-600 sm:w-auto sm:text-sm [-webkit-tap-highlight-color:transparent]"
        >
          {pending ? "Wysyłanie…" : "Wyślij zapytanie"}
        </button>
      </div>

      <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
        Wysyłając formularz akceptujesz kontakt zwrotny w sprawie wizytówki weselnej.
        Szczegóły przetwarzania danych dodamy w polityce prywatności.
      </p>
    </form>
  );
}
