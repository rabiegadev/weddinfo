"use client";

import { useState, useTransition } from "react";
import { submitInquiryForm, type SubmitInquiryResult } from "./actions";
import { CaptchaField } from "./captcha-field";
import {
  FileUploadField,
  FormSectionDivider,
  HoneypotField,
  YesNoField,
  hintClass,
  inputClass,
  labelClass,
  textareaClass,
} from "./form-ui";
import { WeddingBasicsFields } from "./wedding-basics-fields";
import { InquirySuccess } from "./inquiry-success";

export function IndividualInquiryForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<SubmitInquiryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (result?.ok) {
    return <InquirySuccess result={result} onReset={() => setResult(null)} />;
  }

  return (
    <form
      encType="multipart/form-data"
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const res = await submitInquiryForm(fd);
          if (!res.ok) {
            setError(res.error);
            return;
          }
          setResult(res);
        });
      }}
    >
      <input type="hidden" name="inquiryType" value="individual" />
      <HoneypotField />

      <div>
        <h3 className="font-wedinfo-serif text-xl font-medium text-[var(--text-dark)]">Dane podstawowe</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Informacje o wydarzeniu i gościach.</p>
        <div className="mt-6">
          <WeddingBasicsFields />
        </div>
      </div>

      <FormSectionDivider
        title="Wizualia i funkcje"
        subtitle="Kolory, klimat strony, inspiracje oraz opcje dodatkowe."
      />

      <div className="space-y-6">
        <div>
          <label htmlFor="clientEmail" className={labelClass}>
            E-mail kontaktowy
          </label>
          <input id="clientEmail" name="clientEmail" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="clientPhone" className={labelClass}>
            Telefon <span className="font-normal normal-case tracking-normal text-[var(--text-muted)]">(opcjonalnie)</span>
          </label>
          <input id="clientPhone" name="clientPhone" type="tel" autoComplete="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="colorPreferences" className={labelClass}>
            Kolorystyka
          </label>
          <textarea id="colorPreferences" name="colorPreferences" rows={2} className={textareaClass} />
        </div>
        <div>
          <label htmlFor="moodClimate" className={labelClass}>
            Klimat strony
          </label>
          <textarea id="moodClimate" name="moodClimate" rows={2} className={textareaClass} placeholder="Elegancko, boho, nowocześnie…" />
        </div>
        <div>
          <label htmlFor="themesMotifs" className={labelClass}>
            Motywy
          </label>
          <textarea id="themesMotifs" name="themesMotifs" rows={2} className={textareaClass} />
        </div>
        <div>
          <label htmlFor="suggestions" className={labelClass}>
            Sugestie i inspiracje opisem
          </label>
          <textarea id="suggestions" name="suggestions" rows={3} className={textareaClass} />
        </div>

        <YesNoField name="wantsQrCode" label="Czy ma być kod QR?" notesName="qrCodeNotes" notesLabel="Uwagi do kodu QR" />
        <YesNoField name="wantsRsvp" label="Czy ma być potwierdzenie obecności (RSVP)?" notesName="rsvpNotes" notesLabel="Uwagi do RSVP" />
        <label className="flex cursor-pointer items-start gap-3 rounded border border-[var(--border-light)] bg-[var(--bg-light)]/40 p-4">
          <input type="checkbox" name="wantsPasswordProtection" value="true" className="mt-1 size-4 accent-[var(--gold)]" />
          <span className="text-sm text-[var(--text-dark)]">Czy strona ma być chroniona hasłem?</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded border border-[var(--border-light)] bg-[var(--bg-light)]/40 p-4">
          <input type="checkbox" name="wantsGallery" value="true" className="mt-1 size-4 accent-[var(--gold)]" />
          <span className="text-sm text-[var(--text-dark)]">Czy ma być galeria zdjęć?</span>
        </label>

        <FileUploadField
          name="inspirationFiles"
          label="Zdjęcia inspiracji"
          hint="Maks. 2 pliki łącznie (JPG, PNG, WebP, do 5 MB). Możesz też dodać zdjęcia pary poniżej."
          multiple
        />
        <FileUploadField
          name="couplePhotoFiles"
          label="Zdjęcia pary do grafiki"
          hint="Pliki wykorzystamy przy projekcie strony (w ramach limitu 2 plików na cały formularz)."
          multiple
        />
        <p className={hintClass}>Łącznie możesz przesłać maksymalnie 2 pliki graficzne.</p>
      </div>

      <CaptchaField />
      {error ? (
        <p className="rounded border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto sm:min-w-[240px]">
        {pending ? "Wysyłanie…" : "Wyślij zapytanie Individual"}
      </button>
    </form>
  );
}
