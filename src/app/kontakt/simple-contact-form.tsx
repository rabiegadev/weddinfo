"use client";

import { useState, useTransition } from "react";
import { submitInquiryForm, type SubmitInquiryResult } from "./actions";
import { CaptchaField } from "./captcha-field";
import { FileUploadField, HoneypotField, hintClass, inputClass, labelClass, textareaClass } from "./form-ui";
import { InquirySuccess } from "./inquiry-success";

export function SimpleContactForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<SubmitInquiryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (result?.ok) {
    return <InquirySuccess result={result} onReset={() => setResult(null)} />;
  }

  return (
    <form
      encType="multipart/form-data"
      className="space-y-6"
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
      <input type="hidden" name="inquiryType" value="contact" />
      <HoneypotField />

      <div>
        <label htmlFor="contactFullName" className={labelClass}>
          Imię i nazwisko
        </label>
        <input id="contactFullName" name="contactFullName" type="text" required autoComplete="name" className={inputClass} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contactEmail" className={labelClass}>
            E-mail
          </label>
          <input id="contactEmail" name="clientEmail" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="contactPhone" className={labelClass}>
            Telefon <span className="font-normal normal-case tracking-normal text-[var(--text-muted)]">(opcjonalnie)</span>
          </label>
          <input id="contactPhone" name="clientPhone" type="tel" autoComplete="tel" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="contactMessage" className={labelClass}>
          Zapytanie
        </label>
        <textarea id="contactMessage" name="contactMessage" rows={6} required className={textareaClass} />
      </div>

      <FileUploadField
        name="contactFiles"
        label="Załącznik graficzny"
        hint="Opcjonalnie — maks. 2 pliki (JPG, PNG, WebP, do 5 MB łącznie)."
        multiple
      />
      <p className={hintClass}>Do wiadomości możesz dołączyć maksymalnie 2 grafiki.</p>

      <CaptchaField />
      {error ? (
        <p className="rounded border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto sm:min-w-[220px]">
        {pending ? "Wysyłanie…" : "Wyślij wiadomość"}
      </button>
    </form>
  );
}
