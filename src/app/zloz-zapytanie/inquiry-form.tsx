"use client";

import { useState } from "react";
import Link from "next/link";
import { submitInquiry, type SubmitInquiryResult } from "./actions";

type ScheduleRow = { time: string; action: string };

const emptyScheduleRow = (): ScheduleRow => ({ time: "", action: "" });

/** min. 16px — bez zoom iOS w polach; min. wysokość pod palec */
const fieldClass =
  "min-h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-3 text-base leading-normal text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

const textareaClass = `${fieldClass} min-h-[5.25rem] resize-y sm:min-h-[5.5rem]`;

export function InquiryForm() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SubmitInquiryResult | null>(null);

  const [schedule, setSchedule] = useState<ScheduleRow[]>([emptyScheduleRow()]);

  async function handleSubmit(formData: FormData) {
    const sched = schedule
      .filter((r) => r.time.trim() && r.action.trim())
      .map((r) => ({ time: r.time.trim(), action: r.action.trim() }));

    const raw = {
      partner1FirstName: formData.get("p1f"),
      partner1LastName: formData.get("p1l"),
      partner2FirstName: formData.get("p2f"),
      partner2LastName: formData.get("p2l"),
      weddingDate: formData.get("weddingDate") || undefined,
      locationName: formData.get("locationName"),
      locationLat: formData.get("locationLat") || undefined,
      locationLng: formData.get("locationLng") || undefined,
      colorPalette: formData.get("colorPalette") || undefined,
      themes: formData.get("themes") || undefined,
      clientEmail: formData.get("clientEmail"),
      clientPhone: formData.get("clientPhone") || undefined,
      schedule: sched,
      accommodationNote: formData.get("accommodationNote") || undefined,
      rsvpEnabled: formData.get("rsvpEnabled") === "on",
      rsvpDeadline: formData.get("rsvpDeadline") || undefined,
      extraNotes: formData.get("extraNotes") || undefined,
    };

    setPending(true);
    try {
      const res = await submitInquiry(raw);
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
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-8">
      {result && !result.ok ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
          role="alert"
        >
          {result.error}
        </div>
      ) : null}

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
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Nazwisko</span>
            <input
              required
              name="p1l"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Imię (druga osoba)</span>
            <input
              required
              name="p2f"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Nazwisko</span>
            <input
              required
              name="p2l"
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
            <span className="text-zinc-600 dark:text-zinc-400">Lokalizacja / sala</span>
            <input
              required
              name="locationName"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Szer. geogr. (opcjonalnie)</span>
            <input
              name="locationLat"
              placeholder="np. 52.2297"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Dł. geogr.</span>
            <input
              name="locationLng"
              placeholder="np. 21.0122"
              className={fieldClass}
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
            className={textareaClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Motywy przewodnie</span>
          <textarea
            name="themes"
            rows={2}
            className={textareaClass}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">E-mail</span>
            <input
              required
              type="email"
              name="clientEmail"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Telefon</span>
            <input
              type="tel"
              name="clientPhone"
              className={fieldClass}
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
          Harmonogram (godzina — akcja)
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
                  placeholder="Ślub / powitanie"
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
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
          Goście i RSVP
        </h2>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Nocleg / informacje dla gości</span>
          <textarea
            name="accommodationNote"
            rows={3}
            className={textareaClass}
          />
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-base text-zinc-800 touch-manipulation dark:text-zinc-200 sm:text-sm">
          <input
            type="checkbox"
            name="rsvpEnabled"
            className="size-5 shrink-0 rounded border-zinc-300 text-rose-800 dark:border-zinc-600"
          />
          Chcę sekcji RSVP na stronie
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Termin odpowiedzi RSVP</span>
          <input
            name="rsvpDeadline"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Inne uwagi</span>
          <textarea
            name="extraNotes"
            rows={4}
            className={textareaClass}
          />
        </label>
      </section>

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
